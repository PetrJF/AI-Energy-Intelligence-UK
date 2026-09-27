// Cron endpoint for project/region tracker alerts. Auth: same `apikey`
// header check as the uptime hook. The cron job is set up separately.
import { createFileRoute } from "@tanstack/react-router";
import { runTrackerAlerts } from "@/lib/tracker-alerts.server";

function authorised(request: Request): boolean {
  const provided = request.headers.get("apikey");
  const expected =
    process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY ?? "";
  return !!expected && provided === expected;
}

async function run(request: Request): Promise<Response> {
  if (!authorised(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    return Response.json(await runTrackerAlerts(), { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[tracker-alerts] fatal", message);
    return Response.json({ error: message }, { status: 500 });
  }
}

export const Route = createFileRoute("/api/public/hooks/tracker-alerts")({
  server: {
    handlers: {
      POST: async ({ request }) => run(request),
      GET: async ({ request }) => run(request),
    },
  },
});
