/**
 * DeFindex / Payment wrapper
 *
 * MVP implementation: Direct SAC USDC transfer (no DeFindex vault setup needed).
 * The patient pays USDC directly to the dispensary's Stellar address.
 *
 * Future upgrade: Replace with DeFindex SDK for multi-asset support + yield.
 */

import { Asset, Operation, TransactionBuilder } from "@stellar/stellar-sdk";
import { NETWORK_PASSPHRASE, HORIZON_URL, rpc } from "./stellar";

// Testnet USDC SAC contract (Circle's USDC on Stellar Testnet)
export const USDC_ASSET = new Asset(
  "USDC",
  "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5"
);

export interface PaymentResult {
  /** Unsigned XDR — must be signed by patient's Smart Wallet */
  unsignedXdr: string;
}

/**
 * Build an unsigned USDC payment transaction.
 * The frontend signs this with the patient's passkey, then submits
 * to the fee-bumper service.
 */
export async function buildPaymentTx(
  fromAddress: string,
  toAddress: string,
  amountUsdc: string
): Promise<PaymentResult> {
  const { Horizon } = await import("@stellar/stellar-sdk");
  const server = new Horizon.Server(HORIZON_URL);

  const account = await server.loadAccount(fromAddress);

  const tx = new TransactionBuilder(account, {
    fee: "100",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      Operation.payment({
        destination: toAddress,
        asset: USDC_ASSET,
        amount: amountUsdc,
      })
    )
    .setTimeout(300)
    .build();

  return { unsignedXdr: tx.toXDR() };
}
