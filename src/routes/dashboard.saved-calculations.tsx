import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Calculator, Copy, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard, useDashboardMutation } from "@/hooks/useDashboardData";
import { deleteCalculation, duplicateCalculation } from "@/lib/dashboard.functions";
import { PageHead, Panel, EmptyState, fmtDate } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/saved-calculations")({
  component: SavedCalculationsPage,
});

function summaryLine(summary: Record<string, unknown>): string {
  const entries = Object.entries(summary ?? {}).slice(0, 3);
  if (entries.length === 0) return "No summary saved";
  return entries.map(([k, v]) => `${k}: ${String(v)}`).join(" · ");
}

function SavedCalculationsPage() {
  const { user } = useAuth();
  const { data, isLoading } = useDashboard(!!user);
  const del = useDashboardMutation(useServerFn(deleteCalculation));
  const dup = useDashboardMutation(useServerFn(duplicateCalculation));

  if (isLoading || !data) return <div className="text-sm text-muted-foreground">Loading…</div>;

  return (
    <div>
      <PageHead
        title="Saved Calculations"
        subtitle="Your stored calculator runs. Reopen, duplicate or remove them."
      />
      {data.savedCalculations.length === 0 ? (
        <EmptyState
          icon={Calculator}
          title="No saved calculations yet"
          desc="Run any calculator and press “Save to dashboard” to keep the result here."
          ctaLabel="Browse calculators"
          ctaTo="/ai-energy-calculators"
        />
      ) : (
        <div className="space-y-3">
          {data.savedCalculations.map((c) => (
            <Panel key={c.id} className="flex flex-wrap items-center gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Calculator className="h-4 w-4 shrink-0 text-electric" />
                  <h3 className="truncate font-semibold text-foreground">{c.tool_name}</h3>
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {summaryLine(c.result_summary as Record<string, unknown>)}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">Saved {fmtDate(c.created_at)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link to={c.tool_slug}>
                    <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Open
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={dup.isPending}
                  onClick={() =>
                    dup.mutate({ data: { id: c.id } }, { onSuccess: () => toast.success("Duplicated") })
                  }
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={del.isPending}
                  onClick={() =>
                    del.mutate({ data: { id: c.id } }, { onSuccess: () => toast.success("Deleted") })
                  }
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
