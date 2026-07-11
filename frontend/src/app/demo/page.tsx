// Copyright © 2026 Browns Studio
"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import {
  StethoscopeIcon,
  UserIcon,
  ClipboardCheckIcon,
  PillIcon,
  QrIcon,
  ShieldCheckIcon,
  CheckIcon,
  LockIcon,
  ClockIcon,
  HeartPulseIcon,
} from "../../components/icons/TrustLeafIcons";

// ─── Types ────────────────────────────────────────────────────────────────────
type RoleColor = "#10B981" | "#3B82F6" | "#8B5CF6";

interface MockScreenProps {
  title: string;
  color: RoleColor;
  children: React.ReactNode;
}

// ─── Mock screen card ─────────────────────────────────────────────────────────
function MockScreen({ title, color, children }: MockScreenProps) {
  return (
    <div
      className="rounded-xl overflow-hidden shadow-lg"
      style={{ border: `1px solid ${color}30`, background: "#0F172A" }}
    >
      {/* Fake browser bar */}
      <div
        className="flex items-center gap-1.5 px-3 py-2"
        style={{ background: "#1E293B", borderBottom: `1px solid ${color}20` }}
      >
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#F87171" }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FBBF24" }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#34D399" }} />
        <div
          className="flex-1 mx-2 px-2.5 py-0.5 rounded text-xs"
          style={{ background: "#0F172A", color: "#475569" }}
        >
          trustleaf.app/{title.toLowerCase().replace(/ /g, "-")}
        </div>
      </div>
      {/* Screen title bar */}
      <div
        className="flex items-center gap-2 px-3 py-2"
        style={{ background: `${color}15`, borderBottom: `1px solid ${color}20` }}
      >
        <div className="w-1.5 h-4 rounded-full" style={{ background: color }} />
        <span className="text-xs font-semibold" style={{ color }}>
          {title}
        </span>
      </div>
      {/* Content */}
      <div className="p-3">{children}</div>
    </div>
  );
}

// ─── Fake input row ───────────────────────────────────────────────────────────
function FakeInput({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: RoleColor;
}) {
  return (
    <div className="mb-2">
      <div className="text-xs mb-1" style={{ color: "#64748B" }}>
        {label}
      </div>
      <div
        className="px-2.5 py-1.5 rounded-lg text-xs"
        style={{ background: "#1E293B", border: `1px solid ${color}25`, color: "#CBD5E1" }}
      >
        {value}
      </div>
    </div>
  );
}

// ─── Fake button ──────────────────────────────────────────────────────────────
function FakeButton({ label, color }: { label: string; color: RoleColor }) {
  return (
    <div
      className="w-full text-center py-1.5 rounded-lg text-xs font-semibold mt-2"
      style={{ background: color, color: "#0F172A" }}
    >
      {label}
    </div>
  );
}

// ─── Fake badge ───────────────────────────────────────────────────────────────
function FakeBadge({
  label,
  color,
  subtle,
}: {
  label: string;
  color: RoleColor;
  subtle?: boolean;
}) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{
        background: subtle ? `${color}15` : color,
        color: subtle ? color : "#0F172A",
        border: subtle ? `1px solid ${color}30` : "none",
      }}
    >
      {label}
    </span>
  );
}

// ─── Doctor column screens ────────────────────────────────────────────────────
const GREEN: RoleColor = "#10B981";
const BLUE: RoleColor = "#3B82F6";
const PURPLE: RoleColor = "#8B5CF6";

function DoctorScreens() {
  return (
    <div className="space-y-3">
      <MockScreen title="Buscar paciente" color={GREEN}>
        <FakeInput label="RUT del paciente" value="12.345.678-9" color={GREEN} />
        <div
          className="flex items-center gap-2 mt-2 p-2 rounded-lg"
          style={{ background: `${GREEN}10`, border: `1px solid ${GREEN}25` }}
        >
          <UserIcon className="w-4 h-4 shrink-0" />
          <div>
            <p className="text-xs font-semibold" style={{ color: "#fff" }}>
              María Fernández L.
            </p>
            <p className="text-xs" style={{ color: "#64748B" }}>
              Sin alergias conocidas
            </p>
          </div>
          <FakeBadge label="Verificado" color={GREEN} />
        </div>
      </MockScreen>

      <MockScreen title="Nueva receta" color={GREEN}>
        <FakeInput label="Medicamento" value="Amoxicilina 500mg" color={GREEN} />
        <FakeInput label="Dosis" value="1 cápsula cada 8 horas" color={GREEN} />
        <FakeInput label="Duración" value="7 días" color={GREEN} />
        <FakeButton label="✍ Firmar y emitir receta ZK" color={GREEN} />
      </MockScreen>

      <MockScreen title="Receta emitida" color={GREEN}>
        <div className="flex items-center gap-2">
          <CheckIcon className="w-4 h-4" />
          <span className="text-xs font-semibold" style={{ color: GREEN }}>
            Receta emitida exitosamente
          </span>
        </div>
        <p className="text-xs mt-1.5" style={{ color: "#64748B" }}>
          Hash ZK: <span style={{ color: "#94A3B8" }}>0x4a2f...9c1d</span>
        </p>
        <p className="text-xs" style={{ color: "#64748B" }}>
          Registrada en Stellar Testnet
        </p>
      </MockScreen>
    </div>
  );
}

// ─── Patient column screens ───────────────────────────────────────────────────
function PatientScreens() {
  return (
    <div className="space-y-3">
      <MockScreen title="Mis recetas" color={BLUE}>
        <div className="space-y-2">
          {[
            { med: "Amoxicilina 500mg", date: "Hoy 14:32", status: "Activa" },
            { med: "Losartán 50mg", date: "Hace 3 días", status: "Dispensada" },
          ].map((r, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 rounded-lg"
              style={{ background: "#1E293B", border: `1px solid ${BLUE}20` }}
            >
              <div className="flex items-center gap-2">
                <PillIcon className="w-3.5 h-3.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium" style={{ color: "#fff" }}>
                    {r.med}
                  </p>
                  <p className="text-xs" style={{ color: "#475569" }}>
                    {r.date}
                  </p>
                </div>
              </div>
              <FakeBadge
                label={r.status}
                color={r.status === "Activa" ? BLUE : GREEN}
                subtle
              />
            </div>
          ))}
        </div>
      </MockScreen>

      <MockScreen title="Código QR" color={BLUE}>
        <div className="flex flex-col items-center py-1">
          <div
            className="w-20 h-20 rounded-xl flex items-center justify-center mb-2"
            style={{ background: "#fff" }}
          >
            <QrIcon className="w-14 h-14" />
          </div>
          <p className="text-xs text-center" style={{ color: "#64748B" }}>
            Muestra este código en la farmacia
          </p>
          <div className="mt-2">
            <FakeBadge label="Válido por 24h" color={BLUE} subtle />
          </div>
        </div>
      </MockScreen>

      <MockScreen title="Receta dispensada" color={BLUE}>
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: GREEN }}
          >
            <CheckIcon className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold" style={{ color: GREEN }}>
            Medicamento retirado
          </span>
        </div>
        <p className="text-xs" style={{ color: "#64748B" }}>
          Farmacia Cruz Verde — Las Condes
        </p>
        <p className="text-xs" style={{ color: "#475569" }}>
          Hoy 15:47 · Verificado en blockchain
        </p>
      </MockScreen>
    </div>
  );
}

// ─── Dispensary column screens ────────────────────────────────────────────────
function DispensaryScreens() {
  return (
    <div className="space-y-3">
      <MockScreen title="Escanear QR" color={PURPLE}>
        <div
          className="flex flex-col items-center justify-center py-3 rounded-lg"
          style={{ background: "#1E293B", border: `2px dashed ${PURPLE}40` }}
        >
          <QrIcon className="w-8 h-8 mb-2" />
          <p className="text-xs" style={{ color: "#64748B" }}>
            Apunta la cámara al QR del paciente
          </p>
          <div
            className="mt-2 px-3 py-1 rounded-full text-xs animate-pulse"
            style={{ background: `${PURPLE}20`, color: PURPLE }}
          >
            Escaneando...
          </div>
        </div>
      </MockScreen>

      <MockScreen title="Verificando receta" color={PURPLE}>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="w-4 h-4" />
            <span className="text-xs font-semibold" style={{ color: "#fff" }}>
              Receta verificada
            </span>
          </div>
          <div className="text-xs space-y-1" style={{ color: "#64748B" }}>
            <p>Paciente: <span style={{ color: "#94A3B8" }}>María Fernández L.</span></p>
            <p>Médico: <span style={{ color: "#94A3B8" }}>Dr. Juan Pérez</span></p>
            <p>Medicamento: <span style={{ color: "#94A3B8" }}>Amoxicilina 500mg</span></p>
          </div>
          <div className="flex gap-2 mt-1">
            <FakeBadge label="ZK válida" color={GREEN} subtle />
            <FakeBadge label="No dispensada" color={PURPLE} subtle />
          </div>
        </div>
      </MockScreen>

      <MockScreen title="Dispensación confirmada" color={PURPLE}>
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: GREEN }}
          >
            <CheckIcon className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold" style={{ color: GREEN }}>
            Dispensación registrada
          </span>
        </div>
        <p className="text-xs" style={{ color: "#64748B" }}>
          Q.F. González — 15:47 hrs
        </p>
        <p className="text-xs mt-0.5" style={{ color: "#475569" }}>
          Hash: <span style={{ color: "#94A3B8" }}>0x7b1a...3f8e</span>
        </p>
        <p className="text-xs" style={{ color: "#10B981" }}>
          ✓ Inmutable en Stellar
        </p>
      </MockScreen>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ visible }: { visible: boolean }) {
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl"
      style={{
        background: "#10B981",
        color: "#0F172A",
        opacity: visible ? 1 : 0,
        transform: `translateX(-50%) translateY(${visible ? "0" : "12px"})`,
        transition: "opacity 0.3s ease, transform 0.3s ease",
        pointerEvents: "none",
        fontWeight: 600,
        fontSize: 14,
      }}
    >
      <CheckIcon className="w-5 h-5" />
      ¡Solicitud enviada! Te contactaremos pronto.
    </div>
  );
}

// ─── Main demo page ───────────────────────────────────────────────────────────
export default function DemoPage() {
  const [email, setEmail] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    // Simulate async submit
    await new Promise((r) => setTimeout(r, 600));
    setEmail("");
    setSubmitting(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  }

  return (
    <div className="min-h-screen" style={{ background: "#0F172A" }}>
      <Navbar variant="landing" />

      {/* Hero */}
      <section className="text-center py-16 px-4">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
          style={{ background: "rgba(16,185,129,0.12)", color: "#10B981", border: "1px solid rgba(16,185,129,0.25)" }}
        >
          <span>✦</span> Demo interactiva
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-4" style={{ color: "#fff" }}>
          Así funciona{" "}
          <span style={{ color: "#10B981" }}>TrustLeaf</span>
        </h1>
        <p className="text-base max-w-xl mx-auto" style={{ color: "#64748B" }}>
          Recetas médicas digitales verificadas con Zero-Knowledge proofs sobre Stellar.
          Ve el flujo completo desde la emisión hasta la dispensación.
        </p>
      </section>

      {/* Flow stats */}
      <section className="max-w-4xl mx-auto px-4 mb-10">
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: <ClockIcon className="w-5 h-5" />, value: "< 2s", label: "Verificación", color: GREEN },
            { icon: <ShieldCheckIcon className="w-5 h-5" />, value: "100%", label: "Infalsificable", color: BLUE },
            { icon: <HeartPulseIcon className="w-5 h-5" />, value: "ZK", label: "Privacidad", color: PURPLE },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-4 rounded-2xl text-center"
              style={{ background: "#1E293B", border: "1px solid #334155" }}
            >
              <div style={{ color: stat.color }}>{stat.icon}</div>
              <div className="text-2xl font-extrabold mt-1" style={{ color: "#fff" }}>
                {stat.value}
              </div>
              <div className="text-xs" style={{ color: "#64748B" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3-column flow */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Doctor column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${GREEN}18`, border: `1px solid ${GREEN}30` }}
              >
                <StethoscopeIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base" style={{ color: "#fff" }}>
                  Médico
                </h2>
                <p className="text-xs" style={{ color: "#64748B" }}>
                  Emite recetas digitales ZK
                </p>
              </div>
              <div
                className="ml-auto w-2.5 h-2.5 rounded-full"
                style={{ background: GREEN, boxShadow: `0 0 6px ${GREEN}` }}
              />
            </div>
            <DoctorScreens />
          </div>

          {/* Patient column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${BLUE}18`, border: `1px solid ${BLUE}30` }}
              >
                <UserIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base" style={{ color: "#fff" }}>
                  Paciente
                </h2>
                <p className="text-xs" style={{ color: "#64748B" }}>
                  Gestiona sus recetas QR
                </p>
              </div>
              <div
                className="ml-auto w-2.5 h-2.5 rounded-full"
                style={{ background: BLUE, boxShadow: `0 0 6px ${BLUE}` }}
              />
            </div>
            <PatientScreens />
          </div>

          {/* Dispensary column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${PURPLE}18`, border: `1px solid ${PURPLE}30` }}
              >
                <ClipboardCheckIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base" style={{ color: "#fff" }}>
                  Farmacia
                </h2>
                <p className="text-xs" style={{ color: "#64748B" }}>
                  Verifica y dispensa
                </p>
              </div>
              <div
                className="ml-auto w-2.5 h-2.5 rounded-full"
                style={{ background: PURPLE, boxShadow: `0 0 6px ${PURPLE}` }}
              />
            </div>
            <DispensaryScreens />
          </div>
        </div>

        {/* Flow arrow */}
        <div className="hidden md:flex items-center justify-center gap-4 my-6">
          {["Médico emite", "→", "Paciente recibe QR", "→", "Farmacia verifica"].map(
            (t, i) => (
              <span
                key={i}
                className="text-sm font-medium"
                style={{ color: i % 2 === 1 ? "#334155" : "#94A3B8" }}
              >
                {t}
              </span>
            )
          )}
        </div>

        {/* Blockchain strip */}
        <div
          className="flex items-center gap-3 p-4 rounded-2xl mt-6"
          style={{ background: "#1E293B", border: "1px solid #334155" }}
        >
          <LockIcon className="w-5 h-5 shrink-0" />
          <p className="text-sm" style={{ color: "#94A3B8" }}>
            Cada transacción queda registrada de forma inmutable en{" "}
            <span style={{ color: "#10B981", fontWeight: 600 }}>Stellar Testnet</span>.
            Los datos del paciente nunca salen del proof ZK.
          </p>
        </div>
      </section>

      {/* CTA section */}
      <section
        className="py-16 px-4"
        style={{ background: "#1E293B", borderTop: "1px solid #334155" }}
      >
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-2xl font-extrabold mb-3" style={{ color: "#fff" }}>
            Solicitar acceso anticipado
          </h2>
          <p className="text-sm mb-6" style={{ color: "#64748B" }}>
            TrustLeaf está en fase beta cerrada. Ingresa tu email y te avisamos cuando
            tu institución pueda unirse.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@clinica.cl"
              className="flex-1 px-4 py-3 rounded-xl text-sm"
              style={{
                background: "#0F172A",
                border: "1px solid #334155",
                color: "#fff",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl text-sm font-bold transition-all"
              style={{
                background: submitting ? "#059669" : "#10B981",
                color: "#0F172A",
                opacity: submitting ? 0.8 : 1,
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? "Enviando..." : "Solicitar acceso"}
            </button>
          </form>

          <p className="text-xs mt-4" style={{ color: "#475569" }}>
            Sin spam. Solo te contactaremos cuando estemos listos.
          </p>

          <div className="flex items-center justify-center gap-6 mt-8">
            {[
              { label: "Hospitales", value: "12+" },
              { label: "Clínicas piloto", value: "3" },
              { label: "Recetas demo", value: "500+" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-xl font-extrabold" style={{ color: "#10B981" }}>
                  {s.value}
                </div>
                <div className="text-xs" style={{ color: "#64748B" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer note */}
      <div
        className="text-center py-6 text-xs"
        style={{ color: "#334155", borderTop: "1px solid #1E293B" }}
      >
        © 2026 Browns Studio · TrustLeaf · Construido sobre Stellar
      </div>

      <Toast visible={showToast} />
    </div>
  );
}
