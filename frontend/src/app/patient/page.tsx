// Copyright © 2026 Browns Studio
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePasskey } from "../../hooks/usePasskey";
import {
  PillIcon,
  FichaIcon,
  LockIcon,
  CalendarIcon,
  QrIcon,
  AlertTriangleIcon,
  ClockIcon,
  HeartPulseIcon,
  SyringeIcon,
  CheckIcon,
  UserIcon,
  CloseIcon,
  DownloadIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  SettingsIcon,
} from "../../components/icons/TrustLeafIcons";

// ─── Types ────────────────────────────────────────────────────────────────────

type PrescriptionStatus = "active" | "partial" | "used" | "revoked";
type LicenseStatus = "active" | "completed" | "pending";

interface Prescription {
  id: string;
  medication: string;
  status: PrescriptionStatus;
  dispensed: number;
  totalDoses: number;
  expiryDate: string;
  hash: string;
  doctorName: string;
  license: string;
}

interface DoctorAccess {
  id: string;
  name: string;
  specialty: string;
  accessDate: string;
  walletAddress: string;
}

interface Vaccine {
  name: string;
  date: string | null;
  status: "completed" | "pending";
}

interface MedicalLeave {
  id: string;
  diagnosisType: string;
  duration: string;
  startDate: string;
  status: LicenseStatus;
  doctorName: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_PRESCRIPTIONS: Prescription[] = [
  {
    id: "RX-A1B2C3D4",
    medication: "Amoxicilina 500mg",
    status: "active",
    dispensed: 2,
    totalDoses: 3,
    expiryDate: "2026-07-14",
    hash: "0xabcdef1234567890abcdef1234567890abcdef12",
    doctorName: "Dr. Carlos Méndez",
    license: "CM-12345",
  },
  {
    id: "RX-E5F6G7H8",
    medication: "Losartán 50mg",
    status: "partial",
    dispensed: 1,
    totalDoses: 6,
    expiryDate: "2026-08-20",
    hash: "0x9876543210fedcba9876543210fedcba98765432",
    doctorName: "Dra. Ana Rodríguez",
    license: "AR-67890",
  },
  {
    id: "RX-I9J0K1L2",
    medication: "Metformina 850mg",
    status: "used",
    dispensed: 3,
    totalDoses: 3,
    expiryDate: "2026-06-30",
    hash: "0x1111222233334444555566667777888899990000",
    doctorName: "Dr. Roberto Silva",
    license: "RS-54321",
  },
  {
    id: "RX-M3N4O5P6",
    medication: "Atorvastatina 20mg",
    status: "revoked",
    dispensed: 0,
    totalDoses: 2,
    expiryDate: "2026-07-10",
    hash: "0xaaaa0000bbbb1111cccc2222dddd3333eeee4444",
    doctorName: "Dra. Carmen López",
    license: "CL-99876",
  },
];

const MOCK_VACCINES: Vaccine[] = [
  { name: "COVID-19 Bivalente", date: "2025-10-15", status: "completed" },
  { name: "Influenza 2025", date: "2025-04-22", status: "completed" },
  { name: "Tétanos (dTpa)", date: "2023-06-10", status: "completed" },
  { name: "Influenza 2026", date: null, status: "pending" },
];

const MOCK_ACCESSES: DoctorAccess[] = [
  {
    id: "1",
    name: "Dr. Carlos Méndez",
    specialty: "Medicina General",
    accessDate: "2026-05-12",
    walletAddress: "GCMEND3XKP7QABD2NLMQWERTYU",
  },
  {
    id: "2",
    name: "Dra. Ana Rodríguez",
    specialty: "Cardiología",
    accessDate: "2026-03-08",
    walletAddress: "GRODRI7BVCXZLKJHGFDSAQWERT",
  },
  {
    id: "3",
    name: "Dr. Roberto Silva",
    specialty: "Endocrinología",
    accessDate: "2025-11-20",
    walletAddress: "GSILVA9MNBVCXZLKJHGFDSAQWE",
  },
];

const MOCK_LEAVES: MedicalLeave[] = [
  {
    id: "LIC-001",
    diagnosisType: "General",
    duration: "7 días",
    startDate: "2026-06-15",
    status: "completed",
    doctorName: "Dr. Carlos Méndez",
  },
  {
    id: "LIC-002",
    diagnosisType: "Ocupacional",
    duration: "3 días",
    startDate: "2026-07-01",
    status: "active",
    doctorName: "Dra. Ana Rodríguez",
  },
];

const ALLERGIES = ["Penicilina", "Ibuprofeno", "Sulfas"];

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
    label: "Parcialmente Dispensada",
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

const LICENSE_STATUS_CONFIG: Record<
  LicenseStatus,
  { label: string; className: string }
> = {
  active: {
    label: "Vigente",
    className: "bg-green-900/50 text-green-400 border border-green-700",
  },
  completed: {
    label: "Completada",
    className: "bg-gray-800 text-gray-400 border border-[#334155]",
  },
  pending: {
    label: "Pendiente",
    className: "bg-yellow-900/50 text-yellow-400 border border-yellow-700",
  },
};

function getDaysUntilExpiry(dateStr: string): number {
  const expiry = new Date(dateStr).getTime();
  const now = new Date().getTime();
  return Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PrescriptionCard({
  rx,
  onShowQR,
}: {
  rx: Prescription;
  onShowQR: (id: string) => void;
}) {
  const daysLeft = getDaysUntilExpiry(rx.expiryDate);
  const isExpiringSoon = daysLeft > 0 && daysLeft <= 7;
  const progressPct = Math.round((rx.dispensed / rx.totalDoses) * 100);
  const cfg = STATUS_CONFIG[rx.status];

  function copyHash() {
    navigator.clipboard
      .writeText(rx.hash)
      .then(() => toast.success("Hash copiado al portapapeles"))
      .catch(() => toast.error("No se pudo copiar"));
  }

  return (
    <div className="bg-[#1E293B] rounded-2xl p-5 border border-[#334155] hover:border-gray-600 transition-colors">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <h3 className="text-white font-semibold text-base leading-tight">
            {rx.medication}
          </h3>
          <p className="text-[#94A3B8] text-xs mt-0.5">
            {rx.doctorName} · Lic. {rx.license}
          </p>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${cfg.className}`}
        >
          {cfg.label}
        </span>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[#94A3B8] text-xs">Dispensaciones</span>
          <span className="text-gray-300 text-xs font-mono">
            {rx.dispensed}/{rx.totalDoses}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all ${
              rx.status === "revoked"
                ? "bg-red-500"
                : rx.status === "used"
                ? "bg-gray-500"
                : "bg-green-500"
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Expiry */}
      <div className="flex items-center gap-1.5 mb-4">
        {isExpiringSoon ? (
          <AlertTriangleIcon className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
        ) : (
          <ClockIcon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
        )}
        <span
          className={`text-xs ${
            isExpiringSoon ? "text-yellow-400 font-semibold" : "text-gray-400"
          }`}
        >
          Vence {formatDate(rx.expiryDate)}
          {isExpiringSoon && ` · ${daysLeft} día${daysLeft === 1 ? "" : "s"}`}
        </span>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-2 pt-3 border-t border-[#334155]">
        <button
          onClick={copyHash}
          className="font-mono text-xs text-gray-500 hover:text-green-400 transition-colors truncate text-left"
          title={rx.hash}
        >
          {rx.hash.slice(0, 10)}…{rx.hash.slice(-6)}
        </button>
        <button
          onClick={() => onShowQR(rx.id)}
          disabled={rx.status === "revoked" || rx.status === "used"}
          className="flex items-center justify-center gap-2 w-full min-h-[44px] px-4 py-3 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <QrIcon className="w-5 h-5" />
          Ver QR para dispensar
        </button>
      </div>
    </div>
  );
}

function QRModal({
  rxId,
  onClose,
}: {
  rxId: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-[#334155] rounded-t-3xl sm:rounded-2xl p-6 w-full sm:max-w-xs flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Código QR de Receta</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* QR placeholder grid */}
        <div className="bg-white p-4 rounded-xl mx-auto w-48 h-48 grid grid-cols-10 grid-rows-10 gap-0.5">
          {[
            1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0,
            1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0,
            1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1,
            1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0,
            1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1,
          ].map((bit, i) => (
            <div
              key={i}
              className={`${bit ? "bg-gray-900" : "bg-white"} rounded-sm`}
            />
          ))}
        </div>

        <p className="text-center mt-4 text-[#94A3B8] text-xs font-mono break-all">
          {rxId}
        </p>
        <p className="text-center mt-2 text-[#64748B] text-xs">
          Muestra este código en la farmacia para dispensar tu medicamento
        </p>
        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

// ─── Tab Content ──────────────────────────────────────────────────────────────

function TabRecetas() {
  const [qrRxId, setQrRxId] = useState<string | null>(null);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {MOCK_PRESCRIPTIONS.map((rx) => (
          <PrescriptionCard key={rx.id} rx={rx} onShowQR={setQrRxId} />
        ))}
      </div>
      {qrRxId && (
        <QRModal rxId={qrRxId} onClose={() => setQrRxId(null)} />
      )}
    </>
  );
}

function TabFicha() {
  return (
    <div className="space-y-6">
      {/* Privacy banner */}
      <div className="flex items-center gap-3 p-4 bg-green-900/20 border border-green-800 rounded-xl">
        <ShieldCheckIcon className="w-5 h-5 text-green-400 shrink-0" />
        <p className="text-green-300 text-sm">
          Tus datos están cifrados y bajo tu control. Zero PHI en blockchain.
        </p>
      </div>

      {/* Blood type */}
      <div className="bg-[#1E293B] rounded-2xl p-5 border border-[#334155]">
        <div className="flex items-center gap-2 mb-4">
          <HeartPulseIcon className="w-5 h-5 text-red-400" />
          <h3 className="text-white font-semibold">Tipo de Sangre</h3>
        </div>
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/40 border-2 border-red-500 text-red-300 text-2xl font-bold">
          O+
        </div>
      </div>

      {/* Allergies */}
      <div className="bg-[#1E293B] rounded-2xl p-5 border border-[#334155]">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangleIcon className="w-5 h-5 text-yellow-400" />
          <h3 className="text-white font-semibold">Alergias Conocidas</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {ALLERGIES.map((allergy) => (
            <span
              key={allergy}
              className="px-3 py-1.5 bg-yellow-900/30 border border-yellow-700 text-yellow-300 text-sm rounded-full font-medium"
            >
              {allergy}
            </span>
          ))}
          <button
            onClick={() => toast.info("Función disponible próximamente")}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 border border-gray-600 text-gray-300 text-sm rounded-full transition-colors"
          >
            + Agregar
          </button>
        </div>
      </div>

      {/* Vaccine timeline */}
      <div className="bg-[#1E293B] rounded-2xl p-5 border border-[#334155]">
        <div className="flex items-center gap-2 mb-4">
          <SyringeIcon className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-semibold">Historial de Vacunas</h3>
        </div>
        <div className="space-y-3">
          {MOCK_VACCINES.map((vaccine, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  vaccine.status === "completed"
                    ? "bg-green-900/50 border border-green-600"
                    : "bg-gray-700 border border-gray-600"
                }`}
              >
                {vaccine.status === "completed" ? (
                  <CheckIcon className="w-4 h-4 text-green-400" />
                ) : (
                  <ClockIcon className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    vaccine.status === "completed"
                      ? "text-white"
                      : "text-gray-400"
                  }`}
                >
                  {vaccine.name}
                </p>
                <p className="text-xs text-gray-500">
                  {vaccine.date ? formatDate(vaccine.date) : "Pendiente"}
                </p>
              </div>
              {vaccine.status === "pending" && (
                <span className="text-xs text-yellow-400 font-semibold">
                  Pendiente
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabAccesos() {
  const [accesses, setAccesses] = useState<DoctorAccess[]>(MOCK_ACCESSES);
  const [newAddress, setNewAddress] = useState("");

  function revokeAccess(id: string) {
    setAccesses((prev) => prev.filter((a) => a.id !== id));
    toast.success("Acceso revocado correctamente");
  }

  function addAccess() {
    if (!newAddress.trim()) {
      toast.error("Ingresa una dirección de wallet");
      return;
    }
    toast.success("Solicitud de acceso enviada");
    setNewAddress("");
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#1E293B] rounded-2xl border border-[#334155] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#334155]">
          <h3 className="text-white font-semibold">Médicos con acceso</h3>
          <p className="text-[#94A3B8] text-xs mt-0.5">
            {accesses.length} médico{accesses.length !== 1 ? "s" : ""} pueden
            ver tu ficha clínica
          </p>
        </div>
        {accesses.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            Ningún médico tiene acceso actualmente.
          </div>
        ) : (
          <ul className="divide-y divide-[#334155]">
            {accesses.map((doctor) => (
              <li
                key={doctor.id}
                className="flex items-center gap-3 px-5 py-4 hover:bg-[#253046]/60 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-green-900/40 border border-green-700 flex items-center justify-center shrink-0">
                  <UserIcon className="w-4.5 h-4.5 text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{doctor.name}</p>
                  <p className="text-[#94A3B8] text-xs">
                    {doctor.specialty} · Acceso desde{" "}
                    {formatDate(doctor.accessDate)}
                  </p>
                  <p className="text-gray-600 text-xs font-mono truncate">
                    {doctor.walletAddress.slice(0, 16)}…
                  </p>
                </div>
                <button
                  onClick={() => revokeAccess(doctor.id)}
                  className="px-3 py-1.5 bg-red-900/30 hover:bg-red-900/60 border border-red-800 text-red-400 text-xs font-semibold rounded-lg transition-colors shrink-0"
                >
                  Revocar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add new access */}
      <div className="bg-[#1E293B] rounded-2xl p-5 border border-[#334155]">
        <h3 className="text-white font-semibold mb-3">Conceder nuevo acceso</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            placeholder="Wallet address del médico (G...)"
            className="flex-1 bg-gray-900 border border-[#334155] focus:border-green-500 text-white text-sm rounded-xl px-4 py-2.5 outline-none placeholder-gray-600 transition-colors"
          />
          <button
            onClick={addAccess}
            className="px-4 py-2.5 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-xl transition-colors shrink-0"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

function TabLicencias() {
  return (
    <div className="space-y-4">
      {MOCK_LEAVES.length === 0 ? (
        <div className="bg-[#1E293B] rounded-2xl p-10 border border-[#334155] text-center text-gray-500">
          No tienes licencias médicas registradas.
        </div>
      ) : (
        MOCK_LEAVES.map((leave) => {
          const cfg = LICENSE_STATUS_CONFIG[leave.status];
          return (
            <div
              key={leave.id}
              className="bg-[#1E293B] rounded-2xl p-5 border border-[#334155]"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white font-semibold">
                      Licencia Médica
                    </span>
                    <span className="text-[#64748B] text-xs font-mono">
                      {leave.id}
                    </span>
                  </div>
                  <p className="text-[#94A3B8] text-sm">
                    {leave.doctorName}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${cfg.className}`}
                >
                  {cfg.label}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gray-900 rounded-xl p-3 text-center">
                  <p className="text-[#64748B] text-xs mb-0.5">Tipo</p>
                  <p className="text-white text-sm font-semibold">
                    {leave.diagnosisType}
                  </p>
                </div>
                <div className="bg-gray-900 rounded-xl p-3 text-center">
                  <p className="text-[#64748B] text-xs mb-0.5">Duración</p>
                  <p className="text-white text-sm font-semibold">
                    {leave.duration}
                  </p>
                </div>
                <div className="bg-gray-900 rounded-xl p-3 text-center">
                  <p className="text-[#64748B] text-xs mb-0.5">Inicio</p>
                  <p className="text-white text-sm font-semibold">
                    {formatDate(leave.startDate)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => toast.info("Descarga disponible próximamente")}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-400 transition-colors"
              >
                <DownloadIcon className="w-4 h-4" />
                Descargar PDF
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}

function TabDolor() {
  return (
    <div className="space-y-4">
      <a
        href="/patient/pain-diary"
        className="block bg-[#1E293B] rounded-2xl p-6 border border-[#334155] hover:border-green-600 transition-colors group"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-green-900/30 border border-green-800 flex items-center justify-center shrink-0 group-hover:bg-green-900/50 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5" className="w-7 h-7">
              <ellipse cx="12" cy="5" rx="3" ry="3" />
              <path d="M8 22v-5a4 4 0 0 1 8 0v5" />
              <path d="M6 10l1.5 4h9L18 10" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-base">Diario de Dolor</h3>
            <p className="text-[#94A3B8] text-sm mt-0.5">
              Registra y monitorea tu dolor diariamente
            </p>
          </div>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-5 h-5 text-gray-500 group-hover:text-green-400 transition-colors shrink-0"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </a>
      <div className="bg-[#1E293B]/50 rounded-xl p-4 border border-[#334155]">
        <p className="text-[#94A3B8] text-sm text-center">
          Tu médico puede ver el historial de dolor en tiempo real. Registra diariamente para un mejor seguimiento.
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type TabId = "recetas" | "ficha" | "accesos" | "licencias" | "dolor";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "recetas", label: "Mis Recetas", icon: <PillIcon /> },
  { id: "ficha", label: "Mi Ficha", icon: <FichaIcon /> },
  { id: "accesos", label: "Mis Accesos", icon: <LockIcon /> },
  { id: "licencias", label: "Mis Licencias", icon: <CalendarIcon /> },
  {
    id: "dolor",
    label: "Diario de Dolor",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="12" cy="5" rx="3" ry="3" />
        <path d="M8 22v-5a4 4 0 0 1 8 0v5" />
        <path d="M6 10l1.5 4h9L18 10" />
        <path d="M2 13h2m16 0h2" />
      </svg>
    ),
  },
];

export default function PatientDashboard() {
  const { walletAddress } = usePasskey();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("recetas");

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
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
              <p className="text-[#64748B] text-xs">Portal Paciente</p>
            </div>
          </div>
        </div>

        {/* Wallet address */}
        <div className="px-6 py-4 border-b border-[#334155]">
          <p className="text-[#64748B] text-xs mb-1">Wallet conectada</p>
          <p className="text-green-400 text-xs font-mono">
            {walletAddress
              ? `${walletAddress.slice(0, 8)}…${walletAddress.slice(-6)}`
              : "No conectado"}
          </p>
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
              <span
                className={`w-4 h-4 ${
                  activeTab === tab.id ? "text-white" : "text-gray-500"
                }`}
              >
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between">
          <p className="text-gray-600 text-xs">
            Powered by Stellar Network
          </p>
          <button
            onClick={() => router.push("/patient/settings")}
            className="text-gray-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-[#253046]"
            title="Configuración"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
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
            </div>
            <div className="flex items-center gap-3">
              <p className="text-[#64748B] text-xs font-mono">
                {walletAddress
                  ? `${walletAddress.slice(0, 6)}…`
                  : "No conectado"}
              </p>
              <button
                onClick={() => router.push("/patient/settings")}
                className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-[#1E293B]"
                aria-label="Configuración"
              >
                <SettingsIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Desktop page header */}
        <div className="hidden md:block px-8 pt-8 pb-6 border-b border-[#334155]">
          <h1 className="text-2xl font-bold text-white">
            {TABS.find((t) => t.id === activeTab)?.label}
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            Gestiona tu información médica de forma privada y segura
          </p>
        </div>

        {/* Tab content */}
        <div className="px-4 md:px-8 py-6">
          {activeTab === "recetas" && <TabRecetas />}
          {activeTab === "ficha" && <TabFicha />}
          {activeTab === "accesos" && <TabAccesos />}
          {activeTab === "licencias" && <TabLicencias />}
          {activeTab === "dolor" && <TabDolor />}
        </div>
      </main>

      {/* ── Mobile bottom nav ─────────────────────────────────────────── */}
      <nav className="fixed bottom-0 inset-x-0 md:hidden bg-[#1E293B]/95 backdrop-blur-sm border-t border-[#334155] z-40">
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
                {tab.label.split(" ")[1] ?? tab.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
