import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertTriangle } from "lucide-react";
import { getNavClickStats } from "@/lib/nav-analytics.functions";

const LOCATION_LABEL: Record<string, string> = {
  header: "Header",
  dropdown: "Research dropdown",
  mobile: "Mobile menu",
  footer: "Footer",
};

export function NavClicksPanel({ days }: { days: number }) {
  const fetchStats = useServerFn(getNavClickStats);
  const q = useQuery({
    queryKey: ["admin", "nav-clicks", days],
    queryFn: () => fetchStats({ data: { days } }),
    retry: false,
  });

  if (q.isLoading) {
    return (
      <div className="grid place-items-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (q.isError || !q.data) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm">
        Failed to load navigation tracking.
      </div>
    );
  }

  const d = q.data;

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-lg font-semibold">Menu navigation health</h3>
        <span className="text-xs text-muted-foreground">
          {d.totals.clicks.toLocaleString()} menu clicks · {d.totals.failed.toLocaleString()} did not
          reach the page ({d.totals.failRatePct}%)
        </span>
      </div>

      {d.totals.clicks === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          No menu clicks recorded yet in this range.
        </p>
      ) : (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {d.byLocation.map((l) => (
              <div key={l.location} className="rounded-lg border border-border p-3">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  {LOCATION_LABEL[l.location] ?? l.location}
                </div>
                <div className="mt-1 font-display text-xl tabular-nums">
                  {l.clicks.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {l.failed} failed ({l.clicks > 0 ? Math.round((l.failed / l.clicks) * 100) : 0}%)
                </div>
              </div>
            ))}
          </div>

          <h4 className="mt-6 flex items-center gap-1.5 text-sm font-semibold">
            <AlertTriangle className="h-4 w-4 text-destructive" aria-hidden="true" />
            Links that did not land
          </h4>
          {d.problemLinks.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Every tracked menu click reached its destination.
            </p>
          ) : (
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-3 py-2">Menu</th>
                    <th className="px-3 py-2">Link</th>
                    <th className="px-3 py-2">Destination</th>
                    <th className="px-3 py-2 text-right">Clicks</th>
                    <th className="px-3 py-2 text-right">Failed</th>
                    <th className="px-3 py-2">Clicked from</th>
                  </tr>
                </thead>
                <tbody>
                  {d.problemLinks.map((l) => (
                    <tr key={l.key} className="border-b border-border/60">
                      <td className="px-3 py-2">{LOCATION_LABEL[l.location] ?? l.location}</td>
                      <td className="px-3 py-2">{l.label}</td>
                      <td className="px-3 py-2 text-muted-foreground">{l.href}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{l.clicks}</td>
                      <td className="px-3 py-2 text-right tabular-nums text-destructive">
                        {l.failed} ({l.failRatePct}%)
                      </td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">
                        {l.failedFrom.join(", ") || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <h4 className="mt-6 text-sm font-semibold">Most used menu links</h4>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-3 py-2">Menu</th>
                  <th className="px-3 py-2">Link</th>
                  <th className="px-3 py-2 text-right">Clicks</th>
                  <th className="px-3 py-2 text-right">Reached page</th>
                </tr>
              </thead>
              <tbody>
                {d.topLinks.map((l) => (
                  <tr key={l.key} className="border-b border-border/60">
                    <td className="px-3 py-2">{LOCATION_LABEL[l.location] ?? l.location}</td>
                    <td className="px-3 py-2">{l.label}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{l.clicks}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{l.arrived}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        A click counts as failed when, about a second after the click, the browser is still on the
        previous page or ended up somewhere other than the link's destination.
      </p>
    </div>
  );
}
