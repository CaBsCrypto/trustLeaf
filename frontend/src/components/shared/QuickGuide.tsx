// Copyright © 2026 Browns Studio
"use client";

import { useState } from "react";
import { CloseIcon } from "../icons/TrustLeafIcons";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface QuickGuideProps {
  role: "doctor" | "patient" | "dispensary";
}

type RoleConfig = {
  label: string;
  steps: string[];
  color: string;
};

const ROLE_CONFIG: Record<QuickGuideProps["role"], RoleConfig> = {
  doctor: {
    label: "Médico",
    color: "#10B981",
    steps: [
      "Busca al paciente por RUT",
      "Selecciona el medicamento y dosis",
      "Firma y emite la receta ZK",
      "El paciente la recibe en su celular",
    ],
  },
  patient: {
    label: "Paciente",
    color: "#3B82F6",
    steps: [
      "Tus recetas aparecen en este portal",
      "Muestra el código QR en la farmacia",
      "La farmacia verifica en tiempo real",
      "Marca como dispensada cuando retires",
    ],
  },
  dispensary: {
    label: "Farmacia",
    color: "#8B5CF6",
    steps: [
      "Escanea el QR del paciente",
      "Verifica la receta en tiempo real",
      "Confirma la dispensación",
      "El registro queda en blockchain",
    ],
  },
};

// ─── QuickGuide component ─────────────────────────────────────────────────────
function QuickGuide({ role }: QuickGuideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const config = ROLE_CONFIG[role];

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) close();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") close();
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={open}
        aria-label="Guía rápida"
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full font-bold text-lg shadow-xl transition-all duration-200"
        style={{
          background: config.color,
          color: "#0F172A",
          boxShadow: `0 4px 24px ${config.color}55`,
          transform: isOpen ? "scale(0.9)" : "scale(1)",
        }}
      >
        ?
      </button>

      {/* Overlay */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Guía rápida"
        onKeyDown={handleKeyDown}
        onClick={handleOverlayClick}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(4px)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.2s ease",
        }}
      >
        {/* Modal card */}
        <div
          className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
          style={{
            background: "#1E293B",
            border: "1px solid #334155",
            transform: isOpen ? "scale(1) translateY(0)" : "scale(0.95) translateY(8px)",
            transition: "transform 0.2s cubic-bezier(0.175,0.885,0.32,1.275)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm"
                style={{ background: config.color, color: "#0F172A" }}
              >
                ?
              </div>
              <div>
                <h2 className="text-base font-bold" style={{ color: "#fff" }}>
                  Guía rápida
                </h2>
                <p className="text-xs" style={{ color: "#64748B" }}>
                  Vista {config.label}
                </p>
              </div>
            </div>
            <button
              onClick={close}
              aria-label="Cerrar guía"
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ color: "#64748B", background: "#0F172A", border: "1px solid #334155" }}
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {config.steps.map((stepText, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3.5 rounded-xl"
                style={{ background: "#0F172A", border: "1px solid #334155" }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    background: `${config.color}18`,
                    border: `1px solid ${config.color}40`,
                    color: config.color,
                  }}
                >
                  {i + 1}
                </div>
                <p className="text-sm leading-relaxed pt-0.5" style={{ color: "#CBD5E1" }}>
                  {stepText}
                </p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <p className="text-xs text-center mt-5" style={{ color: "#475569" }}>
            Presiona{" "}
            <kbd
              className="px-1.5 py-0.5 rounded text-xs font-mono"
              style={{ background: "#334155", color: "#94A3B8", border: "1px solid #475569" }}
            >
              Esc
            </kbd>{" "}
            o haz clic fuera para cerrar
          </p>
        </div>
      </div>
    </>
  );
}

export { QuickGuide };
export default QuickGuide;
