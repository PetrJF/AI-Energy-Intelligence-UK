import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { MapPin, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import { listDcProjects } from "@/lib/dc-projects.functions";
import {
  DC_STATUS_LABELS,
  DC_TYPE_LABELS,
  DC_AI_RELEVANCE_LABELS,
  labelFor,
  regionFromSlug,
  regionSlug,
} from "@/lib/dc-projects";
import { UkProjectMap } from "@/components/dc/UkProjectMap";
import { TrackerAlertBox } from "@/components/dc/TrackerEmailCapture";

const BASE = "https://aienergyintelligence.co.uk";

const projectsQueryOptions = queryOptions({
  queryKey: ["dc-tracker", "published"],
  queryFn: () => listDcProjects(),
  staleTime: 5 * 60 * 1000,
});

export const Route = createFileRoute("/uk-data-centre-tracker/regions/$region")({
  loader: async ({ context, params }) => {
    const region = regionFromSlug(params.region);
    if (!region) throw notFound();
    await context.queryClient.ensureQueryData(projectsQueryOptions);
    return { region };
  },
  errorComponent: ({ error }) => (
    <div role="alert" className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">We couldn't load this region</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">Region not found</h1>
      <Link to="/uk-data-centre-tracker/regions" className="mt-4 inline-block underline">
        Browse all regions
      </Link>
    </div>
  ),
  head: ({ loaderData, params }) => {
    const region = (loaderData as { region: string } | undefined)?.region ?? params.region;
    const url = `${BASE}/uk-data-centre-tracker/regions/${params.region}`;
    const title = `${region} Data Centre & AI Projects | UK Tracker`;
    const description = `Verified data centre and AI infrastructure projects tracked in ${region} — status, published capacity, operators and original sources.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
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
              {
                "@type": "ListItem",
                position: 3,
                name: "Regions",
                item: `${BASE}/uk-data-centre-tracker/regions`,
              },
              { "@type": "ListItem", position: 4, name: region, item: url },
            ],
          }),
        },
      ],
    };
  },
  component: RegionPage,
});

function gbp(v: number) {
  if (v >= 1e9) return `£${(v / 1e9).toLocaleString("en-GB", { maximumFractionDigits: 1 })}bn`;
  if (v >= 1e6) return `£${(v / 1e6).toLocaleString("en-GB", { maximumFractionDigits: 1 })}m`;
  return `£${v.toLocaleString("en-GB")}`;
}

function RegionPage() {
  const { region } = Route.useLoaderData();
  const { data: all } = useSuspenseQuery(projectsQueryOptions);
  const projects = all.filter((p) => p.region === region);

  const mw = projects.reduce((s, p) => s + (p.capacity_mw ?? 0), 0);
  const disclosedMw = projects.filter((p) => p.capacity_mw !== null).length;
  const investment = projects.reduce((s, p) => s + (p.investment_gbp ?? 0), 0);
  const disclosedInv = projects.filter((p) => p.investment_gbp !== null).length;
  const otherRegions = Array.from(new Set(all.map((p) => p.region))).filter((r) => r !== region).sort();

  return (
    <div className="bg-background">
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <nav className="text-sm text-muted-foreground">
            <Link to="/uk-data-centre-tracker" className="hover:text-foreground">
              Tracker
            </Link>{" "}
            /{" "}
            <Link to="/uk-data-centre-tracker/regions" className="hover:text-foreground">
              Regions
            </Link>
          </nav>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Data centre and AI projects in {region}
          </h1>
          <p className="mt-4 max-w-3xl text-muted-foreground">
            Every entry in the tracker recorded in {region}. Figures below only count what operators
            or government have actually published — projects with no disclosed capacity or
            investment are excluded from the totals rather than estimated.
          </p>
          <dl className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Tracked projects</dt>
              <dd className="mt-1 text-2xl font-semibold">{projects.length}</dd>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Disclosed capacity</dt>
              <dd className="mt-1 text-2xl font-semibold">
                {disclosedMw ? `${mw.toLocaleString("en-GB")} MW` : "Not published"}
              </dd>
              {disclosedMw > 0 && (
                <p className="mt-1 text-xs text-muted-foreground">
                  From {disclosedMw} of {projects.length} projects
                </p>
              )}
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Stated investment</dt>
              <dd className="mt-1 text-2xl font-semibold">
                {disclosedInv ? gbp(investment) : "Not published"}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10">
        {projects.length > 0 && <UkProjectMap projects={projects} />}

        <h2 className="mt-12 text-lg font-semibold">Projects in {region}</h2>
        {projects.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            No published entries for {region} yet. Entries are added by hand once a project has a
            citable public source.
          </p>
        ) : (
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {projects.map((p) => (
              <li key={p.id}>
                <Link
                  to="/uk-data-centre-tracker/$slug"
                  params={{ slug: p.slug }}
                  className="flex h-full flex-col rounded-xl border border-border bg-card p-5 transition hover:border-foreground/30 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold leading-snug">{p.name}</h3>
                    {p.verified && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                        <ShieldCheck className="h-3 w-3" aria-hidden /> Verified
                      </span>
                    )}
                  </div>
                  {p.operator && <p className="mt-1 text-sm text-muted-foreground">{p.operator}</p>}
                  <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" aria-hidden />
                    {[p.town, p.region].filter(Boolean).join(", ")}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Zap className="h-3.5 w-3.5" aria-hidden />
                    {p.capacity_mw === null
                      ? "Capacity not published"
                      : `${p.capacity_mw.toLocaleString("en-GB")} MW`}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                    <span className="rounded-full bg-muted px-2 py-0.5">
                      {labelFor(DC_STATUS_LABELS, p.status)}
                    </span>
                    <span className="rounded-full bg-muted px-2 py-0.5">
                      {labelFor(DC_TYPE_LABELS, p.project_type)}
                    </span>
                    <span className="rounded-full bg-muted px-2 py-0.5">
                      {labelFor(DC_AI_RELEVANCE_LABELS, p.ai_relevance)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-muted/30 p-6">
            <h2 className="text-base font-semibold">Related analysis and tools</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/uk-ai-energy-index" className="underline">
                  UK AI Energy Index
                </Link>{" "}
                — the indicators behind national demand.
              </li>
              <li>
                <Link to="/ai-infrastructure-tools/data-centre-impact" className="underline">
                  Data centre impact checker
                </Link>{" "}
                — model a site's local energy footprint.
              </li>
              <li>
                <Link to="/ai-energy-calculators/data-centres" className="underline">
                  Data centre energy calculator
                </Link>
              </li>
              <li>
                <Link to="/uk-grid" className="underline">
                  UK grid pressure hub
                </Link>
              </li>
              <li>
                <Link to="/blog" className="underline">
                  Analysis &amp; research
                </Link>{" "}
                — long-form pieces on data centres and demand.
              </li>
              <li>
                <Link to="/reports" className="underline">
                  Reports &amp; research library
                </Link>
              </li>
            </ul>
          </div>

          <TrackerAlertBox kind="region" region={region} />

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">Other regions</h2>
            <ul className="mt-3 flex flex-wrap gap-2 text-sm">
              {otherRegions.map((r) => (
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
            <Link
              to="/uk-data-centre-tracker/regions"
              className="mt-4 inline-flex items-center gap-1 text-sm underline"
            >
              All regional hubs <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
