import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { indexSectionsQueryOptions } from "@/lib/index-sections.queries";
import {
  CLASSIFICATION_STATEMENT,
  DATA_CLASSIFICATION_LABELS,
  CONFIDENCE_LABELS,
  GEO_COVERAGE_LABELS,
  INDEX_REGIONS,
  PRESSURE_LABELS,
  SOURCE_ORGANISATIONS,
  CAPACITY_DEFINITION_LABELS,
  fmtDate,
} from "@/lib/index-sections";
import { SectionNav } from "@/components/index/IndexSectionUI";
import { CorrectionForm } from "@/components/index/CorrectionForm";

const CANONICAL = "https://aienergyintelligence.co.uk/uk-ai-energy-index/methodology";

export const Route = createFileRoute("/uk-ai-energy-index/methodology")({
  loader: ({ context }) => context.queryClient.ensureQueryData(indexSectionsQueryOptions),
  errorComponent: ({ error }) => (
    <div role="alert" className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">We couldn&rsquo;t load the source register</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">Page not found.</div>
  ),
  head: () => ({
    meta: [
      { title: "UK AI Energy Index Methodology and Sources" },
      {
        name: "description",
        content:
          "How the UK AI Energy Index is built: what each sub-index measures, how data is classified, how duplicates are prevented, how grid-pressure ratings are assigned, and the full source register.",
      },
      { property: "og:title", content: "UK AI Energy Index — methodology and sources" },
      {
        property: "og:description",
        content:
          "Classification rules, regional definitions, rating logic, review frequency, corrections process and the complete source register.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: CANONICAL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
  }),
  component: MethodologyPage,
});

function MethodologyPage() {
  const { data } = useSuspenseQuery(indexSectionsQueryOptions);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <SectionNav current="/uk-ai-energy-index/methodology" />

      <header className="mt-8">
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Methodology and sources
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          How the UK AI Energy Index is compiled, classified, reviewed and corrected.
        </p>
      </header>

      <div className="mt-8 rounded-xl border-2 border-brand/30 bg-brand/5 p-6">
        <p className="text-base font-medium">{CLASSIFICATION_STATEMENT}</p>
        <p className="mt-2 text-sm text-muted-foreground">Methodology version 1.0.</p>
      </div>

      <section className="mt-10 space-y-4">
        <h2 className="font-display text-2xl font-semibold">What each sub-index measures</h2>
        <dl className="space-y-3 text-sm text-muted-foreground">
          <div>
            <dt className="font-medium text-foreground">AI Electricity Demand Index</dt>
            <dd>
              Electricity consumed by UK data-centre and AI activity: annual consumption, share of
              national demand, AI-specific consumption where it can be isolated, quarterly and annual
              growth, published 2030 and 2035 forecasts, and estimated peak-power requirements.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">Data Centre Growth Index</dt>
            <dd>
              Physical infrastructure: operational facilities, facilities under construction, approved
              and proposed developments, new capacity in megawatts, regional concentration,
              hyperscale developments, and planning approvals and refusals.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">Grid Pressure Index</dt>
            <dd>
              Network capability: connection requests, average connection waiting time, projects
              delayed by insufficient capacity, available regional capacity, substation and
              transmission constraints, planned network investment, flexible connection agreements,
              and the risk of local congestion.
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="font-display text-2xl font-semibold">How data is classified</h2>
        <p className="text-sm text-muted-foreground">
          Every value carries one of the following classifications, shown next to the figure itself:
        </p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><strong className="text-foreground">{DATA_CLASSIFICATION_LABELS["official"]}</strong> &mdash; published by the originating organisation and checked against the primary document.</li>
          <li><strong className="text-foreground">{DATA_CLASSIFICATION_LABELS["calculated"]}</strong> &mdash; derived from official figures. The inputs, units, sources and formula are retained with the record, and the figure cannot be published without them.</li>
          <li><strong className="text-foreground">{DATA_CLASSIFICATION_LABELS["industry_estimate"]}</strong> &mdash; an estimate published by a third party, reproduced with its source.</li>
          <li><strong className="text-foreground">{DATA_CLASSIFICATION_LABELS["aie_estimate"]}</strong> &mdash; our own estimate, with the method, assumptions and limitations stated.</li>
          <li><strong className="text-foreground">{DATA_CLASSIFICATION_LABELS["forecast"]}</strong> &mdash; a projection of a future period, kept separate from observations.</li>
          <li><strong className="text-foreground">{DATA_CLASSIFICATION_LABELS["not_disclosed"]}</strong> &mdash; the figure exists but has not been made public.</li>
          <li><strong className="text-foreground">{DATA_CLASSIFICATION_LABELS["insufficient_evidence"]}</strong> &mdash; the available evidence does not support a defensible figure or rating.</li>
          <li><strong className="text-foreground">{DATA_CLASSIFICATION_LABELS["not_available"]}</strong> &mdash; no figure has been entered yet. The cell stays empty rather than being filled, and zero is never used in its place.</li>
        </ul>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="font-display text-2xl font-semibold">Estimates and forecasts</h2>
        <p className="text-sm text-muted-foreground">
          Forecasts are never mixed into current observations. On the AI Electricity Demand Index they
          appear in a separate table, and charts plot only recorded readings for periods that have
          already occurred. No sub-index carries a headline score until enough sourced readings exist
          to support one; until then each reads &ldquo;Baseline in development&rdquo;.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="font-display text-2xl font-semibold">Preventing duplicate developments</h2>
        <p className="text-sm text-muted-foreground">
          Each development is held once, as a unique record with its own project name, operator,
          location, status, capacity, planning authority and planning reference. The database enforces
          a single record per planning authority and reference, so a project reported by several
          outlets cannot be counted twice. Where a project appears under different names, the earlier
          record is amended rather than a second one created.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="font-display text-2xl font-semibold">Regional definitions</h2>
        <p className="text-sm text-muted-foreground">
          Both the growth and grid-pressure sub-indices use the same nine regions. Slough and the
          Thames Valley is separated from the wider South East because of its concentration of
          existing capacity.
        </p>
        <ul className="grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
          {INDEX_REGIONS.map((r) => (
            <li key={r.slug}>{r.name}</li>
          ))}
        </ul>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="font-display text-2xl font-semibold">How grid-pressure ratings are assigned</h2>
        <p className="text-sm text-muted-foreground">
          A region receives one of five ratings: {Object.values(PRESSURE_LABELS).join(", ")}. A rating
          is only recorded when there is a written explanation and a stated evidence-confidence level.
          A rating of low, moderate, high or severe cannot be published unless at least two
          published evidence records are attached to the assessment; the database rejects the
          attempt and the region stays at &ldquo;Insufficient evidence&rdquo;. A rating is never
          assigned automatically from a single data point. Ratings reflect recorded
          evidence about connection demand, delays, constraints and planned investment &mdash; not
          opinion, and not the number of projects alone.
        </p>
        <p className="text-sm text-muted-foreground">
          Two documents repeating one underlying claim are not independent corroboration. Evidence
          must concern the same geography and the same assessment period, and network licence areas
          do not necessarily match these regions: a figure covering a grid supply point or a whole
          licence area is recorded at that geography and is never treated as a figure for a region.
          Demand headroom is kept separate from generation headroom, and planned reinforcement is
          kept separate from capacity already available.
        </p>
        <p className="rounded-lg border border-border bg-surface p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Current limitation.</strong> This methodology does not
          yet define the criteria that separate low, moderate, high and severe pressure. Until those
          thresholds are published, every region remains at &ldquo;Insufficient evidence&rdquo; even
          where evidence has been collected. Defining them is the next stage of work; we will not
          invent thresholds or assign ratings to fill the table. Publishing individual national
          indicators does not complete the rating baseline.
        </p>
        <p className="text-sm text-muted-foreground">
          National figures &mdash; such as the Great Britain connection queue &mdash; describe the
          country as a whole and are never apportioned to a region or used to justify a regional
          rating. Northern Ireland is assessed only from Northern Irish sources, as it sits on a
          separate electricity system. An average connection waiting time is never inferred from
          individual delayed projects.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="font-display text-2xl font-semibold">Review frequency and corrections</h2>
        <p className="text-sm text-muted-foreground">
          Every indicator carries its own update schedule and a &ldquo;last reviewed&rdquo; date, and
          the index as a whole is reviewed quarterly. Corrections supersede rather than erase: the
          previous record is retained and the change is logged. To request a correction, use our{" "}
          <Link to="/corrections" className="text-brand hover:underline">corrections policy</Link> or{" "}
          <Link to="/contact" className="text-brand hover:underline">contact us</Link> with the
          indicator, the figure in question and the source you believe is correct.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="font-display text-2xl font-semibold">Limitations of UK data</h2>
        <p className="text-sm text-muted-foreground">
          There is no single official register of UK data centres, their capacity or their electricity
          consumption. Operators are not required to disclose site-level load, planning records are
          held by individual authorities in inconsistent formats, and connection-queue data is
          published at network rather than facility level. AI-specific consumption is rarely separable
          from general compute. The index reflects those gaps openly instead of closing them with
          estimates.
        </p>
      </section>


      <section className="mt-10 space-y-3">
        <h2 className="font-display text-2xl font-semibold">Geographic definitions</h2>
        <p className="text-sm text-muted-foreground">
          Every figure records the geography it covers, because UK, Great Britain and single-nation
          statistics are not interchangeable. The available coverages are:{" "}
          {Object.values(GEO_COVERAGE_LABELS).join(", ")}. Northern Ireland is assessed separately
          from Great Britain throughout the Grid Pressure Index.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="font-display text-2xl font-semibold">Confidence ratings</h2>
        <p className="text-sm text-muted-foreground">
          Each figure and each regional assessment carries a confidence rating of{" "}
          {[CONFIDENCE_LABELS["high"], CONFIDENCE_LABELS["medium"], CONFIDENCE_LABELS["low"], CONFIDENCE_LABELS["not_assessed"]].join(", ")}.
          Confidence describes the strength of the underlying evidence, not the precision of the
          number.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="font-display text-2xl font-semibold">Counting projects, campuses and capacity</h2>
        <p className="text-sm text-muted-foreground">
          One record represents one facility or development. Where several buildings share a campus,
          each building is recorded separately and the campus name links them, so campus capacity is
          never added to the individual building figures. Totals are reported by development status
          and are never combined: proposed developments are not added to operational facilities.
        </p>
        <p className="text-sm text-muted-foreground">
          Capacity figures always state what they describe:{" "}
          {Object.values(CAPACITY_DEFINITION_LABELS).join(", ")}. IT load, total facility load and
          grid-connection capacity measure different things and are never treated as equivalent or
          summed together.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="font-display text-2xl font-semibold">Forecasting rules</h2>
        <p className="text-sm text-muted-foreground">
          Forecasts are recorded against the year they describe, are labelled as forecasts wherever
          they appear, and are shown in their own table rather than alongside recorded consumption.
          A chart is only drawn when at least two genuine reporting periods have been entered and
          approved. We do not extrapolate a trend from a single observation.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="font-display text-2xl font-semibold">Update process</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Sources are checked monthly; the whole index is reviewed quarterly.</li>
          <li>Every record stores the date it was last checked and the date it is next due.</li>
          <li>
            A replacement value never overwrites history: the earlier reporting period is kept, the
            superseded figure is marked as such, and the change is logged with who made it, when,
            why and against which source.
          </li>
          <li>Superseded sources are retained and marked superseded rather than deleted.</li>
        </ul>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="font-display text-2xl font-semibold">Source categories monitored</h2>
        <p className="text-sm text-muted-foreground">
          The index draws on publications from the organisations below. Listing an organisation does
          not imply a figure has been taken from it: a source only appears in the register once its
          document title, URL and publication date have been entered and verified.
        </p>
        <ul className="grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
          {SOURCE_ORGANISATIONS.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </section>

      {data.changeLog.length > 0 ? (
        <section className="mt-10 space-y-3">
          <h2 className="font-display text-2xl font-semibold">Change history</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {data.changeLog.map((c) => (
              <li key={c.id} className="rounded-lg border border-border p-4">
                <p className="font-medium text-foreground">
                  {c.entity_type}
                  {c.field_name ? ` — ${c.field_name}` : ""}
                </p>
                <p className="mt-1">{c.reason}</p>
                {c.previous_value || c.new_value ? (
                  <p className="mt-1 text-xs">
                    Previously: {c.previous_value ?? "—"} &middot; Now: {c.new_value ?? "—"}
                  </p>
                ) : null}
                <p className="mt-1 text-xs">
                  {fmtDate(c.created_at) ?? ""}
                  {c.changed_by_label ? ` · ${c.changed_by_label}` : ""}
                  {c.methodology_version ? ` · Methodology ${c.methodology_version}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-10 space-y-3">
        <h2 className="font-display text-2xl font-semibold">Submit a correction</h2>
        <p className="text-sm text-muted-foreground">
          If you believe a figure, rating or record here is wrong, tell us. Submissions enter an
          administrator review queue and never change published data automatically.
        </p>
        <div className="pt-2">
          <CorrectionForm defaultPage="/uk-ai-energy-index" />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold">Source register</h2>
        {data.sources.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
            The source register is published alongside the first set of readings. Data not yet
            available.
          </p>
        ) : (
          <div className="mt-5 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[900px] text-left text-sm">
              <caption className="sr-only">Sources used by the UK AI Energy Index</caption>
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3">Organisation</th>
                  <th scope="col" className="px-4 py-3">Publication or dataset</th>
                  <th scope="col" className="px-4 py-3">Published</th>
                  <th scope="col" className="px-4 py-3">Indicators supported</th>
                  <th scope="col" className="px-4 py-3">Type</th>
                  <th scope="col" className="px-4 py-3">Accessed</th>
                  <th scope="col" className="px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.sources.map((s) => (
                  <tr key={s.id} className="align-top">
                    <th scope="row" className="px-4 py-3 font-medium">{s.organisation}</th>
                    <td className="px-4 py-3">
                      {s.url ? (
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-brand hover:underline"
                        >
                          {s.title}
                          <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        </a>
                      ) : (
                        s.title
                      )}
                    </td>
                    <td className="px-4 py-3">{fmtDate(s.publication_date) ?? "—"}</td>
                    <td className="px-4 py-3">{s.indicators_supported ?? "—"}</td>
                    <td className="px-4 py-3 capitalize">{s.source_type}</td>
                    <td className="px-4 py-3">{fmtDate(s.accessed_at) ?? "—"}</td>
                    <td className="px-4 py-3">{s.notes ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
