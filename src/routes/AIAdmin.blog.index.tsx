import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Loader2,
  ShieldAlert,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  adminListPosts,
  adminDeletePost,
} from "@/lib/blog.functions";

export const Route = createFileRoute("/AIAdmin/blog/")({
  head: () => ({
    meta: [
      { title: "Blog admin — AI Energy Intelligence UK" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: BlogAdmin,
});

function BlogAdmin() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const qc = useQueryClient();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/login", search: { redirect: "/AIAdmin/blog" } });
    }
  }, [authLoading, user, navigate]);

  const list = useServerFn(adminListPosts);
  const del = useServerFn(adminDeletePost);

  const query = useQuery({
    queryKey: ["admin", "blog", "list"],
    queryFn: () => list(),
    enabled: !!user,
    retry: false,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "blog", "list"] }),
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
        <p className="text-sm text-muted-foreground">{msg || "Try again."}</p>
      </div>
    );
  }

  const posts = query.data?.items ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link
            to="/AIAdmin"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> Back to admin
          </Link>
          <h1 className="mt-2 font-display text-3xl font-bold">Blog posts</h1>
          <p className="text-sm text-muted-foreground">
            {posts.length} post{posts.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          to="/AIAdmin/blog/$id"
          params={{ id: "new" }}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> New post
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-border bg-card">
        {posts.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No posts yet. Create your first one.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Updated</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{p.title}</div>
                    <div className="text-xs text-muted-foreground">/{p.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                        p.status === "published"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(p.updated_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      {p.status === "published" && (
                        <Link
                          to="/blog/$slug"
                          params={{ slug: p.slug }}
                          target="_blank"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                          title="View"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      )}
                      <Link
                        to="/AIAdmin/blog/$id"
                        params={{ id: p.id }}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete "${p.title}"? This cannot be undone.`)) {
                            deleteMutation.mutate(p.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-destructive hover:bg-destructive/10 disabled:opacity-40"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
