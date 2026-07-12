// Copyright © 2026 Browns Studio
// Founder-only analytics dashboard
// URL: trustleaf-demo.vercel.app/admin
// No real auth in demo — protected by obscurity for now
"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Mock analytics data ───────────────────────────────────────────────────────
// In production: pull from Vercel Analytics + Resend API + Supabase

const STATS = {
  waitlistSignups: 23,
  waitlistToday: 3,
  qrScans: 147,
  qrScansToday: 12,
  rxIssued: 89,
  rxIssuedToday: 7,
  emergencyPageViews: 34,
  emergencyPageViewsToday: 4,
  uniqueVisitors: 312,
  uniqueVisitorsToday: 28,
  forDoctorsViews: 19,
  forDoctorsViewsToday: 6,
};

const DAILY_SIGNUPS = [
  { date: "Jul 6", count: 1 },
  { date: "Jul 7", count: 2 },
  { date: "Jul 8", count: 3 },
  { date: "Jul 9", count: 2 },
  { date: "Jul 10", count: 5 },
  { date: "Jul 11", count: 7 },
  { date: "Jul 12", count: 3 },
];

const RECENT_SIGNUPS = [
  { email: "dr.soto@clinicavida.cl", time: "Hace 23 min", type: "médico" },
  { email: "p***@gmail.com", time: "Hace 1h 12min", type: "paciente" },
  { email: "farm***@salcobrand.cl", time: "Hace 2h 40min", type: "farmacia" },
  { email: "a***@gmail.com", time: "Hace 3h", type: "paciente" },
  { email: "dr.rod***@integramedica.cl", time: "Hace 4h 15min", type: "médico" },
];

const TOP_PAGES = [
  { path: "/patient", views: 187, label: "Demo Paciente" },
  { path: "/doctor", views: 143, label: "Demo Médico" },
  { path: "/emergency/12345678-9", views: 34, label: "Emergencia QR" },
  { path: "/for-doctors", views: 19, label: "Para Médicos" },
  { path: "/dispensary", views: 16, label: "Demo Farmacia" },
  { path: "/verify/RX-7A3F2E1B", views: 12, label: "Verificar Receta" },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

function TrendUp() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  today,
  color = "#10B981",
  icon,
}: {
  label: string;
  value: number;
  today: number;
  color?: string;
  icon: string;
}) {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span
          className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: `${color}18`, color }}
        >
          <TrendUp />
          +{today} hoy
        </span>
      </div>
      <p className="text-3xl font-extrabold text-white mb-1">{value.toLocaleString()}</p>
      <p className="text-[#64748B] text-xs font-medium uppercase tracking-wider">{label}</p>
    </div>
  );
}

// ─── Bar chart ────────────────────────────────────────────────────────────────

function SignupChart() {
  const max = Math.max(...DAILY_SIGNUPS.map((d) => d.count));
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white font-semibold">Signups por día</h3>
        <span className="text-[#10B981] text-xs font-semibold">Últimos 7 días</span>
      </div>
      <div className="flex items-end gap-2 h-28">
        {DAILY_SIGNUPS.map((d) => (
          <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5">
            <span className="text-[#10B981] text-xs font-bold">{d.count}</span>
            <div
              className="w-full rounded-t-lg bg-[#10B981] transition-all"
              style={{ height: `${(d.count / max) * 80}px`, minHeight: "4px" }}
            />
            <span className="text-[#475569] text-[10px]">{d.date.split(" ")[1]}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-[#334155] flex items-center justify-between text-xs text-[#64748B]">
        <span>Total acumulado: <strong className="text-white">23</strong></span>
        <span>Tasa de conv. landing: <strong className="text-[#10B981]">7.4%</strong></span>
      </div>
    </div>
  );
}

// ─── Recent signups ───────────────────────────────────────────────────────────

function RecentSignups() {
  const typeColor: Record<string, string> = {
    médico: "#10B981",
    paciente: "#3B82F6",
    farmacia: "#8B5CF6",
  };

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#334155] flex items-center justify-between">
        <h3 className="text-white font-semibold">Últimos signups</h3>
        <span className="text-[#64748B] text-xs">En tiempo real (demo)</span>
      </div>
      <div className="divide-y divide-[#1E293B]">
        {RECENT_SIGNUPS.map((s, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-3.5 hover:bg-[#253046] transition-colors">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: `${typeColor[s.type]}20`, color: typeColor[s.type] }}
              >
                {s.type[0].toUpperCase()}
              </div>
              <div>
                <p className="text-white text-sm font-medium">{s.email}</p>
                <p className="text-[#64748B] text-xs">{s.time}</p>
              </div>
            </div>
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: `${typeColor[s.type]}18`, color: typeColor[s.type] }}
            >
              {s.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Top pages ────────────────────────────────────────────────────────────────

function TopPages() {
  const max = TOP_PAGES[0].views;
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#334155]">
        <h3 className="text-white font-semibold">Páginas más visitadas</h3>
      </div>
      <div className="p-5 space-y-4">
        {TOP_PAGES.map((p) => (
          <div key={p.path}>
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <span className="text-white text-sm font-medium">{p.label}</span>
                <span className="text-[#475569] text-xs ml-2 font-mono">{p.path}</span>
              </div>
              <span className="text-[#10B981] font-bold text-sm">{p.views}</span>
            </div>
            <div className="w-full bg-[#0F172A] rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-[#10B981]"
                style={{ width: `${(p.views / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── YC countdown ─────────────────────────────────────────────────────────────

function YCCountdown() {
  const deadline = new Date("2026-07-27T20:00:00-07:00");
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  const hours = Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));

  const urgent = days <= 5;

  return (
    <div
      className="rounded-2xl p-5 border"
      style={{
        background: urgent ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.08)",
        borderColor: urgent ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)",
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: urgent ? "#EF4444" : "#10B981" }}>
        ⏳ YC Fall 2026 deadline
      </p>
      <p className="text-white text-2xl font-extrabold">
        {days}d {hours}h restantes
      </p>
      <p className="text-[#64748B] text-xs mt-1">27 jul 2026 · 8pm PT · apply.ycombinator.com</p>
      <div className="mt-3 space-y-1.5">
        {[
          { done: true, task: "Demo funcional en Vercel" },
          { done: true, task: "35 commits listos para push" },
          { done: false, task: "git push origin main" },
          { done: false, task: "RESEND_API_KEY en Vercel" },
          { done: false, task: "Video 1 min en inglés" },
          { done: false, task: "Subir a YouTube (No listado)" },
          { done: false, task: "Submit en YC" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div
              className="w-4 h-4 rounded flex items-center justify-center shrink-0"
              style={{
                background: item.done ? "#10B981" : "transparent",
                border: item.done ? "none" : "1px solid #334155",
              }}
            >
              {item.done && (
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} className="w-2.5 h-2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span style={{ color: item.done ? "#10B981" : "#64748B" }}>{item.task}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [tab, setTab] = useState<"overview" | "signups" | "pages">("overview");

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      {/* Header */}
      <header className="border-b border-[#334155] px-4 py-4 sticky top-0 z-30 bg-[#0F172A]/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#10B981] flex items-center justify-center text-[#0F172A] font-bold text-sm">TL</div>
            <div>
              <p className="text-white font-bold text-sm leading-none">TrustLeaf</p>
              <p className="text-[#64748B] text-xs">Analytics · Founder view</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[#10B981] text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              Live (demo)
            </div>
            <Link href="/" className="text-[#475569] hover:text-white text-xs transition-colors">← Salir</Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* YC countdown — always visible */}
        <div className="mb-8">
          <YCCountdown />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#1E293B] border border-[#334155] rounded-xl p-1 mb-6 w-fit">
          {(["overview", "signups", "pages"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                tab === t ? "bg-[#10B981] text-[#0F172A] font-semibold" : "text-[#64748B] hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 mb-8">
              <StatCard label="Waitlist signups" value={STATS.waitlistSignups} today={STATS.waitlistToday} color="#10B981" icon="📋" />
              <StatCard label="QR escaneados" value={STATS.qrScans} today={STATS.qrScansToday} color="#3B82F6" icon="📱" />
              <StatCard label="Recetas emitidas" value={STATS.rxIssued} today={STATS.rxIssuedToday} color="#8B5CF6" icon="💊" />
              <StatCard label="Emergencias vistas" value={STATS.emergencyPageViews} today={STATS.emergencyPageViewsToday} color="#EF4444" icon="🆘" />
              <StatCard label="Visitantes únicos" value={STATS.uniqueVisitors} today={STATS.uniqueVisitorsToday} color="#F97316" icon="👥" />
              <StatCard label="Médicos interesados" value={STATS.forDoctorsViews} today={STATS.forDoctorsViewsToday} color="#10B981" icon="🩺" />
            </div>

            {/* Chart + recent signups */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SignupChart />
              <RecentSignups />
            </div>
          </>
        )}

        {tab === "signups" && (
          <div className="max-w-2xl">
            <RecentSignups />
            <div className="mt-6">
              <SignupChart />
            </div>
          </div>
        )}

        {tab === "pages" && (
          <div className="max-w-2xl">
            <TopPages />
          </div>
        )}

        {/* Note */}
        <div className="mt-8 p-4 bg-[#1E293B] border border-[#334155] rounded-xl">
          <p className="text-[#64748B] text-xs">
            📊 <strong className="text-[#94A3B8]">Nota:</strong> Datos de demostración. En producción: conectar a Vercel Analytics API + Resend API (para emails reales) + Supabase (para conteos de blockchain events). URL: <span className="font-mono text-[#10B981]">trustleaf-demo.vercel.app/admin</span>
          </p>
        </div>
      </main>
    </div>
  );
}
