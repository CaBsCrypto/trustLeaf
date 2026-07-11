export const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";
export const RPC_URL = process.env.NEXT_PUBLIC_STELLAR_RPC_URL ?? "https://soroban-testnet.stellar.org";
export const HORIZON_URL = process.env.NEXT_PUBLIC_STELLAR_HORIZON_URL ?? "https://horizon-testnet.stellar.org";

// Lazy getter — avoids sodium-native crash during static prerendering
let _rpc: unknown = null;
export function getRpc() {
  if (!_rpc) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { SorobanRpc } = require("@stellar/stellar-sdk");
    _rpc = new SorobanRpc.Server(RPC_URL);
  }
  return _rpc;
}
/** @deprecated use getRpc() */
export const rpc = { Server: null } as unknown as { sendTransaction: never };

export const CONTRACT_IDS = {
  rbac: process.env.NEXT_PUBLIC_RBAC_CONTRACT_ID ?? "",
  traceability: process.env.NEXT_PUBLIC_TRACEABILITY_CONTRACT_ID ?? "",
  zkMedical: process.env.NEXT_PUBLIC_ZK_MEDICAL_CONTRACT_ID ?? "",
};

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";
