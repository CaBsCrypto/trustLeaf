// Copyright © 2026 Browns Studio
"use client";

import { useState } from "react";
import Link from "next/link";
import DemoTour, { TourTrigger, type TourStep } from "../../components/DemoTour";
import { toast } from "sonner";
import { usePasskey } from "../../hooks/usePasskey";
import {
  HomeIcon,
  UserIcon,
  ClipboardCheckIcon,
  StethoscopeIcon,
  ChevronRightIcon,
  FilterIcon,
  PillIcon,
  CalendarIcon,
  ClockIcon,
  AlertTriangleIcon,
} from "../../components/icons/TrustLeafIcons";

// ─── Doctor tour steps ─────────────────────────────────────────────────────────

const DOCTOR_TOUR_STEPS: TourStep[] = [
  {
    title: "Tu panel médico",
    description:
      "Bienvenido al portal médico de TrustLeaf. Aquí tienes una vista completa de tus recetas, pacientes y estadísticas del día.",
    highlight: "doctor-dashboard",
  },
  {
    title: "Emitir receta",
    description:
      "Con un solo clic emites una receta ZK — el RUT del paciente nunca queda en blockchain. Firma con Face ID o huella.",
    highlight: "doctor-prescribe-btn",
  },
  {
    title: "Tus pacientes",
    description:
      "Lista de pacientes con nombres enmascarados por privacidad. Cada fila muestra recetas activas y última visita.",
    highlight: "doctor-patients",
  },
  {
    title: "Verificado en blockchain",
    description:
      "Esta insignia confirma que tu cuenta está anclada en Stellar Network. Toda receta emitida queda registrada con prueba ZK inmutable.",
    highlight: "doctor-trust-badge",
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type PrescriptionStatus = "active" | "partial" | "used" | "revoked";

interface PatientRow {
  id: string;
  maskedName: string;
  prescriptionCount: number;
  lastVisit: string;
  status: "active" | "inactive";
}

interface PrescriptionRow {
  rxId: string;
  patient: string;
  medication: string;
  date: string;
  status: PrescriptionStatus;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_STATS = {
  prescriptionsToday: 4,
  activePrescriptions: 12,
  patientsAttended: 28,
};

// Pain diary data per patient (P1 = chronic pain patient)
const PATIENT_PAIN_DATA: Record<string, { day: string; level: number }[]> = {
  P1: [
    { day: "Lun", level: 7 },
    { day: "Mar", level: 6 },
    { day: "Mié", level: 8 },
    { day: "Jue", level: 5 },
    { day: "Vie", level: 6 },
    { day: "Sáb", level: 4 },
    { day: "Dom", level: 7 },
  ],
  P2: [
    { day: "Lun", level: 3 },
    { day: "Mar", level: 4 },
    { day: "Mié", level: 3 },
    { day: "Jue", level: 5 },
    { day: "Vie", level: 2 },
    { day: "Sáb", level: 2 },
    { day: "Dom", level: 3 },
  ],
};

const MOCK_PATIENTS: PatientRow[] = [
  {
    id: "P1",
    maskedName: "J*** D**",
    prescriptionCount: 3,
    lastVisit: "2026-07-08",
    status: "active",
  },
  {
    id: "P2",
    maskedName: "M*** G****",
    prescriptionCount: 1,
    lastVisit: "2026-07-07",
    status: "active",
  },
  {
    id: "P3",
    maskedName: "P*** R****",
    prescriptionCount: 5,
    lastVisit: "2026-07-05",
    status: "inactive",
  },
  {
    id: "P4",
    maskedName: "C*** L***",
    prescriptionCount: 2,
    lastVisit: "2026-07-03",
    status: "active",
  },
  {
    id: "P5",
    maskedName: "S*** V****",
    prescriptionCount: 1,
    lastVisit: "2026-06-28",
    status: "inactive",
  },
];

const MOCK_HISTORY: PrescriptionRow[] = [
  {
    rxId: "RX-A1B2C3D4",
    patient: "J*** D**",
    medication: "Amoxicilina 500mg",
    date: "2026-07-08",
    status: "active",
  },
  {
    rxId: "RX-E5F6G7H8",
    patient: "M*** G****",
    medication: "Losartán 50mg",
    date: "2026-07-07",
    status: "partial",
  },
  {
    rxId: "RX-Q9R0S1T2",
    patient: "P*** R****",
    medication: "Omeprazol 20mg",
    date: "2026-07-05",
    status: "used",
  },
  {
    rxId: "RX-U3V4W5X6",
    patient: "C*** L***",
    medication: "Atorvastatina 20mg",
    date: "2026-07-03",
    status: "revoked",
  },
  {
    rxId: "RX-Y7Z8A9B0",
    patient: "J*** D**",
    medication: "Metformina 850mg",
    date: "2026-07-01",
    status: "used",
  },
  {
    rxId: "RX-C1D2E3F4",
    patient: "S*** V****",
    medication: "Ibuprofeno 400mg",
    date: "2026-06-28",
    status: "used",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  PrescriptionStatus,
  { label: string; className: string }
> = {
  active: {
    label: "Activa",
    className: "bg-green-900/50 text-green-400 border border-green-700",
  },
  partial: {
    label: "Parcial",
    className: "bg-yellow-900/50 text-yellow-400 border border-yellow-700",
  },
  used: {
    label: "Usada",
    className: "bg-gray-800 text-gray-400 border border-[#334155]",
  },
  revoked: {
    label: "Revocada",
    className: "bg-red-900/50 text-red-400 border border-red-700",
  },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Tab Content ──────────────────────────────────────────────────────────────

function TabInicio() {
  return (
    <div className="space-y-6">
      {/* Trust badge */}
      <div id="doctor-trust-badge" className="flex items-center gap-2 px-4 py-2.5 bg-green-900/20 border border-green-800/60 rounded-xl w-fit">
        <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span className="text-green-400 text-xs font-semibold tracking-wide">
          Verificado en Stellar Blockchain
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#1E293B] rounded-2xl p-5 border border-[#334155]">
          <div className="flex items-center gap-2 mb-2">
            <PillIcon className="w-4 h-4 text-green-400" />
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
              Recetas hoy
            </p>
          </div>
          <p className="text-4xl font-bold text-green-400">
            {MOCK_STATS.prescriptionsToday}
          </p>
        </div>
        <div className="bg-[#1E293B] rounded-2xl p-5 border border-[#334155]">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardCheckIcon className="w-4 h-4 text-blue-400" />
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
              Recetas activas
            </p>
          </div>
          <p className="text-4xl font-bold text-blue-400">
            {MOCK_STATS.activePrescriptions}
          </p>
        </div>
        <div className="bg-[#1E293B] rounded-2xl p-5 border border-[#334155]">
          <div className="flex items-center gap-2 mb-2">
            <UserIcon className="w-4 h-4 text-purple-400" />
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
              Pacientes
            </p>
          </div>
          <p className="text-4xl font-bold text-purple-400">
            {MOCK_STATS.patientsAttended}
          </p>
        </div>
      </div>

      {/* Quick action */}
      <div className="bg-gradient-to-br from-green-900/40 to-green-900/10 border border-green-800 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center shrink-0">
            <StethoscopeIcon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-lg mb-1">
              Nueva Receta ZK
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Emite una receta médica con compromiso criptográfico. El RUT del
              paciente nunca es registrado en blockchain.
            </p>
            <Link
              id="doctor-prescribe-btn"
              href="/doctor/prescribe"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              + Nueva Receta ZK
              <ChevronRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Info card */}
      <div className="bg-[#1E293B] rounded-2xl p-5 border border-[#334155]">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangleIcon className="w-4 h-4 text-yellow-400" />
          <h3 className="text-white font-semibold text-sm">
            Sobre las Recetas ZK
          </h3>
        </div>
        <ul className="space-y-2 text-gray-400 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">•</span>
            Solo el hash del compromiso es registrado en Stellar/Soroban
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">•</span>
            Cero PHI (información de salud protegida) en cadena
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">•</span>
            El paciente controla la divulgación con su RUT + nonce
          </li>
        </ul>
      </div>
    </div>
  );
}

function PainMiniChart({ data }: { data: { day: string; level: number }[] }) {
  const avg = Math.round(data.reduce((s, d) => s + d.level, 0) / data.length * 10) / 10;
  const getColor = (l: number) => l <= 3 ? "#22C55E" : l <= 6 ? "#EAB308" : "#EF4444";
  return (
    <div className="mt-3 p-3 bg-gray-900/60 rounded-xl border border-[#334155]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[#94A3B8] text-xs font-medium">📓 Diario de Dolor — 7 días</span>
        <span className="text-xs font-bold" style={{ color: getColor(avg) }}>
          Promedio: {avg}/10
        </span>
      </div>
      <div className="flex items-end gap-1" style={{ height: "40px" }}>
        {data.map(({ day, level }) => (
          <div key={day} className="flex-1 flex flex-col items-center gap-0.5">
            <div
              className="w-full rounded-t"
              style={{
                height: `${(level / 10) * 36}px`,
                backgroundColor: getColor(level),
                minHeight: "3px",
              }}
            />
            <span className="text-[9px] text-[#64748B]">{day[0]}</span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-[#64748B] mt-2">
        Pico: miércoles · Tramadol correlaciona con reducción de 2 pts
      </p>
    </div>
  );
}

function PatientListWithPain() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <ul className="divide-y divide-[#334155]">
      {MOCK_PATIENTS.map((patient) => {
        const painData = PATIENT_PAIN_DATA[patient.id];
        const isOpen = expanded === patient.id;
        return (
          <li key={patient.id} className="px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center shrink-0">
                <UserIcon className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white text-sm font-medium font-mono">
                    {patient.maskedName}
                  </p>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                    patient.status === "active"
                      ? "bg-green-900/40 text-green-400"
                      : "bg-gray-700 text-gray-500"
                  }`}>
                    {patient.status === "active" ? "Activo" : "Inactivo"}
                  </span>
                  {painData && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-900/40 text-purple-400">
                      📓 Diario
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-xs">
                  {patient.prescriptionCount} receta{patient.prescriptionCount !== 1 ? "s" : ""} · Últ. visita {formatDate(patient.lastVisit)}
                </p>
              </div>
              <button
                onClick={() => setExpanded(isOpen ? null : patient.id)}
                className={`transition-colors ${isOpen ? "text-green-400" : "text-gray-500 hover:text-green-400"}`}
              >
                <ChevronRightIcon className={`w-4 h-4 transition-transform ${isOpen ? "rotate-90" : ""}`} />
              </button>
            </div>
            {isOpen && painData && (
              <PainMiniChart data={painData} />
            )}
            {isOpen && !painData && (
              <div className="mt-3 p-3 bg-gray-900/60 rounded-xl border border-[#334155] text-[#64748B] text-xs">
                Este paciente aún no tiene entradas en el Diario de Dolor.
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function TabPacientes() {
  return (
    <div className="space-y-4">
      <div id="doctor-patients" className="bg-[#1E293B] rounded-2xl border border-[#334155] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#334155] flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold">Pacientes Recientes</h3>
            <p className="text-gray-400 text-xs mt-0.5">
              Nombres enmascarados para privacidad
            </p>
          </div>
          <span className="text-gray-500 text-xs">
            {MOCK_PATIENTS.length} pacientes
          </span>
        </div>
        {MOCK_PATIENTS.length === 0 ? (
          <div className="p-12 text-center">
            <UserIcon className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No hay pacientes registrados</p>
            <Link
              href="/doctor/prescribe"
              className="inline-block mt-4 text-green-400 text-sm hover:text-green-300 transition-colors"
            >
              Emitir primera receta →
            </Link>
          </div>
        ) : (
          <PatientListWithPain />
        )}
      </div>
    </div>
  );
}

type FilterStatus = "all" | PrescriptionStatus;

function TabHistorial() {
  const [filter, setFilter] = useState<FilterStatus>("all");

  const filtered =
    filter === "all"
      ? MOCK_HISTORY
      : MOCK_HISTORY.filter((rx) => rx.status === filter);

  const filterOptions: { value: FilterStatus; label: string }[] = [
    { value: "all", label: "Todas" },
    { value: "active", label: "Activas" },
    { value: "partial", label: "Parciales" },
    { value: "used", label: "Usadas" },
    { value: "revoked", label: "Revocadas" },
  ];

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <FilterIcon className="w-4 h-4 text-gray-500 shrink-0" />
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === opt.value
                ? "bg-[#10B981] text-[#0F172A] font-semibold"
                : "bg-gray-800 text-gray-400 hover:text-white border border-[#334155] hover:border-gray-600"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-[#1E293B] rounded-2xl p-10 border border-[#334155] text-center">
          <ClipboardCheckIcon className="w-10 h-10 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            No hay recetas con este estado.
          </p>
        </div>
      ) : (
        <div className="bg-[#1E293B] rounded-2xl border border-[#334155] overflow-hidden">
          <ul className="divide-y divide-[#334155]">
            {filtered.map((rx) => {
              const cfg = STATUS_CONFIG[rx.status];
              return (
                <li
                  key={rx.rxId}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-[#253046]/60 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-white text-sm font-semibold">
                        {rx.medication}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.className}`}
                      >
                        {cfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-500 text-xs flex-wrap">
                      <span className="font-mono">{rx.rxId}</span>
                      <span>·</span>
                      <span className="font-mono">{rx.patient}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" />
                        {formatDate(rx.date)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      toast.info("Detalle de receta disponible próximamente")
                    }
                    className="text-gray-600 hover:text-green-400 transition-colors shrink-0"
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type TabId = "inicio" | "pacientes" | "historial";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "inicio", label: "Inicio", icon: <HomeIcon /> },
  { id: "pacientes", label: "Mis Pacientes", icon: <UserIcon /> },
  { id: "historial", label: "Historial", icon: <ClipboardCheckIcon /> },
];

export default function DoctorDashboard() {
  const { walletAddress } = usePasskey();
  const [activeTab, setActiveTab] = useState<TabId>("inicio");
  const [tourActive, setTourActive] = useState(false);

  return (
    <div id="doctor-dashboard" className="min-h-screen bg-[#0F172A] text-white">
      {/* ── Desktop sidebar ─────────────────────────────────────────── */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col bg-[#1E293B] border-r border-[#334155] z-40">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-[#334155]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#10B981] flex items-center justify-center text-[#0F172A] font-bold text-sm">
              TL
            </div>
            <div>
              <p className="text-white font-bold text-sm">TrustLeaf</p>
              <p className="text-gray-500 text-xs">Portal Médico</p>
            </div>
          </div>
        </div>

        {/* Doctor info */}
        <div className="px-6 py-4 border-b border-[#334155]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-900/50 border border-green-700 flex items-center justify-center">
              <StethoscopeIcon className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Dr. Médico</p>
              <p className="text-gray-500 text-xs font-mono">
                {walletAddress
                  ? `${walletAddress.slice(0, 8)}…`
                  : "No conectado"}
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-[#10B981] text-[#0F172A] font-semibold"
                  : "text-gray-400 hover:text-white hover:bg-[#253046]"
              }`}
            >
              <span className="w-4 h-4">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Quick action */}
        <div className="px-3 py-4 border-t border-gray-800 space-y-2">
          <Link
            href="/doctor/prescribe"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            + Nueva Receta ZK
          </Link>
          <Link
            href="/doctor/profile"
            className="flex items-center justify-center gap-2 w-full py-2 border border-[#334155] hover:border-[#475569] text-gray-400 hover:text-white text-xs font-medium rounded-xl transition-colors"
          >
            Ver mi perfil →
          </Link>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <main className="md:ml-64 pb-24 md:pb-8">
        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-30 bg-[#0F172A]/95 backdrop-blur-sm border-b border-[#334155] px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#10B981] flex items-center justify-center text-[#0F172A] font-bold text-xs">
                TL
              </div>
              <span className="text-white font-bold text-sm">TrustLeaf</span>
              <span className="text-gray-600 text-xs">· Médico</span>
            </div>
            <Link
              href="/doctor/prescribe"
              className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              + Receta
            </Link>
          </div>
        </header>

        {/* Desktop page header */}
        <div className="hidden md:block px-8 pt-8 pb-6 border-b border-[#334155]">
          <h1 className="text-2xl font-bold text-white">
            {TABS.find((t) => t.id === activeTab)?.label}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Panel de gestión médica — recetas ZK en Stellar
          </p>
        </div>

        {/* Tab content */}
        <div className="px-4 md:px-8 py-6">
          {activeTab === "inicio" && <TabInicio />}
          {activeTab === "pacientes" && <TabPacientes />}
          {activeTab === "historial" && <TabHistorial />}
        </div>
      </main>

      {/* ── Mobile bottom nav ─────────────────────────────────────────── */}
      <nav className="fixed bottom-0 inset-x-0 md:hidden bg-[#1E293B]/95 backdrop-blur-sm border-t border-[#334155] z-40 min-h-[56px]">
        <div className="flex h-full">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[56px] text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-green-400"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <span className="w-5 h-5">{tab.icon}</span>
              <span className="leading-none text-[10px]">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Demo tour */}
      {!tourActive && (
        <TourTrigger onClick={() => setTourActive(true)} />
      )}
      {tourActive && (
        <DemoTour
          steps={DOCTOR_TOUR_STEPS}
          onClose={() => setTourActive(false)}
        />
      )}
    </div>
  );
}
