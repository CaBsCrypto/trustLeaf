use soroban_sdk::contracttype;

/// Roles used across all TrustLeaf contracts.
/// Stored as Symbol values in the RBAC contract.
pub const ROLE_ADMIN: &str = "ADMIN";
pub const ROLE_DOCTOR: &str = "DOCTOR";
pub const ROLE_DISPENSARY: &str = "DISPENSARY";
pub const ROLE_LAB: &str = "LAB";
pub const ROLE_GROWER: &str = "GROWER";

/// Lifecycle stages of a cannabis batch.
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
