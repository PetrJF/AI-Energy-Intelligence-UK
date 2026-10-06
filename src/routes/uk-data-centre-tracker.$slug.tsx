import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, MapPin, ShieldCheck, Zap, CalendarClock, Activity } from "lucide-react";
import { getDcProject, type DcProject, type DcProjectWithSignals, type DcSignal } from "@/lib/dc-projects.functions";
import {
  DC_STATUS_LABELS,
  DC_TYPE_LABELS,
  DC_AI_RELEVANCE_LABELS,
  DC_CONFIDENCE_LABELS,
  CAPACITY_KIND_LABELS,
  CAPACITY_KIND_NOTES,
  capacityFigures,
  labelFor,
  regionSlug,
} from "@/lib/dc-projects";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { TrackerAlertBox } from "@/components/dc/TrackerEmailCapture";
import { hasPublishedRealityScore, realityBandClass } from "@/lib/reality-score";

const BASE = "https://aienergyintelligence.co.uk";

const projectQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["dc-tracker", "project", slug],
    queryFn: () => getDcProject({ data: { slug } }),
    staleTime: 5 * 60 * 1000,
  });

export const Route = createFileRoute("/uk-data-centre-tracker/$slug")({
  loader: async ({ context, params }) => {
    const project = await context.queryClient.ensureQueryData(projectQueryOptions(params.slug));
    if (!project) throw notFound();
    return project;
  },
  errorComponent: ({ error }) => (
    <div role="alert" className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">We couldn't load this project</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">Project not found</h1>
      <p className="mt-2 text-muted-foreground">
        This entry may have been withdrawn or renamed.
      </p>
      <Link to="/uk-data-centre-tracker" className="mt-4 inline-block underline">
        Back to the tracker
      </Link>
    </div>
  ),
  head: ({ loaderData, params }) => {
    const p = loaderData as DcProject | undefined;
    const url = `${BASE}/uk-data-centre-tracker/${params.slug}`;
    const title = p ? `${p.name} — UK data centre project profile` : "UK data centre project";
    const description = p
      ? (p.summary ??
        `Verified profile of ${p.name}${p.operator ? ` by ${p.operator}` : ""} in ${p.region}: status, capacity and published sources.`
        ).slice(0, 155)
      : "Verified UK data centre project profile.";
    const scripts = p
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Place",
              name: p.name,
              url,
              description: p.summary ?? undefined,
              address: {
                "@type": "PostalAddress",
                addressLocality: p.town ?? undefined,
                addressRegion: p.region,
                addressCountry: "GB",
              },
              ...(p.latitude !== null && p.longitude !== null
                ? { geo: { "@type": "GeoCoordinates", latitude: p.latitude, longitude: p.longitude } }
                : {}),
            }),
          },
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "UK data-centre tracker",
                  item: `${BASE}/uk-data-centre-tracker`,
                },
                { "@type": "ListItem", position: 3, name: p.name, item: url },
              ],
            }),
          },
        ]
      : [];
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts,
    };
  },
  component: ProjectPage,
});

function value(v: string | number | null, suffix = "") {
  if (v === null || v === undefined || v === "") return "Not published";
  return typeof v === "number" ? `${v.toLocaleString("en-GB")}${suffix}` : v;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border py-3 last:border-0 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">{children}</dd>
    </div>
  );
}

const SIGNAL_TYPE_LABELS: Record<string, string> = {
  job_post: "Job post",
  tender: "Tender",
  contract_award: "Contract award",
  supplier_registration: "Supplier registration",
  permit: "Environmental permit",
  planning_application: "Planning application",
  pre_application: "Pre-application",
  grid: "Grid / power",
  company_filing: "Company filing",
  other: "Signal",
};

const LINK_CONFIDENCE_LABELS: Record<string, string> = {
  named_in_post: "Project named in source",
  likely: "Likely linked",
  unconfirmed: "Link unconfirmed",
};

function formatDate(d: string | null) {
  if (!d) return null;
  return new Date(`${d}T12:00:00Z`).toLocaleDateString("en-GB");
}

function SignalsSection({ signals }: { signals: DcSignal[] }) {
  if (signals.length === 0) return null;
  return (
    <section aria-labelledby="signals-heading" className="mt-10">
      <h2 id="signals-heading" className="inline-flex items-center gap-2 text-lg font-semibold">
        <Activity className="h-4 w-4" aria-hidden /> Activity signals
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Hiring, planning, permit, grid and procurement activity linked to this project. Signals
        indicate activity; on their own they do not prove permission, funding, a secured grid
        connection, construction or capacity, and they do not affect the Reality Score.
      </p>
      <ul className="mt-3 space-y-3">
        {signals.map((s) => (
          <li key={s.id} className="rounded-lg border border-dashed border-border bg-card p-4 text-sm">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-muted px-2.5 py-1">
                {SIGNAL_TYPE_LABELS[s.signal_type] ?? "Signal"}
              </span>
              <span className="rounded-full border border-border px-2.5 py-1">
                {LINK_CONFIDENCE_LABELS[s.link_confidence] ?? "Link unconfirmed"}
              </span>
              <span className="rounded-full border border-dashed border-border px-2.5 py-1">
                {s.source_class === "primary" ? "Primary record" : "Secondary source"}
              </span>
            </div>
            <a
              href={s.source_url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="mt-2 inline-flex items-center gap-1 font-medium underline"
            >
              {s.organisation}: {s.title}
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
            <p className="mt-1 text-xs text-muted-foreground">
              {[
                s.source_platform,
                s.reference,
                s.location,
                s.event_date ? `event ${formatDate(s.event_date)}` : null,
                s.listed_date ? `published ${formatDate(s.listed_date)}` : null,
                `observed ${formatDate(s.observed_date)}`,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
            {s.extract && (
              <blockquote className="mt-2 border-l-2 border-border pl-3 text-muted-foreground">
                &ldquo;{s.extract}&rdquo;
              </blockquote>
            )}
            {s.indicates && (
              <p className="mt-2">
                <span className="font-medium">Indicates:</span> {s.indicates}
              </p>
            )}
            {s.does_not_indicate && (
              <p className="mt-1 text-muted-foreground">
                <span className="font-medium text-foreground">Does not show:</span>{" "}
                {s.does_not_indicate}
              </p>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-muted-foreground">
        Job-advert dates can reflect reposted listings.
      </p>
    </section>
  );
}

function ProjectPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(projectQueryOptions(slug));
  const p = data as DcProjectWithSignals;
  const signals = p.signals ?? [];
  const figures = capacityFigures(p);
  const scorePublished = hasPublishedRealityScore(p);
  const crumbs: Crumb[] = [
    { label: "Home", to: "/" },
    { label: "UK data-centre tracker", to: "/uk-data-centre-tracker" },
    { label: p.name },
  ];

  return (
    <div className="bg-background">
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <Breadcrumbs items={crumbs} />
          <Link
            to="/uk-data-centre-tracker"
            className="mt-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to the tracker
          </Link>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">{p.name}</h1>
          {p.operator && <p className="mt-1 text-muted-foreground">{p.operator}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
              <MapPin className="h-3 w-3" aria-hidden />
              {[p.town, p.region].filter(Boolean).join(", ")}
            </span>
            <span className="rounded-full bg-muted px-2.5 py-1">
              {labelFor(DC_STATUS_LABELS, p.status)}
            </span>
            <span className="rounded-full bg-muted px-2.5 py-1">
              {labelFor(DC_TYPE_LABELS, p.project_type)}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
              <Zap className="h-3 w-3" aria-hidden />
              {figures.length === 0
                ? "Capacity not published"
                : `${figures[0]!.mw.toLocaleString("en-GB")} MW ${
                    figures[0]!.kind === "unspecified" ? "(definition not published)" : `(${CAPACITY_KIND_LABELS[figures[0]!.kind].replace("Published ", "")})`
                  }`}
            </span>
            {p.evidence_backed_verified ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1">
                <ShieldCheck className="h-3 w-3" aria-hidden /> Verified — {p.all_sources.length}{" "}
                source{p.all_sources.length === 1 ? "" : "s"} on file
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2.5 py-1">
                Provisional — evidence incomplete
              </span>
            )}
          </div>
          {p.summary && <p className="mt-6 max-w-3xl text-muted-foreground">{p.summary}</p>}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10">
        <section className="mb-10 rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Reality Score</p>
              {scorePublished ? (
                <div className="mt-2 flex items-end gap-3">
                  <span className="font-display text-5xl font-bold">{p.reality_score}</span>
                  <span className={`mb-1 rounded-full border px-3 py-1 text-sm font-semibold ${realityBandClass(p.rs_band)}`}>{p.rs_band}</span>
                </div>
              ) : <p className="mt-2 text-xl font-semibold">Not yet scored</p>}
            </div>
            <Link to="/reality-score" className="text-sm font-semibold text-brand underline underline-offset-2">How we score</Link>
          </div>
          {scorePublished && (
            <>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  ["Planning", p.rs_planning, 25], ["Grid connection", p.rs_grid, 25],
                  ["Land and funding", p.rs_land_funding, 20], ["Delivery team", p.rs_team, 15],
                  ["Momentum", p.rs_momentum, 15],
                ].map(([label, points, maximum]) => {
                  const score = typeof points === "number" ? points : 0;
                  return <div key={String(label)}><div className="flex justify-between text-sm"><span>{label}</span><span className="font-mono">{score}/{maximum}</span></div><div className="mt-1 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-brand" style={{ width: `${Math.min(100, (score / Number(maximum)) * 100)}%` }} /></div></div>;
                })}
              </div>
              <p className="mt-5 text-xs text-muted-foreground">Scored {p.rs_scored_at ? new Date(`${p.rs_scored_at}T12:00:00Z`).toLocaleDateString("en-GB") : "date not published"}.</p>
            </>
          )}
        </section>
        <h2 className="text-lg font-semibold">Project detail</h2>
        <dl className="mt-3 rounded-xl border border-border bg-card px-5">
          <Row label="Operator / developer">{value(p.operator)}</Row>
          <Row label="Location">{value([p.town, p.region, p.country].filter(Boolean).join(", "))}</Row>
          <Row label="Status">{labelFor(DC_STATUS_LABELS, p.status)}</Row>
          <Row label="AI relevance">{labelFor(DC_AI_RELEVANCE_LABELS, p.ai_relevance)}</Row>
          <Row label="Announced">{value(p.announced_date)}</Row>
          <Row label="Target live date">{value(p.target_live_date)}</Row>
          <Row label="Published capacity">
            {figures.length === 0 ? (
              <span>
                Not published.{" "}
                <span className="text-muted-foreground">
                  No capacity figure means none has been published — it does not mean zero.
                </span>
              </span>
            ) : (
              <ul className="space-y-2">
                {figures.map((f) => (
                  <li key={f.kind}>
                    <span className="font-medium">{f.mw.toLocaleString("en-GB")} MW</span>{" "}
                    &mdash; {CAPACITY_KIND_LABELS[f.kind]}
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {CAPACITY_KIND_NOTES[f.kind]}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Row>
          <Row label="Floor area">{value(p.floor_area_sqm, " m²")}</Row>
          <Row label="Stated investment">
            {p.investment_gbp === null ? "Not published" : `£${p.investment_gbp.toLocaleString("en-GB")}`}
          </Row>
          <Row label="Power">{value(p.power_notes)}</Row>
          <Row label="Grid connection">{value(p.grid_connection_notes)}</Row>
          <Row label="Cooling">{value(p.cooling_notes)}</Row>
          <Row label="Water">{value(p.water_notes)}</Row>
          <Row label="Planning authority">{value(p.planning_authority)}</Row>
          <Row label="Planning reference">{value(p.planning_reference)}</Row>
          <Row label="Planning decision">{value(p.planning_decision)}</Row>
          <Row label="Decision date">{value(p.decision_date)}</Row>
          <Row label="Construction start">{value(p.construction_start_date)}</Row>
          <Row label="Expected completion">
            {p.expected_operational_date
              ? `${p.expected_operational_date} — developer target, not independently confirmed`
              : "Not published"}
          </Row>
          <Row label="Operational since">{value(p.actual_operational_date)}</Row>
          <Row label="Confidence">{labelFor(DC_CONFIDENCE_LABELS, p.confidence_level)}</Row>
          <Row label="Last verified">{value(p.last_verified_at)}</Row>
        </dl>

        {p.key_facts.length > 0 && (
          <>
            <h2 className="mt-10 text-lg font-semibold">Key facts</h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {p.key_facts.map((f, i) => (
                <li key={i} className="rounded-lg border border-border bg-card p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{f.label}</p>
                  <p className="mt-1 text-sm font-medium">{f.value}</p>
                </li>
              ))}
            </ul>
          </>
        )}

        <SignalsSection signals={signals} />

        <h2 className="mt-10 text-lg font-semibold">Sources</h2>
        {p.all_sources.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            No public source is recorded for this entry yet, so it is held as a provisional record
            and is not marked verified.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {p.all_sources.map((s, i) => (
              <li key={i} className="rounded-lg border border-border bg-card p-4 text-sm">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium underline"
                >
                  {s.title}
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </a>
                <p className="mt-1 text-xs text-muted-foreground">
                  {[
                    s.sourceClass === "primary" ? "Primary record" : "Secondary source",
                    s.publisher,
                    s.date,
                    s.accessedAt ? `accessed ${s.accessedAt}` : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarClock className="h-3.5 w-3.5" aria-hidden />
          Entry last updated {new Date(p.updated_at).toLocaleDateString("en-GB")}. Spotted something
          wrong?{" "}
          <Link to="/corrections" className="underline">
            Tell us
          </Link>
          .
        </p>

        <div className="mt-10 rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold">{p.region} in context</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            See every tracked project in {p.region}, the capacity that has been disclosed there and
            how it connects to wider UK demand.
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link
              to="/uk-data-centre-tracker/regions/$region"
              params={{ region: regionSlug(p.region) }}
              className="underline"
            >
              {p.region} regional hub
            </Link>
            <Link to="/uk-data-centre-tracker/regions" className="underline">
              All regions
            </Link>
            {p.project_type === "growth_zone" && (
              <Link to="/ai-growth-zones/$slug" params={{ slug: p.slug }} className="underline">
                Growth zone profile
              </Link>
            )}

            <Link to="/blog" className="underline">
              Analysis &amp; research
            </Link>
            <Link to="/reports" className="underline">
              Reports library
            </Link>
          </div>
        </div>

        <TrackerAlertBox kind="project" projectSlug={p.slug} projectName={p.name} />

        <div className="mt-6 rounded-xl border border-border bg-muted/30 p-6">
          <h2 className="text-base font-semibold">Related tools</h2>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link to="/ai-infrastructure-tools/data-centre-impact" className="underline">
              Data centre impact checker
            </Link>
            <Link to="/ai-energy-calculators/data-centres" className="underline">
              Data centre energy calculator
            </Link>
            <Link to="/uk-ai-energy-index" className="underline">
              UK AI Energy Index
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
