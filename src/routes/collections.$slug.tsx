import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, BookOpen, Download, Layers, Lock, Sparkles } from "lucide-react";
import {
  getCollection,
  getReport,
  categoryLabel,
  formatDate,
  STATUS_LABELS,
  type Report,
  type Collection,
} from "@/data/reports";

export const Route = createFileRoute("/collections/$slug")({
  loader: ({ params }) => {
    const collection = getCollection(params.slug);
    if (!collection) throw notFound();
    const reports = collection.reports
      .map(getReport)
      .filter((r): r is Report => !!r);
    return { collection, reports };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Collection not found | AI Energy Intelligence UK" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { collection: c } = loaderData;
    const url = `https://aienergyintelligence.co.uk/collections/${c.slug}`;
    return {
      meta: [
        { title: `${c.title} | AI Energy Intelligence UK` },
        { name: "description", content: c.blurb },
        { property: "og:title", content: c.title },
        { property: "og:description", content: c.blurb },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Collection not found</h1>
      <p className="mt-3 text-muted-foreground">This collection may have been renamed or is no longer available.</p>
      <Link to="/reports" className="mt-6 inline-flex items-center gap-1 text-brand font-semibold">
        Back to the library <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  ),
  errorComponent: () => (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Something went wrong</h1>
      <Link to="/reports" className="mt-6 inline-flex items-center gap-1 text-brand font-semibold">
        Back to the library <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  ),
  component: CollectionPage,
});

function CollectionPage() {
  const { collection: c, reports } = Route.useLoaderData() as {
    collection: Collection;
    reports: Report[];
  };
  const freeCount = reports.filter((r) => r.tier === "free").length;
  const premiumCount = reports.length - freeCount;
  const totalPages = reports.reduce((n, r) => n + (r.pages ?? 0), 0);

  return (
    <>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="border-b border-border bg-surface">
        <ol className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          <li><Link to="/" className="hover:text-foreground">Home</Link></li>
          <li>/</li>
          <li><Link to="/reports" className="hover:text-foreground">Reports</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">{c.title}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-energy-deep text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(80,120,255,0.25),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-20 grid gap-10 lg:grid-cols-[1.4fr_1fr] items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/80">
              <Sparkles className="h-3 w-3 text-electric" /> Research collection
            </div>
            <h1 className="mt-5 font-display text-4xl md:text-5xl font-bold tracking-tight text-balance">
              {c.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-white/80 leading-relaxed">{c.blurb}</p>
            <div className="mt-8 grid grid-cols-3 gap-6 max-w-lg">
              <Stat k={String(reports.length)} v="Reports" />
              <Stat k={String(freeCount)} v="Free downloads" />
              <Stat k={`${totalPages}`} v="Pages of research" />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#reports"
                className="inline-flex items-center gap-2 rounded-md bg-electric px-5 py-3 text-sm font-semibold text-white shadow-elegant hover:opacity-90"
              >
                Browse the collection <ArrowRight className="h-4 w-4" />
              </a>
              {premiumCount > 0 && (
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Enquire about full pack
                </Link>
              )}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-elegant">
            <img src={c.cover} alt="" className="aspect-[4/3] w-full object-cover" />
          </div>
        </div>
      </section>

      {/* Reports grid */}
      <section id="reports" className="mx-auto max-w-7xl px-4 sm:px-6 py-16 scroll-mt-24">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-brand">Inside this collection</div>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold tracking-tight text-balance">
            {reports.length} reports, {freeCount > 0 ? `${freeCount} free to download` : "all premium"}
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Every report is authored by the AI Energy Intelligence UK research team. Free reports download instantly after
            you enter your email; premium reports are available to teams and institutional subscribers.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((r) => (
            <ReportCard key={r.slug} r={r} />
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-brand-foreground">
            <Layers className="h-6 w-6" />
          </div>
          <h2 className="mt-5 font-display text-3xl font-bold text-balance">
            Prefer the full collection as a pack?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Get every report in {c.title} bundled together, refreshed as new editions publish, and briefed by the analyst
            team.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <div className="text-sm text-muted-foreground">
              Collection price <span className="font-display text-2xl font-bold text-foreground">{c.price}</span>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Enquire about this collection <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="font-display text-3xl font-bold text-white">{k}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-white/60">{v}</div>
    </div>
  );
}

function ReportCard({ r }: { r: Report }) {
  const isFree = r.tier === "free";
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card hover:shadow-elegant hover:-translate-y-0.5 transition-all">
      <Link
        to="/reports/$slug"
        params={{ slug: r.slug }}
        className="block aspect-[16/9] overflow-hidden"
        aria-label={r.title}
      >
        <img src={r.cover} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-brand">
            {categoryLabel(r.category)}
          </span>
          {isFree ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-success">
              Free
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
              <Lock className="h-2.5 w-2.5" /> Premium
            </span>
          )}
        </div>
        <h3 className="mt-3 font-display text-base font-bold leading-snug">
          <Link to="/reports/$slug" params={{ slug: r.slug }} className="hover:text-brand">
            {r.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed line-clamp-3">{r.summary}</p>
        <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-[11px] uppercase tracking-wider text-muted-foreground">
          <span>{STATUS_LABELS[r.status]}</span>
          {r.publishedAt && (<><span>·</span><span>{formatDate(r.publishedAt)}</span></>)}
          {r.pages && (<><span>·</span><span>{r.pages} pages</span></>)}
        </div>
        <div className="mt-5">
          <Link
            to="/reports/$slug"
            params={{ slug: r.slug }}
            className={
              isFree
                ? "inline-flex w-full items-center justify-center gap-2 rounded-md bg-electric px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                : "inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            }
          >
            {isFree ? (
              <>
                <Download className="h-4 w-4" /> Download free PDF
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4" /> View premium report
              </>
            )}
          </Link>
          <Link
            to="/reports/$slug"
            params={{ slug: r.slug }}
            className="mt-2 inline-flex w-full items-center justify-center gap-1 text-xs font-semibold text-brand hover:underline"
          >
            View report details <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}
