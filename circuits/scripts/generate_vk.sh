#!/usr/bin/env bash
# Generate the UltraHonk Verification Key (VK) from the compiled circuit.
# The VK hash is stored in the trust_leaf_zk_medical Soroban contract.
# Requires: bb (Barretenberg) v0.87.0
# Usage: bash circuits/scripts/generate_vk.sh
set -euo pipefail

CIRCUITS_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BYTECODE="$CIRCUITS_DIR/blind_prescription/target/blind_prescription.json"
VK_OUT="$CIRCUITS_DIR/blind_prescription/target/vk.bin"

if [ ! -f "$BYTECODE" ]; then
  echo "❌ Circuit not compiled yet. Run compile.sh first."
  exit 1
fi

echo "🔑 Generating verification key..."
bb write_vk \
  -b "$BYTECODE" \
  -o "$VK_OUT" \
  --scheme ultra_honk

echo "✅ VK written to: $VK_OUT"

# Compute and display the VK hash (what we store in the contract)
VK_HASH=$(sha256sum "$VK_OUT" | awk '{print $1}')
echo ""
echo "📋 VK SHA-256 hash (use this in deploy-contracts.sh):"
echo "   $VK_HASH"
