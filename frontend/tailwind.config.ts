// Copyright © 2026 Browns Studio
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "tl-bg": "#0F172A",
        "tl-surface": "#1E293B",
        "tl-surface-2": "#253046",
        "tl-border": "#334155",
        "tl-border-light": "#475569",
        "tl-text": "#F1F5F9",
        "tl-muted": "#94A3B8",
        "tl-subtle": "#64748B",
        "tl-green": "#10B981",
        "tl-green-dark": "#059669",
        "tl-green-light": "#34D399",
        "tl-green-dim": "#064E3B",
        "tl-blue": "#3B82F6",
        "tl-blue-dark": "#2563EB",
        "tl-blue-light": "#60A5FA",
        "tl-blue-dim": "#1E3A5F",
        "tl-yellow": "#F59E0B",
        "tl-red": "#EF4444",
        "tl-orange": "#F97316",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-down": "slideDown 0.25s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
