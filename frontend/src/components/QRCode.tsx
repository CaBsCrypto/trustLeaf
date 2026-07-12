// Copyright © 2026 Browns Studio
// Dynamic QR code component — no npm dependencies needed.
// Uses qrserver.com API to generate scannable QR codes.
// In production, swap for a self-hosted generator (qrcode npm + canvas).
"use client";

import { useState } from "react";

interface QRCodeProps {
  /** The URL or text to encode in the QR */
  value: string;
  /** Size in pixels (default: 200) */
  size?: number;
  /** Label shown below the QR */
  label?: string;
  /** Whether to show a "copy link" button */
  showCopy?: boolean;
  /** Background color (default: white) */
  bgColor?: string;
  /** Foreground color (default: black) */
  fgColor?: string;
}

export default function QRCode({
  value,
  size = 200,
  label,
  showCopy = false,
  bgColor = "ffffff",
  fgColor = "0f172a",
}: QRCodeProps) {
  const [copied, setCopied] = useState(false);

  // qrserver.com generates QR images via URL — free, no auth required
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&bgcolor=${bgColor}&color=${fgColor}&margin=8&qzone=1`;

  function handleCopy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* QR image */}
      <div className="bg-white p-3 rounded-xl shadow-inner" style={{ lineHeight: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrUrl}
          alt={`QR code for: ${value}`}
          width={size}
          height={size}
          className="rounded-lg"
          style={{ display: "block" }}
        />
      </div>

      {/* Label */}
      {label && (
        <p className="text-[#64748B] text-xs text-center font-mono">{label}</p>
      )}

      {/* Copy button */}
      {showCopy && (
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#10B981] transition-colors"
        >
          {copied ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 text-[#10B981]">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-[#10B981]">¡Copiado!</span>
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
              Copiar link
            </>
          )}
        </button>
      )}
    </div>
  );
}
