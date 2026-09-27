import { createFileRoute } from "@tanstack/react-router";
import { History, Calculator, FileText, Eye } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboardData";
import { PageHead, Panel, EmptyState, fmtDate } from "@/components/dashboard/ui";

export const Route = createFileRoute("/dashboard/activity")({
  component: ActivityPage,
});

function iconFor(kind: string) {
  if (kind === "calculation") return Calculator;
  if (kind === "report") return FileText;
  if (kind === "watchlist") return Eye;
  return History;
}

function ActivityPage() {
  const { user } = useAuth();
  const { data, isLoading } = useDashboard(!!user);

  if (isLoading || !data) return <div className="text-sm text-muted-foreground">Loading…</div>;

  return (
    <div>
      <PageHead title="Recent Activity" subtitle="A timeline of what you've done across the platform." />
      {data.activity.length === 0 ? (
        <EmptyState
          icon={History}
          title="No activity yet"
          desc="Saving calculations and reports will build your activity timeline."
        />
      ) : (
        <Panel>
          <ul className="space-y-4">
            {data.activity.map((a) => {
              const Icon = iconFor(a.kind);
              return (
                <li key={a.id} className="flex items-start gap-3 border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-electric">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{fmtDate(a.created_at)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>
      )}
    </div>
  );
}
