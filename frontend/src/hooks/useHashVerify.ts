"use client";

import { useState, useEffect } from "react";

export type VerificationStatus = "loading" | "verified" | "tampered" | "error";

/**
 * Cross-verify a batch's off-chain Firestore hash against the on-chain hash.
 * If they match → "verified" ✅
 * If they differ → "tampered" 🚨
 */
export function useHashVerify(
  batchId: string,
  onChainHashHex: string
): { status: VerificationStatus; firestoreHash: string | null } {
  const [status, setStatus] = useState<VerificationStatus>("loading");
  const [firestoreHash, setFirestoreHash] = useState<string | null>(null);

  useEffect(() => {
    if (!batchId || !onChainHashHex) return;

    async function verify() {
      try {
        const res = await fetch(`/api/batches/${batchId}/hash`);
        if (!res.ok) {
          setStatus("error");
          return;
        }
        const { hash } = await res.json() as { hash: string };
        setFirestoreHash(hash);

        // Compare (case-insensitive hex)
        if (hash.toLowerCase() === onChainHashHex.toLowerCase()) {
          setStatus("verified");
        } else {
          setStatus("tampered");
        }
      } catch {
        setStatus("error");
      }
    }

    verify();
  }, [batchId, onChainHashHex]);

  return { status, firestoreHash };
}
