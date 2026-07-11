// Copyright © 2026 Browns Studio
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { saveUserRole } from "../../../lib/user-role";
import {
  CheckIcon,
  QrIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
} from "../../../components/icons/TrustLeafIcons";

// ─── RUT validation (modulo 11) ──────────────────────────────────────────────
function validarRUT(rut: string): boolean {
  const cleaned = rut.replace(/[.\-]/g, "");
  if (!/^\d{7,8}[0-9Kk]$/.test(cleaned)) return false;
  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1).toUpperCase();
  let sum = 0;
  let multiplier = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const remainder = sum % 11;
  const computed =
    remainder === 0 ? "0" : remainder === 1 ? "K" : String(11 - remainder);
  return computed === dv;
}

function formatRUT(value: string): string {
  const cleaned = value.replace(/[^0-9kK]/g, "");
  if (cleaned.length <= 1) return cleaned;
  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);
  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formatted}-${dv}`;
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface Step1Data {
  pharmacyName: string;
  address: string;
  phone: string;
  sanitaryAuth: string;
}

interface Step2Data {
  pharmacistName: string;
  rut: string;
  membershipNumber: string;
}

type FormErrors = Record<string, string>;

// ─── Progress Bar ──────────────────────────────────────────────────────────────
function ProgressBar({ current, total }: { current: number; total: number }) {
  const stepLabels = ["Datos del local", "Responsable técnico", "Listo"];
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: total }, (_, i) => {
          const step = i + 1;
          const done = step < current;
          const active = step === current;
          return (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                  style={{
                    background: done ? "#10B981" : active ? "#3B82F6" : "#1E293B",
                    color: done ? "#0F172A" : active ? "#fff" : "#475569",
                    border: done || active ? "none" : "1px solid #334155",
                    boxShadow: active ? "0 0 0 4px rgba(59,130,246,0.25)" : "none",
                  }}
                >
                  {done ? <CheckIcon className="w-4 h-4" /> : step}
                </div>
                <span
                  className="mt-1.5 text-xs font-medium hidden sm:block"
                  style={{ color: active ? "#3B82F6" : done ? "#10B981" : "#475569" }}
                >
                  {stepLabels[i]}
                </span>
              </div>
              {step < total && (
                <div
                  className="flex-1 h-0.5 mx-2 rounded-full overflow-hidden"
                  style={{ background: "#0F172A" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: step < current ? "100%" : "0%",
                      background: "#10B981",
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-center text-xs mt-3" style={{ color: "#475569" }}>
        Paso {current} de {total}
      </p>
    </div>
  );
}

// ─── Field wrapper ─────────────────────────────────────────────────────────────
function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: "#CBD5E1" }}>
        {label}
        {required && <span style={{ color: "#F87171" }} className="ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs flex items-center gap-1" style={{ color: "#F87171" }}>
          ⚠ {error}
        </p>
      )}
    </div>
  );
}

function fieldStyle(hasError: boolean): React.CSSProperties {
  return {
    width: "100%",
    padding: "10px 16px",
    background: "#0F172A",
    border: `1px solid ${hasError ? "#F87171" : "#334155"}`,
    borderRadius: "12px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
  };
}

// ─── Step 1: Local data ───────────────────────────────────────────────────────
function StepLocalData({
  data,
  onChange,
  errors,
}: {
  data: Step1Data;
  onChange: (d: Step1Data) => void;
  errors: FormErrors;
}) {
  return (
    <div className="space-y-5">
      <Field label="Nombre de la farmacia" required error={errors.pharmacyName}>
        <input
          type="text"
          value={data.pharmacyName}
          onChange={(e) => onChange({ ...data, pharmacyName: e.target.value })}
          placeholder="Ej. Farmacia Cruz Verde Las Condes"
          style={fieldStyle(!!errors.pharmacyName)}
        />
      </Field>

      <Field label="Dirección" required error={errors.address}>
        <input
          type="text"
          value={data.address}
          onChange={(e) => onChange({ ...data, address: e.target.value })}
          placeholder="Calle, número, ciudad"
          style={fieldStyle(!!errors.address)}
        />
      </Field>

      <Field label="Teléfono" error={errors.phone}>
        <input
          type="tel"
          value={data.phone}
          onChange={(e) => onChange({ ...data, phone: e.target.value })}
          placeholder="+56 2 1234 5678"
          style={fieldStyle(!!errors.phone)}
        />
      </Field>

      <Field label="Número de autorización sanitaria" error={errors.sanitaryAuth}>
        <input
          type="text"
          value={data.sanitaryAuth}
          onChange={(e) => onChange({ ...data, sanitaryAuth: e.target.value })}
          placeholder="Ej. SEREMI-RM-2024-00123"
          style={fieldStyle(!!errors.sanitaryAuth)}
        />
      </Field>
    </div>
  );
}

// ─── Step 2: Technical responsible ────────────────────────────────────────────
function StepTechResponsible({
  data,
  onChange,
  errors,
}: {
  data: Step2Data;
  onChange: (d: Step2Data) => void;
  errors: FormErrors;
}) {
  return (
    <div className="space-y-5">
      <div
        className="rounded-xl p-4"
        style={{
          background: "rgba(59,130,246,0.08)",
          border: "1px solid rgba(59,130,246,0.2)",
        }}
      >
        <p className="text-sm" style={{ color: "#94A3B8" }}>
          El responsable técnico es el químico farmacéutico a cargo del establecimiento,
          según lo exige el Reglamento de Farmacias.
        </p>
      </div>

      <Field label="Nombre del farmacéutico" required error={errors.pharmacistName}>
        <input
          type="text"
          value={data.pharmacistName}
          onChange={(e) => onChange({ ...data, pharmacistName: e.target.value })}
          placeholder="Ej. Q.F. María González"
          style={fieldStyle(!!errors.pharmacistName)}
        />
      </Field>

      <Field label="RUT del farmacéutico" required error={errors.rut}>
        <input
          type="text"
          value={data.rut}
          onChange={(e) => onChange({ ...data, rut: formatRUT(e.target.value) })}
          placeholder="Ej. 12.345.678-9"
          maxLength={12}
          style={fieldStyle(!!errors.rut)}
        />
      </Field>

      <Field label="Número de colegiatura" error={errors.membershipNumber}>
        <input
          type="text"
          value={data.membershipNumber}
          onChange={(e) => onChange({ ...data, membershipNumber: e.target.value })}
          placeholder="Ej. COF-2024-001234"
          style={fieldStyle(!!errors.membershipNumber)}
        />
      </Field>
    </div>
  );
}

// ─── Demo QR Code SVG ─────────────────────────────────────────────────────────
function DemoQR() {
  const modules: [number, number][] = [
    [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],
    [0,1],[6,1],[0,2],[2,2],[3,2],[4,2],[6,2],
    [0,3],[2,3],[4,3],[6,3],[0,4],[2,4],[3,4],[4,4],[6,4],
    [0,5],[6,5],[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],
    [14,0],[15,0],[16,0],[17,0],[18,0],[19,0],[20,0],
    [14,1],[20,1],[14,2],[16,2],[17,2],[18,2],[20,2],
    [14,3],[16,3],[18,3],[20,3],[14,4],[16,4],[17,4],[18,4],[20,4],
    [14,5],[20,5],[14,6],[15,6],[16,6],[17,6],[18,6],[19,6],[20,6],
    [0,14],[1,14],[2,14],[3,14],[4,14],[5,14],[6,14],
    [0,15],[6,15],[0,16],[2,16],[3,16],[4,16],[6,16],
    [0,17],[2,17],[4,17],[6,17],[0,18],[2,18],[3,18],[4,18],[6,18],
    [0,19],[6,19],[0,20],[1,20],[2,20],[3,20],[4,20],[5,20],[6,20],
    [8,0],[10,0],[12,0],[8,2],[9,2],[11,2],[8,4],[10,4],[12,4],
    [9,6],[11,6],[8,8],[10,8],[11,8],[9,10],[10,10],[12,10],
    [8,12],[9,12],[11,12],[12,12],[8,14],[10,14],[9,16],[11,16],
    [8,18],[10,18],[12,18],[9,20],[11,20],[12,20],
    [14,8],[16,8],[18,8],[20,8],[15,10],[17,10],[19,10],
    [14,12],[15,12],[17,12],[19,12],[20,12],[16,14],[18,14],[20,14],
    [14,16],[15,16],[17,16],[19,16],[14,18],[16,18],[18,18],[20,18],
    [15,20],[17,20],[19,20],[20,20],
  ];

  const size = 21;
  const cellSize = 8;
  const padding = 12;
  const total = size * cellSize + padding * 2;

  return (
    <svg
      width={total}
      height={total}
      viewBox={`0 0 ${total} ${total}`}
      style={{ background: "#fff", borderRadius: 12, display: "block" }}
    >
      {modules.map(([col, row], idx) => (
        <rect
          key={idx}
          x={padding + col * cellSize}
          y={padding + row * cellSize}
          width={cellSize - 1}
          height={cellSize - 1}
          fill="#0F172A"
          rx={1}
        />
      ))}
    </svg>
  );
}

// ─── Step 3: Done (with Privy auth sub-steps) ─────────────────────────────────
function StepDone() {
  const router = useRouter();
  const { login, authenticated, user } = usePrivy();
  const [loading, setLoading] = useState(false);

  const steps = [
    { num: 1, label: "Escanea el QR del paciente en la ventanilla" },
    { num: 2, label: "TrustLeaf verifica la receta en tiempo real" },
    { num: 3, label: "Confirmas la dispensación con tu PIN" },
    { num: 4, label: "El registro queda en blockchain automáticamente" },
  ];

  async function handleCreateAccount() {
    setLoading(true);
    saveUserRole("dispensary");
    try {
      await login();
    } finally {
      setLoading(false);
    }
  }

  function handleGoToPortal() {
    router.push("/dispensary");
  }

  return (
    <div className="space-y-7 text-center">
      <style>{`
        @keyframes disp-pop-in {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        @keyframes disp-check-draw {
          from { stroke-dashoffset: 32; opacity: 0; }
          to   { stroke-dashoffset: 0;  opacity: 1; }
        }
        .disp-check-circle {
          animation: disp-pop-in 0.5s cubic-bezier(0.175,0.885,0.32,1.275) forwards;
        }
        .disp-check-path {
          stroke-dasharray: 32;
          stroke-dashoffset: 0;
          animation: disp-check-draw 0.4s ease-out 0.35s both;
        }
      `}</style>

      <div className="flex flex-col items-center gap-4">
        <div
          className="disp-check-circle w-24 h-24 rounded-full flex items-center justify-center"
          style={{ background: "rgba(16,185,129,0.15)", border: "4px solid #10B981" }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10B981"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-12 h-12"
          >
            <polyline className="disp-check-path" points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "#fff" }}>
            ¡Farmacia registrada!
          </h2>
          <p className="text-sm mt-1.5" style={{ color: "#94A3B8" }}>
            Tu local está listo. Crea tu cuenta para empezar a verificar recetas.
          </p>
        </div>
      </div>

      {/* QR workflow explanation */}
      <div
        className="rounded-2xl p-5 text-left"
        style={{ background: "#0F172A", border: "1px solid #334155" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <QrIcon className="w-5 h-5" style={{ color: "#10B981" } as React.CSSProperties} />
          <h3 className="text-sm font-semibold" style={{ color: "#fff" }}>
            Flujo de verificación QR
          </h3>
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-6 items-center">
          <div className="space-y-3">
            {steps.map((s) => (
              <div key={s.num} className="flex items-start gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                  style={{
                    background: "rgba(16,185,129,0.1)",
                    border: "1px solid rgba(16,185,129,0.3)",
                    color: "#10B981",
                  }}
                >
                  {s.num}
                </div>
                <span className="text-sm leading-relaxed" style={{ color: "#CBD5E1" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          <div className="shrink-0 hidden sm:block">
            <DemoQR />
            <p className="text-xs mt-2 text-center" style={{ color: "#475569" }}>
              QR de demo
            </p>
          </div>
        </div>
      </div>

      {/* Sub-paso A: Create account */}
      {!authenticated && (
        <div
          className="rounded-2xl p-5"
          style={{ background: "#1E293B", border: "1px solid #334155" }}
        >
          <p className="text-sm mb-4" style={{ color: "#94A3B8" }}>
            Crea tu cuenta segura con email, Google o wallet para acceder al portal de farmacia.
          </p>
          <button
            onClick={handleCreateAccount}
            disabled={loading}
            className="w-full py-3.5 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            style={{
              background: loading ? "#1E3A2F" : "#10B981",
              color: loading ? "#10B981" : "#0F172A",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <>
                <span
                  className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin inline-block"
                  style={{ borderColor: "#10B981 transparent #10B981 #10B981" }}
                />
                Abriendo autenticación...
              </>
            ) : (
              "🔐 Crear mi cuenta"
            )}
          </button>
        </div>
      )}

      {/* Sub-paso B: Account created — go to portal */}
      {authenticated && (
        <div
          className="rounded-2xl p-5"
          style={{
            background: "rgba(16,185,129,0.08)",
            border: "1px solid rgba(16,185,129,0.3)",
          }}
        >
          <div className="flex items-center gap-2 mb-3 justify-center">
            <span className="text-xl">✅</span>
            <p className="text-sm font-semibold" style={{ color: "#10B981" }}>
              Cuenta creada
            </p>
          </div>
          {user?.email?.address && (
            <p className="text-xs mb-4" style={{ color: "#64748B" }}>
              {user.email.address}
            </p>
          )}
          <button
            onClick={handleGoToPortal}
            className="w-full py-3.5 text-sm font-bold rounded-xl transition-colors"
            style={{ background: "#10B981", color: "#0F172A" }}
          >
            Ir al portal de farmacia →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function DispensaryRegisterPage() {
  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 3;

  const [step1, setStep1] = useState<Step1Data>({
    pharmacyName: "",
    address: "",
    phone: "",
    sanitaryAuth: "",
  });

  const [step2, setStep2] = useState<Step2Data>({
    pharmacistName: "",
    rut: "",
    membershipNumber: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  function validateStep1(): boolean {
    const newErrors: FormErrors = {};
    if (!step1.pharmacyName.trim()) newErrors.pharmacyName = "El nombre es requerido";
    if (!step1.address.trim()) newErrors.address = "La dirección es requerida";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function validateStep2(): boolean {
    const newErrors: FormErrors = {};
    if (!step2.pharmacistName.trim())
      newErrors.pharmacistName = "El nombre del farmacéutico es requerido";
    if (!step2.rut.trim()) {
      newErrors.rut = "El RUT es requerido";
    } else if (!validarRUT(step2.rut)) {
      newErrors.rut = "RUT inválido. Verifica el dígito verificador";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    let valid = true;
    if (step === 1) valid = validateStep1();
    if (step === 2) valid = validateStep2();
    if (valid) {
      setErrors({});
      setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    }
  }

  function handleBack() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start py-10 px-4"
      style={{ background: "#0F172A" }}
    >
      {/* Header */}
      <div className="w-full max-w-lg mb-6 text-center">
        <div className="inline-flex items-center gap-2.5 mb-4">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm"
            style={{ background: "#10B981", color: "#0F172A" }}
          >
            TL
          </div>
          <span className="font-bold text-xl" style={{ color: "#fff" }}>
            Trust<span style={{ color: "#10B981" }}>Leaf</span>
          </span>
        </div>
        <h1 className="text-2xl font-bold" style={{ color: "#fff" }}>
          Registro de Farmacia
        </h1>
        <p className="text-sm mt-1" style={{ color: "#64748B" }}>
          Habilita tu local para verificar recetas digitales en tiempo real
        </p>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-lg rounded-2xl p-6 sm:p-8 shadow-2xl"
        style={{ background: "#1E293B", border: "1px solid #334155" }}
      >
        <ProgressBar current={step} total={TOTAL_STEPS} />

        <div style={{ minHeight: 320 }}>
          {step === 1 && (
            <StepLocalData data={step1} onChange={setStep1} errors={errors} />
          )}
          {step === 2 && (
            <StepTechResponsible data={step2} onChange={setStep2} errors={errors} />
          )}
          {step === 3 && <StepDone />}
        </div>

        {step < 3 && (
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="flex-1 py-3 rounded-xl text-sm font-medium transition-colors"
                style={{ border: "1px solid #334155", color: "#94A3B8", background: "transparent" }}
              >
                ← Anterior
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
              style={{ background: "#3B82F6", color: "#fff" }}
            >
              {step === 2 ? "Completar registro" : "Siguiente"}
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <p className="mt-6 text-sm" style={{ color: "#475569" }}>
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" style={{ color: "#3B82F6" }}>
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
