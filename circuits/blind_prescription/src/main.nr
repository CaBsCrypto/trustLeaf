mod utils;

use utils::{compute_commitment, compute_nullifier};

// ─── TrustLeaf: Blind Prescription Circuit ────────────────────────────────────
//
// This circuit proves that a patient knows the pre-image of a prescription
// commitment WITHOUT revealing their identity on-chain.
//
// ┌─────────────────────────────────────────────────────────────────────────┐
// │  PRIVATE inputs (known only to the patient, never on-chain):           │
// │    patient_id  — Poseidon2-compatible field element derived from RUT   │
// │    nonce       — Random value chosen by the doctor at prescription time │
// │                                                                         │
// │  PUBLIC inputs (verified on-chain by trust_leaf_zk_medical contract):  │
// │    commitment  — Poseidon2([patient_id, nonce])                        │
// │    nullifier   — Poseidon2([patient_id, nonce, 1])                     │
// │    dispensary  — Field encoding of the authorized dispensary address   │
// └─────────────────────────────────────────────────────────────────────────┘
//
// Security properties:
//   1. BINDING    — Commitment uniquely binds to (patient_id, nonce).
//                   The patient cannot swap their identity after the doctor
//                   has committed the hash on-chain.
//   2. HIDING     — patient_id and nonce are never revealed. ZK ensures
//                   the verifier learns nothing beyond "the prover knows them".
//   3. NULLIFIER  — The nullifier prevents double-spend. Once consumed by
//                   trust_leaf_zk_medical, the same proof cannot be replayed
//                   even for a different prescription.
//   4. DISPENSARY — Binding to a specific dispensary prevents front-running:
//                   only the authorized dispensary can call verify_and_consume.
//
// Toolchain:
//   nargo v1.0.0-beta.9  |  bb (Barretenberg) v0.87.0  |  UltraHonk

fn main(
    // ── Private inputs ────────────────────────────────────────────────────
    /// SHA-256(patient_rut_string) reduced to a BN254 field element.
    /// The doctor computes this server-side when issuing the prescription.
    patient_id: Field,

    /// Random 31-byte nonce chosen by the doctor at prescription time.
    /// The doctor shares this nonce with the patient via an encrypted channel
    /// (Firestore AES-256 encrypted document, keyed by prescription ID).
    nonce: Field,

    // ── Public inputs (verified by the Soroban contract) ─────────────────
    /// Poseidon2([patient_id, nonce]) — must match the on-chain commitment.
    commitment: pub Field,

    /// Poseidon2([patient_id, nonce, 1]) — stored on-chain after redemption
    /// to prevent this proof from being replayed.
    nullifier: pub Field,

    /// Field encoding of the authorized dispensary Stellar address.
    /// Binds the proof to a specific dispensary so it cannot be front-run.
    dispensary: pub Field,
) {
    // ── Constraint 1: Commitment correctness ─────────────────────────────────
    // Verify that the public commitment matches the private inputs.
    // This proves the prover knows the pre-image without revealing it.
    let computed_commitment = compute_commitment(patient_id, nonce);
    assert(
        computed_commitment == commitment,
        "Commitment does not match patient_id and nonce"
    );

    // ── Constraint 2: Nullifier correctness ──────────────────────────────────
    // Verify that the public nullifier is correctly derived from the same inputs.
    // The domain separator (1) ensures nullifier ≠ commitment.
    let computed_nullifier = compute_nullifier(patient_id, nonce);
    assert(
        computed_nullifier == nullifier,
        "Nullifier does not match patient_id and nonce"
    );

    // ── Constraint 3: Dispensary is non-zero ─────────────────────────────────
    // The dispensary field must be non-zero to prevent a bypass where an attacker
    // sets dispensary = 0 and claims any dispensary is authorized.
    assert(dispensary != 0, "Dispensary address cannot be zero");
}

// ─── Tests ───────────────────────────────────────────────────────────────────

#[test]
fn test_valid_proof_passes() {
    // Simulate: patient_id = field(42), nonce = field(99)
    let patient_id: Field = 42;
    let nonce: Field = 99;
    let dispensary: Field = 12345678;

    let commitment = utils::compute_commitment(patient_id, nonce);
    let nullifier = utils::compute_nullifier(patient_id, nonce);

    // main() should not panic
    main(patient_id, nonce, commitment, nullifier, dispensary);
}

#[test(should_fail_with = "Commitment does not match patient_id and nonce")]
fn test_wrong_commitment_fails() {
    let patient_id: Field = 42;
    let nonce: Field = 99;
    let dispensary: Field = 12345678;
    let wrong_commitment: Field = 0;
    let nullifier = utils::compute_nullifier(patient_id, nonce);

    main(patient_id, nonce, wrong_commitment, nullifier, dispensary);
}

#[test(should_fail_with = "Nullifier does not match patient_id and nonce")]
fn test_wrong_nullifier_fails() {
    let patient_id: Field = 42;
    let nonce: Field = 99;
    let dispensary: Field = 12345678;
    let commitment = utils::compute_commitment(patient_id, nonce);
    let wrong_nullifier: Field = 0;

    main(patient_id, nonce, commitment, wrong_nullifier, dispensary);
}

#[test(should_fail_with = "Dispensary address cannot be zero")]
fn test_zero_dispensary_fails() {
    let patient_id: Field = 42;
    let nonce: Field = 99;
    let commitment = utils::compute_commitment(patient_id, nonce);
    let nullifier = utils::compute_nullifier(patient_id, nonce);

    main(patient_id, nonce, commitment, nullifier, 0);
}
