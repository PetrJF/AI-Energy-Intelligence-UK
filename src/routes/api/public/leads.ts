import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendLeadConfirmation } from "@/lib/email/send-lead-confirmation.server";
import { addToTrackerList } from "@/lib/email/brevo.server";
import { buildTrackerCsv } from "@/lib/tracker-csv.server";
import { verifyChallenge } from "@/lib/captcha.server";

const LeadSchema = z.object({
  email: z.string().trim().email().max(255),
  source: z.enum([
    "readiness-checker",
    "savings-calculator",
    "risk-checker",
    "homepage-newsletter",
    "footer-newsletter",
    "checklist",
    "ai-electricity-guide",
    "contact-enquiry",
    "consultancy-enquiry",
    "report-download",
    "energy-index",
    "tracker-csv",
    "project-alert",
    "region-alert",
    "tracker-updates",
    "services-enquiry",
  ]),
  variant: z.enum(["results", "newsletter", "checklist", "enquiry", "download", "alert"]),
  inputs: z.record(z.string(), z.any()).optional().nullable(),
  result_summary: z.record(z.string(), z.any()).optional().nullable(),
  consent_marketing: z.boolean().optional().default(false),
  // Honeypot: must be empty. Timing: humans take more than ~1.5s to fill the form.
  hp_website: z.string().optional().nullable(),
  elapsed_ms: z.number().optional().nullable(),
  // Server-issued captcha (optional per-source: enforced for report-download).
  captcha_token: z.string().optional().nullable(),
  captcha_answer: z.union([z.string(), z.number()]).optional().nullable(),
});

// Bots typically fill the hidden field or submit near-instantly.
const MIN_ELAPSED_MS = 1500;

// Per-IP in-memory rate limit. Worker instances are short-lived but this is
// enough to stop trivial spam bursts. Move to a DB-backed limiter if abuse
// becomes a real problem.
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_WINDOW = 10;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= MAX_PER_WINDOW) {
    hits.set(key, arr);
    return true;
  }
  arr.push(now);
  hits.set(key, arr);
  return false;
}

async function hashIp(ip: string | null): Promise<string | null> {
  if (!ip) return null;
  const data = new TextEncoder().encode(ip + "|aiei");
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .slice(0, 12)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const Route = createFileRoute("/api/public/leads")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }

        const parsed = LeadSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { error: "Invalid payload", details: parsed.error.flatten() },
            { status: 400 },
          );
        }

        // Spam protection: honeypot + timing. Return a fake 201 so bots can't
        // distinguish a rejection from a success and won't retry differently.
        const hp = parsed.data.hp_website?.trim() ?? "";
        const elapsed = parsed.data.elapsed_ms ?? null;
        if (hp !== "" || (elapsed !== null && elapsed < MIN_ELAPSED_MS)) {
          return Response.json({ id: "ok" }, { status: 201 });
        }

        // Captcha: required for sources gated behind a public dialog.
        const CAPTCHA_REQUIRED: ReadonlyArray<typeof parsed.data.source> = [
          "report-download",
          "services-enquiry",
        ];
        if (CAPTCHA_REQUIRED.includes(parsed.data.source)) {
          const ok = verifyChallenge(
            parsed.data.captcha_token ?? "",
            parsed.data.captcha_answer ?? "",
          );
          if (!ok) {
            return Response.json(
              { error: "Captcha failed. Please try again." },
              { status: 400 },
            );
          }
        }



        const ip =
          request.headers.get("cf-connecting-ip") ??
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          null;
        const ipHash = await hashIp(ip);
        if (ipHash && rateLimited(ipHash)) {
          return Response.json({ error: "Too many requests" }, { status: 429 });
        }

        const userAgent = request.headers.get("user-agent")?.slice(0, 500) ?? null;
        const data = parsed.data;
        const email = data.email.toLowerCase();

        // Alerts must say what they are watching.
        if (data.source === "project-alert") {
          const slug = data.inputs?.project_slug;
          if (typeof slug !== "string" || !/^[a-z0-9-]{1,200}$/.test(slug)) {
            return Response.json({ error: "Missing project" }, { status: 400 });
          }
        }
        if (data.source === "region-alert") {
          const region = data.inputs?.region;
          if (typeof region !== "string" || region.trim() === "" || region.length > 200) {
            return Response.json({ error: "Missing region" }, { status: 400 });
          }
        }

        const { data: inserted, error } = await supabaseAdmin
          .from("leads")
          .insert({
            email,
            source: data.source,
            variant: data.variant,
            inputs: data.inputs ?? null,
            result_summary: data.result_summary ?? null,
            consent_marketing: data.consent_marketing ?? false,
            user_agent: userAgent,
            ip_hash: ipHash,
          })
          .select("id")
          .single();

        if (error || !inserted) {
          console.error("[leads] insert failed", error);
          return Response.json({ error: "Failed to save lead" }, { status: 500 });
        }

        // Fire-and-forget confirmation email. We never block the response on
        // it — if email isn't configured yet, the lead is still captured.
        try {
          await sendLeadConfirmation({
            id: inserted.id,
            email,
            source: data.source,
            variant: data.variant,
            inputs: data.inputs ?? null,
            resultSummary: data.result_summary ?? null,
          });
        } catch (e) {
          console.error("[leads] email send failed (non-fatal)", e);
        }

        if (data.consent_marketing) {
          await addToTrackerList(email);
        }

        if (data.source === "tracker-csv") {
          try {
            const csv = await buildTrackerCsv();
            return Response.json({ id: inserted.id, csv }, { status: 201 });
          } catch (e) {
            console.error("[leads] csv build failed", e);
            return Response.json({ error: "Export failed" }, { status: 500 });
          }
        }

        return Response.json({ id: inserted.id }, { status: 201 });
      },
    },
  },
});
