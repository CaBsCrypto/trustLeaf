/**
 * PasskeyKit Server instance (Next.js server-side only)
 *
 * PasskeyKit handles:
 *   - Deploying Smart Wallet contracts for new users
 *   - Verifying WebAuthn assertions
 *   - Building Soroban transactions for Smart Wallet invocations
 *
 * Docs: https://github.com/kalepail/passkey-kit
 */

// Dynamic import in server components to avoid bundling in client
export async function getPasskeyServer() {
  const { PasskeyServer } = await import("@passkey-kit/sdk");

  return new PasskeyServer({
    rpcUrl: process.env.NEXT_PUBLIC_STELLAR_RPC_URL ?? "https://soroban-testnet.stellar.org",
    // Launchtube: SDF's hosted fee relay for Testnet
    // For production: replace with self-hosted fee-bumper URL
    launchtubeUrl: process.env.LAUNCHTUBE_URL ?? "https://testnet.launchtube.xyz",
    launchtubeJwt: process.env.LAUNCHTUBE_JWT ?? "",
    networkPassphrase: "Test SDF Network ; September 2015",
  });
}
