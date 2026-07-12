// Copyright © 2026 Browns Studio

interface FeatureCardProps {
  emoji: string;
  title: string;
  description: string;
}

function FeatureCard({ emoji, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col bg-[#1E293B] border border-[#334155] rounded-2xl p-6 hover:border-[#10B981]/40 transition-colors">
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className="text-white font-bold text-base mb-2 leading-snug">{title}</h3>
      <p className="text-[#64748B] text-sm leading-relaxed">{description}</p>
    </div>
  );
}

export default function FeaturesGrid() {
  const features: FeatureCardProps[] = [
    {
      emoji: "🔐",
      title: "Face ID para firmar",
      description: "Sin contraseñas. Tu cara es tu firma.",
    },
    {
      emoji: "⛓️",
      title: "Blockchain inmutable",
      description: "Nadie puede alterar tu historial. Ni siquiera nosotros.",
    },
    {
      emoji: "📱",
      title: "QR para compartir",
      description: "Un QR. Cualquier médico verifica en segundos.",
    },
    {
      emoji: "📓",
      title: "Diario de Dolor",
      description: "Registra, analiza y comparte tu dolor diario con tu equipo médico.",
    },
    {
      emoji: "🚨",
      title: "QR de Emergencia",
      description: "Acceso de lectura para urgencias. Sin login.",
    },
    {
      emoji: "🌎",
      title: "Portabilidad total",
      description: "Tu historial te sigue a cualquier médico, ciudad o país.",
    },
  ];

  return (
    <section className="py-20 md:py-24 bg-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-[#10B981] text-xs font-semibold uppercase tracking-widest">
            Funcionalidades
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-3">
            Todo lo que necesitas
          </h2>
          <p className="text-[#64748B] text-base max-w-lg mx-auto">
            Un ecosistema completo para que tu historial médico sea tuyo, siempre.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
