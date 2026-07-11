// Copyright © 2026 Browns Studio
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePasskey } from "../../../hooks/usePasskey";
import { useContractCall } from "../../../hooks/useContractCall";
import { BACKEND_URL } from "../../../lib/stellar";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PrescribeForm {
  patientRut: string;
  medication: string;
  customMedication: string;
  dosage: string;
  frequency: string;
  instructions: string;
  dispensaryAddress: string;
  validDays: string;
  isControlled: boolean;
}

interface FormErrors {
  patientRut?: string;
  medication?: string;
  dosage?: string;
  dispensaryAddress?: string;
}

// ─── Common medications ────────────────────────────────────────────────────────

interface MedicationOption {
  name: string;
  defaultDosage: string;
  defaultFrequency: string;
  isControlled: boolean;
}

const COMMON_MEDICATIONS: MedicationOption[] = [
  { name: "Amoxicilina 500mg", defaultDosage: "500mg", defaultFrequency: "Cada 8 horas por 7 días", isControlled: false },
  { name: "Amoxicilina + Ác. Clavulánico 875/125mg", defaultDosage: "875mg", defaultFrequency: "Cada 12 horas por 10 días", isControlled: false },
  { name: "Azitromicina 500mg", defaultDosage: "500mg", defaultFrequency: "Una vez al día por 3 días", isControlled: false },
  { name: "Atorvastatina 20mg", defaultDosage: "20mg", defaultFrequency: "Una vez al día (noche)", isControlled: false },
  { name: "Losartán 50mg", defaultDosage: "50mg", defaultFrequency: "Una vez al día", isControlled: false },
  { name: "Enalapril 10mg", defaultDosage: "10mg", defaultFrequency: "Una vez al día", isControlled: false },
  { name: "Metformina 850mg", defaultDosage: "850mg", defaultFrequency: "Con las comidas, 2 veces al día", isControlled: false },
  { name: "Omeprazol 20mg", defaultDosage: "20mg", defaultFrequency: "Una vez al día en ayuno", isControlled: false },
  { name: "Ibuprofeno 400mg", defaultDosage: "400mg", defaultFrequency: "Cada 8 horas con alimento", isControlled: false },
  { name: "Paracetamol 1g", defaultDosage: "1g", defaultFrequency: "Cada 8 horas máximo", isControlled: false },
  { name: "Alprazolam 0.25mg", defaultDosage: "0.25mg", defaultFrequency: "Según indicación médica", isControlled: true },
  { name: "Clonazepam 0.5mg", defaultDosage: "0.5mg", defaultFrequency: "Según indicación médica", isControlled: true },
  { name: "Tramadol 50mg", defaultDosage: "50mg", defaultFrequency: "Cada 8 horas según dolor", isControlled: true },
  { name: "Morfina 10mg", defaultDosage: "10mg", defaultFrequency: "Según prescripción estricta", isControlled: true },
  { name: "Otro (especificar)", defaultDosage: "", defaultFrequency: "", isControlled: false },
];

// ─── Validation ───────────────────────────────────────────────────────────────

function validateRut(rut: string): boolean {
  const clean = rut.replace(/\./g, "").replace(/-/g, "").trim().toUpperCase();
  if (clean.length < 2) return false;
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  if (!/^\d+$/.test(body)) return false;
  // Módulo 11
  let sum = 0;
  let factor = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const mod = 11 - (sum % 11);
  const expected = mod === 11 ? "0" : mod === 10 ? "K" : String(mod);
  return dv === expected;
}

function formatRut(value: string): string {
  const clean = value.replace(/\./g, "").replace(/-/g, "").replace(/[^0-9kK]/g, "");
  if (clean.length <= 1) return clean;
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1).toUpperCase();
  const bodyFormatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${bodyFormatted}-${dv}`;
}

function validateForm(form: PrescribeForm): FormErrors {
  const errors: FormErrors = {};
  const rut = form.patientRut.trim();
  if (!rut) {
    errors.patientRut = "El RUT del paciente es requerido.";
  } else if (!validateRut(rut)) {
    errors.patientRut = "RUT inválido. Ingresa un RUT chileno válido (ej: 12.345.678-9).";
  }

  const med = form.medication === "Otro (especificar)" ? form.customMedication : form.medication;
  if (!med.trim()) {
    errors.medication = "Selecciona o ingresa un medicamento.";
  }

  if (!form.dosage.trim()) {
    errors.dosage = "Ingresa la dosis.";
  }

  if (!form.dispensaryAddress.trim()) {
    errors.dispensaryAddress = "La dirección del dispensario es requerida.";
  } else if (!form.dispensaryAddress.trim().startsWith("G") || form.dispensaryAddress.trim().length < 10) {
    errors.dispensaryAddress = "Ingresa una dirección Stellar válida (empieza con G...).";
  }

  return errors;
}

// ─── Icon helpers ─────────────────────────────────────────────────────────────

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

// ─── Field wrapper ─────────────────────────────────────────────────────────────

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">{label}</label>
      {children}
      {hint && !error && <p className="text-[#475569] text-xs mt-1.5">{hint}</p>}
      {error && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
        <span>⚠</span> {error}
      </p>}
    </div>
  );
}

const inputClass =
  "w-full px-4 py-3 bg-[#0F172A] border border-[#334155] focus:border-[#10B981] text-white text-sm rounded-xl outline-none transition-colors placeholder-[#475569]";

const inputErrorClass =
  "w-full px-4 py-3 bg-[#0F172A] border border-red-500 focus:border-red-400 text-white text-sm rounded-xl outline-none transition-colors placeholder-[#475569]";

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PrescribePage() {
  const router = useRouter();
  const { walletAddress } = usePasskey();
  const { execute, pending } = useContractCall();

  const [form, setForm] = useState<PrescribeForm>({
    patientRut: "",
    medication: "",
    customMedication: "",
    dosage: "",
    frequency: "",
    instructions: "",
    dispensaryAddress: "",
    validDays: "30",
    isControlled: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [step, setStep] = useState<"form" | "committing" | "done">("form");
  const [touched, setTouched] = useState<Set<string>>(new Set());

  function handleRutChange(value: string) {
    setForm((f) => ({ ...f, patientRut: formatRut(value) }));
  }

  function handleMedicationChange(value: string) {
    const opt = COMMON_MEDICATIONS.find((m) => m.name === value);
    setForm((f) => ({
      ...f,
      medication: value,
      dosage: opt?.defaultDosage ?? f.dosage,
      frequency: opt?.defaultFrequency ?? f.frequency,
      isControlled: opt?.isControlled ?? false,
    }));
  }

  function markTouched(field: string) {
    setTouched((prev) => new Set([...prev, field]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const allErrors = validateForm(form);
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setTouched(new Set(Object.keys(allErrors)));
      toast.error("Revisa los campos marcados");
      return;
    }
    setErrors({});

    if (!walletAddress) {
      toast.error("Debes estar conectado");
      return;
    }

    setStep("committing");

    try {
      const commitRes = await fetch(`${BACKEND_URL}/api/zk/commitment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientRut: form.patientRut }),
      });

      if (!commitRes.ok) {
        toast.error("Error generando el commitment ZK");
        setStep("form");
        return;
      }

      const { commitmentHex, nonce } = (await commitRes.json()) as {
        commitmentHex: string;
        nonce: string;
      };

      const medication =
        form.medication === "Otro (especificar)"
          ? form.customMedication
          : form.medication;

      await fetch(`${BACKEND_URL}/api/prescriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commitmentHex,
          nonce,
          doctorAddress: walletAddress,
          dispensaryAddress: form.dispensaryAddress,
          medication,
          dosage: form.dosage,
          frequency: form.frequency,
          instructions: form.instructions,
        }),
      });

      await execute({
        buildXdr: async () => {
          const xdrRes = await fetch(
            `${BACKEND_URL}/api/contracts/submit-commitment`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                doctor: walletAddress,
                commitmentHex,
                authorizedDispensary: form.dispensaryAddress,
                validDays: parseInt(form.validDays),
              }),
            }
          );
          const { unsignedXdr } = (await xdrRes.json()) as {
            unsignedXdr: string;
          };
          return unsignedXdr;
        },
        optimisticUpdate: () => setStep("done"),
        rollback: () => setStep("form"),
        successMessage: "Receta emitida en blockchain",
      });
    } catch {
      toast.error("Error inesperado. Intenta de nuevo.");
      setStep("form");
    }
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (step === "done") {
    return (
      <main className="min-h-screen bg-[#0F172A] flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-[#10B981]/10 border-2 border-[#10B981] flex items-center justify-center mx-auto mb-5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-[#10B981]">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Receta emitida</h2>
          <p className="text-[#64748B] text-sm mb-2">
            La receta quedó registrada en Stellar Network.
          </p>
          <p className="text-[#64748B] text-sm mb-8">
            El paciente puede canjearla en el dispensario autorizado.
            <span className="text-[#10B981] block mt-1">
              Cero datos personales en blockchain. ✓
            </span>
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setStep("form");
                setForm({
                  patientRut: "",
                  medication: "",
                  customMedication: "",
                  dosage: "",
                  frequency: "",
                  instructions: "",
                  dispensaryAddress: "",
                  validDays: "30",
                  isControlled: false,
                });
              }}
              className="flex-1 py-3 border border-[#334155] hover:border-[#475569] text-[#94A3B8] hover:text-white text-sm font-medium rounded-xl transition-colors"
            >
              Nueva receta
            </button>
            <button
              onClick={() => router.push("/doctor")}
              className="flex-1 py-3 bg-[#10B981] hover:bg-[#059669] text-[#0F172A] text-sm font-semibold rounded-xl transition-colors"
            >
              Ir al panel
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ── Committing screen ───────────────────────────────────────────────────────
  if (step === "committing") {
    return (
      <main className="min-h-screen bg-[#0F172A] flex items-center justify-center p-8">
        <div className="text-center max-w-xs">
          <div className="w-16 h-16 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mx-auto mb-5" />
          <h3 className="text-white font-semibold text-lg mb-2">Generando prueba ZK…</h3>
          <p className="text-[#64748B] text-sm">
            Creando el commitment criptográfico y registrando en Stellar.
          </p>
        </div>
      </main>
    );
  }

  const isCustom = form.medication === "Otro (especificar)";
  const isSubmitting = pending || step === "committing";

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0F172A]/95 backdrop-blur-sm border-b border-[#334155] px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            href="/doctor"
            className="p-2 rounded-lg text-[#64748B] hover:text-white hover:bg-[#1E293B] transition-colors"
          >
            <BackIcon />
          </Link>
          <div>
            <h1 className="text-white font-bold text-base leading-none">Nueva Receta ZK</h1>
            <p className="text-[#64748B] text-xs mt-0.5">Zero-knowledge · Stellar Network</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* ZK privacy notice */}
        <div className="flex items-start gap-3 p-4 bg-[#10B981]/5 border border-[#10B981]/20 rounded-xl mb-7">
          <ShieldIcon />
          <div className="text-sm text-[#10B981]">
            <span className="font-semibold">Privacidad ZK activa: </span>
            <span className="text-[#34D399]">
              El RUT del paciente nunca se registra en blockchain. Solo un hash matemáticamente irrastreable.
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Paciente */}
          <section className="bg-[#1E293B] rounded-2xl p-5 border border-[#334155] space-y-5">
            <h2 className="text-white font-semibold text-base border-b border-[#334155] pb-3">
              Datos del Paciente
            </h2>

            <Field
              label="RUT del paciente *"
              hint="Solo visible para ti. Se convierte en hash antes de enviarse."
              error={touched.has("patientRut") ? errors.patientRut : undefined}
            >
              <input
                type="text"
                value={form.patientRut}
                onChange={(e) => handleRutChange(e.target.value)}
                onBlur={() => {
                  markTouched("patientRut");
                  setErrors((prev) => ({
                    ...prev,
                    ...validateForm(form),
                  }));
                }}
                placeholder="12.345.678-9"
                className={touched.has("patientRut") && errors.patientRut ? inputErrorClass : inputClass}
                maxLength={12}
              />
            </Field>
          </section>

          {/* Section: Medicamento */}
          <section className="bg-[#1E293B] rounded-2xl p-5 border border-[#334155] space-y-5">
            <h2 className="text-white font-semibold text-base border-b border-[#334155] pb-3">
              Medicamento
            </h2>

            <Field
              label="Medicamento *"
              error={touched.has("medication") && errors.medication ? errors.medication : undefined}
            >
              <select
                value={form.medication}
                onChange={(e) => handleMedicationChange(e.target.value)}
                onBlur={() => markTouched("medication")}
                className={`${touched.has("medication") && errors.medication ? inputErrorClass : inputClass} cursor-pointer`}
              >
                <option value="">Seleccionar medicamento…</option>
                <optgroup label="Antibióticos">
                  {COMMON_MEDICATIONS.filter((m) => m.name.includes("cilina") || m.name.includes("micina")).map((m) => (
                    <option key={m.name} value={m.name}>{m.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Cardiovascular">
                  {COMMON_MEDICATIONS.filter((m) => ["Atorvastatina", "Losartán", "Enalapril"].some((k) => m.name.includes(k))).map((m) => (
                    <option key={m.name} value={m.name}>{m.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Metabólico / GI">
                  {COMMON_MEDICATIONS.filter((m) => ["Metformina", "Omeprazol"].some((k) => m.name.includes(k))).map((m) => (
                    <option key={m.name} value={m.name}>{m.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Analgésicos">
                  {COMMON_MEDICATIONS.filter((m) => ["Ibuprofeno", "Paracetamol"].some((k) => m.name.includes(k))).map((m) => (
                    <option key={m.name} value={m.name}>{m.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Controlados">
                  {COMMON_MEDICATIONS.filter((m) => m.isControlled).map((m) => (
                    <option key={m.name} value={m.name}>⚠ {m.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Otro">
                  <option value="Otro (especificar)">Otro (especificar)</option>
                </optgroup>
              </select>
            </Field>

            {/* Controlled warning */}
            {form.isControlled && (
              <div className="flex items-start gap-3 p-4 bg-orange-900/20 border border-orange-700 rounded-xl">
                <AlertIcon />
                <div className="text-sm">
                  <p className="text-orange-300 font-semibold">Medicamento Controlado</p>
                  <p className="text-orange-400/80 mt-0.5 text-xs">
                    Este medicamento requiere receta médica especial. El dispensario quedará obligado a registrar la dispensación en el libro de control.
                  </p>
                </div>
              </div>
            )}

            {isCustom && (
              <Field
                label="Nombre del medicamento *"
                error={touched.has("medication") && errors.medication ? errors.medication : undefined}
              >
                <input
                  type="text"
                  value={form.customMedication}
                  onChange={(e) => setForm((f) => ({ ...f, customMedication: e.target.value }))}
                  placeholder="Ej: Metoprolol 100mg"
                  className={inputClass}
                />
              </Field>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Dosis *"
                error={touched.has("dosage") && errors.dosage ? errors.dosage : undefined}
              >
                <input
                  type="text"
                  value={form.dosage}
                  onChange={(e) => setForm((f) => ({ ...f, dosage: e.target.value }))}
                  onBlur={() => markTouched("dosage")}
                  placeholder="Ej: 500mg"
                  className={touched.has("dosage") && errors.dosage ? inputErrorClass : inputClass}
                />
              </Field>
              <Field label="Frecuencia">
                <input
                  type="text"
                  value={form.frequency}
                  onChange={(e) => setForm((f) => ({ ...f, frequency: e.target.value }))}
                  placeholder="Ej: Cada 8 horas"
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Instrucciones adicionales">
              <textarea
                value={form.instructions}
                onChange={(e) => setForm((f) => ({ ...f, instructions: e.target.value }))}
                placeholder="Tomar con alimentos, evitar alcohol, etc."
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </Field>
          </section>

          {/* Section: Dispensario */}
          <section className="bg-[#1E293B] rounded-2xl p-5 border border-[#334155] space-y-5">
            <h2 className="text-white font-semibold text-base border-b border-[#334155] pb-3">
              Dispensario y Vigencia
            </h2>

            <Field
              label="Dispensario autorizado *"
              hint="Dirección Stellar (G...) de la farmacia que podrá dispensar esta receta."
              error={touched.has("dispensaryAddress") && errors.dispensaryAddress ? errors.dispensaryAddress : undefined}
            >
              <input
                type="text"
                value={form.dispensaryAddress}
                onChange={(e) => setForm((f) => ({ ...f, dispensaryAddress: e.target.value }))}
                onBlur={() => {
                  markTouched("dispensaryAddress");
                  setErrors((prev) => ({ ...prev, ...validateForm(form) }));
                }}
                placeholder="GXXXXXXXXXXXXXXXX…"
                className={`${touched.has("dispensaryAddress") && errors.dispensaryAddress ? inputErrorClass : inputClass} font-mono`}
              />
            </Field>

            <Field label="Validez de la receta">
              <div className="grid grid-cols-4 gap-2">
                {["15", "30", "60", "90"].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, validDays: days }))}
                    className={`py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      form.validDays === days
                        ? "bg-[#10B981] text-[#0F172A]"
                        : "bg-[#0F172A] border border-[#334155] text-[#64748B] hover:border-[#475569] hover:text-white"
                    }`}
                  >
                    {days}d
                  </button>
                ))}
              </div>
            </Field>
          </section>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#10B981] hover:bg-[#059669] disabled:bg-[#1E293B] disabled:text-[#475569] disabled:cursor-not-allowed text-[#0F172A] font-bold rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] text-sm"
          >
            {isSubmitting ? "Generando prueba ZK…" : "Emitir Receta en Blockchain"}
          </button>

          <p className="text-center text-[#475569] text-xs pb-2">
            Al emitir, confirmas que eres el médico prescriptor y que esta receta es válida.
          </p>
        </form>
      </main>
    </div>
  );
}
