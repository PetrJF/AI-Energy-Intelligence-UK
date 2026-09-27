import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { getSocialStats } from "@/lib/social.functions";
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

export function SocialPanel() {
  const [days, setDays] = useState(30);
  const fetchSocial = useServerFn(getSocialStats);
  const q = useQuery({
    queryKey: ["admin", "social-stats", days],
    queryFn: () => fetchSocial({ data: { days } }),
    retry: false,
  });

  const d = q.data;
  const maxDay = Math.max(1, ...(d?.byDay ?? []).map((x) => x.views));
  const maxNet = Math.max(1, ...(d?.byNetwork ?? []).map((x) => x.views));

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
      </div>

      {q.isLoading && (
        <div className="grid place-items-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {q.isError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm">
          Failed to load social statistics.
          <pre className="mt-2 whitespace-pre-wrap text-xs text-muted-foreground">
            {(q.error as Error)?.message}
          </pre>
        </div>
      )}

      {d && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              label="Visits from social"
              value={d.totals.socialViews.toLocaleString()}
              hint={
                d.totals.changePct === null
                  ? "No previous period to compare"
                  : `${d.totals.changePct >= 0 ? "+" : ""}${d.totals.changePct}% vs previous period`
              }
            />
            <Stat label="People from social" value={d.totals.socialVisitors.toLocaleString()} />
            <Stat
              label="Share of all referrals"
              value={`${d.totals.shareOfReferralsPct}%`}
              hint="Of visits arriving from another website"
            />
            <Stat label="Networks seen" value={d.byNetwork.length} />
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <h3 className="mb-3 font-display text-lg font-semibold">Connected accounts</h3>
            <ul className="space-y-2">
              {d.accounts.map((a) => (
                <li key={a.network} className="flex items-start gap-2 text-sm">
                  {a.status === "connected" ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  <div>
                    <span className="font-medium">{a.network}</span>
                    {a.name && <span className="text-muted-foreground"> — {a.name}</span>}
                    <p className="text-xs text-muted-foreground">{a.note}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <h3 className="mb-3 font-display text-lg font-semibold">Visits from social per day</h3>
            {d.byDay.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No visits from social networks recorded in this range.
              </p>
            ) : (
              <div className="flex h-40 items-end gap-1">
                {d.byDay.map((x) => (
                  <div
                    key={x.day}
                    className="flex flex-1 flex-col items-center gap-1"
                    title={`${x.day}: ${x.views} visits`}
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

          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <h3 className="mb-3 font-display text-lg font-semibold">By network</h3>
            {d.byNetwork.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No social referrals recorded yet in this range.
              </p>
            ) : (
              <div className="space-y-4">
                {d.byNetwork.map((n) => (
                  <div key={n.network} className="rounded-lg border border-border p-3">
                    <div className="flex items-center gap-3">
                      <span className="w-36 truncate text-sm font-medium">{n.network}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded bg-secondary">
                        <div
                          className="h-full bg-brand-gradient"
                          style={{ width: `${(n.views / maxNet) * 100}%` }}
                        />
                      </div>
                      <span className="w-28 text-right text-sm tabular-nums">
                        {n.views.toLocaleString()} visits
                      </span>
                      <span className="w-24 text-right text-sm tabular-nums text-muted-foreground">
                        {n.visitors.toLocaleString()} people
                      </span>
                    </div>
                    {n.landingPages.length > 0 && (
                      <ul className="mt-2 space-y-1 pl-1 text-xs text-muted-foreground">
                        {n.landingPages.map((p) => (
                          <li key={p.key} className="flex justify-between gap-3">
                            <span className="truncate">{p.key}</span>
                            <span className="tabular-nums">{p.count}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <h3 className="mb-3 font-display text-lg font-semibold">Pages social visitors land on</h3>
            {d.topLandingPages.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing recorded yet.</p>
            ) : (
              <ul className="space-y-1 text-sm">
                {d.topLandingPages.map((p) => (
                  <li key={p.key} className="flex justify-between gap-3">
                    <span className="truncate">{p.key}</span>
                    <span className="tabular-nums">{p.count.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Social figures are measured on this site without cookies, from the network a visitor
            arrived from. They count people reaching the site, not followers or post impressions.
          </p>
        </>
      )}
    </div>
  );
}
