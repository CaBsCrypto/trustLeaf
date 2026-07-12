# TrustLeaf — Soroban Testnet Setup
## Guía para deployar los contratos reales a Stellar testnet

**Tiempo estimado:** 45–90 minutos  
**Prerequisito:** Rust instalado (`rustup`)

> ⚠️ **IMPORTANTE:** Los contratos de producción están en `trustLeaf/contracts/`, NO en `antigravity/soroban_contracts/`.
> Los stubs en `antigravity/` son borradores obsoletos — ignóralos.

---

## Contratos existentes (SDK 22.0.0 + OpenZeppelin)

```
trustLeaf/contracts/
├── Cargo.toml                     ← workspace principal
├── shared/                        ← tipos compartidos
├── trust_leaf_rbac/               ← RBAC con OZ AccessControl ← EMPEZAR AQUÍ
├── trust_leaf_traceability/       ← trazabilidad de lotes cannabis
└── trust_leaf_zk_medical/        ← recetas ZK con UltraHonk proofs
```

**Dependencias clave:**
- `soroban-sdk = "22.0.0"` 
- `stellar-access = "0.7.1"` (OpenZeppelin)
- `stellar-contract-utils = "0.7.1"`

---

## Paso 1 — Instalar herramientas

```bash
# Rust target para WASM
rustup target add wasm32-unknown-unknown

# Stellar CLI (nueva CLI unificada — reemplaza soroban-cli)
cargo install --locked stellar-cli --features opt

# Verificar instalación
stellar --version
# Debe mostrar: stellar 22.x.x
```

---

## Paso 2 — Compilar

```bash
cd trustLeaf/contracts/

# Compilar el más simple primero: RBAC (no tiene dependencias externas)
stellar contract build --package trust-leaf-rbac

# Si compila bien, verás:
# target/wasm32-unknown-unknown/release/trust_leaf_rbac.wasm

# Luego los demás:
stellar contract build --package trust-leaf-traceability
stellar contract build --package trust-leaf-zk-medical
```

### Errores comunes:

| Error | Fix |
|-------|-----|
| `stellar-access` no encontrado | `cargo update` en el workspace |
| `symbol_short!` con string > 9 chars | Usar strings de máx 9 caracteres |
| `no_std` + `std::string::String` | Usar `soroban_sdk::String` siempre |

---

## Paso 3 — Configurar testnet

```bash
# Crear identidad local (keypair)
stellar keys generate --global trustleaf-admin --network testnet

# Ver la dirección pública
stellar keys address trustleaf-admin

# Fondear en testnet (Friendbot — gratuito)
stellar keys fund trustleaf-admin --network testnet
```

---

## Paso 4 — Deploy del primer contrato (RBAC)

```bash
# Deploy trust_leaf_rbac a testnet
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/trust_leaf_rbac.wasm \
  --source trustleaf-admin \
  --network testnet

# Output: CONTRACT_ID (algo como CCF3QL3EJKBV7PVFKJ2...)
# Guardar este ID — lo necesitarán los otros contratos
export RBAC_CONTRACT_ID="CCF3QL3..."
```

---

## Paso 5 — Inicializar RBAC

```bash
stellar contract invoke \
  --id $RBAC_CONTRACT_ID \
  --source trustleaf-admin \
  --network testnet \
  -- initialize \
  --admin $(stellar keys address trustleaf-admin)

# Verificar:
stellar contract invoke \
  --id $RBAC_CONTRACT_ID \
  --source trustleaf-admin \
  --network testnet \
  -- is_initialized
# Debe retornar: true
```

---

## Paso 6 — Deploy ZK Medical (necesita RBAC primero)

```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/trust_leaf_zk_medical.wasm \
  --source trustleaf-admin \
  --network testnet

export ZK_CONTRACT_ID="C..."

# Inicializar con el RBAC contract y un vk_hash de prueba (32 bytes)
stellar contract invoke \
  --id $ZK_CONTRACT_ID \
  --source trustleaf-admin \
  --network testnet \
  -- initialize \
  --rbac_contract $RBAC_CONTRACT_ID \
  --vk_hash 0000000000000000000000000000000000000000000000000000000000000001
```

---

## Paso 7 — Verificar en Stellar Explorer

```
https://stellar.expert/explorer/testnet/contract/<CONTRACT_ID>
```

Si ves los contratos ahí → **TRUSTLEAF EN BLOCKCHAIN REAL** ✅

---

## Paso 8 — Otorgar rol DOCTOR al médico demo

```bash
# Crear keypair para el médico demo
stellar keys generate --global dr-demo --network testnet

# Otorgar rol DOCTOR vía RBAC
stellar contract invoke \
  --id $RBAC_CONTRACT_ID \
  --source trustleaf-admin \
  --network testnet \
  -- grant_role \
  --caller $(stellar keys address trustleaf-admin) \
  --account $(stellar keys address dr-demo) \
  --role DOCTOR

# Verificar:
stellar contract invoke \
  --id $RBAC_CONTRACT_ID \
  --source trustleaf-admin \
  --network testnet \
  -- has_role \
  --account $(stellar keys address dr-demo) \
  --role DOCTOR
```

---

## Paso 9 — Actualizar el frontend

```typescript
// frontend/src/lib/stellar.ts
export const RBAC_CONTRACT_ID = "CCF3QL3...";    // ← tu RBAC contract ID
export const ZK_MEDICAL_CONTRACT_ID = "C...";   // ← tu ZK contract ID
export const STELLAR_NETWORK = "testnet";
```

---

## Orden recomendado:

1. **trust_leaf_rbac** ← empezar aquí (no tiene dependencias)
2. **trust_leaf_zk_medical** ← segundo (llama a RBAC)
3. **trust_leaf_traceability** ← tercero (cannabis batch tracking)

---

## Para el YC application:

Una vez deployado RBAC + ZK Medical, el texto de "How far along" cambia a:

> "Two Soroban contracts deployed to Stellar testnet: TrustLeafRbac (OZ AccessControl) at [ID] and TrustLeafZkMedical (UltraHonk ZK proofs) at [ID]. Viewable at stellar.expert."

Eso es mucho más fuerte que "stubs escritos". Contratos reales con OZ + ZK en testnet = producto serio.

---

## Links útiles:

- Stellar Testnet Explorer: https://stellar.expert/explorer/testnet
- Stellar Friendbot: https://friendbot.stellar.org
- Stellar CLI docs: https://developers.stellar.org/docs/tools/stellar-cli
- OpenZeppelin Stellar: https://github.com/OpenZeppelin/stellar-contracts
- Soroban examples: https://github.com/stellar/soroban-examples
