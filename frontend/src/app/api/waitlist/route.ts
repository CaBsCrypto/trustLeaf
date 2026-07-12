// Copyright © 2026 Browns Studio
// Waitlist API — saves email via Resend and sends welcome email
// Requires: RESEND_API_KEY in Vercel Environment Variables

import { NextRequest, NextResponse } from "next/server";

const WAITLIST_EMAILS: string[] = []; // In-memory fallback

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email ?? "").trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      // Demo fallback — store in memory, still return success
      WAITLIST_EMAILS.push(email);
      console.log("[waitlist] DEMO MODE — no RESEND_API_KEY. Email:", email);
      return NextResponse.json({ success: true, demo: true });
    }

    // 1. Send notification to founder
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "TrustLeaf <waitlist@trustleaf.app>",
        to: ["cabscryptocontacto@gmail.com"],
        subject: `🌿 Nuevo en waitlist: ${email}`,
        html: `<p>Nuevo registro en el waitlist de TrustLeaf:</p><p><strong>${email}</strong></p><p>Lista acumulada: revisa Resend dashboard.</p>`,
      }),
    });

    // 2. Send welcome email to the user
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "TrustLeaf <hola@trustleaf.app>",
        to: [email],
        subject: "Tu lugar en TrustLeaf está reservado 🌿",
        html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0F172A; margin: 0; padding: 0; }
  .container { max-width: 520px; margin: 0 auto; padding: 40px 20px; }
  .card { background: #1E293B; border-radius: 16px; padding: 40px; border: 1px solid #334155; }
  .logo { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; }
  .logo-icon { width: 40px; height: 40px; background: #10B981; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; color: #0F172A; text-align: center; line-height: 40px; }
  .logo-text { color: #F1F5F9; font-size: 18px; font-weight: 700; }
  h1 { color: #F1F5F9; font-size: 22px; font-weight: 800; margin: 0 0 12px; line-height: 1.3; }
  p { color: #94A3B8; font-size: 14px; line-height: 1.7; margin: 0 0 16px; }
  .highlight { color: #10B981; font-weight: 600; }
  .feature-list { list-style: none; padding: 0; margin: 20px 0; }
  .feature-list li { color: #CBD5E1; font-size: 13px; padding: 8px 0; border-bottom: 1px solid #334155; }
  .feature-list li:last-child { border-bottom: none; }
  .feature-list li::before { content: '✓ '; color: #10B981; font-weight: 700; }
  .cta { display: block; background: #10B981; color: #0F172A; text-decoration: none; font-weight: 700; font-size: 14px; text-align: center; padding: 14px 24px; border-radius: 10px; margin: 24px 0; }
  .footer { color: #475569; font-size: 11px; text-align: center; margin-top: 24px; }
  .stellar { display: inline-flex; align-items: center; gap: 6px; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); border-radius: 6px; padding: 6px 12px; color: #10B981; font-size: 11px; font-weight: 600; margin-top: 8px; }
</style>
</head>
<body>
<div class="container">
  <div class="card">
    <div class="logo">
      <div class="logo-icon">TL</div>
      <div class="logo-text">TrustLeaf</div>
    </div>

    <h1>Tu lugar está reservado 🌿</h1>

    <p>Gracias por unirte al waitlist de TrustLeaf. Estás entre las primeras personas en Chile que tendrán acceso a un historial clínico que <span class="highlight">realmente te pertenece</span>.</p>

    <ul class="feature-list">
      <li>Historial clínico permanente en Stellar Blockchain</li>
      <li>Recetas firmadas con Face ID — infalsificables</li>
      <li>Diario de Dolor con detección de patrones</li>
      <li>QR para compartir con médicos en segundos</li>
    </ul>

    <p>Mientras esperas, puedes explorar el demo:</p>

    <a href="https://trustleaf-demo.vercel.app" class="cta">
      Ver demo en vivo →
    </a>

    <div class="stellar">⚡ Powered by Stellar Blockchain · $0.00001/tx</div>

    <div class="footer">
      © 2026 TrustLeaf · Browns Studio · Chile<br>
      Recibiste este email porque te registraste en trustleaf-demo.vercel.app
    </div>
  </div>
</div>
</body>
</html>
        `,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[waitlist] Error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
