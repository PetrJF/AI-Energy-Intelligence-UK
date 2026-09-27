import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Eye, Check, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard, useDashboardMutation } from "@/hooks/useDashboardData";
import { toggleWatchlist } from "@/lib/dashboard.functions";
import { PageHead, Panel } from "@/components/dashboard/ui";

export const Route = createFileRoute("/dashboard/watchlists")({
  component: WatchlistsPage,
});

const TOPICS = [
  { topic: "electricity-prices", label: "UK electricity prices" },
  { topic: "data-centres", label: "Data centre build-outs" },
  { topic: "grid-capacity", label: "Grid capacity & stress" },
  { topic: "ai-growth-zones", label: "AI Growth Zones" },
  { topic: "water-usage", label: "Data centre water usage" },
  { topic: "net-zero", label: "Net zero & carbon policy" },
  { topic: "model-efficiency", label: "AI model efficiency" },
  { topic: "regional-demand", label: "Regional demand growth" },
] as const;

function WatchlistsPage() {
  const { user } = useAuth();
  const { data, isLoading } = useDashboard(!!user);
  const toggle = useDashboardMutation(useServerFn(toggleWatchlist));

  if (isLoading || !data) return <div className="text-sm text-muted-foreground">Loading…</div>;

  const following = new Set(data.watchlists.map((w) => w.topic));

  return (
    <div>
      <PageHead
        title="Watchlists"
        subtitle="Follow the AI energy and infrastructure topics that matter to you."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {TOPICS.map((t) => {
          const on = following.has(t.topic);
          return (
            <Panel key={t.topic} className="flex items-center gap-3">
              <Eye className={`h-4 w-4 shrink-0 ${on ? "text-electric" : "text-muted-foreground"}`} />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{t.label}</span>
              <button
                onClick={() =>
                  toggle.mutate(
                    { data: { topic: t.topic, label: t.label } },
                    {
                      onSuccess: (r) =>
                        toast.success(r.following ? "Following" : "Unfollowed"),
                    },
                  )
                }
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  on
                    ? "bg-electric/10 text-electric"
                    : "bg-secondary text-foreground hover:bg-secondary/70"
                }`}
              >
                {on ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                {on ? "Following" : "Follow"}
              </button>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
