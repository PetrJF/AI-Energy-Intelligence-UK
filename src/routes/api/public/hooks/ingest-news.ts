// Cron endpoint — pg_cron POSTs here once daily at 08:15 Europe/London
// (scheduled at 07:15 and 08:15 UTC with a London-local time guard, so it
// stays at 08:15 across GMT/BST).
// Auth: requires the Supabase publishable/anon key in the `apikey` header,
// matching the pg_cron entry. Extra safety: this route is under /api/public/
// so no auth middleware runs — we check the key ourselves.

import { createFileRoute } from "@tanstack/react-router";
import { runNewsIngestion } from "@/lib/news-ingestion.server";

export const Route = createFileRoute("/api/public/hooks/ingest-news")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const provided = request.headers.get("apikey");
        const expected =
          process.env.SUPABASE_PUBLISHABLE_KEY ??
          process.env.SUPABASE_ANON_KEY ??
          "";
        if (!expected || provided !== expected) {
          return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401, headers: { "Content-Type": "application/json" } },
          );
        }

        try {
          const summary = await runNewsIngestion();
          return new Response(JSON.stringify(summary), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (e) {
          const message = e instanceof Error ? e.message : String(e);
          console.error("[ingest-news] fatal", message);
          return new Response(
            JSON.stringify({ error: message }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
      // GET returns the last few runs — handy for a health check
      GET: async ({ request }) => {
        const provided = request.headers.get("apikey");
        const expected =
          process.env.SUPABASE_PUBLISHABLE_KEY ??
          process.env.SUPABASE_ANON_KEY ??
          "";
        if (!expected || provided !== expected) {
          return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401, headers: { "Content-Type": "application/json" } },
          );
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin
          .from("news_ingestion_runs")
          .select("*")
          .order("started_at", { ascending: false })
          .limit(10);
        if (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify({ runs: data }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
