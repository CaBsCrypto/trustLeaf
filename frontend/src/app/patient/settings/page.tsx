// Copyright © 2026 Browns Studio
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  BellIcon,
  SettingsIcon,
  ChevronRightIcon,
} from "../../../components/icons/TrustLeafIcons";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReminderSettings {
  enabled: boolean;
  time: string;
  email: string;
}

const STORAGE_KEY = "trustleaf_reminder_settings";
const DEFAULT_SETTINGS: ReminderSettings = {
  enabled: false,
  time: "20:00",
  email: "",
};

// ─── Toggle component ─────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
        checked ? "bg-[#10B981]" : "bg-gray-700"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-md transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PatientSettings() {
  const router = useRouter();
  const [settings, setSettings] = useState<ReminderSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<ReminderSettings>;
        setSettings({
          enabled: parsed.enabled ?? DEFAULT_SETTINGS.enabled,
          time: parsed.time ?? DEFAULT_SETTINGS.time,
          email: parsed.email ?? DEFAULT_SETTINGS.email,
        });
      }
    } catch {
      // ignore parse errors
    }
    setLoaded(true);
  }, []);

  function handleSave() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      toast.success("Configuración guardada");
    } catch {
      toast.error("No se pudo guardar la configuración");
    }
  }

  if (!loaded) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0F172A]/95 backdrop-blur-sm border-b border-[#334155] px-4 md:px-8 py-4">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="text-[#94A3B8] hover:text-white transition-colors p-1 rounded-lg hover:bg-[#1E293B]"
            aria-label="Volver"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-[#10B981]" />
            <h1 className="text-white font-bold text-lg">Configuración</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 md:px-8 py-8 space-y-6">

        {/* Recordatorios section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <BellIcon className="w-4 h-4 text-[#10B981]" />
            <h2 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wider">
              Recordatorios
            </h2>
          </div>

          <div className="bg-[#1E293B] rounded-2xl border border-[#334155] overflow-hidden">
            {/* Toggle row */}
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex-1 pr-4">
                <p className="text-white font-medium text-sm">
                  Recordatorio diario de dolor
                </p>
                <p className="text-[#64748B] text-xs mt-0.5">
                  Te enviaremos un email a esta hora recordándote registrar tu
                  dolor
                </p>
              </div>
              <Toggle
                checked={settings.enabled}
                onChange={(val) =>
                  setSettings((prev) => ({ ...prev, enabled: val }))
                }
              />
            </div>

            {/* Expanded options when enabled */}
            {settings.enabled && (
              <div className="border-t border-[#334155] px-5 py-5 space-y-4">
                {/* Time picker */}
                <div>
                  <label
                    htmlFor="reminder-time"
                    className="block text-xs font-medium text-[#94A3B8] mb-2"
                  >
                    Hora del recordatorio
                  </label>
                  <input
                    id="reminder-time"
                    type="time"
                    value={settings.time}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, time: e.target.value }))
                    }
                    className="bg-gray-900 border border-[#334155] focus:border-[#10B981] text-white text-sm rounded-xl px-4 py-2.5 outline-none transition-colors w-full md:w-48 [color-scheme:dark]"
                  />
                </div>

                {/* Email input */}
                <div>
                  <label
                    htmlFor="reminder-email"
                    className="block text-xs font-medium text-[#94A3B8] mb-2"
                  >
                    Email donde se enviará el recordatorio
                  </label>
                  <input
                    id="reminder-email"
                    type="email"
                    value={settings.email}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="tu@email.com"
                    className="bg-gray-900 border border-[#334155] focus:border-[#10B981] text-white text-sm rounded-xl px-4 py-2.5 outline-none placeholder-gray-600 transition-colors w-full"
                  />
                  <p className="text-[#64748B] text-xs mt-1.5">
                    El email puede ser diferente al de tu cuenta.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Quick link to pain diary */}
        <section>
          <div className="bg-[#1E293B] rounded-2xl border border-[#334155] overflow-hidden">
            <button
              onClick={() => router.push("/patient/pain-diary")}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#253046] transition-colors"
            >
              <div>
                <p className="text-white font-medium text-sm text-left">
                  Diario de dolor
                </p>
                <p className="text-[#64748B] text-xs mt-0.5 text-left">
                  Ver y registrar tus entradas de dolor
                </p>
              </div>
              <ChevronRightIcon className="w-4 h-4 text-[#64748B] shrink-0" />
            </button>
          </div>
        </section>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="w-full py-3.5 bg-[#10B981] hover:bg-green-400 text-[#0F172A] font-bold text-sm rounded-2xl transition-colors"
        >
          Guardar configuración
        </button>
      </main>
    </div>
  );
}
