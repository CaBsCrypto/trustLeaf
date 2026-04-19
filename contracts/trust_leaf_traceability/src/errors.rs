use soroban_sdk::contracterror;

#[contracterror]
#[derive(Clone, Debug, PartialEq)]
pub enum ContractError {
    NotInitialized = 1,
    AlreadyInitialized = 2,
    /// Caller does not have the required role
    Unauthorized = 3,
    /// Batch with this ID already exists
    BatchAlreadyExists = 4,
    /// No batch found for the given ID
    BatchNotFound = 5,
    /// The requested status transition is not allowed
    InvalidStatusTransition = 6,
    /// Event counter overflow (extremely unlikely)
    CounterOverflow = 7,
}
