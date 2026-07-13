// Copyright © 2026 Browns Studio

export default function FounderSection() {
  return (
    <section className="py-20 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-[#64748B] text-xs font-semibold uppercase tracking-widest">
            Por qué existe TrustLeaf
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-white mt-2">
            El founder es el paciente.
            <br />
            <span className="text-[#10B981]">7 años. Múltiples especialistas. Cero continuidad.</span>
          </h2>
        </div>

        <div className="flex flex-col items-center gap-8 bg-[#1E293B] border border-[#334155] rounded-2xl p-8 sm:p-10">
          {/* YC badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/40 bg-orange-500/10 text-orange-400 text-xs font-semibold">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
            </svg>
            Aplicando a Y Combinator Fall 2026
          </div>

          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#10B981] to-[#3B82F6] flex items-center justify-center text-[#0F172A] text-2xl font-extrabold select-none">
            TL
          </div>

          {/* Name & title */}
          <div className="text-center">
            <p className="text-white font-bold text-lg">
              Fundador de TrustLeaf
            </p>
            <p className="text-[#64748B] text-sm mt-1">Santiago, Chile · Builder con dolor crónico</p>
          </div>

          {/* Bio — the real story */}
          <div className="space-y-4 text-center max-w-xl">
            <p className="text-[#94A3B8] text-base leading-relaxed">
              Llevo 7 años con dolor crónico. En ese tiempo vi múltiples especialistas —
              traumatólogos, neurólogos, reumatólogos, médicos del dolor. Cada uno empezaba desde cero.
              Ninguno sabía qué había probado el anterior.
            </p>
            <p className="text-[#CBD5E1] text-base leading-relaxed font-medium">
              Un día dejé de esperar que el sistema cambiara y empecé a llevar un cuaderno estructurado:
              cada consulta, cada medicamento, cada patrón de síntomas — organizado para que un médico
              nuevo pudiera leer mi historial completo en 2 minutos.
            </p>
            <p className="text-[#94A3B8] text-base leading-relaxed">
              Los médicos empezaron a pedirme copias. Un especialista me dijo que era
              el historial más útil que había visto entregar un paciente.
              Ese cuaderno es lo que TrustLeaf automatiza.
            </p>
          </div>

          {/* Quote highlight */}
          <div className="w-full border border-[#10B981]/20 rounded-xl p-4 bg-[#10B981]/5">
            <p className="text-[#10B981] text-sm font-medium text-center leading-relaxed">
              "No soy un fundador que encontró un mercado. Soy el mercado."
            </p>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-[#334155]" />

          {/* Credential tags */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "7 años · dolor crónico",
              "Usuario #1 del producto",
              "Stellar / Soroban",
              "Chile 🇨🇱 → LATAM",
              "YC Fall 2026 applicant",
            ].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 border border-[#334155] text-[#64748B] text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
