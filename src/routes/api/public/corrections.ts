import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Visitor-submitted corrections. Submissions enter an administrator review
// queue: nothing published is altered automatically.
const CorrectionSchema = z.object({
  page_or_record: z.string().trim().min(3).max(300),
  description: z.string().trim().min(10).max(2000),
  suggested_correction: z.string().trim().max(2000).optional().or(z.literal("")),
  source_url: z.string().trim().url().max(500).optional().or(z.literal("")),
  name: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
});

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 6;
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
  const data = new TextEncoder().encode(ip + "|aie-corrections");
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .slice(0, 12)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const Route = createFileRoute("/api/public/corrections")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }

        const parsed = CorrectionSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { error: "Invalid payload", details: parsed.error.flatten() },
            { status: 400 },
          );
        }

        const ip =
          request.headers.get("cf-connecting-ip") ??
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          null;
        const ipHash = await hashIp(ip);
        if (ipHash && rateLimited(ipHash)) {
          return Response.json({ error: "Too many requests" }, { status: 429 });
        }

        const d = parsed.data;
        const { error } = await supabaseAdmin.from("correction_submissions").insert({
          page_or_record: d.page_or_record,
          description: d.description,
          suggested_correction: d.suggested_correction || null,
          source_url: d.source_url || null,
          submitter_name: d.name || null,
          submitter_email: d.email ? d.email.toLowerCase() : null,
          user_agent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
          ip_hash: ipHash,
        } as never);

        if (error) {
          console.error("[corrections] insert failed", error);
          return Response.json({ error: "Failed to save submission" }, { status: 500 });
        }

        return Response.json({ ok: true }, { status: 201 });
      },
    },
  },
});
