/**
 * Mercury/Zephyr Event Subscriptions
 *
 * Mercury indexes Soroban contract events in near real-time (~1s latency).
 * We subscribe to the 3 TrustLeaf contracts and store indexed data for
 * fast frontend queries — no live RPC calls needed from the UI.
 *
 * Docs: https://docs.mercurydata.app/zephyr/getting-started
 */

import { config } from "./config";

// ─── Subscription topics ──────────────────────────────────────────────────────
// Each Soroban event has a topics array. We filter by the first topic (event name)
// and the contract ID.

export const SUBSCRIPTIONS = [
  // ── RBAC events ────────────────────────────────────────────────────────────
  {
    contractId: config.contracts.rbac,
    topic: "RoleGranted",
    description: "A role was granted to an account",
  },
  {
    contractId: config.contracts.rbac,
    topic: "RoleRevoked",
    description: "A role was revoked from an account",
  },
  {
    contractId: config.contracts.rbac,
    topic: "AdminTransferred",
    description: "Contract admin was transferred",
  },

  // ── Traceability events ────────────────────────────────────────────────────
  {
    contractId: config.contracts.traceability,
    topic: "BatchCreated",
    description: "A new cannabis batch was created",
  },
  {
    contractId: config.contracts.traceability,
    topic: "StatusUpdated",
    description: "Batch lifecycle status changed",
  },
  {
    contractId: config.contracts.traceability,
    topic: "EventRecorded",
    description: "A plant care/logistics event was recorded",
  },

  // ── ZK Medical events ──────────────────────────────────────────────────────
  {
    contractId: config.contracts.zkMedical,
    topic: "CommitSubmit",
    description: "Doctor submitted a prescription commitment",
  },
  {
    contractId: config.contracts.zkMedical,
    topic: "ProofConsumed",
    description: "Prescription ZK proof was verified and consumed",
  },
  {
    contractId: config.contracts.zkMedical,
    topic: "CommitRevoked",
    description: "Doctor revoked a prescription",
  },
];
