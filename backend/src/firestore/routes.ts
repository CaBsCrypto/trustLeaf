/**
 * Batch & Prescription Firestore API Routes
 *
 * Handles off-chain metadata storage and hash cross-verification.
 */

import { Router } from "express";
import { z } from "zod";
import crypto from "crypto";
import { getFirestore } from "./client";
import { saveBatchMetadata, getBatchMetadata } from "./batches";

export const firestoreRouter = Router();

// ─── POST /api/batches ────────────────────────────────────────────────────────
// Called by grower before create_batch() on-chain.
// Returns batchId (derived from grower+ts) and metadataHashHex.

const CreateBatchMetaSchema = z.object({
  grower: z.string(),
  strain: z.string(),
  strainDescription: z.string().optional().default(""),
  origin: z.string().optional().default(""),
  growerNotes: z.string().optional().default(""),
});

firestoreRouter.post("/batches", async (req, res) => {
  const parsed = CreateBatchMetaSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });

  const { grower, strain, strainDescription, origin, growerNotes } = parsed.data;
  const now = new Date().toISOString();

  // Deterministic batch ID: SHA-256(grower + timestamp + random)
  const batchId = crypto
    .createHash("sha256")
    .update(`${grower}:${Date.now()}:${crypto.randomBytes(8).toString("hex")}`)
    .digest("hex");

  const metadata = {
    batchId,
    grower,
    strain,
    strainDescription,
    origin,
    imageUrls: [],
    growerNotes,
    createdAt: now,
    updatedAt: now,
  };

  const { hash } = await saveBatchMetadata(metadata);
  res.json({ batchId, metadataHashHex: hash });
});

// ─── GET /api/batches/:batchId ────────────────────────────────────────────────

firestoreRouter.get("/batches/:batchId", async (req, res) => {
  const data = await getBatchMetadata(req.params.batchId);
  if (!data) return res.status(404).json({ error: "Batch not found" });
  res.json(data);
});

// ─── GET /api/batches/:batchId/hash ───────────────────────────────────────────
// Used by frontend HashVerificationBadge to cross-check on-chain vs Firestore.

firestoreRouter.get("/batches/:batchId/hash", async (req, res) => {
  const data = await getBatchMetadata(req.params.batchId);
  if (!data) return res.status(404).json({ error: "Batch not found" });
  res.json({ hash: data._hash });
});

// ─── POST /api/prescriptions ──────────────────────────────────────────────────
// Doctor stores encrypted nonce after commitment generation.
// The nonce is AES-256-GCM encrypted with a key derived from the doctor's address.

const SavePrescriptionSchema = z.object({
  commitmentHex: z.string().length(64),
  nonce: z.string(),
  doctorAddress: z.string(),
  dispensaryAddress: z.string(),
});

firestoreRouter.post("/prescriptions", async (req, res) => {
  const parsed = SavePrescriptionSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });

  const { commitmentHex, nonce, doctorAddress, dispensaryAddress } = parsed.data;

  // Encrypt nonce with AES-256-GCM
  const encryptionKey = crypto.createHash("sha256").update(doctorAddress).digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey, iv);
  const encrypted = Buffer.concat([cipher.update(nonce, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  const encryptedNonce = {
    iv: iv.toString("hex"),
    data: encrypted.toString("hex"),
    tag: tag.toString("hex"),
  };

  const db = getFirestore();
  await db.collection("prescriptions").doc(commitmentHex).set({
    commitmentHex,
    encryptedNonce,
    doctorAddress,
    dispensaryAddress,
    isConsumed: false,
    isRevoked: false,
    createdAt: new Date().toISOString(),
  });

  res.json({ success: true });
});
