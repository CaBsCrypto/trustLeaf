"use client";
// Copyright © 2026 Browns Studio

import { use } from "react";
import Link from "next/link";
import PainHeatmap, { type DayRecord } from "../../../../components/pain/PainHeatmap";
import { ZONE_NAMES, type BodyZone } from "../../../../components/pain/BodyMap";

// Demo data — 30 days of simulated pain records
const DEMO_HISTORY: DayRecord[] = (() => {
  const zones: BodyZone[] = [
    "back_lower", "back_upper", "hip_l", "hip_r", "knee_l", "knee_r",
    "shoulder_l", "shoulder_r", "neck", "leg_l", "leg_r",
  ];
  const today = new Date();
  const records: DayRecord[] = [];
  for (let i = 0; i < 30; i++) {
    if (i % 3 === 0 && i > 0) continue; // skip some days for realism
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const date = d.toISOString().split("T")[0];
    const numZones = 2 + Math.floor(Math.random() * 4);
    const shuffled = [...zones].sort(() => Math.random() - 0.5).slice(0, numZones);
    const entries = shuffled.map((zone) => ({
      zone,
      level: 3 + Math.floor(Math.random() * 7),
      timestamp: d.toISOString(),
    }));
    records.push({ date, entries });
  }
  return records.sort((a, b) => a.date.localeCompare(b.date));
})();

function formatDateES(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getLevelColor(level: number): string {
  if (level <= 3) return "text-green-400";
  if (level <= 6) return "text-yellow-400";
  if (level <= 9) return "text-orange-400";
  return "text-red-400";
}

export default function PatientPainPage({
  params,
}: {
  params: Promise<{ patientRut: string }>;
}) {
  const { patientRut } = use(params);
  const recent = [...DEMO_HISTORY].reverse().slice(0, 10);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-8">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0F172A]/95 backdrop-blur-sm border-b border-[#334155] px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            href="/doctor"
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#334155] text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <div>
            <h1 className="text-white font-bold text-base">Historial de Dolor</h1>
            <p className="text-[#64748B] text-xs font-mono">Paciente · {patientRut}</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        {/* Demo notice */}
        <div className="flex items-center gap-3 p-3 bg-yellow-900/20 border border-yellow-800 rounded-xl">
          <svg viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="1.5" className="w-4 h-4 shrink-0">
            <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <p className="text-yellow-300 text-xs">Datos de demostración — integración con base de datos en desarrollo</p>
        </div>

        {/* Heatmap */}
        <PainHeatmap history={DEMO_HISTORY} />

        {/* Recent days table */}
        <div className="bg-[#1E293B] rounded-2xl border border-[#334155] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#334155]">
            <h3 className="text-white font-semibold">Registros recientes</h3>
          </div>
          <div className="divide-y divide-[#334155]">
            {recent.map(({ date, entries }) => {
              const avg = entries.length
                ? (entries.reduce((s, e) => s + e.level, 0) / entries.length)
                : 0;
              const mostIntense = entries.length
                ? entries.reduce((m, e) => (e.level > m.level ? e : m), entries[0])
                : null;

              return (
                <div key={date} className="flex items-center gap-4 px-5 py-3">
                  <div className="w-24 shrink-0">
                    <p className="text-white text-xs font-medium">{formatDateES(date)}</p>
                  </div>
                  <div className="w-16 text-center">
                    <span className="text-[#94A3B8] text-xs">{entries.length} zonas</span>
                  </div>
                  <div className="w-16 text-center">
                    <span className={`text-xs font-bold ${getLevelColor(avg)}`}>
                      {avg.toFixed(1)}/10
                    </span>
                  </div>
                  <div className="flex-1 text-right">
                    {mostIntense && (
                      <span className="text-[#64748B] text-xs">
                        {ZONE_NAMES[mostIntense.zone as BodyZone]}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
