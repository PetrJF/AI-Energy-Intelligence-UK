import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { FileText, Trash2, Download } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard, useDashboardMutation } from "@/hooks/useDashboardData";
import { deleteReport, saveReport } from "@/lib/dashboard.functions";
import { PageHead, Panel, EmptyState, fmtDate } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/reports")({
  component: ReportsPage,
});

const GUIDE_URL = "/guides/ai-electricity-cost-calculator";

function ReportsPage() {
  const { user } = useAuth();
  const { data, isLoading } = useDashboard(!!user);
  const del = useDashboardMutation(useServerFn(deleteReport));
  const add = useDashboardMutation(useServerFn(saveReport));

  if (isLoading || !data) return <div className="text-sm text-muted-foreground">Loading…</div>;

  return (
    <div>
      <PageHead
        title="Reports"
        subtitle="Your saved report library. Download or remove any report."
        action={
          <Button
            size="sm"
            disabled={add.isPending}
            onClick={() =>
              add.mutate(
                {
                  data: {
                    title: "AI Electricity Cost Calculator: UK Business Guide 2026",
                    category: "guide",
                    source: "library",
                    downloadUrl: GUIDE_URL,
                  },
                },
                { onSuccess: () => toast.success("Added to your reports") },
              )
            }
          >
            Add UK Business Guide
          </Button>
        }
      />
      {data.savedReports.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No reports saved yet"
          desc="Add the free UK Business Guide, or save reports generated from calculators."
          ctaLabel="Explore research"
          ctaTo="/reports"
        />
      ) : (
        <div className="space-y-3">
          {data.savedReports.map((r) => (
            <Panel key={r.id} className="flex flex-wrap items-center gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 shrink-0 text-electric" />
                  <h3 className="truncate font-semibold text-foreground">{r.title}</h3>
                </div>
                <p className="mt-0.5 text-xs uppercase tracking-wider text-muted-foreground">
                  {r.category} · saved {fmtDate(r.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {r.download_url && (
                  <Button asChild variant="outline" size="sm">
                    <a href={r.download_url} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-1.5 h-3.5 w-3.5" /> Download
                    </a>
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={del.isPending}
                  onClick={() =>
                    del.mutate({ data: { id: r.id } }, { onSuccess: () => toast.success("Removed") })
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
