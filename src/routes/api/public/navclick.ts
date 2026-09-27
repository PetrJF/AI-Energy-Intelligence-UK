import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// First-party, cookie-free navigation click logging. Stores the menu location,
// link label, destination, originating path, the path actually reached and a
// daily-rotating pseudonymous visitor hash.
const Schema = z.object({
  location: z.enum(["header", "dropdown", "mobile", "footer"]),
  label: z.string().trim().min(1).max(120),
  href: z.string().trim().min(1).max(300),
  from_path: z.string().trim().max(300).optional().or(z.literal("")),
  landed_path: z.string().trim().max(300).optional().or(z.literal("")),
  outcome: z.enum(["arrived", "stuck", "elsewhere"]),
  device: z.enum(["mobile", "tablet", "desktop"]).optional(),
});

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

export const Route = createFileRoute("/api/public/navclick")({
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

        const { error } = await supabaseAdmin.from("nav_clicks").insert({
          location: parsed.data.location,
          label: parsed.data.label.slice(0, 120),
          href: parsed.data.href.slice(0, 300),
          from_path: parsed.data.from_path || null,
          landed_path: parsed.data.landed_path || null,
          outcome: parsed.data.outcome,
          device: parsed.data.device ?? null,
          visitor_hash: await visitorHash(request),
        });
        if (error) console.error("nav_click insert failed", error.message);

        return new Response(null, { status: 204 });
      },
    },
  },
});
