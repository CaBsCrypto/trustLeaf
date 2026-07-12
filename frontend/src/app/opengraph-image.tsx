// Copyright © 2026 Browns Studio
// Dynamic OG image — auto-served at /opengraph-image by Next.js
// Appears when sharing trustleaf-demo.vercel.app on social media, WhatsApp, Slack, etc.
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TrustLeaf — Tu historial clínico, tuyo para siempre";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0F172A",
          padding: "60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "800px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Logo row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "#10B981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              fontWeight: 800,
              color: "#0F172A",
            }}
          >
            TL
          </div>
          <span
            style={{
              fontSize: "36px",
              fontWeight: 800,
              color: "#F1F5F9",
              letterSpacing: "-0.5px",
            }}
          >
            TrustLeaf
          </span>
          <div
            style={{
              marginLeft: "8px",
              background: "rgba(16,185,129,0.15)",
              border: "1px solid rgba(16,185,129,0.3)",
              borderRadius: "20px",
              padding: "6px 16px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#10B981",
            }}
          >
            Beta · Chile
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "58px",
            fontWeight: 900,
            color: "#F1F5F9",
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: "-1px",
            maxWidth: "900px",
            marginBottom: "24px",
          }}
        >
          Tu historial clínico,{" "}
          <span style={{ color: "#10B981" }}>tuyo para siempre</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "24px",
            color: "#64748B",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.4,
            marginBottom: "48px",
          }}
        >
          Recetas firmadas con Face ID · Historial en Stellar Blockchain · QR de emergencia sin login
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[
            "🔒 Zero PHI en blockchain",
            "⚡ Stellar Network",
            "🪪 Face ID signing",
            "🆘 QR emergencia",
          ].map((label) => (
            <div
              key={label}
              style={{
                background: "#1E293B",
                border: "1px solid #334155",
                borderRadius: "12px",
                padding: "10px 20px",
                fontSize: "18px",
                color: "#94A3B8",
                fontWeight: 500,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            fontSize: "16px",
            color: "#334155",
            fontWeight: 500,
          }}
        >
          trustleaf-demo.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
