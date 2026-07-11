"use client";
// Copyright © 2026 Browns Studio

import { useState, useEffect } from "react";
import Link from "next/link";
import BodyMap, { type PainEntry, ZONE_NAMES, type BodyZone } from "../../../../components/pain/BodyMap";

function getPastDates(n: number): string[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  });
}

function formatDateES(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("es-CL", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function getLevelColor(level: number): string {
  if (level <= 3) return "text-green-400";
  if (level <= 6) return "text-yellow-400";
  if (level <= 9) return "text-orange-400";
  return "text-red-400";
}

interface DayData {
  date: string;
  entries: PainEntry[];
}

export default function PainHistoryPage() {
  const [history, setHistory] = useState<DayData[]>([]);
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const dates = getPastDates(7);
    const loaded: DayData[] = dates.map((date) => {
      try {
        const raw = localStorage.getItem(`trustleaf_pain_${date}`);
        return { date, entries: raw ? (JSON.parse(raw) as PainEntry[]) : [] };
      } catch {
        return { date, entries: [] };
      }
    });
    setHistory(loaded);
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-8">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0F172A]/95 backdrop-blur-sm border-b border-[#334155] px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link
            href="/patient/pain-diary"
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#334155] text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <div>
            <h1 className="text-white font-bold text-base">Historial de Dolor</h1>
            <p className="text-[#64748B] text-xs">Últimos 7 días</p>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-6 space-y-3">
        {history.map(({ date, entries }) => {
          const isExpanded = expandedDate === date;
          const avg = entries.length
            ? (entries.reduce((s, e) => s + e.level, 0) / entries.length).toFixed(1)
            : null;
          const mostIntense = entries.length
            ? entries.reduce((m, e) => (e.level > m.level ? e : m), entries[0])
            : null;
          const isToday = date === new Date().toISOString().split("T")[0];

          return (
            <div
              key={date}
              className="bg-[#1E293B] rounded-2xl border border-[#334155] overflow-hidden"
            >
              {/* Day row */}
              <button
                onClick={() => setExpandedDate(isExpanded ? null : date)}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-[#253046]/50 transition-colors"
              >
                {/* Mini map preview */}
                <div className="w-12 h-20 shrink-0 pointer-events-none overflow-hidden relative">
                  {entries.length > 0 ? (
                    <div style={{ transform: "scale(0.22)", transformOrigin: "top left", position: "absolute", top: 0, left: 0, width: "200px" }}>
                      <BodyMap entries={entries} onZoneClick={() => {}} readOnly />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg viewBox="0 0 200 460" className="w-12 opacity-20">
                        <ellipse cx="100" cy="42" rx="28" ry="32" fill="#334155" />
                        <rect x="88" y="72" width="24" height="18" rx="6" fill="#334155" />
                        <rect x="70" y="88" width="60" height="100" rx="8" fill="#334155" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white font-semibold text-sm capitalize">
                      {formatDateES(date)}
                    </span>
                    {isToday && (
                      <span className="text-xs bg-green-900/50 text-green-400 border border-green-700 px-2 py-0.5 rounded-full">
                        Hoy
                      </span>
                    )}
                  </div>
                  {entries.length > 0 ? (
                    <p className="text-[#94A3B8] text-xs">
                      {entries.length} zona{entries.length !== 1 ? "s" : ""} · Promedio{" "}
                      <span className={getLevelColor(parseFloat(avg ?? "0"))}>{avg}/10</span>
                      {mostIntense && (
                        <> · Más intenso: {ZONE_NAMES[mostIntense.zone as BodyZone]}</>
                      )}
                    </p>
                  ) : (
                    <p className="text-[#64748B] text-xs">Sin registros</p>
                  )}
                </div>

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>

              {/* Expanded detail */}
              {isExpanded && entries.length > 0 && (
                <div className="border-t border-[#334155] p-4">
                  <BodyMap entries={entries} onZoneClick={() => {}} readOnly />
                  <div className="mt-4 space-y-2">
                    {entries
                      .slice()
                      .sort((a, b) => b.level - a.level)
                      .map((entry) => (
                        <div
                          key={entry.zone}
                          className="flex items-center justify-between gap-3 py-2 border-b border-[#334155] last:border-0"
                        >
                          <span className="text-[#94A3B8] text-sm">{ZONE_NAMES[entry.zone as BodyZone]}</span>
                          <div className="flex items-center gap-2">
                            {entry.note && (
                              <span className="text-[#64748B] text-xs truncate max-w-[120px]">{entry.note}</span>
                            )}
                            <span className={`font-bold text-sm ${getLevelColor(entry.level)}`}>
                              {entry.level}/10
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {isExpanded && entries.length === 0 && (
                <div className="border-t border-[#334155] p-6 text-center text-[#64748B] text-sm">
                  No hubo registros este día
                </div>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
}
