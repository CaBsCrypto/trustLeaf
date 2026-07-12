"use client";
// Copyright © 2026 Browns Studio

import { useState, useEffect } from "react";
import type { Translations } from "../../lib/i18n";

// ─── Fake transaction data ─────────────────────────────────────────────────────

const TRANSACTIONS = [
  { id: "RX-7A3F2E1B", time: "hace 2 minutos", confirmations: "6/6" },
  { id: "RX-4C8D91F3", time: "hace 4 minutos", confirmations: "6/6" },
  { id: "RX-B2E05A7C", time: "hace 7 minutos", confirmations: "6/6" },
  { id: "RX-9F1C3D82", time: "hace 11 minutos", confirmations: "6/6" },
  { id: "RX-E64A0B5F", time: "hace 15 minutos", confirmations: "6/6" },
  { id: "RX-12F8C3A6", time: "hace 19 minutos", confirmations: "6/6" },
];

// ─── Blockchain Live Widget ────────────────────────────────────────────────────

function BlockchainWidget() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % TRANSACTIONS.length);
        setVisible(true);
      }, 400);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const tx = TRANSACTIONS[index];

  return (
    <div className="mx-auto max-w-sm w-full">
      <div className="bg-[#0F172A] border border-[#10B981]/30 rounded-xl px-5 py-4 shadow-lg shadow-[#10B981]/5">
        {/* Header row */}
        <div className="flex items-center gap-2 mb-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]" />
          </span>
          <span className="text-[#10B981] text-xs font-semibold tracking-wide">
            Última transacción verificada
          </span>
        </div>

        {/* Transaction body */}
        <div
          className="transition-opacity duration-400"
          style={{ opacity: visible ? 1 : 0 }}
        >
          <p className="text-white font-mono text-sm font-semibold mb-1">
            {tx.id}
            <span className="text-[#64748B] font-normal"> · {tx.time}</span>
          </p>
          <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5 text-[#10B981] shrink-0"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Confirmaciones: {tx.confirmations} &nbsp;·&nbsp; Stellar Mainnet
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step card ────────────────────────────────────────────────────────────────

interface StepCardProps {
  emoji: string;
  title: string;
  description: string;
  number: number;
  isLast?: boolean;
}

function StepCard({ emoji, title, description, number, isLast = false }: StepCardProps) {
  return (
    <div className="relative flex flex-col items-center text-center">
      {/* Arrow connector (desktop only, between cards) */}
      {!isLast && (
        <div className="hidden md:flex absolute top-10 left-[calc(50%+52px)] right-[calc(-50%+52px)] items-center justify-center z-10 pointer-events-none">
          <div className="flex-1 h-px bg-gradient-to-r from-[#10B981]/40 to-[#10B981]/10" />
          <svg
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 text-[#10B981]/40 shrink-0"
          >
            <path
              d="M1 6h10M7 2l4 4-4 4"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      {/* Icon circle */}
      <div className="relative mb-5 z-20">
        <div className="w-20 h-20 rounded-2xl bg-[#1E293B] border border-[#334155] flex items-center justify-center text-3xl shadow-lg shadow-black/20">
          {emoji}
        </div>
        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#10B981] text-[#0F172A] text-xs font-bold flex items-center justify-center shadow-md">
          {number}
        </span>
      </div>

      <h3 className="text-white font-bold text-base mb-2 leading-snug">{title}</h3>
      <p className="text-[#64748B] text-sm leading-relaxed max-w-[230px]">{description}</p>
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

interface HowItWorksProps {
  t: Translations;
}

export default function HowItWorks({ t }: HowItWorksProps) {
  const { howItWorks } = t;

  return (
    <section className="py-20 md:py-24 bg-[#1E293B]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="text-[#10B981] text-xs font-semibold uppercase tracking-widest">
            Proceso
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-3">
            {howItWorks.title}
          </h2>
          <p className="text-[#64748B] text-base max-w-md mx-auto">
            Del consultorio médico a la farmacia, en 4 pasos. Sin papel. Sin fraude.
          </p>
        </div>

        {/* Steps grid: 4 columns on desktop, 1 column on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-14">
          <StepCard
            number={1}
            emoji={howItWorks.step1.icon}
            title={howItWorks.step1.title}
            description={howItWorks.step1.desc}
          />
          <StepCard
            number={2}
            emoji={howItWorks.step2.icon}
            title={howItWorks.step2.title}
            description={howItWorks.step2.desc}
          />
          <StepCard
            number={3}
            emoji={howItWorks.step3.icon}
            title={howItWorks.step3.title}
            description={howItWorks.step3.desc}
          />
          <StepCard
            number={4}
            emoji={howItWorks.step4.icon}
            title={howItWorks.step4.title}
            description={howItWorks.step4.desc}
            isLast
          />
        </div>

        {/* Live blockchain widget */}
        <BlockchainWidget />
      </div>
    </section>
  );
}
