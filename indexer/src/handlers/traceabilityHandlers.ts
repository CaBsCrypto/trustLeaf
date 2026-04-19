/**
 * Traceability Contract Event Handlers
 *
 * These functions parse raw Soroban event payloads from Mercury
 * and upsert structured records into Firestore for fast frontend queries.
 */

import type { SorobanEvent } from "../types";

export interface BatchRecord {
  batchId: string;
  grower: string;
  strain: string;
  status: number;
  createdAt: string; // ISO timestamp
  ledger: number;
  txHash: string;
  metadataHash: string; // hex — cross-verified against Firestore
}

export interface PlantEventRecord {
  batchId: string;
  eventType: string;
  dataHash: string; // hex
  recordedBy: string;
  timestamp: string;
  seq: number;
  ledger: number;
  txHash: string;
}

/** Handle BatchCreated event */
export function handleBatchCreated(event: SorobanEvent): BatchRecord {
  // Soroban event structure:
  // topics: [Symbol("BatchCreated"), BytesN<32>(batch_id)]
  // data:   [Address(grower), Symbol(strain)]
  const batchId = event.topic[1] as string;
  const [grower, strain] = event.data as [string, string];

  return {
    batchId,
    grower,
    strain,
    status: 0, // Growing
    createdAt: new Date(event.ledgerTimestamp * 1000).toISOString(),
    ledger: event.ledger,
    txHash: event.txHash,
    metadataHash: "", // fetched separately from Firestore after indexing
  };
}

/** Handle StatusUpdated event */
export function handleStatusUpdated(
  event: SorobanEvent
): { batchId: string; newStatus: number; updatedBy: string; ledger: number } {
  // topics: [Symbol("StatusUpdated"), BytesN<32>(batch_id)]
  // data:   [Address(caller), BatchStatus(new_status)]
  const batchId = event.topic[1] as string;
  const [updatedBy, newStatus] = event.data as [string, number];

  return { batchId, newStatus, updatedBy, ledger: event.ledger };
}

/** Handle EventRecorded event */
export function handleEventRecorded(event: SorobanEvent): PlantEventRecord {
  // topics: [Symbol("EventRecorded"), BytesN<32>(batch_id)]
  // data:   [Symbol(event_type), BytesN<32>(data_hash), Address(recorded_by), u32(seq)]
  const batchId = event.topic[1] as string;
  const [eventType, dataHash, recordedBy, seq] = event.data as [
    string,
    string,
    string,
    number
  ];

  return {
    batchId,
    eventType,
    dataHash,
    recordedBy,
    timestamp: new Date(event.ledgerTimestamp * 1000).toISOString(),
    seq,
    ledger: event.ledger,
    txHash: event.txHash,
  };
}
