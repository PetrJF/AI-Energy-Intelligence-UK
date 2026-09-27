import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Gauge,
  Database,
  CalendarClock,
  ShieldCheck,
  History,
  ExternalLink,
  Layers,
  Minus,
  TrendingUp,
  TrendingDown,
  LineChart as LineChartIcon,
  FileText,
  Clock,
} from "lucide-react";
import { Sparkline, EditionTrendChart } from "@/components/index/IndexCharts";
import { IndexOverviewSections } from "@/components/index/IndexOverview";
import {
  indexSectionsQueryOptions,
  indexFrameworkQueryOptions as frameworkQueryOptions,
} from "@/lib/index-sections.queries";
import { LeadCapture } from "@/components/LeadCapture";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { IndexCitation } from "@/components/index/IndexCitation";
import {
  type IndexIndicator,
  type IndexDatapoint,
  type Confidence,
} from "@/lib/index-framework.functions";
import { IndexReviewStatus } from "@/components/ReviewStatus";

const CANONICAL = "https://aienergyintelligence.co.uk/uk-ai-energy-index";

const CRUMBS: Crumb[] = [
  { label: "Home", to: "/" },
  { label: "UK AI Energy Index" },
];


export const Route = createFileRoute("/uk-ai-energy-index/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(frameworkQueryOptions),
      context.queryClient.ensureQueryData(indexSectionsQueryOptions),
    ]);
  },

  head: () => {
    const dataset = {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "UK AI Energy Index",
      description:
        "A structured framework of indicators tracking the electricity demand, infrastructure and grid impact of artificial intelligence in the UK, with named sources, update schedules, confidence levels and a public revision history.",
      url: CANONICAL,
      isAccessibleForFree: true,
      creator: {
        "@type": "Organization",
        name: "AI Energy Intelligence UK",
        url: "https://aienergyintelligence.co.uk",
      },
      spatialCoverage: { "@type": "Place", name: "United Kingdom" },
    };
    const breadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://aienergyintelligence.co.uk/" },
        { "@type": "ListItem", position: 2, name: "UK AI Energy Index", item: CANONICAL },
      ],
    };
    return {
      meta: [
        { title: "UK AI Energy Index | Electricity, Data Centres & Grid" },
        {
          name: "description",
          content:
            "Track how AI and data-centre growth are affecting UK electricity demand, infrastructure and grid pressure using sourced indicators and transparent methodology.",
        },
        { property: "og:title", content: "UK AI Energy Index | Electricity, Data Centres & Grid" },
        {
          property: "og:description",
          content:
            "Track how AI and data-centre growth are affecting UK electricity demand, infrastructure and grid pressure using sourced indicators and transparent methodology.",
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: CANONICAL },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: CANONICAL }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(dataset) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumb) },
      ],
    };
  },
  component: IndexFrameworkPage,
});

const CATEGORY_LABELS: Record<string, string> = {
  demand: "AI electricity demand",
  infrastructure: "Data centre infrastructure",
  grid: "Grid and network",
  cost: "Cost and market",
  efficiency: "Efficiency and intensity",
  policy: "Policy and planning",
  public: "Public and business adoption",
};

const FREQUENCY_LABELS: Record<string, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  biannual: "Twice a year",
  annual: "Annual",
  ad_hoc: "When the source publishes",
};

const SOURCE_TYPE_LABELS: Record<string, string> = {
  official: "Official statistics",
  regulator: "Regulator",
  operator: "System / network operator",
  press: "Press reporting",
  industry: "Industry body",
  modelled: "Our own modelling",
  survey: "Survey",
};

const COLLECTION_LABELS: Record<string, string> = {
  manual: "Manual entry",
  semi_automated: "Assisted, checked by hand",
  automated: "Automated feed",
};

const CONFIDENCE_STYLES: Record<Confidence, string> = {
  high: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  low: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  indicative: "bg-muted text-muted-foreground border-border",
};

function ConfidenceBadge({ level }: { level: Confidence }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${CONFIDENCE_STYLES[level]}`}
    >
      {level}
    </span>
  );
}

function formatDate(value: string | null | undefined) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

function formatValue(dp: IndexDatapoint | undefined, fallbackUnit: string) {
  if (!dp) return "—";
  if (dp.value !== null) {
    const unit = dp.unit ?? fallbackUnit;
    return `${dp.value.toLocaleString("en-GB")}${unit ? ` ${unit}` : ""}`;
  }
  return dp.value_text ?? "—";
}

function ChangeChip({
  latest,
  previous,
  direction,
}: {
  latest: IndexDatapoint;
  previous: IndexDatapoint;
  direction: string;
}) {
  if (latest.value === null || previous.value === null || previous.value === 0) return null;
  const diff = latest.value - previous.value;
  if (diff === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
        <Minus className="h-3 w-3" /> No change on {previous.period_label}
      </span>
    );
  }
  const pct = (diff / Math.abs(previous.value)) * 100;
  const up = diff > 0;
  // "More pressure" depends on the indicator's stated direction.
  const morePressure =
    direction === "lower_is_more_pressure" ? !up : direction === "neutral" ? null : up;
  const tone =
    morePressure === null
      ? "border-border text-muted-foreground"
      : morePressure
        ? "border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400"
        : "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${tone}`}>
      <Icon className="h-3 w-3" />
      {up ? "+" : ""}
      {pct.toFixed(1)}% on {previous.period_label}
    </span>
  );
}

function IndicatorCard({
  indicator,
  history,
}: {
  indicator: IndexIndicator;
  history: IndexDatapoint[];
}) {
  // history is oldest → newest
  const latest = history[history.length - 1];
  const previous = history[history.length - 2];
  const series = history
    .filter((d) => d.value !== null)
    .map((d) => ({ label: d.period_label, value: d.value as number }));

  const sourceName = latest?.source_name ?? indicator.source_name;
  const sourceUrl = latest?.source_url ?? indicator.source_url;
  const lastUpdated = formatDate(latest?.collected_at ?? indicator.last_updated_at);

  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold">{indicator.name}</h3>
          {indicator.unit ? (
            <p className="mt-0.5 text-xs uppercase tracking-wide text-muted-foreground">
              Measured in {indicator.unit}
            </p>
          ) : null}
        </div>
        <ConfidenceBadge level={latest?.confidence_level ?? indicator.confidence_level} />
      </div>

      {indicator.description ? (
        <p className="mt-3 text-sm text-muted-foreground">{indicator.description}</p>
      ) : null}

      {latest ? (
        <div className="mt-4 rounded-lg border border-border bg-surface px-4 py-3">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Latest reading — {latest.period_label}
            {latest.is_estimate ? " (estimate)" : ""}
          </div>
          <div className="mt-1 font-display text-2xl font-bold">
            {formatValue(latest, indicator.unit)}
          </div>
          <div className="mt-2">
            <IndexReviewStatus nextReviewAt={indicator.next_review_at} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {previous ? (
              <ChangeChip latest={latest} previous={previous} direction={indicator.direction} />
            ) : (
              <span className="text-xs text-muted-foreground">
                First published reading — no earlier period to compare against yet.
              </span>
            )}
          </div>
          {latest.notes ? (
            <p className="mt-2 text-xs text-muted-foreground">{latest.notes}</p>
          ) : null}
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
          No published reading yet — this indicator is defined and scheduled, but the first value is
          still being compiled by hand.
        </div>
      )}

      <Sparkline data={series} />

      {history.length > 1 ? (
        <div className="mt-4 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Period</th>
                <th className="px-3 py-2 font-medium">Value</th>
                <th className="px-3 py-2 font-medium">Basis</th>
              </tr>
            </thead>
            <tbody>
              {[...history]
                .reverse()
                .slice(0, 6)
                .map((d) => (
                  <tr key={d.id} className="border-t border-border">
                    <td className="px-3 py-2">{d.period_label}</td>
                    <td className="px-3 py-2 font-medium">{formatValue(d, indicator.unit)}</td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {d.is_estimate ? "Estimate" : "Measured"} · {d.confidence_level}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Source</dt>
          <dd className="mt-0.5">
            {sourceUrl ? (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-brand hover:underline"
              >
                {sourceName ?? sourceUrl}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              (sourceName ?? "—")
            )}
            <span className="ml-1 text-xs text-muted-foreground">
              ({SOURCE_TYPE_LABELS[indicator.source_type] ?? indicator.source_type})
            </span>
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Last updated</dt>
          <dd className="mt-0.5">{lastUpdated ?? "Not yet published"}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Update schedule</dt>
          <dd className="mt-0.5">
            {FREQUENCY_LABELS[indicator.update_frequency] ?? indicator.update_frequency}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">How it is collected</dt>
          <dd className="mt-0.5">
            {COLLECTION_LABELS[indicator.collection_method] ?? indicator.collection_method}
          </dd>
        </div>
      </dl>

      {indicator.methodology ? (
        <p className="mt-4 border-t border-border pt-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Method: </span>
          {indicator.methodology}
        </p>
      ) : null}
      {indicator.caveats ? (
        <p className="mt-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Caveats: </span>
          {indicator.caveats}
        </p>
      ) : null}
    </article>
  );
}

function IndexFrameworkPage() {
  const { data } = useSuspenseQuery(frameworkQueryOptions);
  const { indicators, editions, datapoints, revisions } = data;

  // Group published readings per indicator, oldest → newest, for comparisons and charts.
  const historyByIndicator = new Map<string, IndexDatapoint[]>();
  for (const dp of datapoints) {
    const list = historyByIndicator.get(dp.indicator_id) ?? [];
    list.push(dp);
    historyByIndicator.set(dp.indicator_id, list);
  }
  const sortKey = (d: IndexDatapoint) => d.period_start ?? d.period_end ?? d.collected_at;
  for (const list of historyByIndicator.values()) {
    list.sort((a, b) => (sortKey(a) < sortKey(b) ? -1 : sortKey(a) > sortKey(b) ? 1 : 0));
  }

  const categories = Array.from(new Set(indicators.map((i) => i.category)));
  const currentEdition = editions[0];

  const lastUpdatedIso = [
    ...datapoints.map((d) => d.collected_at),
    ...indicators.map((i) => i.last_updated_at ?? ""),
  ]
    .filter(Boolean)
    .sort()
    .pop();

  const publishedReadings = datapoints.length;
  const editionSeries = [...editions]
    .filter((e) => e.headline_score !== null)
    .reverse()
    .map((e) => ({ label: e.period_label, value: e.headline_score as number }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={CRUMBS} />

      {/* Hero */}
      <header className="mt-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
          <Gauge className="h-3.5 w-3.5" /> Framework v1 — built for manual, checked data entry
        </div>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          UK AI Energy Index
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The UK AI Energy Index is a structured record of what artificial intelligence infrastructure
          is doing to Britain&rsquo;s electricity system. It tracks AI electricity demand, the growth of
          UK data centres and the grid pressure that follows, indicator by indicator. Each entry below
          carries a named source, a stated update schedule, a confidence level and a public revision
          history, so you can judge how solid a number is before you use it.
        </p>
        <p className="mt-4 rounded-lg border border-dashed border-border bg-surface p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Status:</strong> the index structure is live. Readings
          are compiled and published by hand, indicator by indicator, as each source is verified. We
          are deliberately not automating collection yet — an automated feed that quietly ingests a
          bad number is worse than an empty cell.
        </p>
      </header>

      {/* At a glance */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Indicators tracked
          </div>
          <div className="mt-1 font-display text-3xl font-bold">{indicators.length}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Published readings
          </div>
          <div className="mt-1 font-display text-3xl font-bold">{publishedReadings}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
            <Clock className="h-3.5 w-3.5" /> Last updated
          </div>
          <div className="mt-1 font-display text-xl font-semibold">
            {formatDate(lastUpdatedIso) ?? "Awaiting first reading"}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Every figure carries its own source and collection date.
          </p>
        </div>
      </section>



      <IndexOverviewSections />

      {/* Current edition */}
      {currentEdition ? (
        <section className="mt-10 rounded-xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold">
                Current edition — {currentEdition.period_label}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Methodology version {currentEdition.methodology_version}
                {currentEdition.published_at
                  ? ` · published ${formatDate(currentEdition.published_at)}`
                  : ""}
              </p>
            </div>
            {currentEdition.headline_score !== null ? (
              <div className="text-right">
                <div className="font-display text-4xl font-bold">
                  {currentEdition.headline_score}
                </div>
                {currentEdition.previous_score !== null ? (
                  <div className="text-xs text-muted-foreground">
                    previous {currentEdition.previous_score}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
          {currentEdition.summary ? (
            <p className="mt-4 text-sm text-muted-foreground">{currentEdition.summary}</p>
          ) : null}
          <div className="mt-4">
            <ConfidenceBadge level={currentEdition.confidence_level} />
          </div>
        </section>
      ) : null}

      {/* Headline score over time */}
      {editionSeries.length > 1 ? (
        <section className="mt-10 rounded-xl border border-border bg-card p-6" id="trend">
          <div className="flex items-center gap-2">
            <LineChartIcon className="h-5 w-5 text-brand" />
            <h2 className="font-display text-2xl font-semibold">Headline score over time</h2>
          </div>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Each point is a published edition. Editions are never rewritten in place — where a figure
            changes, the revision is logged below rather than the chart being quietly redrawn.
          </p>
          <div className="mt-5">
            <EditionTrendChart data={editionSeries} />
          </div>
        </section>
      ) : null}



      {/* Indicators */}
      <section className="mt-14" id="indicators">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-brand" />
          <h2 className="font-display text-2xl font-semibold">Indicators and sources</h2>
        </div>
        {indicators.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
            No indicators are published yet. The framework is in place and definitions are being
            finalised.
          </p>
        ) : (
          categories.map((cat) => (
            <div key={cat} className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {CATEGORY_LABELS[cat] ?? cat}
              </h3>
              <div className="mt-4 grid gap-5 lg:grid-cols-2">
                {indicators
                  .filter((i) => i.category === cat)
                  .map((indicator) => (
                    <IndicatorCard
                      key={indicator.id}
                      indicator={indicator}
                      history={historyByIndicator.get(indicator.id) ?? []}
                    />
                  ))}
              </div>
            </div>
          ))
        )}
      </section>

      {/* Methodology */}
      <section className="mt-16" id="methodology">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-brand" />
          <h2 className="font-display text-2xl font-semibold">Methodology</h2>
        </div>
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
            <h3 className="font-semibold text-foreground">How the index is built</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>
                Every indicator is defined first: what it measures, in what unit, from which named
                source, on what schedule, and which direction counts as more pressure on the system.
              </li>
              <li>
                A reading is entered for a stated period. Readings are marked as measured or
                estimated, and carry the source used for that specific figure.
              </li>
              <li>
                Readings are normalised to a comparable score before being weighted into an edition.
                Weights are published on each indicator card above.
              </li>
              <li>
                An edition is a dated release with its own methodology version. Older editions are
                kept as published, not silently rewritten.
              </li>
              <li>
                Any change to a published figure is logged in the revision history below, with the
                old value, the new value and the reason.
              </li>
            </ol>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
            <h3 className="flex items-center gap-2 font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4" /> Confidence levels
            </h3>
            <dl className="mt-3 space-y-3">
              <div>
                <dt className="font-medium text-foreground">High</dt>
                <dd>
                  Published by an official source, a regulator or a system operator, directly
                  measuring the thing we describe.
                </dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Medium</dt>
                <dd>
                  Credible published figure that needs interpretation — for example a national
                  statistic used as a proxy, or a figure covering a slightly different scope.
                </dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Low</dt>
                <dd>
                  Derived from partial reporting, industry disclosure or a small sample. Directionally
                  useful, not quotable as fact.
                </dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Indicative</dt>
                <dd>
                  Our own modelled estimate under stated assumptions. Treat as a scenario, not a
                  measurement.
                </dd>
              </div>
            </dl>
            <p className="mt-4">
              Full site-wide approach:{" "}
              <Link to="/research-methodology" className="text-brand hover:underline">
                research methodology
              </Link>{" "}
              and{" "}
              <Link to="/editorial-standards" className="text-brand hover:underline">
                editorial standards
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Update schedule */}
      <section className="mt-16" id="schedule">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-brand" />
          <h2 className="font-display text-2xl font-semibold">Update schedule</h2>
        </div>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
          Each indicator follows the cadence of its underlying source rather than a fixed publishing
          calendar. Where a source slips, the indicator keeps its last published reading and the delay
          is recorded rather than back-filled with an estimate.
        </p>
        <div className="mt-5 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Indicator</th>
                <th className="px-4 py-3 font-medium">Frequency</th>
                <th className="px-4 py-3 font-medium">Next review</th>
                <th className="px-4 py-3 font-medium">Collection</th>
                <th className="px-4 py-3 font-medium">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {indicators.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-muted-foreground" colSpan={5}>
                    Schedule will appear here once indicators are published.
                  </td>
                </tr>
              ) : (
                indicators.map((i) => (
                  <tr key={i.id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{i.short_name ?? i.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {FREQUENCY_LABELS[i.update_frequency] ?? i.update_frequency}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <IndexReviewStatus nextReviewAt={i.next_review_at} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {COLLECTION_LABELS[i.collection_method] ?? i.collection_method}
                    </td>
                    <td className="px-4 py-3">
                      <ConfidenceBadge level={i.confidence_level} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Revision history */}
      <section className="mt-16" id="revisions">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-brand" />
          <h2 className="font-display text-2xl font-semibold">Revision history</h2>
        </div>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
          Every change to a published indicator, reading, edition or to the methodology itself is
          recorded here. Corrections are also handled under our{" "}
          <Link to="/corrections" className="text-brand hover:underline">
            corrections policy
          </Link>
          .
        </p>
        {revisions.length === 0 ? (
          <p className="mt-5 rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
            No revisions yet — nothing published has been changed since release.
          </p>
        ) : (
          <ol className="mt-5 space-y-4">
            {revisions.map((r) => (
              <li key={r.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full border border-border px-2 py-0.5 capitalize">
                    {r.change_type.replace(/_/g, " ")}
                  </span>
                  <span className="capitalize">{r.entity_type}</span>
                  <span>·</span>
                  <span>{formatDate(r.revised_at)}</span>
                  {r.methodology_version ? <span>· methodology v{r.methodology_version}</span> : null}
                </div>
                <p className="mt-2 text-sm font-medium">{r.summary}</p>
                {r.previous_value || r.new_value ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {r.previous_value ?? "—"} → {r.new_value ?? "—"}
                  </p>
                ) : null}
                {r.reason ? (
                  <p className="mt-1 text-sm text-muted-foreground">{r.reason}</p>
                ) : null}
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Citation and sharing */}
      <div className="mt-16">
        <IndexCitation
          title="UK AI Energy Index"
          edition={currentEdition?.period_label ?? null}
          version={currentEdition?.methodology_version ?? null}
          url={CANONICAL}
        />
      </div>

      {/* Newsletter + report CTAs */}
      <section className="mt-16 grid gap-6 lg:grid-cols-2" id="get-updates">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-semibold">Get UK AI Energy Index updates</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We email a short note whenever an indicator is updated or a new edition is published,
            including what changed and why. No daily noise.
          </p>
          <div className="mt-4">
            <LeadCapture
              variant="newsletter"
              source="energy-index"
              context="uk-ai-energy-index"
              title="Get UK AI Energy Index updates"
              subtitle="New editions, indicator changes and methodology updates."
            />
          </div>

        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand" />
            <h2 className="font-display text-xl font-semibold">Go deeper with the reports</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            The index tracks the numbers. Our reports set out what they mean for UK grid capacity,
            data centre build-out and business electricity costs — with the same sourcing standards.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link
              to="/reports"
              className="inline-flex items-center gap-1 rounded-lg bg-brand px-4 py-2 font-medium text-brand-foreground hover:opacity-90"
            >
              Browse reports &amp; research →
            </Link>
            <Link
              to="/research-methodology"
              className="inline-flex items-center gap-1 rounded-lg border border-border px-4 py-2 font-medium hover:border-brand"
            >
              How we source data
            </Link>
          </div>
        </div>
      </section>

      {/* Related */}

      <section className="mt-16 rounded-xl border border-border bg-surface p-6">
        <h2 className="font-display text-xl font-semibold">Continue your research</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <Link to="/reports" className="rounded-lg border border-border bg-card p-4 hover:border-brand">
            Reports &amp; research →
          </Link>
          <Link to="/ai-growth-zones" className="rounded-lg border border-border bg-card p-4 hover:border-brand">
            UK AI Growth Zones →
          </Link>
          <Link to="/data-centres" className="rounded-lg border border-border bg-card p-4 hover:border-brand">
            UK data centres →
          </Link>

          <Link to="/ai-energy-calculators" className="rounded-lg border border-border bg-card p-4 hover:border-brand">
            AI energy calculators →
          </Link>
          <Link to="/news" className="rounded-lg border border-border bg-card p-4 hover:border-brand">
            Latest AI energy news →
          </Link>
        </div>
      </section>
    </div>
  );
}
