// Copyright © 2026 Browns Studio
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { usePasskey } from "../../hooks/usePasskey";
import {
  SearchIcon,
  ClipboardCheckIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  PillIcon,
  ClockIcon,
  CalendarIcon,
  CheckIcon,
  UserIcon,
} from "../../components/icons/TrustLeafIcons";

// ─── Types ────────────────────────────────────────────────────────────────────

type PrescriptionStatus = "active" | "partial" | "used" | "revoked" | "expired";

interface FoundPrescription {
  rxId: string;
  medication: string;
  status: PrescriptionStatus;
  dispensed: number;
  totalDoses: number;
  expiryDate: string;
  doctorLicense: string;
  doctorName: string;
  isControlled?: boolean;
}

interface DispenseRecord {
  date: string;
  rxId: string;
  medication: string;
  doses: number;
  isControlled?: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_PRESCRIPTIONS: Record<string, FoundPrescription> = {
  "RX-A1B2C3D4": {
    rxId: "RX-A1B2C3D4",
    medication: "Amoxicilina 500mg",
    status: "active",
    dispensed: 2,
    totalDoses: 3,
    expiryDate: "2026-07-14",
    doctorLicense: "CM-12345",
    doctorName: "Dr. Carlos Méndez",
    isControlled: false,
  },
  "RX-E5F6G7H8": {
    rxId: "RX-E5F6G7H8",
    medication: "Losartán 50mg",
    status: "partial",
    dispensed: 1,
    totalDoses: 6,
    expiryDate: "2026-08-20",
    doctorLicense: "AR-67890",
    doctorName: "Dra. Ana Rodríguez",
    isControlled: false,
  },
  "RX-I9J0K1L2": {
    rxId: "RX-I9J0K1L2",
    medication: "Metformina 850mg",
    status: "used",
    dispensed: 3,
    totalDoses: 3,
    expiryDate: "2026-06-30",
    doctorLicense: "RS-54321",
    doctorName: "Dr. Roberto Silva",
    isControlled: false,
  },
  "RX-M3N4O5P6": {
    rxId: "RX-M3N4O5P6",
    medication: "Atorvastatina 20mg",
    status: "revoked",
    dispensed: 0,
    totalDoses: 2,
    expiryDate: "2026-07-10",
    doctorLicense: "CL-99876",
    doctorName: "Dra. Carmen López",
    isControlled: false,
  },
  "RX-C0NT-0001": {
    rxId: "RX-C0NT-0001",
    medication: "Clonazepam 0.5mg",
    status: "active",
    dispensed: 0,
    totalDoses: 1,
    expiryDate: "2026-07-20",
    doctorLicense: "JG-11111",
    doctorName: "Dr. Jorge García",
    isControlled: true,
  },
};

const INITIAL_DISPENSES: DispenseRecord[] = [
  {
    date: "2026-07-10 14:30",
    rxId: "RX-A1B2C3D4",
    medication: "Amoxicilina 500mg",
    doses: 1,
    isControlled: false,
  },
  {
    date: "2026-07-10 09:15",
    rxId: "RX-E5F6G7H8",
    medication: "Losartán 50mg",
    doses: 1,
    isControlled: false,
  },
  {
    date: "2026-07-09 16:00",
    rxId: "RX-Q9R0S1T2",
    medication: "Omeprazol 20mg",
    doses: 2,
    isControlled: false,
  },
  {
    date: "2026-07-09 11:45",
    rxId: "RX-C1D2E3F4",
    medication: "Ibuprofeno 400mg",
    doses: 1,
    isControlled: false,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const [datePart] = dateStr.split(" ");
  return new Date(datePart + "T00:00:00").toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isToday(dateStr: string): boolean {
  const today = new Date().toISOString().split("T")[0];
  return dateStr.startsWith(today);
}

// ─── Semáforo Visual ──────────────────────────────────────────────────────────

type TrafficLight = "green" | "yellow" | "red" | "idle";

function getTrafficLight(status: PrescriptionStatus): TrafficLight {
  switch (status) {
    case "active":
    case "partial":
      return "green";
    case "used":
    case "expired":
      return "yellow";
    case "revoked":
      return "red";
  }
}

interface SemaphoreProps {
  light: TrafficLight;
}

function Semaphore({ light }: SemaphoreProps) {
  const isGreen = light === "green";
  const isYellow = light === "yellow";
  const isRed = light === "red";

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Semaphore housing */}
      <div className="flex flex-col items-center gap-3 bg-[#0F172A] border-2 border-[#334155] rounded-2xl px-5 py-5 w-24">
        {/* Red */}
        <div className={`w-12 h-12 rounded-full border-2 transition-all duration-500 ${
          isRed
            ? "bg-red-500 border-red-400 shadow-[0_0_24px_rgba(239,68,68,0.7)]"
            : "bg-red-950/40 border-red-900/30"
        }`} />
        {/* Yellow */}
        <div className={`w-12 h-12 rounded-full border-2 transition-all duration-500 ${
          isYellow
            ? "bg-yellow-400 border-yellow-300 shadow-[0_0_24px_rgba(234,179,8,0.7)]"
            : "bg-yellow-950/40 border-yellow-900/30"
        }`} />
        {/* Green */}
        <div className={`w-12 h-12 rounded-full border-2 transition-all duration-500 ${
          isGreen
            ? "bg-emerald-500 border-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.7)]"
            : "bg-emerald-950/40 border-emerald-900/30"
        }`} />
      </div>

      {/* Label */}
      {light !== "idle" && (
        <span className={`text-xs font-bold tracking-wider uppercase ${
          isGreen ? "text-emerald-400" :
          isYellow ? "text-yellow-400" :
          "text-red-400"
        }`}>
          {isGreen ? "DISPENSAR" : isYellow ? "ATENCIÓN" : "NO DISPENSAR"}
        </span>
      )}
    </div>
  );
}

// ─── Controlled Drug Alert ────────────────────────────────────────────────────

function ControlledAlert({ medication }: { medication: string }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-orange-900/20 border border-orange-700 rounded-xl animate-fade-in">
      <AlertTriangleIcon className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
      <div>
        <p className="text-orange-300 font-semibold text-sm">Medicamento Controlado</p>
        <p className="text-orange-400/80 text-xs mt-0.5">
          <strong className="text-orange-300">{medication}</strong> está clasificado como controlado.
          Se requiere registro en el libro de control y verificación de identidad del paciente.
        </p>
      </div>
    </div>
  );
}

// ─── Prescription Result ──────────────────────────────────────────────────────

function PrescriptionResult({
  rx,
  onDispense,
}: {
  rx: FoundPrescription;
  onDispense: () => void;
}) {
  const light = getTrafficLight(rx.status);
  const canDispense = rx.status === "active" || rx.status === "partial";
  const remaining = rx.totalDoses - rx.dispensed;
  const progressPct = Math.round((rx.dispensed / rx.totalDoses) * 100);

  const statusLabel: Record<PrescriptionStatus, string> = {
    active: "Válida — Lista para dispensar",
    partial: "Parcialmente dispensada — Dosis disponibles",
    used: "Receta completamente usada",
    revoked: "Receta revocada — No dispensar",
    expired: "Receta vencida — No dispensar",
  };

  const containerClass: Record<TrafficLight, string> = {
    green: "border-emerald-700 bg-emerald-900/10",
    yellow: "border-yellow-700 bg-yellow-900/10",
    red: "border-red-700 bg-red-900/10",
    idle: "border-[#334155]",
  };

  return (
    <div className={`rounded-2xl border-2 p-6 space-y-5 ${containerClass[light]}`}>
      {/* Semaphore + status */}
      <div className="flex items-center gap-6">
        <Semaphore light={light} />
        <div className="flex-1">
          <p className={`text-base font-bold mb-1 ${
            light === "green" ? "text-emerald-400" :
            light === "yellow" ? "text-yellow-400" :
            "text-red-400"
          }`}>
            {statusLabel[rx.status]}
          </p>
          <p className="text-[#64748B] text-xs font-mono">{rx.rxId}</p>
          {rx.isControlled && (
            <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-orange-900/40 border border-orange-700 text-orange-400 text-[10px] font-bold rounded-full uppercase">
              <AlertTriangleIcon className="w-3 h-3" />
              Controlado
            </span>
          )}
        </div>
      </div>

      {/* Controlled alert */}
      {rx.isControlled && canDispense && (
        <ControlledAlert medication={rx.medication} />
      )}

      {/* Details */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#0F172A] rounded-xl p-4">
          <p className="text-[#64748B] text-xs mb-1">Medicamento</p>
          <p className="text-white font-semibold text-sm">{rx.medication}</p>
        </div>
        <div className="bg-[#0F172A] rounded-xl p-4">
          <p className="text-[#64748B] text-xs mb-1">Dosis restantes</p>
          <p className="text-white font-semibold text-lg">
            {remaining}
            <span className="text-[#64748B] text-sm font-normal">/{rx.totalDoses}</span>
          </p>
        </div>
        <div className="bg-[#0F172A] rounded-xl p-4">
          <p className="text-[#64748B] text-xs mb-1">Médico</p>
          <p className="text-white text-sm font-semibold">{rx.doctorName}</p>
          <p className="text-[#64748B] text-xs font-mono">Lic. {rx.doctorLicense}</p>
        </div>
        <div className="bg-[#0F172A] rounded-xl p-4">
          <p className="text-[#64748B] text-xs mb-1">Vencimiento</p>
          <p className="text-white text-sm font-semibold">{formatDate(rx.expiryDate)}</p>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-[#64748B] mb-1.5">
          <span>Progreso de dispensación</span>
          <span>{rx.dispensed}/{rx.totalDoses} dosis</span>
        </div>
        <div className="w-full bg-[#1E293B] rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              light === "green" ? "bg-emerald-500" :
              light === "yellow" ? "bg-yellow-400" :
              "bg-red-500"
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Action */}
      <button
        onClick={onDispense}
        disabled={!canDispense}
        className="w-full py-4 text-sm font-bold rounded-xl transition-all disabled:bg-[#1E293B] disabled:text-[#475569] disabled:cursor-not-allowed bg-emerald-600 hover:bg-emerald-500 text-white enabled:hover:scale-[1.01] enabled:active:scale-[0.99]"
      >
        {canDispense ? "✓ Dispensar 1 dosis" : "No se puede dispensar"}
      </button>
    </div>
  );
}

// ─── Tabs ──────────────────────────────────────────────────────────────────────

type TabId = "verificar" | "historial";

function TabVerificar({
  onNewDispense,
}: {
  onNewDispense: (record: DispenseRecord) => void;
}) {
  const [query, setQuery] = useState("");
  const [found, setFound] = useState<FoundPrescription | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim().toUpperCase();
    if (!trimmed) {
      toast.error("Ingresa un ID de receta");
      return;
    }
    setLoading(true);
    setNotFound(false);
    setFound(null);

    setTimeout(() => {
      const rx = MOCK_PRESCRIPTIONS[trimmed];
      if (rx) {
        setFound(rx);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }, 700);
  }

  function handleDispense() {
    if (!found) return;
    const isComplete =
      found.status === "active" && found.dispensed + 1 >= found.totalDoses;

    toast.success(
      isComplete
        ? `Receta completada: ${found.medication}`
        : `1 dosis de ${found.medication} dispensada`
    );

    onNewDispense({
      date: new Date().toLocaleString("es-CL", { hour12: false }).slice(0, 16),
      rxId: found.rxId,
      medication: found.medication,
      doses: 1,
      isControlled: found.isControlled,
    });

    setFound(null);
    setQuery("");
  }

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Search form */}
      <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155]">
        <h2 className="text-white font-semibold text-lg mb-1">Verificar Receta</h2>
        <p className="text-[#64748B] text-sm mb-5">
          Ingresa el ID de receta o escanea el código QR del paciente
        </p>
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569] pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setNotFound(false);
                setFound(null);
              }}
              placeholder="RX-A1B2C3D4"
              className="w-full bg-[#0F172A] border border-[#334155] focus:border-[#10B981] text-white text-sm rounded-xl pl-10 pr-4 py-3 outline-none placeholder-[#475569] transition-colors font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 bg-[#10B981] hover:bg-[#059669] disabled:bg-[#1E293B] disabled:text-[#475569] text-[#0F172A] font-bold rounded-xl transition-colors text-sm shrink-0"
          >
            {loading ? "…" : "Buscar"}
          </button>
        </form>
        {/* Demo hints */}
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(MOCK_PRESCRIPTIONS).map(([id, rx]) => (
            <button
              key={id}
              onClick={() => setQuery(id)}
              className="text-xs text-[#475569] hover:text-[#10B981] font-mono transition-colors"
              title={rx.medication}
            >
              {id}
            </button>
          ))}
          <span className="text-xs text-[#334155]">← IDs demo</span>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-[#1E293B] rounded-2xl p-10 border border-[#334155] text-center">
          <div className="w-8 h-8 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[#64748B] text-sm">Verificando en Stellar Network…</p>
        </div>
      )}

      {/* Not found */}
      {notFound && !loading && (
        <div className="bg-[#1E293B] rounded-2xl p-8 border-2 border-red-800 text-center">
          <div className="w-16 h-16 rounded-full bg-red-900/30 border-2 border-red-700 flex items-center justify-center mx-auto mb-4">
            <AlertTriangleIcon className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-white font-semibold mb-1">Receta no encontrada</p>
          <p className="text-[#64748B] text-sm">
            El ID{" "}
            <span className="font-mono text-[#94A3B8]">&quot;{query}&quot;</span>{" "}
            no existe en blockchain.
          </p>
        </div>
      )}

      {/* Found */}
      {found && !loading && (
        <PrescriptionResult rx={found} onDispense={handleDispense} />
      )}
    </div>
  );
}

function TabHistorial({ dispenses }: { dispenses: DispenseRecord[] }) {
  const todayCount = dispenses.filter((d) => isToday(d.date)).length;
  const controlledCount = dispenses.filter((d) => d.isControlled && isToday(d.date)).length;

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Day summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#1E293B] rounded-2xl p-5 border border-[#334155]">
          <div className="flex items-center gap-2 mb-1">
            <CheckIcon className="w-4 h-4 text-[#10B981]" />
            <p className="text-[#64748B] text-xs uppercase tracking-wider font-medium">Hoy</p>
          </div>
          <p className="text-3xl font-bold text-[#10B981]">{todayCount}</p>
          <p className="text-[#64748B] text-xs mt-0.5">dispensaciones</p>
        </div>
        <div className="bg-[#1E293B] rounded-2xl p-5 border border-[#334155]">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangleIcon className="w-4 h-4 text-orange-400" />
            <p className="text-[#64748B] text-xs uppercase tracking-wider font-medium">Controlados hoy</p>
          </div>
          <p className="text-3xl font-bold text-orange-400">{controlledCount}</p>
          <p className="text-[#64748B] text-xs mt-0.5">requieren registro</p>
        </div>
      </div>

      {/* List */}
      <div className="bg-[#1E293B] rounded-2xl border border-[#334155] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#334155] flex items-center justify-between">
          <h3 className="text-white font-semibold">Historial de Dispensaciones</h3>
          <span className="text-[#64748B] text-xs">{dispenses.length} total</span>
        </div>
        {dispenses.length === 0 ? (
          <div className="p-10 text-center">
            <ClipboardCheckIcon className="w-10 h-10 text-[#334155] mx-auto mb-3" />
            <p className="text-[#64748B] text-sm">Sin dispensaciones registradas.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#64748B] text-xs uppercase tracking-wider border-b border-[#334155]">
                  <th className="px-5 py-3">Fecha</th>
                  <th className="px-5 py-3">Receta</th>
                  <th className="px-5 py-3">Medicamento</th>
                  <th className="px-5 py-3 text-right">Dosis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {dispenses.map((record, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-[#253046] transition-colors"
                  >
                    <td className="px-5 py-3.5 text-[#64748B] text-xs whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        <CalendarIcon className="w-3 h-3" />
                        {record.date}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs text-[#94A3B8]">{record.rxId}</span>
                    </td>
                    <td className="px-5 py-3.5 text-white">
                      <div className="flex items-center gap-2">
                        {record.medication}
                        {record.isControlled && (
                          <AlertTriangleIcon className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-900/30 text-emerald-400 text-xs font-semibold rounded-full">
                        <PillIcon className="w-3 h-3" />
                        {record.doses}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "verificar", label: "Verificar Receta", icon: <ShieldCheckIcon /> },
  { id: "historial", label: "Historial", icon: <ClipboardCheckIcon /> },
];

export default function DispensaryDashboard() {
  const { walletAddress } = usePasskey();
  const [activeTab, setActiveTab] = useState<TabId>("verificar");
  const [dispenses, setDispenses] = useState<DispenseRecord[]>(INITIAL_DISPENSES);

  function addDispense(record: DispenseRecord) {
    setDispenses((prev) => [record, ...prev]);
  }

  const todayCount = dispenses.filter((d) => isToday(d.date)).length;

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col bg-[#1E293B] border-r border-[#334155] z-40">
        <div className="px-6 py-6 border-b border-[#334155]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#10B981] flex items-center justify-center text-[#0F172A] font-bold text-sm">TL</div>
            <div>
              <p className="text-white font-bold text-sm">TrustLeaf</p>
              <p className="text-[#64748B] text-xs">Portal Farmacia</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-b border-[#334155]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-[#3B82F6]" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Farmacia Demo</p>
              <p className="text-[#64748B] text-xs font-mono">
                {walletAddress ? `${walletAddress.slice(0, 8)}…` : "No conectado"}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-[#10B981] text-[#0F172A] font-semibold"
                  : "text-[#64748B] hover:text-white hover:bg-[#253046]"
              }`}
            >
              <span className="w-4 h-4">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-[#334155] space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-[#64748B]">Dispensaciones hoy</span>
            <span className="text-[#10B981] font-semibold">{todayCount}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#64748B]">Total registros</span>
            <span className="text-white font-semibold">{dispenses.length}</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="md:ml-64 pb-24 md:pb-8">
        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-30 bg-[#0F172A]/95 backdrop-blur-sm border-b border-[#334155] px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#10B981] flex items-center justify-center text-[#0F172A] font-bold text-xs">TL</div>
              <span className="text-white font-bold text-sm">TrustLeaf</span>
              <span className="text-[#334155] text-xs">· Farmacia</span>
            </div>
            <span className="text-[#64748B] text-xs font-mono">
              {walletAddress ? `${walletAddress.slice(0, 6)}…` : "—"}
            </span>
          </div>
        </header>

        {/* Desktop page header */}
        <div className="hidden md:block px-8 pt-8 pb-6 border-b border-[#334155]">
          <h1 className="text-2xl font-bold text-white">
            {TABS.find((t) => t.id === activeTab)?.label}
          </h1>
          <p className="text-[#64748B] text-sm mt-1">
            Verificación de recetas ZK — Stellar Network
          </p>
        </div>

        <div className="px-4 md:px-8 py-6">
          {activeTab === "verificar" && <TabVerificar onNewDispense={addDispense} />}
          {activeTab === "historial" && <TabHistorial dispenses={dispenses} />}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 md:hidden bg-[#1E293B]/95 backdrop-blur-sm border-t border-[#334155] z-40">
        <div className="flex">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                activeTab === tab.id ? "text-[#10B981]" : "text-[#475569] hover:text-[#94A3B8]"
              }`}
            >
              <span className="w-5 h-5">{tab.icon}</span>
              <span className="leading-none text-[10px]">{tab.label.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
