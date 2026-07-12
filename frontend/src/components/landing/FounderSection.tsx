// Copyright © 2026 Browns Studio

export default function FounderSection() {
  return (
    <section className="py-20 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-[#64748B] text-xs font-semibold uppercase tracking-widest">
            El equipo
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-white mt-2">
            Construido por un founder
            <br />
            <span className="text-[#10B981]">que vivió el problema</span>
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
            {/* Founder initials — replace when photo is available */}
            TL
          </div>

          {/* Name & title */}
          <div className="text-center">
            <p className="text-white font-bold text-lg">
              {/* TODO: Replace with founder's name */}
              Fundador de TrustLeaf
            </p>
            <p className="text-[#64748B] text-sm mt-1">Chile-based builder</p>
          </div>

          {/* Bio */}
          <p className="text-[#94A3B8] text-base leading-relaxed text-center max-w-xl">
            {/* TODO: Add 2–3 sentences about your background and what drove you to build TrustLeaf */}
            Passionate about fixing broken systems at the intersection of healthcare and technology.
            Experienced the fragmented medical record problem firsthand — and decided to solve it.
          </p>

          {/* Divider */}
          <div className="w-full border-t border-[#334155]" />

          {/* Credential tags — fill in before YC interview */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Healthcare tech",
              "Blockchain / Stellar",
              "Chile 🇨🇱",
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
