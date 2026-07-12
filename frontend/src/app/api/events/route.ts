// Copyright © 2026 Browns Studio
// Lightweight event tracking — no PII, just action counts
// POST /api/events  { event: "qr_scan" | "rx_issued" | "emergency_view" | "for_doctors_view" }
// GET  /api/events  → { counts: {...}, today: {...} }
//
// In production: replace in-memory store with Vercel KV or Supabase

import { NextRequest, NextResponse } from "next/server";

// ─── In-memory store (resets on cold start — fine for demo) ─────────────────

type EventName = "qr_scan" | "rx_issued" | "emergency_view" | "for_doctors_view" | "waitlist_signup";

const COUNTS: Record<EventName, number> = {
  qr_scan: 0,
  rx_issued: 0,
  emergency_view: 0,
  for_doctors_view: 0,
  waitlist_signup: 0,
};

// Seed with realistic demo values so the admin page isn't all zeros on cold start
const SEED: Record<EventName, number> = {
  qr_scan: 147,
  rx_issued: 89,
  emergency_view: 34,
  for_doctors_view: 19,
  waitlist_signup: 23,
};

const TODAY: Record<EventName, number> = {
  qr_scan: 0,
  rx_issued: 0,
  emergency_view: 0,
  for_doctors_view: 0,
  waitlist_signup: 0,
};

let seeded = false;
function ensureSeeded() {
  if (seeded) return;
  Object.assign(COUNTS, SEED);
  seeded = true;
}

// ─── POST — record an event ──────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  ensureSeeded();
  try {
    const body = await req.json();
    const event = body.event as EventName;

    if (!Object.keys(COUNTS).includes(event)) {
      return NextResponse.json({ error: "Unknown event" }, { status: 400 });
    }

    COUNTS[event]++;
    TODAY[event]++;

    return NextResponse.json({ ok: true, total: COUNTS[event] });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

// ─── GET — fetch current counts ───────────────────────────────────────────────

export async function GET() {
  ensureSeeded();
  return NextResponse.json({
    counts: COUNTS,
    today: TODAY,
    note: "In-memory store — resets on cold start. Connect to Vercel KV for persistence.",
  });
}
