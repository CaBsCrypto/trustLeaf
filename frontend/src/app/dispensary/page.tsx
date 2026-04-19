"use client";

import Link from "next/link";
import { usePasskey } from "../../hooks/usePasskey";

export default function DispensaryDashboard() {
  const { walletAddress } = usePasskey();

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-green-400 mb-1">🏪 Dashboard Dispensario</h1>
      <p className="text-gray-400 text-sm mb-8">
        {walletAddress ? `${walletAddress.slice(0, 8)}...` : "No conectado"}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <StatCard label="Ventas hoy" value="—" />
        <StatCard label="Lotes disponibles" value="—" />
      </div>

      <Link
        href="/dispensary/verify"
        className="px-5 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold transition-colors inline-block"
      >
        🔍 Verificar lote / receta
      </Link>
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
