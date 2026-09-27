import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowUpRight, ChevronDown, Clock, Newspaper, Radio, Search } from "lucide-react";
import newsHeroAsset from "@/assets/news-hero-bg.jpg.asset.json";
import { listNews, type NewsListItem } from "@/lib/news.functions";
import { SmartImage } from "@/components/media/SmartImage";
import { filterPresentableNews } from "@/lib/news-quality";

const MAIN_CATEGORIES = [
  "AI Infrastructure",
  "Data Centres",
  "Electricity Demand",
  "UK Energy Policy",
  "National Grid",
  "Energy Security",
];

const MORE_CATEGORIES = [
  "Grid Capacity",
  "Renewable Energy",
  "Nuclear",
  "Battery Storage",
  "AI Regulation",
  "Cloud Computing",
  "Investment",
  "Market Analysis",
];

const PAGE_SIZE = 12;

const newsQueryOptions = (category?: string) =>
  queryOptions({
    queryKey: ["news", "list", category ?? "all"],
    queryFn: () =>
      listNews({ data: { limit: 60, category } as { limit: number; category?: string } }),
    staleTime: 5 * 60 * 1000,
  });

const searchSchema = (search: Record<string, unknown> | undefined): { category?: string } => ({
  category: typeof search?.category === "string" ? search.category : undefined,
});

export const Route = createFileRoute("/news/")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ category: search.category }),
  loader: ({ context, deps }) =>
    context.queryClient.ensureQueryData(newsQueryOptions(deps.category)),
  head: () => ({
    meta: [
      { title: "UK AI Energy News | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Automated, trusted news on AI electricity demand, UK data centres, National Grid, NESO, Ofgem and AI infrastructure — with editorial analysis.",
      },
      { property: "og:title", content: "UK AI Energy News | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content:
          "Updated daily with news on AI infrastructure and the UK energy system, sourced from trusted publishers with independent analysis.",
      },
      { property: "og:url", content: "https://aienergyintelligence.co.uk/news" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/news" }],
  }),
  component: NewsIndex,
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">News is temporarily unavailable</h1>
      <p className="mt-3 text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Not found</h1>
    </div>
  ),
});

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function relative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.round(diff / 3_600_000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d}d ago`;
  return formatDate(iso);
}

function CategoryChip({ label, active }: { label?: string; active: boolean }) {
  return (
    <Link
      to="/news"
      search={label ? { category: label } : {}}
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
        active
          ? "bg-primary text-primary-foreground"
          : "border border-border bg-card text-muted-foreground hover:text-foreground"
      }`}
    >
      {label ?? "All news"}
    </Link>
  );
}

function NewsIndex() {
  const { category } = Route.useSearch();
  const { data } = useSuspenseQuery(newsQueryOptions(category));
  const [query, setQuery] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const items = useMemo(() => {
    const clean = filterPresentableNews(data.items);
    const q = query.trim().toLowerCase();
    if (!q) return clean;
    return clean.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        (i.headline ?? "").toLowerCase().includes(q) ||
        i.source_name.toLowerCase().includes(q),
    );
  }, [data.items, query]);

  const [lead, ...rest] = items;
  const shown = rest.slice(0, visible);

  return (
    <>
      {/* Hero — reduced height */}
      <section className="relative overflow-hidden border-b border-border bg-[#0a0f1c] text-white">
        <img
          src={newsHeroAsset.url}
          alt="London skyline at twilight above the UK electricity network"
          width={1920}
          height={1080}
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1c] via-[#0a0f1c]/85 to-[#0a0f1c]/30" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-sky-300">
            <Radio className="h-3 w-3" aria-hidden="true" /> UK AI Energy Intelligence News
          </div>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
            The latest on AI, electricity and the UK grid
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/75">
            Updated daily with news on AI infrastructure, data centres, National Grid capacity and
            UK energy policy — sourced from trusted publishers, with editorial analysis. For wider
            UK energy-market context, see{" "}
            <a
              href="https://energysector.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white underline underline-offset-2"
            >
              Energy Watch UK
            </a>
            .
          </p>
        </div>
      </section>

      {/* Search + filters */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <label htmlFor="news-search" className="sr-only">
            Search news
          </label>
          <div className="relative max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id="news-search"
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(PAGE_SIZE);
              }}
              placeholder="Search headlines and sources"
              className="w-full rounded-md border border-input bg-background py-2.5 pl-9 pr-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <CategoryChip active={!category} />
            {MAIN_CATEGORIES.map((c) => (
              <CategoryChip key={c} label={c} active={category === c} />
            ))}
            <button
              type="button"
              onClick={() => setShowMore((v) => !v)}
              aria-expanded={showMore}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              More topics
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${showMore ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
          </div>

          {showMore && (
            <div className="mt-2 flex flex-wrap gap-2">
              {MORE_CATEGORIES.map((c) => (
                <CategoryChip key={c} label={c} active={category === c} />
              ))}
            </div>
          )}
        </div>
      </section>

      {items.length === 0 ? (
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <Newspaper className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" />
          <h2 className="mt-4 text-2xl font-bold">No stories match</h2>
          <p className="mt-2 text-muted-foreground">
            Try another topic or search term, or explore our{" "}
            <Link to="/blog" className="font-semibold text-brand underline">
              analysis and research
            </Link>
            .
          </p>
        </div>
      ) : (
        <>
          <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
            <FeaturedCard item={lead} />
          </section>

          {shown.length > 0 && (
            <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {shown.map((item) => (
                  <NewsRow key={item.id} item={item} />
                ))}
              </div>

              {rest.length > shown.length && (
                <div className="mt-10 text-center">
                  <button
                    type="button"
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-6 py-3 text-sm font-semibold transition hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    Load more stories
                  </button>
                </div>
              )}
            </section>
          )}
        </>
      )}
    </>
  );
}

function SourceTag({ item }: { item: NewsListItem }) {
  const isOriginal = /ai energy intelligence/i.test(item.source_name);
  return (
    <span
      className={`rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
        isOriginal ? "bg-brand/10 text-brand" : "bg-secondary text-muted-foreground"
      }`}
    >
      {isOriginal ? "AI Energy Intelligence analysis" : item.source_name}
    </span>
  );
}

function NewsRow({ item }: { item: NewsListItem }) {
  return (
    <Link
      to="/news/$slug"
      params={{ slug: item.slug }}
      className="group grid grid-cols-[112px_minmax(0,1fr)] gap-4 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-elegant focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <SmartImage
        src={item.featured_image_url}
        alt={item.title}
        ratio="3/2"
        className="rounded-lg"
        sizes="112px"
      />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          {item.categories.slice(0, 1).map((c) => (
            <span key={c} className="text-[11px] font-semibold uppercase tracking-wider text-brand">
              {c}
            </span>
          ))}
          <SourceTag item={item} />
        </div>
        <h3 className="mt-1.5 line-clamp-2 font-display text-base font-bold leading-snug group-hover:text-brand">
          {item.headline || item.title}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
          <span>{relative(item.published_at)}</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden="true" /> {item.reading_time_minutes} min
          </span>
        </div>
      </div>
    </Link>
  );
}

function FeaturedCard({ item }: { item: NewsListItem }) {
  return (
    <Link
      to="/news/$slug"
      params={{ slug: item.slug }}
      className="group grid gap-8 rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-elegant focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand md:grid-cols-2 md:items-center md:p-7"
    >
      <SmartImage
        src={item.featured_image_url}
        alt={item.title}
        ratio="16/9"
        className="rounded-lg"
        sizes="(min-width: 768px) 50vw, 100vw"
        imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-sm bg-brand/10 px-2 py-0.5 font-bold uppercase tracking-wider text-brand">
            Leading story
          </span>
          <SourceTag item={item} />
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold leading-tight md:text-3xl">
          {item.headline || item.title}
        </h2>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>{relative(item.published_at)}</span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {item.reading_time_minutes} min read
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-brand">
            Read analysis <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
