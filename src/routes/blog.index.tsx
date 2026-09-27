import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BookOpen } from "lucide-react";
import { RESEARCH_TOPICS } from "@/lib/research-topics";
import { listPublishedPosts, type BlogPostListItem } from "@/lib/blog.functions";
import {
  EditorialCard,
  LeadEditorialCard,
  type EditorialItem,
} from "@/components/editorial/EditorialCard";


const postsQueryOptions = (pillar?: string) =>
  queryOptions({
    queryKey: ["blog", "list", "pillar", pillar ?? "all"],
    queryFn: () =>
      listPublishedPosts({
        data: { limit: 50, pillar } as { limit: number; pillar?: string },
      }),
    staleTime: 5 * 60 * 1000,
  });

/** Cornerstone first, then reviewed, then most recent. */
function editorialRank(post: BlogPostListItem): number {
  let rank = 0;
  if (post.article_type === "cornerstone") rank -= 2;
  if (post.review_status === "reviewed") rank -= 1;
  return rank;
}

export const Route = createFileRoute("/blog/")({
  validateSearch: (
    search: Record<string, unknown> | undefined,
  ): { category?: string; pillar?: string } => ({
    category: typeof search?.category === "string" ? search?.category : undefined,
    pillar: typeof search?.pillar === "string" ? search?.pillar : undefined,
  }),
  loaderDeps: ({ search }) => ({ pillar: search.pillar }),
  loader: ({ context, deps }) =>
    context.queryClient.ensureQueryData(postsQueryOptions(deps.pillar)),
  head: ({ loaderData }) => {
    const items = loaderData?.items ?? [];
    const blogLd = {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "AI Energy Intelligence UK — Analysis & Research",
      url: "https://aienergyintelligence.co.uk/blog",
      description:
        "Independent UK analysis and research on AI electricity demand, data centres and the grid.",
      publisher: {
        "@type": "Organization",
        name: "AI Energy Intelligence UK",
        url: "https://aienergyintelligence.co.uk",
      },
      blogPost: items.slice(0, 20).map((p) => ({
        "@type": "BlogPosting",
        headline: p.title,
        url: `https://aienergyintelligence.co.uk/blog/${p.slug}`,
        ...(p.published_at ? { datePublished: p.published_at } : {}),
        ...(p.updated_at ? { dateModified: p.updated_at } : {}),
        ...(p.cover_image_url ? { image: [p.cover_image_url] } : {}),
        ...(p.excerpt ? { description: p.excerpt } : {}),
      })),
    };
    const breadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://aienergyintelligence.co.uk/" },
        { "@type": "ListItem", position: 2, name: "Analysis & Research", item: "https://aienergyintelligence.co.uk/blog" },
      ],
    };
    return {
      meta: [
        { title: "Analysis & Research | AI Energy Intelligence UK" },
        {
          name: "description",
          content:
            "Independent UK analysis and research on AI electricity demand, data centres, grid capacity and energy policy — commentary and long-reads from AI Energy Intelligence.",
        },
        { property: "og:title", content: "Analysis & Research | AI Energy Intelligence UK" },
        {
          property: "og:description",
          content:
            "Independent UK analysis and research on AI electricity demand, data centres and the grid.",
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://aienergyintelligence.co.uk/blog" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/blog" }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(blogLd) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumb) },
      ],
    };
  },

  component: BlogIndex,
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Blog is temporarily unavailable</h1>
      <p className="mt-3 text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Not found</h1>
    </div>
  ),
});

const PAGE_SIZE = 9;

function toItem(post: BlogPostListItem): EditorialItem {
  return {
    to: "/blog/$slug",
    params: { slug: post.slug },
    title: post.title,
    excerpt: post.excerpt,
    imageUrl: post.cover_image_url,
    imageAlt: post.title,
    category: post.categories?.[0] ?? "Analysis",
    date: post.published_at,
  };
}

function BlogIndex() {
  const { pillar } = Route.useSearch();
  const { data } = useSuspenseQuery(postsQueryOptions(pillar));
  const items = [...data.items].sort((a, b) => editorialRank(a) - editorialRank(b));
  const [visible, setVisible] = useState(PAGE_SIZE);

  const [lead, ...rest] = items;
  const shown = rest.slice(0, visible);

  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-brand">
            <BookOpen className="h-3 w-3" aria-hidden="true" /> Analysis &amp; Research
          </div>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight md:text-4xl">
            Analysis &amp; Research
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Independent UK analysis, commentary and long-reads on AI electricity demand, data
            centres, grid capacity and energy policy. For wider UK energy-market context, see{" "}
            <a
              href="https://energysector.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand hover:underline"
            >
              Energy Watch UK
            </a>
            . For downloadable studies, see our{" "}
            <Link to="/reports" className="font-semibold text-brand hover:underline">
              research reports
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-4 py-4 sm:px-6">
          <Link
            to="/blog"
            search={{}}
            className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              !pillar
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            All research
          </Link>
          {RESEARCH_TOPICS.map((t) => (
            <Link
              key={t.pillarKey}
              to="/blog"
              search={{ pillar: t.pillarKey }}
              className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                pillar === t.pillarKey
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {items.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-bold">
              {pillar ? "No published analysis in this pillar yet" : "No posts yet"}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {pillar
                ? "We publish here only when there is verified UK evidence to publish. Nothing is held as a placeholder."
                : "Check back soon."}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-10">
              <LeadEditorialCard item={toItem(lead)} horizontal />
            </div>
            {shown.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {shown.map((post) => (
                  <EditorialCard key={post.id} item={toItem(post)} />
                ))}
              </div>
            )}
            {rest.length > shown.length && (
              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-6 py-3 text-sm font-semibold transition hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  Load more analysis
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <h2 className="font-display text-2xl font-bold">Continue your research</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              { to: "/reports" as const, title: "Research reports", desc: "Downloadable UK AI energy studies and data packs." },
              { to: "/news" as const, title: "Latest news", desc: "Daily UK AI energy and data centre headlines." },
              { to: "/tools" as const, title: "Calculators", desc: "Model AI electricity, water and grid impact." },
              { to: "/data-centres" as const, title: "Data centres hub", desc: "UK data centre build-out and grid pressure." },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-elegant"
              >
                <div className="font-semibold text-brand">{l.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{l.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

