"use client";
// Copyright © 2026 Browns Studio

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "¿Mis datos médicos están seguros?",
    answer:
      "Sí. Tus datos se almacenan cifrados y solo tú decides quién puede verlos. TrustLeaf usa passkeys (Face ID) para autenticación — sin contraseñas que puedan ser robadas. El registro en blockchain es inmutable: nadie puede alterar ni eliminar tu historial.",
  },
  {
    question: "¿Necesito entender de crypto o blockchain?",
    answer:
      "No. TrustLeaf funciona como cualquier app — con Face ID o huella digital. La blockchain trabaja en el fondo; tú solo ves tu historial médico.",
  },
  {
    question: "¿Pueden los médicos acceder sin mi permiso?",
    answer:
      "Nunca. Solo los médicos y personas que tú autorices explícitamente pueden ver tu ficha. Puedes revocar el acceso en cualquier momento.",
  },
  {
    question: "¿Qué pasa si pierdo mi teléfono?",
    answer:
      "Tu historial está en blockchain, no en el teléfono. Puedes recuperar el acceso desde cualquier dispositivo con tu identidad verificada.",
  },
  {
    question: "¿TrustLeaf cumple con la ley de datos de Chile?",
    answer:
      "Sí. TrustLeaf cumple con la Ley 21.719 (nueva ley de protección de datos personales de Chile) y los estándares de privacidad médica MINSAL.",
  },
];

function FAQRow({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-[#1E293B] last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group focus:outline-none"
        aria-expanded={isOpen}
      >
        <span className="text-white font-medium text-sm sm:text-base group-hover:text-[#10B981] transition-colors">
          {item.question}
        </span>
        <span
          className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center text-sm font-bold transition-all duration-200 ${
            isOpen
              ? "border-[#10B981] bg-[#10B981]/10 text-[#10B981] rotate-0"
              : "border-[#334155] bg-transparent text-[#64748B]"
          }`}
          aria-hidden="true"
        >
          {isOpen ? "−" : "+"}
        </span>
      </button>

      {/* Animated answer panel */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="pb-5 text-[#94A3B8] text-sm sm:text-base leading-relaxed pr-10">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(i: number) {
    setOpenIndex(openIndex === i ? null : i);
  }

  return (
    <section className="py-20 md:py-24 bg-[#0B1120]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[#10B981] text-xs font-semibold uppercase tracking-widest">
            Preguntas frecuentes
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-white mt-2 mb-3">
            Resolvemos tus dudas
          </h2>
          <p className="text-[#64748B] text-base max-w-lg mx-auto">
            Todo lo que necesitas saber antes de unirte.
          </p>
        </div>

        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl px-6 sm:px-8">
          {FAQ_ITEMS.map((item, i) => (
            <FAQRow
              key={i}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
