"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePasskey } from "../../../hooks/usePasskey";
import { useContractCall } from "../../../hooks/useContractCall";
import { BACKEND_URL } from "../../../lib/stellar";
import { toast } from "sonner";

export default function PrescribePage() {
  const router = useRouter();
  const { walletAddress } = usePasskey();
  const { execute, pending } = useContractCall();

  const [form, setForm] = useState({
    patientRut: "",
    dispensaryAddress: "",
    validDays: "30",
  });
  const [step, setStep] = useState<"form" | "committing" | "done">("form");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!walletAddress) {
      toast.error("Debes estar conectado");
      return;
    }

    setStep("committing");

    // 1. Generate commitment server-side (doctor sends patient RUT to backend)
    const commitRes = await fetch(`${BACKEND_URL}/api/zk/commitment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientRut: form.patientRut }),
    });

    if (!commitRes.ok) {
      toast.error("Error generando el commitment");
      setStep("form");
      return;
    }

    const { commitmentHex, nonce } = await commitRes.json() as {
      commitmentHex: string;
      nonce: string;
    };

    // 2. Store encrypted nonce in Firestore (via backend)
    await fetch(`${BACKEND_URL}/api/prescriptions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        commitmentHex,
        nonce, // backend encrypts with AES-256 before storing
        doctorAddress: walletAddress,
        dispensaryAddress: form.dispensaryAddress,
      }),
    });

    // 3. Submit commitment on-chain (optimistic)
    await execute({
      buildXdr: async () => {
        const xdrRes = await fetch(`${BACKEND_URL}/api/contracts/submit-commitment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            doctor: walletAddress,
            commitmentHex,
            authorizedDispensary: form.dispensaryAddress,
            validDays: parseInt(form.validDays),
          }),
        });
        const { unsignedXdr } = await xdrRes.json() as { unsignedXdr: string };
        return unsignedXdr;
      },
      optimisticUpdate: () => setStep("done"),
      rollback: () => setStep("form"),
      successMessage: "Receta emitida en blockchain",
    });
  }

  if (step === "done") {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-400 mb-2">Receta emitida</h2>
          <p className="text-gray-400 text-sm mb-6">
            El paciente puede canjear su receta en el dispensario autorizado.
            Ningún dato personal quedó registrado en blockchain.
          </p>
          <button
            onClick={() => router.push("/doctor")}
            className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold"
          >
            Volver al dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-green-400 mb-2">🩺 Nueva receta ZK</h1>
      <p className="text-gray-400 text-sm mb-6">
        El RUT del paciente nunca se almacena en blockchain. Solo el hash criptográfico.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">RUT del paciente</label>
          <input
            type="text"
            value={form.patientRut}
            onChange={(e) => setForm((f) => ({ ...f, patientRut: e.target.value }))}
            placeholder="12345678-9"
            required
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-green-500 outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">Solo visible para ti. No se envía a blockchain.</p>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Dispensario autorizado</label>
          <input
            type="text"
            value={form.dispensaryAddress}
            onChange={(e) => setForm((f) => ({ ...f, dispensaryAddress: e.target.value }))}
            placeholder="G... (dirección Stellar)"
            required
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-green-500 outline-none font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Validez (días)</label>
          <select
            value={form.validDays}
            onChange={(e) => setForm((f) => ({ ...f, validDays: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-green-500 outline-none"
          >
            <option value="15">15 días</option>
            <option value="30">30 días</option>
            <option value="60">60 días</option>
            <option value="90">90 días</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={pending || step === "committing"}
          className="w-full py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 rounded-lg font-semibold transition-colors"
        >
          {pending || step === "committing"
            ? "⏳ Generando prueba ZK..."
            : "Emitir receta"}
        </button>
      </form>
    </main>
  );
}
