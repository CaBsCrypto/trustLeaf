// Copyright © 2026 Browns Studio
import { NextRequest, NextResponse } from "next/server";

// ─── Demo recipients ──────────────────────────────────────────────────────────
// Until there is a real DB of user preferences, send to these hardcoded emails.
// Replace or extend once patient reminder preferences are stored server-side.

interface DemoRecipient {
  email: string;
  patientName?: string;
}

const DEMO_RECIPIENTS: DemoRecipient[] = [
  { email: "demo@trustleaf.cl", patientName: "Paciente Demo" },
  // Add more recipients here as needed
];

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest): Promise<NextResponse> {
  // Verify cron secret — Vercel also sets this header automatically
  const authHeader = req.headers.get("Authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (req.headers.get("x-forwarded-host")
      ? `https://${req.headers.get("x-forwarded-host")}`
      : "https://trustleaf.cl");

  const reminderEndpoint = `${baseUrl}/api/patient/reminder`;

  const results: { email: string; success: boolean; error?: string }[] = [];

  for (const recipient of DEMO_RECIPIENTS) {
    try {
      const res = await fetch(reminderEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cronSecret}`,
        },
        body: JSON.stringify({
          email: recipient.email,
          patientName: recipient.patientName,
        }),
      });

      if (res.ok) {
        console.log(`[pain-reminders] ✓ Sent to ${recipient.email}`);
        results.push({ email: recipient.email, success: true });
      } else {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        console.error(
          `[pain-reminders] ✗ Failed for ${recipient.email}:`,
          body.error ?? res.statusText
        );
        results.push({
          email: recipient.email,
          success: false,
          error: body.error ?? res.statusText,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[pain-reminders] ✗ Exception for ${recipient.email}:`, message);
      results.push({ email: recipient.email, success: false, error: message });
    }
  }

  const sent = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  console.log(
    `[pain-reminders] Done — ${sent} sent, ${failed} failed out of ${results.length} total`
  );

  return NextResponse.json(
    {
      sent,
      failed,
      total: results.length,
      results,
    },
    { status: 200 }
  );
}
