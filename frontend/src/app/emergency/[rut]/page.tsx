// Copyright © 2026 Browns Studio
// PUBLIC PAGE — No authentication required.
// Accessible by scanning the patient's Emergency QR code.
"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

// ─── Mock patient data ────────────────────────────────────────────────────────

interface EmergencyPatient {
  name: string;
  rut: string;
  dob: string;
  bloodType: string;
  allergies: string[];
  medications: { name: string; dose: string; frequency: string }[];
  conditions: string[];
  emergencyContact: { name: string; relation: string; phone: string };
  lastUpdated: string;
  verifiedBy: string;
  stellarTxId: string;
}

const MOCK_PATIENTS: Record<string, EmergencyPatient> = {
  "12345678-9": {
    name: "Juan Pérez González",
    rut: "12.345.678-9",
    dob: "1985-03-12",
    bloodType: "O+",
    allergies: ["Penicilina", "Ibuprofeno", "Látex"],
    medications: [
      { name: "Pregabalina", dose: "75mg", frequency: "Cada 12 horas" },
      { name: "Tramadol", dose: "50mg", frequency: "Cada 8 horas (si dolor >6/10)" },
      { name: "Omeprazol", dose: "20mg", frequency: "En ayunas" },
    ],
    conditions: ["Dolor crónico neuropático", "Fibromialgia"],
    emergencyContact: {
      name: "María González Pérez",
      relation: "Cónyuge",
      phone: "+56 9 8765 4321",
    },
    lastUpdated: "2026-07-11",
    verifiedBy: "Dr. Carlos Soto · Neurólogo · CM-12345",
    stellarTxId: "STELLAR:a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
  },
  "98765432-1": {
    name: "Ana Martínez López",
    rut: "98.765.432-1",
    dob: "1972-09-28",
    bloodType: "A-",
    allergies: ["Aspirina", "Sulfas"],
    medications: [
      { name: "Atorvastatina", dose: "20mg", frequency: "Nocturna" },
      { name: "Losartán", dose: "50mg", frequency: "Mañana y noche" },
    ],
    conditions: ["Hipertensión arterial", "Dislipidemia"],
    emergencyContact: {
      name: "Roberto Martínez",
      relation: "Hermano",
      phone: "+56 9 1234 5678",
    },
    lastUpdated: "2026-07-08",
    verifiedBy: "Dr. Pedro Rojas · Cardiólogo · CM-54321",
    stellarTxId: "STELLAR:f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5" aria-hidden="true">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function PillIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5" aria-hidden="true">
      <path d="m10.5 20.5-8-8a5 5 0 0 1 7-7l8 8a5 5 0 0 1-7 7Z" />
      <path d="m8.5 8.5 7 7" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.63 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

// ─── i18n labels ──────────────────────────────────────────────────────────────

const LABELS = {
  es: {
    headerTitle: "Datos de Emergencia Médica",
    brandSub: "Acceso de emergencia · Sin login",
    patient: "Paciente",
    bloodLabel: "Sangre",
    allergiesTitle: "Alergias — No Administrar",
    medsTitle: "Medicamentos Actuales",
    conditionsTitle: "Diagnósticos Relevantes",
    contactTitle: "Contacto de Emergencia",
    verifiedTitle: "Datos verificados en Stellar Blockchain",
    lastUpdated: "Última actualización:",
    verifiedBy: "Verificado por:",
    footerNote: "Este QR fue generado por el paciente. Los datos son de acceso público de emergencia y no requieren login. TrustLeaf no almacena datos en servidores propios — todo está en Stellar Blockchain.",
    print: "Imprimir",
    notFoundTitle: "Paciente no encontrado",
    notFoundSub: "No hay datos de emergencia registrados para el RUT",
    testRut: "RUT de prueba: 12345678-9",
  },
  en: {
    headerTitle: "Medical Emergency Data",
    brandSub: "Emergency access · No login required",
    patient: "Patient",
    bloodLabel: "Blood",
    allergiesTitle: "Allergies — Do NOT Administer",
    medsTitle: "Current Medications",
    conditionsTitle: "Relevant Diagnoses",
    contactTitle: "Emergency Contact",
    verifiedTitle: "Data verified on Stellar Blockchain",
    lastUpdated: "Last updated:",
    verifiedBy: "Verified by:",
    footerNote: "This QR was generated by the patient. Data is publicly accessible for emergencies and requires no login. TrustLeaf stores no data on its own servers — everything is on Stellar Blockchain.",
    print: "Print",
    notFoundTitle: "Patient not found",
    notFoundSub: "No emergency data registered for RUT",
    testRut: "Test RUT: 12345678-9",
  },
} as const;

type Lang = "es" | "en";

export default function EmergencyPage() {
  const params = useParams();
  const [lang, setLang] = useState<Lang>("es");
  const t = LABELS[lang];

  useEffect(() => {
    fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event: "emergency_view" }) }).catch(() => {});
  }, []);

  const rutRaw = typeof params.rut === "string" ? params.rut : Array.isArray(params.rut) ? params.rut[0] : "";
  // Normalize: support both "123456789" and "12345678-9" and "12.345.678-9"
  const rutKey = decodeURIComponent(rutRaw).replace(/\./g, "").replace(/(\d{7,8})(\w)$/, "$1-$2");

  const patient = MOCK_PATIENTS[rutKey] ?? null;

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      {/* Emergency header strip */}
      <div className="bg-red-600 px-4 py-3 flex items-center justify-center gap-3">
        <HeartIcon />
        <span className="font-bold text-sm tracking-wide uppercase">{t.headerTitle}</span>
        <HeartIcon />
      </div>

      {/* TrustLeaf branding + language toggle + print */}
      <div className="border-b border-[#334155] px-4 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#10B981] flex items-center justify-center text-[#0F172A] font-bold text-xs">TL</div>
          <span className="text-white font-bold text-sm">TrustLeaf</span>
          <span className="text-[#64748B] text-xs hidden sm:inline">· {t.brandSub}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <div className="flex rounded-lg overflow-hidden border border-[#334155]">
            <button
              onClick={() => setLang("es")}
              className={`px-2.5 py-1 text-xs font-bold transition-colors ${lang === "es" ? "bg-[#10B981] text-[#0F172A]" : "text-[#64748B] hover:text-white"}`}
            >
              ES
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 text-xs font-bold transition-colors ${lang === "en" ? "bg-[#10B981] text-[#0F172A]" : "text-[#64748B] hover:text-white"}`}
            >
              EN
            </button>
          </div>
          {/* Print button */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#334155] text-[#64748B] hover:text-white hover:border-[#475569] transition-colors text-xs font-medium"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            {t.print}
          </button>
          <div className="flex items-center gap-1 text-[#10B981] text-xs font-semibold">
            <ShieldIcon />
            <span className="hidden sm:inline">Blockchain</span>
          </div>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {patient ? (
          <>
            {/* Patient identity */}
            <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[#64748B] text-xs mb-1">{t.patient}</p>
                  <h1 className="text-white text-xl font-bold">{patient.name}</h1>
                  <p className="text-[#64748B] text-sm mt-1">
                    RUT {patient.rut} · {getAge(patient.dob)} años
                  </p>
                </div>
                {/* Blood type — big and prominent */}
                <div className="shrink-0 w-16 h-16 rounded-2xl bg-red-900/40 border-2 border-red-500 flex flex-col items-center justify-center">
                  <span className="text-red-400 text-xs font-bold">{t.bloodLabel}</span>
                  <span className="text-red-300 text-2xl font-extrabold leading-none">{patient.bloodType}</span>
                </div>
              </div>
            </div>

            {/* ALLERGIES — most important, first */}
            <div className="rounded-2xl border-2 border-red-700 bg-red-900/10 p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertIcon />
                <h2 className="text-red-400 font-bold uppercase tracking-wide text-sm">
                  {t.allergiesTitle}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {patient.allergies.map((allergy) => (
                  <span
                    key={allergy}
                    className="px-4 py-2 rounded-xl bg-red-900/40 border border-red-700 text-red-300 font-bold text-sm"
                  >
                    ⚠️ {allergy}
                  </span>
                ))}
              </div>
              {patient.allergies.length === 0 && (
                <p className="text-[#64748B] text-sm">Sin alergias conocidas registradas.</p>
              )}
            </div>

            {/* Current medications */}
            <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-5">
              <div className="flex items-center gap-2 mb-4">
                <PillIcon />
                <h2 className="text-white font-bold text-sm">{t.medsTitle}</h2>
              </div>
              <div className="space-y-3">
                {patient.medications.map((med, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[#0F172A]">
                    <div className="w-1.5 h-full min-h-[40px] rounded-full bg-[#10B981] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-semibold">
                        {med.name} <span className="text-[#10B981] font-bold">{med.dose}</span>
                      </p>
                      <p className="text-[#64748B] text-xs mt-0.5">{med.frequency}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conditions */}
            {patient.conditions.length > 0 && (
              <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-5">
                <h2 className="text-white font-bold text-sm mb-3">{t.conditionsTitle}</h2>
                <div className="flex flex-wrap gap-2">
                  {patient.conditions.map((c) => (
                    <span
                      key={c}
                      className="px-3 py-1.5 rounded-lg bg-blue-900/30 border border-blue-700 text-blue-300 text-sm"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Emergency contact */}
            <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-5">
              <div className="flex items-center gap-2 mb-3">
                <PhoneIcon />
                <h2 className="text-white font-bold text-sm">{t.contactTitle}</h2>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">{patient.emergencyContact.name}</p>
                  <p className="text-[#64748B] text-sm">{patient.emergencyContact.relation}</p>
                </div>
                <a
                  href={`tel:${patient.emergencyContact.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#10B981] text-[#0F172A] font-bold text-sm"
                >
                  <PhoneIcon />
                  {patient.emergencyContact.phone}
                </a>
              </div>
            </div>

            {/* Blockchain verification */}
            <div className="rounded-2xl border border-[#10B981]/30 bg-[#10B981]/5 p-4">
              <div className="flex items-start gap-3">
                <ShieldIcon />
                <div>
                  <p className="text-[#10B981] font-semibold text-sm">{t.verifiedTitle}</p>
                  <p className="text-[#64748B] text-xs mt-1">
                    {t.lastUpdated} {formatDate(patient.lastUpdated)}
                  </p>
                  <p className="text-[#64748B] text-xs mt-0.5">{t.verifiedBy} {patient.verifiedBy}</p>
                  <p className="text-[#334155] font-mono text-xs mt-1.5 break-all">{patient.stellarTxId}</p>
                </div>
              </div>
            </div>

            {/* Footer notice */}
            <p className="text-center text-[#475569] text-xs pb-4">
              {t.footerNote}
            </p>
          </>
        ) : (
          /* Not found */
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-[#1E293B] border-2 border-[#334155] flex items-center justify-center mx-auto mb-5">
              <AlertIcon />
            </div>
            <h1 className="text-xl font-bold text-white mb-2">{t.notFoundTitle}</h1>
            <p className="text-[#64748B] text-sm mb-4">
              {t.notFoundSub}{" "}
              <span className="font-mono text-[#94A3B8]">{rutRaw}</span>.
            </p>
            <p className="text-[#475569] text-xs">
              {t.testRut}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
