"use client";

import { useHashVerify } from "../hooks/useHashVerify";

interface Props {
  batchId: string;
  onChainHashHex: string;
  /** Show the raw hashes (for power users / evaluators) */
  showHashes?: boolean;
}

/**
 * HashVerificationBadge
 *
 * Cross-checks the off-chain Firestore metadata hash against the on-chain
 * BytesN<32> stored in trust_leaf_traceability.
 *
 * ✅ VERIFIED — hashes match (data is authentic)
 * 🚨 TAMPERED — hashes differ (data was altered off-chain)
 */
export function HashVerificationBadge({ batchId, onChainHashHex, showHashes }: Props) {
  const { status, firestoreHash } = useHashVerify(batchId, onChainHashHex);

  return (
    <div className="inline-flex flex-col gap-1">
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
          status === "verified"
            ? "bg-green-900/40 border-green-500 text-green-300"
            : status === "tampered"
            ? "bg-red-900/40 border-red-500 text-red-300 animate-pulse"
            : status === "loading"
            ? "bg-gray-800 border-gray-600 text-gray-400"
            : "bg-yellow-900/40 border-yellow-500 text-yellow-300"
        }`}
      >
        <span>
          {status === "verified"
            ? "✅"
            : status === "tampered"
            ? "🚨"
            : status === "loading"
            ? "⏳"
            : "⚠️"}
        </span>
        <span>
          {status === "verified"
            ? "Verificado"
            : status === "tampered"
            ? "ALTERADO"
            : status === "loading"
            ? "Verificando..."
            : "Sin verificar"}
        </span>
      </div>

      {showHashes && status !== "loading" && (
        <div className="text-xs text-gray-500 font-mono">
          <div>On-chain: {onChainHashHex.slice(0, 16)}...</div>
          {firestoreHash && (
            <div>Firestore: {firestoreHash.slice(0, 16)}...</div>
          )}
        </div>
      )}
    </div>
  );
}
