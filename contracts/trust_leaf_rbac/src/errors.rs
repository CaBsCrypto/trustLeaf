use soroban_sdk::contracterror;

/// Contract-level errors for trust_leaf_rbac.
/// Low-level storage and auth errors are handled by OpenZeppelin stellar-access.
#[contracterror]
#[derive(Clone, Debug, PartialEq)]
pub enum ContractError {
    NotInitialized    = 1,
    AlreadyInitialized = 2,
    /// Caller is not the admin or does not have the required role
    Unauthorized      = 3,
}
