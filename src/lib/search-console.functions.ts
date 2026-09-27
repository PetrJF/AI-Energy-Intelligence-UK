import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";
const SITE_URL = "sc-domain:aienergyintelligence.co.uk";

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error("Role check failed");
  if (!data) throw new Error("Forbidden");
}

function isoDaysAgo(days: number) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

export const getSearchConsoleData = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { days?: number }) => ({
    days: Math.min(Math.max(input?.days ?? 7, 1), 90),
  }))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);

    const lovableKey = process.env.LOVABLE_API_KEY;
    const gscKey = process.env.GOOGLE_SEARCH_CONSOLE_API_KEY;
    if (!lovableKey || !gscKey) {
      throw new Error("Search Console connector is not configured.");
    }

    const startDate = isoDaysAgo(data.days);
    const endDate = isoDaysAgo(0);
    const encodedSite = encodeURIComponent(SITE_URL);
    const url = `${GATEWAY}/webmasters/v3/sites/${encodedSite}/searchAnalytics/query`;

    // Every request below shares the same property, search type, date range
    // and (absent) filters so the headline cards, tables and CSV exports
    // describe exactly the same dataset.
    const SEARCH_TYPE = "web";
    const QUERY_ROW_LIMIT = 1000;
    const PAGE_ROW_LIMIT = 1000;

    async function runQuery(dimensions: string[], rowLimit = 100) {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": gscKey!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate,
          endDate,
          dimensions,
          rowLimit,
          type: SEARCH_TYPE,
          dataState: "all",
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Search Console ${dimensions.join("+")} failed [${res.status}]: ${body}`);
      }
      const json = (await res.json()) as { rows?: Array<{ keys: string[]; clicks: number; impressions: number; ctr: number; position: number }> };
      return json.rows ?? [];
    }

    const [queryRows, pageRows, totalsRows] = await Promise.all([
      runQuery(["query"], QUERY_ROW_LIMIT),
      runQuery(["page"], PAGE_ROW_LIMIT),
      runQuery([], 1),
    ]);

    const totals = totalsRows[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 };

    const sum = (rows: Array<{ clicks: number; impressions: number }>) => ({
      clicks: rows.reduce((n, r) => n + (r.clicks ?? 0), 0),
      impressions: rows.reduce((n, r) => n + (r.impressions ?? 0), 0),
    });

    return {
      range: { startDate, endDate, days: data.days },
      site: SITE_URL,
      searchType: SEARCH_TYPE,
      fetchedAt: new Date().toISOString(),
      // Row limits requested from Google, so the UI can distinguish "all rows
      // Google returned" from "the table was truncated at our limit".
      limits: { queries: QUERY_ROW_LIMIT, pages: PAGE_ROW_LIMIT },
      // Google withholds rare queries for privacy, so these sums are normally
      // lower than the headline totals. Never reconcile them artificially.
      rowSums: { queries: sum(queryRows), pages: sum(pageRows) },
      totals: {
        clicks: totals.clicks,
        impressions: totals.impressions,
        ctr: totals.ctr,
        position: totals.position,
      },
      queries: queryRows.map((r) => ({
        query: r.keys[0],
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: r.ctr,
        position: r.position,
      })),
      pages: pageRows.map((r) => ({
        page: r.keys[0],
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: r.ctr,
        position: r.position,
      })),
    };
  });
