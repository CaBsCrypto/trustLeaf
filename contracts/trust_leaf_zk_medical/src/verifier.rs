use soroban_sdk::{Bytes, BytesN, Env};

use crate::errors::ContractError;

/// Verifies an UltraHonk ZK proof using Stellar Protocol 25's native
/// BN254 pairing check host function.
///
/// # How it works
/// 1. The VK bytes are passed by the caller (not stored on-chain — too expensive).
///    The contract stores only `vk_hash = SHA-256(vk_bytes)` and validates it here.
/// 2. `public_inputs` encodes the circuit's public outputs:
///    - commitment  (BytesN<32>) — Poseidon2(hash(rut), nonce)
///    - nullifier   (BytesN<32>) — Poseidon2(hash(rut), nonce, 1)
///    - dispensary  (BytesN<32>) — authorized dispensary address as field element
/// 3. `env.crypto().bn254_pairing_check()` is the Protocol 25 host function.
///    It executes in the Soroban host (not counted against WASM budget) and
///    costs a fixed metered fee.
///
/// # Security notes
/// - The nullifier MUST be checked for double-spend BEFORE calling this function.
/// - The VK hash check MUST happen BEFORE the pairing call to avoid wasting
///   the BN254 metered fee on calls with an invalid VK.
pub fn verify_ultrahonk_proof(
    env: &Env,
    stored_vk_hash: &BytesN<32>,
    vk_bytes: &Bytes,
    proof_bytes: &Bytes,
    public_inputs: &Bytes,
) -> Result<(), ContractError> {
    // ── Step 1: Validate VK integrity ────────────────────────────────────────
    // Compute SHA-256 of the passed VK and compare against the stored hash.
    // This prevents an attacker from substituting a different VK that would
    // accept forged proofs.
    let computed_vk_hash = env.crypto().sha256(vk_bytes);
    if computed_vk_hash != *stored_vk_hash {
        return Err(ContractError::InvalidVerificationKey);
    }

    // ── Step 2: BN254 pairing check ──────────────────────────────────────────
    // Uses the Protocol 25 host function: env.crypto().bn254_pairing_check()
    // The function returns true if the proof is valid for the given VK and inputs.
    //
    // Note: The exact API signature follows the soroban-sdk v22 Crypto interface.
    // vk_bytes + proof_bytes + public_inputs are passed as Bytes (not Vecs of G1/G2
    // points) — the host function handles deserialization internally for UltraHonk.
    let is_valid = env
        .crypto()
        .bn254_pairing_check(vk_bytes.clone(), proof_bytes.clone(), public_inputs.clone());

    if !is_valid {
        return Err(ContractError::InvalidProof);
    }

    Ok(())
}
