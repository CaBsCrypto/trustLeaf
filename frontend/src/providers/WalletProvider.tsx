"use client";

import React, { createContext, useEffect, useState } from "react";

interface WalletContextValue {
  passkeyKit: unknown | null;
  walletAddress: string | null;
  setWalletAddress: (addr: string | null) => void;
  role: string | null;
  setRole: (role: string | null) => void;
}

export const WalletContext = createContext<WalletContextValue>({
  passkeyKit: null,
  walletAddress: null,
  setWalletAddress: () => {},
  role: null,
  setRole: () => {},
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [passkeyKit, setPasskeyKit] = useState<unknown | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // Initialise PasskeyKit on mount (client-side only)
  useEffect(() => {
    async function init() {
      const { PasskeyKit } = await import("@passkey-kit/sdk");
      const kit = new PasskeyKit({
        rpcUrl: process.env.NEXT_PUBLIC_STELLAR_RPC_URL ?? "https://soroban-testnet.stellar.org",
        networkPassphrase: "Test SDF Network ; September 2015",
        walletWasmHash: process.env.NEXT_PUBLIC_WALLET_WASM_HASH ?? "",
      });
      setPasskeyKit(kit);

      // Restore session from localStorage
      const storedWallet = localStorage.getItem("tl_wallet");
      const storedRole = localStorage.getItem("tl_role");
      if (storedWallet) setWalletAddress(storedWallet);
      if (storedRole) setRole(storedRole);
    }
    init().catch(console.error);
  }, []);

  return (
    <WalletContext.Provider
      value={{ passkeyKit, walletAddress, setWalletAddress, role, setRole }}
    >
      {children}
    </WalletContext.Provider>
  );
}
