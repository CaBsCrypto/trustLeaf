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
}

interface DispenseRecord {
  date: string;
  rxId: string;
  medication: string;
  doses: number;
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
  },
};

const MOCK_DISPENSES: DispenseRecord[] = [
  {
    date: "2026-07-08 14:30",
    rxId: "RX-A1B2C3D4",
    medication: "Amoxicilina 500mg",
    doses: 1,
  },
  {
    date: "2026-07-07 09:15",
    rxId: "RX-E5F6G7H8",
    medication: "Losartán 50mg",
    doses: 1,
  },
  {
    date: "2026-07-05 11:45",
    rxId: "RX-Q9R0S1T2",
    medication: "Omeprazol 20mg",
    doses: 2,
  },
  {
    date: "2026-07-03 16:00",
    rxId: "RX-C1D2E3F4",
    medication: "Ibuprofeno 400mg",
    doses: 1,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  PrescriptionStatus,
  { label: string; icon: React.ReactNode; containerClass: string; badgeClass: string }
> = {
  active: {
    label: "Válida — Lista para dispensar",
    icon: <ShieldCheckIcon className="w-8 h-8 text-green-400" />,
    containerClass: "border-green-700 bg-green-900/20",
    badgeClass: "bg-green-900/50 text-green-400 border border-green-700",
  },
  partial: {
    label: "Parcialmente dispensada",
    icon: <PillIcon className="w-8 h-8 text-yellow-400" />,
    containerClass: "border-yellow-700 bg-yellow-900/10",
    badgeClass: "bg-yellow-900/50 text-yellow-400 border border-yellow-700",
  },
  used: {
    label: "Receta completamente usada",
    icon: <CheckIcon className="w-8 h-8 text-gray-400" />,
    containerClass: "border-gray-700 bg-gray-800",
    badgeClass: "bg-gray-800 text-gray-400 border border-gray-700",
  },
  revoked: {
    label: "Receta revocada — No dispensar",
    icon: <AlertTriangleIcon className="w-8 h-8 text-red-400" />,
    containerClass: "border-red-700 bg-red-900/20",
    badgeClass: "bg-red-900/50 text-red-400 border border-red-700",
  },
  expired: {
    label: "Receta vencida",
    icon: <ClockIcon className="w-8 h-8 text-orange-400" />,
    containerClass: "border-orange-700 bg-orange-900/10",
    badgeClass: "bg-orange-900/50 text-orange-400 border border-orange-700",
  },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr.split(" ")[0] + "T00:00:00").toLocaleDateString(
    "es-CL",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

// ─── Prescription Result Card ─────────────────────────────────────────────────

function PrescriptionResult({
  rx,
  onDispense,
}: {
  rx: FoundPrescription;
  onDispense: () => void;
}) {
  const cfg = STATUS_CONFIG[rx.status];
  const remaining = rx.totalDoses - rx.dispensed;
  const canDispense = rx.status === "active" || rx.status === "partial";
  const progressPct = Math.round((rx.dispensed / rx.totalDoses) * 100);

  return (
    <div
      className={`rounded-2xl border-2 p-6 transition-all ${cfg.containerClass}`}
    >
      {/* Status indicator */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-700">
        <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center">
          {cfg.icon}
        </div>
        <div>
          <p
            className={`text-sm font-semibold px-3 py-1 rounded-full inline-block mb-1 ${cfg.badgeClass}`}
          >
            {cfg.label}
          </p>
          <p className="text-gray-400 text-xs font-mono">{rx.rxId}</p>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-900 rounded-xl p-4">
          <p className="text-gray-500 text-xs mb-1">Medicamento</p>
          <p className="text-white font-semibold">{rx.medication}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4">
          <p className="text-gray-500 text-xs mb-1">Dosis restantes</p>
          <p className="text-white font-semibold text-lg">
            {remaining}
            <span className="text-gray-500 text-sm font-normal">
              /{rx.totalDoses}
            </span>
          </p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4">
          <p className="text-gray-500 text-xs mb-1">Médico</p>
          <p className="text-white text-sm font-semibold">{rx.doctorName}</p>
          <p className="text-gray-500 text-xs font-mono">Lic. {rx.doctorLicense}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4">
          <p className="text-gray-500 text-xs mb-1">Vencimiento</p>
          <p className="text-white text-sm font-semibold">
            {formatDate(rx.expiryDate)}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>Progreso de dispensación</span>
          <span>{rx.dispensed}/{rx.totalDoses} dosis</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              canDispense ? "bg-green-500" : "bg-gray-500"
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Action */}
      <button
        onClick={onDispense}
        disabled={!canDispense}
        className="w-full py-3.5 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors text-sm"
      >
        {canDispense ? "✓ Dispensar 1 dosis" : "No se puede dispensar"}
      </button>
    </div>
  );
}

// ─── Tab Content ──────────────────────────────────────────────────────────────

type TabId = "verificar" | "historial";

function TabVerificar() {
  const [query, setQuery] = useState("");
  const [found, setFound] = useState<FoundPrescription | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dispenses, setDispenses] = useState(MOCK_DISPENSES);

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

    // Simulate async search
    setTimeout(() => {
      const rx = MOCK_PRESCRIPTIONS[trimmed];
      if (rx) {
        setFound(rx);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }, 600);
  }

  function handleDispense() {
    if (!found) return;
    if (found.status === "active" && found.dispensed + 1 >= found.totalDoses) {
      toast.success(`Dispensada: ${found.medication}. Receta completada.`);
    } else {
      toast.success(`1 dosis de ${found.medication} dispensada correctamente.`);
    }
    const newRecord: DispenseRecord = {
      date: new Date().toLocaleString("es-CL"),
      rxId: found.rxId,
      medication: found.medication,
      doses: 1,
    };
    setDispenses((prev) => [newRecord, ...prev]);
    setFound(null);
    setQuery("");
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Search */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h2 className="text-white font-semibold text-lg mb-1">
          Verificar Receta
        </h2>
        <p className="text-gray-400 text-sm mb-5">
          Ingresa el ID de receta o escanea el código QR del paciente
        </p>
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setNotFound(false);
                setFound(null);
              }}
              placeholder="RX-A1B2C3D4"
              className="w-full bg-gray-900 border border-gray-700 focus:border-green-500 text-white text-sm rounded-xl pl-10 pr-4 py-3 outline-none placeholder-gray-600 transition-colors font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 text-white font-semibold rounded-xl transition-colors text-sm shrink-0"
          >
            {loading ? "…" : "Buscar"}
          </button>
        </form>

        {/* Demo hint */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {Object.keys(MOCK_PRESCRIPTIONS).map((id) => (
            <button
              key={id}
              onClick={() => setQuery(id)}
              className="text-xs text-gray-600 hover:text-green-400 font-mono transition-colors"
            >
              {id}
            </button>
          ))}
          <span className="text-xs text-gray-700">← demo IDs</span>
        </div>
      </div>

      {/* Result */}
      {loading && (
        <div className="bg-gray-800 rounded-2xl p-10 border border-gray-700 text-center">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Verificando en Stellar…</p>
        </div>
      )}

      {notFound && !loading && (
        <div className="bg-gray-800 rounded-2xl p-8 border border-red-900 text-center">
          <AlertTriangleIcon className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-white font-semibold mb-1">Receta no encontrada</p>
          <p className="text-gray-400 text-sm">
            El ID{" "}
            <span className="font-mono text-gray-300">&quot;{query}&quot;</span>{" "}
            no existe en blockchain.
          </p>
        </div>
      )}

      {found && !loading && (
        <PrescriptionResult rx={found} onDispense={handleDispense} />
      )}
    </div>
  );
}

function TabHistorial({
  dispenses,
}: {
  dispenses: DispenseRecord[];
}) {
  return (
    <div className="space-y-4 max-w-2xl">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-700 flex items-center justify-between">
          <h3 className="text-white font-semibold">Historial de Dispensaciones</h3>
          <span className="text-gray-500 text-xs">{dispenses.length} registros</span>
        </div>
        {dispenses.length === 0 ? (
          <div className="p-10 text-center">
            <ClipboardCheckIcon className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              Aún no hay dispensaciones registradas.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-700">
                  <th className="px-5 py-3">Fecha</th>
                  <th className="px-5 py-3">ID Receta</th>
                  <th className="px-5 py-3">Medicamento</th>
                  <th className="px-5 py-3 text-right">Dosis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {dispenses.map((record, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        {record.date}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs text-gray-300">
                        {record.rxId}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-white">{record.medication}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-900/40 text-green-400 text-xs font-semibold rounded-full">
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
  const [dispenses, setDispenses] = useState(MOCK_DISPENSES);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ── Desktop sidebar ─────────────────────────────────────────── */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col bg-gray-900 border-r border-gray-800 z-40">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-black font-bold text-sm">
              TL
            </div>
            <div>
              <p className="text-white font-bold text-sm">TrustLeaf</p>
              <p className="text-gray-500 text-xs">Portal Farmacia</p>
            </div>
          </div>
        </div>

        {/* Pharmacy info */}
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-900/40 border border-blue-700 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Farmacia Demo</p>
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
                  ? "bg-green-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <span className="w-4 h-4">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Stats summary */}
        <div className="px-6 py-4 border-t border-gray-800 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Dispensaciones hoy</span>
            <span className="text-green-400 font-semibold">
              {dispenses.filter((d) => d.date.startsWith("2026-07-08")).length}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Total registros</span>
            <span className="text-white font-semibold">{dispenses.length}</span>
          </div>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <main className="md:ml-64 pb-24 md:pb-8">
        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-gray-800 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-green-500 flex items-center justify-center text-black font-bold text-xs">
                TL
              </div>
              <span className="text-white font-bold text-sm">TrustLeaf</span>
              <span className="text-gray-600 text-xs">· Farmacia</span>
            </div>
            <span className="text-gray-500 text-xs font-mono">
              {walletAddress ? `${walletAddress.slice(0, 6)}…` : "—"}
            </span>
          </div>
        </header>

        {/* Desktop page header */}
        <div className="hidden md:block px-8 pt-8 pb-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold text-white">
            {TABS.find((t) => t.id === activeTab)?.label}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Verificación de recetas médicas ZK — Stellar Network
          </p>
        </div>

        {/* Tab content */}
        <div className="px-4 md:px-8 py-6">
          {activeTab === "verificar" && (
            <TabVerificar />
          )}
          {activeTab === "historial" && (
            <TabHistorial dispenses={dispenses} />
          )}
        </div>
      </main>

      {/* ── Mobile bottom nav ─────────────────────────────────────────── */}
      <nav className="fixed bottom-0 inset-x-0 md:hidden bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 z-40">
        <div className="flex">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-green-400"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <span className="w-5 h-5">{tab.icon}</span>
              <span className="leading-none text-[10px]">
                {tab.label.split(" ")[0]}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
