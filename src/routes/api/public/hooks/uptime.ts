// Cron endpoint — pg_cron POSTs here every 5 minutes to run the synthetic
// uptime checks. Auth: requires the Supabase publishable/anon key in the
// `apikey` header, matching the pg_cron entry. This route sits under
// /api/public/ so no auth middleware runs; we verify the key ourselves.

import { createFileRoute } from "@tanstack/react-router";
import { runUptimeChecks } from "@/lib/uptime/run-checks.server";

function authorised(request: Request): boolean {
  const provided = request.headers.get("apikey");
  const expected =
    process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY ?? "";
  return !!expected && provided === expected;
}

async function run(request: Request): Promise<Response> {
  if (!authorised(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    const summary = await runUptimeChecks();
    return new Response(JSON.stringify(summary), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[uptime] fatal", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const Route = createFileRoute("/api/public/hooks/uptime")({
  server: {
    handlers: {
      POST: async ({ request }) => run(request),
      GET: async ({ request }) => run(request),
    },
  },
});
