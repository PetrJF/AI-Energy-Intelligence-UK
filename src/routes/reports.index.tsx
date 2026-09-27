import { createFileRoute, Link } from "@tanstack/react-router";
import { ReportCover } from "@/components/media/ReportCover";


import { useMemo } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Download,
  FileText,
  Filter,
  Layers,
  Lock,
  Sparkles,
} from "lucide-react";
import {
  REPORTS,
  REPORT_CATEGORIES,
  COLLECTIONS,
  categoryLabel,
  formatDate,
  isAvailable,
  STATUS_LABELS,
  type Report,
} from "@/data/reports";
import { LeadCapture } from "@/components/LeadCapture";
import { OG_REPORTS, ogImageMeta } from "@/lib/og-images";
import ogReportsAsset from "@/assets/og-reports.jpg.asset.json";

type ReportsSearch = {
  category: string;
  tier: string;
  sort: string;
  topic: string;
};

export const Route = createFileRoute("/reports/")({
  validateSearch: (search: Record<string, unknown> | undefined): Partial<ReportsSearch> => {
    const validated: Partial<ReportsSearch> = {};
    if (typeof search?.category === "string") validated.category = search.category;
    if (typeof search?.tier === "string") validated.tier = search.tier;
    if (typeof search?.sort === "string") validated.sort = search.sort;
    if (typeof search?.topic === "string") validated.topic = search.topic;
    return validated;
  },
  head: () => ({
    meta: [
      { title: "UK AI Energy Reports & Research Library | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Independent UK research on AI electricity demand, data centres, grid infrastructure and business AI. Download free reports and browse premium collections.",
      },
      { name: "keywords", content: "UK AI energy reports, AI electricity demand UK, data centre research UK, AI grid impact, business AI ROI, AI energy intelligence" },
      { property: "og:title", content: "UK AI Energy Reports & Research Library" },
      {
        property: "og:description",
        content:
          "Independent UK research on AI electricity demand, data centre capacity, grid infrastructure, business AI ROI and cyber threats.",
      },
      { property: "og:url", content: "https://aienergyintelligence.co.uk/reports" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "AI Energy Intelligence UK" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "UK AI Energy Reports & Research Library" },
      {
        name: "twitter:description",
        content:
          "Independent UK research on AI electricity demand, data centres, grid infrastructure and business AI.",
      },
      ...ogImageMeta(OG_REPORTS),
    ],
    links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/reports" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "UK AI Energy Reports & Research Library",
          description:
            "Independent UK research on AI electricity demand, data centres, grid infrastructure and business AI.",
          url: "https://aienergyintelligence.co.uk/reports",
          inLanguage: "en-GB",
          isPartOf: {
            "@type": "WebSite",
            name: "AI Energy Intelligence UK",
            url: "https://aienergyintelligence.co.uk",
          },
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: REPORTS.length,
            itemListElement: REPORTS.slice(0, 25).map((r, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `https://aienergyintelligence.co.uk/reports/${r.slug}`,
              name: r.title,
            })),
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://aienergyintelligence.co.uk/" },
            { "@type": "ListItem", position: 2, name: "Reports", item: "https://aienergyintelligence.co.uk/reports" },
          ],
        }),
      },
    ],
  }),
  component: ReportsHub,
});

function ReportsHub() {
  const {
    category = "all",
    tier = "all",
    sort = "newest",
    topic = "all",
  } = Route.useSearch();
  const navigate = Route.useNavigate();

  const allTopics = useMemo(() => {
    const set = new Set<string>();
    REPORTS.forEach((r) => r.topics.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    let list = REPORTS.slice();
    if (category !== "all") list = list.filter((r) => r.category === category);
    if (tier !== "all") list = list.filter((r) => r.tier === tier);
    if (topic !== "all") list = list.filter((r) => r.topics.includes(topic));
    list.sort((a, b) => {
      const av = a.publishedAt ?? "";
      const bv = b.publishedAt ?? "";
      if (sort === "oldest") return av.localeCompare(bv);
      return bv.localeCompare(av);
    });
    return list;
  }, [category, tier, sort, topic]);

  const featured = REPORTS.filter(isAvailable).slice(0, 3);
  const freeReports = REPORTS.filter((r) => isAvailable(r) && r.tier === "free");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-energy-deep text-white">
        <img
          src={ogReportsAsset.url}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-energy-deep via-energy-deep/85 to-energy-deep/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(80,120,255,0.35),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/80">
              <Sparkles className="h-3 w-3 text-electric" /> AI Energy Intelligence UK · Research
            </div>
            <h1 className="mt-5 font-display text-4xl md:text-6xl font-bold tracking-tight text-balance">
              The UK Reports &amp; Research Library
            </h1>
            <p className="mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-white/80">
              Independent intelligence on AI, energy, data centres and the infrastructure that powers Britain — for
              investors, operators, policymakers and boards.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#library"
                className="inline-flex items-center gap-2 rounded-md bg-electric px-5 py-3 text-sm font-semibold text-white shadow-elegant hover:opacity-90"
              >
                Browse the library <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#free-research"
                className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Free research
              </a>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-xl">
              {[
                { k: `${REPORTS.filter(isAvailable).length}`, v: "Published reports" },
                { k: `${REPORTS.filter((r) => !isAvailable(r)).length}`, v: "In development" },
                { k: `${REPORT_CATEGORIES.length}`, v: "Topic categories" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="font-display text-3xl font-bold text-white">{s.k}</div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-white/60">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Reports */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <SectionHead
          eyebrow="Featured research"
          title="Latest flagship reports"
          intro="Our most-read intelligence briefings, updated regularly with UK-specific data."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {featured.map((r, i) => (
            <FeaturedCard key={r.slug} r={r} large={i === 0} />
          ))}
        </div>
      </section>

      {/* Browse by category */}
      <section className="bg-surface border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
          <SectionHead
            eyebrow="Browse by category"
            title="Explore the research library"
            intro="Seven focus areas covering how AI is reshaping UK energy, infrastructure and business."
          />
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {REPORT_CATEGORIES.map((c) => {
              const count = REPORTS.filter((r) => r.category === c.slug).length;
              return (
                <Link
                  key={c.slug}
                  to="/reports"
                  search={{ category: c.slug, tier: "all", sort: "newest", topic: "all" }}
                  className="group flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-brand/40 hover:bg-accent/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent">
                    <Layers className="h-4 w-4 text-brand" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{c.label}</span>
                    <span className="block text-xs text-muted-foreground">
                      {count} {count === 1 ? "report" : "reports"}
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </Link>
              );
            })}

          </div>
        </div>
      </section>

      {/* Filters + full library */}
      <section id="library" className="mx-auto max-w-7xl px-4 sm:px-6 py-20 scroll-mt-24">
        <SectionHead
          eyebrow="Full library"
          title="All research reports"
          intro="Filter by category, price, topic or recency."
        />

        <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Filter className="h-3.5 w-3.5" /> Filter
          </div>
          <FilterSelect
            value={category}
            onChange={(v) => navigate({ search: (p: Partial<ReportsSearch>) => ({ ...p, category: v }) })}
            label="Category"
            options={[
              { value: "all", label: "All categories" },
              ...REPORT_CATEGORIES.map((c) => ({ value: c.slug, label: c.label })),
            ]}
          />
          <FilterSelect
            value={tier}
            onChange={(v) => navigate({ search: (p: Partial<ReportsSearch>) => ({ ...p, tier: v }) })}
            label="Access"
            options={[
              { value: "all", label: "Free + Premium" },
              { value: "free", label: "Free" },
              { value: "premium", label: "Premium" },
            ]}
          />
          <FilterSelect
            value={topic}
            onChange={(v) => navigate({ search: (p: Partial<ReportsSearch>) => ({ ...p, topic: v }) })}
            label="Topic"
            options={[
              { value: "all", label: "All topics" },
              ...allTopics.map((t) => ({ value: t, label: t })),
            ]}
          />
          <FilterSelect
            value={sort}
            onChange={(v) => navigate({ search: (p: Partial<ReportsSearch>) => ({ ...p, sort: v }) })}
            label="Sort"
            options={[
              { value: "newest", label: "Newest first" },
              { value: "oldest", label: "Oldest first" },
            ]}
          />
          <div className="ml-auto text-xs text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {REPORTS.length}
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <ReportCard key={r.slug} r={r} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
              No reports match those filters.
            </div>
          )}
        </div>
      </section>

      {/* Free research library w/ newsletter */}
      <section id="free-research" className="border-y border-border bg-energy-deep text-white scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-electric">Free Research Library</div>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold text-balance">
              Free UK intelligence, straight to your inbox
            </h2>
            <p className="mt-4 max-w-xl text-white/75 leading-relaxed">
              Every free report is authored by the AI Energy Intelligence UK research team. Subscribe once — get instant
              access to the full free library, plus the weekly briefing on AI, energy and infrastructure.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-white/80">
              {freeReports.map((r) => (
                <li key={r.slug} className="flex items-start gap-2">
                  <FileText className="mt-0.5 h-4 w-4 text-electric shrink-0" />
                  <Link
                    to="/reports/$slug"
                    params={{ slug: r.slug }}
                    className="hover:text-electric"
                  >
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="self-start rounded-2xl bg-white text-foreground p-6 shadow-elegant">
            <LeadCapture variant="newsletter" source="reports-library" context="free-library" />
          </div>
        </div>
      </section>

      {/* Premium collections */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <SectionHead
          eyebrow="Premium collections"
          title="Curated bundles for teams and boards"
          intro="Pre-built research packs, priced for teams and updated as new reports publish."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {COLLECTIONS.map((c) => (
            <div
              key={c.slug}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card hover:shadow-elegant transition-all"
            >
              <Link
                to="/collections/$slug"
                params={{ slug: c.slug }}
                className="relative block aspect-[16/7] overflow-hidden"
              >
                <img src={c.cover} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <div className="text-xs font-semibold uppercase tracking-wider text-electric">Collection</div>
                  <h3 className="mt-1 font-display text-2xl font-bold">{c.title}</h3>
                </div>
              </Link>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-sm text-muted-foreground leading-relaxed">{c.blurb}</p>
                <ul className="mt-4 space-y-1.5 text-sm">
                  {c.reports.map((s) => {
                    const r = REPORTS.find((x) => x.slug === s);
                    if (!r) return null;
                    return (
                      <li key={s} className="flex items-start gap-2">
                        <BookOpen className="mt-0.5 h-3.5 w-3.5 text-brand shrink-0" />
                        <Link to="/reports/$slug" params={{ slug: s }} className="hover:text-brand">
                          {r.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-6 flex items-end justify-between border-t border-border pt-4">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Collection price</div>
                    <div className="font-display text-2xl font-bold">{c.price}</div>
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <Link
                      to="/collections/$slug"
                      params={{ slug: c.slug }}
                      className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-semibold hover:bg-accent"
                    >
                      View collection <ArrowUpRight className="h-4 w-4" />
                    </Link>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
                    >
                      Enquire <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function SectionHead({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return (
    <div className="max-w-2xl">
      <div className="text-xs font-semibold uppercase tracking-wider text-brand">{eyebrow}</div>
      <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold tracking-tight text-balance">{title}</h2>
      <p className="mt-3 text-muted-foreground leading-relaxed">{intro}</p>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  label,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {label}: {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function StatusChip({ r }: { r: Report }) {
  if (isAvailable(r)) return null;
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-surface px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
      {STATUS_LABELS[r.status]}
    </span>
  );
}

function TierBadge({ tier }: { tier: Report["tier"] }) {
  if (tier === "free") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-success">
        Free
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
      <Lock className="h-2.5 w-2.5" /> Premium
    </span>
  );
}

function ReportMeta({ r }: { r: Report }) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] uppercase tracking-wider text-muted-foreground">
      <span>{STATUS_LABELS[r.status]}</span>
      {r.publishedAt && (<><span>·</span><span>{formatDate(r.publishedAt)}</span></>)}
      {r.pages && (<><span>·</span><span>{r.pages} pages</span></>)}
    </div>
  );
}

function FeaturedCard({ r, large }: { r: Report; large?: boolean }) {
  return (
    <Link
      to="/reports/$slug"
      params={{ slug: r.slug }}
      className="group flex h-full flex-col gap-5 rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-elegant focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:flex-row sm:items-start"
    >
      <div className={large ? "w-full shrink-0 sm:w-44" : "w-full shrink-0 sm:w-32"}>
        <ReportCover
          title={r.title}
          category={r.category}
          categoryLabel={categoryLabel(r.category)}
          publishedAt={r.publishedAt}
          version={r.version}
          tier={r.tier}
          className="transition-transform group-hover:-translate-y-0.5"
        />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-brand">
            {categoryLabel(r.category)}
          </span>
          <div className="flex items-center gap-1.5">
            <StatusChip r={r} />
            <TierBadge tier={r.tier} />
          </div>
        </div>
        <h3 className={`mt-2 font-display font-bold leading-snug ${large ? "text-xl" : "text-lg"}`}>
          {r.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{r.summary}</p>
        <div className="mt-4">
          <ReportMeta r={r} />
        </div>
        <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand">
          {isAvailable(r) ? (r.tier === "free" ? "Download report" : "View report") : "View research scope"}
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}

function ReportCard({ r }: { r: Report }) {
  return (
    <Link
      to="/reports/$slug"
      params={{ slug: r.slug }}
      className="group flex gap-4 rounded-xl border border-border bg-card p-4 shadow-card transition-all hover:shadow-elegant focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <div className="w-24 shrink-0 sm:w-28">
        <ReportCover
          title={r.title}
          category={r.category}
          categoryLabel={categoryLabel(r.category)}
          publishedAt={r.publishedAt}
          version={r.version}
          tier={r.tier}
          size="sm"
          className="transition-transform group-hover:-translate-y-0.5"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[11px] font-semibold uppercase tracking-wider text-brand">
            {categoryLabel(r.category)}
          </span>
          <div className="flex items-center gap-1.5">
            <StatusChip r={r} />
            <TierBadge tier={r.tier} />
          </div>
        </div>
        <h3 className="mt-2 font-display text-base font-bold leading-snug">{r.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {r.summary}
        </p>
        <div className="mt-3">
          <ReportMeta r={r} />
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-brand">
          {!isAvailable(r) ? (
            <>
              <FileText className="h-3.5 w-3.5" /> View research scope
            </>
          ) : r.tier === "free" ? (
            <>
              <Download className="h-3.5 w-3.5" /> Get free report
            </>
          ) : (
            <>
              <Lock className="h-3.5 w-3.5" /> View premium
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

