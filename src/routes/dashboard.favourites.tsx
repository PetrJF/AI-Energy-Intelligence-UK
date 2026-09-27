import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Star, Trash2, Plus, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard, useDashboardMutation } from "@/hooks/useDashboardData";
import { removeFavourite, toggleFavourite } from "@/lib/dashboard.functions";
import { PageHead, Panel, EmptyState } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { ALL_TOOLS } from "@/components/energy/hub";

export const Route = createFileRoute("/dashboard/favourites")({
  component: FavouritesPage,
});

function FavouritesPage() {
  const { user } = useAuth();
  const { data, isLoading } = useDashboard(!!user);
  const remove = useDashboardMutation(useServerFn(removeFavourite));
  const toggle = useDashboardMutation(useServerFn(toggleFavourite));

  if (isLoading || !data) return <div className="text-sm text-muted-foreground">Loading…</div>;

  const favedSlugs = new Set(data.favourites.map((f) => f.item_slug));
  const suggestions = ALL_TOOLS.filter((t) => !favedSlugs.has(t.to)).slice(0, 6);

  return (
    <div>
      <PageHead title="Favourites" subtitle="Quick access to the tools you use most." />

      {data.favourites.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No favourites yet"
          desc="Star tools to pin them here for one-click access."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {data.favourites.map((f) => (
            <Panel key={f.id} className="flex items-center gap-3">
              <Star className="h-4 w-4 shrink-0 fill-electric text-electric" />
              <Link to={f.item_slug} className="min-w-0 flex-1 truncate text-sm font-medium text-foreground hover:text-electric">
                {f.item_title}
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  remove.mutate({ data: { id: f.id } }, { onSuccess: () => toast.success("Removed") })
                }
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </Panel>
          ))}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 font-semibold text-foreground">Add favourites</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {suggestions.map((t) => (
              <button
                key={t.to}
                onClick={() =>
                  toggle.mutate(
                    { data: { itemType: "tool", itemSlug: t.to, itemTitle: t.title } },
                    { onSuccess: () => toast.success("Added to favourites") },
                  )
                }
                className="flex items-center gap-2 rounded-lg border border-border bg-card p-3 text-left hover:border-electric/40"
              >
                <Plus className="h-4 w-4 shrink-0 text-electric" />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{t.title}</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
