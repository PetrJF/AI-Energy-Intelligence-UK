import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { getSiteAnalytics } from "@/lib/site-analytics.functions";
import { NavClicksPanel } from "@/components/admin/NavClicksPanel";
import { cn } from "@/lib/utils";

function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-semibold tabular-nums">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

function BarList({
  rows,
  empty,
  labelWidth = "w-64",
}: {
  rows: { key: string; count: number }[];
  empty: string;
  labelWidth?: string;
}) {
  if (rows.length === 0) return <p className="text-sm text-muted-foreground">{empty}</p>;
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <div key={r.key} className="flex items-center gap-3">
          <span className={cn("truncate text-sm", labelWidth)} title={r.key}>
            {r.key}
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded bg-secondary">
            <div className="h-full bg-brand-gradient" style={{ width: `${(r.count / max) * 100}%` }} />
          </div>
          <span className="w-14 text-right text-sm tabular-nums">{r.count.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export function TrafficPanel() {
  const [days, setDays] = useState(30);
  const fetchAnalytics = useServerFn(getSiteAnalytics);
  const q = useQuery({
    queryKey: ["admin", "site-analytics", days],
    queryFn: () => fetchAnalytics({ data: { days } }),
    retry: false,
  });

  const d = q.data;
  const maxDay = Math.max(1, ...(d?.traffic.byDay ?? []).map((x) => x.views));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Range:</span>
        {[1, 7, 30, 90].map((n) => (
          <button
            key={n}
            onClick={() => setDays(n)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm",
              days === n
                ? "border-brand bg-brand text-white"
                : "border-border bg-background hover:bg-secondary",
            )}
          >
            {n === 1 ? "Last 24 hours" : `Last ${n} days`}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">
          First-party, cookie-free measurement — counts start from when tracking was switched on.
        </span>
      </div>

      {q.isLoading && (
        <div className="grid place-items-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {q.isError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm">
          Failed to load site analytics.
          <pre className="mt-2 whitespace-pre-wrap text-xs text-muted-foreground">
            {(q.error as Error)?.message}
          </pre>
        </div>
      )}

      {d && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              label="Page views"
              value={d.traffic.totalViews.toLocaleString()}
              hint={
                d.traffic.changePct === null
                  ? "Comparison unavailable — the previous period predates the start of tracking, so it is not a like-for-like baseline"
                  : `${d.traffic.changePct >= 0 ? "+" : ""}${d.traffic.changePct}% vs previous ${days === 1 ? "24 hours" : `${days} days`}`
              }
            />
            <Stat
              label="Daily unique visitors, summed"
              value={d.traffic.uniqueVisitors.toLocaleString()}
              hint="The anonymous identifier rotates daily, so the same person counts once per day they visit"
            />
            <Stat
              label="Views per daily visitor"
              value={d.traffic.viewsPerVisitor}
              hint="Page views ÷ summed daily unique visitors"
            />
            <Stat
              label="Submission rate"
              value={`${d.conversion.submissionRatePct}%`}
              hint={`${d.conversion.leadsInRange} form submissions ÷ summed daily unique visitors, same range`}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Tracking began {d.measurement.trackingStartedAt
              ? new Date(d.measurement.trackingStartedAt).toISOString().slice(0, 10)
              : "—"}
            . Admin and sign-in pages are excluded from these figures
            {d.measurement.excludedInternalViews > 0
              ? ` (${d.measurement.excludedInternalViews.toLocaleString()} views excluded in this range)`
              : ""}
            ; no other internal or preview marker was ever recorded, so earlier developer
            activity cannot be identified retrospectively.
          </p>

          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <h3 className="mb-3 font-display text-lg font-semibold">Views per day</h3>
            {d.traffic.byDay.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No page views recorded yet in this range.
              </p>
            ) : (
              <div className="flex h-40 items-end gap-1">
                {d.traffic.byDay.map((x) => (
                  <div
                    key={x.day}
                    className="flex flex-1 flex-col items-center gap-1"
                    title={`${x.day}: ${x.views} views · ${x.visitors} visitors`}
                  >
                    <div
                      className="w-full rounded-t bg-brand-gradient"
                      style={{ height: `${(x.views / maxDay) * 100}%`, minHeight: 2 }}
                    />
                    <span className="origin-left translate-y-2 rotate-45 text-[9px] text-muted-foreground">
                      {x.day.slice(5)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-4 shadow-card">
              <h3 className="mb-3 font-display text-lg font-semibold">Top pages</h3>
              <BarList rows={d.traffic.topPages} empty="No page views yet." />
            </div>
            <div className="rounded-xl border border-border bg-card p-4 shadow-card">
              <h3 className="mb-3 font-display text-lg font-semibold">Sections</h3>
              <BarList rows={d.traffic.bySection} empty="No page views yet." labelWidth="w-40" />
            </div>
            <div className="rounded-xl border border-border bg-card p-4 shadow-card">
              <h3 className="mb-3 font-display text-lg font-semibold">Referrers</h3>
              <BarList
                rows={d.traffic.referrers}
                empty="No external referrers recorded (direct traffic only so far)."
                labelWidth="w-48"
              />
            </div>
            <div className="rounded-xl border border-border bg-card p-4 shadow-card">
              <h3 className="mb-3 font-display text-lg font-semibold">Devices</h3>
              <BarList rows={d.traffic.devices} empty="No device data yet." labelWidth="w-28" />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-4 shadow-card">
              <h3 className="mb-3 font-display text-lg font-semibold">
                Most-read articles &amp; reports
              </h3>
              <BarList
                rows={d.content.topArticles}
                empty="No article views recorded yet."
                labelWidth="w-64"
              />
            </div>
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-4 shadow-card">
                <h3 className="mb-3 font-display text-lg font-semibold">Tool engagement</h3>
                <p className="mb-3 text-xs text-muted-foreground">
                  Calculations saved to user dashboards in this range: {d.conversion.savedCalculations}
                </p>
                <BarList
                  rows={d.conversion.topCalculators}
                  empty="No saved calculations in this range."
                  labelWidth="w-48"
                />
              </div>
              <div className="rounded-xl border border-border bg-card p-4 shadow-card">
                <h3 className="mb-3 font-display text-lg font-semibold">Publishing pipeline</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">Published analysis</div>
                    <div className="font-display text-xl tabular-nums">
                      {d.content.publishedPosts}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Drafts</div>
                    <div className="font-display text-xl tabular-nums">{d.content.draftPosts}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Published news</div>
                    <div className="font-display text-xl tabular-nums">
                      {d.content.publishedNews}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">News awaiting review</div>
                    <div className="font-display text-xl tabular-nums">{d.content.pendingNews}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <NavClicksPanel days={days} />

          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {d.traffic.changePct !== null && d.traffic.changePct >= 0 ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            Traffic is measured on this site without cookies; visitor counts use a daily-rotating
            anonymous hash, so a returning visitor is counted once per day.
          </p>
        </>
      )}
    </div>
  );
}
