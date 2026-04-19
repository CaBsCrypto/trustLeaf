import { Router } from "express";
import { z } from "zod";
import { submitWithFeeBump, sponsorPublicKey } from "./feeBumper";

export const feeBumperRouter = Router();

const SubmitTxSchema = z.object({
  /** Base64 XDR of the user's signed inner transaction */
  signedXdr: z.string().min(10),
});

/**
 * POST /api/submit-tx
 * Accept a signed inner transaction XDR and wrap it in a fee bump.
 * Returns the transaction hash immediately (optimistic — not yet confirmed).
 */
feeBumperRouter.post("/submit-tx", async (req, res) => {
  const parsed = SubmitTxSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request", details: parsed.error.errors });
  }

  try {
    const result = await submitWithFeeBump(parsed.data.signedXdr);
    return res.json({ success: true, txHash: result.txHash });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[POST /submit-tx] Error:", message);
    return res.status(500).json({ error: message });
  }
});

/**
 * GET /api/sponsor
 * Returns the sponsor account's public key.
 * The frontend uses this to include the sponsor as a fee source.
 */
feeBumperRouter.get("/sponsor", (_req, res) => {
  res.json({ sponsorPublicKey });
});
