/**
 * Server-side ZK Proof Generator
 *
 * The backend generates the UltraHonk ZK proof on behalf of the patient.
 * The patient submits their private inputs (RUT + nonce) over HTTPS/TLS —
 * these inputs are never persisted, only held in memory during proof generation.
 *
 * Proof generation takes 10-30s on the server (fast hardware).
 * The frontend uses a loading state during this time.
 */

import path from "path";
import fs from "fs";
import { computeCommitment, computeNullifier, rutToField, fieldToHex } from "./commitmentUtils";

// ─── Paths ────────────────────────────────────────────────────────────────────

const CIRCUIT_BYTECODE_PATH =
  process.env.CIRCUIT_BYTECODE_PATH ??
  path.join(__dirname, "../../../circuits/blind_prescription/target/blind_prescription.json");

const VK_PATH =
  process.env.VK_PATH ??
  path.join(__dirname, "../../../circuits/blind_prescription/target/vk.bin");

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GenerateProofInput {
  /** Patient's RUT, e.g. "12345678-9" */
  patientRut: string;
  /** Prescription nonce (bigint, shared by the doctor via encrypted channel) */
  nonce: bigint;
  /** Authorized dispensary Stellar address as field element */
  dispensaryField: bigint;
}

export interface GeneratedProof {
  /** Hex-encoded commitment (public input for the contract) */
  commitmentHex: string;
  /** Hex-encoded nullifier (public input for the contract) */
  nullifierHex: string;
  /** Base64-encoded UltraHonk proof bytes */
  proofBase64: string;
  /** Base64-encoded VK bytes (validated against on-chain VK hash) */
  vkBase64: string;
  /** Base64-encoded ABI-encoded public inputs */
  publicInputsBase64: string;
}

// ─── Proof generation ─────────────────────────────────────────────────────────

/**
 * Generate a ZK proof for a prescription redemption.
 * NEVER logs or persists the private inputs.
 */
export async function generateProof(
  input: GenerateProofInput
): Promise<GeneratedProof> {
  // ── 1. Derive field elements from RUT ─────────────────────────────────────
  const patientId = rutToField(input.patientRut);
  const nonce = input.nonce;

  // ── 2. Compute public inputs ──────────────────────────────────────────────
  const commitment = await computeCommitment(patientId, nonce);
  const nullifier = await computeNullifier(patientId, nonce);

  // ── 3. Generate proof using bb.js ─────────────────────────────────────────
  // @ts-expect-error — @aztec/bb.js types vary by version
  const { Barretenberg, RawBuffer, Fr } = await import("@aztec/bb.js");
  const bb = await Barretenberg.new({ threads: 4 });

  // Load circuit bytecode
  const circuitJson = JSON.parse(fs.readFileSync(CIRCUIT_BYTECODE_PATH, "utf8"));
  const acirBytecode = Buffer.from(circuitJson.bytecode, "base64");

  // Build witness: private + public inputs
  const witness = new Map<number, Fr>();
  witness.set(0, new Fr(patientId));                    // private: patient_id
  witness.set(1, new Fr(nonce));                         // private: nonce
  witness.set(2, new Fr(commitment));                    // public:  commitment
  witness.set(3, new Fr(nullifier));                     // public:  nullifier
  witness.set(4, new Fr(input.dispensaryField));         // public:  dispensary

  // Execute circuit to produce witness
  const { witness: solvedWitness } = await bb.executeCircuit(
    new RawBuffer(acirBytecode),
    witness
  );

  // Prove
  const proofData = await bb.proveUltraHonk(
    new RawBuffer(acirBytecode),
    solvedWitness
  );

  // Load VK
  const vkBytes = fs.readFileSync(VK_PATH);

  // Encode public inputs for Soroban: [commitment, nullifier, dispensary] as 32-byte big-endian
  const publicInputsBuffer = Buffer.concat([
    bigintToBytes32(commitment),
    bigintToBytes32(nullifier),
    bigintToBytes32(input.dispensaryField),
  ]);

  return {
    commitmentHex: fieldToHex(commitment),
    nullifierHex: fieldToHex(nullifier),
    proofBase64: Buffer.from(proofData.proof).toString("base64"),
    vkBase64: vkBytes.toString("base64"),
    publicInputsBase64: publicInputsBuffer.toString("base64"),
  };
}

function bigintToBytes32(value: bigint): Buffer {
  const buf = Buffer.alloc(32);
  let tmp = value;
  for (let i = 31; i >= 0; i--) {
    buf[i] = Number(tmp & BigInt(0xff));
    tmp >>= BigInt(8);
  }
  return buf;
}
