import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import type React from "react";
import { useMemo } from "react";
import {
  Search,
  MapPin,
  Zap,
  ShieldCheck,
  Filter,
  ArrowRight,
  Building2,
  AlertCircle,
} from "lucide-react";
import type { DcProject } from "@/lib/dc-projects.functions";
import { publishedDcProjectsQueryOptions } from "@/lib/dc-projects.queries";
import { REALITY_SCORE_BANDS, hasPublishedRealityScore, realityBandClass } from "@/lib/reality-score";
import {
  DC_STATUS_LABELS,
  DC_TYPE_LABELS,
  DC_AI_RELEVANCE_LABELS,
  labelFor,
  regionSlug,
  capacityFigures,
  capacityTotal,
  CAPACITY_KIND_LABELS,
  isPhysicalFacility,
} from "@/lib/dc-projects";
import { DC_GEO_GROUPS, DC_GEO_GROUP_LABELS, geoGroupFor } from "@/lib/dc-geography";
import {
  summarise,
  summariseByRegion,
  qualityFlags,
  REVIEW_INTERVAL_DAYS,
} from "@/lib/dc-summary";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";

const CRUMBS: Crumb[] = [
  { label: "Home", to: "/" },
  { label: "UK data-centre tracker" },
];

const COVERAGE_NOTE =
  "This is an evidence-led register of projects identified from public records. It is not claimed to be a complete census of every UK data centre.";
import { UkProjectMap } from "@/components/dc/UkProjectMap";
import { TrackerCsvDownload } from "@/components/dc/TrackerEmailCapture";
import { RealPipelineSignup } from "@/components/dc/RealPipelineSignup";

const CANONICAL = "https://aienergyintelligence.co.uk/uk-data-centre-tracker";

type TrackerSearch = {
  q: string;
  region: string;
  status: string;
  ai: string;
  sort: string;
  operator: string;
  cap: string;
  band: string;
};

export const Route = createFileRoute("/uk-data-centre-tracker/")({
  validateSearch: (search: Record<string, unknown> | undefined): Partial<TrackerSearch> => ({
    q: typeof search?.q === "string" ? search?.q : "",
    region: typeof search?.region === "string" ? search?.region : "all",
    status: typeof search?.status === "string" ? search?.status : "all",
    ai: typeof search?.ai === "string" ? search?.ai : "all",
    sort: typeof search?.sort === "string" ? search?.sort : "score",
    operator: typeof search?.operator === "string" ? search?.operator : "all",
    cap: typeof search?.cap === "string" ? search?.cap : "all",
    band: typeof search?.band === "string" ? search?.band : "all",
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(publishedDcProjectsQueryOptions),
  errorComponent: ({ error }) => (
    <div role="alert" className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">We couldn't load the tracker</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">No projects found.</div>
  ),
  head: () => {
    const breadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://aienergyintelligence.co.uk/" },
        { "@type": "ListItem", position: 2, name: "UK data-centre tracker", item: CANONICAL },
      ],
    };
    const dataset = {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "UK data-centre and AI infrastructure project tracker",
      description:
        "A manually verified register of UK data centre and AI infrastructure projects, with status, location, power capacity where published, and links to the original sources.",
      url: CANONICAL,
      isAccessibleForFree: true,
      spatialCoverage: { "@type": "Place", name: "United Kingdom" },
      creator: {
        "@type": "Organization",
        name: "AI Energy Intelligence UK",
        url: "https://aienergyintelligence.co.uk",
      },
    };
    return {
      meta: [
        { title: "UK Data Centre Tracker | Projects, Capacity & Locations" },
        {
          name: "description",
          content:
            "Track operational, proposed and under-construction UK data centres, including locations, planning status, operators, capacity and supporting sources.",
        },
        { property: "og:title", content: "UK Data Centre Tracker | Projects, Capacity & Locations" },
        {
          property: "og:description",
          content:
            "Track operational, proposed and under-construction UK data centres, including locations, planning status, operators, capacity and supporting sources.",
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: CANONICAL },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: CANONICAL }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumb) },
        { type: "application/ld+json", children: JSON.stringify(dataset) },
      ],
    };
  },
  component: TrackerPage,
});

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40";

/** Labels a card capacity chip with the measurement type, never a bare MW number. */
function capacityChip(project: DcProject) {
  const f = capacityFigures(project)[0];
  if (!f) return "Capacity not published";
  const suffix =
    f.kind === "unspecified" ? "definition not published" : CAPACITY_KIND_LABELS[f.kind].replace("Published ", "");
  return `${f.mw.toLocaleString("en-GB")} MW · ${suffix}`;
}

function TrackerPage() {
  const { data: projects } = useSuspenseQuery(publishedDcProjectsQueryOptions);
  const rawSearch = Route.useSearch();
  const search = {
    q: rawSearch.q ?? "",
    region: rawSearch.region ?? "all",
    status: rawSearch.status ?? "all",
    ai: rawSearch.ai ?? "all",
    sort: rawSearch.sort ?? "score",
    operator: rawSearch.operator ?? "all",
    cap: rawSearch.cap ?? "all",
    band: rawSearch.band ?? "all",
  };
  const navigate = useNavigate({ from: "/uk-data-centre-tracker/" });

  const setSearch = (patch: Partial<TrackerSearch>) =>
    navigate({ search: (prev: Partial<TrackerSearch>) => ({ ...prev, ...patch }) });

  /** Largest comparable figure for a record. Figures whose definition is not
   *  published are ignored, so the capacity filter never uses them. */
  const comparableMw = (p: DcProject) => {
    const figs = capacityFigures(p).filter((f) => f.kind !== "unspecified");
    return figs.length ? Math.max(...figs.map((f) => f.mw)) : null;
  };

  const usedGroups = useMemo(
    () => new Set(projects.map((p) => geoGroupFor(p))),
    [projects],
  );
  const operators = useMemo(
    () =>
      Array.from(
        new Set(
          projects
            .map((p) => p.operator ?? p.developer)
            .filter((v): v is string => Boolean(v && v.trim())),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [projects],
  );
  const statuses = useMemo(
    () => Array.from(new Set(projects.map((p) => p.status))).sort(),
    [projects],
  );
  // Existing regional hub pages keep their original region names and URLs.
  const hubRegions = useMemo(
    () => Array.from(new Set(projects.map((p) => p.region))).sort(),
    [projects],
  );


  const filtered = useMemo(() => {
    const q = search?.q.trim().toLowerCase();
    let list = projects.filter((p) => {
      if (search?.region !== "all" && geoGroupFor(p) !== search?.region) return false;
      if (search?.status !== "all" && p.status !== search?.status) return false;
      if (search?.ai !== "all" && p.ai_relevance !== search?.ai) return false;
      if (search?.operator !== "all" && (p.operator ?? p.developer) !== search?.operator) return false;
      if (search?.cap !== "all") {
        const mw = comparableMw(p);
        if (search?.cap === "unknown") {
          if (mw !== null) return false;
        } else if (mw === null) {
          return false;
        } else if (search?.cap === "0-50" && mw >= 50) return false;
        else if (search?.cap === "50-200" && (mw < 50 || mw >= 200)) return false;
        else if (search?.cap === "200+" && mw < 200) return false;
      }
      if (search.band !== "all") {
        if (search.band === "not-scored") {
          if (hasPublishedRealityScore(p)) return false;
        } else if (!hasPublishedRealityScore(p) || p.rs_band !== search.band) return false;
      }
      if (!q) return true;
      return [p.name, p.operator, p.developer, p.town, p.region, p.summary, p.planning_authority]
        .filter(Boolean)
        .some((f) => String(f).toLowerCase().includes(q));
    });
    list = [...list].sort((a, b) => {
      if (search?.sort === "capacity") {
        // Sorts on published IT load only; records without one are placed last.
        const load = (p: DcProject) =>
          capacityFigures(p).find((f) => f.kind === "it_load")?.mw ?? null;
        const av = load(a);
        const bv = load(b);
        if (av === null && bv === null) return a.name.localeCompare(b.name);
        if (av === null) return 1;
        if (bv === null) return -1;
        return bv - av;
      }
      if (search.sort === "score") {
        const av = hasPublishedRealityScore(a) ? a.reality_score : null;
        const bv = hasPublishedRealityScore(b) ? b.reality_score : null;
        if (av === null && bv === null) return a.name.localeCompare(b.name);
        if (av === null) return 1;
        if (bv === null) return -1;
        return bv - av || a.name.localeCompare(b.name);
      }
      if (search?.sort === "region") return a.region.localeCompare(b.region) || a.name.localeCompare(b.name);
      if (search?.sort === "updated") return b.updated_at.localeCompare(a.updated_at);
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [projects, search]);

  // AI Growth Zones are designated areas, not facilities, so they are counted
  // and totalled separately from physical data-centre projects.
  const facilities = useMemo(() => filtered.filter((p) => isPhysicalFacility(p.project_type)), [filtered]);
  const zones = filtered.length - facilities.length;

  const itLoad = capacityTotal(facilities, "it_load");
  const gridCap = capacityTotal(facilities, "grid_connection");
  const undefinedCap = facilities.filter((p) =>
    capacityFigures(p).some((f) => f.kind === "unspecified"),
  ).length;


  const countBy = (status: string) => facilities.filter((p) => p.status === status).length;
  const evidenceVerified = facilities.filter((p) => p.evidence_backed_verified).length;
  const withPrimary = facilities.filter((p) => p.primary_source_count > 0).length;
  const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
  const recentlyChecked = facilities.filter(
    (p) => p.last_verified_at && new Date(p.last_verified_at).getTime() >= ninetyDaysAgo,
  ).length;
  const withPlanningRef = facilities.filter((p) => Boolean(p.planning_reference)).length;
  const pct = (n: number) => (facilities.length === 0 ? "—" : `${Math.round((n / facilities.length) * 100)}%`);

  const capacityLine = (
    label: string,
    t: { mw: number; withFigure: number; of: number },
  ) =>
    t.withFigure === 0
      ? `No comparable ${label.toLowerCase()} figures are available for the current selection.`
      : `${label}: ${t.mw.toLocaleString("en-GB")} MW from ${t.withFigure} of ${t.of} matching projects.`;

  return (
    <div className="bg-background">
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <Breadcrumbs items={CRUMBS} />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Infrastructure register
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            UK data-centre tracker
          </h1>
          <p className="mt-4 max-w-3xl text-muted-foreground">
            A manually verified register of UK data centre and AI infrastructure projects. Each entry
            records what has actually been published — status, location, capacity where it is stated —
            and links back to the original source. We do not estimate figures that operators have not
            disclosed; unstated fields are shown as "Not published".
          </p>
          <p className="mt-4 max-w-3xl rounded-lg border border-dashed border-border bg-background/60 p-4 text-sm text-muted-foreground">
            {COVERAGE_NOTE}
          </p>
          <TrackerCsvDownload />
          <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Data-centre projects (filtered)" value={facilities.length}>
              {zones > 0
                ? `${zones} AI Growth Zone${zones === 1 ? "" : "s"} shown separately and excluded from these totals`
                : "AI Growth Zones are counted separately"}
            </Stat>
            <Stat label="Verified with visible sources" value={evidenceVerified}>
              {`${withPrimary} carry at least one primary record (${pct(withPrimary)})`}
            </Stat>
            <Stat label="Operational / under construction" value={`${countBy("operational")} / ${countBy("under_construction")}`}>
              {`Approved ${countBy("approved")} · Proposed ${countBy("proposed") + countBy("planning_submitted")} · Refused or withdrawn ${countBy("refused") + countBy("withdrawn")}`}
            </Stat>
            <Stat label="Checked in the last 90 days" value={recentlyChecked}>
              {`${withPlanningRef} of ${facilities.length} hold a planning reference`}
            </Stat>
          </dl>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <p className="rounded-lg border border-border bg-card p-4 text-sm">
              {capacityLine("Published IT load", itLoad)}
            </p>
            <p className="rounded-lg border border-border bg-card p-4 text-sm">
              {capacityLine("Published grid-connection capacity", gridCap)}
            </p>
          </div>
          {undefinedCap > 0 && (
            <p className="mt-3 max-w-3xl text-xs text-muted-foreground">
              {undefinedCap} matching project{undefinedCap === 1 ? " reports a" : "s report"} megawatt
              figure{undefinedCap === 1 ? "" : "s"} whose definition the source does not state. Those
              figures are shown on the project profile but excluded from every total.
            </p>
          )}
          <p className="mt-3 max-w-3xl text-xs text-muted-foreground">
            A missing capacity figure means none has been published. It does not mean zero.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <TrackerIntro />

        <div className="mt-10 rounded-xl border border-border bg-card p-4 sm:p-6">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Filter className="h-4 w-4" aria-hidden />
            Filter and search
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="lg:col-span-2">
              <span className="sr-only">Search projects</span>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <input
                  className={`${inputClass} pl-9`}
                  placeholder="Search by name, operator or town"
                  value={search?.q}
                  onChange={(e) => setSearch({ q: e.target.value })}
                />
              </div>
            </label>
            <label>
              <span className="sr-only">Region</span>
              <select
                className={inputClass}
                value={search?.region}
                onChange={(e) => setSearch({ region: e.target.value })}
              >
                <option value="all">All regions</option>
                {DC_GEO_GROUPS.filter((g) => usedGroups.has(g.key)).map((g) => (
                  <option key={g.key} value={g.key}>
                    {g.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="sr-only">Reality Score band</span>
              <select className={inputClass} value={search.band} onChange={(e) => setSearch({ band: e.target.value })}>
                <option value="all">All score bands</option>
                {REALITY_SCORE_BANDS.map((band) => <option key={band} value={band}>{band}</option>)}
                <option value="not-scored">Not yet scored</option>
              </select>
            </label>
            <label>
              <span className="sr-only">Status</span>
              <select
                className={inputClass}
                value={search?.status}
                onChange={(e) => setSearch({ status: e.target.value })}
              >
                <option value="all">All statuses</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {labelFor(DC_STATUS_LABELS, s)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="sr-only">AI relevance</span>
              <select
                className={inputClass}
                value={search?.ai}
                onChange={(e) => setSearch({ ai: e.target.value })}
              >
                <option value="all">Any AI relevance</option>
                {Object.entries(DC_AI_RELEVANCE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="sr-only">Operator or developer</span>
              <select
                className={inputClass}
                value={search?.operator}
                onChange={(e) => setSearch({ operator: e.target.value })}
              >
                <option value="all">Any operator or developer</option>
                {operators.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="sr-only">Capacity range</span>
              <select
                className={inputClass}
                value={search?.cap}
                onChange={(e) => setSearch({ cap: e.target.value })}
              >
                <option value="all">Any capacity</option>
                <option value="0-50">Under 50 MW</option>
                <option value="50-200">50 to 200 MW</option>
                <option value="200+">200 MW and above</option>
                <option value="unknown">Capacity not published</option>
              </select>
            </label>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            The capacity filter uses the largest published figure whose measurement the source
            defines — an IT load, a stated electrical demand, a grid-connection capacity or a campus
            build-out figure. Megawatt figures with no published definition are treated as unknown.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>Sort by</span>
            {[
              { k: "name", label: "Name" },
              { k: "capacity", label: "Published IT load" },
              { k: "region", label: "Region" },
              { k: "updated", label: "Recently updated" },
              { k: "score", label: "Highest score" },
            ].map((o) => (
              <button
                key={o.k}
                type="button"
                onClick={() => setSearch({ sort: o.k })}
                className={`rounded-full border px-3 py-1 text-xs ${
                  search?.sort === o.k
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:bg-muted"
                }`}
              >
                {o.label}
              </button>
            ))}
            {(search?.q ||
              search?.region !== "all" ||
              search?.status !== "all" ||
              search?.ai !== "all" ||
              search?.operator !== "all" ||
              search?.cap !== "all" || search.band !== "all") && (
              <button
                type="button"
                className="ml-auto text-xs underline"
                onClick={() =>
                  setSearch({
                    q: "",
                    region: "all",
                    status: "all",
                    ai: "all",
                    operator: "all",
                    cap: "all",
                    band: "all",
                  })
                }
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {filtered.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold">Where these projects are</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Markers reflect your current filters. Select one to see the project and open its full
              profile.
            </p>
            <div className="mt-4">
              <UkProjectMap projects={filtered} />
            </div>
          </div>
        )}

        <TrackerTotals projects={projects} />

        <RegionGroupSummaries projects={projects} />

        <NationSummaries projects={projects} />

        <DataQualityPanel projects={projects} />

        <div className="mt-10 rounded-xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Regional hubs</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Summaries of tracked projects, disclosed capacity and stated investment by nation and
            region.
          </p>
          <ul className="mt-3 flex flex-wrap gap-2 text-sm">
            {hubRegions.map((r) => (
              <li key={r}>
                <Link
                  to="/uk-data-centre-tracker/regions/$region"
                  params={{ region: regionSlug(r) }}
                  className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 hover:bg-muted"
                >
                  {r}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/uk-data-centre-tracker/regions" className="mt-4 inline-flex items-center gap-1 text-sm underline">
            All regional hubs <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>

        <div className="mt-4 rounded-xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">AI Growth Zones</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Government-designated zones get a dedicated profile covering investment, power and grid,
            planning and a sourced progress timeline.
          </p>
          <Link to="/ai-growth-zones" className="mt-4 inline-flex items-center gap-1 text-sm underline">
            Open the Growth Zones hub <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>


        <p className="mt-6 text-sm text-muted-foreground">
          Showing {filtered.length} of {projects.length} projects
        </p>

        {projects.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-border p-10 text-center">
            <AlertCircle className="mx-auto h-6 w-6 text-muted-foreground" aria-hidden />
            <p className="mt-3 font-medium">No projects published yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Entries are added by hand once a project has a citable public source.
            </p>
          </div>
        ) : (
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {filtered.map((p) => (
              <li key={p.id}>
                <ProjectCard project={p} />
              </li>
            ))}
          </ul>
        )}

        <div className="mt-12 rounded-xl border border-border bg-muted/30 p-6">
          <h2 className="text-lg font-semibold">How this register is compiled</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Every project is entered manually from a named public source — a planning portal record, an
            operator announcement or an official statistic. Confidence levels flag how firm the detail
            is, and figures that have never been published stay blank rather than being estimated. See
            our{" "}
            <Link to="/research-methodology" className="underline">
              research methodology
            </Link>{" "}
            and{" "}
            <Link to="/corrections" className="underline">
              corrections policy
            </Link>
            .
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link to="/uk-ai-energy-index" className="inline-flex items-center gap-1 underline">
              UK AI Energy Index <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
            <Link to="/ai-infrastructure-tools/data-centre-impact" className="inline-flex items-center gap-1 underline">
              Data centre impact checker <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
            <Link to="/reports" className="inline-flex items-center gap-1 underline">
              Reports & research <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
        <div className="mt-12 -mx-4 sm:-mx-6"><RealPipelineSignup /></div>
      </section>
    </div>
  );
}

/** Static, server-rendered explainer so the tracker's scope and status
 *  definitions are crawlable without any filter interaction. */
function TrackerIntro() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <h2 className="text-lg font-semibold">About the UK data-centre tracker</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        The tracker is a register of UK data-centre and AI infrastructure projects compiled by hand.
        Each record holds the project name, operator where published, town and region, planning
        status, planning authority and reference where one exists, any published capacity figure with
        the measurement it refers to, and links to the documents the entry is based on.
      </p>
      <h3 className="mt-5 text-sm font-semibold">How projects are selected</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        A project is added only when it can be evidenced from a named public source — a local planning
        portal record, a government announcement, an official statistic or an operator&rsquo;s own
        published statement. Projects reported only through unattributed rumour are not added, and
        figures that have never been published are left blank rather than estimated.
      </p>
      <h3 className="mt-5 text-sm font-semibold">What the status labels mean</h3>
      <dl className="mt-2 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
        <div>
          <dt className="font-medium text-foreground">Operational</dt>
          <dd>The facility is built and in service according to its operator or an official record.</dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">Under construction</dt>
          <dd>Construction has started on site and this has been publicly reported or documented.</dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">Approved</dt>
          <dd>
            Planning permission or an equivalent consent has been granted, but construction has not
            been confirmed as started.
          </dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">Proposed</dt>
          <dd>
            The project has been announced or an application has been submitted, and no decision has
            been recorded.
          </dd>
        </div>
      </dl>
      <h3 className="mt-5 text-sm font-semibold">How often records are checked</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Records are reviewed by hand and each entry shows the date it was last verified. Projects with
        live planning applications are revisited more often than settled operational sites. The
        &ldquo;checked in the last 90 days&rdquo; figure above shows how much of the register has been
        reviewed recently.
      </p>
      <h3 className="mt-5 text-sm font-semibold">Reporting a correction</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        If a record is wrong or out of date, tell us and we will check it against the source. See the{" "}
        <Link to="/corrections" className="underline">
          corrections policy
        </Link>{" "}
        or read the{" "}
        <Link to="/research-methodology" className="underline">
          research methodology
        </Link>
        . For the electricity side of this picture, see the{" "}
        <Link to="/uk-ai-energy-index/electricity-demand" className="underline">
          UK data-centre electricity demand
        </Link>{" "}
        evidence and the{" "}
        <Link to="/uk-ai-energy-index" className="underline">
          UK AI Energy Index
        </Link>
        .
      </p>
    </div>
  );
}

const NATIONS: { name: string; regions: (r: string) => boolean }[] = [
  {
    name: "England",
    regions: (r) => !["Wales", "Scotland", "Northern Ireland", "Unknown"].includes(r),
  },
  { name: "Scotland", regions: (r) => r === "Scotland" },
  { name: "Wales", regions: (r) => r === "Wales" },
  { name: "Northern Ireland", regions: (r) => r === "Northern Ireland" },
];

/** Crawlable per-nation counts drawn from the full register, independent of
 *  the filter state above. */
function NationSummaries({ projects }: { projects: DcProject[] }) {
  return (
    <div className="mt-10 rounded-xl border border-border bg-card p-5">
      <h2 className="text-lg font-semibold">UK data centres by nation</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Counts cover every published record in the tracker, not the filtered selection above.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {NATIONS.map((nation) => {
          const rows = projects.filter(
            (p) => isPhysicalFacility(p.project_type) && nation.regions(p.region),
          );
          const count = (status: string) => rows.filter((p) => p.status === status).length;
          const load = capacityTotal(rows, "it_load");
          return (
            <section key={nation.name} className="rounded-lg border border-border p-4">
              <h3 className="font-semibold">{nation.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {rows.length === 0
                  ? "No data-centre projects are recorded in the tracker for this nation yet."
                  : `${rows.length} tracked data-centre project${rows.length === 1 ? "" : "s"}: ` +
                    `${count("operational")} operational, ${count("under_construction")} under construction, ` +
                    `${count("approved")} approved and ${count("proposed") + count("planning_submitted")} proposed.`}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {load.withFigure === 0
                  ? "No published IT load figures are available for these projects."
                  : `${load.mw.toLocaleString("en-GB")} MW of published IT load across ${load.withFigure} of ${load.of} projects.`}
              </p>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  children,
}: {
  label: string;
  value: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold">{value}</dd>
      {children && <p className="mt-1 text-xs text-muted-foreground">{children}</p>}
    </div>
  );
}

function ProjectCard({ project }: { project: DcProject }) {
  const scored = hasPublishedRealityScore(project);
  return (
    <Link
      to="/uk-data-centre-tracker/$slug"
      params={{ slug: project.slug }}
      className="flex h-full flex-col rounded-xl border border-border bg-card p-5 transition hover:border-foreground/30 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold leading-snug">{project.name}</h3>
        {scored ? (
          <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${realityBandClass(project.rs_band)}`}>
            {project.reality_score}/100 · {project.rs_band}
          </span>
        ) : project.evidence_backed_verified ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3 w-3" aria-hidden /> Verified
          </span>
        ) : null}
      </div>
      {project.operator && (
        <p className="mt-1 text-sm text-muted-foreground">{project.operator}</p>
      )}
      <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="h-3.5 w-3.5" aria-hidden />
        {[project.town, project.region].filter(Boolean).join(", ")}
      </p>
      <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
        <span className="rounded-full bg-muted px-2 py-0.5">
          {labelFor(DC_STATUS_LABELS, project.status)}
        </span>
        <span className="rounded-full bg-muted px-2 py-0.5">
          {labelFor(DC_TYPE_LABELS, project.project_type)}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
          <Zap className="h-3 w-3" aria-hidden /> {capacityChip(project)}
        </span>
      </div>
      {!scored && <p className="mt-3 text-xs font-medium text-muted-foreground">Reality Score: Not yet scored</p>}
      {project.summary && (
        <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{project.summary}</p>
      )}
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium">
        <Building2 className="h-4 w-4" aria-hidden /> View project
        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </span>
    </Link>
  );
}

const STATUS_ORDER = [
  "operational",
  "under_construction",
  "approved",
  "planning_submitted",
  "proposed",
  "refused",
  "withdrawn",
  "paused",
  "expansion",
];

function mw(n: number) {
  return `${n.toLocaleString("en-GB")} MW`;
}

/** Calculated totals for the whole published register, independent of filters. */
function TrackerTotals({ projects }: { projects: DcProject[] }) {
  const s = summarise(projects);
  const collapsed = Array.from(
    new Set([
      ...s.operationalItLoad.collapsed,
      ...s.pipelineItLoad.collapsed,
    ]),
  );
  return (
    <div className="mt-10 rounded-xl border border-border bg-card p-5">
      <h2 className="text-lg font-semibold">Tracker totals</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Totals for the {s.total} data-centre project{s.total === 1 ? "" : "s"} recorded in this
        tracker. They are not totals for the whole UK: the register covers projects we have been able
        to evidence from public records.
        {s.zones > 0
          ? ` ${s.zones} AI Growth Zone${s.zones === 1 ? " is" : "s are"} designated areas rather than facilities and are excluded from these figures.`
          : ""}
      </p>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STATUS_ORDER.filter((st) => (s.byStatus[st] ?? 0) > 0).map((st) => (
          <div key={st} className="rounded-lg border border-border p-3">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              {labelFor(DC_STATUS_LABELS, st)}
            </dt>
            <dd className="mt-1 text-2xl font-semibold">{s.byStatus[st]}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <p className="rounded-lg border border-border p-4 text-sm">
          <span className="font-medium">Known operational capacity: </span>
          {s.operationalItLoad.records === 0
            ? "no operational project in the tracker has a published IT load figure."
            : `${mw(s.operationalItLoad.mw)} of published IT load across ${s.operationalItLoad.records} of ${s.operationalItLoad.of} operational projects.`}
          {s.operationalDemand.records > 0 && (
            <>
              {" "}
              A separate {mw(s.operationalDemand.mw)} of stated total electrical demand is published
              for {s.operationalDemand.records} operational project
              {s.operationalDemand.records === 1 ? "" : "s"}; the two measures are not added together.
            </>
          )}
        </p>
        <p className="rounded-lg border border-border p-4 text-sm">
          <span className="font-medium">Known pipeline capacity: </span>
          {s.pipelineItLoad.records === 0
            ? "no project awaiting construction has a published IT load figure."
            : `${mw(s.pipelineItLoad.mw)} of published IT load across ${s.pipelineItLoad.records} pipeline projects.`}
          {s.pipelineItLoadByStatus.length > 0 && (
            <>
              {" "}
              By stage:{" "}
              {s.pipelineItLoadByStatus
                .map((r) => `${labelFor(DC_STATUS_LABELS, r.status).toLowerCase()} ${mw(r.total.mw)}`)
                .join(", ")}
              .
            </>
          )}
        </p>
      </div>
      <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
        <li>
          {s.noUsableCapacity} of {s.total} records have no capacity figure that can be used in a
          total. A missing figure means none has been published; it is not zero and it is excluded
          from every sum.
        </li>
        <li>
          Only figures measuring the same thing are added together. IT load, stated electrical
          demand, grid-connection capacity and whole-campus build-out figures are kept apart.
          {s.unspecifiedCapacity > 0 &&
            ` ${s.unspecifiedCapacity} record${s.unspecifiedCapacity === 1 ? " reports a megawatt figure" : "s report megawatt figures"} with no published definition, so they are excluded.`}
        </li>
        {collapsed.length > 0 && (
          <li>
            Where a campus and its individual phases are both recorded, only the largest published
            figure is counted so nothing is double-counted: {collapsed.join(", ")}.
          </li>
        )}
      </ul>
    </div>
  );
}

/** Project counts and comparable capacity by geographic grouping. */
function RegionGroupSummaries({ projects }: { projects: DcProject[] }) {
  const rows = summariseByRegion(projects).sort((a, b) => b.count - a.count);
  return (
    <div className="mt-10 rounded-xl border border-border bg-card p-5">
      <h2 className="text-lg font-semibold">Projects by area</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Each project is counted in one area only. Slough and the Thames Valley is counted separately
        from the rest of South East England, so the two do not overlap.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th scope="col" className="py-2 pr-3">Area</th>
              <th scope="col" className="py-2 pr-3">Projects</th>
              <th scope="col" className="py-2 pr-3">Operational</th>
              <th scope="col" className="py-2 pr-3">Pipeline</th>
              <th scope="col" className="py-2">Published IT load</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const pipeline =
                (r.byStatus["under_construction"] ?? 0) +
                (r.byStatus["approved"] ?? 0) +
                (r.byStatus["planning_submitted"] ?? 0) +
                (r.byStatus["proposed"] ?? 0);
              return (
                <tr key={r.group} className="border-t border-border">
                  <th scope="row" className="py-2 pr-3 font-medium">
                    {DC_GEO_GROUP_LABELS[r.group]}
                  </th>
                  <td className="py-2 pr-3">{r.count}</td>
                  <td className="py-2 pr-3">{r.byStatus["operational"] ?? 0}</td>
                  <td className="py-2 pr-3">{pipeline}</td>
                  <td className="py-2">
                    {r.itLoad.records === 0
                      ? "Not published"
                      : `${mw(r.itLoad.mw)} (${r.itLoad.records} of ${r.count})`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Capacity columns show published IT load only, and only where a figure exists. Projects whose
        location has not been confirmed are grouped under &ldquo;Region not confirmed&rdquo; rather
        than being assigned to an area.
      </p>
    </div>
  );
}

/** Coverage and data-quality note: what is missing and what needs review. */
function DataQualityPanel({ projects }: { projects: DcProject[] }) {
  const facilities = projects.filter((p) => isPhysicalFacility(p.project_type));
  const f = qualityFlags(facilities);
  return (
    <div className="mt-4 rounded-xl border border-border bg-card p-5">
      <h2 className="text-lg font-semibold">Coverage and data quality</h2>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        <li>
          <span className="font-medium text-foreground">Sources: </span>
          {f.missingSources.length === 0
            ? "every tracked project carries at least one linked public source."
            : `${f.missingSources.length} of ${facilities.length} records have no linked source yet and are queued for evidence.`}
        </li>
        <li>
          <span className="font-medium text-foreground">Verification: </span>
          {f.neverVerified.length} record{f.neverVerified.length === 1 ? " has" : "s have"} not yet
          been verified against a source. That is different from a field being marked &ldquo;not
          publicly available&rdquo;, which means the information has been looked for and does not
          exist in public records.
        </li>
        <li>
          <span className="font-medium text-foreground">Review interval: </span>
          records are re-checked at least every {REVIEW_INTERVAL_DAYS} days.{" "}
          {f.overdueReview.length === 0
            ? "No record is currently past that interval."
            : `${f.overdueReview.length} record${f.overdueReview.length === 1 ? " is" : "s are"} past it and flagged for review; their verification dates are left unchanged until a person re-checks them.`}
        </li>
        <li>
          <span className="font-medium text-foreground">Capacity definitions: </span>
          {f.unspecifiedCapacity.length === 0
            ? "every published megawatt figure states what it measures."
            : `${f.unspecifiedCapacity.length} record${f.unspecifiedCapacity.length === 1 ? " carries a" : "s carry"} megawatt figure${f.unspecifiedCapacity.length === 1 ? "" : "s"} the source does not define. They are shown on the project profile but excluded from totals.`}
        </li>
        <li>
          <span className="font-medium text-foreground">Possible duplicates: </span>
          {f.possibleDuplicates.length === 0
            ? "no records currently look like duplicates of one another."
            : `${f.possibleDuplicates.length} group${f.possibleDuplicates.length === 1 ? " is" : "s are"} flagged for human review. Flagged records stay published until a person confirms whether they are the same project.`}
        </li>
      </ul>
    </div>
  );
}
