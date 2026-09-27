import { createFileRoute, Link } from "@tanstack/react-router";
import { Calculator, FileText, Star, History, Eye, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboardData";
import { PageHead, Panel, StatCard, EmptyState, fmtDate } from "@/components/dashboard/ui";

export const Route = createFileRoute("/dashboard/")({
  component: OverviewPage,
});

function OverviewPage() {
  const { user } = useAuth();
  const { data, isLoading } = useDashboard(!!user);

  if (isLoading || !data) {
    return <div className="text-sm text-muted-foreground">Loading your dashboard…</div>;
  }

  const recentCalcs = data.savedCalculations.slice(0, 4);
  const recentActivity = data.activity.slice(0, 6);

  return (
    <div>
      <PageHead
        title="Overview"
        subtitle="Your saved work, reports and activity across the AI Energy Intelligence Centre."
        action={
          <Link
            to="/ai-energy-calculators"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Open calculators <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Saved calcs" value={data.savedCalculations.length} icon={Calculator} />
        <StatCard label="Reports" value={data.savedReports.length} icon={FileText} />
        <StatCard label="Favourites" value={data.favourites.length} icon={Star} />
        <StatCard label="Watchlists" value={data.watchlists.length} icon={Eye} />
      </div>


      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Recent saved calculations</h2>
            <Link to="/dashboard/saved-calculations" className="text-xs font-medium text-electric hover:underline">
              View all
            </Link>
          </div>
          {recentCalcs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nothing saved yet. Run a calculator and hit “Save” to keep it here.
            </p>
          ) : (
            <ul className="space-y-2">
              {recentCalcs.map((c) => (
                <li key={c.id}>
                  <Link
                    to={c.tool_slug}
                    className="flex items-center gap-2 rounded-lg border border-border p-3 hover:border-electric/40"
                  >
                    <Calculator className="h-4 w-4 shrink-0 text-electric" />
                    <span className="min-w-0 truncate text-sm font-medium text-foreground">
                      {c.tool_name}
                    </span>
                    <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                      {fmtDate(c.created_at)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Recent activity</h2>
            <Link to="/dashboard/activity" className="text-xs font-medium text-electric hover:underline">
              View all
            </Link>
          </div>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground">Your activity timeline will appear here.</p>
          ) : (
            <ul className="space-y-3">
              {recentActivity.map((a) => (
                <li key={a.id} className="flex items-start gap-2.5">
                  <History className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="text-sm text-foreground">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{fmtDate(a.created_at)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
