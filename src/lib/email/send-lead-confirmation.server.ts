// Server-only helper that sends lead emails via Brevo (through the Lovable
// connector gateway). Branches by variant/source so enquirers never receive
// the "Your report is ready" email.

import {
  REPLY_TO_EMAIL,
  SITE_URL,
  escapeHtml,
  sendBrevoEmail,
  unsubscribeFooter,
} from "./brevo.server";

type Args = {
  id: string;
  email: string;
  source: string;
  variant: string;
  inputs?: Record<string, unknown> | null;
  resultSummary: Record<string, unknown> | null;
};

const FROM_NAME = "AI Energy Intelligence UK";
const wrap = (inner: string) =>
  `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111">${inner}</div>`;

function str(v: unknown): string {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}

async function sendEnquiry(args: Args): Promise<void> {
  const i = args.inputs ?? {};
  const name = str(i.name);
  const company = str(i.company);
  const type = str(i.enquiry_type);
  const message = str(i.message);

  const detail = wrap(`
    <h1 style="font-size:18px;margin:0 0 12px">New website enquiry</h1>
    <p><strong>Name:</strong> ${escapeHtml(name || "—")}</p>
    <p><strong>Email:</strong> ${escapeHtml(args.email)}</p>
    <p><strong>Company:</strong> ${escapeHtml(company || "—")}</p>
    <p><strong>Type:</strong> ${escapeHtml(type || "—")} (${escapeHtml(args.source)})</p>
    <p><strong>Message:</strong></p>
    <p style="white-space:pre-wrap;border-left:3px solid #ccc;padding-left:12px">${escapeHtml(message)}</p>
    <p style="font-size:12px;color:#666">Reply to this email to respond directly to the enquirer.</p>`);

  await sendBrevoEmail({
    tag: "email",
    senderName: FROM_NAME,
    to: REPLY_TO_EMAIL,
    subject: `Website enquiry (${type || args.source}) from ${name || args.email}`,
    htmlContent: detail,
    replyTo: { email: args.email, ...(name ? { name } : {}) },
  });

  await sendBrevoEmail({
    tag: "email",
    senderName: FROM_NAME,
    to: args.email,
    subject: "Thanks — we've received your message",
    htmlContent: wrap(`
      <p>${name ? `Hi ${escapeHtml(name)},` : "Hello,"}</p>
      <p>Thanks, we've received your message and aim to reply within 2–3 business days.</p>
      <p>AI Energy Intelligence UK</p>`),
  });
}

export async function sendLeadConfirmation(args: Args): Promise<void> {
  if (args.variant === "enquiry") return sendEnquiry(args);

  // The CSV downloads in the browser; no email needed.
  if (args.source === "tracker-csv") return;

  if (args.source === "project-alert" || args.source === "region-alert") {
    const i = args.inputs ?? {};
    const what =
      args.source === "project-alert"
        ? `project <strong>${escapeHtml(str(i.project_name) || str(i.project_slug))}</strong>`
        : `region <strong>${escapeHtml(str(i.region))}</strong>`;
    await sendBrevoEmail({
      tag: "email",
      senderName: FROM_NAME,
      to: args.email,
      subject: "Tracker alert set up — AI Energy Intelligence UK",
      htmlContent: wrap(`
        <h1 style="font-size:20px;margin:0 0 12px">Alert set up</h1>
        <p>We'll email you when a published record for the ${what} in the UK data-centre tracker changes.</p>
        ${unsubscribeFooter(args.email)}`),
    });
    return;
  }

  const isNewsletter = args.variant === "newsletter";
  if (isNewsletter) {
    await sendBrevoEmail({
      tag: "email",
      senderName: FROM_NAME,
      to: args.email,
      subject: "You're in — the AI Energy Intelligence UK weekly briefing",
      htmlContent: wrap(`
        <h1 style="font-size:20px;margin:0 0 12px">Welcome aboard</h1>
        <p>Thanks for subscribing to AI Energy Intelligence UK updates.</p>
        <p>You'll get concise analysis on UK AI energy demand, grid impact, and infrastructure signals.</p>
        ${unsubscribeFooter(args.email)}`),
    });
    return;
  }

  const reportUrl = `${SITE_URL}/report/${args.id}`;
  const headline = (args.resultSummary?.headline as string | undefined) ?? null;
  const subline = (args.resultSummary?.subline as string | undefined) ?? null;

  await sendBrevoEmail({
    tag: "email",
    senderName: FROM_NAME,
    to: args.email,
    subject: "Your AI Energy Intelligence UK report is ready",
    htmlContent: wrap(`
      <h1 style="font-size:20px;margin:0 0 12px">Your report is ready</h1>
      ${headline ? `<p style="font-weight:600;margin:0 0 8px">${escapeHtml(headline)}</p>` : ""}
      ${subline ? `<p style="margin:0 0 16px;color:#444">${escapeHtml(subline)}</p>` : ""}
      <p>You can access your report here:</p>
      <p><a href="${reportUrl}" style="display:inline-block;background:#0b5fff;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">Open your report</a></p>
      <p style="margin-top:24px;font-size:12px;color:#666">Source: ${escapeHtml(args.source)}</p>`),
  });
}
