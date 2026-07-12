// Copyright © 2026 Browns Studio

interface UseCaseCardProps {
  emoji: string;
  title: string;
  description: string;
}

function UseCaseCard({ emoji, title, description }: UseCaseCardProps) {
  return (
    <div className="flex flex-col bg-[#1E293B] border border-[#334155] rounded-2xl p-6 hover:border-[#10B981]/40 transition-colors">
      <div className="text-4xl mb-4">{emoji}</div>
      <h3 className="text-white font-bold text-lg mb-3 leading-snug">{title}</h3>
      <p className="text-[#64748B] text-sm leading-relaxed">{description}</p>
    </div>
  );
}

export default function UseCases() {
  const cases: UseCaseCardProps[] = [
    {
      emoji: "🗓️",
      title: "Diario de Dolor Inteligente",
      description:
        "Registra tu dolor diariamente — nivel, síntomas, medicamentos. TrustLeaf detecta patrones, correlaciona con tus medicamentos, y comparte el historial directamente con tu médico.",
    },
    {
      emoji: "🏃",
      title: "Medicina deportiva",
      description:
        "Deportistas que viajan entre ciudades y países llevan su historial de lesiones, clearances y medicamentos siempre con ellos.",
    },
    {
      emoji: "👴",
      title: "Adultos mayores con múltiples médicos",
      description:
        "Con varios especialistas y medicamentos, TrustLeaf previene interacciones peligrosas al centralizar el historial completo.",
    },
  ];

  return (
    <section className="py-20 md:py-24 bg-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-[#10B981] text-xs font-semibold uppercase tracking-widest">
            Casos de uso
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-3">
            Diseñado para la vida real
          </h2>
          <p className="text-[#64748B] text-base max-w-lg mx-auto">
            TrustLeaf resuelve problemas concretos para pacientes que necesitan continuidad de atención.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cases.map((c) => (
            <UseCaseCard key={c.title} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}
