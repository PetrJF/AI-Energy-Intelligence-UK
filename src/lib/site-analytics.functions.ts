import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error("Role check failed");
  if (!data) throw new Error("Forbidden");
}

type Row = {
  path: string;
  referrer_host: string | null;
  device: string | null;
  visitor_hash: string | null;
  created_at: string;
};

function topBy<T extends string>(rows: Row[], pick: (r: Row) => T | null, limit: number) {
  const map = new Map<string, number>();
  for (const r of rows) {
    const k = pick(r);
    if (!k) continue;
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/** First-party site traffic + content engagement for the admin panel. */
export const getSiteAnalytics = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { days?: number }) => ({
    days: Math.min(Math.max(input?.days ?? 30, 1), 90),
  }))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabase } = context;

    const since = new Date(Date.now() - data.days * 24 * 60 * 60 * 1000).toISOString();
    const prevSince = new Date(Date.now() - data.days * 2 * 24 * 60 * 60 * 1000).toISOString();

    // PostgREST caps a single response at 1000 rows, so page through the
    // window explicitly instead of relying on .limit().
    async function fetchAllViews(): Promise<{ data: Row[] | null; error: { message: string } | null }> {
      const page = 1000;
      const out: Row[] = [];
      for (let from = 0; from < 100_000; from += page) {
        const res = await supabase
          .from("page_views")
          .select("path, referrer_host, device, visitor_hash, created_at")
          .gte("created_at", since)
          .order("created_at", { ascending: false })
          .range(from, from + page - 1);
        if (res.error) return { data: null, error: res.error };
        const batch = (res.data ?? []) as Row[];
        out.push(...batch);
        if (batch.length < page) break;
      }
      return { data: out, error: null };
    }

    const [viewsRes, prevViewsRes, blogRes, newsRes, leadsRes, calcsRes, firstViewRes] =
      await Promise.all([
      fetchAllViews(),
      // Same internal-path exclusion as the current window, so the comparison
      // measures the same audience in both periods.
      supabase
        .from("page_views")
        .select("visitor_hash", { count: "exact", head: true })
        .gte("created_at", prevSince)
        .lt("created_at", since)
        .not("path", "ilike", "/aiadmin%")
        .not("path", "ilike", "/login%"),
      supabase
        .from("blog_posts")
        .select("id, title, slug, pillar, status, published_at")
        .order("published_at", { ascending: false })
        .limit(500),
      supabase
        .from("news_articles")
        .select("id, status, review_status, published_at")
        .limit(2000),
      supabase
        .from("leads")
        .select("source, created_at", { count: "exact" })
        .gte("created_at", since)
        .limit(1000),
      supabase
        .from("saved_calculations")
        .select("tool_slug, created_at", { count: "exact" })
        .gte("created_at", since)
        .limit(1000),
      supabase
        .from("page_views")
        .select("created_at")
        .order("created_at", { ascending: true })
        .limit(1),
    ]);

    if (viewsRes.error) throw new Error(viewsRes.error.message);

    // Internal activity: admin and sign-in pages are excluded from audience
    // reporting. No other internal marker was ever recorded, so historic
    // preview/developer visits cannot be identified retrospectively.
    const isInternalPath = (p: string) => {
      const base = p.split("?")[0].toLowerCase();
      return base.startsWith("/aiadmin") || base.startsWith("/login");
    };
    const allRows = (viewsRes.data ?? []) as Row[];
    const rows = allRows.filter((r) => !isInternalPath(r.path));
    const excludedInternalViews = allRows.length - rows.length;

    // Measurement only began when first-party tracking was switched on, so a
    // comparison window that predates it is not a like-for-like baseline.
    const trackingStartedAt =
      ((firstViewRes.data ?? [])[0] as { created_at?: string } | undefined)?.created_at ?? null;
    const comparisonComplete =
      !!trackingStartedAt && new Date(trackingStartedAt).getTime() <= new Date(prevSince).getTime();

    // Views per day
    const byDayMap = new Map<string, number>();
    const visitorsByDay = new Map<string, Set<string>>();
    for (const r of rows) {
      const day = r.created_at.slice(0, 10);
      byDayMap.set(day, (byDayMap.get(day) ?? 0) + 1);
      if (r.visitor_hash) {
        if (!visitorsByDay.has(day)) visitorsByDay.set(day, new Set());
        visitorsByDay.get(day)!.add(r.visitor_hash);
      }
    }
    const byDay = Array.from(byDayMap.entries())
      .map(([day, views]) => ({ day, views, visitors: visitorsByDay.get(day)?.size ?? 0 }))
      .sort((a, b) => a.day.localeCompare(b.day));

    const uniqueVisitors = new Set(rows.map((r) => r.visitor_hash).filter(Boolean)).size;

    // Section grouping (first path segment)
    const section = (p: string) => {
      const seg = p.split("?")[0].split("/").filter(Boolean)[0];
      return seg ? `/${seg}` : "/ (home)";
    };
    const bySectionMap = new Map<string, number>();
    for (const r of rows) bySectionMap.set(section(r.path), (bySectionMap.get(section(r.path)) ?? 0) + 1);
    const bySection = Array.from(bySectionMap.entries())
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);

    const leads = leadsRes.data ?? [];
    const leadsCount = leadsRes.count ?? leads.length;
    const calcs = calcsRes.data ?? [];
    const calcsCount = calcsRes.count ?? calcs.length;
    const calcMap = new Map<string, number>();
    for (const c of calcs as any[]) {
      const k = c.tool_slug ?? "unknown";
      calcMap.set(k, (calcMap.get(k) ?? 0) + 1);
    }

    const blog = (blogRes.data ?? []) as any[];
    const news = (newsRes.data ?? []) as any[];

    // Blog article views matched by /blog/<slug> or /news/<slug>
    const articleViews = new Map<string, number>();
    for (const r of rows) {
      const p = r.path.split("?")[0];
      if (p.startsWith("/blog/") || p.startsWith("/news/") || p.startsWith("/reports/")) {
        articleViews.set(p, (articleViews.get(p) ?? 0) + 1);
      }
    }

    const totalViews = rows.length;
    const prevViews = prevViewsRes.count ?? 0;

    return {
      range: { days: data.days, since },
      measurement: {
        trackingStartedAt,
        comparisonComplete,
        excludedInternalViews,
      },
      traffic: {
        totalViews,
        prevViews,
        changePct:
          comparisonComplete && prevViews > 0
            ? Math.round(((totalViews - prevViews) / prevViews) * 100)
            : null,
        // The visitor hash rotates every day, so this is the sum of each day's
        // distinct visitors — one person browsing on three days counts three
        // times. It is not a count of distinct people over the range.
        uniqueVisitors,
        viewsPerVisitor: uniqueVisitors > 0 ? +(totalViews / uniqueVisitors).toFixed(2) : 0,
        byDay,
        topPages: topBy(rows, (r) => r.path.split("?")[0] as any, 20),
        bySection,
        referrers: topBy(rows, (r) => r.referrer_host as any, 12),
        devices: topBy(rows, (r) => (r.device ?? "unknown") as any, 4),
      },
      content: {
        topArticles: Array.from(articleViews.entries())
          .map(([key, count]) => ({ key, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 15),
        publishedPosts: blog.filter((b) => b.status === "published").length,
        draftPosts: blog.filter((b) => b.status !== "published").length,
        publishedNews: news.filter((n) => n.status === "published").length,
        pendingNews: news.filter((n) => n.review_status === "pending").length,
      },
      conversion: {
        // Numerator: all form submissions of any kind stored in `leads` within
        // the selected range (including repeat submissions from the same
        // person). Denominator: summed daily unique visitors over the same
        // range. This is a submission rate, not a distinct-person conversion.
        leadsInRange: leadsCount,
        submissionRatePct:
          uniqueVisitors > 0 ? +((leadsCount / uniqueVisitors) * 100).toFixed(2) : 0,
        savedCalculations: calcsCount,
        topCalculators: Array.from(calcMap.entries())
          .map(([key, count]) => ({ key, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
      },
    };
  });
