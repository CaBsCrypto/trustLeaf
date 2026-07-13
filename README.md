# TrustLeaf 🌿

**Patient-owned clinical records on Stellar blockchain — built for Latin America.**

> "I have chronic pain. For 7 years, every new doctor I saw started from scratch — because my medical records don't follow me. That's not just my problem. It's Latin America's."

TrustLeaf is a verified, patient-controlled medical record platform. Every diagnosis, prescription, and clinical event is signed by a licensed professional and anchored on the Stellar Soroban blockchain — immutable, portable, and always in the patient's hands.

🔗 **Live demo:** [trustleaf-demo.vercel.app](https://trustleaf-demo.vercel.app)

---

## What we've built

### For patients
- **Ficha clínica on-chain** — unified medical record: diagnoses (ICD-10), medications, vaccines, allergies
- **Pain diary** — daily symptom logging with 3D interactive body map, trend chart, and doctor share via WhatsApp
- **Optical module** — digital prescription management with QR for any optician
- **Dental module** — procedure history, X-rays, orthodontic tracking across providers
- **Emergency QR** — blood type, allergies, active medications — accessible without login or app

### For caregivers
- **Alzheimer caregiver portal** — cognitive episode diary (8 episode types), medication compliance, weekly neurologist report
- **Bilingual emergency QR** (ES/EN) — critical info for any ER in the world
- **Delegated access** — blockchain-enforced permission model (patient always controls their data)

### For doctors
- **Digital prescription signing** — Face ID authentication, no wallet or crypto knowledge required
- **Patient pain dashboard** — full pain history with body map and trend visualization before consultations
- **Verified audit trail** — every clinical event has a Stellar transaction hash

### For pharmacies
- **QR prescription verification** — scan and verify any TrustLeaf prescription in seconds

---

## Architecture

| Layer | Technology |
|-------|-----------|
| Smart Contracts | Rust / Soroban (Stellar) |
| Auth | Privy (email, Google, embedded wallet) |
| Frontend | Next.js 15, React, Tailwind CSS, TypeScript |
| 3D Body Map | Three.js (CDN-loaded, no SSR issues) |
| Charts | Recharts |
| Notifications | Resend (email), WhatsApp share API |
| Off-chain DB | Firebase (placeholder — FHIR-ready) |
| Payments | Stripe (deferred — free for patients/caregivers) |

## Pricing model

- **Patients & caregivers**: always free
- **Doctors**: % per consultation (no flat fee)
- **Clinics**: monthly SaaS

---

## Monorepo structure

```
contracts/          Soroban smart contracts (Rust — stubs written, testnet pending)
frontend/           Next.js 15 application
  src/app/
    patient/        Patient portal (ficha, pain-diary, optical, dental)
    caregiver/      Caregiver portal (Alzheimer, diary, medications, emergency QR)
    doctor/         Doctor portal (prescriptions, patient pain view)
    farmacia/       Pharmacy verification
    (auth)/login/   Privy auth + demo bypass
  src/components/
    pain/           BodyMap (SVG) + BodyMap3D (Three.js) + PainLogger
    landing/        Hero, UseCases, CaregiverTeaser, FichaOnchain3D
backend/            Node.js services (fee-bumper)
docs/               Architecture and flow documentation
```

---

## Quick start

### Prerequisites
- Node.js 20+
- npm or pnpm

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local   # fill in NEXT_PUBLIC_PRIVY_APP_ID
npm run dev
```

### Demo mode (no auth required)
Navigate to `/login` and use the **"Acceso demo"** buttons at the bottom — bypasses Privy and goes straight to any portal for testing.

### Key env vars
```
NEXT_PUBLIC_PRIVY_APP_ID=     # from privy.io
RESEND_API_KEY=               # for waitlist emails
NEXT_PUBLIC_APP_URL=https://trustleaf-demo.vercel.app
```

---

## Market context

- **TAM**: $8.2B (Latin American digital health)
- **No EHR incumbent** in Chile/LATAM (no Epic, no Athenahealth)
- **Government mandate**: Chile's Ministerio de Salud is mandating electronic prescriptions
- **Starting market**: Chile (19M people, 53% smartphone penetration, mandatory Fonasa/Isapre coverage)

---

## YC Application — Fall 2026

Applying to Y Combinator F2026. Deadline: **July 27, 2026**.

Key differentiators:
1. Founder is the user — 7 years of chronic pain across multiple specialists
2. Emergency QR works today — no roadmap, live demo
3. Caregiver market (53M globally) as a second native market nobody is serving
4. LATAM first — government mandate creates the forcing function

---

## Status

| Feature | Status |
|---------|--------|
| Patient portal | ✅ Live demo |
| Doctor signing | ✅ Live demo (Face ID simulated) |
| Pharmacy verification | ✅ Live demo |
| Caregiver / Alzheimer portal | ✅ Live demo |
| Optical & dental modules | ✅ Live demo |
| Emergency QR (bilingual) | ✅ Live demo |
| Soroban contracts | 🔧 Stubs written, testnet pending |
| Privy production credentials | 🔧 Pending domain setup |
| Firebase / real DB | 🔧 Deferred (DEMO_MODE = true) |
| Stripe payments | 🔧 Deferred until first paying customer |

---

© 2026 Browns Studio · TrustLeaf
