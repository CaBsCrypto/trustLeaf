"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePasskey } from "../../../hooks/usePasskey";

const ROLES = [
  { id: "grower", label: "🌱 Cultivador" },
  { id: "doctor", label: "🩺 Médico" },
  { id: "patient", label: "👤 Paciente" },
  { id: "dispensary", label: "🏪 Dispensario" },
];

export default function RegisterPage() {
  const { register, loading } = usePasskey();
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState("patient");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    const result = await register(name || "TrustLeaf User");
    if (result?.address) {
      localStorage.setItem("tl_role", role);
      router.push(`/${role}`);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-sm w-full">
        <h1 className="text-3xl font-bold text-green-400 mb-2 text-center">
          Crear cuenta
        </h1>
        <p className="text-gray-400 mb-8 text-center text-sm">
          Tu wallet se crea con biometría. Cero XLM, cero frases semilla.
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre o empresa"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-green-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Rol</label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`py-2 px-3 rounded-lg border text-sm transition-colors ${
                    role === r.id
                      ? "border-green-500 bg-green-900 text-green-300"
                      : "border-gray-700 hover:border-gray-500"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-green-600 hover:bg-green-500 disabled:opacity-50 rounded-xl font-semibold text-lg transition-colors"
          >
            {loading ? "⏳ Creando wallet..." : "🔑 Registrarse con Passkey"}
          </button>
        </form>

        <a href="/login" className="mt-6 block text-center text-green-400 hover:text-green-300 text-sm">
          ¿Ya tienes cuenta? Ingresar →
        </a>
      </div>
    </main>
  );
}
