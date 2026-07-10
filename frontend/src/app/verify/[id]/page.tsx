// Copyright © 2026 Browns Studio
// Public page — NO authentication required. Anyone can access.
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ShieldCheckIcon,
  AlertTriangleIcon,
  PillIcon,
  ClockIcon,
  UserIcon,
  CalendarIcon,
  SearchIcon,
  CheckIcon,
  CloseIcon,
} from "../../../components/icons/TrustLeafIcons";

// ─── Types ────────────────────────────────────────────────────────────────────

type PrescriptionStatus = "active" | "partial" | "used" | "revoked" | "expired";

interface PublicPrescription {
  rxId: string;
  medication: string;
  status: PrescriptionStatus;
  dosesRemaining: number;
  totalDoses: number;
  expiryDate: string;
  doctorLicense: string;
  issuedDate: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_DB: Record<string, PublicPrescription> = {
  "RX-A1B2C3D4": {
    rxId: "RX-A1B2C3D4",
    medication: "Amoxicilina 500mg",
    status: "active",
    dosesRemaining: 1,
    totalDoses: 3,
    expiryDate: "2026-07-14",
    doctorLicense: "CM-12345",
    issuedDate: "2026-07-08",
  },
  "RX-E5F6G7H8": {
    rxId: "RX-E5F6G7H8",
    medication: "Losartán 50mg",
    status: "partial",
    dosesRemaining: 5,
    totalDoses: 6,
    expiryDate: "2026-08-20",
    doctorLicense: "AR-67890",
    issuedDate: "2026-07-07",
  },
  "RX-I9J0K1L2": {
    rxId: "RX-I9J0K1L2",
    medication: "Metformina 850mg",
    status: "used",
    dosesRemaining: 0,
    totalDoses: 3,
    expiryDate: "2026-06-30",
    doctorLicense: "RS-54321",
    issuedDate: "2026-06-15",
  },
  "RX-M3N4O5P6": {
    rxId: "RX-M3N4O5P6",
    medication: "Atorvastatina 20mg",
    status: "revoked",
    dosesRemaining: 0,
    totalDoses: 2,
    expiryDate: "2026-07-10",
    doctorLicense: "CL-99876",
    issuedDate: "2026-07-01",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

type StatusDisplayConfig = {
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  bgClass: string;
  borderClass: string;
  textClass: string;
  isValid: boolean;
};

function getStatusConfig(status: PrescriptionStatus): StatusDisplayConfig {
  switch (status) {
    case "active":
      return {
        label: "RECETA VÁLIDA",
        sublabel: "Esta receta es auténtica y puede ser dispensada",
        icon: (
          <div className="w-20 h-20 rounded-full bg-green-900/40 border-4 border-green-500 flex items-center justify-center">
            <CheckIcon className="w-10 h-10 text-green-400" />
          </div>
        ),
        bgClass: "bg-green-900/10",
        borderClass: "border-green-700",
        textClass: "text-green-400",
        isValid: true,
      };
    case "partial":
      return {
        label: "RECETA VÁLIDA",
        sublabel: "Parcialmente dispensada — aún tiene dosis disponibles",
        icon: (
          <div className="w-20 h-20 rounded-full bg-green-900/40 border-4 border-green-500 flex items-center justify-center">
            <PillIcon className="w-10 h-10 text-green-400" />
          </div>
        ),
        bgClass: "bg-green-900/10",
        borderClass: "border-green-700",
        textClass: "text-green-400",
        isValid: true,
      };
    case "used":
      return {
        label: "RECETA USADA",
        sublabel: "Esta receta ya fue completamente dispensada",
        icon: (
          <div className="w-20 h-20 rounded-full bg-gray-800 border-4 border-gray-600 flex items-center justify-center">
            <CloseIcon className="w-10 h-10 text-gray-400" />
          </div>
        ),
        bgClass: "bg-gray-800",
        borderClass: "border-gray-700",
        textClass: "text-gray-400",
        isValid: false,
      };
    case "revoked":
      return {
        label: "RECETA REVOCADA",
        sublabel: "Esta receta fue invalidada por el médico emisor",
        icon: (
          <div className="w-20 h-20 rounded-full bg-red-900/40 border-4 border-red-500 flex items-center justify-center">
            <AlertTriangleIcon className="w-10 h-10 text-red-400" />
          </div>
        ),
        bgClass: "bg-red-900/10",
        borderClass: "border-red-700",
        textClass: "text-red-400",
        isValid: false,
      };
    case "expired":
      return {
        label: "RECETA VENCIDA",
        sublabel: "La fecha de vigencia de esta receta ha expirado",
        icon: (
          <div className="w-20 h-20 rounded-full bg-orange-900/30 border-4 border-orange-600 flex items-center justify-center">
            <ClockIcon className="w-10 h-10 text-orange-400" />
          </div>
        ),
        bgClass: "bg-orange-900/10",
        borderClass: "border-orange-700",
        textClass: "text-orange-400",
        isValid: false,
      };
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// ─── QR Placeholder ───────────────────────────────────────────────────────────

const QR_PATTERN = [
  1,1,1,1,1,1,1,0,1,0,1,1,0,0,1,1,1,1,1,1,1,
  1,0,0,0,0,0,1,0,0,1,0,0,1,0,1,0,0,0,0,0,1,
  1,0,1,1,1,0,1,0,1,0,1,1,0,0,1,0,1,1,1,0,1,
  1,0,1,1,1,0,1,0,0,1,0,0,1,0,1,0,1,1,1,0,1,
  1,0,1,1,1,0,1,0,1,1,0,1,0,0,1,0,1,1,1,0,1,
  1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,
  1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,
  0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,
  1,1,0,1,1,0,1,1,0,0,1,1,0,0,1,0,1,0,1,1,0,
  0,0,1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0,0,0,1,
  1,0,1,1,0,0,1,0,1,0,1,0,1,1,0,0,1,1,0,1,0,
  0,1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0,1,0,0,1,
  1,1,1,1,0,0,1,0,1,1,0,1,1,0,0,1,0,0,1,0,1,
  0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,1,0,
  1,1,1,1,1,1,1,0,1,0,1,1,0,0,1,0,1,0,1,0,1,
  1,0,0,0,0,0,1,0,0,1,0,0,1,0,0,1,0,1,0,1,0,
  1,0,1,1,1,0,1,0,1,0,0,1,1,0,1,1,0,0,1,0,1,
  1,0,1,1,1,0,1,0,0,0,1,0,0,1,0,0,1,0,0,1,0,
  1,0,1,1,1,0,1,0,1,1,0,1,0,0,0,1,0,1,0,0,1,
  1,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,1,0,1,1,0,
  1,1,1,1,1,1,1,0,1,0,0,1,0,1,0,1,0,1,0,1,0,
];

function QRDisplay({ rxId }: { rxId: string }) {
  return (
    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
      <h3 className="text-white font-semibold text-center mb-4">
        Código QR de Verificación
      </h3>
      <div className="bg-white p-4 rounded-xl w-52 h-52 mx-auto grid gap-px"
           style={{ gridTemplateColumns: "repeat(21, 1fr)" }}>
        {QR_PATTERN.map((bit, i) => (
          <div
            key={i}
            className={bit ? "bg-gray-900" : "bg-white"}
          />
        ))}
      </div>
      <p className="text-center mt-3 text-gray-400 text-xs font-mono">{rxId}</p>
      <p className="text-center mt-1 text-gray-600 text-xs">
        Escanea con la app TrustLeaf para verificar
      </p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function VerifyPage() {
  const params = useParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const id =
    typeof params.id === "string"
      ? params.id.toUpperCase()
      : Array.isArray(params.id)
      ? params.id[0].toUpperCase()
      : "";

  const prescription = MOCK_DB[id] ?? null;

  function handleVerifyAnother(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = searchQuery.trim().toUpperCase();
    if (trimmed) {
      router.push(`/verify/${trimmed}`);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-black font-bold text-sm">
              TL
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">
                TrustLeaf
              </p>
              <p className="text-gray-500 text-xs">Verificación Pública</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-green-400 text-xs font-semibold">
            <ShieldCheckIcon className="w-4 h-4" />
            <span>Stellar Network</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {prescription ? (
          <>
            {/* Status display */}
            {(() => {
              const cfg = getStatusConfig(prescription.status);
              return (
                <div
                  className={`rounded-2xl border-2 p-8 text-center ${cfg.bgClass} ${cfg.borderClass}`}
                >
                  <div className="flex justify-center mb-4">{cfg.icon}</div>
                  <h1 className={`text-2xl font-bold mb-1 ${cfg.textClass}`}>
                    {cfg.label}
                  </h1>
                  <p className="text-gray-400 text-sm">{cfg.sublabel}</p>
                </div>
              );
            })()}

            {/* Prescription details */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-700">
                <h2 className="text-white font-semibold">
                  Detalles de la Receta
                </h2>
                <p className="text-gray-500 text-xs mt-0.5">
                  Sin información personal del paciente (Zero PHI)
                </p>
              </div>
              <div className="divide-y divide-gray-700">
                <div className="flex items-center gap-3 px-5 py-4">
                  <PillIcon className="w-5 h-5 text-gray-500 shrink-0" />
                  <div>
                    <p className="text-gray-500 text-xs">Medicamento</p>
                    <p className="text-white font-semibold">
                      {prescription.medication}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-5 py-4">
                  <CheckIcon className="w-5 h-5 text-gray-500 shrink-0" />
                  <div className="flex-1">
                    <p className="text-gray-500 text-xs">Dosis restantes</p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-white font-semibold text-lg">
                        {prescription.dosesRemaining}
                        <span className="text-gray-500 text-sm font-normal">
                          /{prescription.totalDoses}
                        </span>
                      </p>
                      <div className="flex-1 bg-gray-700 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            prescription.status === "active" ||
                            prescription.status === "partial"
                              ? "bg-green-500"
                              : "bg-gray-600"
                          }`}
                          style={{
                            width: `${
                              (prescription.dosesRemaining /
                                prescription.totalDoses) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-5 py-4">
                  <UserIcon className="w-5 h-5 text-gray-500 shrink-0" />
                  <div>
                    <p className="text-gray-500 text-xs">Licencia médico</p>
                    <p className="text-white font-mono">
                      {prescription.doctorLicense}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-5 py-4">
                  <CalendarIcon className="w-5 h-5 text-gray-500 shrink-0" />
                  <div>
                    <p className="text-gray-500 text-xs">Fecha de emisión</p>
                    <p className="text-white">{formatDate(prescription.issuedDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-5 py-4">
                  <ClockIcon className="w-5 h-5 text-gray-500 shrink-0" />
                  <div>
                    <p className="text-gray-500 text-xs">Fecha de vencimiento</p>
                    <p className="text-white">
                      {formatDate(prescription.expiryDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* QR */}
            <QRDisplay rxId={prescription.rxId} />
          </>
        ) : (
          /* Not found */
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center mx-auto mb-4">
              <AlertTriangleIcon className="w-10 h-10 text-gray-500" />
            </div>
            <h1 className="text-xl font-bold text-white mb-2">
              Receta no encontrada
            </h1>
            <p className="text-gray-400 text-sm mb-1">
              El ID{" "}
              <span className="font-mono text-gray-300">
                &quot;{params.id}&quot;
              </span>{" "}
              no existe en Stellar.
            </p>
            <p className="text-gray-500 text-xs">
              Prueba: RX-A1B2C3D4 · RX-E5F6G7H8 · RX-I9J0K1L2
            </p>
          </div>
        )}

        {/* Verify another */}
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <h3 className="text-white font-semibold mb-3">
            Verificar otra receta
          </h3>
          <form onSubmit={handleVerifyAnother} className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="RX-XXXXXXXX"
                className="w-full bg-gray-900 border border-gray-700 focus:border-green-500 text-white text-sm rounded-xl pl-9 pr-4 py-2.5 outline-none placeholder-gray-600 transition-colors font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-xl transition-colors shrink-0"
            >
              Verificar
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-8">
        <div className="max-w-2xl mx-auto px-4 py-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldCheckIcon className="w-4 h-4 text-green-500" />
            <span className="text-green-400 text-sm font-semibold">
              Verificación criptográfica activa
            </span>
          </div>
          <p className="text-gray-600 text-xs">
            Powered by{" "}
            <span className="text-gray-500 font-semibold">TrustLeaf</span> |
            Stellar Network | Zero-Knowledge Prescriptions
          </p>
          <p className="text-gray-700 text-xs mt-1">
            © 2026 Browns Studio · Ningún dato personal es visible en blockchain
          </p>
        </div>
      </footer>
    </div>
  );
}
