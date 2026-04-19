#!/usr/bin/env bash
# Compile the blind_prescription Noir circuit to bytecode.
# Requires: nargo v1.0.0-beta.9
# Usage: bash circuits/scripts/compile.sh
set -euo pipefail

CIRCUITS_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "🔧 Compiling blind_prescription circuit..."
cd "$CIRCUITS_DIR/blind_prescription"
nargo compile

echo "✅ Compiled: $CIRCUITS_DIR/blind_prescription/target/blind_prescription.json"
