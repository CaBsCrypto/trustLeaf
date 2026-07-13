// Copyright © 2026 Browns Studio
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ─── Icons ────────────────────────────────────────────────────────────────────

function ShieldCheckIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function ChainIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  );
}

function ClipboardIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function BuildingIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}

function StethoscopeIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6v0a6 6 0 006-6V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3" />
      <path d="M8 15v1a6 6 0 006 6v0a6 6 0 006-6v-4" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  );
}

function ShareIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ArrowLeftIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

// ─── Mock doctor data ─────────────────────────────────────────────────────────

const DOCTOR = {
  name: "Dr. María González",
  specialty: "Médico Cirujano — Especialista en Dolor Crónico",
  university: "Universidad de Chile",
  graduationYear: "2010",
  rut: "12.345.678-9",
  sisCertNumber: "45678",
  prescriptionsOnChain: 47,
  institution: "Hospital Clínico U. de Chile",
  initials: "MG",
};

// ─── InfoRow ──────────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-[#334155] last:border-0">
      <span className="text-[#64748B] text-sm shrink-0">{label}</span>
      <span className="text-white text-sm font-medium text-right">{value}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DoctorProfilePage() {
  const [copied, setCopied] = useState(false);

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard.writeText(url).then(() => setCopied(true)).catch(() => {
      // fallback
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
    });
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      {/* ── Top bar ────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#0F172A]/95 backdrop-blur-sm border-b border-[#334155] px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            href="/doctor"
            className="flex items-center gap-2 text-[#64748B] hover:text-white transition-colors text-sm"
          >
            <ArrowLeftIcon />
            Volver al dashboard
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#10B981] flex items-center justify-center text-[#0F172A] font-bold text-xs">
              TL
            </div>
            <span className="text-white font-bold text-sm hidden sm:block">
              Trust<span className="text-[#10B981]">Leaf</span>
            </span>
          </div>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">

        {/* Profile card */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl overflow-hidden">
          {/* Card header with gradient */}
          <div className="relative bg-gradient-to-br from-[#10B981]/20 to-[#0F172A] px-6 pt-8 pb-6 border-b border-[#334155]">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center text-[#0F172A] text-3xl font-extrabold border-4 border-[#1E293B] shadow-lg">
                  {DOCTOR.initials}
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#10B981] rounded-full border-2 border-[#1E293B] flex items-center justify-center">
                  <CheckIcon className="w-3.5 h-3.5 text-[#0F172A]" />
                </div>
              </div>

              {/* Name & specialty */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-extrabold text-white leading-tight">
                  {DOCTOR.name}
                </h1>
                <p className="text-[#10B981] font-medium text-sm mt-1">
                  {DOCTOR.specialty}
                </p>
                <p className="text-[#64748B] text-xs mt-1">
                  {DOCTOR.university}, {DOCTOR.graduationYear}
                </p>

                {/* Share button */}
                <button
                  onClick={handleShare}
                  className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
                    copied
                      ? "border-[#10B981] bg-[#10B981]/10 text-[#10B981]"
                      : "border-[#334155] text-[#94A3B8] hover:border-[#10B981] hover:text-[#10B981] hover:bg-[#10B981]/5"
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckIcon className="w-4 h-4" />
                      URL copiada
                    </>
                  ) : (
                    <>
                      <ShareIcon />
                      Compartir perfil
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#334155]">
            {/* Verified */}
            <div className="flex items-center gap-3 px-5 py-4">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center shrink-0">
                <ShieldCheckIcon className="w-5 h-5 text-[#10B981]" />
              </div>
              <div>
                <p className="text-[#10B981] text-xs font-semibold">Verificada en TrustLeaf</p>
                <p className="text-[#64748B] text-xs">Identidad validada</p>
              </div>
            </div>

            {/* Prescriptions on-chain */}
            <div className="flex items-center gap-3 px-5 py-4">
              <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center shrink-0">
                <ChainIcon className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <div>
                <p className="text-white text-xs font-semibold">
                  {DOCTOR.prescriptionsOnChain} recetas en blockchain
                </p>
                <p className="text-[#64748B] text-xs">Stellar Network</p>
              </div>
            </div>

            {/* Institution */}
            <div className="flex items-center gap-3 px-5 py-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                <BuildingIcon className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white text-xs font-semibold">{DOCTOR.institution}</p>
                <p className="text-[#64748B] text-xs">Institución</p>
              </div>
            </div>
          </div>
        </div>

        {/* Credentials */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardIcon className="w-4 h-4 text-[#10B981]" />
            <h2 className="text-white font-semibold text-sm uppercase tracking-wider">
              Credenciales Profesionales
            </h2>
          </div>
          <div>
            <InfoRow label="RUT" value={DOCTOR.rut} />
            <InfoRow label="Registro SIS" value={DOCTOR.sisCertNumber} />
            <InfoRow label="Universidad" value={`${DOCTOR.university}, ${DOCTOR.graduationYear}`} />
            <InfoRow label="Especialidad" value="Dolor Crónico" />
            <InfoRow label="Institución" value={DOCTOR.institution} />
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/doctor/prescribe"
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#10B981] hover:bg-[#059669] text-[#0F172A] font-bold text-sm rounded-xl transition-all hover:scale-[1.02] active:scale-95"
          >
            <StethoscopeIcon className="w-5 h-5" />
            Emitir nueva receta
          </Link>
          <Link
            href="/doctor"
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1E293B] border border-[#334155] hover:border-[#475569] text-white font-semibold text-sm rounded-xl transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#64748B]">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Ver mis pacientes
          </Link>
        </div>

        {/* Blockchain proof note */}
        <div className="flex items-start gap-3 px-4 py-3 bg-[#10B981]/5 border border-[#10B981]/20 rounded-xl">
          <ShieldCheckIcon className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
          <p className="text-[#64748B] text-xs leading-relaxed">
            La identidad y el historial de recetas de este médico están anclados en{" "}
            <span className="text-[#10B981] font-semibold">Stellar Blockchain</span>.
            Los datos personales nunca son almacenados on-chain — solo hashes criptográficos verificables.
          </p>
        </div>
      </main>
    </div>
  );
}
