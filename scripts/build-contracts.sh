#!/usr/bin/env bash
# Build all TrustLeaf Soroban contracts to WASM
# Usage: bash scripts/build-contracts.sh
set -euo pipefail

CONTRACTS_DIR="$(cd "$(dirname "$0")/../contracts" && pwd)"

echo "🔨 Building TrustLeaf contracts..."

contracts=("trust_leaf_rbac" "trust_leaf_traceability" "trust_leaf_zk_medical")

for contract in "${contracts[@]}"; do
  echo "  Building $contract..."
  stellar contract build \
    --manifest-path "$CONTRACTS_DIR/$contract/Cargo.toml" \
    --target-dir "$CONTRACTS_DIR/target"

  wasm_path="$CONTRACTS_DIR/target/wasm32-unknown-unknown/release/${contract//-/_}.wasm"
  if [ -f "$wasm_path" ]; then
    size=$(wc -c < "$wasm_path")
    echo "  ✅ $contract — ${size} bytes (limit: 65536)"
    if [ "$size" -gt 65536 ]; then
      echo "  ⚠️  WARNING: WASM exceeds 64KB limit!"
    fi
  fi
done

echo ""
echo "✅ All contracts built successfully."
