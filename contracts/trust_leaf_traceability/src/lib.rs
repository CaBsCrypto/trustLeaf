#![no_std]

mod batch;
mod errors;
mod events;
mod storage;

use soroban_sdk::{contract, contractimpl, Address, BytesN, Env, Symbol};

use batch::{BatchStatus, CannabisBatch};
use errors::ContractError;
use events::PlantEvent;
use storage::{StorageKey, TTL_BUMP_TARGET, TTL_BUMP_THRESHOLD};

// ─── RBAC cross-contract interface ───────────────────────────────────────────
// We call `has_role` on the RBAC contract to authorise privileged operations.
soroban_sdk::contractclient!(RbacClient, "trust-leaf-rbac");

/// Minimal interface for cross-contract RBAC calls.
pub trait RbacInterface {
    fn has_role(env: &Env, rbac_id: &Address, account: &Address, role: &Symbol) -> bool;
}

fn rbac_has_role(env: &Env, rbac_id: &Address, account: &Address, role: &Symbol) -> bool {
    let client = RbacClient::new(env, rbac_id);
    client.has_role(account, role)
}

/// Assert that `caller` has `role` in the RBAC contract, calling require_auth first.
fn require_role(
    env: &Env,
    rbac_id: &Address,
    caller: &Address,
    role: &Symbol,
) -> Result<(), ContractError> {
    caller.require_auth();
    if !rbac_has_role(env, rbac_id, caller, role) {
        return Err(ContractError::Unauthorized);
    }
    Ok(())
}

// ─── Contract ─────────────────────────────────────────────────────────────────

#[contract]
pub struct TrustLeafTraceability;

#[contractimpl]
impl TrustLeafTraceability {
    // ─── Initialization ────────────────────────────────────────────────

    /// Initialize the traceability contract, linking it to the RBAC contract.
    ///
    /// # Arguments
    /// * `rbac_contract` — Deployed address of `trust_leaf_rbac`
    pub fn initialize(env: Env, rbac_contract: Address) -> Result<(), ContractError> {
        if env.storage().instance().has(&StorageKey::Initialized) {
            return Err(ContractError::AlreadyInitialized);
        }
        env.storage()
            .instance()
            .set(&StorageKey::RbacContract, &rbac_contract);
        env.storage()
            .instance()
            .set(&StorageKey::Initialized, &true);
        env.storage()
            .instance()
            .extend_ttl(TTL_BUMP_THRESHOLD, TTL_BUMP_TARGET);

        env.events().publish(
            (Symbol::new(&env, "TrcInit"),),
            (rbac_contract,),
        );
        Ok(())
    }

    // ─── Batch CRUD ────────────────────────────────────────────────────

    /// Create a new cannabis batch. Caller must have the GROWER role.
    ///
    /// # Arguments
    /// * `caller`        — Grower's address (will be require_auth'd)
    /// * `batch_id`      — Unique ID (SHA-256 of grower+ts+nonce, computed off-chain)
    /// * `metadata_hash` — SHA-256 of the Firestore metadata document
    /// * `strain`        — Short strain identifier symbol
    pub fn create_batch(
        env: Env,
        caller: Address,
        batch_id: BytesN<32>,
        metadata_hash: BytesN<32>,
        strain: Symbol,
    ) -> Result<(), ContractError> {
        let rbac = Self::get_rbac(&env)?;
        require_role(&env, &rbac, &caller, &Symbol::new(&env, "GROWER"))?;

        // Ensure batch ID is unique
        let key = StorageKey::Batch(batch_id.clone());
        if env.storage().persistent().has(&key) {
            return Err(ContractError::BatchAlreadyExists);
        }

        let zero_hash = BytesN::from_array(&env, &[0u8; 32]);

        let batch = CannabisBatch {
            batch_id: batch_id.clone(),
            grower: caller.clone(),
            metadata_hash,
            status: BatchStatus::Growing,
            created_at: env.ledger().timestamp(),
            strain,
            lab_cert_hash: zero_hash,
        };

        env.storage().persistent().set(&key, &batch);
        env.storage()
            .persistent()
            .extend_ttl(&key, TTL_BUMP_THRESHOLD, TTL_BUMP_TARGET);

        // Initialise event counter for this batch
        let counter_key = StorageKey::BatchEventCount(batch_id.clone());
        env.storage().persistent().set(&counter_key, &0u32);
        env.storage()
            .persistent()
            .extend_ttl(&counter_key, TTL_BUMP_THRESHOLD, TTL_BUMP_TARGET);

        // Emit for indexer
        env.events().publish(
            (Symbol::new(&env, "BatchCreated"), batch_id.clone()),
            (caller, strain),
        );

        Ok(())
    }

    /// Update the lifecycle status of a batch.
    /// - GROWER can move Growing → Harvested
    /// - LAB can move Harvested → LabTested
    /// - ADMIN / DISPENSARY can move LabTested → Approved, Approved → Dispensed
    /// - Any authorised role can Recall
    ///
    /// # Arguments
    /// * `caller`        — Address performing the update
    /// * `batch_id`      — Target batch
    /// * `new_status`    — Target lifecycle stage
    /// * `lab_cert_hash` — Required when new_status = LabTested; ignored otherwise
    pub fn update_batch_status(
        env: Env,
        caller: Address,
        batch_id: BytesN<32>,
        new_status: BatchStatus,
        lab_cert_hash: BytesN<32>,
    ) -> Result<(), ContractError> {
        let rbac = Self::get_rbac(&env)?;
        caller.require_auth();

        // At least one valid role must be held
        let has_any_role = rbac_has_role(&env, &rbac, &caller, &Symbol::new(&env, "GROWER"))
            || rbac_has_role(&env, &rbac, &caller, &Symbol::new(&env, "LAB"))
            || rbac_has_role(&env, &rbac, &caller, &Symbol::new(&env, "DISPENSARY"))
            || rbac_has_role(&env, &rbac, &caller, &Symbol::new(&env, "ADMIN"));

        if !has_any_role {
            return Err(ContractError::Unauthorized);
        }

        let key = StorageKey::Batch(batch_id.clone());
        let mut batch: CannabisBatch = env
            .storage()
            .persistent()
            .get(&key)
            .ok_or(ContractError::BatchNotFound)?;

        if !batch.status.can_transition_to(&new_status) {
            return Err(ContractError::InvalidStatusTransition);
        }

        // Attach lab cert hash when transitioning to LabTested
        if new_status == BatchStatus::LabTested {
            batch.lab_cert_hash = lab_cert_hash;
        }

        batch.status = new_status.clone();
        env.storage().persistent().set(&key, &batch);
        env.storage()
            .persistent()
            .extend_ttl(&key, TTL_BUMP_THRESHOLD, TTL_BUMP_TARGET);

        env.events().publish(
            (Symbol::new(&env, "StatusUpdated"), batch_id.clone()),
            (caller, new_status),
        );

        Ok(())
    }

    // ─── Plant Events ──────────────────────────────────────────────────

    /// Record a granular plant care or logistics event for a batch.
    /// Caller must hold one of: GROWER, LAB, DISPENSARY, ADMIN.
    ///
    /// # Arguments
    /// * `caller`      — Address recording the event
    /// * `batch_id`    — Target batch
    /// * `event_type`  — Short category symbol (e.g. "WATERING")
    /// * `data_hash`   — SHA-256 of the detailed event data in Firestore
    pub fn record_event(
        env: Env,
        caller: Address,
        batch_id: BytesN<32>,
        event_type: Symbol,
        data_hash: BytesN<32>,
    ) -> Result<(), ContractError> {
        let rbac = Self::get_rbac(&env)?;
        caller.require_auth();

        let has_any_role = rbac_has_role(&env, &rbac, &caller, &Symbol::new(&env, "GROWER"))
            || rbac_has_role(&env, &rbac, &caller, &Symbol::new(&env, "LAB"))
            || rbac_has_role(&env, &rbac, &caller, &Symbol::new(&env, "DISPENSARY"))
            || rbac_has_role(&env, &rbac, &caller, &Symbol::new(&env, "ADMIN"));

        if !has_any_role {
            return Err(ContractError::Unauthorized);
        }

        // Batch must exist
        if !env
            .storage()
            .persistent()
            .has(&StorageKey::Batch(batch_id.clone()))
        {
            return Err(ContractError::BatchNotFound);
        }

        // Read + increment event counter
        let counter_key = StorageKey::BatchEventCount(batch_id.clone());
        let seq: u32 = env
            .storage()
            .persistent()
            .get(&counter_key)
            .unwrap_or(0u32);
        let next_seq = seq.checked_add(1).ok_or(ContractError::CounterOverflow)?;

        let plant_event = PlantEvent {
            batch_id: batch_id.clone(),
            event_type: event_type.clone(),
            data_hash: data_hash.clone(),
            recorded_by: caller.clone(),
            timestamp: env.ledger().timestamp(),
            seq,
        };

        // Store under a composite key — NOT a Vec to avoid memory limits
        let event_key = StorageKey::BatchEvent(batch_id.clone(), seq);
        env.storage().persistent().set(&event_key, &plant_event);
        env.storage()
            .persistent()
            .extend_ttl(&event_key, TTL_BUMP_THRESHOLD, TTL_BUMP_TARGET);

        // Update counter
        env.storage().persistent().set(&counter_key, &next_seq);
        env.storage()
            .persistent()
            .extend_ttl(&counter_key, TTL_BUMP_THRESHOLD, TTL_BUMP_TARGET);

        // Emit for Mercury/Zephyr indexer
        env.events().publish(
            (Symbol::new(&env, "EventRecorded"), batch_id.clone()),
            (event_type, data_hash, caller, seq),
        );

        Ok(())
    }

    // ─── TTL maintenance ───────────────────────────────────────────────

    /// Renew the TTL of a batch and its event counter.
    /// Should be called periodically by the frontend for active batches.
    pub fn touch_batch(env: Env, batch_id: BytesN<32>) -> Result<(), ContractError> {
        let key = StorageKey::Batch(batch_id.clone());
        if !env.storage().persistent().has(&key) {
            return Err(ContractError::BatchNotFound);
        }
        env.storage()
            .persistent()
            .extend_ttl(&key, TTL_BUMP_THRESHOLD, TTL_BUMP_TARGET);

        let counter_key = StorageKey::BatchEventCount(batch_id);
        if env.storage().persistent().has(&counter_key) {
            env.storage()
                .persistent()
                .extend_ttl(&counter_key, TTL_BUMP_THRESHOLD, TTL_BUMP_TARGET);
        }
        Ok(())
    }

    // ─── Upgrade ──────────────────────────────────────────────────────

    /// Upgrade WASM. Requires ADMIN role.
    pub fn upgrade(
        env: Env,
        caller: Address,
        new_wasm_hash: BytesN<32>,
    ) -> Result<(), ContractError> {
        let rbac = Self::get_rbac(&env)?;
        require_role(&env, &rbac, &caller, &Symbol::new(&env, "ADMIN"))?;
        env.deployer().update_current_contract_wasm(new_wasm_hash);
        Ok(())
    }

    // ─── Read queries ──────────────────────────────────────────────────

    /// Fetch a batch by ID.
    pub fn get_batch(env: Env, batch_id: BytesN<32>) -> Result<CannabisBatch, ContractError> {
        let key = StorageKey::Batch(batch_id.clone());
        let batch: CannabisBatch = env
            .storage()
            .persistent()
            .get(&key)
            .ok_or(ContractError::BatchNotFound)?;
        env.storage()
            .persistent()
            .extend_ttl(&key, TTL_BUMP_THRESHOLD, TTL_BUMP_TARGET);
        Ok(batch)
    }

    /// Fetch a specific plant event by batch ID and sequence number.
    pub fn get_event(
        env: Env,
        batch_id: BytesN<32>,
        seq: u32,
    ) -> Result<PlantEvent, ContractError> {
        let key = StorageKey::BatchEvent(batch_id, seq);
        env.storage()
            .persistent()
            .get(&key)
            .ok_or(ContractError::BatchNotFound)
    }

    /// Returns the total number of events recorded for a batch.
    pub fn get_event_count(env: Env, batch_id: BytesN<32>) -> u32 {
        env.storage()
            .persistent()
            .get(&StorageKey::BatchEventCount(batch_id))
            .unwrap_or(0u32)
    }

    // ─── Internal helpers ──────────────────────────────────────────────

    fn get_rbac(env: &Env) -> Result<Address, ContractError> {
        env.storage()
            .instance()
            .get::<StorageKey, Address>(&StorageKey::RbacContract)
            .ok_or(ContractError::NotInitialized)
    }
}

#[cfg(test)]
mod test;
