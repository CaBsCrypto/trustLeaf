use std::hash::poseidon2;

// ─── Poseidon2 wrappers ────────────────────────────────────────────────────────
// Protocol 25 exposes poseidon2 as a Soroban host function, making on-chain
// verification of these commitments extremely cheap.

/// Compute the prescription commitment from patient_id and nonce.
/// commitment = Poseidon2([patient_id, nonce])
///
/// patient_id = sha256(rut_bytes) reduced to a field element
pub fn compute_commitment(patient_id: Field, nonce: Field) -> Field {
    poseidon2::hash([patient_id, nonce], 2)
}

/// Compute the nullifier — a unique one-time spend tag.
/// nullifier = Poseidon2([patient_id, nonce, 1])
///
/// The domain separator (1) ensures commitment ≠ nullifier even with same inputs.
/// Storing and checking nullifiers on-chain prevents double-spend.
pub fn compute_nullifier(patient_id: Field, nonce: Field) -> Field {
    poseidon2::hash([patient_id, nonce, 1], 3)
}

/// Convert an array of 32 bytes (e.g. SHA-256 of RUT string) to a Field element.
/// We use the first 31 bytes to stay within the BN254 scalar field (< 2^254).
pub fn bytes32_to_field(bytes: [u8; 32]) -> Field {
    let mut result: Field = 0;
    // Pack bytes[0..30] as big-endian into a field element
    // (byte 31 is dropped to guarantee we stay in field range)
    for i in 0..31 {
        result = result * 256 + (bytes[i] as Field);
    }
    result
}
