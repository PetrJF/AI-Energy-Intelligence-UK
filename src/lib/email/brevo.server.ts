// Server-only shared Brevo helpers (via the Lovable connector gateway):
// transactional sends, the "AIEI Tracker Updates" contact list, and signed
// unsubscribe tokens.

import { createHmac, timingSafeEqual } from "crypto";

export const GATEWAY_URL = "https://connector-gateway.lovable.dev/brevo";
export const FROM_EMAIL = "info@aienergyintelligence.co.uk";
export const REPLY_TO_EMAIL = "info@aienergyintelligence.co.uk";
export const SITE_URL = "https://aienergyintelligence.co.uk";
export const TRACKER_LIST_NAME = "AIEI Tracker Updates";

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function keys(): { lovable: string; brevo: string } | null {
  const lovable = process.env.LOVABLE_API_KEY;
  const brevo = process.env.BREVO_API_KEY;
  if (!lovable || !brevo) return null;
  return { lovable, brevo };
}

async function brevo(path: string, method: string, body?: unknown): Promise<Response> {
  const k = keys();
  if (!k) throw new Error("Brevo not configured");
  return fetch(`${GATEWAY_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${k.lovable}`,
      "X-Connection-Api-Key": k.brevo,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export async function sendBrevoEmail(args: {
  senderName: string;
  to: string;
  subject: string;
  htmlContent: string;
  replyTo?: { email: string; name?: string };
  tag: string;
}): Promise<boolean> {
  if (!keys()) {
    console.warn(`[${args.tag}] Brevo not configured; email not sent`);
    return false;
  }
  try {
    const res = await brevo("/v3/smtp/email", "POST", {
      sender: { name: args.senderName, email: FROM_EMAIL },
      replyTo: args.replyTo ?? { email: REPLY_TO_EMAIL },
      to: [{ email: args.to }],
      subject: args.subject,
      htmlContent: args.htmlContent,
    });
    if (!res.ok) {
      console.error(`[${args.tag}] Brevo send failed [${res.status}]: ${await res.text()}`);
      return false;
    }
    return true;
  } catch (e) {
    console.error(`[${args.tag}] Brevo send threw`, e);
    return false;
  }
}

// ---------- Contact list ----------

async function findOrCreateTrackerList(): Promise<number> {
  for (let offset = 0; offset < 1000; offset += 50) {
    const res = await brevo(`/v3/contacts/lists?limit=50&offset=${offset}`, "GET");
    if (!res.ok) throw new Error(`List lookup failed [${res.status}]: ${await res.text()}`);
    const json = (await res.json()) as { lists?: { id: number; name: string }[]; count?: number };
    const hit = (json.lists ?? []).find((l) => l.name === TRACKER_LIST_NAME);
    if (hit) return hit.id;
    if (!json.lists || json.lists.length < 50) break;
  }
  // Brevo requires a folder for new lists: use the first, or create one.
  const fRes = await brevo("/v3/contacts/folders?limit=10&offset=0", "GET");
  if (!fRes.ok) throw new Error(`Folder lookup failed [${fRes.status}]: ${await fRes.text()}`);
  const fJson = (await fRes.json()) as { folders?: { id: number }[] };
  let folderId = fJson.folders?.[0]?.id;
  if (!folderId) {
    const cf = await brevo("/v3/contacts/folders", "POST", { name: "AIEI" });
    if (!cf.ok) throw new Error(`Folder create failed [${cf.status}]: ${await cf.text()}`);
    folderId = ((await cf.json()) as { id: number }).id;
  }
  const cl = await brevo("/v3/contacts/lists", "POST", { name: TRACKER_LIST_NAME, folderId });
  if (!cl.ok) throw new Error(`List create failed [${cl.status}]: ${await cl.text()}`);
  return ((await cl.json()) as { id: number }).id;
}

export async function addToTrackerList(email: string): Promise<void> {
  if (!keys()) return;
  try {
    const listId = await findOrCreateTrackerList();
    const res = await brevo("/v3/contacts", "POST", {
      email,
      listIds: [listId],
      updateEnabled: true,
    });
    if (!res.ok && res.status !== 204) {
      console.error(`[brevo] add contact failed [${res.status}]: ${await res.text()}`);
    }
  } catch (e) {
    console.error("[brevo] add to tracker list failed", e);
  }
}

export async function removeFromTrackerList(email: string): Promise<void> {
  if (!keys()) return;
  try {
    const listId = await findOrCreateTrackerList();
    const res = await brevo(`/v3/contacts/lists/${listId}/contacts/remove`, "POST", {
      emails: [email],
    });
    if (!res.ok) {
      const t = await res.text();
      // Brevo returns 400 when the contact isn't on the list — harmless.
      if (res.status !== 400) console.error(`[brevo] remove failed [${res.status}]: ${t}`);
    }
  } catch (e) {
    console.error("[brevo] remove from tracker list failed", e);
  }
}

// ---------- Unsubscribe tokens ----------

function signingKey(): string {
  const k = process.env.LOVABLE_API_KEY;
  if (!k) throw new Error("LOVABLE_API_KEY is not configured");
  return k;
}

function sig(payload: string): string {
  return createHmac("sha256", signingKey()).update(`unsub|${payload}`).digest("base64url");
}

export function unsubscribeToken(email: string): string {
  const e = email.trim().toLowerCase();
  return `${Buffer.from(e).toString("base64url")}.${sig(e)}`;
}

export function verifyUnsubscribeToken(token: string): string | null {
  const parts = (token ?? "").split(".");
  if (parts.length !== 2) return null;
  const email = Buffer.from(parts[0]!, "base64url").toString();
  const a = Buffer.from(parts[1]!);
  const b = Buffer.from(sig(email));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return email;
}

export function unsubscribeUrl(email: string): string {
  return `${SITE_URL}/unsubscribe?token=${encodeURIComponent(unsubscribeToken(email))}`;
}

export function unsubscribeFooter(email: string): string {
  return `<p style="margin-top:24px;font-size:12px;color:#666">You're receiving this because you signed up at aienergyintelligence.co.uk.
    <a href="${unsubscribeUrl(email)}" style="color:#666">Unsubscribe</a>.</p>`;
}
