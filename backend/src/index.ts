/**
 * TrustLeaf Backend API
 * Exposes:
 *   POST /api/submit-tx     — Fee-bump service (gas-less transactions)
 *   GET  /api/sponsor       — Sponsor public key
 *   POST /api/zk/commitment — Doctor: generate prescription commitment
 *   POST /api/zk/prove      — Patient: generate ZK proof
 *   POST /api/zk/nullifier  — Compute nullifier
 *   GET  /health            — Health check
 */

import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { feeBumperRouter } from "./fee-bumper/routes";
import { zkRouter } from "./zk/routes";

const app = express();
const PORT = process.env.PORT ?? 3001;

// ── Security middleware ────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL ?? "http://localhost:3000" }));
app.use(express.json({ limit: "1mb" })); // proof bytes can be ~3KB

// Rate limiting — ZK proof generation is expensive
app.use(
  "/api/zk/prove",
  rateLimit({ windowMs: 60_000, max: 10, message: "Too many proof requests" })
);
app.use(
  "/api/submit-tx",
  rateLimit({ windowMs: 60_000, max: 60, message: "Too many tx submissions" })
);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api", feeBumperRouter);
app.use("/api/zk", zkRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Start ──────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 TrustLeaf backend running on http://localhost:${PORT}`);
  console.log(`   Sponsor: ${process.env.SPONSOR_SECRET_KEY ? "✅ configured" : "❌ SPONSOR_SECRET_KEY missing"}`);
});

export default app;
