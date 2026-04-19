"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePasskey } from "../../../hooks/usePasskey";
import { useContractCall } from "../../../hooks/useContractCall";
import { BACKEND_URL } from "../../../lib/stellar";
import { toast } from "sonner";
import crypto from "crypto";

export default function NewBatchPage() {
  const router = useRouter();
  const { walletAddress } = usePasskey();
  const { execute, pending } = useContractCall();

  const [form, setForm] = useState({
    strain: "",
    strainDescription: "",
    origin: "",
    growerNotes: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!walletAddress) {
      toast.error("Debes estar conectado para crear un lote");
      return;
    }

    // 1. Upload metadata to backend → get metadata_hash
    const metaRes = await fetch(`${BACKEND_URL}/api/batches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, grower: walletAddress }),
    });
    if (!metaRes.ok) {
      toast.error("Error al subir metadata");
      return;
    }
    const { batchId, metadataHashHex } = await metaRes.json() as {
      batchId: string;
      metadataHashHex: string;
    };

    // 2. Call create_batch on-chain (optimistic: show dashboard immediately)
    await execute({
      buildXdr: async () => {
        const xdrRes = await fetch(`${BACKEND_URL}/api/contracts/create-batch`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            grower: walletAddress,
            batchId,
            metadataHashHex,
            strain: form.strain,
          }),
        });
        const { unsignedXdr } = await xdrRes.json() as { unsignedXdr: string };
        return unsignedXdr;
      },
      optimisticUpdate: () => {
        // Navigate immediately — batch will appear once Mercury indexes the event
        router.push("/grower");
      },
      rollback: () => {
        // Stay on page and show error
      },
      successMessage: `Lote ${form.strain} creado en blockchain`,
    });
  }

  return (
    <main className="min-h-screen p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-green-400 mb-6">🌱 Nuevo lote</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field
          label="Cepa"
          value={form.strain}
          onChange={(v) => setForm((f) => ({ ...f, strain: v }))}
          placeholder="OG_KUSH"
          required
        />
        <Field
          label="Descripción de cepa"
          value={form.strainDescription}
          onChange={(v) => setForm((f) => ({ ...f, strainDescription: v }))}
          placeholder="Indica de alto CBD..."
        />
        <Field
          label="Origen / Ubicación"
          value={form.origin}
          onChange={(v) => setForm((f) => ({ ...f, origin: v }))}
          placeholder="Región Metropolitana, Chile"
        />
        <Field
          label="Notas del cultivador"
          value={form.growerNotes}
          onChange={(v) => setForm((f) => ({ ...f, growerNotes: v }))}
          placeholder="Condiciones especiales de cultivo..."
          multiline
        />

        <button
          type="submit"
          disabled={pending}
          className="w-full py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 rounded-lg font-semibold transition-colors"
        >
          {pending ? "⏳ Registrando en blockchain..." : "Crear lote"}
        </button>
      </form>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
}) {
  const className =
    "w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-green-500 outline-none resize-none";
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={className}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={className}
        />
      )}
    </div>
  );
}
