// Copyright © 2026 Browns Studio
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { saveUserRole } from "../../../lib/user-role";
import {
  CheckIcon,
  ChevronRightIcon,
  QrIcon,
  ShieldCheckIcon,
  ClipboardCheckIcon,
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
  fullName: string;
  rut: string;
  birthDate: string;
  email: string;
}

type AllergyOption =
  | "Penicilina"
  | "AINES"
  | "Sulfonamidas"
  | "Ninguna"
  | "Otra";

const ALLERGY_OPTIONS: AllergyOption[] = [
  "Penicilina",
  "AINES",
  "Sulfonamidas",
  "Ninguna",
  "Otra",
];

interface Step2Data {
  allergies: AllergyOption[];
  currentMedications: string;
}

type FormErrors = Record<string, string>;

// ─── Progress Bar ──────────────────────────────────────────────────────────────
function ProgressBar({ current, total }: { current: number; total: number }) {
  const stepLabels = ["Datos personales", "Info médica", "Listo"];
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
  hint,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: "#CBD5E1" }}>
        {label}
        {required && <span style={{ color: "#F87171" }} className="ml-1">*</span>}
      </label>
      {hint && (
        <p className="text-xs mb-1.5" style={{ color: "#64748B" }}>
          {hint}
        </p>
      )}
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

// ─── Step 1: Personal data ────────────────────────────────────────────────────
function StepPersonal({
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
      <Field label="Nombre completo" required error={errors.fullName}>
        <input
          type="text"
          value={data.fullName}
          onChange={(e) => onChange({ ...data, fullName: e.target.value })}
          placeholder="Ej. María Fernández López"
          style={fieldStyle(!!errors.fullName)}
        />
      </Field>

      <Field label="RUT" required error={errors.rut} hint="Formato: XX.XXX.XXX-X">
        <input
          type="text"
          value={data.rut}
          onChange={(e) => onChange({ ...data, rut: formatRUT(e.target.value) })}
          placeholder="Ej. 12.345.678-9"
          maxLength={12}
          style={fieldStyle(!!errors.rut)}
        />
      </Field>

      <Field label="Fecha de nacimiento" error={errors.birthDate}>
        <input
          type="date"
          value={data.birthDate}
          onChange={(e) => onChange({ ...data, birthDate: e.target.value })}
          style={{
            ...fieldStyle(!!errors.birthDate),
            colorScheme: "dark",
          }}
        />
      </Field>

      <Field label="Correo electrónico" error={errors.email}>
        <input
          type="email"
          value={data.email}
          onChange={(e) => onChange({ ...data, email: e.target.value })}
          placeholder="tu@correo.cl"
          style={fieldStyle(!!errors.email)}
        />
      </Field>
    </div>
  );
}

// ─── Step 2: Medical info ─────────────────────────────────────────────────────
function StepMedical({
  data,
  onChange,
}: {
  data: Step2Data;
  onChange: (d: Step2Data) => void;
}) {
  function toggleAllergy(option: AllergyOption) {
    let updated: AllergyOption[];
    if (option === "Ninguna") {
      updated = data.allergies.includes("Ninguna") ? [] : ["Ninguna"];
    } else {
      const without = data.allergies.filter((a) => a !== "Ninguna");
      if (without.includes(option)) {
        updated = without.filter((a) => a !== option);
      } else {
        updated = [...without, option];
      }
    }
    onChange({ ...data, allergies: updated });
  }

  return (
    <div className="space-y-6">
      <div
        className="rounded-xl p-4"
        style={{
          background: "rgba(16,185,129,0.08)",
          border: "1px solid rgba(16,185,129,0.15)",
        }}
      >
        <p className="text-sm" style={{ color: "#94A3B8" }}>
          Esta información es{" "}
          <span style={{ color: "#10B981", fontWeight: 600 }}>
            privada y encriptada
          </span>
          . Solo se comparte con tu médico para ayudar a evitar prescripciones
          contraindicadas.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3" style={{ color: "#CBD5E1" }}>
          Alergias conocidas
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {ALLERGY_OPTIONS.map((option) => {
            const selected = data.allergies.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleAllergy(option)}
                className="flex items-center gap-2.5 p-3 rounded-xl text-sm text-left transition-all"
                style={{
                  background: selected
                    ? "rgba(16,185,129,0.12)"
                    : "#0F172A",
                  border: selected
                    ? "1px solid rgba(16,185,129,0.5)"
                    : "1px solid #334155",
                  color: selected ? "#10B981" : "#94A3B8",
                }}
              >
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all"
                  style={{
                    background: selected ? "#10B981" : "transparent",
                    border: selected ? "none" : "1.5px solid #475569",
                  }}
                >
                  {selected && <CheckIcon className="w-3 h-3" style={{ color: "#0F172A" } as React.CSSProperties} />}
                </div>
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: "#CBD5E1" }}>
          Medicamentos actuales{" "}
          <span className="text-xs font-normal" style={{ color: "#475569" }}>
            (opcional)
          </span>
        </label>
        <textarea
          value={data.currentMedications}
          onChange={(e) => onChange({ ...data, currentMedications: e.target.value })}
          placeholder="Ej. Atorvastatina 10mg, Losartán 50mg..."
          rows={3}
          style={{
            ...fieldStyle(false),
            resize: "vertical",
            fontFamily: "inherit",
          }}
        />
      </div>
    </div>
  );
}

// ─── Step 3: Done (with Privy auth sub-steps) ─────────────────────────────────
function StepDone() {
  const router = useRouter();
  const { login, authenticated, user } = usePrivy();
  const [loading, setLoading] = useState(false);

  const howItWorks = [
    {
      icon: <ClipboardCheckIcon className="w-5 h-5" />,
      title: "Tu médico emite la receta",
      desc: "Cuando recibes una prescripción, aparece automáticamente en tu portal TrustLeaf.",
    },
    {
      icon: <QrIcon className="w-5 h-5" />,
      title: "Muestra el QR en la farmacia",
      desc: "Presenta el código QR desde tu celular. Sin papel, sin perder recetas.",
    },
    {
      icon: <ShieldCheckIcon className="w-5 h-5" />,
      title: "Verificación blockchain",
      desc: "La farmacia confirma la autenticidad en tiempo real. 100% seguro e infalsificable.",
    },
  ];

  async function handleCreateAccount() {
    setLoading(true);
    saveUserRole("patient");
    try {
      await login();
    } finally {
      setLoading(false);
    }
  }

  function handleGoToPortal() {
    router.push("/patient");
  }

  return (
    <div className="space-y-7 text-center">
      <style>{`
        @keyframes pat-pop-in {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        @keyframes pat-check-draw {
          from { stroke-dashoffset: 32; opacity: 0; }
          to   { stroke-dashoffset: 0;  opacity: 1; }
        }
        .pat-check-circle {
          animation: pat-pop-in 0.5s cubic-bezier(0.175,0.885,0.32,1.275) forwards;
        }
        .pat-check-path {
          stroke-dasharray: 32;
          stroke-dashoffset: 0;
          animation: pat-check-draw 0.4s ease-out 0.35s both;
        }
      `}</style>

      <div className="flex flex-col items-center gap-4">
        <div
          className="pat-check-circle w-24 h-24 rounded-full flex items-center justify-center"
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
            <polyline className="pat-check-path" points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "#fff" }}>
            ¡Bienvenido a TrustLeaf!
          </h2>
          <p className="text-sm mt-1.5" style={{ color: "#94A3B8" }}>
            Tu perfil está listo. Crea tu cuenta para acceder a tus recetas digitales.
          </p>
        </div>
      </div>

      {/* How digital prescriptions work */}
      <div className="space-y-3 text-left">
        {howItWorks.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-4 p-4 rounded-2xl"
            style={{ background: "#0F172A", border: "1px solid #334155" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: "rgba(59,130,246,0.12)",
                color: "#3B82F6",
                border: "1px solid rgba(59,130,246,0.25)",
              }}
            >
              {item.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold" style={{ color: "#3B82F6" }}>
                  Paso {i + 1}
                </span>
              </div>
              <h4 className="text-sm font-semibold mb-0.5" style={{ color: "#fff" }}>
                {item.title}
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: "#64748B" }}>
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Sub-paso A: Create account */}
      {!authenticated && (
        <div
          className="rounded-2xl p-5"
          style={{ background: "#1E293B", border: "1px solid #334155" }}
        >
          <p className="text-sm mb-4" style={{ color: "#94A3B8" }}>
            Crea tu cuenta segura con email, Google o wallet para gestionar tus recetas.
          </p>
          <button
            onClick={handleCreateAccount}
            disabled={loading}
            className="w-full py-3.5 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            style={{
              background: loading ? "#1E3A2F" : "#3B82F6",
              color: "#fff",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <>
                <span
                  className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin inline-block"
                  style={{ borderColor: "#fff transparent #fff #fff" }}
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
            style={{ background: "#3B82F6", color: "#fff" }}
          >
            Ver mis recetas →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function PatientOnboardingPage() {
  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 3;

  const [step1, setStep1] = useState<Step1Data>({
    fullName: "",
    rut: "",
    birthDate: "",
    email: "",
  });

  const [step2, setStep2] = useState<Step2Data>({
    allergies: [],
    currentMedications: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  function validateStep1(): boolean {
    const newErrors: FormErrors = {};
    if (!step1.fullName.trim()) newErrors.fullName = "El nombre es requerido";
    if (!step1.rut.trim()) {
      newErrors.rut = "El RUT es requerido";
    } else if (!validarRUT(step1.rut)) {
      newErrors.rut = "RUT inválido. Verifica el dígito verificador";
    }
    if (
      step1.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(step1.email)
    ) {
      newErrors.email = "Correo electrónico inválido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    let valid = true;
    if (step === 1) valid = validateStep1();
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
          Crear cuenta de paciente
        </h1>
        <p className="text-sm mt-1" style={{ color: "#64748B" }}>
          Gestiona tus recetas digitales de forma segura
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
            <StepPersonal data={step1} onChange={setStep1} errors={errors} />
          )}
          {step === 2 && (
            <StepMedical data={step2} onChange={setStep2} />
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
              {step === 2 ? "Completar perfil" : "Siguiente"}
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
