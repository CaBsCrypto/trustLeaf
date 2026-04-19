#!/usr/bin/env bash
# Fund test accounts and configure Stellar Testnet environment
# Usage: bash scripts/setup-testnet.sh
set -euo pipefail

NETWORK="testnet"
STELLAR="stellar"

echo "🌐 Setting up Stellar Testnet environment..."

# ── 1. Add Testnet network config if not present ─────────────────────────────
if ! $STELLAR network ls | grep -q "$NETWORK"; then
  echo "  Adding testnet network..."
  $STELLAR network add \
    --global testnet \
    --rpc-url https://soroban-testnet.stellar.org \
    --network-passphrase "Test SDF Network ; September 2015"
fi

# ── 2. Generate and fund accounts ─────────────────────────────────────────────
accounts=("admin" "grower" "doctor" "dispensary" "lab" "sponsor")

for account in "${accounts[@]}"; do
  if ! $STELLAR keys ls | grep -q "$account"; then
    echo "  Generating keypair: $account"
    $STELLAR keys generate --global "$account" --network $NETWORK
  fi

  echo "  Funding $account via Friendbot..."
  addr=$($STELLAR keys address "$account")
  curl -s "https://friendbot.stellar.org?addr=$addr" > /dev/null
  echo "    → $addr"
done

echo ""
echo "✅ Accounts funded. Save these addresses in .env.testnet:"
echo ""
for account in "${accounts[@]}"; do
  addr=$($STELLAR keys address "$account")
  varname="${account^^}_ADDRESS"
  echo "  $varname=$addr"
done
