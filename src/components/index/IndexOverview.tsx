// Overview blocks for the UK AI Energy Index landing page: the three
// sub-index cards and the "Key UK indicators" register.

import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, FileText } from "lucide-react";
import { indexSectionsQueryOptions } from "@/lib/index-sections.queries";
import {
  SUBINDEX_META,
  SUBINDEX_SLUGS,
  
  GEO_COVERAGE_LABELS,
  CONFIDENCE_LABELS,
  fmtDate,
  fmtNumber,
} from "@/lib/index-sections";
import { ClassificationBadge, SubIndexCard } from "@/components/index/IndexSectionUI";
import { IndexReviewStatus } from "@/components/ReviewStatus";

// Indicator slugs the overview looks for. If a slug has no published
// indicator or reading, the field is shown as "Data not yet available".
const KEY_FIELDS: { slug: string; label: string }[] = [
  {
    slug: "gb-dc-electricity-consumption-desnz",
    label: "Annual data-centre electricity consumption (Great Britain)",
  },
  {
    slug: "gb-dc-share-of-grid-electricity-desnz",
    label: "Data-centre share of Great Britain grid electricity",
  },
  {
    slug: "gb-colocation-data-centre-capacity",
    label: "Colocation data-centre IT capacity (Great Britain, maximum rated IT load)",
  },
  { slug: "operational-uk-data-centres", label: "Operational UK data centres" },
  { slug: "data-centres-under-construction", label: "Data centres under construction" },
  { slug: "approved-or-proposed-developments", label: "Approved or proposed developments" },
  { slug: "new-capacity-mw", label: "New capacity in megawatts" },
  {
    slug: "grid-connection-queue",
    label: "Contracted demand connection capacity in the Great Britain queue (all sectors, not consumption)",
  },
  {
    slug: "dc-share-of-gb-demand-queue",
    label: "Data-centre share of the Great Britain demand connection queue",
  },
  { slug: "average-grid-connection-wait", label: "Average grid-connection waiting time" },
  { slug: "regions-high-or-severe-pressure", label: "Regions currently experiencing high or severe pressure" },
];

export function IndexOverviewSections() {
  const { data } = useSuspenseQuery(indexSectionsQueryOptions);
  const { subindices, indicators, datapoints } = data;

  return (
    <>
      <section className="mt-12" aria-labelledby="subindices-heading">
        <h2 id="subindices-heading" className="font-display text-2xl font-semibold">
          The three sub-indices
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          The UK AI Energy Index tracks how artificial intelligence and data-centre growth are
          affecting Britain&rsquo;s electricity demand, physical infrastructure and power networks. It
          brings together available evidence on electricity consumption, data-centre development and
          regional grid pressure, and is designed to distinguish verified information from
          estimates, forecasts and undisclosed data.
        </p>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {SUBINDEX_SLUGS.map((slug) => (
            <SubIndexCard
              key={slug}
              name={SUBINDEX_META[slug].name}
              blurb={SUBINDEX_META[slug].blurb}
              path={SUBINDEX_META[slug].path}
              record={subindices.find((s) => s.slug === slug)}
            />
          ))}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="key-indicators-heading">
        <h2 id="key-indicators-heading" className="font-display text-2xl font-semibold">
          Latest available UK indicators
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Each field shows its value, geographic coverage, reporting period, source, classification,
          confidence and the date it was last reviewed. Where the published evidence does not support
          a figure, the field reads &ldquo;Insufficient evidence&rdquo; — nothing is estimated to fill
          a gap.
        </p>
        <div className="mt-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[1040px] text-left text-sm">
            <caption className="sr-only">Latest available UK AI energy indicators</caption>
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-3">Indicator</th>
                <th scope="col" className="px-4 py-3">Value</th>
                <th scope="col" className="px-4 py-3">Coverage</th>
                <th scope="col" className="px-4 py-3">Reporting period</th>
                <th scope="col" className="px-4 py-3">Source</th>
                <th scope="col" className="px-4 py-3">Classification</th>
                <th scope="col" className="px-4 py-3">Confidence</th>
                <th scope="col" className="px-4 py-3">Review status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {KEY_FIELDS.map((field) => {
                const indicator = indicators.find((i) => i.slug === field.slug);
                const latest = indicator
                  ? datapoints.find((d) => d.indicator_id === indicator.id)
                  : undefined;
                const value =
                  latest?.value !== null && latest?.value !== undefined
                    ? fmtNumber(latest.value, latest.unit ?? indicator?.unit ?? null)
                    : (latest?.value_text ?? null);
                return (
                  <tr key={field.slug} className="align-top">
                    <th scope="row" className="px-4 py-3 font-medium">{field.label}</th>
                    <td className="px-4 py-3">
                      {value ?? (
                        <span className="italic text-muted-foreground">Insufficient evidence</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {latest ? (GEO_COVERAGE_LABELS[latest.geographic_coverage] ?? "—") : "—"}
                    </td>
                    <td className="px-4 py-3">{latest?.period_label ?? "—"}</td>
                    <td className="px-4 py-3">
                      {latest?.source_url || indicator?.source_url ? (
                        <a
                          href={(latest?.source_url ?? indicator?.source_url) as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand hover:underline"
                        >
                          {latest?.source_name ?? indicator?.source_name ?? "Source"}
                        </a>
                      ) : (
                        (latest?.source_name ?? indicator?.source_name ?? "—")
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <ClassificationBadge
                        value={latest?.data_classification ?? indicator?.data_classification ?? "not_available"}
                      />
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {latest
                        ? (CONFIDENCE_LABELS[latest.confidence_level_rating] ?? "Not assessed")
                        : "Not assessed"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      <div>{fmtDate(latest?.reviewed_at ?? indicator?.last_updated_at) ?? "—"}</div>
                      <IndexReviewStatus nextReviewAt={indicator?.next_review_at} className="mt-1" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-4">
          <Link
            to="/uk-ai-energy-index/methodology"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            Read the methodology and full source register
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </p>
      </section>
    </>
  );
}
