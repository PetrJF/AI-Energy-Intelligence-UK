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

/** Maps a referrer hostname to a social network label, or null if not social. */
export function socialNetwork(host: string | null): string | null {
  if (!host) return null;
  const h = host.toLowerCase();
  if (h.includes("linkedin") || h === "lnkd.in") return "LinkedIn";
  if (h === "t.co" || h.includes("twitter") || h === "x.com" || h.endsWith(".x.com")) return "X (Twitter)";
  if (h.includes("facebook") || h === "fb.me" || h.includes("fb.com")) return "Facebook";
  if (h.includes("instagram")) return "Instagram";
  if (h.includes("reddit")) return "Reddit";
  if (h.includes("youtube") || h === "youtu.be") return "YouTube";
  if (h.includes("bsky") || h.includes("bluesky")) return "Bluesky";
  if (h.includes("threads")) return "Threads";
  if (h.includes("tiktok")) return "TikTok";
  if (h.includes("pinterest") || h === "pin.it") return "Pinterest";
  if (h.includes("substack")) return "Substack";
  if (h.includes("mastodon") || h.includes("fosstodon")) return "Mastodon";
  if (h.includes("whatsapp")) return "WhatsApp";
  if (h.includes("t.me") || h.includes("telegram")) return "Telegram";
  return null;
}

type Row = {
  path: string;
  referrer_host: string | null;
  device: string | null;
  visitor_hash: string | null;
  created_at: string;
};

/** Social referral traffic from first-party page views, plus connected accounts. */
export const getSocialStats = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { days?: number }) => ({
    days: Math.min(Math.max(input?.days ?? 30, 1), 90),
  }))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabase } = context;

    const since = new Date(Date.now() - data.days * 24 * 60 * 60 * 1000).toISOString();
    const prevSince = new Date(Date.now() - data.days * 2 * 24 * 60 * 60 * 1000).toISOString();

    async function fetchViews(from: string, to?: string) {
      const page = 1000;
      const out: Row[] = [];
      for (let offset = 0; offset < 100_000; offset += page) {
        let q = supabase
          .from("page_views")
          .select("path, referrer_host, device, visitor_hash, created_at")
          .not("referrer_host", "is", null)
          .gte("created_at", from)
          .order("created_at", { ascending: false })
          .range(offset, offset + page - 1);
        if (to) q = q.lt("created_at", to);
        const res = await q;
        if (res.error) throw new Error(res.error.message);
        const batch = (res.data ?? []) as Row[];
        out.push(...batch);
        if (batch.length < page) break;
      }
      return out;
    }

    const [rows, prevRows] = await Promise.all([
      fetchViews(since),
      fetchViews(prevSince, since),
    ]);

    const social = rows.filter((r) => socialNetwork(r.referrer_host));
    const prevSocial = prevRows.filter((r) => socialNetwork(r.referrer_host));

    const byNetworkMap = new Map<string, { views: number; visitors: Set<string> }>();
    const byDayMap = new Map<string, number>();
    const landingMap = new Map<string, number>();
    const networkLandingMap = new Map<string, Map<string, number>>();

    for (const r of social) {
      const net = socialNetwork(r.referrer_host)!;
      if (!byNetworkMap.has(net)) byNetworkMap.set(net, { views: 0, visitors: new Set() });
      const n = byNetworkMap.get(net)!;
      n.views += 1;
      if (r.visitor_hash) n.visitors.add(r.visitor_hash);

      const day = r.created_at.slice(0, 10);
      byDayMap.set(day, (byDayMap.get(day) ?? 0) + 1);

      const p = r.path.split("?")[0];
      landingMap.set(p, (landingMap.get(p) ?? 0) + 1);
      if (!networkLandingMap.has(net)) networkLandingMap.set(net, new Map());
      const nl = networkLandingMap.get(net)!;
      nl.set(p, (nl.get(p) ?? 0) + 1);
    }

    const byNetwork = Array.from(byNetworkMap.entries())
      .map(([network, v]) => ({
        network,
        views: v.views,
        visitors: v.visitors.size,
        landingPages: Array.from(networkLandingMap.get(network) ?? [])
          .map(([key, count]) => ({ key, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5),
      }))
      .sort((a, b) => b.views - a.views);

    const byDay = Array.from(byDayMap.entries())
      .map(([day, views]) => ({ day, views }))
      .sort((a, b) => a.day.localeCompare(b.day));

    const totalSocialViews = social.length;
    const prevSocialViews = prevSocial.length;
    const totalReferralViews = rows.length;

    // Connected social accounts (identity only — LinkedIn grants no follower metrics
    // on the scopes available to this connection).
    const accounts: Array<{
      network: string;
      status: "connected" | "unavailable";
      name?: string;
      note: string;
    }> = [];

    const lovableKey = process.env.LOVABLE_API_KEY;
    const linkedinKey = process.env.LINKEDIN_API_KEY;
    if (lovableKey && linkedinKey) {
      try {
        const res = await fetch("https://connector-gateway.lovable.dev/linkedin/v2/userinfo", {
          headers: {
            Authorization: `Bearer ${lovableKey}`,
            "X-Connection-Api-Key": linkedinKey,
          },
        });
        if (res.ok) {
          const me = (await res.json()) as { name?: string };
          accounts.push({
            network: "LinkedIn",
            status: "connected",
            name: me.name,
            note: "Account connected. LinkedIn does not release follower or post metrics on the permissions granted here, so reach is measured by referral traffic below.",
          });
        } else {
          const body = await res.text();
          accounts.push({
            network: "LinkedIn",
            status: "unavailable",
            note: `LinkedIn check failed [${res.status}]: ${body.slice(0, 200)}`,
          });
        }
      } catch (e) {
        accounts.push({
          network: "LinkedIn",
          status: "unavailable",
          note: `LinkedIn check failed: ${(e as Error).message}`,
        });
      }
    } else {
      accounts.push({
        network: "LinkedIn",
        status: "unavailable",
        note: "LinkedIn account not connected.",
      });
    }

    accounts.push({
      network: "X (Twitter)",
      status: "unavailable",
      note: "X account not connected — figures below come from referral traffic only.",
    });
    accounts.push({
      network: "Facebook",
      status: "unavailable",
      note: "Facebook cannot be connected here — figures below come from referral traffic only.",
    });

    return {
      range: { days: data.days, since },
      totals: {
        socialViews: totalSocialViews,
        prevSocialViews,
        changePct:
          prevSocialViews > 0
            ? Math.round(((totalSocialViews - prevSocialViews) / prevSocialViews) * 100)
            : null,
        socialVisitors: new Set(social.map((r) => r.visitor_hash).filter(Boolean)).size,
        shareOfReferralsPct:
          totalReferralViews > 0
            ? +((totalSocialViews / totalReferralViews) * 100).toFixed(1)
            : 0,
      },
      byNetwork,
      byDay,
      topLandingPages: Array.from(landingMap.entries())
        .map(([key, count]) => ({ key, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15),
      accounts,
    };
  });
