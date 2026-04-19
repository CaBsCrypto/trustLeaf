import "dotenv/config";

export const config = {
  /** Mercury/Zephyr API key — obtain from https://main.mercurydata.app */
  mercuryApiKey: process.env.MERCURY_API_KEY ?? "",

  /** Mercury backend URL (Testnet) */
  mercuryBackendUrl:
    process.env.MERCURY_BACKEND_URL ??
    "https://api.mercurydata.app:2083",

  /** Soroban RPC URL */
  rpcUrl:
    process.env.STELLAR_RPC_URL ??
    "https://soroban-testnet.stellar.org",

  /** Contract IDs — populated after deploy-contracts.sh */
  contracts: {
    rbac: process.env.RBAC_CONTRACT_ID ?? "",
    traceability: process.env.TRACEABILITY_CONTRACT_ID ?? "",
    zkMedical: process.env.ZK_MEDICAL_CONTRACT_ID ?? "",
  },

  /** Firestore — for writing indexed data back to off-chain DB */
  firestoreProjectId: process.env.FIREBASE_PROJECT_ID ?? "",
};
