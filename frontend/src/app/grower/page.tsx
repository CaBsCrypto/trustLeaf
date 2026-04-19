"use client";

import Link from "next/link";
import { usePasskey } from "../../hooks/usePasskey";

export default function GrowerDashboard() {
  const { walletAddress } = usePasskey();

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-green-400 mb-1">🌱 Dashboard Cultivador</h1>
      <p className="text-gray-400 text-sm mb-8">
        {walletAddress ? `${walletAddress.slice(0, 8)}...` : "No conectado"}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Lotes activos" value="—" />
        <StatCard label="Eventos registrados" value="—" />
        <StatCard label="Lotes aprobados" value="—" />
      </div>

      <div className="flex gap-4">
        <Link
          href="/grower/new-batch"
          className="px-5 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold transition-colors"
        >
          + Nuevo lote
        </Link>
      </div>

      {/* Batch list — populated by Mercury indexer queries */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-200 mb-4">Mis lotes</h2>
        <p className="text-gray-500 text-sm">
          Los lotes aparecerán aquí una vez que el indexer Mercury sincronice los eventos.
        </p>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-2xl font-bold text-green-300 mt-1">{value}</p>
    </div>
  );
}
