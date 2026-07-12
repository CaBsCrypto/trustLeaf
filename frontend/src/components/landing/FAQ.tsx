"use client";
// Copyright © 2026 Browns Studio

import { useState } from "react";
import { getTranslations, type Locale } from "../../lib/i18n";

interface FAQRowProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQRow({ question, answer, isOpen, onToggle }: FAQRowProps) {
  return (
    <div className="border-b border-[#1E293B] last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group focus:outline-none"
        aria-expanded={isOpen}
      >
        <span className="text-white font-medium text-sm sm:text-base group-hover:text-[#10B981] transition-colors">
          {question}
        </span>
        <span
          className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center text-sm font-bold transition-all duration-200 ${
            isOpen
              ? "border-[#10B981] bg-[#10B981]/10 text-[#10B981]"
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
          {answer}
        </p>
      </div>
    </div>
  );
}

interface FAQProps {
  locale?: Locale;
}

export default function FAQ({ locale = "es" }: FAQProps) {
  const t = getTranslations(locale);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(i: number) {
    setOpenIndex(openIndex === i ? null : i);
  }

  return (
    <section className="py-20 md:py-24 bg-[#0B1120]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[#10B981] text-xs font-semibold uppercase tracking-widest">
            {t.faq.label}
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-white mt-2 mb-3">
            {t.faq.title}
          </h2>
          <p className="text-[#64748B] text-base max-w-lg mx-auto">
            {t.faq.subtitle}
          </p>
        </div>

        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl px-6 sm:px-8">
          {t.faq.items.map((item, i) => (
            <FAQRow
              key={i}
              question={item.q}
              answer={item.a}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
