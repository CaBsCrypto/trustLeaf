/** Normalized Soroban event from Mercury */
export interface SorobanEvent {
  contractId: string;
  ledger: number;
  ledgerTimestamp: number; // Unix seconds
  txHash: string;
  topic: unknown[];
  data: unknown[];
}
