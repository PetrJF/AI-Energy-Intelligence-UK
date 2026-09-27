import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const SubmissionSchema = z.object({
  claim: z.string().trim().min(5).max(500),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  source_url: z.string().trim().url().max(500).optional().or(z.literal("")),
});

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 8;
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

export const Route = createFileRoute("/api/public/myth-submissions")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }

        const parsed = SubmissionSchema.safeParse(body);
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

        const userAgent = request.headers.get("user-agent")?.slice(0, 500) ?? null;
        const data = parsed.data;

        const { error } = await supabaseAdmin.from("myth_submissions").insert({
          claim: data.claim,
          email: data.email ? data.email.toLowerCase() : null,
          source_url: data.source_url || null,
          user_agent: userAgent,
          ip_hash: ipHash,
        });

        if (error) {
          console.error("[myth-submissions] insert failed", error);
          return Response.json({ error: "Failed to save submission" }, { status: 500 });
        }

        return Response.json({ ok: true }, { status: 201 });
      },
    },
  },
});
