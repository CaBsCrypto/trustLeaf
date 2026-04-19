use soroban_sdk::{contracttype, Address, BytesN, Symbol};

/// A single recorded event in a cannabis batch's lifecycle.
///
/// Like `CannabisBatch`, this stores ONLY hashes — full event data lives
/// off-chain in Firestore, content-addressed by `data_hash`.
///
/// Example event types (as Symbol):
///   "WATERING", "PESTICIDE", "FERTILIZE", "HARVEST", "LAB_SAMPLE", "TRANSFER"
#[contracttype]
#[derive(Clone, Debug)]
pub struct PlantEvent {
    /// The batch this event belongs to
    pub batch_id: BytesN<32>,
    /// Short string identifying the event category
    pub event_type: Symbol,
    /// SHA-256 of the detailed event data stored in Firestore
    pub data_hash: BytesN<32>,
    /// Address that recorded this event (grower, lab, dispensary, etc.)
    pub recorded_by: Address,
    /// Ledger timestamp
    pub timestamp: u64,
    /// Monotonic sequence number within this batch
    pub seq: u32,
}
