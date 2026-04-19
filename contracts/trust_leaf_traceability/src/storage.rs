use soroban_sdk::{contracttype, BytesN};

/// Storage key variants for the traceability contract.
#[contracttype]
#[derive(Clone)]
pub enum StorageKey {
    Initialized,
    /// Address of the deployed RBAC contract
    RbacContract,
    /// Main batch record: batch_id → CannabisBatch
    Batch(BytesN<32>),
    /// Individual plant events: (batch_id, seq) → PlantEvent
    /// Using separate keys (NOT a Vec) to avoid memory limit issues
    BatchEvent(BytesN<32>, u32),
    /// Monotonic event counter per batch: batch_id → u32
    BatchEventCount(BytesN<32>),
}

// ─── TTL constants ────────────────────────────────────────────────────────────
/// ~1 year in ledgers
pub const TTL_BUMP_TARGET: u32 = 5_256_000;
/// ~6 months — bump threshold
pub const TTL_BUMP_THRESHOLD: u32 = 2_628_000;
