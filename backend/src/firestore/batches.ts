/**
 * Firestore Batch Metadata
 *
 * Off-chain storage for cannabis batch details (strain descriptions, photos, etc.)
 * The on-chain contract stores only the SHA-256 hash of this document.
 * The frontend cross-verifies both to detect tampering.
 */

import crypto from "crypto";
import { getFirestore } from "./client";

export interface BatchMetadata {
  batchId: string;
  grower: string; // Stellar address
  strain: string;
  strainDescription: string;
  origin: string;
  imageUrls: string[];
  growerNotes: string;
  labReport?: {
    thcContent: number;
    cbdContent: number;
    certHash: string; // hex — matches on-chain lab_cert_hash
    testedAt: string; // ISO timestamp
    lab: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Compute the canonical SHA-256 hash of a BatchMetadata document.
 * This is the value stored on-chain as `metadata_hash`.
 *
 * Canonicalization: JSON.stringify with sorted keys to ensure determinism.
 */
export function computeBatchMetadataHash(metadata: BatchMetadata): string {
  const canonical = JSON.stringify(metadata, Object.keys(metadata).sort());
  return crypto.createHash("sha256").update(canonical, "utf8").digest("hex");
}

export async function saveBatchMetadata(
  metadata: BatchMetadata
): Promise<{ hash: string }> {
  const db = getFirestore();
  const hash = computeBatchMetadataHash(metadata);

  await db
    .collection("batches")
    .doc(metadata.batchId)
    .set({ ...metadata, _hash: hash, updatedAt: new Date().toISOString() });

  return { hash };
}

export async function getBatchMetadata(
  batchId: string
): Promise<(BatchMetadata & { _hash: string }) | null> {
  const db = getFirestore();
  const doc = await db.collection("batches").doc(batchId).get();
  if (!doc.exists) return null;
  return doc.data() as BatchMetadata & { _hash: string };
}
