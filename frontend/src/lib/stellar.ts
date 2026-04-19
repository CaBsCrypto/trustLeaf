import { SorobanRpc, Networks } from "@stellar/stellar-sdk";

export const NETWORK_PASSPHRASE = Networks.TESTNET;
export const RPC_URL = process.env.NEXT_PUBLIC_STELLAR_RPC_URL ?? "https://soroban-testnet.stellar.org";
export const HORIZON_URL = process.env.NEXT_PUBLIC_STELLAR_HORIZON_URL ?? "https://horizon-testnet.stellar.org";

export const rpc = new SorobanRpc.Server(RPC_URL);

export const CONTRACT_IDS = {
  rbac: process.env.NEXT_PUBLIC_RBAC_CONTRACT_ID ?? "",
  traceability: process.env.NEXT_PUBLIC_TRACEABILITY_CONTRACT_ID ?? "",
  zkMedical: process.env.NEXT_PUBLIC_ZK_MEDICAL_CONTRACT_ID ?? "",
};

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";
