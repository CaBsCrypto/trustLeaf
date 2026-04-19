import { Router } from "express";
import { z } from "zod";
import { generateProof } from "./proofGenerator";
import { rutToField, generateNonce, fieldToHex, computeCommitment, computeNullifier } from "./commitmentUtils";

export const zkRouter = Router();

// ─── POST /api/zk/commitment ──────────────────────────────────────────────────
// Doctor calls this to generate a commitment hash for a new prescription.
// Returns the commitment hex and the nonce (to be stored encrypted in Firestore).

const CommitmentSchema = z.object({
  patientRut: z.string().min(7).max(12),
});

zkRouter.post("/commitment", async (req, res) => {
  const parsed = CommitmentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid RUT", details: parsed.error.errors });
  }

  try {
    const patientId = rutToField(parsed.data.patientRut);
    const nonce = generateNonce();
    const commitment = await computeCommitment(patientId, nonce);

    return res.json({
      commitmentHex: fieldToHex(commitment),
      // Nonce returned to doctor — must be stored encrypted in Firestore
      // and shared with patient via secure channel
      nonce: nonce.toString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
});

// ─── POST /api/zk/prove ───────────────────────────────────────────────────────
// Patient calls this to generate a ZK proof for prescription redemption.
// Private inputs (RUT + nonce) are never persisted — only held in memory.

const ProveSchema = z.object({
  patientRut: z.string().min(7).max(12),
  nonce: z.string(), // BigInt as string
  dispensaryField: z.string(), // BigInt as string
});

zkRouter.post("/prove", async (req, res) => {
  const parsed = ProveSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.errors });
  }

  try {
    const proof = await generateProof({
      patientRut: parsed.data.patientRut,
      nonce: BigInt(parsed.data.nonce),
      dispensaryField: BigInt(parsed.data.dispensaryField),
    });

    // Return proof components — the frontend includes these in verify_and_consume()
    return res.json(proof);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Proof generation failed";
    console.error("[POST /zk/prove] Error:", message);
    return res.status(500).json({ error: message });
  }
});

// ─── POST /api/zk/nullifier ───────────────────────────────────────────────────
// Compute nullifier for a given RUT + nonce (used by dispensary to check)

const NullifierSchema = z.object({
  patientRut: z.string(),
  nonce: z.string(),
});

zkRouter.post("/nullifier", async (req, res) => {
  const parsed = NullifierSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const patientId = rutToField(parsed.data.patientRut);
    const nullifier = await computeNullifier(patientId, BigInt(parsed.data.nonce));
    return res.json({ nullifierHex: fieldToHex(nullifier) });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
});
