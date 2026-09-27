import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { indexSectionsQueryOptions } from "@/lib/index-sections.queries";
import {
  AI_SPECIFIC_STATEMENT,
  SUBINDEX_META,
  CONFIDENCE_LABELS,
  DATA_CLASSIFICATION_LABELS,
  DATA_CLASSIFICATION_STYLES,
  fmtDate,
} from "@/lib/index-sections";
import { IndicatorTable, SectionNav } from "@/components/index/IndexSectionUI";
import { AnnualSeriesChart } from "@/components/index/IndexCharts";
import type { SectionIndicator } from "@/lib/index-sections.functions";

import { Breadcrumbs, breadcrumbJsonLd, SITE_ORIGIN, type Crumb } from "@/components/Breadcrumbs";
import { IndexCitation } from "@/components/index/IndexCitation";
import { IndexUpdatesCTA } from "@/components/index/IndexUpdatesCTA";
import { IndexReviewStatus } from "@/components/ReviewStatus";

const CANONICAL = "https://aienergyintelligence.co.uk/uk-ai-energy-index/electricity-demand";

const CRUMBS: Crumb[] = [
  { label: "Home", to: "/" },
  { label: "UK AI Energy Index", to: "/uk-ai-energy-index" },
  { label: "AI Electricity Demand" },
];

const NOT_AI_SPECIFIC =
  "This covers data centres generally and is not an estimate of electricity used specifically by artificial intelligence.";

const INSUFFICIENT_EVIDENCE_NOTE =
  "No authoritative UK or Great Britain source reviewed to date separates electricity consumed by AI workloads from electricity consumed by other data-centre workloads.";

const SERIES_SLUG = "gb-dc-electricity-consumption-desnz";
const SHARE_SLUG = "gb-dc-share-of-grid-electricity-desnz";
const GROWTH_SLUG = "gb-dc-consumption-growth-2020-2024";
const CHANGE_SLUG = "gb-dc-consumption-change-2020-2024-twh";

const CONCENTRATION_SLUGS = [
  "london-dc-electricity-consumption",
  "south-east-dc-electricity-consumption",
  "london-south-east-share-of-gb-dc-consumption",
  "slough-dc-electricity-consumption",
  "slough-share-of-gb-dc-consumption",
  "dc-share-of-slough-grid-electricity",
];

const MODELLED_SLUGS = ["gb-data-centre-demand-fes2025", "gb-connected-data-centre-capacity"];

const AI_GAP_SLUGS = [
  "ai-attributable-electricity-demand",
  "ai-electricity-demand-growth-quarterly",
  "ai-peak-power-requirement",
];

export const Route = createFileRoute("/uk-ai-energy-index/electricity-demand")({
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
      { title: SUBINDEX_META["electricity-demand"].title },
      {
        name: "description",
        content:
          "Evidence on UK data-centre electricity consumption, AI-related power demand, national demand share and published forecasts, with sources and limitations.",
      },
      { property: "og:title", content: "UK AI Electricity Demand Index | Data Centre Power Use" },
      {
        property: "og:description",
        content:
          "Evidence on UK data-centre electricity consumption, AI-related power demand, national demand share and published forecasts, with sources and limitations.",
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
          name: "AI Electricity Demand Index (UK)",
          description:
            "Data-centre electricity consumption in Great Britain from DESNZ official statistics, with regional concentration, modelled estimates and forecasts recorded separately.",
          url: CANONICAL,
          isAccessibleForFree: true,
          isPartOf: { "@type": "Dataset", name: "UK AI Energy Index", url: `${SITE_ORIGIN}/uk-ai-energy-index` },
          creator: { "@type": "Organization", name: "AI Energy Intelligence UK", url: SITE_ORIGIN },
          spatialCoverage: { "@type": "Place", name: "Great Britain" },
        }),
      },
      { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd(CRUMBS, "/uk-ai-energy-index/electricity-demand")) },
    ],
  }),
  component: ElectricityDemandPage,
});

function ClassificationTag({ value }: { value: string }) {
  const style = DATA_CLASSIFICATION_STYLES[value] ?? DATA_CLASSIFICATION_STYLES["not_available"];
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${style}`}>
      {DATA_CLASSIFICATION_LABELS[value] ?? value}
    </span>
  );
}

function num(value: number | null | undefined) {
  if (value === null || value === undefined) return null;
  return value.toLocaleString("en-GB", { maximumFractionDigits: 2 });
}

function ElectricityDemandPage() {
  const { data } = useSuspenseQuery(indexSectionsQueryOptions);
  const subindex = data.subindices.find((s) => s.slug === "electricity-demand");

  const bySlug = (slug: string) => data.indicators.find((i) => i.slug === slug);
  const pointsFor = (indicator: SectionIndicator | undefined) =>
    indicator ? data.datapoints.filter((d) => d.indicator_id === indicator.id) : [];
  const pointAt = (slug: string, period: string) =>
    pointsFor(bySlug(slug)).find((d) => d.period_label === period);

  const seriesIndicator = bySlug(SERIES_SLUG);
  const consumption = pointsFor(seriesIndicator)
    .slice()
    .sort((a, b) => a.period_label.localeCompare(b.period_label));
  const shareSeries = pointsFor(bySlug(SHARE_SLUG));

  const latest = consumption[consumption.length - 1];
  const growth = pointAt(GROWTH_SLUG, "2020 to 2024");
  const absChange = pointAt(CHANGE_SLUG, "2020 to 2024");
  const latestShare = shareSeries.find((d) => d.period_label === latest?.period_label);

  const concentration = CONCENTRATION_SLUGS.flatMap((slug) => {
    const indicator = bySlug(slug);
    return indicator ? [{ indicator, latest: pointAt(slug, "2024") }] : [];
  });

  const modelled = MODELLED_SLUGS.flatMap((slug) => {
    const indicator = bySlug(slug);
    return indicator ? [{ indicator, latest: pointsFor(indicator)[0] }] : [];
  });

  const forecasts = data.indicators
    .filter((i) => subindex && i.subindex_id === subindex.id && i.is_forecast)
    .map((indicator) => ({ indicator, latest: pointsFor(indicator)[0] }));

  const aiGaps = AI_GAP_SLUGS.map((slug) => bySlug(slug)).filter(
    (i): i is SectionIndicator => i !== undefined,
  );

  // Anything else already stored against this sub-index is kept visible rather
  // than dropped, so no previously published indicator disappears.
  const shownSlugs = new Set([
    SERIES_SLUG,
    SHARE_SLUG,
    GROWTH_SLUG,
    CHANGE_SLUG,
    ...CONCENTRATION_SLUGS,
    ...MODELLED_SLUGS,
    ...AI_GAP_SLUGS,
  ]);
  const others = data.indicators
    .filter(
      (i) =>
        subindex &&
        i.subindex_id === subindex.id &&
        !i.is_forecast &&
        !shownSlugs.has(i.slug),
    )
    .map((indicator) => ({ indicator, latest: pointsFor(indicator)[0] }));

  // Readings replaced by a newer figure. Never deleted, always shown with the reason.
  const superseded = data.supersededDatapoints
    .map((d) => ({ point: d, indicator: data.indicators.find((i) => i.id === d.indicator_id) }))
    .filter((r) => r.indicator && r.indicator.subindex_id === subindex?.id);

  const chartSeries = consumption
    .filter((d) => d.value !== null)
    .map((d) => ({ label: d.period_label, value: d.value as number }));

  const gapRows = data.indicators
    .filter((i) => subindex && i.subindex_id === subindex.id)
    .map((indicator) => {
      const point = pointsFor(indicator)[0];
      const limitations = point?.limitations ?? indicator.caveats ?? null;
      const assumptions = point?.assumptions ?? null;
      if (!limitations && !assumptions) return null;
      return {
        id: indicator.id,
        name: indicator.name,
        limitations,
        assumptions,
        confidence: CONFIDENCE_LABELS[point?.confidence_level_rating ?? "not_assessed"] ?? "Not assessed",
        reviewed: fmtDate(point?.reviewed_at ?? indicator.last_updated_at),
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  // Structured data is generated from the same records the page displays.
  const dataset =
    latest && seriesIndicator
      ? {
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "Data-centre electricity consumption in Great Britain, 2020 to 2024",
          description: `Annual electricity consumed from the public grid by data centres in Great Britain. ${NOT_AI_SPECIFIC}`,
          url: CANONICAL,
          variableMeasured: "Data-centre electricity consumption",
          unitText: "TWh per year",
          temporalCoverage: `${consumption[0]?.period_label}/${latest.period_label}`,
          spatialCoverage: { "@type": "Place", name: "Great Britain" },
          creator: { "@type": "Organisation", name: seriesIndicator.source_name },
          publisher: { "@type": "Organization", name: "AI Energy Intelligence" },
          isBasedOn: seriesIndicator.source_url,
          datePublished: latest.publication_date,
          dateModified: latest.reviewed_at,
          measurementTechnique: seriesIndicator.methodology,
          disambiguatingDescription: latest.limitations,
        }
      : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {dataset ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(dataset) }}
        />
      ) : null}

      <Breadcrumbs items={CRUMBS} />

      <div className="mt-6">
        <SectionNav current="/uk-ai-energy-index/electricity-demand" />
      </div>

      <header className="mt-8 max-w-3xl">
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          AI Electricity Demand Index
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          This sub-index tracks the electricity required to support AI and data-centre activity in
          Great Britain: how much is consumed, what share of grid electricity that represents, how
          quickly it is changing, and what modelled estimates and forecasts say about the years
          ahead.
        </p>
      </header>

      {/* 1. Headline baseline ------------------------------------------------ */}
      <section className="mt-8" aria-labelledby="baseline-heading">
        <h2 id="baseline-heading" className="sr-only">
          Headline baseline
        </h2>
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {subindex?.status_label ?? "Baseline in development"}
          </p>
          {latest?.value !== null && latest?.value !== undefined ? (
            <>
              <p className="mt-2 text-5xl font-bold tracking-tight sm:text-6xl">
                {num(latest.value)} <span className="text-3xl font-semibold sm:text-4xl">TWh</span>
              </p>
              <p className="mt-2 max-w-2xl text-base text-muted-foreground">
                Estimated electricity consumed by data centres in Great Britain in{" "}
                {latest.period_label}.
              </p>
              <div className="mt-3">
                <IndexReviewStatus nextReviewAt={seriesIndicator?.next_review_at} />
              </div>
            </>
          ) : (
            <p className="mt-2 text-lg italic text-muted-foreground">Data not yet available.</p>
          )}

          <div className="mt-4 flex gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
            <p className="text-foreground">{NOT_AI_SPECIFIC}</p>
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-surface p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Change, 2020 to 2024
              </dt>
              <dd className="mt-1 text-2xl font-semibold">
                {growth?.value !== null && growth?.value !== undefined
                  ? `${num(growth.value)}% increase`
                  : "Data not yet available"}
              </dd>
              <dd className="mt-1 text-xs text-muted-foreground">
                {absChange?.value !== null && absChange?.value !== undefined
                  ? `An increase of ${num(absChange.value)} TWh. `
                  : ""}
                A DESNZ historical estimate, not a real-time reading.
              </dd>
              <dd className="mt-2">
                <IndexReviewStatus nextReviewAt={bySlug(GROWTH_SLUG)?.next_review_at} />
              </dd>
            </div>
            <div className="rounded-lg border border-border bg-surface p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Share of GB grid electricity, {latestShare?.period_label ?? "—"}
              </dt>
              <dd className="mt-1 text-2xl font-semibold">
                {latestShare?.value !== null && latestShare?.value !== undefined
                  ? `${num(latestShare.value)}%`
                  : "Data not yet available"}
              </dd>
              <dd className="mt-1 text-xs text-muted-foreground">
                DESNZ reports this as approximately 2 per cent of the 249.2 TWh consumed from the
                grid in Great Britain.
              </dd>
              <dd className="mt-2">
                <IndexReviewStatus nextReviewAt={bySlug(SHARE_SLUG)?.next_review_at} />
              </dd>
            </div>
            <div className="rounded-lg border border-border bg-surface p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Source and review
              </dt>
              <dd className="mt-1 text-sm">
                {seriesIndicator?.source_url ? (
                  <a
                    href={seriesIndicator.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-1 text-brand hover:underline"
                  >
                    {seriesIndicator.source_name}
                    <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                  </a>
                ) : (
                  (seriesIndicator?.source_name ?? "—")
                )}
              </dd>
              <dd className="mt-1 text-xs text-muted-foreground">
                Published {fmtDate(latest?.publication_date) ?? "—"} &middot; Last reviewed{" "}
                {fmtDate(latest?.reviewed_at ?? subindex?.last_reviewed_at) ?? "—"}
              </dd>
              <dd className="mt-2">
                <ClassificationTag value={latest?.data_classification ?? "not_available"} />
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* 2. Historical observations ------------------------------------------ */}
      <section className="mt-12" aria-labelledby="history-heading">
        <h2 id="history-heading" className="font-display text-2xl font-semibold">
          Historical observations
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Annual figures published by DESNZ for periods that have already happened. Every reading
          below comes from the official workbook accompanying the Energy Trends June 2026 special
          feature article. Nothing here is modelled by us and no demonstration values are plotted.
        </p>

        {chartSeries.length >= 2 ? (
          <div className="mt-5 rounded-xl border border-border bg-card p-5">
            <AnnualSeriesChart
              data={chartSeries}
              unitLabel="TWh"
              description={`Great Britain data-centre electricity consumption, ${chartSeries[0].label} to ${chartSeries[chartSeries.length - 1].label}, in TWh per year. Vertical axis starts at zero. Source: ${seriesIndicator?.source_name}, published ${fmtDate(latest?.publication_date) ?? ""}. Full figures are given in the table below.`}
            />
          </div>
        ) : (
          <p className="mt-4 rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
            A chart will appear here once at least two verified annual readings exist.
          </p>
        )}

        <div className="mt-5 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[720px] text-left text-sm">
            <caption className="px-4 py-3 text-left text-sm text-muted-foreground">
              Great Britain data-centre electricity consumption by reporting year, in TWh per year.
              Source: {seriesIndicator?.source_name}.
            </caption>
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-3">Reporting year</th>
                <th scope="col" className="px-4 py-3">Consumption (TWh)</th>
                <th scope="col" className="px-4 py-3">Change on previous year (TWh)</th>
                <th scope="col" className="px-4 py-3">Change on previous year (%)</th>
                <th scope="col" className="px-4 py-3">Change from 2020 (%)</th>
                <th scope="col" className="px-4 py-3">Share of GB grid (%)</th>
                <th scope="col" className="px-4 py-3">Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {consumption.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-muted-foreground">
                    Data not yet available.
                  </td>
                </tr>
              ) : (
                consumption.map((row) => {
                  const share = shareSeries.find((s) => s.period_label === row.period_label);
                  return (
                    <tr key={row.id}>
                      <th scope="row" className="px-4 py-3 font-medium">{row.period_label}</th>
                      <td className="px-4 py-3">{num(row.value) ?? "—"}</td>
                      <td className="px-4 py-3">
                        {row.change_absolute !== null && row.change_absolute !== undefined
                          ? `+${num(row.change_absolute)}`
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {row.percent_change !== null && row.percent_change !== undefined
                          ? `+${num(row.percent_change)}%`
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {row.change_from_baseline_percent !== null &&
                        row.change_from_baseline_percent !== undefined
                          ? `+${num(row.change_from_baseline_percent)}%`
                          : "Baseline year"}
                      </td>
                      <td className="px-4 py-3">{share ? `${num(share.value)}%` : "—"}</td>
                      <td className="px-4 py-3">
                        <ClassificationTag value={row.data_classification} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Values are shown to the precision DESNZ uses. Annual and cumulative changes are calculated
          from the unrounded workbook values, so they will not always match a subtraction of the
          rounded figures above.
        </p>
      </section>

      {/* 3. Geographic concentration ----------------------------------------- */}
      <section className="mt-12" aria-labelledby="geography-heading">
        <h2 id="geography-heading" className="font-display text-2xl font-semibold">
          Geographic concentration, 2024
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Where data-centre electricity is consumed in Great Britain. These figures describe total
          data-centre consumption. They do not indicate where AI workloads run.
        </p>
        <div className="mt-5">
          <IndicatorTable rows={concentration} />
        </div>
      </section>

      {/* 4. Latest modelled estimate ----------------------------------------- */}
      <section className="mt-12" aria-labelledby="modelled-heading">
        <h2 id="modelled-heading" className="font-display text-2xl font-semibold">
          Latest modelled estimate
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          NESO&rsquo;s modelled estimate as at November 2025 is shown separately from the DESNZ
          historical series. It is a modelled estimate, it covers data centres generally, it is not
          AI-specific, and its methodology differs from the DESNZ series. It is not the next
          comparable annual observation after {latest?.period_label ?? "the latest DESNZ year"}, so
          no growth rate is calculated between the two.
        </p>
        <div className="mt-5">
          <IndicatorTable rows={modelled} />
        </div>
      </section>

      {/* 5. Forecasts --------------------------------------------------------- */}
      <section className="mt-12" aria-labelledby="forecast-heading">
        <h2 id="forecast-heading" className="font-display text-2xl font-semibold">
          Forecasts
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Projections published by third parties. These are not observations and are kept separate
          from the figures above.
        </p>
        <div className="mt-5">
          <IndicatorTable rows={forecasts} />
        </div>
      </section>

      {/* 5b. Other tracked indicators ----------------------------------------- */}
      {others.length > 0 ? (
        <section className="mt-12" aria-labelledby="other-heading">
          <h2 id="other-heading" className="font-display text-2xl font-semibold">
            Other tracked indicators
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Context indicators and placeholders retained from earlier editions of this sub-index.
          </p>
          <div className="mt-5">
            <IndicatorTable rows={others} />
          </div>
        </section>
      ) : null}

      {/* 6. AI-specific evidence gap ------------------------------------------ */}
      <section className="mt-12" aria-labelledby="ai-gap-heading">
        <h2 id="ai-gap-heading" className="font-display text-2xl font-semibold">
          AI-specific evidence gap
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          <strong className="text-foreground">{AI_SPECIFIC_STATEMENT}</strong>{" "}
          {INSUFFICIENT_EVIDENCE_NOTE} We do not estimate an AI share by applying a global
          percentage to Great Britain consumption, and we do not treat processor shipments, compute
          capacity, investment announcements or projected AI-capable capacity as a substitute for
          measured electricity consumption.
        </p>
        <ul className="mt-5 grid gap-4 sm:grid-cols-3">
          {aiGaps.map((indicator) => (
            <li key={indicator.id} className="rounded-xl border border-border bg-card p-5">
              <p className="font-medium">{indicator.name}</p>
              <p className="mt-2">
                <ClassificationTag value={indicator.data_classification} />
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{indicator.caveats}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 7. Superseded history ------------------------------------------------ */}
      <section className="mt-12" aria-labelledby="superseded-heading">
        <h2 id="superseded-heading" className="font-display text-2xl font-semibold">
          Superseded readings
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Earlier figures are retained rather than deleted, with their original classification and
          the reason they were replaced.
        </p>
        <ul className="mt-4 space-y-3 text-sm">
          {superseded.length === 0 ? (
            <li className="rounded-lg border border-dashed border-border p-6 text-muted-foreground">
              Nothing has been superseded in this sub-index yet.
            </li>
          ) : (
            superseded.map(({ point, indicator }) => (
              <li key={point.id} className="rounded-lg border border-border p-4">
                <p className="font-medium">
                  {indicator?.name}
                  {point.value !== null ? (
                    <span className="ml-2 font-normal text-muted-foreground">
                      {num(point.value)} {point.unit}
                    </span>
                  ) : null}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{point.period_label}</p>
                <p className="mt-2 text-muted-foreground">{point.superseded_reason}</p>
                <p className="mt-2">
                  <ClassificationTag value={point.data_classification} />
                </p>
              </li>
            ))
          )}
        </ul>
      </section>

      {/* 8. Data gaps and limitations ----------------------------------------- */}
      <section className="mt-12" aria-labelledby="gaps-heading">
        <h2 id="gaps-heading" className="font-display text-2xl font-semibold">
          Data gaps and limitations
        </h2>
        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
          {gapRows.length === 0 ? (
            <li className="rounded-lg border border-dashed border-border p-6">
              No limitations have been recorded against the published figures in this sub-index yet.
            </li>
          ) : (
            gapRows.map((row) => (
              <li key={row.id} className="rounded-lg border border-border p-4">
                <p className="font-medium text-foreground">{row.name}</p>
                {row.limitations ? <p className="mt-1">{row.limitations}</p> : null}
                {row.assumptions ? (
                  <p className="mt-1">
                    <span className="font-medium text-foreground">Assumptions:</span> {row.assumptions}
                  </p>
                ) : null}
                <p className="mt-1 text-xs">
                  Confidence: {row.confidence} &middot; Last reviewed: {row.reviewed ?? "—"}
                </p>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="mt-12 rounded-xl border border-border bg-surface p-6">
        <h2 className="font-display text-xl font-semibold">Continue through the index</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link to="/uk-ai-energy-index/data-centre-growth" className="text-brand hover:underline">
              Data Centre Growth Index
            </Link>{" "}
            &mdash; the physical infrastructure behind this demand.
          </li>
          <li>
            <Link to="/uk-ai-energy-index/grid-pressure" className="text-brand hover:underline">
              Grid Pressure Index
            </Link>{" "}
            &mdash; whether the networks can accommodate it.
          </li>
          <li>
            <Link to="/uk-ai-energy-index/methodology" className="text-brand hover:underline">
              Methodology and sources
            </Link>{" "}
            &mdash; how each figure is classified and reviewed.
          </li>
        </ul>
      </section>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <IndexCitation title="AI Electricity Demand Index" url={CANONICAL} />
        <IndexUpdatesCTA context="electricity-demand" compact />
      </div>
    </div>
  );
}
