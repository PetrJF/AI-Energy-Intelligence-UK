// Server-only uptime alert email, sent through Brevo via the Lovable
// connector gateway (same transport as the lead confirmation emails).

import type { CheckResult } from "./run-checks.server";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/brevo";
const FROM_EMAIL = "hello@aienergyintelligence.co.uk";
const FROM_NAME = "AIEI Uptime Monitor";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(r: CheckResult): string {
  const detail = r.failure_reason ?? "Recovered";
  return `<li style="margin-bottom:6px">
    <strong>${escapeHtml(r.target.label)}</strong>
    <span style="color:#666">(${escapeHtml(r.target.environment)})</span><br/>
    <a href="${escapeHtml(r.target.url)}">${escapeHtml(r.target.url)}</a><br/>
    <span style="color:#444">${escapeHtml(detail)} — ${r.latency_ms}ms</span>
  </li>`;
}

export async function sendUptimeAlert(args: {
  to: string;
  down: CheckResult[];
  recovered: CheckResult[];
}): Promise<void> {
  const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  if (!LOVABLE_API_KEY || !BREVO_API_KEY) {
    console.warn("[uptime] Brevo not configured; alert not sent");
    return;
  }

  const subject = args.down.length
    ? `DOWN: ${args.down.map((d) => d.target.label).join(", ")}`
    : `RECOVERED: ${args.recovered.map((d) => d.target.label).join(", ")}`;

  const htmlContent = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111">
    <h1 style="font-size:18px;margin:0 0 12px">AI Energy Intelligence — uptime alert</h1>
    ${
      args.down.length
        ? `<h2 style="font-size:15px;color:#b91c1c;margin:16px 0 6px">Failing</h2><ul style="padding-left:18px">${args.down.map(row).join("")}</ul>`
        : ""
    }
    ${
      args.recovered.length
        ? `<h2 style="font-size:15px;color:#15803d;margin:16px 0 6px">Back to normal</h2><ul style="padding-left:18px">${args.recovered.map(row).join("")}</ul>`
        : ""
    }
    <p style="margin-top:20px;font-size:13px;color:#444">
      Full history: <a href="https://aienergyintelligence.co.uk/AIAdmin">admin panel → Uptime</a>
    </p>
    <p style="font-size:12px;color:#777">Checked at ${new Date().toISOString()} UTC.</p>
  </div>`;

  try {
    const res = await fetch(`${GATEWAY_URL}/v3/smtp/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: FROM_NAME, email: FROM_EMAIL },
        replyTo: { email: "info@aienergyintelligence.co.uk" },
        to: [{ email: args.to }],
        subject,
        htmlContent,
      }),
    });
    if (!res.ok) {
      console.error(`[uptime] Brevo send failed [${res.status}]: ${await res.text()}`);
    }
  } catch (e) {
    console.error("[uptime] Brevo send threw", e);
  }
}
