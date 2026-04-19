/**
 * ZK Commitment Utilities
 *
 * Server-side helpers for computing Poseidon2 commitments and nullifiers.
 * These values feed into the Noir circuit's public inputs and the
 * trust_leaf_zk_medical.submit_commitment() contract call.
 *
 * NOTE: We use @aztec/bb.js (Barretenberg WASM) for Poseidon2 computation
 * to ensure byte-exact compatibility with the Noir circuit.
 */

import crypto from "crypto";

// ─── RUT → Field element ──────────────────────────────────────────────────────

/**
 * Convert a Chilean RUT string (e.g. "12345678-9") to a BN254 field element.
 * 1. Normalize: strip dots, hyphen, and check digit (e.g. "12345678-9" → "12345678")
 * 2. SHA-256 the UTF-8 bytes
 * 3. Take first 31 bytes (ensures value < BN254 scalar field prime)
 * 4. Return as BigInt
 */
export function rutToField(rut: string): bigint {
  // Normalize: remove dots and everything after/including hyphen
  const normalized = rut.replace(/\./g, "").split("-")[0].trim();
  if (!/^\d+$/.test(normalized)) {
    throw new Error(`Invalid RUT format: ${rut}`);
  }

  // SHA-256 of the normalized RUT string
  const hash = crypto.createHash("sha256").update(normalized, "utf8").digest();

  // Take first 31 bytes to stay within BN254 field (< 2^248)
  let result = BigInt(0);
  for (let i = 0; i < 31; i++) {
    result = result * BigInt(256) + BigInt(hash[i]);
  }

  return result;
}

/**
 * Convert a BigInt field element to a 32-byte hex string (for on-chain storage).
 */
export function fieldToHex(field: bigint): string {
  return field.toString(16).padStart(64, "0");
}

// ─── Poseidon2 wrappers ───────────────────────────────────────────────────────
// In the MVP we approximate Poseidon2 server-side using bb.js WASM bindings.
// The exact same hash function is used in the Noir circuit.

/**
 * Compute prescription commitment: Poseidon2([patient_id, nonce])
 * Must match compute_commitment() in circuits/blind_prescription/src/utils.nr
 */
export async function computeCommitment(
  patientId: bigint,
  nonce: bigint
): Promise<bigint> {
  // TODO: replace with bb.js Poseidon2 call once WASM is initialized
  // For now: placeholder hash (replace before any real deployment)
  const bb = await getBbInstance();
  return bb.poseidon2Hash([patientId, nonce]);
}

/**
 * Compute prescription nullifier: Poseidon2([patient_id, nonce, 1])
 * Must match compute_nullifier() in circuits/blind_prescription/src/utils.nr
 */
export async function computeNullifier(
  patientId: bigint,
  nonce: bigint
): Promise<bigint> {
  const bb = await getBbInstance();
  return bb.poseidon2Hash([patientId, nonce, BigInt(1)]);
}

/**
 * Generate a cryptographically random nonce (31 bytes = fits in BN254 field)
 */
export function generateNonce(): bigint {
  const bytes = crypto.randomBytes(31);
  let result = BigInt(0);
  for (const byte of bytes) {
    result = result * BigInt(256) + BigInt(byte);
  }
  return result;
}

// ─── bb.js WASM initializer (singleton) ──────────────────────────────────────

interface BbInstance {
  poseidon2Hash: (inputs: bigint[]) => bigint;
}

let _bbInstance: BbInstance | null = null;

async function getBbInstance(): Promise<BbInstance> {
  if (_bbInstance) return _bbInstance;

  // Dynamic import to avoid loading WASM at module init time
  // @ts-expect-error — @aztec/bb.js types vary by version
  const { Barretenberg, RawBuffer } = await import("@aztec/bb.js");
  const bb = await Barretenberg.new({ threads: 1 });

  _bbInstance = {
    poseidon2Hash: (inputs: bigint[]): bigint => {
      const fields = inputs.map((n) => {
        const buf = Buffer.alloc(32);
        // Write BigInt as 32-byte big-endian
        let tmp = n;
        for (let i = 31; i >= 0; i--) {
          buf[i] = Number(tmp & BigInt(0xff));
          tmp >>= BigInt(8);
        }
        return new RawBuffer(buf);
      });
      const result = bb.poseidon2Hash(fields);
      // Convert result buffer back to BigInt
      let out = BigInt(0);
      for (const byte of Buffer.from(result)) {
        out = out * BigInt(256) + BigInt(byte);
      }
      return out;
    },
  };

  return _bbInstance;
}
