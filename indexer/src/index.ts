/**
 * TrustLeaf Mercury/Zephyr Indexer Entry Point
 *
 * Subscribes to all TrustLeaf Soroban contract events via Mercury
 * and routes them to typed handler functions.
 *
 * Architecture:
 *   Mercury polls Soroban → webhook/polling → this service → Firestore
 *   Frontend queries Firestore (fast, no live RPC needed)
 */

import "dotenv/config";
import axios from "axios";
import { config } from "./config";
import { SUBSCRIPTIONS } from "./subscriptions";
import {
  handleBatchCreated,
  handleStatusUpdated,
  handleEventRecorded,
} from "./handlers/traceabilityHandlers";
import {
  handleCommitmentSubmitted,
  handleProofConsumed,
  handleCommitmentRevoked,
} from "./handlers/zkMedicalHandlers";
import type { SorobanEvent } from "./types";

// ─── Mercury client setup ─────────────────────────────────────────────────────

const mercuryClient = axios.create({
  baseURL: config.mercuryBackendUrl,
  headers: {
    Authorization: `Bearer ${config.mercuryApiKey}`,
    "Content-Type": "application/json",
  },
});

// ─── Subscribe to contract events ─────────────────────────────────────────────

async function registerSubscriptions() {
  console.log("📡 Registering Mercury event subscriptions...");

  for (const sub of SUBSCRIPTIONS) {
    if (!sub.contractId) {
      console.warn(`  ⚠️  Skipping ${sub.topic} — contract ID not set`);
      continue;
    }

    try {
      await mercuryClient.post("/event/subscribe", {
        contract_id: sub.contractId,
        topic_filter: sub.topic,
        max_single_size: 200,
      });
      console.log(`  ✅ Subscribed to ${sub.topic} on ${sub.contractId.slice(0, 8)}...`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ❌ Failed to subscribe to ${sub.topic}: ${msg}`);
    }
  }
}

// ─── Poll and dispatch events ─────────────────────────────────────────────────

async function pollEvents() {
  try {
    const { data } = await mercuryClient.get<{ events: SorobanEvent[] }>(
      "/contract/event",
      {
        params: {
          contract_ids: [
            config.contracts.rbac,
            config.contracts.traceability,
            config.contracts.zkMedical,
          ]
            .filter(Boolean)
            .join(","),
        },
      }
    );

    for (const event of data.events ?? []) {
      await dispatchEvent(event);
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Polling error:", msg);
  }
}

async function dispatchEvent(event: SorobanEvent) {
  const topic = event.topic[0] as string;

  switch (topic) {
    // ── Traceability
    case "BatchCreated": {
      const record = handleBatchCreated(event);
      console.log(`[Traceability] BatchCreated: ${record.batchId.slice(0, 8)}...`);
      // TODO: upsert to Firestore /batches/{batchId}
      break;
    }
    case "StatusUpdated": {
      const update = handleStatusUpdated(event);
      console.log(`[Traceability] StatusUpdated: batch=${update.batchId.slice(0, 8)}, status=${update.newStatus}`);
      // TODO: update Firestore /batches/{batchId}.status
      break;
    }
    case "EventRecorded": {
      const ev = handleEventRecorded(event);
      console.log(`[Traceability] EventRecorded: batch=${ev.batchId.slice(0, 8)}, type=${ev.eventType}`);
      // TODO: write to Firestore /batches/{batchId}/events/{seq}
      break;
    }

    // ── ZK Medical
    case "CommitSubmit": {
      const audit = handleCommitmentSubmitted(event);
      console.log(`[ZkMedical] CommitmentSubmitted: ${audit.commitmentHash.slice(0, 8)}...`);
      // TODO: write to Firestore /prescriptions/{commitmentHash}/audit
      break;
    }
    case "ProofConsumed": {
      const audit = handleProofConsumed(event);
      console.log(`[ZkMedical] ProofConsumed: ${audit.commitmentHash.slice(0, 8)}...`);
      // TODO: update Firestore /prescriptions/{commitmentHash}.isConsumed = true
      break;
    }
    case "CommitRevoked": {
      const audit = handleCommitmentRevoked(event);
      console.log(`[ZkMedical] CommitmentRevoked: ${audit.commitmentHash.slice(0, 8)}...`);
      // TODO: update Firestore /prescriptions/{commitmentHash}.isRevoked = true
      break;
    }

    default:
      // Unknown event — log and ignore
      console.debug(`[Unknown] topic=${topic}`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌿 TrustLeaf Indexer starting...");
  console.log(`   RBAC:          ${config.contracts.rbac || "(not set)"}`);
  console.log(`   Traceability:  ${config.contracts.traceability || "(not set)"}`);
  console.log(`   ZK Medical:    ${config.contracts.zkMedical || "(not set)"}`);
  console.log("");

  await registerSubscriptions();

  // Poll every 5 seconds (Mercury typically delivers events within 1-2s)
  console.log("\n⏳ Starting event poll loop (every 5s)...");
  setInterval(pollEvents, 5_000);

  // Initial poll
  await pollEvents();
}

main().catch(console.error);
