import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Clock, ChevronRight, ExternalLink, ListChecks } from "lucide-react";
import { RESEARCH_TOPICS } from "@/lib/research-topics";
import { getPublishedPostBySlug } from "@/lib/blog.functions";
import { ShareButtons } from "@/components/ShareButtons";
import { RelatedCalculators } from "@/components/RelatedCalculators";
import { SmartImage } from "@/components/media/SmartImage";
import { EvidencePanel } from "@/components/EvidencePanel";
import { AboutThisData } from "@/components/AboutThisData";


function readingTime(html: string | null | undefined): number {
  if (!html) return 3;
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 220));
}

const postQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["blog", "post", slug],
    queryFn: () => getPublishedPostBySlug({ data: { slug } }),
    staleTime: 5 * 60 * 1000,
  });

// Slugs retired during the Analysis & Research consolidation. Their content
// was merged into the surviving article, so redirect rather than 404.
const CONSOLIDATED_SLUGS: Record<string, string> = {
  "will-ai-data-centres-affect-local-house-prices":
    "will-ai-data-centres-change-uk-house-prices",
};

export const Route = createFileRoute("/blog/$slug")({
  beforeLoad: ({ params }) => {
    const target = CONSOLIDATED_SLUGS[params.slug];
    if (target) {
      throw redirect({ to: "/blog/$slug", params: { slug: target }, replace: true });
    }
  },
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(
      postQueryOptions(params.slug),
    );
    if (!data.post) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) {
      return { meta: [{ title: "Post not found | AI Energy Intelligence UK" }] };
    }
    const title = post.meta_title || `${post.title} | AI Energy Intelligence UK`;
    const description =
      post.meta_description || post.excerpt || "Editorial from AI Energy Intelligence UK.";
    const image = post.og_image_url || post.cover_image_url || undefined;
    const url = `https://aienergyintelligence.co.uk/blog/${post.slug}`;
    const wordCount = post.body_html
      ? post.body_html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length
      : undefined;
    const article: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      url,
      inLanguage: "en-GB",
      author: post.author_name
        ? { "@type": "Person", name: post.author_name }
        : { "@type": "Organization", name: "AI Energy Intelligence UK", url: "https://aienergyintelligence.co.uk" },
      publisher: {
        "@type": "Organization",
        name: "AI Energy Intelligence UK",
        url: "https://aienergyintelligence.co.uk",
        logo: {
          "@type": "ImageObject",
          url: "https://aienergyintelligence.co.uk/favicon.ico",
        },
      },
      ...(post.published_at ? { datePublished: post.published_at } : {}),
      ...(post.updated_at ? { dateModified: post.updated_at } : { ...(post.published_at ? { dateModified: post.published_at } : {}) }),
      ...(image ? { image: [image] } : {}),
      ...(wordCount ? { wordCount } : {}),
      ...(post.categories?.length ? { articleSection: post.categories } : {}),
      ...(post.tags?.length ? { keywords: post.tags.join(", ") } : {}),
      ...(post.last_updated_at ? { dateModified: post.last_updated_at } : {}),
      ...(post.sources?.length
        ? {
            citation: post.sources.map((src) => ({
              "@type": "CreativeWork",
              name: src.title,
              url: src.url,
              ...(src.publisher ? { publisher: { "@type": "Organization", name: src.publisher } } : {}),
            })),
          }
        : {}),
    };
    const breadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://aienergyintelligence.co.uk/" },
        { "@type": "ListItem", position: 2, name: "Analysis & Research", item: "https://aienergyintelligence.co.uk/blog" },
        ...(post.categories?.[0]
          ? [{ "@type": "ListItem", position: 3, name: post.categories[0], item: `https://aienergyintelligence.co.uk/blog?category=${encodeURIComponent(post.categories[0])}` }]
          : []),
        { "@type": "ListItem", position: post.categories?.[0] ? 4 : 3, name: post.title, item: url },
      ],
    };
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        ...(image ? [{ property: "og:image", content: image }] : []),
        { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
        ...(image ? [{ name: "twitter:image", content: image }] : []),
        ...(post.published_at
          ? [{ property: "article:published_time", content: post.published_at }]
          : []),
        ...(post.updated_at
          ? [{ property: "article:modified_time", content: post.updated_at }]
          : []),
        ...(post.categories ?? []).map((c) => ({ property: "article:section", content: c })),
        ...(post.tags ?? []).map((t) => ({ property: "article:tag", content: t })),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(article) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumb) },
      ],
    };
  },

  component: BlogPostPage,
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-3 text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Post not found</h1>
      <Link to="/blog" className="mt-4 inline-block text-brand font-semibold">
        ← Back to Analysis &amp; Research
      </Link>
    </div>
  ),
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(postQueryOptions(slug));
  const post = data.post!;
  const pillar = RESEARCH_TOPICS.find((t) => t.pillarKey === post.pillar);

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/blog" className="hover:text-foreground">Analysis &amp; Research</Link>
        {post.categories[0] && (
          <>
            <ChevronRight className="h-3 w-3" />
            <Link to="/blog" search={{ category: post.categories[0] }} className="hover:text-foreground">
              {post.categories[0]}
            </Link>
          </>
        )}
        <ChevronRight className="h-3 w-3" />
        <span className="truncate max-w-[220px] text-foreground/70">{post.title}</span>
      </nav>

      <Link
        to="/blog"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Analysis &amp; Research
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
        {post.categories.map((c) => (
          <Link
            key={c}
            to="/blog"
            search={{ category: c }}
            className="rounded-full bg-accent px-2.5 py-1 font-semibold text-brand"
          >
            {c}
          </Link>
        ))}
      </div>

      <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl">
        {post.title}
      </h1>

      {post.excerpt && (
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">
          {post.author_name || "AI Energy Intelligence UK Editorial"}
        </span>
        {post.published_at && (
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            {new Date(post.published_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-4 w-4" aria-hidden="true" />
          {readingTime(post.body_html)} min read
        </span>
        {post.last_updated_at && (
          <span>
            Updated{" "}
            {new Date(post.last_updated_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        )}
        {pillar && (
          <Link
            to="/research/$topic"
            params={{ topic: pillar.slug }}
            className="font-semibold text-brand hover:underline"
          >
            {pillar.label}
          </Link>
        )}
      </div>

      <SmartImage
        src={post.cover_image_url}
        alt={post.title}
        ratio="16/9"
        priority
        fallbackLabel={post.categories[0] ?? "Analysis"}
        className="mt-8 rounded-xl border border-border"
      />


      {post.change_note && (
        <section className="mt-8 rounded-xl border border-brand/30 bg-brand/5 p-5">
          <h2 className="font-display text-base font-bold">What changed</h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {post.change_note}
          </p>
        </section>
      )}

      {post.review_status !== "reviewed" && (
        <p className="mt-8 rounded-xl border border-border bg-surface/60 p-4 text-xs leading-relaxed text-muted-foreground">
          {post.review_status === "in_review"
            ? "This article is currently going through our evidence review: sources, figures and claims are being re-checked against primary UK material."
            : "This article predates our current evidence standard and has not yet completed source review. Figures should be treated with caution until it has."}{" "}
          <Link to="/editorial-standards" className="font-semibold text-brand hover:underline">
            Editorial standards
          </Link>
        </p>
      )}

      {post.key_findings.length > 0 && (
        <section className="mt-8 rounded-xl border border-border bg-surface/60 p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold">
            <ListChecks className="h-5 w-5 text-brand" aria-hidden="true" /> Key findings
          </h2>
          <ul className="mt-4 space-y-2.5">
            {post.key_findings.map((f) => (
              <li key={f} className="flex gap-2.5 text-sm leading-relaxed">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-8">
        <ShareButtons
          url={`https://aienergyintelligence.co.uk/blog/${post.slug}`}
          title={post.title}
          description={post.excerpt ?? ""}
        />
      </div>

      <div
        className="prose prose-slate dark:prose-invert mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: post.body_html }}
      />

      {post.chart_note && (
        <p className="mt-4 text-xs text-muted-foreground border-l-2 border-border pl-3">
          {post.chart_note}
        </p>
      )}

      {(post.methodology || post.limitations) && (
        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          {post.methodology && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="font-display text-base font-bold">Methodology</h2>
              <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground leading-relaxed">
                {post.methodology}
              </p>
            </div>
          )}
          {post.limitations && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="font-display text-base font-bold">Limitations</h2>
              <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground leading-relaxed">
                {post.limitations}
              </p>
            </div>
          )}
        </section>
      )}

      {post.sources.length > 0 && (
        <section className="mt-8 rounded-xl border border-border bg-surface/60 p-6">
          <h2 className="font-display text-base font-bold">Sources</h2>
          <ol className="mt-3 space-y-2.5 text-sm">
            {post.sources.map((src, i) => (
              <li key={src.url + i} className="leading-relaxed">
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-1 font-medium text-brand hover:underline"
                >
                  {src.title}
                  <ExternalLink className="mt-1 h-3 w-3 shrink-0" aria-hidden="true" />
                </a>
                {src.publisher && <span className="text-muted-foreground"> — {src.publisher}</span>}
                {src.accessed && (
                  <span className="text-muted-foreground"> (accessed {src.accessed})</span>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {post.corrections_note && (
        <section className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
          <h2 className="font-display text-base font-bold">Correction</h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {post.corrections_note}
          </p>
        </section>
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        Spotted an error?{" "}
        <Link to="/corrections" className="font-semibold text-brand hover:underline">
          Request a correction
        </Link>
        .
      </p>

      <RelatedCalculators
        text={`${post.title} ${post.excerpt ?? ""} ${post.categories.join(" ")} ${post.tags.join(" ")}`}
        topics={[...post.tags, ...post.categories]}
        limit={3}
      />

      <div className="mt-10 border-t border-border pt-6">
        <ShareButtons
          url={`https://aienergyintelligence.co.uk/blog/${post.slug}`}
          title={post.title}
          description={post.excerpt ?? ""}
        />
      </div>

      {post.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground"
            >
              #{t}
            </span>
          ))}
        </div>
      )}
      <AboutThisData lastVerified={post.last_updated_at ?? post.updated_at ?? post.published_at} />
      <EvidencePanel variant="analysis" />
    </article>
  );
}
