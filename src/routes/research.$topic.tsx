import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  Building2,
  Calculator,
  FileText,
  Gauge,
  Newspaper,
  ScrollText,
} from "lucide-react";
import { listPublishedPosts } from "@/lib/blog.functions";
import { listNews } from "@/lib/news.functions";
import { RESEARCH_TOPICS, findResearchTopic, type PillarLink } from "@/lib/research-topics";
import { REPORTS, isAvailable, categoryLabel } from "@/data/reports";
import { LeadCapture } from "@/components/LeadCapture";
import newsFallbackAsset from "@/assets/news-fallback.jpg.asset.json";
import research1 from "@/assets/research-1.jpg";
import research2 from "@/assets/research-2.jpg";
import research3 from "@/assets/research-3.jpg";

const postsQueryOptions = queryOptions({
  queryKey: ["blog", "list", "research-topics"],
  queryFn: () => listPublishedPosts({ data: { limit: 100 } }),
  staleTime: 5 * 60 * 1000,
});

const newsQueryOptions = queryOptions({
  queryKey: ["news", "list", "research-topics"],
  queryFn: () => listNews({ data: { limit: 60 } }),
  staleTime: 5 * 60 * 1000,
});

const fallbacks = [research1, research2, research3];

export const Route = createFileRoute("/research/$topic")({
  loader: async ({ context, params }) => {
    if (!findResearchTopic(params.topic)) throw notFound();
    await Promise.all([
      context.queryClient.ensureQueryData(postsQueryOptions),
      context.queryClient.ensureQueryData(newsQueryOptions),
    ]);
  },
  head: ({ params }) => {
    const topic = findResearchTopic(params.topic);
    if (!topic) {
      return { meta: [{ title: "Research topic not found" }, { name: "robots", content: "noindex" }] };
    }
    const url = `https://aienergyintelligence.co.uk/research/${topic.slug}`;
    return {
      meta: [
        { title: `${topic.title} | AI Energy Intelligence UK` },
        { name: "description", content: topic.description },
        { property: "og:title", content: topic.title },
        { property: "og:description", content: topic.description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: "AI Energy Intelligence UK" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: topic.title },
        { name: "twitter:description", content: topic.description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://aienergyintelligence.co.uk/" },
              { "@type": "ListItem", position: 2, name: "Research", item: "https://aienergyintelligence.co.uk/blog" },
              { "@type": "ListItem", position: 3, name: topic.label, item: url },
            ],
          }),
        },
      ],
    };
  },
  component: ResearchTopicPage,
});

function ResearchTopicPage() {
  const { topic: slug } = Route.useParams();
  const topic = findResearchTopic(slug)!;
  const { data: postData } = useSuspenseQuery(postsQueryOptions);
  const { data: newsData } = useSuspenseQuery(newsQueryOptions);

  const posts = postData.items.filter(
    (p) =>
      (p as { pillar?: string | null }).pillar === topic.pillarKey ||
      p.categories.some((c) => topic.blogCategories.includes(c)),
  );
  const featured = posts[0];
  const rest = posts.slice(1);

  const news = newsData.items
    .filter((n) => n.categories.some((c) => topic.newsCategories.includes(c)))
    .slice(0, 6);

  const reports = REPORTS.filter(
    (r) => isAvailable(r) && topic.reportCategories.includes(r.category),
  ).slice(0, 3);

  return (
    <>
      {/* Pillar header */}
      <section className="border-b border-border bg-surface/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-20">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/blog" search={{}} className="hover:text-foreground">Research</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{topic.label}</span>
          </nav>
          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-brand">Research pillar</p>
          <h1 className="mt-2 max-w-3xl font-display text-4xl md:text-5xl font-bold tracking-tight">
            {topic.label}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            {topic.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {RESEARCH_TOPICS.map((t) => (
              <Link
                key={t.slug}
                to="/research/$topic"
                params={{ topic: t.slug }}
                className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  t.slug === topic.slug
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured analysis, or an honest statement of scope */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        {featured ? (
          <>
            <SectionTitle icon={BookOpen} title="Featured analysis" />
            <Link
              to="/blog/$slug"
              params={{ slug: featured.slug }}
              className="group mt-6 grid gap-6 overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:shadow-elegant md:grid-cols-[1.1fr_1fr]"
            >
              <div className="aspect-[16/10] overflow-hidden md:aspect-auto md:h-full">
                <img
                  src={featured.cover_image_url || fallbacks[0]}
                  alt={featured.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center p-6 md:p-8">
                <h2 className="font-display text-2xl md:text-3xl font-bold leading-snug">
                  {featured.title}
                </h2>
                {featured.excerpt && (
                  <p className="mt-3 text-muted-foreground leading-relaxed">{featured.excerpt}</p>
                )}
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                  Read analysis <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
            <SectionTitle icon={ScrollText} title="What this pillar covers" />
            <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
              We have not yet published original analysis under this pillar. Rather than fill the page with
              placeholders, here is exactly what it will cover — and the verified material already on the site
              that relates to it.
            </p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {topic.scope.map((s) => (
                <li key={s} className="flex items-start gap-2 rounded-lg border border-border bg-surface/60 p-3 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Remaining analysis */}
      {rest.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-12">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <SectionTitle icon={BookOpen} title="More analysis in this pillar" />
            <Link to="/blog" search={{}} className="text-sm font-semibold text-brand hover:underline">
              All analysis →
            </Link>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {rest.map((p, i) => (
              <Link
                key={p.id}
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:shadow-elegant"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={p.cover_image_url || fallbacks[(i + 1) % fallbacks.length]}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-lg font-bold leading-snug">{p.title}</h3>
                  {p.excerpt && (
                    <p className="mt-2 flex-1 text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                    Read analysis <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Index + data centre evidence */}
      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid gap-10 lg:grid-cols-2">
          <div>
            <SectionTitle icon={Gauge} title="From the UK AI Energy Index" />
            <p className="mt-3 text-sm text-muted-foreground">
              Every indicator carries its source, the period it covers and a confidence level. Where the evidence
              is insufficient, the Index says so rather than estimating.
            </p>
            <LinkList items={topic.indexLinks} />
          </div>
          {topic.dataCentreLinks.length > 0 && (
            <div>
              <SectionTitle icon={Building2} title="Data-centre evidence" />
              <p className="mt-3 text-sm text-muted-foreground">
                The project register is compiled from planning records and company announcements. It is not a
                complete national census and does not claim to be.
              </p>
              <LinkList items={topic.dataCentreLinks} />
            </div>
          )}
        </div>
      </section>

      {/* Tools + reports */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid gap-10 lg:grid-cols-2">
        <div>
          <SectionTitle icon={Calculator} title="Tools for this subject" />
          <p className="mt-3 text-sm text-muted-foreground">
            All outputs are modelled estimates based on the inputs you provide, not measured values.
          </p>
          <LinkList items={topic.tools} />
        </div>
        <div>
          <SectionTitle icon={FileText} title="Related reports" />
          {reports.length === 0 ? (
            <p className="mt-3 rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
              No published report covers this pillar yet. The{" "}
              <Link to="/reports" search={{}} className="font-semibold text-brand hover:underline">
                research library
              </Link>{" "}
              lists what is published and what is still in development.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {reports.map((r) => (
                <li key={r.slug}>
                  <Link
                    to="/reports/$slug"
                    params={{ slug: r.slug }}
                    className="flex flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand/40 hover:bg-accent/30"
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-brand">
                      {categoryLabel(r.category)}
                    </span>
                    <span className="mt-1 font-semibold leading-snug">{r.title}</span>
                    <span className="mt-1 text-sm text-muted-foreground line-clamp-2">{r.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* News */}
      {news.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <SectionTitle icon={Newspaper} title="Recent news in this pillar" />
            <Link to="/news" search={{}} className="text-sm font-semibold text-brand hover:underline">
              All news →
            </Link>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {news.map((n) => (
              <Link
                key={n.id}
                to="/news/$slug"
                params={{ slug: n.slug }}
                className="group flex gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-elegant"
              >
                <img
                  src={n.featured_image_url || newsFallbackAsset.url}
                  alt={n.title}
                  loading="lazy"
                  className="h-20 w-24 shrink-0 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold leading-snug line-clamp-3">{n.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{n.source_name}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Methodology + CTA */}
      <section className="border-t border-border bg-energy-deep text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h2 className="font-display text-3xl font-bold">How we research this</h2>
            <p className="mt-4 max-w-xl text-white/75 leading-relaxed">
              We work from primary UK sources — DESNZ, NESO, Ofgem, planning authorities and published company
              documents. Where a figure is modelled by us it is labelled an AI Energy Intelligence modelled
              estimate, with its assumptions shown. Where the evidence does not exist, we say so.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/research-methodology"
                className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold hover:bg-white/10"
              >
                Research methodology <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/corrections"
                className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold hover:bg-white/10"
              >
                Request a correction
              </Link>
            </div>
          </div>
          <div className="self-start rounded-2xl bg-white p-6 text-foreground shadow-elegant">
            <LeadCapture variant="newsletter" source="footer-newsletter" context={`research-pillar-${topic.slug}`} />
          </div>
        </div>
      </section>
    </>
  );
}

function SectionTitle({
  icon: Icon,
  title,
}: {
  icon: typeof BookOpen;
  title: string;
}) {
  return (
    <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
      <Icon className="h-5 w-5 text-brand" aria-hidden="true" /> {title}
    </h2>
  );
}

function LinkList({ items }: { items: PillarLink[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="mt-4 space-y-3">
      {items.map((l) => (
        <li key={l.label}>
          <Link
            to={l.to}
            className="flex flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand/40 hover:bg-accent/30"
          >
            <span className="font-semibold">{l.label}</span>
            <span className="mt-1 text-sm text-muted-foreground">{l.note}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
