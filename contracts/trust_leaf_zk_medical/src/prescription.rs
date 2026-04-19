use soroban_sdk::{contracttype, Address, BytesN};

/// On-chain record of a ZK prescription commitment.
///
/// The doctor submits this when issuing a prescription.
/// NO personally identifiable information is stored on-chain —
/// only the cryptographic commitment (Poseidon2 hash of patient RUT + nonce).
#[contracttype]
#[derive(Clone, Debug)]
pub struct PrescriptionCommitment {
    /// Poseidon2( hash(patient_rut) , prescription_nonce )
    /// This binds the prescription to the patient without revealing identity.
    pub commitment_hash: BytesN<32>,
    /// Stellar address of the dispensary authorised to accept this prescription.
    /// Binding to a specific dispensary prevents front-running.
    pub authorized_dispensary: Address,
    /// Doctor who issued the prescription (must hold DOCTOR_ROLE)
    pub issued_by: Address,
    /// Ledger timestamp of issuance
    pub issued_at: u64,
    /// Ledger timestamp after which the prescription is invalid
    pub expires_at: u64,
    /// Whether the prescription has been consumed (redeemed)
    pub is_used: bool,
    /// Whether the doctor has manually revoked the prescription
    pub is_revoked: bool,
}
