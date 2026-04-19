/**
 * ZK Medical Contract Event Handlers
 *
 * Indexes prescription lifecycle events for audit logs and dispensary queries.
 * NOTE: No PII is indexed here — only commitment hashes and nullifiers.
 */

import type { SorobanEvent } from "../types";

export interface PrescriptionAudit {
  commitmentHash: string;
  event: "submitted" | "consumed" | "revoked";
  doctor?: string;
  dispensary?: string;
  nullifier?: string;
  expiresAt?: number;
  ledger: number;
  ledgerTimestamp: string;
  txHash: string;
}

export function handleCommitmentSubmitted(event: SorobanEvent): PrescriptionAudit {
  // topics: [Symbol("CommitSubmit"), BytesN<32>(commitment_hash)]
  // data:   [Address(doctor), Address(dispensary), u64(expires_at)]
  const commitmentHash = event.topic[1] as string;
  const [doctor, dispensary, expiresAt] = event.data as [string, string, number];

  return {
    commitmentHash,
    event: "submitted",
    doctor,
    dispensary,
    expiresAt,
    ledger: event.ledger,
    ledgerTimestamp: new Date(event.ledgerTimestamp * 1000).toISOString(),
    txHash: event.txHash,
  };
}

export function handleProofConsumed(event: SorobanEvent): PrescriptionAudit {
  // topics: [Symbol("ProofConsumed"), BytesN<32>(commitment_hash)]
  // data:   [Address(dispensary), BytesN<32>(nullifier)]
  const commitmentHash = event.topic[1] as string;
  const [dispensary, nullifier] = event.data as [string, string];

  return {
    commitmentHash,
    event: "consumed",
    dispensary,
    nullifier,
    ledger: event.ledger,
    ledgerTimestamp: new Date(event.ledgerTimestamp * 1000).toISOString(),
    txHash: event.txHash,
  };
}

export function handleCommitmentRevoked(event: SorobanEvent): PrescriptionAudit {
  // topics: [Symbol("CommitRevoked"), BytesN<32>(commitment_hash)]
  // data:   [Address(doctor)]
  const commitmentHash = event.topic[1] as string;
  const [doctor] = event.data as [string];

  return {
    commitmentHash,
    event: "revoked",
    doctor,
    ledger: event.ledger,
    ledgerTimestamp: new Date(event.ledgerTimestamp * 1000).toISOString(),
    txHash: event.txHash,
  };
}
