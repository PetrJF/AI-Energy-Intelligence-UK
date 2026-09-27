import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Clock,
  ExternalLink,
  Flame,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
} from "lucide-react";
import { getNewsBySlug, getRelatedNews } from "@/lib/news.functions";
import { LeadCapture } from "@/components/LeadCapture";
import { RelatedReports, categoriesForNews } from "@/components/RelatedReports";
import newsFallbackAsset from "@/assets/news-fallback.jpg.asset.json";
import { EvidencePanel } from "@/components/EvidencePanel";
import { AboutThisData } from "@/components/AboutThisData";

const articleQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["news", "article", slug],
    queryFn: () => getNewsBySlug({ data: { slug } }),
    staleTime: 5 * 60 * 1000,
  });

const relatedQueryOptions = (slug: string, categories: string[]) =>
  queryOptions({
    queryKey: ["news", "related", slug, categories.join(",")],
    queryFn: () => getRelatedNews({ data: { slug, categories } }),
    staleTime: 5 * 60 * 1000,
    enabled: categories.length > 0,
  });

export const Route = createFileRoute("/news/$slug")({
  loader: async ({ context, params }) => {
    const result = await context.queryClient.ensureQueryData(articleQueryOptions(params.slug));
    if (!result.article) throw notFound();
    return result;
  },
  head: ({ loaderData }) => {
    const a = loaderData?.article;
    if (!a) return { meta: [{ title: "News | AI Energy Intelligence UK" }] };
    const url = `https://aienergyintelligence.co.uk/news/${a.slug}`;
    return {
      meta: [
        { title: `${a.meta_title ?? a.headline ?? a.title} | AI Energy Intelligence UK` },
        { name: "description", content: a.meta_description ?? a.analysis.executive_summary ?? "" },
        { property: "og:title", content: a.meta_title ?? a.headline ?? a.title },
        { property: "og:description", content: a.meta_description ?? a.analysis.executive_summary ?? "" },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        ...(a.og_image_url ? [{ property: "og:image", content: a.og_image_url }] : []),
        { property: "article:published_time", content: a.published_at },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: a.meta_title ?? a.headline ?? a.title },
        { name: "twitter:description", content: a.meta_description ?? "" },
        ...(a.og_image_url ? [{ name: "twitter:image", content: a.og_image_url }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: buildStructuredData(a, url),
    };
  },
  component: ArticlePage,
  errorComponent: ({ error, reset }) => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">Article unavailable</h1>
      <p className="mt-3 text-muted-foreground">{error.message}</p>
      <button
        onClick={() => reset()}
        className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        Retry
      </button>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">Story not found</h1>
      <p className="mt-3 text-muted-foreground">This article may have been archived.</p>
      <Link
        to="/news"
        search={{}}
        className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        Back to news
      </Link>
    </div>
  ),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildStructuredData(a: any, url: string) {
  const article = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: a.headline ?? a.title,
    datePublished: a.published_at,
    dateModified: a.published_at,
    mainEntityOfPage: url,
    image: a.og_image_url ? [a.og_image_url] : undefined,
    author: { "@type": "Organization", name: "AI Energy Intelligence UK" },
    publisher: {
      "@type": "Organization",
      name: "AI Energy Intelligence UK",
      url: "https://aienergyintelligence.co.uk",
    },
    isBasedOn: a.source_url,
    description: a.meta_description ?? a.analysis?.executive_summary,
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://aienergyintelligence.co.uk" },
      { "@type": "ListItem", position: 2, name: "News", item: "https://aienergyintelligence.co.uk/news" },
      { "@type": "ListItem", position: 3, name: a.headline ?? a.title, item: url },
    ],
  };
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AI Energy Intelligence UK",
    url: "https://aienergyintelligence.co.uk",
  };
  const scripts: Array<{ type: string; children: string }> = [
    { type: "application/ld+json", children: JSON.stringify(article) },
    { type: "application/ld+json", children: JSON.stringify(breadcrumb) },
    { type: "application/ld+json", children: JSON.stringify(org) },
  ];
  if (a.faq && a.faq.length > 0) {
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: a.faq.map((f: { question: string; answer: string }) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }),
    });
  }
  return scripts;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ArticlePage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(articleQueryOptions(slug));
  const article = data.article!;
  const { data: related } = useSuspenseQuery(relatedQueryOptions(slug, article.categories));

  const shareUrl = `https://aienergyintelligence.co.uk/news/${article.slug}`;
  const shareText = encodeURIComponent(article.headline ?? article.title);

  const tocSections = [
    { id: "summary", label: "Executive summary" },
    { id: "why-it-matters", label: "Why it matters" },
    { id: "impact", label: "Sector impact" },
    ...(article.key_statistics.length > 0 ? [{ id: "stats", label: "Key statistics" }] : []),
    ...(article.analysis.quotations && article.analysis.quotations.length > 0
      ? [{ id: "quotes", label: "Quotations" }]
      : []),
    { id: "long-term", label: "Long-term implications" },
    ...(article.faq.length > 0 ? [{ id: "faq", label: "FAQ" }] : []),
    { id: "source", label: "Original source" },
  ];

  return (
    <article className="mx-auto max-w-7xl px-4 sm:px-6 py-10 md:py-14">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/news" search={{}} className="hover:text-foreground">News</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground truncate">{article.headline ?? article.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1fr_260px]">
        <div className="min-w-0">
          {/* Header */}
          <div className="mb-6 flex flex-wrap items-center gap-2 text-xs">
            {article.is_breaking && (
              <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 font-bold uppercase tracking-wider text-destructive">
                <Flame className="h-3 w-3" /> Breaking
              </span>
            )}
            {article.categories.map((c) => (
              <Link
                key={c}
                to="/news"
                search={{ category: c }}
                className="rounded-full bg-accent px-2.5 py-1 text-brand font-semibold hover:opacity-80"
              >
                {c}
              </Link>
            ))}
          </div>

          <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight tracking-tight">
            {article.headline ?? article.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> {formatDate(article.published_at)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {article.reading_time_minutes} min read
            </span>
            <span className="inline-flex items-center gap-1.5">
              Source:{" "}
              <a
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-brand font-semibold hover:underline inline-flex items-center gap-1"
              >
                {article.source_name} <ExternalLink className="h-3 w-3" />
              </a>
            </span>
          </div>

          {/* Featured image */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-border">
            <img
              src={article.featured_image_url || newsFallbackAsset.url}
              alt={article.title}
              className="w-full object-cover"
            />
          </div>

          {/* Body */}
          <div className="mt-10 space-y-10">
            <Section id="summary" title="Executive summary">
              <p className="text-lg leading-relaxed">{article.analysis.executive_summary}</p>
              <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">
                Reporting based on {article.source_name}
              </p>
            </Section>

            {article.analysis.why_it_matters && (
              <Section id="why-it-matters" title="Why it matters">
                <p className="leading-relaxed text-foreground/90">{article.analysis.why_it_matters}</p>
              </Section>
            )}

            <Section id="impact" title="Sector impact">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
                Analysis by AI Energy Intelligence UK
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <ImpactCard label="UK electricity demand" text={article.analysis.impact_electricity_demand ?? ""} />
                <ImpactCard label="UK energy security" text={article.analysis.impact_energy_security ?? ""} />
                <ImpactCard label="Businesses" text={article.analysis.impact_business ?? ""} />
                <ImpactCard label="Consumers" text={article.analysis.impact_consumers ?? ""} />
              </div>
            </Section>

            {article.key_statistics.length > 0 && (
              <Section id="stats" title="Key statistics">
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {article.key_statistics.map((s, i) => (
                    <div key={i} className="rounded-xl border border-border bg-card p-4">
                      <div className="font-display text-2xl font-bold text-brand">{s.value}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Figures as reported by {article.source_name}. See original source for context.
                </p>
              </Section>
            )}

            {article.analysis.quotations && article.analysis.quotations.length > 0 && (
              <Section id="quotes" title="Quotations">
                <div className="space-y-4">
                  {article.analysis.quotations.map((q, i) => (
                    <blockquote
                      key={i}
                      className="border-l-4 border-brand bg-accent/40 pl-4 py-3 rounded-r-md"
                    >
                      <p className="italic text-foreground">"{q.text}"</p>
                      <footer className="mt-2 text-sm text-muted-foreground">— {q.attribution}</footer>
                    </blockquote>
                  ))}
                </div>
              </Section>
            )}

            {article.analysis.long_term_implications && (
              <Section id="long-term" title="Long-term implications">
                <p className="leading-relaxed">{article.analysis.long_term_implications}</p>
              </Section>
            )}

            {article.analysis.related_technologies && article.analysis.related_technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.analysis.related_technologies.map((t) => (
                  <span key={t} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                    {t}
                  </span>
                ))}
              </div>
            )}

            {article.faq.length > 0 && (
              <Section id="faq" title="Frequently asked questions">
                <div className="space-y-4">
                  {article.faq.map((f, i) => (
                    <details key={i} className="rounded-lg border border-border bg-card p-4">
                      <summary className="cursor-pointer font-semibold">{f.question}</summary>
                      <p className="mt-2 text-muted-foreground leading-relaxed">{f.answer}</p>
                    </details>
                  ))}
                </div>
              </Section>
            )}

            {/* Related hub links */}
            {article.related_hub_links.length > 0 && (
              <div className="rounded-2xl border border-border bg-surface p-6">
                <h3 className="font-display font-bold text-lg">Explore related tools</h3>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {article.related_hub_links.map((l) => (
                    <li key={l.href}>
                      <Link
                        to={l.href}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
                      >
                        {l.title} <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Original source attribution */}
            <Section id="source" title="Original source">
              <div className="rounded-xl border border-border bg-card p-5">
                <p className="text-sm text-muted-foreground">
                  This story summarises reporting from{" "}
                  <span className="font-semibold text-foreground">{article.source_name}</span>. Read
                  the original for full context.
                </p>
                <a
                  href={article.source_url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  Read on {article.source_domain} <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </Section>

            {/* Share */}
            <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Share2 className="h-4 w-4" /> Share
              </span>
              <a
                aria-label="Share on X"
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border p-2 hover:bg-secondary"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                aria-label="Share on LinkedIn"
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border p-2 hover:bg-secondary"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                aria-label="Share on Facebook"
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border p-2 hover:bg-secondary"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>

            {/* Prev / next */}
            <div className="grid gap-4 sm:grid-cols-2 border-t border-border pt-6">
              {data.prev ? (
                <Link
                  to="/news/$slug"
                  params={{ slug: data.prev.slug }}
                  className="group rounded-xl border border-border bg-card p-4 hover:shadow-card transition"
                >
                  <div className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <ArrowLeft className="h-3 w-3" /> Previous
                  </div>
                  <div className="mt-1 font-semibold line-clamp-2">{data.prev.title}</div>
                </Link>
              ) : <div />}
              {data.next ? (
                <Link
                  to="/news/$slug"
                  params={{ slug: data.next.slug }}
                  className="group rounded-xl border border-border bg-card p-4 hover:shadow-card transition text-right"
                >
                  <div className="text-xs uppercase tracking-wider text-muted-foreground flex items-center justify-end gap-1">
                    Next <ArrowRight className="h-3 w-3" />
                  </div>
                  <div className="mt-1 font-semibold line-clamp-2">{data.next.title}</div>
                </Link>
              ) : <div />}
            </div>

            {/* About this data */}
            <AboutThisData lastVerified={article.published_at} showByline={false} />

            {/* Recommended reports */}
            <RelatedReports
              categories={categoriesForNews(article.categories)}
              topics={article.tags ?? []}
              title="Recommended reports"
              intro="Independent UK research that expands on the themes in this story."
            />

            {/* Newsletter */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-display font-bold text-xl">Get the UK AI Energy briefing</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Analysis on AI, electricity and the UK grid, straight to your inbox.
              </p>
              <div className="mt-4">
                <LeadCapture variant="newsletter" source="homepage-newsletter" context={article.slug} />
              </div>
            </div>

            {/* Related articles */}
            {related.items.length > 0 && (
              <div>
                <h3 className="font-display font-bold text-xl mb-4">Related stories</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {related.items.map((r) => (
                    <Link
                      key={r.id}
                      to="/news/$slug"
                      params={{ slug: r.slug }}
                      className="group rounded-xl border border-border bg-card p-4 hover:shadow-card transition"
                    >
                      <div className="text-xs text-muted-foreground">{r.source_name}</div>
                      <div className="mt-1 font-semibold leading-snug line-clamp-3">
                        {r.headline ?? r.title}
                      </div>
                      <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand">
                        Read <ArrowUpRight className="h-3 w-3" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky TOC */}
        <aside className="hidden lg:block">
          <nav aria-label="On this page" className="sticky top-24 rounded-2xl border border-border bg-card p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              On this page
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {tocSections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-muted-foreground hover:text-brand transition-colors">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            {article.confidence_rating != null && (
              <div className="mt-5 pt-5 border-t border-border">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Confidence</div>
                <div className="mt-1 font-display text-lg font-bold">
                  {Math.round(article.confidence_rating * 100)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Editorial confidence in the analysis, based on source clarity and specificity.
                </p>
              </div>
            )}
          </nav>
        </aside>
      </div>
      <EvidencePanel variant="story" />
    </article>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="font-display text-2xl font-bold mb-3">{title}</h2>
      {children}
    </section>
  );
}

function ImpactCard({ label, text }: { label: string; text: string }) {
  if (!text) {
    return (
      <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
        <div className="font-semibold text-foreground">{label}</div>
        <div className="mt-1">Not directly addressed by the source.</div>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-xs uppercase tracking-wider text-brand font-semibold">{label}</div>
      <p className="mt-1.5 text-sm leading-relaxed">{text}</p>
    </div>
  );
}
