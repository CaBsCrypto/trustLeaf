"use client";

import { useRef, useEffect, useState, useCallback } from "react";

// ─── QR Code Placeholder ──────────────────────────────────────────────────────

function QRPlaceholder() {
  // 7x7 grid that vaguely resembles a QR code pattern
  const pattern = [
    [1, 1, 1, 0, 1, 1, 1],
    [1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 0, 1, 1],
    [0, 1, 0, 0, 1, 0, 0],
    [1, 1, 1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 0, 1, 1, 1],
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "1.5px",
        width: 52,
        height: 52,
        padding: 4,
        background: "rgba(255,255,255,0.9)",
        borderRadius: 4,
      }}
    >
      {pattern.flat().map((cell, i) => (
        <div
          key={i}
          style={{
            background: cell ? "#0F172A" : "transparent",
            borderRadius: 1,
          }}
        />
      ))}
    </div>
  );
}

// ─── Shield SVG ───────────────────────────────────────────────────────────────

function ShieldSVG() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

// ─── Stellar Logo ─────────────────────────────────────────────────────────────

function StellarDot() {
  return (
    <svg width="14" height="14" viewBox="0 0 32 32" fill="currentColor">
      <circle cx="16" cy="16" r="16" />
    </svg>
  );
}

// ─── Card Face: Front ─────────────────────────────────────────────────────────

function CardFront() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        borderRadius: 16,
        overflow: "hidden",
        background: "linear-gradient(135deg, #064e3b 0%, #065f46 30%, #0d9488 65%, #0f766e 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        padding: "18px 20px 14px",
        userSelect: "none",
      }}
    >
      {/* Subtle holographic shimmer overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.04) 50%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Chip / EMV rectangle */}
      <div
        style={{
          position: "absolute",
          top: 54,
          left: 20,
          width: 30,
          height: 22,
          borderRadius: 3,
          background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridTemplateRows: "1fr 1fr 1fr",
          gap: "1px",
          padding: 2,
        }}
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={{ background: "rgba(0,0,0,0.15)", borderRadius: 1 }} />
        ))}
      </div>

      {/* Top row: logo + shield */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              background: "#10B981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0F172A",
              fontWeight: 900,
              fontSize: 8,
              letterSpacing: "-0.5px",
            }}
          >
            TL
          </div>
          <span
            style={{
              color: "#fff",
              fontWeight: 800,
              fontSize: 13,
              letterSpacing: "0.3px",
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            Trust<span style={{ color: "#6ee7b7" }}>Leaf</span>
          </span>
        </div>
        <div style={{ color: "#6ee7b7", opacity: 0.9 }}>
          <ShieldSVG />
        </div>
      </div>

      {/* Label */}
      <div style={{ marginLeft: 56, marginBottom: 14 }}>
        <span
          style={{
            color: "rgba(110,231,183,0.8)",
            fontSize: 7,
            fontWeight: 600,
            letterSpacing: "1.8px",
            textTransform: "uppercase",
          }}
        >
          Historial Clínico Digital
        </span>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Patient name */}
      <div style={{ marginBottom: 10 }}>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 7, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 2 }}>
          Titular
        </p>
        <p style={{ color: "#fff", fontSize: 14, fontWeight: 700, letterSpacing: "0.5px", textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
          Juan Pérez
        </p>
        <p style={{ color: "rgba(110,231,183,0.7)", fontSize: 9, marginTop: 1 }}>
          ID · GP-2024-00183
        </p>
      </div>

      {/* Bottom row: QR + blockchain badge */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <QRPlaceholder />

        <div style={{ textAlign: "right" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              background: "rgba(16,185,129,0.15)",
              border: "1px solid rgba(16,185,129,0.4)",
              borderRadius: 20,
              padding: "3px 8px",
              marginBottom: 6,
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#10B981", display: "inline-block" }} />
            <span style={{ color: "#6ee7b7", fontSize: 7, fontWeight: 700, letterSpacing: "0.8px" }}>
              ACTIVO
            </span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 6.5, letterSpacing: "0.5px", lineHeight: 1.4 }}>
            Verificado ·
            <br />
            Stellar Blockchain
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Card Face: Back ──────────────────────────────────────────────────────────

function CardBack() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
        borderRadius: 16,
        overflow: "hidden",
        background: "linear-gradient(135deg, #065f46 0%, #047857 40%, #0d9488 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
      }}
    >
      {/* Magnetic stripe */}
      <div
        style={{
          width: "100%",
          height: 36,
          background: "linear-gradient(180deg, #111 0%, #1a1a1a 50%, #111 100%)",
          marginTop: 20,
          boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
        }}
      />

      {/* Signature strip */}
      <div
        style={{
          margin: "12px 20px 0",
          height: 28,
          background: "repeating-linear-gradient(90deg, #f1f5f9 0px, #f1f5f9 8px, #e2e8f0 8px, #e2e8f0 16px)",
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          paddingLeft: 8,
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        }}
      >
        <span
          style={{
            fontFamily: "cursive, serif",
            fontSize: 13,
            color: "#0F172A",
            opacity: 0.7,
            fontStyle: "italic",
          }}
        >
          Juan Pérez
        </span>
      </div>

      {/* CVV area */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "6px 20px 0",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.12)",
            borderRadius: 4,
            padding: "3px 10px",
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 8, letterSpacing: "1px" }}>
            CVV
          </span>
          <span style={{ color: "#fff", fontSize: 11, fontWeight: 700, marginLeft: 6 }}>
            •••
          </span>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Bottom info */}
      <div style={{ padding: "0 20px 16px" }}>
        {/* Hash line */}
        <div
          style={{
            background: "rgba(0,0,0,0.25)",
            borderRadius: 6,
            padding: "6px 10px",
            marginBottom: 10,
          }}
        >
          <p style={{ color: "rgba(110,231,183,0.6)", fontSize: 6.5, letterSpacing: "1px", marginBottom: 2 }}>
            STELLAR TX HASH
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              fontFamily: "monospace",
              fontSize: 7.5,
              letterSpacing: "0.5px",
              wordBreak: "break-all",
            }}
          >
            0x7f3a9b2c...e1f4d8a3
          </p>
        </div>

        {/* Certification badge row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ color: "#6ee7b7" }}>
              <StellarDot />
            </div>
            <div>
              <p style={{ color: "#6ee7b7", fontSize: 7.5, fontWeight: 700 }}>Stellar Network</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 6.5 }}>Zero PHI on-chain</p>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 6.5, letterSpacing: "0.5px" }}>
              Válido hasta
            </p>
            <p style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>12/28</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FichaOnchain3D() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotY, setRotY] = useState(0);
  const [rotX, setRotX] = useState(8);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dragStart = useRef<{ x: number; y: number; rotY: number; rotX: number } | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const autoRotRef = useRef(0);

  // Auto-rotation loop
  useEffect(() => {
    let lastTime = performance.now();

    function tick(now: number) {
      const delta = now - lastTime;
      lastTime = now;

      if (!isDragging && !isHovered) {
        autoRotRef.current += delta * 0.025; // degrees per ms
        setRotY(autoRotRef.current);
      } else {
        // keep autoRotRef in sync with manual rotY so it resumes smoothly
        autoRotRef.current = rotY;
      }

      animFrameRef.current = requestAnimationFrame(tick);
    }

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, isHovered]);

  // Mouse drag handlers
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, rotY, rotX };
    e.preventDefault();
  }, [rotY, rotX]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setRotY(dragStart.current.rotY + dx * 0.5);
    setRotX(dragStart.current.rotX - dy * 0.3);
  }, [isDragging]);

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStart.current = null;
  }, []);

  // Touch drag handlers
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    setIsDragging(true);
    dragStart.current = { x: t.clientX, y: t.clientY, rotY, rotX };
  }, [rotY, rotX]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !dragStart.current) return;
    const t = e.touches[0];
    const dx = t.clientX - dragStart.current.x;
    const dy = t.clientY - dragStart.current.y;
    setRotY(dragStart.current.rotY + dx * 0.5);
    setRotX(dragStart.current.rotX - dy * 0.3);
  }, [isDragging]);

  const onTouchEnd = useCallback(() => {
    setIsDragging(false);
    dragStart.current = null;
  }, []);

  // Global mouseup (in case cursor leaves element)
  useEffect(() => {
    const up = () => {
      setIsDragging(false);
      dragStart.current = null;
    };
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, []);

  // Card dimensions (credit-card ratio 85.6 x 54mm → ~340 x 214 px visual)
  const CARD_W = 320;
  const CARD_H = 202;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}
    >
      {/* Glow halo behind the card */}
      <div
        style={{
          position: "relative",
          width: CARD_W,
          height: CARD_H,
        }}
      >
        {/* Outer glow */}
        <div
          style={{
            position: "absolute",
            inset: -24,
            background: "radial-gradient(ellipse at center, rgba(16,185,129,0.18) 0%, rgba(5,150,105,0.06) 60%, transparent 100%)",
            borderRadius: "50%",
            filter: "blur(16px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Scene with perspective */}
        <div
          style={{
            perspective: 900,
            perspectiveOrigin: "50% 50%",
            width: CARD_W,
            height: CARD_H,
            position: "relative",
            zIndex: 1,
          }}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
        >
          {/* Inner rotating card */}
          <div
            ref={cardRef}
            onMouseDown={onMouseDown}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); setIsDragging(false); }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{
              width: CARD_W,
              height: CARD_H,
              position: "relative",
              transformStyle: "preserve-3d",
              transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
              cursor: isDragging ? "grabbing" : "grab",
              borderRadius: 16,
              // Card-level drop shadow
              filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.6)) drop-shadow(0 2px 8px rgba(16,185,129,0.15))",
              // Smooth deceleration when letting go
              transition: isDragging ? "none" : "transform 0.05s linear",
            }}
          >
            <CardFront />
            <CardBack />
          </div>
        </div>
      </div>

      {/* Caption */}
      <p
        style={{
          color: "rgba(100,116,139,0.8)",
          fontSize: 11,
          letterSpacing: "1.2px",
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        Arrastra para rotar · Hover pausa
      </p>
    </div>
  );
}
