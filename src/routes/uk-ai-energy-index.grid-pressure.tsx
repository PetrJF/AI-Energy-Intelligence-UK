import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { indexSectionsQueryOptions } from "@/lib/index-sections.queries";
import {
  INDEX_REGIONS,
  PRESSURE_LABELS,
  PRESSURE_SYMBOLS,
  SUBINDEX_META,
  NOT_AVAILABLE,
  fmtDate,
  regionName,
} from "@/lib/index-sections";
import {
  IndicatorTable,
  PressureBadge,
  RegionalPressureTable,
  SectionNav,
  DirectionChip,
} from "@/components/index/IndexSectionUI";
import { GridEvidencePanel } from "@/components/index/GridEvidencePanel";

import { Breadcrumbs, breadcrumbJsonLd, SITE_ORIGIN, type Crumb } from "@/components/Breadcrumbs";
import { IndexCitation } from "@/components/index/IndexCitation";
import { IndexUpdatesCTA } from "@/components/index/IndexUpdatesCTA";

const CANONICAL = "https://aienergyintelligence.co.uk/uk-ai-energy-index/grid-pressure";

const CRUMBS: Crumb[] = [
  { label: "Home", to: "/" },
  { label: "UK AI Energy Index", to: "/uk-ai-energy-index" },
  { label: "Grid Pressure" },
];

export const Route = createFileRoute("/uk-ai-energy-index/grid-pressure")({
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
      { title: SUBINDEX_META["grid-pressure"].title },
      {
        name: "description",
        content:
          "Regional UK grid pressure ratings for data-centre and AI demand: connection requests, waiting times, network constraints, planned investment and evidence confidence.",
      },
      { property: "og:title", content: "UK Grid Pressure Index" },
      {
        property: "og:description",
        content:
          "Whether Britain's electricity networks can accommodate data-centre and AI demand, rated region by region with recorded evidence.",
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
          name: "Grid Pressure Index (UK)",
          description:
            "Regional UK grid pressure ratings for data-centre and AI demand: connection requests, waiting times, network constraints and recorded evidence.",
          url: CANONICAL,
          isAccessibleForFree: true,
          isPartOf: { "@type": "Dataset", name: "UK AI Energy Index", url: `${SITE_ORIGIN}/uk-ai-energy-index` },
          creator: { "@type": "Organization", name: "AI Energy Intelligence UK", url: SITE_ORIGIN },
          spatialCoverage: { "@type": "Place", name: "United Kingdom" },
        }),
      },
      { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd(CRUMBS, "/uk-ai-energy-index/grid-pressure")) },
    ],
  }),
  component: GridPressurePage,
});

const RATING_ORDER = ["low", "moderate", "high", "severe", "insufficient_evidence"] as const;

function GridPressurePage() {
  const { data } = useSuspenseQuery(indexSectionsQueryOptions);
  const [region, setRegion] = useState<string>("all");
  const subindex = data.subindices.find((s) => s.slug === "grid-pressure");
  const indicators = data.indicators.filter((i) => subindex && i.subindex_id === subindex.id);
  const rows = indicators.map((indicator) => ({
    indicator,
    latest: data.datapoints.find((d) => d.indicator_id === indicator.id),
  }));

  const regions = region === "all" ? INDEX_REGIONS : INDEX_REGIONS.filter((r) => r.slug === region);
  const selected = region === "all" ? undefined : data.gridRatings.find((r) => r.region_slug === region);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={CRUMBS} />

      <div className="mt-6">
        <SectionNav current="/uk-ai-energy-index/grid-pressure" />
      </div>

      <header className="mt-8 max-w-3xl">
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Grid Pressure Index
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          This sub-index indicates whether Britain&rsquo;s electricity networks appear capable of
          accommodating data-centre and AI-related demand &mdash; connection queues, waiting times,
          known constraints and the investment planned to relieve them.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-border bg-surface px-3 py-1 text-sm font-medium">
            {subindex?.status_label ?? "Baseline in development"}
          </span>
          {subindex?.direction && subindex.direction !== "unknown" ? (
            <DirectionChip direction={subindex.direction} />
          ) : null}
          {subindex?.period_label ? (
            <span className="text-sm text-muted-foreground">
              Reporting periods: {subindex.period_label}
            </span>
          ) : null}
          {subindex?.last_reviewed_at ? (
            <span className="text-sm text-muted-foreground">
              Last reviewed: {fmtDate(subindex.last_reviewed_at)}
            </span>
          ) : null}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Ratings are not assigned arbitrarily. Every rating carries a written explanation, a
          confidence level and a link to the evidence behind it. Where the evidence is not there, the
          region is rated &ldquo;Insufficient evidence&rdquo; rather than guessed.
        </p>
      </header>

      <section
        className="mt-10 rounded-xl border-2 border-brand/30 bg-brand/5 p-6"
        aria-labelledby="national-context-heading"
      >
        <h2 id="national-context-heading" className="font-display text-xl font-semibold">
          What the national queue figures do and do not show
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The figures below describe <strong className="text-foreground">contracted demand
          connection capacity</strong> &mdash; the capacity that projects hold connection offers for
          in the Great Britain queue.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>It is not electricity currently being consumed.</li>
          <li>It is not operational data-centre capacity.</li>
          <li>It is not exclusively data-centre demand.</li>
          <li>
            It is not evidence that every queued project will proceed. Ofgem states it is concerned
            that a significant number of queued projects may not ultimately connect.
          </li>
        </ul>
        <p className="mt-3 text-sm text-muted-foreground">
          A national queue total also cannot establish how much pressure any individual region is
          under, so it is never used to assign a regional rating.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Ofgem&rsquo;s consultation on data-centre connection reforms &mdash; a commitment fee and
          data-centre queue milestones &mdash; contains{" "}
          <strong className="text-foreground">proposals</strong>, open for response until 16
          September 2026. They are not rules in force and are recorded here separately from observed
          infrastructure data.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="grid-indicators-heading">
        <h2 id="grid-indicators-heading" className="font-display text-2xl font-semibold">
          National grid indicators
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Each reading shows the period the data describes, not the date the document restating it
          was published. Where a change is shown it is growth in contracted connection offers, not
          growth in physical grid pressure or in AI electricity use.
        </p>
        <div className="mt-5">
          <IndicatorTable rows={rows} />
        </div>
      </section>

      <section className="mt-10" aria-labelledby="scale-heading">
        <h2 id="scale-heading" className="font-display text-2xl font-semibold">
          The rating scale
        </h2>
        <ul className="mt-4 flex flex-wrap gap-3">
          {RATING_ORDER.map((r) => (
            <li key={r} className="flex items-center gap-2">
              <PressureBadge rating={r} />
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          Each rating is shown with a written label and a symbol ({RATING_ORDER.map((r) => `${PRESSURE_SYMBOLS[r]} ${PRESSURE_LABELS[r]}`).join(", ")}),
          so it does not depend on colour alone.
        </p>
      </section>

      <section className="mt-12" aria-labelledby="regional-pressure-heading">
        <h2 id="regional-pressure-heading" className="font-display text-2xl font-semibold">
          Regional grid pressure
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Regional evidence collection has started with London and Slough and the Thames Valley.
          Every region remains rated &ldquo;Insufficient evidence&rdquo;: the{" "}
          <Link to="/uk-ai-energy-index/methodology" className="text-brand hover:underline">
            methodology
          </Link>{" "}
          does not yet define what separates low, moderate, high and severe pressure, and the
          evidence gathered so far comes from single publishers and describes named substations and
          grid supply points rather than whole regions. Select a region to read the evidence
          collected for it, including what each document does not show.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label htmlFor="pressure-region" className="text-sm font-medium">
            Select a region
          </label>
          <select
            id="pressure-region"
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
          <div className="mt-5">
            <GridEvidencePanel
              regionSlug={region}
              assessment={selected}
              evidence={data.gridEvidence}
              links={data.assessmentEvidence}
              sources={data.sources}
            />
          </div>
        ) : null}

        <div className="mt-5">
          <RegionalPressureTable ratings={data.gridRatings} regions={regions} />
        </div>
      </section>

      <section className="mt-12 rounded-xl border border-border bg-surface p-6" aria-labelledby="ni-heading">
        <h2 id="ni-heading" className="font-display text-xl font-semibold">
          Northern Ireland is assessed separately
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Northern Ireland operates a distinct electricity system with its own network operators and
          regulator &mdash; SONI, NIE Networks and the Utility Regulator &mdash; rather than the
          Great Britain arrangements covering England, Scotland and Wales. Its rating is therefore
          assessed against Northern Irish sources only and is never inferred from GB evidence.
        </p>
      </section>

      <section className="mt-12 rounded-xl border border-border bg-surface p-6">
        <h2 className="font-display text-xl font-semibold">Related</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link to="/uk-ai-energy-index/data-centre-growth" className="text-brand hover:underline">
              Data Centre Growth Index
            </Link>{" "}
            &mdash; the demand seeking these connections.
          </li>
          <li>
            <Link to="/uk-ai-energy-index/electricity-demand" className="text-brand hover:underline">
              AI Electricity Demand Index
            </Link>
          </li>
          <li>
            <Link to="/uk-ai-energy-index/methodology" className="text-brand hover:underline">
              How pressure ratings are assigned
            </Link>
          </li>
          <li>
            <Link to="/corrections" className="text-brand hover:underline">
              Report a possible error in this assessment
            </Link>
          </li>
        </ul>
      </section>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <IndexCitation title="Grid Pressure Index" url={CANONICAL} />
        <IndexUpdatesCTA context="grid-pressure" compact />
      </div>
    </div>
  );
}
