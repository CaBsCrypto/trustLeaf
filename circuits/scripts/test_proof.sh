#!/usr/bin/env bash
# Full ZK pipeline test: compile → generate witness → prove → verify
# Requires: nargo v1.0.0-beta.9, bb v0.87.0
# Usage: bash circuits/scripts/test_proof.sh
set -euo pipefail

CIRCUITS_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CIRCUIT_DIR="$CIRCUITS_DIR/blind_prescription"
TARGET="$CIRCUIT_DIR/target"

echo "🧪 Running full ZK pipeline test..."

# ── Step 1: Run Noir tests ─────────────────────────────────────────────────────
echo ""
echo "  1/5 Running nargo tests..."
cd "$CIRCUIT_DIR"
nargo test
echo "  ✅ All Noir circuit tests passed"

# ── Step 2: Compile ────────────────────────────────────────────────────────────
echo ""
echo "  2/5 Compiling circuit..."
nargo compile
echo "  ✅ Circuit compiled"

# ── Step 3: Generate test witness (Prover.toml) ────────────────────────────────
echo ""
echo "  3/5 Generating test witness..."

# Example patient: patient_id=42, nonce=99, dispensary=12345678
# These values match the `test_valid_proof_passes` circuit test.
cat > "$CIRCUIT_DIR/Prover.toml" <<'EOF'
# Test inputs — do NOT use in production
patient_id = "42"
nonce = "99"
dispensary = "12345678"
EOF

nargo execute witness
echo "  ✅ Witness generated: $TARGET/witness.gz"

# ── Step 4: Generate proof ─────────────────────────────────────────────────────
echo ""
echo "  4/5 Generating UltraHonk proof (this may take 10-30s)..."
bb prove \
  -b "$TARGET/blind_prescription.json" \
  -w "$TARGET/witness.gz" \
  -o "$TARGET/proof.bin" \
  --scheme ultra_honk
echo "  ✅ Proof generated: $TARGET/proof.bin"

PROOF_SIZE=$(wc -c < "$TARGET/proof.bin")
echo "     Proof size: ${PROOF_SIZE} bytes"

# ── Step 5: Verify proof locally ──────────────────────────────────────────────
echo ""
echo "  5/5 Verifying proof with bb..."
bb verify \
  -k "$TARGET/vk.bin" \
  -p "$TARGET/proof.bin" \
  --scheme ultra_honk
echo "  ✅ Proof verified locally!"

echo ""
echo "🎉 Full ZK pipeline test passed!"
echo "   Next step: submit proof to trust_leaf_zk_medical.verify_and_consume()"
