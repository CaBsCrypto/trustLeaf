// Copyright © 2026 Browns Studio
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { clearUserRole } from "../lib/user-role";

interface NavLink {
  href: string;
  label: string;
  roleKey?: string;
}

const NAV_LINKS: NavLink[] = [
  { href: "/patient", label: "Paciente", roleKey: "patient" },
  { href: "/doctor", label: "Médico", roleKey: "doctor" },
  { href: "/dispensary", label: "Farmacia", roleKey: "dispensary" },
  { href: "/verify/demo", label: "Verificar" },
  { href: "/demo", label: "Demo" },
];

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      {open ? (
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </>
      )}
    </svg>
  );
}

// ─── Auth section ─────────────────────────────────────────────────────────────
function AuthSection({ onClose }: { onClose?: () => void }) {
  const { authenticated, logout, user, login } = usePrivy();

  function getDisplayName(): string {
    if (user?.email?.address) return user.email.address;
    if (user?.google?.email) return user.google.email;
    if (user?.wallet?.address) {
      const addr = user.wallet.address;
      return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    }
    return "Mi cuenta";
  }

  function getInitial(): string {
    const name = getDisplayName();
    return name.charAt(0).toUpperCase();
  }

  async function handleLogout() {
    clearUserRole();
    await logout();
    onClose?.();
  }

  if (authenticated) {
    return (
      <div className="flex items-center gap-2">
        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
          style={{ background: "rgba(16,185,129,0.2)", color: "#10B981", border: "1px solid rgba(16,185,129,0.4)" }}
          title={getDisplayName()}
        >
          {getInitial()}
        </div>

        {/* Email (hidden on mobile) */}
        <span
          className="hidden lg:block text-xs max-w-[140px] truncate"
          style={{ color: "#94A3B8" }}
          title={getDisplayName()}
        >
          {getDisplayName()}
        </span>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
          style={{ border: "1px solid #334155", color: "#94A3B8", background: "transparent" }}
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => { login(); onClose?.(); }}
        className="px-4 py-2 text-sm font-medium transition-colors"
        style={{ color: "#94A3B8" }}
      >
        Iniciar sesión
      </button>
      <Link
        href="/patient/onboarding"
        onClick={onClose}
        className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors"
        style={{ background: "#10B981", color: "#0F172A" }}
      >
        Registrarse
      </Link>
    </div>
  );
}

// ─── Mobile auth section ──────────────────────────────────────────────────────
function MobileAuthSection({ onClose }: { onClose: () => void }) {
  const { authenticated, logout, user, login } = usePrivy();

  function getDisplayName(): string {
    if (user?.email?.address) return user.email.address;
    if (user?.google?.email) return user.google.email;
    if (user?.wallet?.address) {
      const addr = user.wallet.address;
      return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    }
    return "Mi cuenta";
  }

  async function handleLogout() {
    clearUserRole();
    await logout();
    onClose();
  }

  if (authenticated) {
    return (
      <div className="pt-2 pb-1 space-y-2">
        <div
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
          style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: "rgba(16,185,129,0.2)", color: "#10B981" }}
          >
            {getDisplayName().charAt(0).toUpperCase()}
          </div>
          <span className="text-sm truncate" style={{ color: "#CBD5E1" }}>
            {getDisplayName()}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
          style={{ border: "1px solid #334155", color: "#94A3B8", background: "transparent" }}
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  return (
    <div className="pt-2 pb-1 grid grid-cols-2 gap-2">
      <button
        onClick={() => { login(); onClose(); }}
        className="text-center px-4 py-2.5 border border-[#334155] hover:border-[#475569] text-sm font-medium rounded-xl transition-colors"
        style={{ color: "#94A3B8", background: "transparent" }}
      >
        Iniciar sesión
      </button>
      <Link
        href="/patient/onboarding"
        onClick={onClose}
        className="text-center px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors"
        style={{ background: "#10B981", color: "#0F172A" }}
      >
        Registrarse
      </Link>
    </div>
  );
}

interface NavbarProps {
  variant?: "landing" | "portal";
  activeRole?: string;
}

export default function Navbar({ variant = "landing", activeRole }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  function isActive(link: NavLink): boolean {
    if (activeRole && link.roleKey) return link.roleKey === activeRole;
    return pathname.startsWith(link.href.replace("/demo", ""));
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#334155] bg-[#0F172A]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#10B981] flex items-center justify-center text-[#0F172A] font-bold text-sm transition-transform group-hover:scale-105">
              TL
            </div>
            <span className="text-white font-bold text-base">
              Trust<span className="text-[#10B981]">Leaf</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "text-[#10B981] bg-[#10B981]/10"
                      : "text-[#94A3B8] hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#10B981]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            <AuthSection />
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/5 transition-colors"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#334155] bg-[#0F172A] px-4 py-3 space-y-1 animate-fade-in">
          {NAV_LINKS.map((link) => {
            const active = isActive(link);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#10B981]/10 text-[#10B981]"
                    : "text-[#94A3B8] hover:text-white hover:bg-white/5"
                }`}
              >
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0" />
                )}
                {link.label}
              </Link>
            );
          })}
          <MobileAuthSection onClose={() => setMenuOpen(false)} />
        </div>
      )}
    </header>
  );
}
