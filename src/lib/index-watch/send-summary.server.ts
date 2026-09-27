// Server-only weekly source-check summary email, sent through Brevo via the
// Lovable connector gateway (same transport as the uptime alerts).

import type { WatchFinding } from "./run-checks.server";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/brevo";
const FROM_EMAIL = "hello@aienergyintelligence.co.uk";
const FROM_NAME = "AIEI Index Source Watch";
const REPLY_TO_EMAIL = "info@aienergyintelligence.co.uk";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(f: WatchFinding): string {
  return `<li style="margin-bottom:10px">
    <strong>${escapeHtml(f.watch.label)}</strong>
    <span style="color:#666">(${escapeHtml(f.watch.organisation || f.watch.area)})</span><br/>
    <span>${escapeHtml(f.title)}</span><br/>
    ${f.url ? `<a href="${escapeHtml(f.url)}">${escapeHtml(f.url)}</a><br/>` : ""}
    ${f.detail ? `<span style="color:#444">${escapeHtml(f.detail)}</span>` : ""}
  </li>`;
}

export async function sendIndexWatchSummary(args: {
  to: string;
  checked: number;
  findings: WatchFinding[];
}): Promise<void> {
  const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  if (!LOVABLE_API_KEY || !BREVO_API_KEY) {
    console.warn("[index-watch] Brevo not configured; summary not sent");
    return;
  }

  const changed = args.findings.filter((f) => f.kind !== "error");
  const errors = args.findings.filter((f) => f.kind === "error");

  const subject = changed.length
    ? `Weekly index source check — ${changed.length} source${changed.length === 1 ? "" : "s"} to review`
    : "Weekly index source check — nothing new";

  const htmlContent = `<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#111">
    <h1 style="font-size:18px;margin:0 0 6px">UK AI Energy Index — weekly source check</h1>
    <p style="font-size:14px;color:#444;margin:0 0 16px">
      ${args.checked} official source${args.checked === 1 ? "" : "s"} checked.
      No index figures have been changed — everything below needs your verification first.
    </p>
    ${
      changed.length
        ? `<h2 style="font-size:15px;margin:16px 0 6px">Updated since last week</h2><ul style="padding-left:18px">${changed.map(row).join("")}</ul>`
        : `<p style="font-size:14px;color:#15803d">No watched source has published anything new since the last check.</p>`
    }
    ${
      errors.length
        ? `<h2 style="font-size:15px;color:#b91c1c;margin:16px 0 6px">Could not be checked</h2><ul style="padding-left:18px">${errors.map(row).join("")}</ul>`
        : ""
    }
    <p style="margin-top:20px;font-size:13px;color:#444">
      Review queue: <a href="https://aienergyintelligence.co.uk/AIAdmin">admin panel → Index sources</a>
    </p>
    <p style="font-size:12px;color:#777">Run at ${new Date().toISOString()} UTC.</p>
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
        replyTo: { email: REPLY_TO_EMAIL },
        to: [{ email: args.to }],
        subject,
        htmlContent,
      }),
    });
    if (!res.ok) {
      console.error(`[index-watch] Brevo send failed [${res.status}]: ${await res.text()}`);
    }
  } catch (e) {
    console.error("[index-watch] Brevo send threw", e);
  }
}
