"use client";

import Link from "next/link";
import { usePasskey } from "../../hooks/usePasskey";

export default function PatientDashboard() {
  const { walletAddress } = usePasskey();

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-green-400 mb-1">👤 Dashboard Paciente</h1>
      <p className="text-gray-400 text-sm mb-8">
        {walletAddress ? `${walletAddress.slice(0, 8)}...` : "No conectado"}
      </p>

      <div className="p-5 bg-gray-900 border border-green-900 rounded-xl mb-6">
        <h2 className="text-green-300 font-semibold mb-1">¿Tienes una receta?</h2>
        <p className="text-gray-400 text-sm mb-4">
          Tu médico habrá registrado un compromiso criptográfico. Para canjearla,
          necesitarás tu RUT y el nonce que tu médico te entregó de forma segura.
        </p>
        <Link
          href="/patient/redeem"
          className="px-5 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold transition-colors inline-block"
        >
          Canjear receta →
        </Link>
      </div>
    </main>
  );
}
