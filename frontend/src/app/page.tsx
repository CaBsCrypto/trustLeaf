"use client";
// Copyright © 2026 Browns Studio
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import FichaOnchain3D from "../components/FichaOnchain3D";
import HowItWorks from "../components/landing/HowItWorks";
import FeaturesGrid from "../components/landing/FeaturesGrid";
import UseCases from "../components/landing/UseCases";
import FounderSection from "../components/landing/FounderSection";
import FAQ from "../components/landing/FAQ";
import Pricing from "../components/landing/Pricing";
import { getTranslations } from "../lib/i18n";
import DemoTour, { TourTrigger, type TourStep } from "../components/DemoTour";

// ─── Landing tour steps ────────────────────────────────────────────────────────

const LANDING_TOUR_STEPS: TourStep[] = [
  {
    title: "Problema 1: Historial perdido",
    description:
      "Cada vez que cambias de médico, tu historial se pierde. TrustLeaf lo soluciona.",
    highlight: "hero",
  },
  {
    title: "Tu ficha clínica en blockchain",
    description:
      "Esta es la ficha onchain — verifica recetas, licencias y diagnósticos en segundos.",
    highlight: "ficha-3d",
  },
  {
    title: "Cómo funciona en 3 pasos",
    description:
      "Médico firma → Blockchain ancla → Paciente comparte QR. Sin contraseñas, sin wallet.",
    highlight: "how-it-works",
  },
  {
    title: "¡Listo para el demo!",
    description:
      "Haz clic en 'Ver demo médico' para ver cómo un médico emite una receta con Face ID.",
    highlight: "cta",
  },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

function ShieldIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function CheckCircleIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function ZapIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function LockIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

function FileCheckIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <polyline points="9 15 11 17 15 13" />
    </svg>
  );
}

function QrCodeIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="3" height="3" />
      <line x1="14" y1="20" x2="20" y2="20" />
      <line x1="20" y1="14" x2="20" y2="17" />
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

function UserIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function BuildingIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}

function ArrowRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function EyeOffIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function ChainIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  );
}

// ─── Section: Hero ─────────────────────────────────────────────────────────────

function SocialProofCounter() {
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
      <span className="text-[#94A3B8] text-sm">
        <span className="text-white font-semibold">Beta cerrada</span> — lista de espera abierta
      </span>
    </div>
  );
}

function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#10B981] opacity-[0.04] rounded-full blur-3xl" />
        <div className="absolute top-20 left-1/4 w-[400px] h-[300px] bg-[#3B82F6] opacity-[0.04] rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Badge — centered above the two-col layout */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981] text-xs font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            Construido sobre Stellar · Soroban Smart Contracts
          </span>
        </div>

        {/* Two-column hero: text left, 3D card right */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 mb-14">

          {/* ── Left: text content ── */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
              Las recetas médicas<br />
              <span className="text-[#10B981]">en blockchain.</span>
            </h1>
            <p className="text-base sm:text-xl font-light text-[#94A3B8] mb-4">
              Seguras.{" "}
              <span className="text-white font-medium">Verificables.</span>{" "}
              Sin papel.
            </p>
            <p className="text-base text-[#64748B] max-w-xl mx-auto lg:mx-0 mb-10">
              TrustLeaf digitaliza la prescripción médica con pruebas de conocimiento cero.
              El médico emite, el paciente controla, la farmacia verifica — sin exponer datos personales.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3">
              <a
                href="#cta"
                className="w-full sm:w-auto px-7 py-3.5 bg-[#10B981] hover:bg-[#059669] text-[#0F172A] text-sm font-bold rounded-xl transition-all hover:scale-105 active:scale-95 text-center shadow-lg shadow-[#10B981]/20"
              >
                Únete a la lista de espera →
              </a>
              <Link
                href="/doctor"
                className="w-full sm:w-auto px-7 py-3.5 border border-[#10B981]/50 hover:border-[#10B981] text-[#10B981] hover:text-white hover:bg-[#10B981]/10 text-sm font-semibold rounded-xl transition-colors text-center"
              >
                Ver demo médico →
              </Link>
              <Link
                href="/patient"
                className="w-full sm:w-auto px-7 py-3.5 border border-[#334155] hover:border-[#475569] text-[#94A3B8] hover:text-white text-sm font-medium rounded-xl transition-colors text-center"
              >
                Ver demo paciente →
              </Link>
            </div>

            {/* Trust micro-copy */}
            <p className="text-[#475569] text-xs mt-4 text-center lg:text-left">
              ✓ Gratis durante beta &nbsp;·&nbsp; ✓ Sin tarjeta de crédito &nbsp;·&nbsp; ✓ Datos seguros en blockchain
            </p>

            {/* Social proof counter */}
            <div className="lg:flex lg:justify-start">
              <SocialProofCounter />
            </div>
          </div>

          {/* ── Right: 3D Ficha Onchain card ── */}
          <div id="ficha-3d" className="flex-shrink-0 flex items-center justify-center w-full max-w-[320px] mx-auto lg:mx-0 overflow-hidden">
            <FichaOnchain3D />
          </div>
        </div>

        {/* Trust stats */}
        <div className="grid grid-cols-3 divide-x divide-[#334155] max-w-lg mx-auto border border-[#334155] rounded-2xl overflow-hidden bg-[#1E293B]/50">
          <div className="px-4 py-4 text-center">
            <p className="text-[#10B981] text-xl font-bold font-mono">0</p>
            <p className="text-[#64748B] text-xs mt-0.5">PHI on-chain</p>
          </div>
          <div className="px-4 py-4 text-center">
            <p className="text-[#3B82F6] text-xl font-bold font-mono">ZK</p>
            <p className="text-[#64748B] text-xs mt-0.5">Proofs</p>
          </div>
          <div className="px-4 py-4 text-center">
            <p className="text-white text-xl font-bold font-mono">XLM</p>
            <p className="text-[#64748B] text-xs mt-0.5">Stellar Network</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section: Benefits 3-col ───────────────────────────────────────────────────

interface BenefitItem {
  text: string;
}

interface RoleCardProps {
  icon: React.ReactNode;
  color: "green" | "blue" | "purple";
  role: string;
  headline: string;
  benefits: BenefitItem[];
  cta: { label: string; href: string };
}

function RoleCard({ icon, color, role, headline, benefits, cta }: RoleCardProps) {
  const colorMap = {
    green: {
      icon: "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20",
      badge: "text-[#10B981] bg-[#10B981]/10",
      dot: "bg-[#10B981]",
      cta: "bg-[#10B981] hover:bg-[#059669] text-[#0F172A]",
    },
    blue: {
      icon: "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20",
      badge: "text-[#3B82F6] bg-[#3B82F6]/10",
      dot: "bg-[#3B82F6]",
      cta: "bg-[#3B82F6] hover:bg-[#2563EB] text-white",
    },
    purple: {
      icon: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      badge: "text-purple-400 bg-purple-500/10",
      dot: "bg-purple-400",
      cta: "bg-purple-600 hover:bg-purple-500 text-white",
    },
  };

  const c = colorMap[color];

  return (
    <div className="flex flex-col bg-[#1E293B] border border-[#334155] rounded-2xl p-6 hover:border-[#475569] transition-colors">
      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${c.icon}`}>
        {icon}
      </div>
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-block mb-2 w-fit ${c.badge}`}>
        {role}
      </span>
      <h3 className="text-white font-bold text-lg mb-4 leading-snug">{headline}</h3>
      <ul className="space-y-3 flex-1 mb-6">
        {benefits.map((b, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-[#94A3B8]">
            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${c.dot}`} />
            {b.text}
          </li>
        ))}
      </ul>
      <Link
        href={cta.href}
        className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${c.cta}`}
      >
        {cta.label}
        <ArrowRightIcon className="w-4 h-4" />
      </Link>
    </div>
  );
}

function BenefitsSection() {
  return (
    <section className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">
            Un sistema. Tres portales.
          </h2>
          <p className="text-[#64748B] text-base max-w-lg mx-auto">
            Cada actor del ecosistema médico tiene su espacio diseñado específicamente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RoleCard
            icon={<StethoscopeIcon />}
            color="green"
            role="Para Médicos"
            headline="Emite recetas con firma criptográfica"
            benefits={[
              { text: "Prescripción digital en segundos, sin papel ni sellos" },
              { text: "El RUT del paciente nunca queda en blockchain" },
              { text: "Historial de recetas con filtros por estado" },
              { text: "Control total sobre revocación de recetas" },
              { text: "Cumplimiento Minsal automatizado" },
            ]}
            cta={{ label: "Portal Médico", href: "/doctor" }}
          />
          <RoleCard
            icon={<UserIcon />}
            color="blue"
            role="Para Pacientes"
            headline="Tu ficha médica bajo tu control"
            benefits={[
              { text: "Accede a tus recetas activas desde el móvil" },
              { text: "Código QR para presentar en farmacia" },
              { text: "Elige qué médicos pueden ver tu ficha" },
              { text: "Registro de vacunas y licencias médicas" },
              { text: "Notificaciones de vencimiento de recetas" },
            ]}
            cta={{ label: "Portal Paciente", href: "/patient" }}
          />
          <RoleCard
            icon={<BuildingIcon />}
            color="purple"
            role="Para Farmacias"
            headline="Verifica en segundos, sin riesgo"
            benefits={[
              { text: "Escanea el QR del paciente para validación instantánea" },
              { text: "Semáforo visual de estado: verde / amarillo / rojo" },
              { text: "Alerta automática para medicamentos controlados" },
              { text: "Historial de dispensaciones del día" },
              { text: "Registro inmutable en Stellar para auditorías" },
            ]}
            cta={{ label: "Portal Farmacia", href: "/dispensary" }}
          />
        </div>
      </div>
    </section>
  );
}

// ─── Section: Seguridad ────────────────────────────────────────────────────────

interface SecurityFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}

function SecurityFeature({ icon, title, description, badge }: SecurityFeatureProps) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-center text-[#10B981] shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-white font-semibold text-sm">{title}</h4>
          {badge && (
            <span className="px-2 py-0.5 bg-[#10B981]/10 text-[#10B981] text-[10px] font-semibold rounded-full border border-[#10B981]/20">
              {badge}
            </span>
          )}
        </div>
        <p className="text-[#64748B] text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function SecuritySection() {
  return (
    <section className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: text */}
          <div>
            <span className="text-[#3B82F6] text-xs font-semibold uppercase tracking-widest">
              Seguridad
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-white mt-2 mb-4">
              Privacidad por diseño.
              <br />
              <span className="text-[#10B981]">No por promesa.</span>
            </h2>
            <p className="text-[#64748B] text-base mb-8 leading-relaxed">
              TrustLeaf fue construido desde cero para que ningún dato de salud protegido
              (PHI) pueda ser registrado en blockchain — ni accidentalmente.
            </p>

            <div className="space-y-6">
              <SecurityFeature
                icon={<EyeOffIcon className="w-5 h-5" />}
                title="Zero-knowledge proofs"
                badge="ZK"
                description="Los datos del paciente son transformados en un commitment matemático. La prueba puede ser verificada sin revelar el original."
              />
              <SecurityFeature
                icon={<LockIcon className="w-5 h-5" />}
                title="Sin PHI on-chain"
                badge="Minsal"
                description="Nombres, RUTs, diagnósticos y medicamentos sensibles nunca son registrados en Stellar. Solo hashes irrastreables."
              />
              <SecurityFeature
                icon={<ChainIcon className="w-5 h-5" />}
                title="Registro inmutable en Stellar"
                description="Cada transacción queda grabada permanentemente en Stellar Network, auditables por cualquier regulador."
              />
              <SecurityFeature
                icon={<ShieldIcon className="w-5 h-5" />}
                title="Cumplimiento regulatorio"
                badge="Reglamento"
                description="Diseñado para cumplir con el reglamento Minsal de receta electrónica. En proceso de certificación."
              />
            </div>
          </div>

          {/* Right: visual card */}
          <div className="relative">
            <div className="absolute inset-0 bg-[#10B981]/5 rounded-3xl blur-xl" />
            <div className="relative bg-[#1E293B] border border-[#334155] rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="px-5 py-4 border-b border-[#334155] flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="ml-3 text-[#64748B] text-xs font-mono">stellar-transaction.json</span>
              </div>
              {/* Content */}
              <div className="p-5 font-mono text-xs space-y-1">
                <p className="text-[#64748B]">{"{"}</p>
                <p className="pl-4"><span className="text-[#3B82F6]">&quot;operation&quot;</span><span className="text-[#64748B]">: </span><span className="text-[#10B981]">&quot;submit_commitment&quot;</span><span className="text-[#64748B]">,</span></p>
                <p className="pl-4"><span className="text-[#3B82F6]">&quot;commitment&quot;</span><span className="text-[#64748B]">: </span><span className="text-yellow-400">&quot;0x7f3a...c9e1&quot;</span><span className="text-[#64748B]">,</span></p>
                <p className="pl-4"><span className="text-[#3B82F6]">&quot;dispensary&quot;</span><span className="text-[#64748B]">: </span><span className="text-yellow-400">&quot;GCXYZ...123&quot;</span><span className="text-[#64748B]">,</span></p>
                <p className="pl-4"><span className="text-[#3B82F6]">&quot;valid_days&quot;</span><span className="text-[#64748B]">: </span><span className="text-purple-400">30</span><span className="text-[#64748B]">,</span></p>
                <div className="pl-4 mt-2 pt-2 border-t border-[#334155]">
                  <p className="text-[#64748B] italic">{"// ← Sin nombre del paciente"}</p>
                  <p className="text-[#64748B] italic">{"// ← Sin RUT, sin diagnóstico"}</p>
                  <p className="text-[#64748B] italic">{"// ← Solo el hash anónimo"}</p>
                </div>
                <p className="text-[#64748B] mt-1">{"}"}</p>
              </div>
              {/* Footer */}
              <div className="px-5 py-3 border-t border-[#334155] bg-[#10B981]/5 flex items-center gap-2">
                <ShieldIcon className="w-4 h-4 text-[#10B981]" />
                <span className="text-[#10B981] text-xs font-semibold">Verificado en Stellar Network</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section: CTA ─────────────────────────────────────────────────────────────

function CTASection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("tl_waitlist_email");
    if (stored) setSubmitted(true);
  }, []);

  function validateEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailError("");

    if (!email.trim()) {
      setEmailError("Por favor ingresa tu email.");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Ingresa un email válido.");
      return;
    }

    // Call the waitlist API (sends email via Resend; falls back gracefully if no key)
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Network error — still mark as submitted (don't block UX)
    }

    localStorage.setItem("tl_waitlist_email", email);
    setSubmitted(true);
  }

  return (
    <section id="cta" className="py-20 md:py-28 bg-[#1E293B]/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/10 text-[#3B82F6] text-xs font-semibold mb-6">
          <ZapIcon className="w-3.5 h-3.5" />
          Acceso anticipado limitado
        </div>
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
          Sé de los primeros en usar
          <br />
          <span className="text-[#10B981]">TrustLeaf</span>
        </h2>
        <p className="text-[#64748B] text-base mb-10 max-w-lg mx-auto">
          Únete a la lista de espera para clínicas, consultorios y cadenas de farmacias
          que quieren digitalizar su proceso de prescripción.
        </p>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="text-4xl">🎉</div>
            <p className="text-lg font-semibold text-white">¡Estás en la lista!</p>
            <p className="text-sm text-slate-400 text-center">
              Te avisaremos cuando TrustLeaf esté disponible en tu región.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  placeholder="tu@clinica.cl"
                  className={`w-full px-4 py-3.5 bg-[#0F172A] border rounded-xl text-white text-base placeholder-[#475569] outline-none transition-colors ${
                    emailError
                      ? "border-red-500 focus:border-red-400"
                      : "border-[#334155] focus:border-[#10B981]"
                  }`}
                />
                {emailError && (
                  <p className="text-red-400 text-xs mt-1.5 text-left">{emailError}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3.5 bg-[#10B981] hover:bg-[#059669] text-[#0F172A] text-sm font-bold rounded-xl transition-all hover:scale-105 active:scale-95 min-h-[48px]"
              >
                Unirme
              </button>
            </div>
            <p className="text-[#64748B] text-xs mt-3">
              Sin spam. Solo actualizaciones de lanzamiento. Cancela cuando quieras.
            </p>
          </form>
        )}

        {/* Feature tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
          {[
            "Zero PHI on-chain",
            "Stellar Network",
            "ZK Proofs",
            "Cumplimiento Minsal",
            "Sin papel",
            "Verificación instantánea",
          ].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 border border-[#334155] text-[#64748B] text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-[#334155] bg-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#10B981] flex items-center justify-center text-[#0F172A] font-bold text-sm">
                TL
              </div>
              <span className="text-white font-bold text-base">
                Trust<span className="text-[#10B981]">Leaf</span>
              </span>
            </div>
            <p className="text-[#64748B] text-sm leading-relaxed max-w-xs">
              El estándar de confianza para la prescripción médica digital en América Latina.
              Privacidad por diseño. Construido sobre Stellar.
            </p>
          </div>

          {/* Portales */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">Portales</h4>
            <ul className="space-y-2">
              {[
                { label: "Para Médicos", href: "/for-doctors" },
                { label: "Para Pacientes", href: "/patient" },
                { label: "Para Farmacias", href: "/dispensary" },
                { label: "Demo Médico", href: "/doctor" },
                { label: "Verificar Receta", href: "/verify/demo" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#64748B] hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Acceso */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">Cuenta</h4>
            <ul className="space-y-2">
              {[
                { label: "Iniciar sesión", href: "/login" },
                { label: "Crear cuenta", href: "/register" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#64748B] hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* YC badge */}
        <div className="flex justify-center mb-4">
          <a
            href="https://apply.ycombinator.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981] text-xs font-semibold hover:bg-[#10B981]/20 transition-colors"
          >
            🚀 Aplicando a Y Combinator Fall 2026
          </a>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#475569] text-xs">
            © 2026 Browns Studio. Todos los derechos reservados. ·{" "}
            <Link href="/admin" className="hover:text-[#334155] transition-colors">⚙</Link>
          </p>
          <div className="flex items-center gap-4 text-xs text-[#475569]">
            <span className="flex items-center gap-1.5">
              <ShieldIcon className="w-3.5 h-3.5 text-[#10B981]" />
              Powered by Stellar Network
            </span>
            <span>·</span>
            <span>Zero-Knowledge Prescriptions</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const t = getTranslations("es");
  const [tourActive, setTourActive] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <Navbar variant="landing" />
      <main>
        <HeroSection />
        <div id="how-it-works">
          <HowItWorks t={t} />
        </div>
        <FeaturesGrid />
        <UseCases />
        <FounderSection />
        <BenefitsSection />
        <SecuritySection />
        <FAQ />
        <Pricing />
        <CTASection />
      </main>
      <Footer />

      {/* Demo tour */}
      {!tourActive && (
        <TourTrigger onClick={() => setTourActive(true)} />
      )}
      {tourActive && (
        <DemoTour
          steps={LANDING_TOUR_STEPS}
          onClose={() => setTourActive(false)}
        />
      )}
    </div>
  );
}
