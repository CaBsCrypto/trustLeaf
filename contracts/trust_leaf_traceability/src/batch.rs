use soroban_sdk::{contracttype, Address, BytesN, Symbol};

/// On-chain representation of a cannabis batch.
///
/// ⚠️  HYBRID STORAGE RULE:
/// This struct stores ONLY hashes and status — never raw strings, images or PII.
/// Full metadata (strain description, photos, grower notes) lives in Firestore,
/// keyed by `metadata_hash`. The frontend cross-validates both hashes.
#[contracttype]
#[derive(Clone, Debug)]
pub struct CannabisBatch {
    /// Unique batch identifier (SHA-256 of grower address + timestamp + nonce)
    pub batch_id: BytesN<32>,
    /// Grower's Stellar address
    pub grower: Address,
    /// SHA-256 of the off-chain metadata JSON stored in Firestore / IPFS
    pub metadata_hash: BytesN<32>,
    /// Current lifecycle stage
    pub status: BatchStatus,
    /// Ledger timestamp of batch creation
    pub created_at: u64,
    /// Strain identifier (short symbol, e.g. "OG_KUSH")
    pub strain: Symbol,
    /// SHA-256 of the lab certification document (zero-bytes if pending)
    pub lab_cert_hash: BytesN<32>,
}

/// Lifecycle stages of a cannabis batch.
/// Transitions are validated in `update_batch_status`.
#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum BatchStatus {
    Growing = 0,
    Harvested = 1,
    LabTested = 2,
    Approved = 3,
    Dispensed = 4,
    Recalled = 5,
}

impl BatchStatus {
    /// Returns true if the transition from `self` → `next` is allowed.
    ///
    /// Valid transitions:
    ///   Growing → Harvested
    ///   Harvested → LabTested | Recalled
    ///   LabTested → Approved | Recalled
    ///   Approved → Dispensed | Recalled
    ///   Dispensed / Recalled — terminal states, no further transitions
    pub fn can_transition_to(&self, next: &BatchStatus) -> bool {
        matches!(
            (self, next),
            (BatchStatus::Growing, BatchStatus::Harvested)
                | (BatchStatus::Harvested, BatchStatus::LabTested)
                | (BatchStatus::Harvested, BatchStatus::Recalled)
                | (BatchStatus::LabTested, BatchStatus::Approved)
                | (BatchStatus::LabTested, BatchStatus::Recalled)
                | (BatchStatus::Approved, BatchStatus::Dispensed)
                | (BatchStatus::Approved, BatchStatus::Recalled)
        )
    }
}
