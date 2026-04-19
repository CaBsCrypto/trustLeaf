"use client";

import { useState } from "react";
import { useHashVerify } from "../../../hooks/useHashVerify";
import { BACKEND_URL } from "../../../lib/stellar";

interface BatchInfo {
  batchId: string;
  strain: string;
  status: number;
  grower: string;
  metadataHashHex: string;
}

const STATUS_LABELS: Record<number, string> = {
  0: "🌱 Creciendo",
  1: "🌾 Cosechado",
  2: "🔬 Analizado",
  3: "✅ Aprobado",
  4: "📦 Dispensado",
  5: "🚨 Retirado",
};

export default function VerifyPage() {
  const [batchId, setBatchId] = useState("");
  const [batchInfo, setBatchInfo] = useState<BatchInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { status: hashStatus } = useHashVerify(
    batchInfo?.batchId ?? "",
    batchInfo?.metadataHashHex ?? ""
  );

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setBatchInfo(null);

    try {
      const res = await fetch(`${BACKEND_URL}/api/batches/${batchId}`);
      if (!res.ok) {
        setError("Lote no encontrado");
        return;
      }
      const data = await res.json() as BatchInfo;
      setBatchInfo(data);
    } catch {
      setError("Error al consultar el lote");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-green-400 mb-6">🔍 Verificar lote</h1>

      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <input
          type="text"
          value={batchId}
          onChange={(e) => setBatchId(e.target.value)}
          placeholder="ID del lote (hex)"
          className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-green-500 outline-none font-mono text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 rounded-lg font-semibold"
        >
          {loading ? "⏳" : "Buscar"}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {batchInfo && (
        <div className="space-y-4">
          {/* Hash verification badge */}
          <HashBadge status={hashStatus} />

          {/* Batch info card */}
          <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-3">
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-semibold text-green-300">{batchInfo.strain}</h2>
              <span className="text-sm text-gray-300">{STATUS_LABELS[batchInfo.status]}</span>
            </div>
            <InfoRow label="Lote ID" value={`${batchInfo.batchId.slice(0, 16)}...`} mono />
            <InfoRow label="Cultivador" value={`${batchInfo.grower.slice(0, 12)}...`} mono />
            <InfoRow label="Hash on-chain" value={`${batchInfo.metadataHashHex.slice(0, 16)}...`} mono />
          </div>
        </div>
      )}
    </main>
  );
}

function HashBadge({ status }: { status: string }) {
  const config = {
    loading: { bg: "bg-gray-900", border: "border-gray-700", icon: "⏳", text: "Verificando integridad...", color: "text-gray-300" },
    verified: { bg: "bg-green-900/30", border: "border-green-600", icon: "✅", text: "Datos verificados — Firestore y blockchain coinciden", color: "text-green-300" },
    tampered: { bg: "bg-red-900/30", border: "border-red-600", icon: "🚨", text: "ALERTA: Los datos fueron alterados", color: "text-red-300" },
    error: { bg: "bg-yellow-900/30", border: "border-yellow-600", icon: "⚠️", text: "No se pudo verificar la integridad", color: "text-yellow-300" },
  }[status] ?? { bg: "bg-gray-900", border: "border-gray-700", icon: "❓", text: "Estado desconocido", color: "text-gray-300" };

  return (
    <div className={`p-4 ${config.bg} border ${config.border} rounded-lg flex items-center gap-3`}>
      <span className="text-xl">{config.icon}</span>
      <p className={`font-semibold ${config.color}`}>{config.text}</p>
    </div>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className={`text-gray-200 ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}
