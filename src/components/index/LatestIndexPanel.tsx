// "Latest Index" panel — the homepage's flagship block. Every value shown is a
// published datapoint from the index record. Change-since-previous only renders
// where the record itself carries a previous comparable value.

import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, FileText, Library, Minus, TrendingDown, TrendingUp } from "lucide-react";
import {
  indexSectionsQueryOptions,
  indexFrameworkQueryOptions,
} from "@/lib/index-sections.queries";
import {
  SUBINDEX_META,
  DATA_CLASSIFICATION_LABELS,
  fmtDate,
  fmtNumber,
  type SubIndexSlug,
} from "@/lib/index-sections";
import { ClassificationBadge } from "@/components/index/IndexSectionUI";
import { IndexUpdatesCTA } from "@/components/index/IndexUpdatesCTA";
import { cn } from "@/lib/utils";
import { IndexReviewStatus } from "@/components/ReviewStatus";

export function LatestIndexPanel() {
  const { data } = useSuspenseQuery(indexSectionsQueryOptions);
  const { data: framework } = useSuspenseQuery(indexFrameworkQueryOptions);

  const subindices = data.subindices;
  if (subindices.length === 0) return null;

  const edition = framework.editions.find((e) => e.status === "published") ?? null;

  const cards = subindices.map((s) => {
    const indicators = data.indicators.filter((i) => i.subindex_id === s.id);
    const ids = indicators.map((i) => i.id);
    const headline =
      data.datapoints.find((d) => ids.includes(d.indicator_id) && d.status === "published") ?? null;
    const indicator = headline
      ? indicators.find((i) => i.id === headline.indicator_id)
      : indicators[0];
    return { subindex: s, headline, indicator };
  });

  return (
    <section
      className="border-b border-border bg-surface"
      aria-labelledby="latest-index-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
              Latest index evidence
            </span>
            <h2
              id="latest-index-heading"
              className="mt-2 font-serif text-3xl tracking-tight sm:text-4xl"
            >
              Three measures shaping Britain&rsquo;s AI energy future
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              The UK AI Energy Index brings together three independently researched sub-indices
              covering electricity demand, data-centre growth and grid pressure. Explore the latest
              sourced indicators and the evidence behind them.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Current edition</dt>
            <dd className="font-medium">{edition?.period_label ?? "Insufficient evidence"}</dd>
            {edition?.published_at ? (
              <>
                <dt className="text-muted-foreground">Published</dt>
                <dd className="font-medium">{fmtDate(edition.published_at)}</dd>
              </>
            ) : null}
            {edition?.methodology_version ? (
              <>
                <dt className="text-muted-foreground">Version</dt>
                <dd className="font-medium">{edition.methodology_version}</dd>
              </>
            ) : null}
          </dl>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {cards.map(({ subindex: s, headline, indicator }) => {
            const meta = SUBINDEX_META[s.slug as SubIndexSlug];
            const value =
              headline?.value !== null && headline?.value !== undefined
                ? fmtNumber(headline.value, headline.unit ?? indicator?.unit ?? null)
                : (headline?.value_text ?? null);
            const change = headline?.percent_change ?? null;
            const ChangeIcon =
              change === null ? Minus : change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus;
            const indicatorLabel = (() => {
              const name = indicator?.name ?? "Headline indicator";
              if (name === "GB data-centre electricity demand, 2050") {
                return "Forecast GB data-centre electricity demand in 2050";
              }
              return name;
            })();

            return (
              <article
                key={s.id}
                className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-card"
              >
                {s.status_label !== "2024 baseline" && (
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
                    {s.status_label}
                  </span>
                )}
                <h3
                  className={cn(
                    "font-display text-lg font-bold leading-snug",
                    s.status_label === "2024 baseline" ? "mt-0" : "mt-3"
                  )}
                >
                  {meta?.name ?? s.name}
                </h3>

                <div className="mt-5 flex-1 rounded-lg border border-border bg-surface p-4">
                  <h4 className="text-xs text-muted-foreground">
                    {indicatorLabel}
                  </h4>
                  <div className="mt-1 font-display text-2xl font-bold tracking-tight">
                    {value ?? (
                      <span className="text-base font-medium italic text-muted-foreground">
                        Insufficient evidence
                      </span>
                    )}
                  </div>
                  {headline ? (
                    <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <div>{headline.period_label}</div>
                      <div className="pt-1">
                        <ClassificationBadge
                          value={
                            headline.data_classification ??
                            indicator?.data_classification ??
                            "not_available"
                          }
                        />
                      </div>
                      <div className="pt-1">
                        <IndexReviewStatus nextReviewAt={indicator?.next_review_at} />
                      </div>
                      {headline.source_url ? (
                        <div>
                          <a
                            href={headline.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand hover:underline"
                          >
                            {headline.source_name ?? "Source"}
                          </a>
                        </div>
                      ) : headline.source_name ? (
                        <div>{headline.source_name}</div>
                      ) : null}
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-muted-foreground">
                      No verified figure is published for this sub-index yet.{" "}
                      {DATA_CLASSIFICATION_LABELS.insufficient_evidence} is shown rather than an
                      estimate.
                    </p>
                  )}
                </div>

                {meta && (
                  <Link
                    to={meta.path}
                    className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-semibold text-brand hover:underline"
                  >
                    Open sub-index <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                )}
              </article>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/uk-ai-energy-index"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              View the full index <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/uk-ai-energy-index/methodology"
              className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-semibold hover:bg-secondary"
            >
              <FileText className="h-4 w-4" aria-hidden="true" /> Read the methodology
            </Link>
            <Link
              to="/uk-ai-energy-index/methodology"
              hash="sources"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              <Library className="h-4 w-4" aria-hidden="true" /> View sources
            </Link>
          </div>
          <IndexUpdatesCTA context="homepage-latest-index" compact />
        </div>
      </div>
    </section>
  );
}
