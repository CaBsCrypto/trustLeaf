// Copyright © 2026 Browns Studio
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { saveUserRole, getUserRole, type UserRole } from "../../../lib/user-role";

// ─── Role card data ───────────────────────────────────────────────────────────
interface RoleOption {
  role: UserRole;
  label: string;
  subtitle: string;
  icon: React.ReactNode;
  portal: string;
  color: string;
  borderColor: string;
  bgColor: string;
}

function DoctorIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <circle cx="24" cy="16" r="9" stroke="#3B82F6" strokeWidth="2.5" />
      <path d="M8 40c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M30 34h8M34 30v8" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function PatientIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <circle cx="24" cy="16" r="9" stroke="#10B981" strokeWidth="2.5" />
      <path d="M8 40c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M18 24l4 4 8-8" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PharmacyIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <rect x="8" y="14" width="32" height="26" rx="3" stroke="#A78BFA" strokeWidth="2.5" />
      <path d="M16 14V10a8 8 0 0116 0v4" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 23v8M20 27h8" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: "doctor",
    label: "Médico",
    subtitle: "Emite y gestiona recetas digitales verificadas",
    icon: <DoctorIcon />,
    portal: "/doctor",
    color: "#3B82F6",
    borderColor: "rgba(59,130,246,0.4)",
    bgColor: "rgba(59,130,246,0.08)",
  },
  {
    role: "patient",
    label: "Paciente",
    subtitle: "Accede a tus recetas y preséntalas en la farmacia",
    icon: <PatientIcon />,
    portal: "/patient",
    color: "#10B981",
    borderColor: "rgba(16,185,129,0.4)",
    bgColor: "rgba(16,185,129,0.08)",
  },
  {
    role: "dispensary",
    label: "Farmacia",
    subtitle: "Verifica recetas y registra dispensaciones",
    icon: <PharmacyIcon />,
    portal: "/dispensary",
    color: "#A78BFA",
    borderColor: "rgba(167,139,250,0.4)",
    bgColor: "rgba(167,139,250,0.08)",
  },
];

// ─── Main page ────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const { login, authenticated, ready } = usePrivy();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);

  // If already authenticated, redirect to saved portal
  useEffect(() => {
    if (ready && authenticated) {
      const savedRole = getUserRole();
      if (savedRole) {
        const option = ROLE_OPTIONS.find((o) => o.role === savedRole);
        if (option) {
          router.push(option.portal);
          return;
        }
      }
      // Default to patient if no role saved
      router.push("/patient");
    }
  }, [ready, authenticated, router]);

  // After login completes (authenticated changes to true) navigate
  useEffect(() => {
    if (ready && authenticated && pendingRole) {
      saveUserRole(pendingRole);
      const option = ROLE_OPTIONS.find((o) => o.role === pendingRole);
      if (option) {
        router.push(option.portal);
      }
      setPendingRole(null);
    }
  }, [ready, authenticated, pendingRole, router]);

  function handleRoleSelect(role: UserRole) {
    setSelectedRole(role);
    saveUserRole(role);
    setPendingRole(role);
    login();
  }

  if (!ready) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0F172A" }}
      >
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "#10B981 transparent #10B981 #10B981" }}
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center py-10 px-4"
      style={{ background: "#0F172A" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-8">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
          style={{ background: "#10B981", color: "#0F172A" }}
        >
          TL
        </div>
        <span className="font-bold text-2xl" style={{ color: "#fff" }}>
          Trust<span style={{ color: "#10B981" }}>Leaf</span>
        </span>
      </div>

      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "#fff" }}>
          Bienvenido a TrustLeaf
        </h1>
        <p className="text-base" style={{ color: "#64748B" }}>
          Selecciona tu rol para continuar
        </p>
      </div>

      {/* Role cards */}
      <div className="w-full max-w-lg space-y-4">
        {ROLE_OPTIONS.map((option) => {
          const isSelected = selectedRole === option.role;
          return (
            <button
              key={option.role}
              onClick={() => handleRoleSelect(option.role)}
              className="w-full flex items-center gap-5 p-5 rounded-2xl text-left transition-all duration-200 group"
              style={{
                background: isSelected ? option.bgColor : "#1E293B",
                border: `1.5px solid ${isSelected ? option.borderColor : "#334155"}`,
                boxShadow: isSelected
                  ? `0 0 0 2px ${option.color}22`
                  : "none",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = option.borderColor;
                  (e.currentTarget as HTMLButtonElement).style.background = option.bgColor;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#334155";
                  (e.currentTarget as HTMLButtonElement).style.background = "#1E293B";
                }
              }}
            >
              {/* Icon */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                style={{
                  background: option.bgColor,
                  border: `1px solid ${option.borderColor}`,
                }}
              >
                {option.icon}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-lg mb-0.5" style={{ color: "#fff" }}>
                  {option.label}
                </div>
                <div className="text-sm leading-relaxed" style={{ color: "#64748B" }}>
                  {option.subtitle}
                </div>
              </div>

              {/* Arrow */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-0.5"
                style={{ color: option.color }}
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          );
        })}
      </div>

      {/* Face ID / passkey note */}
      <div
        className="mt-8 flex items-center gap-2.5 max-w-lg w-full px-4 py-3 rounded-xl text-sm"
        style={{ background: "#1E293B", border: "1px solid #334155" }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
          <path d="M9 10c0-1.657 1.343-3 3-3s3 1.343 3 3v1" />
          <path d="M9 14s0 4 3 4 3-4 3-4" />
          <path d="M12 11v2" />
        </svg>
        <p style={{ color: "#94A3B8" }}>
          <span style={{ color: "#fff", fontWeight: 600 }}>Usamos Face ID</span> para firmarte de forma segura.{" "}
          No necesitas contraseña ni billetera crypto.
        </p>
      </div>

      {/* Footer */}
      <p className="mt-6 text-sm" style={{ color: "#334155" }}>
        © 2026 Browns Studio · TrustLeaf
      </p>
    </div>
  );
}
