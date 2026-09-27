// Shared presentation components for the UK AI Energy Index sections.
// Every component degrades to an explicit "Data not yet available" state
// rather than showing an invented figure.

import { Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, Minus, TrendingDown, TrendingUp } from "lucide-react";
import {
  CLASSIFICATION_LABELS,
  CLASSIFICATION_STYLES,
  COMPLETENESS_LABELS,
  DIRECTION_LABELS,
  NOT_AVAILABLE,
  PRESSURE_LABELS,
  PRESSURE_STYLES,
  PRESSURE_SYMBOLS,
  fmtDate,
  fmtNumber,
} from "@/lib/index-sections";
import type {
  GridRating,
  RegionStat,
  SectionDatapoint,
  SectionIndicator,
  SubIndex,
} from "@/lib/index-sections.functions";
import { IndexReviewStatus } from "@/components/ReviewStatus";

export function ClassificationBadge({ value }: { value: string }) {
  const style = CLASSIFICATION_STYLES[value] ?? CLASSIFICATION_STYLES["not_available"];
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${style}`}>
      {CLASSIFICATION_LABELS[value] ?? value}
    </span>
  );
}

export function PressureBadge({ rating }: { rating: string }) {
  const style = PRESSURE_STYLES[rating] ?? PRESSURE_STYLES["insufficient_evidence"];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style}`}>
      <span aria-hidden="true">{PRESSURE_SYMBOLS[rating] ?? "○"}</span>
      {PRESSURE_LABELS[rating] ?? rating}
    </span>
  );
}

export function DirectionChip({ direction }: { direction: string }) {
  const Icon = direction === "rising" ? TrendingUp : direction === "falling" ? TrendingDown : Minus;
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
      <Icon className="h-3 w-3" aria-hidden="true" />
      {DIRECTION_LABELS[direction] ?? "Unknown"}
    </span>
  );
}

export function NotAvailable({ label = NOT_AVAILABLE }: { label?: string }) {
  return <span className="text-sm italic text-muted-foreground">{label}</span>;
}

export function SubIndexCard({
  name,
  blurb,
  path,
  record,
}: {
  name: string;
  blurb: string;
  path: string;
  record: SubIndex | undefined;
}) {
  const statusLabel = record?.score !== null && record?.score !== undefined
    ? record.score.toLocaleString("en-GB")
    : (record?.status_label ?? "Baseline in development");
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-6">
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{statusLabel}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {record?.direction && record.direction !== "unknown" ? (
          <DirectionChip direction={record.direction} />
        ) : null}
        <span className="text-xs text-muted-foreground">
          {record?.period_label
            ? `Baseline period: ${record.period_label}`
            : "Reporting period: not yet set"}
        </span>
      </div>
      {record?.period_label && (record.score === null || record.score === undefined) ? (
        <p className="mt-2 text-xs text-muted-foreground">Growth: not yet calculated</p>
      ) : null}
      <p className="mt-3 flex-1 text-sm text-muted-foreground">{record?.intro ?? blurb}</p>
      <p className="mt-4 text-xs text-muted-foreground">
        Last reviewed: {fmtDate(record?.last_reviewed_at) ?? NOT_AVAILABLE}
      </p>
      <Link
        to={path}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
      >
        View the full sub-index <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

export type IndicatorRow = {
  indicator: SectionIndicator;
  latest: SectionDatapoint | undefined;
};

export function IndicatorTable({ rows }: { rows: IndicatorRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
        No indicators have been published in this section yet. {NOT_AVAILABLE}.
      </p>
    );
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[880px] text-left text-sm">
        <caption className="sr-only">Indicators, current values, classification and sources</caption>
        <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th scope="col" className="px-4 py-3">Indicator</th>
            <th scope="col" className="px-4 py-3">Current value</th>
            <th scope="col" className="px-4 py-3">Reporting period</th>
            <th scope="col" className="px-4 py-3">Previous</th>
            <th scope="col" className="px-4 py-3">Change</th>
            <th scope="col" className="px-4 py-3">Classification</th>
            <th scope="col" className="px-4 py-3">Source</th>
            <th scope="col" className="px-4 py-3">Review status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map(({ indicator, latest }) => {
            const value =
              latest?.value !== null && latest?.value !== undefined
                ? fmtNumber(latest.value, latest.unit ?? indicator.unit)
                : (latest?.value_text ?? null);
            const classification = latest?.data_classification ?? indicator.data_classification;
            return (
              <tr key={indicator.id} className="align-top">
                <th scope="row" className="px-4 py-3 font-medium">
                  {indicator.name}
                  {indicator.description ? (
                    <span className="mt-1 block text-xs font-normal text-muted-foreground">
                      {indicator.description}
                    </span>
                  ) : null}
                  {indicator.caveats ? (
                    <span className="mt-1 block text-xs font-normal italic text-muted-foreground">
                      {indicator.caveats}
                    </span>
                  ) : null}
                </th>
                <td className="px-4 py-3">{value ?? <NotAvailable />}</td>
                <td className="px-4 py-3">{latest?.period_label ?? <NotAvailable label="—" />}</td>
                <td className="px-4 py-3">
                  {fmtNumber(latest?.previous_value ?? null, latest?.unit ?? indicator.unit) ?? (
                    <NotAvailable label="—" />
                  )}
                </td>
                <td className="px-4 py-3">
                  {latest?.percent_change !== null && latest?.percent_change !== undefined
                    ? `${latest.percent_change > 0 ? "+" : ""}${latest.percent_change}%`
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <ClassificationBadge value={classification} />
                </td>
                <td className="px-4 py-3">
                  {latest?.source_url || indicator.source_url ? (
                    <a
                      href={(latest?.source_url ?? indicator.source_url) as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-brand hover:underline"
                    >
                      {latest?.source_name ?? indicator.source_name ?? "Source"}
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  ) : (
                    (latest?.source_name ?? indicator.source_name ?? <NotAvailable label="Not disclosed" />)
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  <div>{fmtDate(latest?.reviewed_at ?? indicator.last_updated_at) ?? "—"}</div>
                  <IndexReviewStatus nextReviewAt={indicator.next_review_at} className="mt-1" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function RegionalGrowthTable({
  stats,
  regions,
}: {
  stats: RegionStat[];
  regions: { slug: string; name: string }[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[1000px] text-left text-sm">
        <caption className="sr-only">Data-centre development by UK index region</caption>
        <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th scope="col" className="px-4 py-3">Region</th>
            <th scope="col" className="px-4 py-3">Operational</th>
            <th scope="col" className="px-4 py-3">Under construction</th>
            <th scope="col" className="px-4 py-3">Approved</th>
            <th scope="col" className="px-4 py-3">Proposed</th>
            <th scope="col" className="px-4 py-3">Operational MW</th>
            <th scope="col" className="px-4 py-3">MW in development</th>
            <th scope="col" className="px-4 py-3">Hyperscale</th>
            <th scope="col" className="px-4 py-3">Latest decision</th>
            <th scope="col" className="px-4 py-3">Completeness</th>
            <th scope="col" className="px-4 py-3">Last updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {regions.map((region) => {
            const s = stats.find((row) => row.region_slug === region.slug);
            const cell = (v: number | null | undefined) =>
              v === null || v === undefined ? <span className="text-muted-foreground">—</span> : v.toLocaleString("en-GB");
            return (
              <tr key={region.slug}>
                <th scope="row" className="px-4 py-3 font-medium">{region.name}</th>
                <td className="px-4 py-3">{cell(s?.operational_count)}</td>
                <td className="px-4 py-3">{cell(s?.under_construction_count)}</td>
                <td className="px-4 py-3">{cell(s?.approved_count)}</td>
                <td className="px-4 py-3">{cell(s?.proposed_count)}</td>
                <td className="px-4 py-3">{cell(s?.operational_mw)}</td>
                <td className="px-4 py-3">{cell(s?.development_mw)}</td>
                <td className="px-4 py-3">{cell(s?.hyperscale_count)}</td>
                <td className="px-4 py-3">
                  {s?.latest_decision ? (
                    <>
                      {s.latest_decision}
                      {s.latest_decision_date ? (
                        <span className="block text-xs text-muted-foreground">
                          {fmtDate(s.latest_decision_date)}
                        </span>
                      ) : null}
                    </>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs">
                  {COMPLETENESS_LABELS[s?.data_completeness ?? "none"]}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {fmtDate(s?.last_reviewed_at) ?? "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function RegionalPressureTable({
  ratings,
  regions,
}: {
  ratings: GridRating[];
  regions: { slug: string; name: string }[];
}) {
  const FIELDS: { label: string; key: keyof GridRating }[] = [
    { label: "Connection demand", key: "connection_demand_evidence" },
    { label: "Known delays", key: "known_delays" },
    { label: "Network constraints", key: "network_constraints" },
    { label: "Planned investment", key: "planned_investment" },
    { label: "Flexible connections", key: "flexible_connections" },
  ];

  return (
    <div className="space-y-4">
      {regions.map((region) => {
        const r = ratings.find((row) => row.region_slug === region.slug);
        return (
          <article
            key={region.slug}
            className="rounded-xl border border-border bg-card p-5"
            aria-label={`Grid pressure: ${region.name}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-lg font-semibold">{region.name}</h3>
              <PressureBadge rating={r?.rating ?? "insufficient_evidence"} />
            </div>

            <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
              {r?.rationale ?? (
                <span className="italic">No rating has been assigned. {NOT_AVAILABLE}.</span>
              )}
            </p>

            <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
              {FIELDS.map((f) => {
                const value = r?.[f.key] as string | null | undefined;
                return (
                  <div key={f.label}>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {f.label}
                    </dt>
                    <dd className="mt-1 text-sm">
                      {value ? value : <span className="text-muted-foreground">&mdash;</span>}
                    </dd>
                  </div>
                );
              })}
            </dl>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
              <span>
                Confidence:{" "}
                <span className="capitalize text-foreground">
                  {r?.evidence_confidence ?? "—"}
                </span>
              </span>
              <span>Last reviewed: {fmtDate(r?.last_reviewed_at) ?? "—"}</span>
              {r?.source_url ? (
                <a
                  href={r.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-brand hover:underline"
                >
                  {r.source_title ?? "Source"}
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function SectionNav({ current }: { current: string }) {
  const links = [
    { to: "/uk-ai-energy-index", label: "Index overview" },
    { to: "/uk-ai-energy-index/electricity-demand", label: "AI Electricity Demand" },
    { to: "/uk-ai-energy-index/data-centre-growth", label: "Data Centre Growth" },
    { to: "/uk-ai-energy-index/grid-pressure", label: "Grid Pressure" },
    { to: "/uk-ai-energy-index/methodology", label: "Methodology & sources" },
  ];
  return (
    <nav aria-label="UK AI Energy Index sections" className="flex flex-wrap gap-2">
      {links.map((l) => (
        <Link
          key={l.to}
          to={l.to}
          className={`rounded-full border px-3 py-1.5 text-sm ${
            l.to === current
              ? "border-brand bg-brand/10 font-medium text-brand"
              : "border-border text-muted-foreground hover:border-brand/40 hover:text-foreground"
          }`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
