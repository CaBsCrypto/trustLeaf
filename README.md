# TrustLeaf 🌿

**The trust standard for the medicinal cannabis industry — built on Stellar/Soroban.**

- **Public traceability**: Every cannabis batch is fully traceable on-chain (origin, lab tests, custody chain)
- **Private identity**: Patient prescriptions are verified with Zero-Knowledge proofs (ZK-SNARKs / UltraHonk)
- **Wallet-less UX**: Users authenticate with biometrics (Face ID / Touch ID) via Passkeys — no seed phrases, no XLM fees

## Architecture

| Layer | Technology |
|-------|-----------|
| Smart Contracts | Rust / Soroban (Stellar) |
| ZK Proofs | Noir + Barretenberg (UltraHonk) |
| Auth | Passkey Kit (WebAuthn / secp256r1) |
| Indexer | Mercury / Zephyr |
| Frontend | Next.js 14, React, Tailwind CSS |
| Backend | Node.js (fee-bumper, ZK proof service) |
| Off-chain DB | Firestore |

## Monorepo Structure

```
contracts/          Soroban smart contracts (Rust workspace)
circuits/           Noir ZK circuits
indexer/            Mercury/Zephyr event indexer
backend/            Node.js services (fee-bumper, ZK prover)
frontend/           Next.js 14 application
bindings/           Auto-generated TypeScript contract bindings
scripts/            Deploy and utility scripts
docs/               Architecture and flow documentation
```

## Quick Start

### Prerequisites
- Rust + `stellar` CLI
- Nargo `v1.0.0-beta.9` + Barretenberg `bb` `v0.87.0`
- Node.js 20+ + pnpm 9+
- Stellar Testnet account (funded via Friendbot)

### Contracts
```bash
cd contracts
cargo test
cargo build --target wasm32-unknown-unknown --release
```

### Frontend
```bash
pnpm install
pnpm dev:frontend
```

## Golden Path (MVP)

```
Grower  →  creates cannabis batch (on-chain hash + Firestore metadata)
Doctor  →  submits commitment hash of patient prescription (ZK, no PII on-chain)
Patient →  generates ZK proof of prescription ownership → redeems at dispensary
Dispensary → verifies batch traceability + prescription validity → processes payment (USDC)
```

## Hackathon / Grant Track

Built for Stellar Meridian & SCF grants. Integrates:
- Protocol 25 BN254 host functions (`pairing_check`) for ZK verification
- Smart Wallets + Passkey Kit for wallet-less auth
- Fee Bumping (users never pay XLM)
- Mercury/Zephyr for fast event indexing
