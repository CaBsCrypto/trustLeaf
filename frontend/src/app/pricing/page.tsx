"use client";
// Copyright © 2026 Browns Studio

import Link from "next/link";
import { CheckCircle } from "lucide-react";

const PLANS = [
  {
    name: "Paciente",
    price: "Gratis",
    period: "",
    description: "Para personas que quieren tener el control de su historial médico.",
    cta: "Comenzar ahora",
    ctaHref: "/patient",
    highlight: false,
    features: [
      "Diario de Dolor — registra en 30 segundos",
      "Historial clínico propio, portable y permanente",
      "QR de emergencia con alergias y medicamentos activos",
      "Compartir historial con cualquier médico o farmacia",
      "Verificación de recetas por QR",
      "Datos anclados en blockchain Stellar",
    ],
  },
  {
    name: "Médico Piloto",
    price: "$0",
    period: "durante el piloto",
    description: "Para médicos que quieren firmar recetas con seguridad y ver el historial real de sus pacientes.",
    cta: "Unirte al piloto",
    ctaHref: "/for-doctors#pilot-form",
    highlight: true,
    badge: "Plazas limitadas",
    features: [
      "Firma de recetas con Face ID / huella",
      "Historial de dolor del paciente antes de la consulta",
      "Resumen clínico generado por IA",
      "Verificación de identidad del paciente sin revelar RUT",
      "Integración FHIR R4 (en desarrollo)",
      "Soporte directo con el equipo de TrustLeaf",
    ],
  },
  {
    name: "Clínica / Farmacia",
    price: "Conversemos",
    period: "",
    description: "Para clínicas, redes de farmacias y sistemas de salud con múltiples usuarios.",
    cta: "Escribirnos",
    ctaHref: "mailto:hola@trustleaf.app?subject=Plan Clínica TrustLeaf",
    highlight: false,
    features: [
      "Todo lo del plan Médico Piloto",
      "Multi-usuario con roles por especialidad",
      "Panel administrativo y reportes",
      "Integración con sistemas HIS/RIS existentes",
      "SLA + onboarding dedicado",
      "Facturación y contrato formal",
    ],
  },
];

const FAQ = [
  {
    q: "¿Por qué es gratis para pacientes?",
    a: "Porque el valor del sistema depende de que los pacientes tengan su historial en TrustLeaf. Los médicos y clínicas pagan por el acceso verificado a esos registros.",
  },
  {
    q: "¿Mis datos médicos están en la blockchain?",
    a: "No directamente. Solo el compromiso criptográfico (hash) de cada registro queda en Stellar. Tu información clínica real está cifrada y bajo tu control. Nadie puede leerla sin tu permiso.",
  },
  {
    q: "¿Necesito saber de criptomonedas?",
    a: "No. TrustLeaf usa Face ID y huella digital — la misma tecnología de tu iPhone o Android. Sin wallets, sin semillas, sin crypto.",
  },
  {
    q: "¿Qué pasa con mis datos si dejo TrustLeaf?",
    a: "Son tuyos. Puedes exportar todo tu historial en PDF o formato FHIR R4 en cualquier momento. Los hashes en blockchain son permanentes.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      {/* Nav */}
      <nav className="sticky top-0 z-30 bg-[#0F172A]/95 backdrop-blur-sm border-b border-[#1E293B] px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#10B981] rounded-lg flex items-center justify-center">
              <span className="text-[#0F172A] font-bold text-xs">TL</span>
            </div>
            <span className="text-white font-bold">TrustLeaf</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/for-doctors" className="text-[#94A3B8] text-sm hover:text-white transition-colors">Para médicos</Link>
            <Link href="/patient" className="text-sm px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-[#0F172A] font-semibold rounded-xl transition-colors">
              Comenzar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-16 pb-12 text-center">
        <p className="text-[#10B981] text-sm font-semibold tracking-wide uppercase mb-3">Precios</p>
        <h1 className="text-4xl font-bold text-white mb-4">
          Simple. Honesto. Sin sorpresas.
        </h1>
        <p className="text-[#64748B] text-lg max-w-xl mx-auto">
          Los pacientes siempre gratis. Los médicos y clínicas pagan por un sistema que realmente funciona.
        </p>
      </section>

      {/* Plans grid */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-6 flex flex-col ${
                plan.highlight
                  ? "bg-[#10B981]/10 border-[#10B981]"
                  : "bg-[#1E293B] border-[#334155]"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#10B981] text-[#0F172A] text-[11px] font-bold px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-5">
                <p className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wide mb-1">{plan.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-bold ${plan.highlight ? "text-[#10B981]" : "text-white"}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-[#64748B] text-sm">{plan.period}</span>
                  )}
                </div>
                <p className="text-[#64748B] text-sm mt-2 leading-relaxed">{plan.description}</p>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlight ? "text-[#10B981]" : "text-[#475569]"}`} />
                    <span className="text-[#CBD5E1] text-sm">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.ctaHref}
                className={`block text-center py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                  plan.highlight
                    ? "bg-[#10B981] hover:bg-[#059669] text-[#0F172A]"
                    : "border border-[#334155] hover:border-[#64748B] text-white"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-4 pb-20">
        <h2 className="text-white font-bold text-xl mb-8 text-center">Preguntas frecuentes</h2>
        <div className="space-y-4">
          {FAQ.map(({ q, a }) => (
            <div key={q} className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
              <p className="text-white font-semibold text-sm mb-2">{q}</p>
              <p className="text-[#64748B] text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-[#1E293B] py-12 text-center px-4">
        <p className="text-white font-semibold mb-2">¿Tienes dudas?</p>
        <p className="text-[#64748B] text-sm mb-6">Escríbenos y te respondemos en menos de 24 horas.</p>
        <a
          href="mailto:hola@trustleaf.app"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E293B] border border-[#334155] hover:border-[#64748B] rounded-xl text-white text-sm font-medium transition-colors"
        >
          hola@trustleaf.app
        </a>
      </section>
    </div>
  );
}
