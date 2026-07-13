// Copyright © 2026 Browns Studio
// Patient onboarding modal — shown on first visit to /patient

"use client";

import { useState, useEffect } from "react";

const STEPS = [
  {
    emoji: "🏥",
    title: "Tu historial, tuyo para siempre",
    body: "TrustLeaf guarda tu historial clínico en Stellar Blockchain — no en servidores de una clínica. Tú controlas quién lo ve.",
    cta: "Siguiente",
  },
  {
    emoji: "📱",
    title: "Comparte con un QR",
    body: "Cuando vayas al médico o farmacia, muestra tu QR. Ellos escanean y ven exactamente lo que tú quieres compartir — nada más.",
    cta: "Siguiente",
  },
  {
    emoji: "📓",
    title: "Registra tu dolor diario",
    body: "Con el Diario de Dolor puedes registrar cómo te sientes cada día. TrustLeaf detecta patrones y los comparte con tu médico.",
    cta: "¡Empezar!",
  },
];

interface PatientOnboardingProps {
  onComplete: () => void;
}

export default function PatientOnboarding({ onComplete }: PatientOnboardingProps) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  function next() {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  }

  function handleClose() {
    setVisible(false);
    setTimeout(onComplete, 300);
  }

  const current = STEPS[step];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      {/* Card */}
      <div
        className={`bg-[#1E293B] border border-[#334155] rounded-t-3xl sm:rounded-3xl w-full max-w-sm mx-auto p-8 shadow-2xl transition-transform duration-300 ${
          visible ? "translate-y-0" : "translate-y-12"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === step
                  ? "w-6 h-2 bg-green-500"
                  : i < step
                  ? "w-2 h-2 bg-green-700"
                  : "w-2 h-2 bg-[#334155]"
              }`}
            />
          ))}
        </div>

        {/* Emoji */}
        <div className="text-6xl text-center mb-6">{current.emoji}</div>

        {/* Text */}
        <h2 className="text-white text-xl font-bold text-center mb-3 leading-tight">
          {current.title}
        </h2>
        <p className="text-gray-400 text-sm text-center leading-relaxed mb-8">
          {current.body}
        </p>

        {/* CTA */}
        <button
          onClick={next}
          className="w-full py-4 bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-bold text-base rounded-2xl transition-colors"
        >
          {current.cta}
        </button>

        {/* Skip */}
        {step < STEPS.length - 1 && (
          <button
            onClick={handleClose}
            className="w-full mt-3 py-2 text-gray-500 text-sm hover:text-gray-400 transition-colors"
          >
            Saltar
          </button>
        )}
      </div>
    </div>
  );
}
