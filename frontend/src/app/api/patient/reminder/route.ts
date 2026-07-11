// Copyright © 2026 Browns Studio
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const getResend = () => new Resend(process.env.RESEND_API_KEY ?? "placeholder");

const FROM_EMAIL = "noreply@trustleaf.cl";
const PAIN_DIARY_URL = process.env.NEXT_PUBLIC_APP_URL
  ? `${process.env.NEXT_PUBLIC_APP_URL}/patient/pain-diary`
  : "https://trustleaf.cl/patient/pain-diary";

function buildEmailHtml(patientName?: string): string {
  const greeting = patientName ? `Hola ${patientName}` : "Hola";
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TrustLeaf — Recordatorio de dolor</title>
</head>
<body style="margin:0;padding:0;background-color:#0F172A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F172A;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background-color:#1E293B;border-radius:16px;border:1px solid #334155;overflow:hidden;max-width:100%;">
          <!-- Header -->
          <tr>
            <td style="padding:28px 32px;border-bottom:1px solid #334155;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:36px;height:36px;background-color:#10B981;border-radius:8px;text-align:center;vertical-align:middle;">
                    <span style="color:#0F172A;font-weight:900;font-size:14px;">TL</span>
                  </td>
                  <td style="padding-left:10px;">
                    <span style="color:#ffffff;font-weight:700;font-size:16px;">TrustLeaf</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 32px 24px;">
              <p style="color:#94A3B8;font-size:14px;margin:0 0 8px;">Recordatorio diario</p>
              <h1 style="color:#ffffff;font-size:22px;font-weight:700;margin:0 0 16px;line-height:1.3;">
                ${greeting}, ¿registraste tu dolor hoy?
              </h1>
              <p style="color:#94A3B8;font-size:15px;line-height:1.6;margin:0 0 28px;">
                Llevar un registro diario de tu dolor ayuda a tu médico a darte un mejor
                tratamiento. Solo toma un minuto completarlo.
              </p>
              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#10B981;border-radius:12px;">
                    <a href="${PAIN_DIARY_URL}"
                       style="display:inline-block;padding:14px 28px;color:#0F172A;font-weight:700;font-size:15px;text-decoration:none;border-radius:12px;">
                      Registrar ahora →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #334155;">
              <p style="color:#475569;font-size:12px;margin:0;line-height:1.5;">
                Recibiste este mensaje porque activaste los recordatorios en tu cuenta de TrustLeaf.
                Puedes desactivarlos en cualquier momento desde
                <a href="${PAIN_DIARY_URL.replace("/pain-diary", "/settings")}" style="color:#10B981;text-decoration:none;">Ajustes</a>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Verify cron secret
  const authHeader = req.headers.get("Authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse body
  let email: string;
  let patientName: string | undefined;

  try {
    const body = (await req.json()) as { email?: string; patientName?: string };
    if (!body.email || typeof body.email !== "string") {
      return NextResponse.json(
        { error: "Missing required field: email" },
        { status: 400 }
      );
    }
    email = body.email;
    patientName = typeof body.patientName === "string" ? body.patientName : undefined;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Send email via Resend
  const resend = getResend();
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [email],
    subject: "TrustLeaf — ¿Registraste tu dolor hoy?",
    html: buildEmailHtml(patientName),
  });

  if (error) {
    console.error("[reminder] Resend error:", error);
    return NextResponse.json({ error: "Failed to send email", detail: error }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: data?.id }, { status: 200 });
}
