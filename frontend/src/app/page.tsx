import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-green-400 mb-3">🌿 TrustLeaf</h1>
        <p className="text-xl text-gray-300 max-w-lg">
          El estándar de confianza para la industria del cannabis medicinal.
          Trazabilidad pública, identidad privada.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8 w-full max-w-md">
        <RoleCard href="/grower" emoji="🌱" title="Cultivador" desc="Registra y rastrea tus lotes" />
        <RoleCard href="/doctor" emoji="🩺" title="Médico" desc="Emite recetas privadas" />
        <RoleCard href="/patient" emoji="👤" title="Paciente" desc="Canjea tu receta" />
        <RoleCard href="/dispensary" emoji="🏪" title="Dispensario" desc="Verifica y vende" />
      </div>

      <div className="mt-12 flex gap-4">
        <Link
          href="/register"
          className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold transition-colors"
        >
          Crear cuenta
        </Link>
        <Link
          href="/login"
          className="px-6 py-3 border border-green-600 hover:bg-green-900 rounded-lg font-semibold transition-colors"
        >
          Ingresar
        </Link>
      </div>

      <p className="mt-8 text-xs text-gray-500">
        Powered by Stellar · Zero-Knowledge · Sin frases semilla
      </p>
    </main>
  );
}

function RoleCard({
  href,
  emoji,
  title,
  desc,
}: {
  href: string;
  emoji: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="p-4 border border-green-900 hover:border-green-500 rounded-xl transition-colors group"
    >
      <div className="text-3xl mb-2">{emoji}</div>
      <h3 className="font-semibold text-green-300 group-hover:text-green-200">{title}</h3>
      <p className="text-xs text-gray-400 mt-1">{desc}</p>
    </Link>
  );
}
