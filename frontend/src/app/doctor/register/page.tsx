// Copyright © 2026 Browns Studio
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { saveUserRole } from "../../../lib/user-role";
import {
  CheckIcon,
  ShieldCheckIcon,
  ClipboardCheckIcon,
  ChevronRightIcon,
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
  specialty: string;
  supersalNumber: string;
}

interface Step2Data {
  clinicName: string;
  address: string;
  phone: string;
  contactEmail: string;
}

type FormErrors = Record<string, string>;

// ─── Progress Bar ──────────────────────────────────────────────────────────────
function ProgressBar({ current, total }: { current: number; total: number }) {
  const stepLabels = ["Datos personales", "Consultorio", "Verificación", "Listo"];
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
                    background: done
                      ? "#10B981"
                      : active
                      ? "#3B82F6"
                      : "#1E293B",
                    color: done
                      ? "#0F172A"
                      : active
                      ? "#fff"
                      : "#475569",
                    border: active ? "none" : done ? "none" : "1px solid #334155",
                    boxShadow: active ? "0 0 0 4px rgba(59,130,246,0.25)" : "none",
                  }}
                >
                  {done ? <CheckIcon className="w-4 h-4" /> : step}
                </div>
                <span
                  className="mt-1.5 text-xs font-medium hidden sm:block"
                  style={{
                    color: active ? "#3B82F6" : done ? "#10B981" : "#475569",
                  }}
                >
                  {stepLabels[i]}
                </span>
              </div>
              {step < total && (
                <div
                  className="flex-1 h-0.5 mx-2 rounded-full overflow-hidden"
                  style={{ background: "#1E293B" }}
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

function inputStyle(hasError: boolean): React.CSSProperties {
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
const SPECIALTIES = [
  "Medicina General",
  "Pediatría",
  "Cardiología",
  "Neurología",
  "Psiquiatría",
  "Ginecología",
  "Traumatología",
  "Otro",
];

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
          placeholder="Ej. Dr. Juan Pérez Soto"
          style={inputStyle(!!errors.fullName)}
        />
      </Field>

      <Field label="RUT" required error={errors.rut}>
        <input
          type="text"
          value={data.rut}
          onChange={(e) => onChange({ ...data, rut: formatRUT(e.target.value) })}
          placeholder="Ej. 12.345.678-9"
          maxLength={12}
          style={inputStyle(!!errors.rut)}
        />
      </Field>

      <Field label="Especialidad" required error={errors.specialty}>
        <select
          value={data.specialty}
          onChange={(e) => onChange({ ...data, specialty: e.target.value })}
          style={{ ...inputStyle(!!errors.specialty), cursor: "pointer" }}
        >
          <option value="">Selecciona una especialidad</option>
          {SPECIALTIES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Número de registro Supersal" required error={errors.supersalNumber}>
        <input
          type="text"
          value={data.supersalNumber}
          onChange={(e) => onChange({ ...data, supersalNumber: e.target.value })}
          placeholder="Ej. 2024-MED-001234"
          style={inputStyle(!!errors.supersalNumber)}
        />
      </Field>
    </div>
  );
}

// ─── Step 2: Practice data ────────────────────────────────────────────────────
function StepPractice({
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
      <Field label="Nombre de clínica / consultorio" error={errors.clinicName}>
        <input
          type="text"
          value={data.clinicName}
          onChange={(e) => onChange({ ...data, clinicName: e.target.value })}
          placeholder="Ej. Clínica Santa María"
          style={inputStyle(!!errors.clinicName)}
        />
      </Field>

      <Field label="Dirección" error={errors.address}>
        <input
          type="text"
          value={data.address}
          onChange={(e) => onChange({ ...data, address: e.target.value })}
          placeholder="Calle, número, ciudad"
          style={inputStyle(!!errors.address)}
        />
      </Field>

      <Field label="Teléfono de contacto" error={errors.phone}>
        <input
          type="tel"
          value={data.phone}
          onChange={(e) => onChange({ ...data, phone: e.target.value })}
          placeholder="+56 9 1234 5678"
          style={inputStyle(!!errors.phone)}
        />
      </Field>

      <Field label="Email de contacto" error={errors.contactEmail}>
        <input
          type="email"
          value={data.contactEmail}
          onChange={(e) => onChange({ ...data, contactEmail: e.target.value })}
          placeholder="doctor@clinica.cl"
          style={inputStyle(!!errors.contactEmail)}
        />
      </Field>
    </div>
  );
}

// ─── Step 3: Identity verification ───────────────────────────────────────────
function StepVerification() {
  const checklist = [
    "Cédula de identidad vigente (ambos lados)",
    "Certificado de registro Supersal actualizado",
    "Foto tipo carnet con fondo blanco",
    "Comprobante de especialidad (si aplica)",
  ];

  return (
    <div className="space-y-6">
      <div
        className="rounded-2xl p-5"
        style={{
          background: "rgba(59,130,246,0.08)",
          border: "1px solid rgba(59,130,246,0.25)",
        }}
      >
        <div className="flex items-start gap-3">
          <ShieldCheckIcon className="w-6 h-6 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold mb-1" style={{ color: "#fff" }}>
              Verificación de identidad
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>
              Tu cuenta será verificada en{" "}
              <span style={{ color: "#3B82F6", fontWeight: 600 }}>
                24 horas hábiles
              </span>{" "}
              por nuestro equipo de compliance. Recibirás un correo con el resultado.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4
          className="text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: "#64748B" }}
        >
          Documentos que necesitarás
        </h4>
        <div className="space-y-2.5">
          {checklist.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: "#0F172A", border: "1px solid #334155" }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{ border: "2px solid #334155", color: "#475569" }}
              >
                {i + 1}
              </div>
              <span className="text-sm" style={{ color: "#CBD5E1" }}>
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="rounded-xl p-4"
        style={{
          background: "rgba(16,185,129,0.08)",
          border: "1px solid rgba(16,185,129,0.2)",
        }}
      >
        <p className="text-sm font-medium" style={{ color: "#10B981" }}>
          ✓ Tus datos están cifrados con TLS 1.3 y almacenados de forma segura.
        </p>
      </div>
    </div>
  );
}

// ─── Step 4: Done (with Privy auth sub-steps) ─────────────────────────────────
function StepDone() {
  const router = useRouter();
  const { login, authenticated, user } = usePrivy();
  const [loading, setLoading] = useState(false);

  const workflowSteps = [
    "Busca al paciente por RUT",
    "Selecciona el medicamento y dosis",
    "Firma y emite la receta ZK",
    "El paciente la recibe en su celular",
  ];

  async function handleCreateAccount() {
    setLoading(true);
    saveUserRole("doctor");
    try {
      await login();
    } finally {
      setLoading(false);
    }
  }

  function handleGoToPortal() {
    router.push("/doctor");
  }

  return (
    <div className="space-y-7 text-center">
      <style>{`
        @keyframes tl-pop-in {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        @keyframes tl-check-draw {
          from { stroke-dashoffset: 32; opacity: 0; }
          to   { stroke-dashoffset: 0;  opacity: 1; }
        }
        .tl-check-circle {
          animation: tl-pop-in 0.5s cubic-bezier(0.175,0.885,0.32,1.275) forwards;
        }
        .tl-check-path {
          stroke-dasharray: 32;
          stroke-dashoffset: 0;
          animation: tl-check-draw 0.4s ease-out 0.35s both;
        }
      `}</style>

      <div className="flex flex-col items-center gap-4">
        <div
          className="tl-check-circle w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(16,185,129,0.15)",
            border: "4px solid #10B981",
          }}
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
            <polyline className="tl-check-path" points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "#fff" }}>
            ¡Registro completado!
          </h2>
          <p className="text-sm mt-1.5" style={{ color: "#94A3B8" }}>
            Tu perfil médico está listo. Ahora crea tu cuenta para acceder.
          </p>
        </div>
      </div>

      {/* Quick guide card */}
      <div
        className="rounded-2xl p-5 text-left"
        style={{ background: "#0F172A", border: "1px solid #334155" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <ClipboardCheckIcon className="w-5 h-5" />
          <h3 className="text-sm font-semibold" style={{ color: "#fff" }}>
            Guía rápida: cómo emitir una receta
          </h3>
        </div>
        <div className="space-y-3">
          {workflowSteps.map((label, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  background: "rgba(16,185,129,0.1)",
                  border: "1px solid rgba(16,185,129,0.3)",
                  color: "#10B981",
                }}
              >
                {i + 1}
              </div>
              <span className="text-sm" style={{ color: "#CBD5E1" }}>
                {label}
              </span>
              {i < workflowSteps.length - 1 && (
                <ChevronRightIcon
                  className="w-4 h-4 ml-auto"
                 
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sub-paso A: Create account */}
      {!authenticated && (
        <div
          className="rounded-2xl p-5"
          style={{ background: "#1E293B", border: "1px solid #334155" }}
        >
          <p className="text-sm mb-4" style={{ color: "#94A3B8" }}>
            Crea tu cuenta segura con email, Google o wallet para guardar tu perfil y emitir recetas.
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
            style={{ background: "#3B82F6", color: "#fff" }}
          >
            Ir al portal médico →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function DoctorRegisterPage() {
  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 4;

  const [step1, setStep1] = useState<Step1Data>({
    fullName: "",
    rut: "",
    specialty: "",
    supersalNumber: "",
  });

  const [step2, setStep2] = useState<Step2Data>({
    clinicName: "",
    address: "",
    phone: "",
    contactEmail: "",
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
    if (!step1.specialty) newErrors.specialty = "Selecciona una especialidad";
    if (!step1.supersalNumber.trim())
      newErrors.supersalNumber = "El número de registro es requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function validateStep2(): boolean {
    const newErrors: FormErrors = {};
    if (
      step2.contactEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(step2.contactEmail)
    ) {
      newErrors.contactEmail = "Correo electrónico inválido";
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
          Registro de Médico
        </h1>
        <p className="text-sm mt-1" style={{ color: "#64748B" }}>
          Crea tu cuenta para emitir recetas digitales verificadas
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
            <StepPractice data={step2} onChange={setStep2} errors={errors} />
          )}
          {step === 3 && <StepVerification />}
          {step === 4 && <StepDone />}
        </div>

        {step < 4 && (
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
              className="flex-1 py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
              style={{ background: "#3B82F6", color: "#fff" }}
            >
              {step === 3 ? "Enviar solicitud" : "Siguiente"}
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
