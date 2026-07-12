// Copyright © 2026 Browns Studio
"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Demo prescription shown after verification ───────────────────────────────

const DEMO_RX = {
  rxId: "RX-T8R4M4D0L",
  medication: "Tramadol 50mg",
  doctorName: "Dr. Jorge García",
  doctorLicense: "JG-11111",
  patient: "Juan Pérez (Demo)",
  doses: "1 comprimido cada 8 horas",
  expiryDate: "20 jul 2026",
  isControlled: true,
  status: "Válida · Verificada en blockchain",
};

// ─── Icons (inline) ───────────────────────────────────────────────────────────

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function QrIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <path d="M14 14h.01M18 14h.01M14 18h.01M18 18h.01M14 22h.01M22 14h.01M22 22h.01" />
    </svg>
  );
}

function PillIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M10.5 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v3" />
      <circle cx="18" cy="18" r="3" />
      <path d="m15.5 15.5 5 5" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Stage = "idle" | "loading" | "found" | "dispensing" | "done";

export default function FarmaciaPage() {
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<Stage>("idle");

  function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setStage("loading");
    setTimeout(() => setStage("found"), 900);
  }

  function handleDispense() {
    setStage("dispensing");
    setTimeout(() => setStage("done"), 1500);
  }

  function handleReset() {
    setCode("");
    setStage("idle");
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-[#334155] px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#10B981] flex items-center justify-center text-[#0F172A] font-bold text-sm">
            TL
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">TrustLeaf</p>
            <p className="text-[#64748B] text-xs leading-tight">Portal Farmacia</p>
          </div>
        </div>
        <Link
          href="/demo"
          className="text-xs text-[#64748B] hover:text-[#10B981] transition-colors"
        >
          ← Volver al demo
        </Link>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-start px-4 py-10 gap-6 max-w-xl mx-auto w-full">
        {/* Title */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center mx-auto mb-4">
            <ShieldIcon className="w-7 h-7 text-[#10B981]" />
          </div>
          <h1 className="text-2xl font-bold text-white">Portal Farmacia — TrustLeaf</h1>
          <p className="text-[#64748B] text-sm mt-2">
            Verificación de recetas en blockchain · Stellar Network
          </p>
        </div>

        {/* Verify form */}
        <div className="w-full bg-[#1E293B] rounded-2xl border border-[#334155] p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <QrIcon className="w-4 h-4 text-[#10B981]" />
            <h2 className="text-white font-semibold">Verificar Receta</h2>
          </div>
          <p className="text-[#64748B] text-sm">
            Ingresa el código de receta o escanea el QR del paciente
          </p>

          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (stage !== "idle") setStage("idle");
              }}
              placeholder="RX-T8R4M4D0L"
              className="w-full bg-[#0F172A] border border-[#334155] focus:border-[#10B981] text-white text-base rounded-xl px-4 py-3 outline-none placeholder-[#475569] transition-colors font-mono"
            />
            <button
              type="submit"
              disabled={stage === "loading" || !code.trim()}
              className="w-full sm:w-auto px-5 py-3 bg-[#10B981] hover:bg-[#059669] disabled:bg-[#1E293B] disabled:text-[#475569] text-[#0F172A] font-bold rounded-xl transition-colors text-sm min-h-[48px]"
            >
              {stage === "loading" ? "…" : "Verificar"}
            </button>
          </form>

          {/* Demo hint */}
          <button
            onClick={() => setCode("RX-T8R4M4D0L")}
            className="text-xs text-[#475569] hover:text-[#10B981] font-mono transition-colors"
          >
            Usar código demo: RX-T8R4M4D0L
          </button>
        </div>

        {/* Loading */}
        {stage === "loading" && (
          <div className="w-full bg-[#1E293B] rounded-2xl border border-[#334155] p-10 text-center">
            <div className="w-8 h-8 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-[#64748B] text-sm">Consultando Stellar Network…</p>
          </div>
        )}

        {/* Found prescription */}
        {(stage === "found" || stage === "dispensing" || stage === "done") && (
          <div className="w-full rounded-2xl border-2 border-emerald-700 bg-emerald-900/10 p-6 space-y-5">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/40 border border-emerald-700 flex items-center justify-center shrink-0">
                <ShieldIcon className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-emerald-400 font-bold text-sm">{DEMO_RX.status}</p>
                <p className="text-[#64748B] text-xs font-mono mt-0.5">{DEMO_RX.rxId}</p>
              </div>
            </div>

            {/* Controlled alert */}
            {DEMO_RX.isControlled && (
              <div className="flex items-start gap-3 p-4 bg-orange-900/20 border border-orange-700 rounded-xl">
                <AlertIcon className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-orange-300 font-semibold text-sm">Medicamento Controlado</p>
                  <p className="text-orange-400/80 text-xs mt-0.5">
                    Requiere registro en libro de control y verificación de identidad.
                  </p>
                </div>
              </div>
            )}

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0F172A] rounded-xl p-4 col-span-2">
                <p className="text-[#64748B] text-xs mb-1">Medicamento</p>
                <div className="flex items-center gap-2">
                  <PillIcon className="w-4 h-4 text-[#10B981]" />
                  <p className="text-white font-bold">{DEMO_RX.medication}</p>
                </div>
                <p className="text-[#64748B] text-xs mt-1">{DEMO_RX.doses}</p>
              </div>
              <div className="bg-[#0F172A] rounded-xl p-4">
                <p className="text-[#64748B] text-xs mb-1">Paciente</p>
                <p className="text-white text-sm font-semibold">{DEMO_RX.patient}</p>
              </div>
              <div className="bg-[#0F172A] rounded-xl p-4">
                <p className="text-[#64748B] text-xs mb-1">Médico</p>
                <p className="text-white text-sm font-semibold">{DEMO_RX.doctorName}</p>
                <p className="text-[#64748B] text-xs font-mono">Lic. {DEMO_RX.doctorLicense}</p>
              </div>
              <div className="bg-[#0F172A] rounded-xl p-4 col-span-2">
                <p className="text-[#64748B] text-xs mb-1">Vencimiento</p>
                <p className="text-white text-sm font-semibold">{DEMO_RX.expiryDate}</p>
              </div>
            </div>

            {/* Action buttons */}
            {stage === "found" && (
              <button
                onClick={handleDispense}
                className="w-full py-4 text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                Dispensar medicamento
              </button>
            )}

            {stage === "dispensing" && (
              <div className="w-full py-4 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-center gap-3">
                <div className="w-4 h-4 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin" />
                <span className="text-[#64748B] text-sm">Registrando en blockchain…</span>
              </div>
            )}

            {stage === "done" && (
              <div className="space-y-3">
                <div className="w-full py-4 rounded-xl bg-emerald-900/30 border-2 border-emerald-600 flex items-center justify-center gap-3">
                  <span className="text-xl">✅</span>
                  <span className="text-emerald-400 font-bold text-sm">Dispensado exitosamente</span>
                </div>
                <button
                  onClick={handleReset}
                  className="w-full py-3 text-sm font-medium rounded-xl border border-[#334155] text-[#64748B] hover:text-white hover:border-[#475569] transition-colors"
                >
                  Verificar otra receta
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer note */}
        <p className="text-center text-[#334155] text-xs">
          TrustLeaf · Verificación ZK · Stellar Network · © 2026 Browns Studio
        </p>
      </main>
    </div>
  );
}
