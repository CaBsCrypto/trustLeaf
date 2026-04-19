use soroban_sdk::contracterror;

#[contracterror]
#[derive(Clone, Debug, PartialEq)]
pub enum ContractError {
    NotInitialized = 1,
    AlreadyInitialized = 2,
    /// Caller lacks the required role
    Unauthorized = 3,
    /// A commitment with this hash already exists
    CommitmentAlreadyExists = 4,
    /// No commitment found for the given hash
    CommitmentNotFound = 5,
    /// The prescription has already been redeemed (nullifier spent)
    AlreadyConsumed = 6,
    /// The prescription has expired
    PrescriptionExpired = 7,
    /// The ZK proof failed pairing check verification
    InvalidProof = 8,
    /// The verification key hash does not match stored VK hash
    InvalidVerificationKey = 9,
    /// The commitment has been manually revoked by the issuing doctor
    CommitmentRevoked = 10,
}
