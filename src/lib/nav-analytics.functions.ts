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

type ClickRow = {
  location: string;
  label: string;
  href: string;
  from_path: string | null;
  landed_path: string | null;
  outcome: string;
  device: string | null;
  created_at: string;
};

/** Navigation click health for the admin panel. */
export const getNavClickStats = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { days?: number }) => ({
    days: Math.min(Math.max(input?.days ?? 30, 1), 90),
  }))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const since = new Date(Date.now() - data.days * 24 * 60 * 60 * 1000).toISOString();

    const { data: rows, error } = await context.supabase
      .from("nav_clicks")
      .select("location, label, href, from_path, landed_path, outcome, device, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(50000);
    if (error) throw new Error(error.message);

    const clicks = (rows ?? []) as ClickRow[];

    type Agg = {
      key: string;
      location: string;
      label: string;
      href: string;
      clicks: number;
      arrived: number;
      failed: number;
      lastFailedAt: string | null;
      failedFrom: string[];
    };
    const map = new Map<string, Agg>();
    for (const c of clicks) {
      const key = `${c.location}|${c.label}|${c.href}`;
      let a = map.get(key);
      if (!a) {
        a = {
          key,
          location: c.location,
          label: c.label,
          href: c.href,
          clicks: 0,
          arrived: 0,
          failed: 0,
          lastFailedAt: null,
          failedFrom: [],
        };
        map.set(key, a);
      }
      a.clicks += 1;
      if (c.outcome === "arrived") a.arrived += 1;
      else {
        a.failed += 1;
        if (!a.lastFailedAt) a.lastFailedAt = c.created_at;
        const from = c.from_path ?? "unknown";
        if (a.failedFrom.length < 5 && !a.failedFrom.includes(from)) a.failedFrom.push(from);
      }
    }

    const links = Array.from(map.values())
      .map((a) => ({
        ...a,
        failRatePct: a.clicks > 0 ? +((a.failed / a.clicks) * 100).toFixed(1) : 0,
      }))
      .sort((x, y) => y.failed - x.failed || y.clicks - x.clicks);

    const byLocationMap = new Map<string, { clicks: number; failed: number }>();
    for (const c of clicks) {
      const e = byLocationMap.get(c.location) ?? { clicks: 0, failed: 0 };
      e.clicks += 1;
      if (c.outcome !== "arrived") e.failed += 1;
      byLocationMap.set(c.location, e);
    }

    const totalClicks = clicks.length;
    const totalFailed = clicks.filter((c) => c.outcome !== "arrived").length;

    return {
      range: { days: data.days, since },
      totals: {
        clicks: totalClicks,
        failed: totalFailed,
        failRatePct: totalClicks > 0 ? +((totalFailed / totalClicks) * 100).toFixed(1) : 0,
      },
      byLocation: Array.from(byLocationMap.entries())
        .map(([location, v]) => ({ location, ...v }))
        .sort((a, b) => b.clicks - a.clicks),
      problemLinks: links.filter((l) => l.failed > 0).slice(0, 25),
      topLinks: links.slice().sort((a, b) => b.clicks - a.clicks).slice(0, 20),
    };
  });
