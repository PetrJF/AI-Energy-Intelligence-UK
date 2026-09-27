import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { indexSectionsQueryOptions } from "@/lib/index-sections.queries";
import {
  INDEX_REGIONS,
  SUBINDEX_META,
  COMPLETENESS_LABELS,
  NOT_AVAILABLE,
  fmtDate,
  regionName,
} from "@/lib/index-sections";
import {
  IndicatorTable,
  RegionalGrowthTable,
  SectionNav,
  DirectionChip,
} from "@/components/index/IndexSectionUI";
import { ProjectRegister } from "@/components/index/ProjectRegister";

import { Breadcrumbs, breadcrumbJsonLd, SITE_ORIGIN, type Crumb } from "@/components/Breadcrumbs";
import { IndexCitation } from "@/components/index/IndexCitation";
import { IndexUpdatesCTA } from "@/components/index/IndexUpdatesCTA";
import { IndexReviewStatus } from "@/components/ReviewStatus";

const CANONICAL = "https://aienergyintelligence.co.uk/uk-ai-energy-index/data-centre-growth";

const CRUMBS: Crumb[] = [
  { label: "Home", to: "/" },
  { label: "UK AI Energy Index", to: "/uk-ai-energy-index" },
  { label: "Data Centre Growth" },
];

export const Route = createFileRoute("/uk-ai-energy-index/data-centre-growth")({
  loader: ({ context }) => context.queryClient.ensureQueryData(indexSectionsQueryOptions),
  errorComponent: ({ error }) => (
    <div role="alert" className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">We couldn&rsquo;t load this sub-index</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">Sub-index not found.</div>
  ),
  head: () => ({
    meta: [
      { title: SUBINDEX_META["data-centre-growth"].title },
      {
        name: "description",
        content:
          "Operational, under-construction, approved and proposed UK data centres by region, with capacity in megawatts, hyperscale developments and planning decisions.",
      },
      { property: "og:title", content: "UK Data Centre Growth Index" },
      {
        property: "og:description",
        content:
          "Regional UK data-centre development: counts, capacity, hyperscale projects and planning decisions, with data-completeness labelling.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: CANONICAL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "Data Centre Growth Index (UK)",
          description:
            "Operational, under-construction, approved and proposed UK data centres by region, with capacity in megawatts and planning decisions.",
          url: CANONICAL,
          isAccessibleForFree: true,
          isPartOf: { "@type": "Dataset", name: "UK AI Energy Index", url: `${SITE_ORIGIN}/uk-ai-energy-index` },
          creator: { "@type": "Organization", name: "AI Energy Intelligence UK", url: SITE_ORIGIN },
          spatialCoverage: { "@type": "Place", name: "United Kingdom" },
        }),
      },
      { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd(CRUMBS, "/uk-ai-energy-index/data-centre-growth")) },
    ],
  }),
  component: DataCentreGrowthPage,
});

function DataCentreGrowthPage() {
  const { data } = useSuspenseQuery(indexSectionsQueryOptions);
  const [region, setRegion] = useState<string>("all");
  const subindex = data.subindices.find((s) => s.slug === "data-centre-growth");
  const indicators = data.indicators.filter((i) => subindex && i.subindex_id === subindex.id);
  const rows = indicators.map((indicator) => ({
    indicator,
    latest: data.datapoints.find((d) => d.indicator_id === indicator.id),
  }));

  // The published baseline reading both this page and the index overview use.
  const baselineIndicator = data.indicators.find(
    (i) => i.slug === "gb-colocation-data-centre-capacity",
  );
  const baseline = baselineIndicator
    ? data.datapoints.find((d) => d.indicator_id === baselineIndicator.id)
    : undefined;

  const regions = region === "all" ? INDEX_REGIONS : INDEX_REGIONS.filter((r) => r.slug === region);
  const selected = region === "all" ? undefined : data.regionStats.find((s) => s.region_slug === region);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={CRUMBS} />

      <div className="mt-6">
        <SectionNav current="/uk-ai-energy-index/data-centre-growth" />
      </div>

      <header className="mt-8 max-w-3xl">
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Data Centre Growth Index
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          This sub-index tracks the expansion of the physical infrastructure supporting AI, cloud
          computing and other digital services in the UK &mdash; what is operational, what is being
          built, and what has been approved, proposed or refused.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-border bg-surface px-3 py-1 text-sm font-medium">
            {subindex?.status_label ?? "Baseline in development"}
          </span>
          {subindex?.direction && subindex.direction !== "unknown" ? (
            <DirectionChip direction={subindex.direction} />
          ) : null}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Each development is held as a single unique record with its planning authority and
          reference, so a project reported by several sources is never counted twice. Not all data
          centre growth is driven by AI; this sub-index measures infrastructure, not cause.
        </p>
      </header>

      {baseline ? (
        <section
          className="mt-8 rounded-xl border border-border bg-surface p-6"
          aria-labelledby="baseline-heading"
        >
          <h2 id="baseline-heading" className="font-display text-xl font-semibold">
            Baseline reading
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            {subindex?.intro ??
              "The initial baseline covers Great Britain\u2019s colocation data-centre IT capacity. Project coverage is expanding. Growth will be calculated when comparable readings are available."}
          </p>
          <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">
                Colocation data-centre IT capacity, Great Britain
              </dt>
              <dd className="mt-1 text-2xl font-semibold">
                {baseline.value !== null && baseline.value !== undefined
                  ? `${baseline.value} ${baseline.unit ?? "GW"}`
                  : "Insufficient evidence"}
              </dd>
              <dd className="mt-2">
                <IndexReviewStatus nextReviewAt={baselineIndicator?.next_review_at} />
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Baseline period</dt>
              <dd className="mt-1 font-medium">{baseline.period_label ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Growth</dt>
              <dd className="mt-1 font-medium">Not yet calculated</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Last reviewed</dt>
              <dd className="mt-1 font-medium">{fmtDate(baseline.reviewed_at) ?? "—"}</dd>
            </div>
          </dl>
          <p className="mt-4 max-w-3xl text-sm text-muted-foreground">
            Government estimate: DSIT&rsquo;s modelled estimate of the maximum rated IT load of
            colocation data centres. It covers Great Britain and excludes Northern Ireland and
            enterprise data centres, and describes colocation infrastructure generally rather than
            AI workloads specifically. The figure is an estimate, not a direct measurement, and is
            not comparable with connected-capacity figures or with 2030 capacity forecasts, which
            use different definitions.
          </p>
          {baseline.source_url ? (
            <p className="mt-3 text-sm">
              <a
                href={baseline.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:underline"
              >
                {baseline.source_name ?? "Source"}
                {baseline.publication_date
                  ? ` \u2014 published ${fmtDate(baseline.publication_date)}`
                  : ""}
              </a>
            </p>
          ) : null}
          <p className="mt-3 text-xs text-muted-foreground">
            The project register below is a growing record of individual developments, not a
            complete national census. A published capacity baseline does not imply full project
            coverage.
          </p>
        </section>
      ) : null}


      <section className="mt-10" aria-labelledby="growth-indicators-heading">
        <h2 id="growth-indicators-heading" className="font-display text-2xl font-semibold">
          Growth indicators
        </h2>
        <div className="mt-5">
          <IndicatorTable rows={rows} />
        </div>
      </section>

      <section className="mt-12" aria-labelledby="register-heading">
        <h2 id="register-heading" className="font-display text-2xl font-semibold">
          Project register
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Every development below is a published record with its own sources and last-verified
          date. Records still under review are not included in these totals.
        </p>
        <div className="mt-5">
          <ProjectRegister projects={data.projects} />
        </div>
      </section>

      <section className="mt-12" aria-labelledby="regional-heading">
        <h2 id="regional-heading" className="font-display text-2xl font-semibold">
          Regional breakdown
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label htmlFor="region-select" className="text-sm font-medium">
            Select a region
          </label>
          <select
            id="region-select"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="all">All regions</option>
            {INDEX_REGIONS.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {region !== "all" ? (
          <div className="mt-5 rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold">{regionName(region)}</h3>
            {selected ? (
              <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">Data completeness</dt>
                  <dd>{COMPLETENESS_LABELS[selected.data_completeness]}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Last updated</dt>
                  <dd>{fmtDate(selected.last_reviewed_at) ?? "—"}</dd>
                </div>
                {selected.notes ? (
                  <div className="sm:col-span-2">
                    <dt className="text-muted-foreground">Notes</dt>
                    <dd>{selected.notes}</dd>
                  </div>
                ) : null}
              </dl>
            ) : (
              <p className="mt-2 text-sm italic text-muted-foreground">
                No published figures for this region. {NOT_AVAILABLE}.
              </p>
            )}
          </div>
        ) : null}

        <div className="mt-5">
          <RegionalGrowthTable stats={data.regionStats} regions={regions} />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Regional definitions are set out on the{" "}
          <Link to="/uk-ai-energy-index/methodology" className="text-brand hover:underline">
            methodology page
          </Link>
          . A dash means no verified figure has been recorded yet.
        </p>
      </section>

      <section className="mt-12 rounded-xl border border-border bg-surface p-6">
        <h2 className="font-display text-xl font-semibold">Related</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link to="/uk-ai-energy-index/electricity-demand" className="text-brand hover:underline">
              AI Electricity Demand Index
            </Link>{" "}
            &mdash; the electricity this infrastructure consumes.
          </li>
          <li>
            <Link to="/uk-ai-energy-index/grid-pressure" className="text-brand hover:underline">
              Grid Pressure Index
            </Link>{" "}
            &mdash; whether the network can connect it.
          </li>
          <li>
            <Link
              to="/uk-data-centre-tracker"
              search={{ q: "", region: "all", status: "all", ai: "all", sort: "name" }}
              className="text-brand hover:underline"
            >
              UK data-centre tracker
            </Link>{" "}
            &mdash; individual project records.
          </li>
        </ul>
      </section>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <IndexCitation title="Data Centre Growth Index" url={CANONICAL} />
        <IndexUpdatesCTA context="data-centre-growth" compact />
      </div>
    </div>
  );
}
