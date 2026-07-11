// Copyright © 2026 Browns Studio
import React from "react";

export type PrescriptionStatus = "active" | "partial" | "used" | "revoked" | "expired" | "pending";

interface StatusConfig {
  label: string;
  className: string;
}

const STATUS_MAP: Record<PrescriptionStatus, StatusConfig> = {
  active: {
    label: "Activa",
    className: "bg-emerald-900/50 text-emerald-400 border border-emerald-700",
  },
  partial: {
    label: "Parcial",
    className: "bg-yellow-900/50 text-yellow-400 border border-yellow-700",
  },
  used: {
    label: "Usada",
    className: "bg-slate-800 text-slate-400 border border-slate-700",
  },
  revoked: {
    label: "Revocada",
    className: "bg-red-900/50 text-red-400 border border-red-700",
  },
  expired: {
    label: "Vencida",
    className: "bg-orange-900/50 text-orange-400 border border-orange-700",
  },
  pending: {
    label: "Pendiente",
    className: "bg-blue-900/50 text-blue-400 border border-blue-700",
  },
};

interface StatusBadgeProps {
  status: PrescriptionStatus;
  size?: "sm" | "md";
  customLabel?: string;
}

export function StatusBadge({ status, size = "md", customLabel }: StatusBadgeProps) {
  const cfg = STATUS_MAP[status];
  const sizeClass = size === "sm"
    ? "px-2 py-0.5 text-[10px]"
    : "px-2.5 py-1 text-xs";

  return (
    <span className={`inline-flex items-center rounded-full font-semibold whitespace-nowrap ${sizeClass} ${cfg.className}`}>
      {customLabel ?? cfg.label}
    </span>
  );
}

export { STATUS_MAP };
