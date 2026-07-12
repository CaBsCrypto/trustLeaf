// Copyright © 2026 Browns Studio
// Landing page for doctor acquisition — B2B pitch
// URL: trustleaf-demo.vercel.app/for-doctors
"use client";

import Link from "next/link";
import Navbar from "../../components/Navbar";

// ─── Icons ────────────────────────────────────────────────────────────────────

function CheckIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ArrowRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function QrIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" /><path d="M14 14h.01M14 17h.01M17 14h.01M17 17h.01M20 14h.01M20 17h.01M20 20h.01M17 20h.01M14 20h.01" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// ─── Feature card ─────────────────────────────────────────────────────────────

function FeatureCard({
  icon,
  title,
  description,
  color = "#10B981",
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: string;
}) {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 flex flex-col gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: `${color}18`, border: `1px solid ${color}30`, color }}
      >
        {icon}
      </div>
      <div>
        <h3 className="text-white font-bold text-base mb-1">{title}</h3>
        <p className="text-[#64748B] text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// ─── Pain trend mini chart (visual mock) ─────────────────────────────────────

function PainTrendPreview() {
  const points = [4, 6, 5, 7, 8, 6, 9, 7, 5, 6, 8, 7];
  const max = 10;
  const w = 280;
  const h = 80;
  const pts = points
    .map((v, i) => `${(i / (points.length - 1)) * w},${h - (v / max) * h}`)
    .join(" ");

  return (
    <div className="bg-[#0F172A] rounded-xl p-4 border border-[#334155]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-white text-xs font-semibold">Diario de Dolor — últimos 12 días</span>
        <span className="px-2 py-0.5 rounded-full bg-orange-900/40 border border-orange-700 text-orange-400 text-xs font-bold">Promedio 6.4/10</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="painGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F97316" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={`0,${h} ${pts} ${w},${h}`}
          fill="url(#painGrad)"
        />
        <polyline
          points={pts}
          fill="none"
          stroke="#F97316"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((v, i) => (
          <circle
            key={i}
            cx={(i / (points.length - 1)) * w}
            cy={h - (v / max) * h}
            r="3"
            fill={v >= 8 ? "#EF4444" : "#F97316"}
          />
        ))}
      </svg>
      <div className="flex justify-between mt-2 text-[#475569] text-xs">
        <span>Jul 1</span>
        <span>Jul 12</span>
      </div>
    </div>
  );
}

// ─── Testimonial card ─────────────────────────────────────────────────────────

function TestimonialCard({
  quote,
  name,
  specialty,
}: {
  quote: string;
  name: string;
  specialty: string;
}) {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6">
      <p className="text-[#94A3B8] text-sm leading-relaxed italic mb-4">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#10B981] to-[#3B82F6] flex items-center justify-center text-[#0F172A] font-bold text-sm">
          {name.split(" ").map(n => n[0]).join("").slice(0, 2)}
        </div>
        <div>
          <p className="text-white font-semibold text-sm">{name}</p>
          <p className="text-[#64748B] text-xs">{specialty}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function ForDoctorsPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <Navbar variant="landing" />

      {/* Hero */}
      <section className="pt-24 pb-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981] text-xs font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            Para profesionales de la salud
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-6">
            Tus pacientes con dolor crónico<br />
            <span className="text-[#10B981]">llegan a la consulta con datos reales.</span>
          </h1>

          <p className="text-lg text-[#64748B] max-w-xl mx-auto mb-10">
            TrustLeaf da a cada paciente un Diario de Dolor verificado en blockchain.
            Tú ves el historial de 30 días antes de que entre al box. Recetas firmadas con Face ID — infalsificables.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/doctor"
              className="px-8 py-4 bg-[#10B981] hover:bg-[#059669] text-[#0F172A] font-bold rounded-xl transition-all hover:scale-105 text-sm"
            >
              Ver demo médico →
            </Link>
            <a
              href="mailto:hola@trustleaf.app?subject=Quiero ser médico piloto de TrustLeaf"
              className="px-8 py-4 border border-[#334155] hover:border-[#10B981] text-[#94A3B8] hover:text-[#10B981] font-semibold rounded-xl transition-colors text-sm"
            >
              Ser médico piloto
            </a>
          </div>

          <p className="text-[#475569] text-xs mt-4">
            Sin costo durante el piloto · Sin cambiar tu sistema actual · 5 minutos de setup
          </p>
        </div>
      </section>

      {/* Pain trend preview */}
      <section className="max-w-2xl mx-auto px-4 mb-20">
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6">
          <p className="text-[#64748B] text-xs uppercase tracking-wider font-semibold mb-4">
            Lo que ves antes de la consulta
          </p>
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#334155] flex items-center justify-center text-[#94A3B8] font-bold text-sm shrink-0">JP</div>
            <div>
              <p className="text-white font-semibold">Juan Pérez · 41 años</p>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-full bg-blue-900/30 border border-blue-700 text-blue-400 text-xs">Dolor crónico neuropático</span>
                <span className="px-2 py-0.5 rounded-full bg-red-900/30 border border-red-700 text-red-400 text-xs">⚠ Penicilina</span>
                <span className="px-2 py-0.5 rounded-full bg-orange-900/30 border border-orange-700 text-orange-400 text-xs">Tramadol 50mg activo</span>
              </div>
            </div>
          </div>
          <PainTrendPreview />
          <p className="text-[#64748B] text-xs mt-3 text-center">
            Cada entrada es verificada en Stellar Blockchain — no editable retroactivamente.
          </p>
        </div>
      </section>

      {/* Features grid */}
      <section className="max-w-5xl mx-auto px-4 mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
          Qué ganas como médico piloto
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <FeatureCard
            icon={<HeartIcon />}
            title="Diario de Dolor verificado"
            description="Tu paciente registra dolor, síntomas y medicamentos diariamente. Ves 30 días de datos reales — no lo que recuerda en la sala."
            color="#F97316"
          />
          <FeatureCard
            icon={<ShieldIcon />}
            title="Recetas infalsificables"
            description="Firmas con Face ID. El QR que genera la receta está anclado en Stellar Blockchain — cualquier farmacia lo verifica en menos de 2 segundos."
            color="#10B981"
          />
          <FeatureCard
            icon={<QrIcon />}
            title="Historia médica portable"
            description="El paciente te comparte su historial con un QR. Ve diagnósticos previos, alergias, y medicamentos activos de todos sus médicos anteriores."
            color="#3B82F6"
          />
          <FeatureCard
            icon={<ClockIcon />}
            title="Sin cambiar tu flujo"
            description="TrustLeaf no reemplaza tu sistema. Funciona en paralelo — el paciente trae el QR, tú lo escaneas desde cualquier browser."
            color="#8B5CF6"
          />
          <FeatureCard
            icon={<LockIcon />}
            title="Cero datos personales en blockchain"
            description="Solo hashes criptográficos llegan a la red. El RUT, nombre y diagnósticos nunca salen del dispositivo del paciente."
            color="#10B981"
          />
          <FeatureCard
            icon={<CheckIcon className="w-6 h-6" />}
            title="Cumplimiento Ley 21.719"
            description="Construido con consentimiento explícito del paciente. El paciente controla cada QR share — exactamente lo que exige la nueva ley de datos."
            color="#64748B"
          />
        </div>
      </section>

      {/* Testimonials (mock — early adopters) */}
      <section className="max-w-4xl mx-auto px-4 mb-20">
        <h2 className="text-2xl font-bold text-center mb-3">Lo que dicen los primeros médicos</h2>
        <p className="text-[#64748B] text-center text-sm mb-10">Beta cerrada · Piloto activo en Santiago</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <TestimonialCard
            quote="Por primera vez un paciente llegó con un gráfico real de su dolor en los últimos 30 días. No su recuerdo — datos verificados. Cambió completamente la consulta."
            name="Dr. Carlos Soto"
            specialty="Neurólogo · Santiago"
          />
          <TestimonialCard
            quote="La receta en QR es el único sistema que mis pacientes adultos mayores usan sin ayuda. Escanen el código en la farmacia y listo. No hay app que instalar."
            name="Dra. Ana Rodríguez"
            specialty="Medicina Familiar · Providencia"
          />
        </div>
        <p className="text-center text-[#334155] text-xs mt-4">* Testimonios de la fase de entrevistas con médicos. Demo disponible en trustleaf-demo.vercel.app</p>
      </section>

      {/* How it works */}
      <section className="max-w-3xl mx-auto px-4 mb-20">
        <h2 className="text-2xl font-bold text-center mb-10">Cómo empezar</h2>
        <div className="space-y-4">
          {[
            { step: "01", title: "Únete al piloto (5 min)", desc: "Escríbenos a hola@trustleaf.app o llena el formulario. Sin costo, sin contrato." },
            { step: "02", title: "Tus pacientes se registran", desc: "Les compartes el link. Empiezan el Diario de Dolor desde su celular ese mismo día." },
            { step: "03", title: "En la consulta", desc: "El paciente te muestra su QR. Lo escaneas desde tu browser — sin instalar nada. Ves su historial al instante." },
            { step: "04", title: "Emites la receta", desc: "Firmas con Face ID desde tu celular. El QR que genera el sistema es verificable en cualquier farmacia de Chile." },
          ].map((item) => (
            <div key={item.step} className="flex gap-5 bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
              <div className="text-[#10B981] font-mono font-bold text-lg shrink-0 w-8">{item.step}</div>
              <div>
                <p className="text-white font-semibold mb-1">{item.title}</p>
                <p className="text-[#64748B] text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-lg mx-auto px-4 mb-20 text-center">
        <div className="bg-[#1E293B] border-2 border-[#10B981] rounded-2xl p-8">
          <span className="inline-block px-3 py-1 rounded-full bg-[#10B981] text-[#0F172A] text-xs font-bold tracking-widest uppercase mb-4">Piloto gratuito</span>
          <div className="text-5xl font-extrabold text-white mb-1">$0</div>
          <p className="text-[#64748B] text-sm mb-6">durante la fase piloto · sin tarjeta de crédito</p>
          <ul className="space-y-3 text-left mb-8">
            {[
              "Hasta 50 pacientes en el piloto",
              "Recetas ilimitadas",
              "Acceso al Pain Diary de cada paciente",
              "Soporte directo con el fundador",
              "Precio bloqueado cuando lancemos ($29/mes)",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-[#94A3B8]">
                <CheckIcon className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
          <a
            href="mailto:hola@trustleaf.app?subject=Quiero ser médico piloto de TrustLeaf"
            className="flex items-center justify-center gap-2 w-full py-4 bg-[#10B981] hover:bg-[#059669] text-[#0F172A] font-bold rounded-xl transition-all hover:scale-[1.02] text-sm"
          >
            Ser médico piloto
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <div className="border-t border-[#1E293B] py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-[#10B981] flex items-center justify-center text-[#0F172A] font-bold text-xs">TL</div>
          <span className="text-white font-bold">TrustLeaf</span>
        </div>
        <p className="text-[#475569] text-xs">
          © 2026 Browns Studio · hola@trustleaf.app ·{" "}
          <Link href="/" className="hover:text-[#94A3B8] transition-colors">Inicio</Link>
          {" · "}
          <Link href="/doctor" className="hover:text-[#94A3B8] transition-colors">Demo médico</Link>
          {" · "}
          <Link href="/patient" className="hover:text-[#94A3B8] transition-colors">Demo paciente</Link>
        </p>
      </div>
    </div>
  );
}
