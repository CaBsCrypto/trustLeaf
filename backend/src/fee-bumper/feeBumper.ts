/**
 * Fee Bumper Service
 *
 * Wraps user-signed inner transactions in a FeeBumpTransaction so that
 * Trust Leaf (not the user) pays all Stellar transaction fees.
 *
 * Security model:
 *   - The inner transaction is signed by the user's Smart Wallet (passkey)
 *   - The fee-bump envelope is signed by the backend's sponsor keypair
 *   - The backend NEVER sees or modifies the user's private key
 *   - Sequence number collisions are prevented by the Mutex queue
 *
 * Docs: https://developers.stellar.org/docs/build/guides/transactions/fee-bump-transactions
 */

import {
  Keypair,
  Networks,
  TransactionBuilder,
  SorobanRpc,
  Transaction,
  xdr,
} from "@stellar/stellar-sdk";
import { Mutex } from "async-mutex";

// ─── Configuration ────────────────────────────────────────────────────────────

const NETWORK_PASSPHRASE = Networks.TESTNET;
const HORIZON_URL = process.env.HORIZON_URL ?? "https://horizon-testnet.stellar.org";
const RPC_URL = process.env.STELLAR_RPC_URL ?? "https://soroban-testnet.stellar.org";

/** Fee in stroops — 10x base fee for priority inclusion */
const FEE_BUMP_STROOPS = "1000000"; // 0.1 XLM max

const sponsorSecret = process.env.SPONSOR_SECRET_KEY;
if (!sponsorSecret) {
  throw new Error("SPONSOR_SECRET_KEY environment variable is required");
}
const sponsorKeypair = Keypair.fromSecret(sponsorSecret);

const rpc = new SorobanRpc.Server(RPC_URL);

// ─── Mutex (prevents sequence number collisions) ──────────────────────────────
// The sponsor account must not submit two transactions with the same sequence
// number concurrently. The mutex serializes all fee-bump submissions.
const submitMutex = new Mutex();

// ─── Core function ────────────────────────────────────────────────────────────

export interface FeeBumpResult {
  txHash: string;
  ledger?: number;
}

/**
 * Wraps a user-signed XDR in a fee-bump envelope and submits to Horizon.
 *
 * @param signedInnerXdr — Base64 XDR of the user's signed Soroban transaction
 * @returns Transaction hash on success
 */
export async function submitWithFeeBump(
  signedInnerXdr: string
): Promise<FeeBumpResult> {
  return submitMutex.runExclusive(async () => {
    // ── 1. Parse inner transaction ─────────────────────────────────────────
    const innerTx = TransactionBuilder.fromXDR(
      signedInnerXdr,
      NETWORK_PASSPHRASE
    ) as Transaction;

    // ── 2. Simulate to get resource fees (required for Soroban txns) ──────
    // Note: For non-Soroban inner txns this step can be skipped.
    // For Soroban, the resource fee must already be included in the inner txn.
    // We skip re-simulation here since the frontend already called prepareTransaction.

    // ── 3. Build fee-bump envelope ─────────────────────────────────────────
    const feeBumpTx = TransactionBuilder.buildFeeBumpTransaction(
      sponsorKeypair.publicKey(),
      FEE_BUMP_STROOPS,
      innerTx,
      NETWORK_PASSPHRASE
    );

    // ── 4. Sign the fee-bump envelope with sponsor key ─────────────────────
    feeBumpTx.sign(sponsorKeypair);

    // ── 5. Submit to Soroban RPC (handles both classic and Soroban txns) ──
    const result = await rpc.sendTransaction(feeBumpTx);

    if (result.status === "ERROR") {
      const errorCode = result.errorResult
        ? xdr.TransactionResult.fromXDR(result.errorResult, "base64").result().switch().name
        : "unknown";
      throw new Error(`Transaction failed: ${result.status} — ${errorCode}`);
    }

    const txHash = result.hash;

    // ── 6. Poll for confirmation (non-blocking — client polls separately) ──
    // The frontend uses optimistic UI; this confirmation is for logging only.
    pollConfirmation(txHash).catch((err) =>
      console.error(`[fee-bumper] Confirmation poll failed for ${txHash}:`, err)
    );

    return { txHash };
  });
}

/** Poll for transaction confirmation (async background task) */
async function pollConfirmation(txHash: string, maxAttempts = 30): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    await sleep(2000);
    try {
      const result = await rpc.getTransaction(txHash);
      if (result.status === "SUCCESS") {
        console.log(`[fee-bumper] ✅ Confirmed: ${txHash} (ledger ${result.ledger})`);
        return;
      }
      if (result.status === "FAILED") {
        console.error(`[fee-bumper] ❌ Failed: ${txHash}`);
        return;
      }
    } catch {
      // Not yet available — continue polling
    }
  }
  console.warn(`[fee-bumper] ⚠️ Timed out waiting for: ${txHash}`);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const sponsorPublicKey = sponsorKeypair.publicKey();
