// Copyright © 2026 Browns Studio
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePasskey } from "../../hooks/usePasskey";
import { SkeletonCard } from "../../components/ui/SkeletonCard";
import PatientOnboarding from "../../components/PatientOnboarding";
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

type PrescriptionStatus = "active" | "partial" | "used" | "revoked" | "expired";
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
    id: "RX-7A3F2E1B",
    medication: "Tramadol 50mg — control del dolor crónico",
    status: "active",
    dispensed: 0,
    totalDoses: 3,
    expiryDate: "2026-08-10",
    hash: "0x4f8e2a1b3c9d7e6f5a2b8c1d4e3f7a9b0c5d2e1f",
    doctorName: "Dra. María González",
    license: "MG-47823",
  },
  {
    id: "RX-C8D9E1F2",
    medication: "Pregabalina 75mg — neuropatía",
    status: "expired",
    dispensed: 2,
    totalDoses: 2,
    expiryDate: "2026-07-08",
    hash: "0xb2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1",
    doctorName: "Dr. Carlos Soto",
    license: "CS-29341",
  },
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
  expired: {
    label: "Vencida",
    className: "bg-orange-900/50 text-orange-400 border border-orange-700",
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
          <p className="text-[#94A3B8] text-xs mt-0.5 flex items-center gap-1.5 flex-wrap">
            <span>{rx.doctorName} · Lic. {rx.license}</span>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-green-900/40 border border-green-700 text-green-400 text-[10px] font-semibold rounded-full shrink-0">
              ✓ Firma verificada
            </span>
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
          disabled={rx.status === "revoked" || rx.status === "used" || rx.status === "expired"}
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

        {/* QR real escaneable */}
        <div className="flex justify-center my-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=192x192&data=${encodeURIComponent(`https://trustleaf-demo.vercel.app/verify/${rxId}`)}&bgcolor=ffffff&color=0f172a&margin=8`}
            alt={`QR para receta ${rxId}`}
            width={192}
            height={192}
            className="rounded-xl"
          />
        </div>

        <p className="text-center mt-2 text-[#94A3B8] text-xs font-mono break-all">
          {rxId}
        </p>
        <p className="text-center mt-1 text-[#64748B] text-xs">
          Escanea para verificar esta receta en tiempo real
        </p>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`Aquí está mi receta verificada en blockchain:\nhttps://trustleaf-demo.vercel.app/verify/${rxId}\n\nEscaneame el QR o abre el link para verificar.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
        >
          <span>📱</span>
          <span>Compartir por WhatsApp</span>
        </a>
        <button
          onClick={onClose}
          className="w-full mt-3 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

// ─── Tab Content ──────────────────────────────────────────────────────────────

function PainSummaryBanner({ onNavigate }: { onNavigate: () => void }) {
  const todayLevel = 5;
  const emoji = todayLevel <= 3 ? "😊" : todayLevel <= 6 ? "😟" : "😭";
  const color = todayLevel <= 3 ? "text-green-400" : todayLevel <= 6 ? "text-yellow-400" : "text-red-400";
  const bg = todayLevel <= 3 ? "bg-green-900/20 border-green-800/50" : todayLevel <= 6 ? "bg-yellow-900/20 border-yellow-800/50" : "bg-red-900/20 border-red-800/50";
  return (
    <button
      onClick={onNavigate}
      className={`w-full flex items-center gap-3 p-3.5 rounded-xl border mb-4 text-left ${bg}`}
    >
      <span className="text-2xl">{emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold">Diario de Dolor — hoy</p>
        <p className={`text-xs font-bold ${color}`}>Nivel: {todayLevel}/10 · Semana: 6.2 promedio</p>
      </div>
      <span className="text-[#64748B] text-xs font-medium shrink-0">Ver →</span>
    </button>
  );
}

function TabRecetas({ onNavigateToDolor }: { onNavigateToDolor: () => void }) {
  const [qrRxId, setQrRxId] = useState<string | null>(null);

  const firstActive = MOCK_PRESCRIPTIONS.find((rx) => rx.status === "active");

  return (
    <>
      {/* Pain diary quick summary */}
      <PainSummaryBanner onNavigate={onNavigateToDolor} />

      {/* Primary CTA — Compartir con médico */}
      <button
        onClick={() => {
          if (firstActive) setQrRxId(firstActive.id);
        }}
        className="w-full flex items-center justify-center gap-2.5 min-h-[56px] px-6 py-4 bg-green-600 hover:bg-green-500 active:bg-green-700 text-white text-base font-bold rounded-2xl transition-colors shadow-lg shadow-green-900/30 mb-6"
      >
        <QrIcon className="w-5 h-5 shrink-0" />
        Compartir historial con médico →
      </button>

      {/* Section heading — visible above the fold on both mobile and desktop */}
      <div className="mb-5">
        <h2 className="text-xl font-bold text-white">Mi Historial</h2>
        <p className="text-[#94A3B8] text-sm mt-0.5">
          Tus recetas emitidas a través de TrustLeaf
        </p>
      </div>

      {MOCK_PRESCRIPTIONS.length === 0 ? (
        <div className="bg-[#1E293B] rounded-2xl p-10 border border-[#334155] text-center">
          <PillIcon />
          <p className="text-white font-semibold mt-4 mb-1">Sin recetas aún</p>
          <p className="text-[#94A3B8] text-sm">
            Aún no tienes recetas. Tu médico puede emitirte una desde TrustLeaf.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {MOCK_PRESCRIPTIONS.map((rx) => (
            <PrescriptionCard key={rx.id} rx={rx} onShowQR={setQrRxId} />
          ))}
        </div>
      )}

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
  const [newCode, setNewCode] = useState("");
  const [grantSuccess, setGrantSuccess] = useState(false);

  function revokeAccess(id: string) {
    setAccesses((prev) => prev.filter((a) => a.id !== id));
    toast.success("Acceso revocado correctamente");
  }

  function addAccess() {
    if (!newCode.trim()) {
      toast.error("Ingresa el nombre, RUT o código TrustLeaf de tu médico");
      return;
    }
    setGrantSuccess(true);
    toast.success("Solicitud enviada. Tu médico recibirá una notificación.");
    setNewCode("");
    setTimeout(() => setGrantSuccess(false), 4000);
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
        <h3 className="text-white font-semibold mb-1">Conceder acceso a un médico</h3>
        <p className="text-[#94A3B8] text-xs mb-4">
          Ingresa el nombre, RUT o código TrustLeaf que tu médico te proporcionó.
        </p>

        {grantSuccess ? (
          <div className="flex items-center gap-3 p-4 bg-green-900/30 border border-green-700 rounded-xl">
            <CheckIcon className="w-5 h-5 text-green-400 shrink-0" />
            <p className="text-green-300 text-sm">
              Solicitud enviada. Tu médico recibirá una notificación para confirmar el acceso.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <input
                type="text"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="Nombre del médico, RUT o código TrustLeaf"
                className="flex-1 bg-gray-900 border border-[#334155] focus:border-green-500 text-white text-base rounded-xl px-4 py-2.5 outline-none placeholder-gray-600 transition-colors"
              />
              <button
                onClick={addAccess}
                className="w-full sm:w-auto px-4 py-2.5 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-xl transition-colors min-h-[48px]"
              >
                Agregar
              </button>
            </div>
            <p className="text-[#64748B] text-xs flex items-start gap-1.5">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
              Tu médico debe darte su código TrustLeaf. Sin él, nadie puede acceder a tu ficha.
            </p>
          </>
        )}
      </div>

      {/* Face ID / security note */}
      <div className="flex items-start gap-3 p-4 bg-[#1E293B]/60 border border-[#334155] rounded-xl">
        <ShieldCheckIcon className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
        <p className="text-[#94A3B8] text-xs leading-relaxed">
          <span className="text-white font-medium">Firma segura con Face ID.</span>{" "}
          Usamos Face ID para autorizar cambios de acceso de forma segura. No necesitas contraseña ni billetera crypto.
        </p>
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

const WEEKLY_PAIN_DATA = [
  { day: "Lun", level: 7 },
  { day: "Mar", level: 6 },
  { day: "Mié", level: 8 },
  { day: "Jue", level: 5 },
  { day: "Vie", level: 6 },
  { day: "Sáb", level: 4 },
  { day: "Dom", level: 7 },
];

const PAIN_AREAS = [
  "Espalda baja",
  "Cabeza/migraña",
  "Articulaciones",
  "Abdomen",
  "Cuello",
  "Otro",
];

const ACTIVE_PRESCRIPTIONS = ["Tramadol 50mg", "Pregabalina 75mg"];

const SYMPTOM_OPTIONS = [
  "Inflamación",
  "Rigidez",
  "Hormigueo",
  "Náuseas",
  "Fatiga",
  "Insomnio",
  "Otro",
];

const PAIN_INSIGHTS = [
  "📈 Tu dolor aumenta los miércoles — patrón de 3 semanas",
  "💊 Los días que tomaste Tramadol, el dolor bajó en promedio 2 puntos",
  "😴 Los días con insomnio registrado, el dolor del día siguiente fue 1.8 puntos mayor",
];

function getPainEmoji(level: number): string {
  if (level <= 2) return "😊";
  if (level <= 5) return "😐";
  if (level <= 8) return "😣";
  return "😭";
}

function getBarColor(level: number): string {
  if (level <= 3) return "#22C55E";
  if (level <= 6) return "#EAB308";
  return "#EF4444";
}

function TabDiarioDolor() {
  const [painLevel, setPainLevel] = useState(5);
  const [area, setArea] = useState("");
  const [meds, setMeds] = useState<string[]>([]);
  const [otherMed, setOtherMed] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  function toggleMed(med: string) {
    setMeds((prev) =>
      prev.includes(med) ? prev.filter((m) => m !== med) : [...prev, med]
    );
  }

  function toggleSymptom(sym: string) {
    setSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  }

  function handleSave() {
    setSaveState("saving");
    setTimeout(() => setSaveState("saved"), 1500);
    setTimeout(() => setSaveState("idle"), 5000);
  }

  const painColor =
    painLevel <= 3
      ? "bg-green-600"
      : painLevel <= 6
      ? "bg-yellow-600"
      : "bg-red-600";

  return (
    <div className="space-y-6">
      {/* ── Daily entry form ────────────────────────────────────────── */}
      <div className="bg-[#1E293B] rounded-2xl p-5 border border-[#334155]">
        <h2 className="text-white font-bold text-lg mb-5">Registro de hoy</h2>

        {/* Pain level slider */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[#94A3B8] text-sm font-medium">
              Nivel de dolor
            </label>
            <span className="text-2xl leading-none">
              {getPainEmoji(painLevel)}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={0}
              max={10}
              value={painLevel}
              onChange={(e) => setPainLevel(Number(e.target.value))}
              className="flex-1 accent-green-500 cursor-pointer"
            />
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 transition-colors ${painColor}`}
            >
              {painLevel}
            </div>
          </div>
          <div className="flex justify-between text-xs text-[#64748B] mt-1 px-1">
            <span>😊 Sin dolor</span>
            <span>😭 Insoportable</span>
          </div>
        </div>

        {/* Affected area dropdown */}
        <div className="mb-5">
          <label className="block text-[#94A3B8] text-sm font-medium mb-2">
            Zona afectada
          </label>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full bg-gray-900 border border-[#334155] focus:border-green-500 text-white text-sm rounded-xl px-4 py-3 outline-none transition-colors"
          >
            <option value="">Selecciona una zona…</option>
            {PAIN_AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        {/* Medications checkboxes */}
        <div className="mb-5">
          <label className="block text-[#94A3B8] text-sm font-medium mb-2">
            Medicamentos tomados hoy
          </label>
          <div className="space-y-2.5">
            {ACTIVE_PRESCRIPTIONS.map((med) => (
              <button
                key={med}
                onClick={() => toggleMed(med)}
                className="flex items-center gap-3 w-full text-left group"
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                    meds.includes(med)
                      ? "bg-green-600 border-green-500"
                      : "border-[#334155] group-hover:border-green-700"
                  }`}
                >
                  {meds.includes(med) && (
                    <CheckIcon className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="text-white text-sm">{med}</span>
              </button>
            ))}
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded border-2 border-[#334155] shrink-0" />
              <input
                type="text"
                value={otherMed}
                onChange={(e) => setOtherMed(e.target.value)}
                placeholder="Otro medicamento…"
                className="flex-1 bg-transparent border-b border-[#334155] focus:border-green-500 text-white text-sm py-1 outline-none placeholder-gray-600 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Symptoms multi-select chips */}
        <div className="mb-5">
          <label className="block text-[#94A3B8] text-sm font-medium mb-2">
            Síntomas
          </label>
          <div className="flex flex-wrap gap-2">
            {SYMPTOM_OPTIONS.map((sym) => (
              <button
                key={sym}
                onClick={() => toggleSymptom(sym)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  symptoms.includes(sym)
                    ? "bg-green-600/30 border-green-500 text-green-300"
                    : "bg-gray-800 border-[#334155] text-gray-400 hover:border-gray-500 hover:text-gray-300"
                }`}
              >
                {sym}
              </button>
            ))}
          </div>
        </div>

        {/* Notes textarea */}
        <div className="mb-6">
          <label className="block text-[#94A3B8] text-sm font-medium mb-2">
            Notas <span className="text-[#64748B] font-normal">(opcional)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="¿Algo que quieras recordar de hoy?"
            rows={3}
            className="w-full bg-gray-900 border border-[#334155] focus:border-green-500 text-white text-sm rounded-xl px-4 py-3 outline-none placeholder-gray-600 transition-colors resize-none"
          />
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saveState !== "idle"}
          className={`w-full flex items-center justify-center gap-2 min-h-[52px] px-6 py-3 rounded-2xl font-bold text-base transition-all ${
            saveState === "saved"
              ? "bg-green-700 text-white cursor-default"
              : saveState === "saving"
              ? "bg-gray-700 text-gray-300 cursor-wait"
              : "bg-green-600 hover:bg-green-500 active:bg-green-700 text-white"
          }`}
        >
          {saveState === "saving" && (
            <span className="inline-block animate-spin">⏳</span>
          )}
          {saveState === "idle" && "Registrar en historial"}
          {saveState === "saving" && "Guardando en blockchain…"}
          {saveState === "saved" && "✅ Entrada registrada"}
        </button>
      </div>

      {/* ── Pain history bar chart ───────────────────────────────────── */}
      <div className="bg-[#1E293B] rounded-2xl p-5 border border-[#334155]">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-white font-semibold">Últimos 7 días</h3>
        </div>
        <p className="text-[#94A3B8] text-sm mb-4">
          Promedio últimos 7 días:{" "}
          <span className="text-white font-bold">6.2/10</span>
        </p>

        {/* Bar chart */}
        <div className="flex items-end gap-2" style={{ height: "120px" }}>
          {WEEKLY_PAIN_DATA.map(({ day, level }) => (
            <div
              key={day}
              className="flex-1 flex flex-col items-center gap-1"
              style={{ height: "100%" }}
            >
              <span className="text-[#64748B] text-xs font-mono shrink-0">
                {level}
              </span>
              <div
                className="flex-1 w-full flex items-end"
              >
                <div
                  className="w-full rounded-t-lg transition-all"
                  style={{
                    height: `${(level / 10) * 100}%`,
                    backgroundColor: getBarColor(level),
                    minHeight: "4px",
                  }}
                />
              </div>
              <span className="text-[#94A3B8] text-xs shrink-0">{day}</span>
            </div>
          ))}
        </div>

        {/* Color legend */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#334155]">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-green-500" />
            <span className="text-[#64748B] text-xs">0–3</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-yellow-500" />
            <span className="text-[#64748B] text-xs">4–6</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-red-500" />
            <span className="text-[#64748B] text-xs">7–10</span>
          </div>
        </div>
      </div>

      {/* ── Insights ────────────────────────────────────────────────── */}
      <div className="bg-[#1E293B] rounded-2xl p-5 border border-[#334155]">
        <h3 className="text-white font-semibold mb-4">Insights</h3>
        <div className="space-y-3">
          {PAIN_INSIGHTS.map((insight, i) => (
            <div
              key={i}
              className="p-3 bg-gray-900/60 rounded-xl border border-[#334155]"
            >
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                {insight}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Share with doctor ────────────────────────────────────────── */}
      <div className="bg-[#1E293B] rounded-2xl p-5 border border-[#334155]">
        <h3 className="text-white font-semibold mb-2">Compartir con tu médico</h3>
        <p className="text-[#94A3B8] text-sm mb-4">
          Envía el resumen de los últimos 7 días directamente por WhatsApp antes de tu próxima consulta.
        </p>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(
            "📓 *Reporte Diario de Dolor — TrustLeaf*\n\n" +
            "Período: 05–11 Jul 2026\n" +
            "Promedio de dolor: *6.2/10* 😟\n\n" +
            "📊 *Historial semanal:*\n" +
            "Lun: 7 | Mar: 6 | Mié: 8 | Jue: 5 | Vie: 6 | Sáb: 4 | Dom: 7\n\n" +
            "💊 *Medicamentos activos:*\n" +
            "• Tramadol 50mg — 1 comp cada 8h\n" +
            "• Pregabalina 75mg — 1 cáp cada 12h\n\n" +
            "🔍 *Patrones detectados:*\n" +
            "• Dolor más intenso los miércoles\n" +
            "• Tramadol reduce dolor en ~2 puntos\n" +
            "• Correlación con insomnio\n\n" +
            "✅ Registro verificado en Stellar Blockchain\n" +
            "🔗 Ver ficha completa: trustleaf-demo.vercel.app"
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 w-full py-4 bg-[#25D366] hover:bg-[#1ebe57] active:bg-[#17a34a] text-white font-bold rounded-2xl transition-colors text-sm"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Enviar reporte por WhatsApp
        </a>
      </div>

      {/* ── Integration note ─────────────────────────────────────────── */}
      <div className="flex items-start gap-3 p-4 bg-green-900/10 border border-green-800/50 rounded-xl">
        <ShieldCheckIcon className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
        <p className="text-[#94A3B8] text-sm leading-relaxed">
          Estas entradas se añaden automáticamente a tu ficha clínica
          verificada. Tu médico puede verlas en su próxima consulta.
        </p>
      </div>
    </div>
  );
}

// ─── Timeline Data & Component ───────────────────────────────────────────────

type TimelineEventType = "prescription" | "consultation" | "test" | "diagnosis";

interface TimelineEvent {
  date: string;
  type: TimelineEventType;
  description: string;
  detail: string;
  statusLabel?: string;
  statusActive?: boolean;
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    date: "2026-07-11",
    type: "prescription",
    description: "Tramadol 50mg emitido",
    detail: "Dra. María González",
    statusLabel: "Activo",
    statusActive: true,
  },
  {
    date: "2026-06-15",
    type: "prescription",
    description: "Pregabalina 75mg emitido",
    detail: "Dr. Carlos Soto",
    statusLabel: "Vencido",
    statusActive: false,
  },
  {
    date: "2026-05-03",
    type: "consultation",
    description: "Consulta de dolor crónico",
    detail: "Hospital Clínico U. de Chile",
  },
  {
    date: "2026-03-12",
    type: "test",
    description: "Examen de sangre",
    detail: "Clínica Las Condes",
  },
  {
    date: "2026-01-20",
    type: "diagnosis",
    description: "Diagnóstico: Fibromialgia",
    detail: "Dr. Roberto Vega",
  },
];

const TIMELINE_TYPE_CONFIG: Record<
  TimelineEventType,
  { dotClass: string; iconColor: string; label: string; iconPath: React.ReactNode }
> = {
  prescription: {
    dotClass: "bg-teal-500 border-teal-400",
    iconColor: "text-teal-400",
    label: "Receta",
    iconPath: (
      <>
        <path d="M10.5 3.5a5 5 0 0 1 7 7l-8 8a5 5 0 0 1-7-7l8-8z" />
        <line x1="8.5" y1="8.5" x2="15.5" y2="15.5" />
      </>
    ),
  },
  consultation: {
    dotClass: "bg-blue-500 border-blue-400",
    iconColor: "text-blue-400",
    label: "Consulta",
    iconPath: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
  },
  test: {
    dotClass: "bg-purple-500 border-purple-400",
    iconColor: "text-purple-400",
    label: "Examen",
    iconPath: (
      <>
        <path d="M9 3H5a2 2 0 0 0-2 2v4" />
        <path d="M15 3h4a2 2 0 0 1 2 2v4" />
        <path d="M3 15v4a2 2 0 0 0 2 2h4" />
        <path d="M15 21h4a2 2 0 0 0 2-2v-4" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  },
  diagnosis: {
    dotClass: "bg-orange-500 border-orange-400",
    iconColor: "text-orange-400",
    label: "Diagnóstico",
    iconPath: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  },
};

function TabTimeline() {
  return (
    <div className="space-y-2">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-white">Historial Clínico</h2>
        <p className="text-[#94A3B8] text-sm mt-0.5">
          Todos tus eventos médicos en orden cronológico
        </p>
      </div>

      <div className="relative">
        {/* Vertical connecting line */}
        <div className="absolute left-[5.25rem] top-4 bottom-4 w-px bg-[#334155]" />

        <div className="space-y-0">
          {TIMELINE_EVENTS.map((event, idx) => {
            const cfg = TIMELINE_TYPE_CONFIG[event.type];
            return (
              <div key={idx} className="flex gap-4 items-start py-4">
                {/* Date column */}
                <div className="w-20 shrink-0 text-right">
                  <p className="text-[#64748B] text-xs font-mono leading-tight">
                    {formatDate(event.date)}
                  </p>
                </div>

                {/* Dot */}
                <div className="relative z-10 shrink-0 mt-0.5">
                  <div className={`w-4 h-4 rounded-full border-2 ${cfg.dotClass} shadow-lg`} />
                </div>

                {/* Content card */}
                <div className="flex-1 bg-[#1E293B] rounded-xl p-3.5 border border-[#334155] hover:border-gray-500 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`w-3.5 h-3.5 shrink-0 ${cfg.iconColor}`}
                        >
                          {cfg.iconPath}
                        </svg>
                        <span className={`text-xs font-medium ${cfg.iconColor}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-white text-sm font-semibold leading-snug">
                        {event.description}
                      </p>
                      <p className="text-[#94A3B8] text-xs mt-0.5">{event.detail}</p>
                    </div>
                    {event.statusLabel && (
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                          event.statusActive
                            ? "bg-green-900/50 text-green-400 border border-green-700"
                            : "bg-orange-900/50 text-orange-400 border border-orange-700"
                        }`}
                      >
                        {event.statusActive ? "✅" : "⏰"} {event.statusLabel}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Emergency QR Component ───────────────────────────────────────────────────

function TabEmergencia() {
  const [showQR, setShowQR] = useState(false);

  return (
    <div className="space-y-6">
      {/* Warning banner */}
      <div className="flex items-start gap-3 p-4 bg-red-900/20 border border-red-800 rounded-xl">
        <AlertTriangleIcon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <p className="text-red-300 text-sm leading-relaxed">
          <span className="font-semibold text-red-200">Solo para emergencias.</span>{" "}
          Este QR permite acceso de solo lectura a tu información médica vital. Compártelo únicamente con equipos de emergencia.
        </p>
      </div>

      {/* Big pulsing CTA button */}
      <div className="flex justify-center py-4">
        <button
          onClick={() => setShowQR(true)}
          className="relative flex flex-col items-center gap-3 px-10 py-8 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white rounded-3xl shadow-2xl shadow-red-900/50 transition-colors"
          style={{ minWidth: 220 }}
        >
          <span className="absolute inset-0 rounded-3xl animate-ping bg-red-500 opacity-20 pointer-events-none" />
          <span className="absolute inset-0 rounded-3xl ring-2 ring-red-400 opacity-40 pointer-events-none" />
          <span className="text-4xl">🚨</span>
          <span className="text-xl font-bold tracking-wide">QR de Emergencia</span>
          <span className="text-red-200 text-sm font-medium">Toca para mostrar</span>
        </button>
      </div>

      {/* Emergency info cards */}
      <div className="bg-[#1E293B] rounded-2xl p-5 border border-[#334155]">
        <h3 className="text-white font-semibold mb-4">Información visible en emergencia</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-900/40 border border-red-700 flex items-center justify-center shrink-0">
              <HeartPulseIcon className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <p className="text-[#94A3B8] text-xs">Grupo sanguíneo</p>
              <p className="text-white text-sm font-semibold">O+</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-yellow-900/40 border border-yellow-700 flex items-center justify-center shrink-0">
              <AlertTriangleIcon className="w-4 h-4 text-yellow-400" />
            </div>
            <div>
              <p className="text-[#94A3B8] text-xs">Alergias</p>
              <p className="text-white text-sm font-semibold">Penicilina, AINEs</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-teal-900/40 border border-teal-700 flex items-center justify-center shrink-0">
              <PillIcon className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <p className="text-[#94A3B8] text-xs">Medicamentos actuales</p>
              <p className="text-white text-sm font-semibold">Tramadol 50mg, Pregabalina 75mg</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-900/40 border border-blue-700 flex items-center justify-center shrink-0">
              <UserIcon className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-[#94A3B8] text-xs">Contacto de emergencia</p>
              <p className="text-white text-sm font-semibold">+56 9 1234 5678</p>
            </div>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {showQR && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 sm:p-4"
          onClick={() => setShowQR(false)}
        >
          <div
            className="bg-gray-900 border border-red-800 rounded-t-3xl sm:rounded-2xl p-6 w-full sm:max-w-sm flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🚨</span>
                <h3 className="text-white font-bold text-lg">QR de Emergencia</h3>
              </div>
              <button onClick={() => setShowQR(false)} className="text-gray-400 hover:text-white transition-colors">
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            <p className="text-red-300 text-xs mb-4">
              Acceso de solo lectura · Juan Pérez · O+ · Penicilina, AINEs
            </p>

            {/* QR real escaneable — abre la página de emergencia */}
            <div className="flex justify-center my-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent("https://trustleaf-demo.vercel.app/emergency/12345678-9")}&bgcolor=ffffff&color=7f1d1d&margin=8`}
                alt="QR de emergencia"
                width={220}
                height={220}
                className="rounded-xl"
              />
            </div>

            <p className="text-center mt-2 text-[#94A3B8] text-xs font-mono">
              trustleaf-demo.vercel.app/emergency/12345678-9
            </p>
            <p className="text-center mt-1 text-[#64748B] text-xs">
              Escanea para ver información vital en tiempo real
            </p>
            <a
              href="https://trustleaf-demo.vercel.app/emergency/12345678-9"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full mt-4 bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              <span>🔗</span>
              <span>Abrir página de emergencia</span>
            </a>
            <button
              onClick={() => setShowQR(false)}
              className="w-full mt-3 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type TabId = "recetas" | "ficha" | "accesos" | "licencias" | "dolor" | "timeline" | "emergencia";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "recetas", label: "Mis Recetas", icon: <PillIcon /> },
  { id: "ficha", label: "Mi Ficha", icon: <FichaIcon /> },
  { id: "accesos", label: "Mis Accesos", icon: <LockIcon /> },
  { id: "licencias", label: "Mis Licencias", icon: <CalendarIcon /> },
  {
    id: "dolor",
    label: "📓 Diario",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="2" width="14" height="20" rx="2" />
        <path d="M8 6h8M8 10h8M8 14h5" />
      </svg>
    ),
  },
  {
    id: "timeline",
    label: "Historial",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="12" y1="2" x2="12" y2="22" />
        <circle cx="12" cy="6" r="2" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
        <circle cx="12" cy="18" r="2" fill="currentColor" stroke="none" />
        <line x1="12" y1="6" x2="18" y2="6" />
        <line x1="12" y1="12" x2="18" y2="12" />
        <line x1="12" y1="18" x2="18" y2="18" />
      </svg>
    ),
  },
  {
    id: "emergencia",
    label: "🚨 Emergencia",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
];

export default function PatientDashboard() {
  const { walletAddress } = usePasskey();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("recetas");
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    // Show onboarding on first visit
    const seen = typeof window !== "undefined" && localStorage.getItem("tl_onboarding_done");
    if (!seen) setShowOnboarding(true);
    return () => clearTimeout(timer);
  }, []);

  function handleOnboardingComplete() {
    if (typeof window !== "undefined") {
      localStorage.setItem("tl_onboarding_done", "1");
    }
    setShowOnboarding(false);
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      {showOnboarding && (
        <PatientOnboarding onComplete={handleOnboardingComplete} />
      )}
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
                tab.id === "emergencia"
                  ? activeTab === tab.id
                    ? "bg-red-600 text-white font-semibold"
                    : "text-red-400 hover:text-white hover:bg-red-900/40 border border-red-900"
                  : activeTab === tab.id
                  ? "bg-[#10B981] text-[#0F172A] font-semibold"
                  : "text-gray-400 hover:text-white hover:bg-[#253046]"
              }`}
            >
              <span
                className={`w-4 h-4 ${
                  activeTab === tab.id ? "text-white" : tab.id === "emergencia" ? "text-red-400" : "text-gray-500"
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
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <SkeletonCard lines={4} />
              <SkeletonCard lines={4} />
              <SkeletonCard lines={4} />
            </div>
          ) : (
            <>
              {activeTab === "recetas" && <TabRecetas onNavigateToDolor={() => setActiveTab("dolor")} />}
              {activeTab === "ficha" && <TabFicha />}
              {activeTab === "accesos" && <TabAccesos />}
              {activeTab === "licencias" && <TabLicencias />}
              {activeTab === "dolor" && <TabDiarioDolor />}
              {activeTab === "timeline" && <TabTimeline />}
              {activeTab === "emergencia" && <TabEmergencia />}
            </>
          )}
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
                tab.id === "emergencia"
                  ? activeTab === tab.id
                    ? "text-red-400"
                    : "text-red-600 hover:text-red-400"
                  : activeTab === tab.id
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
