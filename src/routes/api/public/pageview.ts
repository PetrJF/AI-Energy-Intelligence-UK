import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// First-party, cookie-free page view logging. Stores only a coarse path,
// referrer host, device class and a daily-rotating pseudonymous visitor hash.
const Schema = z.object({
  path: z.string().trim().min(1).max(300),
  referrer: z.string().trim().max(500).optional().or(z.literal("")),
  device: z.enum(["mobile", "tablet", "desktop"]).optional(),
});

function referrerHost(ref?: string): string | null {
  if (!ref) return null;
  try {
    const host = new URL(ref).hostname.replace(/^www\./, "");
    if (host.endsWith("aienergyintelligence.co.uk") || host.endsWith("lovable.app")) return null;
    return host.slice(0, 120);
  } catch {
    return null;
  }
}

async function visitorHash(req: Request): Promise<string | null> {
  const ip =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    null;
  if (!ip) return null;
  const day = new Date().toISOString().slice(0, 10);
  const ua = req.headers.get("user-agent") ?? "";
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${ip}|${ua}|${day}|aiei-pv`),
  );
  return Array.from(new Uint8Array(buf))
    .slice(0, 12)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const Route = createFileRoute("/api/public/pageview")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let parsed;
        try {
          parsed = Schema.safeParse(await request.json());
        } catch {
          return new Response("Bad request", { status: 400 });
        }
        if (!parsed.success) return new Response("Bad request", { status: 400 });

        const ua = (request.headers.get("user-agent") ?? "").toLowerCase();
        if (/bot|crawler|spider|crawling|preview|headless|lighthouse/.test(ua)) {
          return new Response(null, { status: 204 });
        }

        const { error } = await supabaseAdmin.from("page_views").insert({
          path: parsed.data.path.slice(0, 300),
          referrer_host: referrerHost(parsed.data.referrer || undefined),
          device: parsed.data.device ?? null,
          visitor_hash: await visitorHash(request),
        });
        if (error) console.error("page_view insert failed", error.message);

        return new Response(null, { status: 204 });
      },
    },
  },
});
