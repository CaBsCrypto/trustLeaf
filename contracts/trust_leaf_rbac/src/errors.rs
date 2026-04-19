use soroban_sdk::contracterror;

#[contracterror]
#[derive(Clone, Debug, PartialEq)]
pub enum ContractError {
    NotInitialized = 1,
    AlreadyInitialized = 2,
    /// Caller lacks the required role or is not the admin
    Unauthorized = 3,
    RoleAlreadyGranted = 4,
    RoleNotFound = 5,
}
