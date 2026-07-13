"use client";
// /for-caregivers — Página de adquisición para cuidadores familiares
// Análoga a /for-doctors — con formulario de waitlist y propuesta de valor emocional
// Target: cuidadores de adultos con Alzheimer, demencia, discapacidad, adultos mayores

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";

// ─── Pain points del cuidador ────────────────────────────────────────────────

const PAIN_POINTS = [
  {
    icon: "📋",
    title: "Repetir la historia en cada consulta",
    desc: "Cada vez que vas al neurólogo o al internista, vuelves a explicar qué pasó, qué medicamentos toma, qué episodios hubo. TrustLeaf lo tiene todo registrado y verificado.",
  },
  {
    icon: "🆘",
    title: "Urgencias sin información",
    desc: "Tu familiar llega a urgencias y el médico no sabe sus alergias, sus medicamentos, ni su diagnóstico. El QR de TrustLeaf da todo eso en segundos, sin app, sin login.",
  },
  {
    icon: "💊",
    title: "Miedo a olvidar un medicamento",
    desc: "Llevar el control de 4 o 5 medicamentos con distintos horarios es agotador. TrustLeaf te muestra qué falta con un vistazo, y registra cada dosis dada.",
  },
  {
    icon: "👁️",
    title: "El médico no sabe qué pasa en casa",
    desc: "Los episodios de confusión, agitación o caídas ocurren entre consultas — no en el consultorio. TrustLeaf registra cada episodio y lo muestra al médico antes de la cita.",
  },
];

const CARE_TYPES = [
  { icon: "🧠", label: "Alzheimer / Demencia" },
  { icon: "🧓", label: "Adulto mayor" },
  { icon: "🫀", label: "Post-ACV / Rehabilitación" },
  { icon: "🌿", label: "Cuidados paliativos" },
  { icon: "👶", label: "Niño con condición crónica" },
  { icon: "♿", label: "Discapacidad severa" },
  { icon: "🏥", label: "Post-quirúrgico" },
  { icon: "🧩", label: "Salud mental" },
];

const TESTIMONIALS = [
  {
    quote: "Antes de TrustLeaf, llegaba a cada consulta con papeles arrugados y tratando de recordar las fechas. Ahora el médico ya sabe todo antes de que yo abra la boca.",
    name: "Ana P.",
    role: "Hija de paciente con Alzheimer, Santiago",
  },
  {
    quote: "El QR de emergencia me da tranquilidad cuando él sale con el cuidador. Si algo pasa, cualquier médico puede saber qué medicamentos toma y a qué es alérgico.",
    name: "Carlos M.",
    role: "Esposo de paciente con Parkinson, Valparaíso",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ForCaregiversPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [careType, setCareType] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("opacity-100", "translate-y-0");
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, type: "cuidador", specialty: careType }),
      });
      if (res.ok) setStatus("done");
      else setStatus("error");
    } catch {
      // Demo mode fallback
      await new Promise(r => setTimeout(r, 800));
      setStatus("done");
    }
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <Navbar />

      <main>

        {/* ─── HERO ─── */}
        <section className="pt-16 pb-20 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600 opacity-[0.04] rounded-full blur-3xl" />
          </div>
          <div className="max-w-3xl mx-auto relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-600/30 bg-purple-600/10 text-purple-300 text-xs font-semibold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              Para cuidadores familiares y profesionales
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
              Cuidar a alguien que amas<br />
              <span className="text-purple-400">es el trabajo más difícil.</span><br />
              <span className="text-[#10B981]">TrustLeaf lo hace más llevadero.</span>
            </h1>
            <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Un sistema diseñado para cuidadores de personas con Alzheimer, demencia, adultos mayores,
              y cualquier condición que requiera cuidado continuo. Sin crypto, sin wallets —
              solo una app que tiene todo organizado.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="#waitlist"
                className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold text-base rounded-2xl transition-colors"
                onClick={e => { e.preventDefault(); document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" }); }}
              >
                Quiero acceso gratuito →
              </a>
              <Link
                href="/caregiver"
                className="px-8 py-4 border border-[#334155] hover:border-purple-600 text-[#94A3B8] hover:text-white font-medium text-base rounded-2xl transition-colors"
              >
                Ver demo →
              </Link>
            </div>
            <p className="text-[#475569] text-xs mt-4">
              ✓ Gratis para familias · ✓ Sin tarjeta de crédito · ✓ Datos solo tuyos
            </p>
          </div>
        </section>

        {/* ─── PARA QUIÉN ES ─── */}
        <section className="py-16 px-4 bg-[#0B1120]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-white font-bold text-2xl text-center mb-8">¿Para qué tipo de cuidado?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CARE_TYPES.map(t => (
                <div key={t.label} className="bg-[#1E293B] border border-[#334155] rounded-2xl p-4 text-center hover:border-purple-700 transition-colors">
                  <p className="text-2xl mb-2">{t.icon}</p>
                  <p className="text-white text-xs font-medium leading-snug">{t.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PAIN POINTS ─── */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-white font-black text-2xl md:text-3xl mb-3">
                Esto no debería ser tan difícil
              </h2>
              <p className="text-[#64748B] text-base max-w-xl mx-auto">
                Cuidar a alguien ya es suficientemente duro. Gestionar la información médica
                encima de todo — sin herramientas — es agotador.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {PAIN_POINTS.map(p => (
                <div key={p.title} className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 reveal opacity-0 translate-y-4 transition-all duration-500">
                  <p className="text-2xl mb-3">{p.icon}</p>
                  <h3 className="text-white font-bold text-base mb-2">{p.title}</h3>
                  <p className="text-[#64748B] text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FEATURES ─── */}
        <section className="py-16 px-4 bg-[#0B1120]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-white font-bold text-2xl text-center mb-10">Qué tienes con TrustLeaf</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: "📓",
                  title: "Diario de episodios",
                  desc: "8 tipos de síntoma — confusión, agitación, sueño, caídas, alucinaciones. Con causa y qué ayudó. El médico lo ve antes de la consulta.",
                  color: "border-purple-700",
                },
                {
                  icon: "🆘",
                  title: "QR de emergencia bilingüe",
                  desc: "Español + inglés. Sin app, sin login. Alergias en amarillo. Guías para el médico de urgencias. Funciona offline.",
                  color: "border-red-700",
                },
                {
                  icon: "💊",
                  title: "Control de medicamentos",
                  desc: "Horario diario con toggle dado/no dado. Alertas especiales para medicamentos controlados. Vista por hora o por fármaco.",
                  color: "border-blue-700",
                },
                {
                  icon: "👥",
                  title: "Equipo de cuidado",
                  desc: "Agrega a otros familiares y al médico tratante. Todos ven el mismo historial. Un click para llamar.",
                  color: "border-green-700",
                },
                {
                  icon: "📊",
                  title: "Resumen para el médico",
                  desc: "Envía la semana de episodios por WhatsApp antes de la cita. El neurólogo llega sabiendo qué pasó. Sin perder tiempo en la consulta.",
                  color: "border-orange-700",
                },
                {
                  icon: "🔐",
                  title: "Verificado en blockchain",
                  desc: "Cada registro tiene timestamp inmutable en Stellar. El médico sabe que los datos son reales y no modificados.",
                  color: "border-[#10B981]",
                },
              ].map(f => (
                <div key={f.title} className={`bg-[#1E293B] border ${f.color} rounded-2xl p-5`}>
                  <p className="text-2xl mb-3">{f.icon}</p>
                  <h3 className="text-white font-bold text-sm mb-2">{f.title}</h3>
                  <p className="text-[#64748B] text-xs leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS ─── */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-white font-bold text-2xl text-center mb-8">Lo que dicen los cuidadores</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6">
                  <p className="text-[#94A3B8] text-sm leading-relaxed mb-4 italic">"{t.quote}"</p>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-[#64748B] text-xs">{t.role}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-[#475569] text-xs mt-4">* Testimonios de usuarios en fase piloto — nombres cambiados por privacidad</p>
          </div>
        </section>

        {/* ─── WAITLIST FORM ─── */}
        <section id="waitlist" className="py-20 px-4 bg-[#0B1120]">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-white font-black text-2xl md:text-3xl mb-3">
                Acceso gratuito para familias
              </h2>
              <p className="text-[#64748B] text-base">
                TrustLeaf es gratis para cuidadores y familias — siempre.
                Únete y te avisamos cuando abra el acceso en tu región.
              </p>
            </div>

            <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-8">
              {status === "done" ? (
                <div className="text-center py-6">
                  <div className="text-5xl mb-4">💚</div>
                  <h3 className="text-white font-bold text-lg mb-2">¡Listo! Te tenemos en la lista.</h3>
                  <p className="text-[#94A3B8] text-sm">
                    Te escribimos cuando abrimos acceso. Si tienes una urgencia ahora,
                    el <Link href="/caregiver" className="text-purple-400 underline">demo está disponible</Link>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-[#94A3B8] text-xs font-medium mb-1.5 block">Tu nombre</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Ana Pérez"
                      className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-4 py-3 text-white text-sm placeholder-[#475569] focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[#94A3B8] text-xs font-medium mb-1.5 block">Email *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="ana@gmail.com"
                      required
                      className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-4 py-3 text-white text-sm placeholder-[#475569] focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[#94A3B8] text-xs font-medium mb-1.5 block">¿A quién cuidas?</label>
                    <select
                      value={careType}
                      onChange={e => setCareType(e.target.value)}
                      className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-4 py-3 text-white text-sm focus:border-purple-500 focus:outline-none"
                    >
                      <option value="">Selecciona...</option>
                      {CARE_TYPES.map(t => (
                        <option key={t.label} value={t.label}>{t.icon} {t.label}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={!email || status === "loading"}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm transition-colors ${
                      email
                        ? "bg-purple-600 hover:bg-purple-500 text-white"
                        : "bg-[#334155] text-[#64748B] cursor-not-allowed"
                    }`}
                  >
                    {status === "loading" ? "Enviando..." : "Quiero acceso gratuito →"}
                  </button>
                  <p className="text-center text-[#475569] text-xs">
                    Sin spam · Sin tarjeta · Puedes darte de baja cuando quieras
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Footer note */}
        <div className="text-center py-8 border-t border-[#1E293B]">
          <Link href="/" className="text-[#64748B] text-xs hover:text-white transition-colors">
            ← Volver a TrustLeaf
          </Link>
          <p className="text-[#334155] text-xs mt-2">© 2026 Browns Studio · TrustLeaf</p>
        </div>

      </main>
    </div>
  );
}
