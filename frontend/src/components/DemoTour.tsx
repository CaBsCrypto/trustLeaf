"use client";
// Copyright © 2026 Browns Studio

import { useState, useEffect } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface TourStep {
  title: string;
  description: string;
  highlight?: string;
}

interface DemoTourProps {
  steps: TourStep[];
  onClose?: () => void;
}

// ─── DemoTour ──────────────────────────────────────────────────────────────────

export default function DemoTour({ steps, onClose }: DemoTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(true);

  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  // Highlight the target element
  useEffect(() => {
    // Remove previous highlights
    document.querySelectorAll(".tl-tour-highlight").forEach((el) => {
      el.classList.remove("tl-tour-highlight");
    });

    if (!step.highlight) return;

    // Try ID first, then data attribute, then class
    const target =
      document.getElementById(step.highlight) ??
      document.querySelector(`[data-tour="${step.highlight}"]`) ??
      document.querySelector(`.${step.highlight}`);

    if (target) {
      target.classList.add("tl-tour-highlight");
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentStep, step.highlight]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.querySelectorAll(".tl-tour-highlight").forEach((el) => {
        el.classList.remove("tl-tour-highlight");
      });
    };
  }, []);

  function handleClose() {
    document.querySelectorAll(".tl-tour-highlight").forEach((el) => {
      el.classList.remove("tl-tour-highlight");
    });
    setVisible(false);
    onClose?.();
  }

  function handleNext() {
    if (isLast) {
      handleClose();
    } else {
      setCurrentStep((s) => s + 1);
    }
  }

  function handlePrev() {
    if (!isFirst) setCurrentStep((s) => s - 1);
  }

  if (!visible) return null;

  return (
    <>
      {/* Subtle backdrop */}
      <div
        className="fixed inset-0 z-[9998] pointer-events-none"
        style={{ background: "rgba(0,0,0,0.35)" }}
        aria-hidden="true"
      />

      {/* Tour card — bottom-right */}
      <div
        role="dialog"
        aria-modal="false"
        aria-label="Tour guiado de TrustLeaf"
        className="fixed bottom-6 right-6 z-[9999] w-80 rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: "#1E293B", border: "1px solid #334155" }}
      >
        {/* Progress bar */}
        <div className="h-1 w-full" style={{ background: "#0F172A" }}>
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${progress}%`, background: "#10B981" }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <span
            className="text-xs font-semibold"
            style={{ color: "#10B981" }}
          >
            Paso {currentStep + 1} de {steps.length}
          </span>
          <button
            onClick={handleClose}
            aria-label="Cerrar tour"
            className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
            style={{ color: "#64748B" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "#ffffff")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "#64748B")
            }
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-4 pb-4 pt-1">
          <h3
            className="font-bold text-base mb-1.5 leading-snug"
            style={{ color: "#ffffff" }}
          >
            {step.title}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>
            {step.description}
          </p>
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-1.5 pb-3">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              aria-label={`Ir al paso ${i + 1}`}
              className="rounded-full transition-all"
              style={{
                width: i === currentStep ? "20px" : "6px",
                height: "6px",
                background: i === currentStep ? "#10B981" : "#334155",
              }}
            />
          ))}
        </div>

        {/* Buttons */}
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ borderTop: "1px solid #334155" }}
        >
          {!isFirst && (
            <button
              onClick={handlePrev}
              className="flex-1 py-2 rounded-xl text-sm font-semibold transition-colors"
              style={{
                background: "transparent",
                border: "1px solid #334155",
                color: "#94A3B8",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#475569";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#334155";
                e.currentTarget.style.color = "#94A3B8";
              }}
            >
              Anterior
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 py-2 rounded-xl text-sm font-bold transition-all"
            style={{
              background: "#10B981",
              color: "#0F172A",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#059669")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "#10B981")
            }
          >
            {isLast ? "Finalizar" : "Siguiente →"}
          </button>
        </div>
      </div>

      {/* Global highlight style — injected once */}
      <style>{`
        .tl-tour-highlight {
          position: relative;
          z-index: 9997;
          outline: 2px solid #10B981 !important;
          outline-offset: 4px;
          border-radius: 12px;
          box-shadow: 0 0 0 4px rgba(16,185,129,0.15), 0 0 32px rgba(16,185,129,0.2) !important;
          transition: outline 0.3s, box-shadow 0.3s;
        }
      `}</style>
    </>
  );
}

// ─── Tour trigger button ────────────────────────────────────────────────────────

interface TourTriggerProps {
  onClick: () => void;
  label?: string;
}

export function TourTrigger({ onClick, label = "🎯 Iniciar tour" }: TourTriggerProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Iniciar tour guiado"
      className="fixed bottom-6 left-6 z-[9990] flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg transition-all"
      style={{
        background: "#1E293B",
        border: "1px solid #334155",
        color: "#10B981",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#253046";
        e.currentTarget.style.borderColor = "#10B981";
        e.currentTarget.style.transform = "scale(1.04)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#1E293B";
        e.currentTarget.style.borderColor = "#334155";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {label}
    </button>
  );
}
