/**
 * Contract Transaction Builder Routes
 *
 * These endpoints build UNSIGNED Soroban transaction XDRs that the frontend
 * then signs with the patient/doctor/grower's passkey and submits to the
 * fee-bumper service.
 *
 * Pattern: build XDR server-side (no secret needed) → return to frontend →
 *          frontend signs with passkey → POST /api/submit-tx (fee-bumped)
 */

import { Router } from "express";
import { z } from "zod";
import {
  SorobanRpc,
  TransactionBuilder,
  Networks,
  Contract,
  nativeToScVal,
  Address,
  xdr,
} from "@stellar/stellar-sdk";

export const contractsRouter = Router();

const RPC_URL = process.env.STELLAR_RPC_URL ?? "https://soroban-testnet.stellar.org";
const NETWORK = Networks.TESTNET;
const rpc = new SorobanRpc.Server(RPC_URL);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Build and simulate an unsigned Soroban transaction, returning the XDR */
async function buildUnsignedTx(
  callerAddress: string,
  contractId: string,
  method: string,
  args: xdr.ScVal[]
): Promise<string> {
  const account = await rpc.getAccount(callerAddress);
  const contract = new Contract(contractId);

  const tx = new TransactionBuilder(account, {
    fee: "100",
    networkPassphrase: NETWORK,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(300)
    .build();

  // Simulate to attach resource fees (required for Soroban)
  const simResult = await rpc.simulateTransaction(tx);
  if (SorobanRpc.Api.isSimulationError(simResult)) {
    throw new Error(`Simulation failed: ${simResult.error}`);
  }

  const preparedTx = SorobanRpc.assembleTransaction(tx, simResult).build();
  return preparedTx.toXDR();
}

// ─── POST /api/contracts/create-batch ────────────────────────────────────────

const CreateBatchSchema = z.object({
  grower: z.string(),
  batchId: z.string(), // hex string
  metadataHashHex: z.string().length(64),
  strain: z.string().max(32),
});

contractsRouter.post("/create-batch", async (req, res) => {
  const parsed = CreateBatchSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });

  const { grower, batchId, metadataHashHex, strain } = parsed.data;
  const contractId = process.env.TRACEABILITY_CONTRACT_ID!;

  try {
    const batchIdBytes = xdr.ScVal.scvBytes(Buffer.from(batchId, "hex"));
    const metaHashBytes = xdr.ScVal.scvBytes(Buffer.from(metadataHashHex, "hex"));

    const unsignedXdr = await buildUnsignedTx(grower, contractId, "create_batch", [
      new Address(grower).toScVal(),
      batchIdBytes,
      metaHashBytes,
      xdr.ScVal.scvSymbol(strain),
    ]);

    res.json({ unsignedXdr });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Build failed";
    res.status(500).json({ error: msg });
  }
});

// ─── POST /api/contracts/submit-commitment ────────────────────────────────────

const SubmitCommitmentSchema = z.object({
  doctor: z.string(),
  commitmentHex: z.string().length(64),
  authorizedDispensary: z.string(),
  validDays: z.number().int().min(1).max(365),
});

contractsRouter.post("/submit-commitment", async (req, res) => {
  const parsed = SubmitCommitmentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });

  const { doctor, commitmentHex, authorizedDispensary, validDays } = parsed.data;
  const contractId = process.env.ZK_MEDICAL_CONTRACT_ID!;

  // expires_at = current ledger timestamp + validDays * 86400
  // We use Date.now() as approximation (1 ledger ≈ 6s, but timestamps are Unix)
  const expiresAt = BigInt(Math.floor(Date.now() / 1000) + validDays * 86400);

  try {
    const unsignedXdr = await buildUnsignedTx(doctor, contractId, "submit_commitment", [
      new Address(doctor).toScVal(),
      xdr.ScVal.scvBytes(Buffer.from(commitmentHex, "hex")),
      new Address(authorizedDispensary).toScVal(),
      nativeToScVal(expiresAt, { type: "u64" }),
    ]);

    res.json({ unsignedXdr });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Build failed";
    res.status(500).json({ error: msg });
  }
});

// ─── POST /api/contracts/verify-and-consume ───────────────────────────────────

const VerifyConsumeSchema = z.object({
  dispensary: z.string(),
  commitmentHex: z.string().length(64),
  nullifierHex: z.string().length(64),
  proofBase64: z.string(),
  vkBase64: z.string(),
  publicInputsBase64: z.string(),
});

contractsRouter.post("/verify-and-consume", async (req, res) => {
  const parsed = VerifyConsumeSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });

  const { dispensary, commitmentHex, nullifierHex, proofBase64, vkBase64, publicInputsBase64 } =
    parsed.data;
  const contractId = process.env.ZK_MEDICAL_CONTRACT_ID!;

  try {
    const unsignedXdr = await buildUnsignedTx(
      dispensary,
      contractId,
      "verify_and_consume",
      [
        new Address(dispensary).toScVal(),
        xdr.ScVal.scvBytes(Buffer.from(commitmentHex, "hex")),
        xdr.ScVal.scvBytes(Buffer.from(nullifierHex, "hex")),
        xdr.ScVal.scvBytes(Buffer.from(vkBase64, "base64")),
        xdr.ScVal.scvBytes(Buffer.from(proofBase64, "base64")),
        xdr.ScVal.scvBytes(Buffer.from(publicInputsBase64, "base64")),
      ]
    );

    res.json({ unsignedXdr });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Build failed";
    res.status(500).json({ error: msg });
  }
});
