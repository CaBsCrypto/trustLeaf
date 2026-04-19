"use client";

import { useState, useCallback, useContext } from "react";
import { WalletContext } from "../providers/WalletProvider";
import { BACKEND_URL } from "../lib/stellar";
import { toast } from "sonner";

export function usePasskey() {
  const { passkeyKit, walletAddress, setWalletAddress } = useContext(WalletContext);
  const [loading, setLoading] = useState(false);

  const register = useCallback(
    async (username: string) => {
      if (!passkeyKit) return;
      setLoading(true);
      try {
        const { keyId, address } = await passkeyKit.createWallet(
          "TrustLeaf",
          username
        );
        setWalletAddress(address);
        localStorage.setItem("tl_keyId", keyId);
        localStorage.setItem("tl_wallet", address);
        toast.success("Wallet created successfully!");
        return { keyId, address };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Registration failed";
        toast.error(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [passkeyKit, setWalletAddress]
  );

  const connect = useCallback(async () => {
    if (!passkeyKit) return;
    setLoading(true);
    try {
      const storedKeyId = localStorage.getItem("tl_keyId");
      const { address } = await passkeyKit.connectWallet({ keyId: storedKeyId ?? undefined });
      setWalletAddress(address);
      localStorage.setItem("tl_wallet", address);
      return address;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Connection failed";
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [passkeyKit, setWalletAddress]);

  const sign = useCallback(
    async (unsignedXdr: string): Promise<string> => {
      if (!passkeyKit) throw new Error("PasskeyKit not initialized");
      const { signedTxXdr } = await passkeyKit.sign({ xdr: unsignedXdr });
      return signedTxXdr;
    },
    [passkeyKit]
  );

  const signAndSubmit = useCallback(
    async (unsignedXdr: string): Promise<string> => {
      const signedXdr = await sign(unsignedXdr);
      const res = await fetch(`${BACKEND_URL}/api/submit-tx`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signedXdr }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submission failed");
      return data.txHash as string;
    },
    [sign]
  );

  const disconnect = useCallback(() => {
    setWalletAddress(null);
    localStorage.removeItem("tl_keyId");
    localStorage.removeItem("tl_wallet");
  }, [setWalletAddress]);

  return { register, connect, sign, signAndSubmit, disconnect, loading, walletAddress };
}
