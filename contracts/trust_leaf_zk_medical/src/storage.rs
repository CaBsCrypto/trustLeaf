use soroban_sdk::{contracttype, BytesN};

#[contracttype]
#[derive(Clone)]
pub enum StorageKey {
    Initialized,
    /// Address of the deployed RBAC contract
    RbacContract,
    /// SHA-256 hash of the UltraHonk verification key (VK bytes are passed at call time)
    VkHash,
    /// Prescription commitment record: commitment_hash → PrescriptionCommitment
    Commitment(BytesN<32>),
    /// Nullifier spend flag: nullifier → bool
    /// Must be checked BEFORE the pairing call to avoid paying BN254 cost on replays
    NullifierUsed(BytesN<32>),
}

pub const TTL_BUMP_TARGET: u32 = 5_256_000;
pub const TTL_BUMP_THRESHOLD: u32 = 2_628_000;
