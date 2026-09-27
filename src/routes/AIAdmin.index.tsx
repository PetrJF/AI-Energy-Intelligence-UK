import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  Users,
  FileText,
  Mail,
  Briefcase,
  BarChart3,
  Loader2,
  Download,
  ShieldAlert,
  Search,
  Activity,
  ShieldCheck,
  Radar,
  Share2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getAdminData } from "@/lib/admin.functions";
import { getSearchConsoleData } from "@/lib/search-console.functions";
import { TrafficPanel } from "@/components/admin/TrafficPanel";
import { SocialPanel } from "@/components/admin/SocialPanel";
import { UptimePanel } from "@/components/admin/UptimePanel";
import { IndexWatchPanel } from "@/components/admin/IndexWatchPanel";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/AIAdmin/")({
  head: () => ({
    meta: [
      { title: "Admin — AI Energy Intelligence UK" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type TabKey = "overview" | "tool-leads" | "downloads" | "newsletter" | "consultancy" | "reports" | "analytics" | "search" | "traffic" | "social" | "uptime" | "index-watch";

const TABS: { key: TabKey; label: string; icon: any }[] = [
  { key: "overview", label: "Overview", icon: BarChart3 },
  { key: "tool-leads", label: "Tool submissions", icon: Users },
  { key: "downloads", label: "Report downloads", icon: FileText },
  { key: "newsletter", label: "Newsletter", icon: Mail },
  { key: "consultancy", label: "Enquiries", icon: Briefcase },
  { key: "reports", label: "Saved reports (dashboard)", icon: FileText },
  { key: "traffic", label: "Site Traffic", icon: Activity },
  { key: "social", label: "Social", icon: Share2 },
  { key: "search", label: "Search (GSC)", icon: Search },
  { key: "uptime", label: "Uptime", icon: ShieldCheck },
  { key: "index-watch", label: "Index sources", icon: Radar },
  { key: "analytics", label: "Leads Analytics", icon: BarChart3 },
];

function AdminPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<TabKey>("overview");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/login", search: { redirect: "/AIAdmin" } });
    }
  }, [authLoading, user, navigate]);

  const fetchAdmin = useServerFn(getAdminData);
  const query = useQuery({
    queryKey: ["admin", "data"],
    queryFn: () => fetchAdmin(),
    enabled: !!user,
    retry: false,
  });

  if (authLoading || (!!user && query.isLoading)) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (query.isError) {
    const msg = (query.error as Error)?.message ?? "";
    const forbidden = /forbidden|unauth/i.test(msg);
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <ShieldAlert className="mx-auto h-10 w-10 text-destructive mb-3" />
        <h1 className="font-display text-2xl font-bold mb-2">
          {forbidden ? "Admins only" : "Something went wrong"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {forbidden
            ? "Your account doesn't have admin access."
            : "Failed to load admin data. Try refreshing."}
        </p>
      </div>
    );
  }

  const data = query.data;
  if (!data) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Admin</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage submissions and monitor site activity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/AIAdmin/news"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
          >
            <FileText className="h-4 w-4" /> News review
          </Link>
          <Link
            to="/AIAdmin/blog"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
          >
            <FileText className="h-4 w-4" /> Manage blog
          </Link>
          <Link
            to="/AIAdmin/energy-index"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
          >
            <BarChart3 className="h-4 w-4" /> Energy Index
          </Link>
          <Link
            to="/AIAdmin/data-centres"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
          >
            <BarChart3 className="h-4 w-4" /> DC tracker
          </Link>


          <div className="text-xs text-muted-foreground">
            Signed in as <span className="font-medium text-foreground">{user?.email}</span>
          </div>
        </div>
      </header>

      <nav className="mb-6 flex flex-wrap gap-1 border-b border-border">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-t-md -mb-px border-b-2",
              tab === key
                ? "border-brand text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </nav>

      {tab === "overview" && <Overview data={data} onGo={setTab} />}
      {tab === "tool-leads" && (
        <LeadsTable rows={data.toolLeads} filename="tool-submissions.csv" showInputs />
      )}
      {tab === "downloads" && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {data.analytics.downloadsCount} report download submissions from{" "}
            {data.analytics.distinctDownloaders} distinct email addresses
            {data.analytics.repeatDownloads > 0
              ? ` (${data.analytics.repeatDownloads} repeat submissions, all kept)`
              : ""}
            . Download consent is not newsletter permission — the two are shown separately.
          </p>
          <LeadsTable rows={data.downloads} filename="report-downloads.csv" showInputs />
        </div>
      )}
      {tab === "newsletter" && (
        <LeadsTable rows={data.newsletter} filename="newsletter.csv" />
      )}
      {tab === "consultancy" && (
        <LeadsTable rows={data.consultancy} filename="consultancy.csv" showInputs />
      )}
      {tab === "reports" && <ReportsTable rows={data.reports} />}
      {tab === "traffic" && <TrafficPanel />}
      {tab === "social" && <SocialPanel />}
      {tab === "search" && <SearchConsolePanel />}
      {tab === "uptime" && <UptimePanel />}
      {tab === "index-watch" && <IndexWatchPanel />}
      {tab === "analytics" && <Analytics analytics={data.analytics} />}
    </div>
  );
}

function SearchConsolePanel() {
  const [days, setDays] = useState(7);
  const fetchGsc = useServerFn(getSearchConsoleData);
  const q = useQuery({
    queryKey: ["admin", "gsc", days],
    queryFn: () => fetchGsc({ data: { days } }),
    retry: false,
  });
  const [needle, setNeedle] = useState("");

  const filteredQueries = useMemo(() => {
    const rows = q.data?.queries ?? [];
    if (!needle.trim()) return rows;
    const t = needle.toLowerCase();
    return rows.filter((r) => r.query?.toLowerCase().includes(t));
  }, [q.data, needle]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Range:</span>
        {[7, 28, 90].map((d) => (
          <button
            key={d}
            onClick={() => setDays(d)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm",
              days === d
                ? "border-brand bg-brand text-white"
                : "border-border bg-background hover:bg-secondary",
            )}
          >
            Last {d} days
          </button>
        ))}
        {q.data && (
          <span className="ml-auto text-xs text-muted-foreground">
            {q.data.range.startDate} → {q.data.range.endDate} · {q.data.site} · web search ·
            no filters · refreshed {new Date(q.data.fetchedAt).toLocaleString("en-GB")}
          </span>
        )}
      </div>

      {q.isLoading && (
        <div className="grid place-items-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {q.isError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm">
          Failed to load Search Console data.
          <pre className="mt-2 whitespace-pre-wrap text-xs text-muted-foreground">
            {(q.error as Error)?.message}
          </pre>
        </div>
      )}

      {q.data && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Clicks" value={q.data.totals.clicks.toLocaleString()} />
            <StatCard label="Impressions" value={q.data.totals.impressions.toLocaleString()} />
            <StatCard label="CTR" value={`${(q.data.totals.ctr * 100).toFixed(2)}%`} />
            <StatCard label="Avg. position" value={q.data.totals.position.toFixed(1)} />
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <h3 className="font-display text-lg font-semibold">Top search queries</h3>
              <input
                value={needle}
                onChange={(e) => setNeedle(e.target.value)}
                placeholder="Filter keywords…"
                className="h-9 min-w-[200px] flex-1 rounded-md border border-border bg-background px-3 text-sm"
              />
              <span className="text-xs text-muted-foreground">
                showing {filteredQueries.length} of {q.data.queries.length} returned
                {q.data.queries.length >= q.data.limits.queries
                  ? ` (capped at ${q.data.limits.queries})`
                  : ""}
              </span>
              <button
                onClick={() => downloadCSV(filteredQueries, `gsc-queries-${days}d.csv`)}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-secondary"
              >
                <Download className="h-3.5 w-3.5" /> Export displayed rows
              </button>
            </div>
            <p className="mb-3 text-xs text-muted-foreground">
              Google withholds rare queries to protect user privacy, so these rows total{" "}
              {q.data.rowSums.queries.clicks.toLocaleString()} clicks and{" "}
              {q.data.rowSums.queries.impressions.toLocaleString()} impressions against headline
              totals of {q.data.totals.clicks.toLocaleString()} clicks and{" "}
              {q.data.totals.impressions.toLocaleString()} impressions. The gap is unreported
              query data and is not attributable to any keyword. Same property, web search,
              date range and filters as the cards above.
            </p>
            <GscTable
              rows={filteredQueries}
              labelKey="query"
              labelHeader="Query"
              emptyMessage="No search queries in this range yet."
            />
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <h3 className="font-display text-lg font-semibold">Top pages</h3>
              <span className="text-xs text-muted-foreground">
                showing all {q.data.pages.length} pages returned
                {q.data.pages.length >= q.data.limits.pages
                  ? ` (capped at ${q.data.limits.pages})`
                  : ""}
              </span>
              <button
                onClick={() => downloadCSV(q.data.pages, `gsc-pages-${days}d.csv`)}
                className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-secondary"
              >
                <Download className="h-3.5 w-3.5" /> Export CSV
              </button>
            </div>
            <GscTable
              rows={q.data.pages}
              labelKey="page"
              labelHeader="Page"
              emptyMessage="No page-level data yet."
              isLink
            />
          </div>
        </>
      )}
    </div>
  );
}

function GscTable({
  rows,
  labelKey,
  labelHeader,
  emptyMessage,
  isLink,
}: {
  rows: any[];
  labelKey: string;
  labelHeader: string;
  emptyMessage: string;
  isLink?: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-3 py-2">{labelHeader}</th>
            <th className="px-3 py-2 text-right">Clicks</th>
            <th className="px-3 py-2 text-right">Impressions</th>
            <th className="px-3 py-2 text-right">CTR</th>
            <th className="px-3 py-2 text-right">Position</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((r, i) => {
              const label = r[labelKey];
              return (
                <tr key={`${label}-${i}`} className="border-t border-border">
                  <td className="px-3 py-2 max-w-[420px] truncate">
                    {isLink ? (
                      <a
                        href={label}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand hover:underline"
                        title={label}
                      >
                        {label}
                      </a>
                    ) : (
                      label
                    )}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.clicks.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.impressions.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{(r.ctr * 100).toFixed(2)}%</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.position.toFixed(1)}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

function Overview({
  data,
  onGo,
}: {
  data: any;
  onGo: (k: TabKey) => void;
}) {
  const a = data.analytics;
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <button onClick={() => onGo("downloads")} className="text-left">
          <StatCard
            label="Report downloads"
            value={a.downloadsCount}
            hint={`${a.distinctDownloaders} distinct people · ${a.repeatDownloads} repeat`}
          />
        </button>
        <button onClick={() => onGo("tool-leads")} className="text-left">
          <StatCard label="Tool submissions" value={a.toolLeadsCount} />
        </button>
        <button onClick={() => onGo("newsletter")} className="text-left">
          <StatCard label="Newsletter signups" value={a.newsletterCount} />
        </button>
        <button onClick={() => onGo("consultancy")} className="text-left">
          <StatCard
            label="Enquiries (unqualified)"
            value={a.consultancyGenuineCount}
            hint={`${a.consultancySolicitationCount} classified as unsolicited pitches and excluded`}
          />
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        Report downloads are counted separately from tool submissions. "Saved reports" in its own
        tab means reports saved inside signed-in dashboards, which is not a download request.
        Enquiries are treated as unqualified until there is evidence otherwise.
      </p>

      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <h2 className="font-display text-lg font-semibold mb-3">Latest submissions</h2>
        <LeadsTable
          rows={[...data.toolLeads, ...data.downloads, ...data.consultancy, ...data.newsletter]
            .sort(
              (a: any, b: any) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
            )
            .slice(0, 10)}
          hideExport
          showInputs
        />
      </div>
    </div>
  );
}

function toCSV(rows: any[]): string {
  if (rows.length === 0) return "";
  const cols = Object.keys(rows[0]);
  const esc = (v: any) => {
    if (v === null || v === undefined) return "";
    const s = typeof v === "object" ? JSON.stringify(v) : String(v);
    return `"${s.replace(/"/g, '""')}"`;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
}

function downloadCSV(rows: any[], filename: string) {
  const csv = toCSV(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function LeadsTable({
  rows,
  filename,
  hideExport,
  showInputs,
}: {
  rows: any[];
  filename?: string;
  hideExport?: boolean;
  showInputs?: boolean;
}) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const t = q.toLowerCase();
    return rows.filter(
      (r) =>
        r.email?.toLowerCase().includes(t) ||
        r.source?.toLowerCase().includes(t) ||
        r.variant?.toLowerCase().includes(t),
    );
  }, [rows, q]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search email or source…"
          className="h-9 rounded-md border border-border bg-background px-3 text-sm flex-1 min-w-[220px]"
        />
        <span className="text-xs text-muted-foreground">{filtered.length} rows</span>
        {!hideExport && filename && (
          <button
            onClick={() => downloadCSV(filtered, filename)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-secondary"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Source</th>
              <th className="px-3 py-2">Variant</th>
              <th className="px-3 py-2">Marketing consent</th>
              <th className="px-3 py-2">Download consent</th>
              {showInputs && <th className="px-3 py-2">Details</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={showInputs ? 7 : 6} className="px-3 py-6 text-center text-muted-foreground">
                  No submissions yet.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="border-t border-border align-top">
                  <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">
                    {new Date(r.created_at).toLocaleString("en-GB")}
                  </td>
                  <td className="px-3 py-2">
                    <a href={`mailto:${r.email}`} className="text-brand hover:underline">
                      {r.email}
                    </a>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{r.source}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{r.variant}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {r.consent_marketing ? "Yes" : "No"}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {/* Consent recorded for the download itself — a separate
                        permission from marketing opt-in, never merged with it. */}
                    {r.inputs && typeof r.inputs === "object" && "gdpr_consent" in r.inputs
                      ? (r.inputs as any).gdpr_consent
                        ? "Yes"
                        : "No"
                      : "—"}
                  </td>
                  {showInputs && (
                    <td className="px-3 py-2 max-w-[420px]">
                      {r.inputs || r.result_summary ? (
                        <details>
                          <summary className="cursor-pointer text-xs text-muted-foreground">
                            view
                          </summary>
                          <pre className="mt-1 max-w-full overflow-x-auto rounded bg-surface p-2 text-xs">
{JSON.stringify(r.inputs ?? r.result_summary, null, 2)}
                          </pre>
                        </details>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReportsTable({ rows }: { rows: any[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground">{rows.length} reports</span>
        <button
          onClick={() => downloadCSV(rows, "reports.csv")}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-secondary"
        >
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Source</th>
              <th className="px-3 py-2">User</th>
              <th className="px-3 py-2">Download</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">
                  No report requests yet.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">
                    {new Date(r.created_at).toLocaleString("en-GB")}
                  </td>
                  <td className="px-3 py-2">{r.title}</td>
                  <td className="px-3 py-2 text-muted-foreground">{r.category ?? "—"}</td>
                  <td className="px-3 py-2 text-muted-foreground">{r.source ?? "—"}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground font-mono">
                    {r.user_id?.slice(0, 8)}…
                  </td>
                  <td className="px-3 py-2">
                    {r.download_url ? (
                      <a
                        href={r.download_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand hover:underline"
                      >
                        open
                      </a>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Analytics({ analytics }: { analytics: any }) {
  const maxDay = Math.max(1, ...analytics.byDay.map((d: any) => d.count));
  const maxSrc = Math.max(1, ...analytics.bySource.map((s: any) => s.count));
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Total leads" value={analytics.totalLeads} />
        <StatCard label="Total reports" value={analytics.totalReports} />
        <StatCard
          label="Newsletter conversion"
          value={
            analytics.totalLeads > 0
              ? `${Math.round((analytics.newsletterCount / analytics.totalLeads) * 100)}%`
              : "—"
          }
        />
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <h3 className="font-display text-lg font-semibold mb-3">Submissions — last 30 days</h3>
        {analytics.byDay.length === 0 ? (
          <p className="text-sm text-muted-foreground">No submissions in the last 30 days.</p>
        ) : (
          <div className="flex items-end gap-1 h-40">
            {analytics.byDay.map((d: any) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1" title={`${d.day}: ${d.count}`}>
                <div
                  className="w-full rounded-t bg-brand-gradient"
                  style={{ height: `${(d.count / maxDay) * 100}%`, minHeight: 2 }}
                />
                <span className="text-[9px] text-muted-foreground rotate-45 origin-left translate-y-2">
                  {d.day.slice(5)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <h3 className="font-display text-lg font-semibold mb-3">By source</h3>
        <div className="space-y-2">
          {analytics.bySource.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing yet.</p>
          ) : (
            analytics.bySource.map((s: any) => (
              <div key={s.source} className="flex items-center gap-3">
                <span className="w-52 text-sm truncate">{s.source}</span>
                <div className="flex-1 h-2 rounded bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-brand-gradient"
                    style={{ width: `${(s.count / maxSrc) * 100}%` }}
                  />
                </div>
                <span className="w-10 text-right text-sm tabular-nums">{s.count}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
