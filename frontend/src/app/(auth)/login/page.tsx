"use client";

import { useRouter } from "next/navigation";
import { usePasskey } from "../../../hooks/usePasskey";

export default function LoginPage() {
  const { connect, loading } = usePasskey();
  const router = useRouter();

  async function handleLogin() {
    const address = await connect();
    if (address) {
      const role = localStorage.getItem("tl_role") ?? "patient";
      router.push(`/${role}`);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-sm w-full text-center">
        <h1 className="text-3xl font-bold text-green-400 mb-2">Ingresar</h1>
        <p className="text-gray-400 mb-8">
          Usa tu biometría para acceder. Sin contraseña, sin frases semilla.
        </p>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-4 bg-green-600 hover:bg-green-500 disabled:opacity-50 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-3"
        >
          {loading ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <span>🔑</span>
          )}
          {loading ? "Verificando..." : "Ingresar con Passkey"}
        </button>

        <p className="mt-4 text-sm text-gray-500">
          Face ID · Touch ID · Llave de seguridad
        </p>

        <a href="/register" className="mt-8 block text-green-400 hover:text-green-300 text-sm">
          ¿No tienes cuenta? Regístrate →
        </a>
      </div>
    </main>
  );
}
