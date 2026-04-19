use soroban_sdk::{contracttype, Address, Symbol};

/// Storage key variants for the RBAC contract.
#[contracttype]
#[derive(Clone)]
pub enum StorageKey {
    /// Whether the contract has been initialized
    Initialized,
    /// The global administrator address
    Admin,
    /// Role membership: (account, role) → bool
    Role(Address, Symbol),
}

// ─── TTL constants ────────────────────────────────────────────────────────────
// Soroban persistent entries expire after ~1 year of ledgers by default.
// We bump TTL on every read to keep active role entries alive.

/// Target TTL bump: ~1 year (5_256_000 ledgers at 6s/ledger)
pub const TTL_BUMP_TARGET: u32 = 5_256_000;
/// Threshold: bump only if less than ~6 months remaining
pub const TTL_BUMP_THRESHOLD: u32 = 2_628_000;
