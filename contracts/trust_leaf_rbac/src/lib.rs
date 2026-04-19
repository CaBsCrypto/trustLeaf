#![no_std]

mod errors;
mod roles;
mod storage;

use soroban_sdk::{contract, contractimpl, Address, Env, Symbol};

use errors::ContractError;
use roles::{
    grant_role_unchecked, has_role as _has_role, require_admin, revoke_role_unchecked,
};
use storage::{StorageKey, TTL_BUMP_TARGET, TTL_BUMP_THRESHOLD};

#[contract]
pub struct TrustLeafRbac;

#[contractimpl]
impl TrustLeafRbac {
    // ─── Initialization ────────────────────────────────────────────────────

    /// Initialize the contract with a root admin.
    /// Can only be called once.
    ///
    /// # Arguments
    /// * `admin` — The Stellar address that will hold the ADMIN role
    pub fn initialize(env: Env, admin: Address) -> Result<(), ContractError> {
        // Prevent re-initialization
        if env
            .storage()
            .instance()
            .has(&StorageKey::Initialized)
        {
            return Err(ContractError::AlreadyInitialized);
        }

        // Store admin and mark as initialized
        env.storage()
            .instance()
            .set(&StorageKey::Admin, &admin);
        env.storage()
            .instance()
            .set(&StorageKey::Initialized, &true);
        env.storage()
            .instance()
            .extend_ttl(TTL_BUMP_THRESHOLD, TTL_BUMP_TARGET);

        // Bootstrap: grant ADMIN role to the admin address
        grant_role_unchecked(&env, &admin, &Symbol::new(&env, "ADMIN"));

        // Emit event for indexer
        env.events().publish(
            (Symbol::new(&env, "RbacInit"),),
            (admin.clone(),),
        );

        Ok(())
    }

    // ─── Role management ───────────────────────────────────────────────────

    /// Grant a role to an account. Only callable by the current admin.
    ///
    /// # Arguments
    /// * `caller`  — Must be the admin (will be require_auth'd)
    /// * `account` — Address receiving the role
    /// * `role`    — Role symbol (e.g. "DOCTOR", "DISPENSARY", "LAB", "GROWER")
    pub fn grant_role(
        env: Env,
        caller: Address,
        account: Address,
        role: Symbol,
    ) -> Result<(), ContractError> {
        // Only admin can grant roles
        require_admin(&env, &caller)?;

        if _has_role(&env, &account, &role) {
            return Err(ContractError::RoleAlreadyGranted);
        }

        grant_role_unchecked(&env, &account, &role);

        // Emit event for Mercury/Zephyr indexer
        env.events().publish(
            (Symbol::new(&env, "RoleGranted"), role.clone()),
            (account.clone(),),
        );

        Ok(())
    }

    /// Revoke a role from an account. Only callable by the current admin.
    ///
    /// # Arguments
    /// * `caller`  — Must be the admin
    /// * `account` — Address losing the role
    /// * `role`    — Role to remove
    pub fn revoke_role(
        env: Env,
        caller: Address,
        account: Address,
        role: Symbol,
    ) -> Result<(), ContractError> {
        require_admin(&env, &caller)?;

        if !_has_role(&env, &account, &role) {
            return Err(ContractError::RoleNotFound);
        }

        revoke_role_unchecked(&env, &account, &role);

        env.events().publish(
            (Symbol::new(&env, "RoleRevoked"), role.clone()),
            (account.clone(),),
        );

        Ok(())
    }

    /// Transfer admin to a new address. The new admin is automatically
    /// granted the ADMIN role. Callable only by the current admin.
    pub fn transfer_admin(
        env: Env,
        caller: Address,
        new_admin: Address,
    ) -> Result<(), ContractError> {
        require_admin(&env, &caller)?;

        // Revoke old admin role
        revoke_role_unchecked(&env, &caller, &Symbol::new(&env, "ADMIN"));
        // Grant to new admin
        grant_role_unchecked(&env, &new_admin, &Symbol::new(&env, "ADMIN"));
        // Update stored admin
        env.storage()
            .instance()
            .set(&StorageKey::Admin, &new_admin);

        env.events().publish(
            (Symbol::new(&env, "AdminTransferred"),),
            (caller.clone(), new_admin.clone()),
        );

        Ok(())
    }

    /// Upgrade the contract WASM. Gated to ADMIN for post-hackathon iteration.
    pub fn upgrade(env: Env, caller: Address, new_wasm_hash: soroban_sdk::BytesN<32>) -> Result<(), ContractError> {
        require_admin(&env, &caller)?;
        env.deployer().update_current_contract_wasm(new_wasm_hash);
        Ok(())
    }

    // ─── Read-only queries ─────────────────────────────────────────────────

    /// Returns true if `account` has `role`.
    pub fn has_role(env: Env, account: Address, role: Symbol) -> bool {
        _has_role(&env, &account, &role)
    }

    /// Returns the current admin address.
    pub fn get_admin(env: Env) -> Result<Address, ContractError> {
        env.storage()
            .instance()
            .get::<StorageKey, Address>(&StorageKey::Admin)
            .ok_or(ContractError::NotInitialized)
    }

    /// Returns true if the contract has been initialized.
    pub fn is_initialized(env: Env) -> bool {
        env.storage()
            .instance()
            .has(&StorageKey::Initialized)
    }
}

// ─── Tests ─────────────────────────────────────────────────────────────────────
#[cfg(test)]
mod test;
