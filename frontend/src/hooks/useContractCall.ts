"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { usePasskey } from "./usePasskey";

interface OptimisticCallOptions<T> {
  /** Build the unsigned XDR for the Soroban call */
  buildXdr: () => Promise<string>;
  /** Apply optimistic state change immediately */
  optimisticUpdate: () => void;
  /** Roll back if the transaction fails */
  rollback: () => void;
  /** Optional success message */
  successMessage?: string;
  /** Optional callback on confirmed success */
  onSuccess?: (txHash: string, result: T) => void;
}

/**
 * useContractCall — Optimistic UI pattern for Soroban contract calls.
 *
 * 1. Apply optimistic update immediately (instant UI feedback)
 * 2. Sign with passkey
 * 3. Submit to fee-bumper service in background
 * 4. Roll back if submission fails
 * 5. Confirm in background (poll transaction status)
 */
export function useContractCall<T = void>() {
  const { signAndSubmit } = usePasskey();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (options: OptimisticCallOptions<T>): Promise<string | null> => {
      const { buildXdr, optimisticUpdate, rollback, successMessage } = options;

      setPending(true);
      setError(null);

      // ── 1. Optimistic update ─────────────────────────────────────────────
      optimisticUpdate();

      try {
        // ── 2. Build + sign + submit ─────────────────────────────────────
        const unsignedXdr = await buildXdr();
        const txHash = await signAndSubmit(unsignedXdr);

        if (successMessage) {
          toast.success(successMessage, {
            description: `TX: ${txHash.slice(0, 8)}...`,
          });
        }

        return txHash;
      } catch (err: unknown) {
        // ── 3. Roll back on failure ──────────────────────────────────────
        rollback();
        const message = err instanceof Error ? err.message : "Transaction failed";
        setError(message);
        toast.error("Transaction failed", { description: message });
        return null;
      } finally {
        setPending(false);
      }
    },
    [signAndSubmit]
  );

  return { execute, pending, error };
}
