import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, ExternalLink, Loader2, Trash2, Undo2, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  adminListNewsForReview,
  adminSetNewsReviewStatus,
  adminDeleteNewsArticle,
  type ReviewArticle,
} from "@/lib/news-review.functions";

const TABS = [
  { key: "pending", label: "Awaiting review" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "all", label: "All" },
] as const;

export const Route = createFileRoute("/AIAdmin/news/")({
  head: () => ({
    meta: [
      { title: "News review queue — AI Energy Intelligence UK" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: NewsReview,
});

function NewsReview() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const qc = useQueryClient();
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("pending");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/login", search: { redirect: "/AIAdmin/news" } });
    }
  }, [authLoading, user, navigate]);

  const list = useServerFn(adminListNewsForReview);
  const setStatus = useServerFn(adminSetNewsReviewStatus);
  const remove = useServerFn(adminDeleteNewsArticle);

  const query = useQuery({
    queryKey: ["admin", "news", tab],
    queryFn: () => list({ data: { status: tab } }),
    enabled: !!user,
    retry: false,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin", "news"] });

  const statusMutation = useMutation({
    mutationFn: (vars: { id: string; status: "approved" | "pending" | "rejected"; reason?: string }) =>
      setStatus({ data: vars }),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: invalidate,
  });

  if (authLoading || (!!user && query.isLoading)) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const articles: ReviewArticle[] = query.data?.articles ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/AIAdmin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to admin
      </Link>

      <h1 className="mt-4 text-2xl font-semibold tracking-tight">News review queue</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Automated stories are scored on source quality, UK relevance and analysis confidence. Anything
        below the bar waits here until an editor approves it.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
              tab === t.key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {query.error && (
        <p className="mt-6 text-sm text-destructive">
          {(query.error as Error).message === "Forbidden"
            ? "You need an admin account to view this page."
            : "Failed to load the review queue."}
        </p>
      )}

      {articles.length === 0 && !query.error && (
        <p className="mt-8 text-sm text-muted-foreground">Nothing here right now.</p>
      )}

      <div className="mt-6 space-y-3">
        {articles.map((a) => (
          <article key={a.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded bg-muted px-2 py-0.5 font-medium text-foreground">
                Tier {a.source_tier}
              </span>
              <span>{a.source_name}</span>
              <span>·</span>
              <span>Quality {a.quality_score != null ? a.quality_score.toFixed(2) : "—"}</span>
              <span>·</span>
              <span>Confidence {a.confidence_rating != null ? a.confidence_rating.toFixed(2) : "—"}</span>
              {!a.is_uk_focused && <span className="text-amber-600">· Not UK-focused</span>}
              <span>·</span>
              <span className="capitalize">{a.review_status}</span>
            </div>

            <h2 className="mt-2 text-base font-semibold leading-snug">{a.headline || a.title}</h2>
            {a.rejection_reason && (
              <p className="mt-1 text-xs text-destructive">{a.rejection_reason}</p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <a
                href={a.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded border border-border px-2.5 py-1.5 text-xs hover:bg-muted"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Source
              </a>
              <Link
                to="/news/$slug"
                params={{ slug: a.slug }}
                className="inline-flex items-center gap-1.5 rounded border border-border px-2.5 py-1.5 text-xs hover:bg-muted"
              >
                Preview
              </Link>
              {a.review_status !== "approved" && (
                <button
                  onClick={() => statusMutation.mutate({ id: a.id, status: "approved" })}
                  className="inline-flex items-center gap-1.5 rounded bg-primary px-2.5 py-1.5 text-xs text-primary-foreground hover:opacity-90"
                >
                  <Check className="h-3.5 w-3.5" /> Approve
                </button>
              )}
              {a.review_status !== "rejected" && (
                <button
                  onClick={() =>
                    statusMutation.mutate({ id: a.id, status: "rejected", reason: "Rejected by editor" })
                  }
                  className="inline-flex items-center gap-1.5 rounded border border-border px-2.5 py-1.5 text-xs hover:bg-muted"
                >
                  <X className="h-3.5 w-3.5" /> Reject
                </button>
              )}
              {a.review_status !== "pending" && (
                <button
                  onClick={() => statusMutation.mutate({ id: a.id, status: "pending" })}
                  className="inline-flex items-center gap-1.5 rounded border border-border px-2.5 py-1.5 text-xs hover:bg-muted"
                >
                  <Undo2 className="h-3.5 w-3.5" /> Send back
                </button>
              )}
              <button
                onClick={() => {
                  if (confirm("Delete this story permanently?")) deleteMutation.mutate(a.id);
                }}
                className="inline-flex items-center gap-1.5 rounded border border-destructive/40 px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
