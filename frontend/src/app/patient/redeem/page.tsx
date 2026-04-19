"use client";

import { useState } from "react";
import { usePasskey } from "../../../hooks/usePasskey";
import { useContractCall } from "../../../hooks/useContractCall";
import { BACKEND_URL } from "../../../lib/stellar";
import { toast } from "sonner";

type Step = "form" | "generating" | "signing" | "done";

export default function RedeemPage() {
  const { walletAddress } = usePasskey();
  const { execute, pending } = useContractCall();

  const [form, setForm] = useState({
    patientRut: "",
    nonce: "",
    commitmentHex: "",
    dispensaryAddress: "",
  });

  const [step, setStep] = useState<Step>("form");

  async function handleRedeem(e: React.FormEvent) {
    e.preventDefault();
    if (!walletAddress) {
      toast.error("Debes estar conectado");
      return;
    }

    setStep("generating");

    // 1. Generate ZK proof server-side
    // The patient sends their private inputs (RUT + nonce) to the backend over TLS.
    // These are NEVER persisted — only held in memory during proof generation (~10-30s).
    const proofRes = await fetch(`${BACKEND_URL}/api/zk/prove`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientRut: form.patientRut,
        nonce: form.nonce,
        dispensaryField: form.dispensaryAddress, // address-as-field (backend converts)
      }),
    });

    if (!proofRes.ok) {
      toast.error("Error generando la prueba ZK");
      setStep("form");
      return;
    }

    const proof = await proofRes.json() as {
      commitmentHex: string;
      nullifierHex: string;
      proofBase64: string;
      vkBase64: string;
      publicInputsBase64: string;
    };

    setStep("signing");

    // 2. Call verify_and_consume on-chain (fee-bumped by backend)
    await execute({
      buildXdr: async () => {
        const xdrRes = await fetch(`${BACKEND_URL}/api/contracts/verify-and-consume`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dispensary: form.dispensaryAddress,
            commitmentHex: proof.commitmentHex,
            nullifierHex: proof.nullifierHex,
            proofBase64: proof.proofBase64,
            vkBase64: proof.vkBase64,
            publicInputsBase64: proof.publicInputsBase64,
          }),
        });
        const { unsignedXdr } = await xdrRes.json() as { unsignedXdr: string };
        return unsignedXdr;
      },
      optimisticUpdate: () => setStep("done"),
      rollback: () => setStep("form"),
      successMessage: "Receta canjeada exitosamente ✅",
    });
  }

  if (step === "done") {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-400 mb-2">¡Receta canjeada!</h2>
          <p className="text-gray-400 text-sm">
            Tu identidad nunca fue revelada. La blockchain solo registró
            que una prueba válida fue consumida.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-green-400 mb-2">👤 Canjear receta</h1>
      <p className="text-gray-400 text-sm mb-6">
        Tu RUT nunca queda registrado. La prueba ZK confirma que eres el titular
        sin revelar tu identidad.
      </p>

      {(step === "generating" || step === "signing") && (
        <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg mb-6">
          <div className="flex items-center gap-3">
            <span className="animate-spin text-xl">⚙️</span>
            <div>
              <p className="font-semibold text-green-300">
                {step === "generating"
                  ? "Generando prueba ZK..."
                  : "Firmando con tu passkey..."}
              </p>
              <p className="text-xs text-gray-400">
                {step === "generating"
                  ? "Esto toma 10-30 segundos. Tu identidad permanece privada."
                  : "Confirma con tu biometría."}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleRedeem} className="space-y-4">
        <Field
          label="Tu RUT"
          value={form.patientRut}
          onChange={(v) => setForm((f) => ({ ...f, patientRut: v }))}
          placeholder="12345678-9"
          required
          hint="Solo se usa localmente para generar la prueba."
        />
        <Field
          label="Nonce de la receta"
          value={form.nonce}
          onChange={(v) => setForm((f) => ({ ...f, nonce: v }))}
          placeholder="(recibido de tu médico)"
          required
          hint="Tu médico te lo entregó de forma segura."
        />
        <Field
          label="Dirección del dispensario"
          value={form.dispensaryAddress}
          onChange={(v) => setForm((f) => ({ ...f, dispensaryAddress: v }))}
          placeholder="G..."
          required
          mono
        />

        <button
          type="submit"
          disabled={pending || step === "generating" || step === "signing"}
          className="w-full py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 rounded-lg font-semibold transition-colors"
        >
          {step !== "form" ? "⏳ Procesando..." : "Canjear receta"}
        </button>
      </form>
    </main>
  );
}

function Field({
  label, value, onChange, placeholder, required, hint, mono,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; hint?: string; mono?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-green-500 outline-none ${mono ? "font-mono text-sm" : ""}`}
      />
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}
