import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { MapPin, ArrowRight } from "lucide-react";
import { listDcProjects } from "@/lib/dc-projects.functions";
import { regionSlug } from "@/lib/dc-projects";

const CANONICAL = "https://aienergyintelligence.co.uk/uk-data-centre-tracker/regions";

const projectsQueryOptions = queryOptions({
  queryKey: ["dc-tracker", "published"],
  queryFn: () => listDcProjects(),
  staleTime: 5 * 60 * 1000,
});

export const Route = createFileRoute("/uk-data-centre-tracker/regions/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(projectsQueryOptions),
  errorComponent: ({ error }) => (
    <div role="alert" className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">We couldn't load the regional hubs</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">No regions found.</div>
  ),
  head: () => ({
    meta: [
      { title: "UK Data Centre Projects by Region | Regional Hubs" },
      {
        name: "description",
        content:
          "Regional summaries of verified UK data centre and AI infrastructure projects — how many are tracked in each nation and region, and what capacity has been published.",
      },
      { property: "og:title", content: "UK data centre projects by region" },
      {
        property: "og:description",
        content:
          "Browse verified UK data centre and AI infrastructure projects grouped by nation and region.",
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
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://aienergyintelligence.co.uk/" },
            {
              "@type": "ListItem",
              position: 2,
              name: "UK data-centre tracker",
              item: "https://aienergyintelligence.co.uk/uk-data-centre-tracker",
            },
            { "@type": "ListItem", position: 3, name: "Regions", item: CANONICAL },
          ],
        }),
      },
    ],
  }),
  component: RegionsPage,
});

function RegionsPage() {
  const { data: projects } = useSuspenseQuery(projectsQueryOptions);

  const groups = Array.from(
    projects.reduce((map, p) => {
      const list = map.get(p.region) ?? [];
      list.push(p);
      map.set(p.region, list);
      return map;
    }, new Map<string, typeof projects>()),
  ).sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));

  return (
    <div className="bg-background">
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <Link to="/uk-data-centre-tracker" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to the tracker
          </Link>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            UK data centre projects by region
          </h1>
          <p className="mt-4 max-w-3xl text-muted-foreground">
            Regional hubs group every verified entry in the tracker by nation and region, so you can
            see where activity is concentrated and what has actually been published about capacity
            and investment in each area.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10">
        {groups.length === 0 ? (
          <p className="text-sm text-muted-foreground">No published projects yet.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {groups.map(([region, list]) => {
              const mw = list.reduce((s, p) => s + (p.capacity_mw ?? 0), 0);
              const disclosed = list.filter((p) => p.capacity_mw !== null).length;
              return (
                <li key={region}>
                  <Link
                    to="/uk-data-centre-tracker/regions/$region"
                    params={{ region: regionSlug(region) }}
                    className="flex h-full flex-col rounded-xl border border-border bg-card p-5 transition hover:border-foreground/30 hover:shadow-sm"
                  >
                    <h2 className="flex items-center gap-2 font-semibold">
                      <MapPin className="h-4 w-4 text-muted-foreground" aria-hidden />
                      {region}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {list.length} tracked {list.length === 1 ? "project" : "projects"} ·{" "}
                      {disclosed > 0 ? `${mw.toLocaleString("en-GB")} MW disclosed` : "no capacity published"}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm underline">
                      View {region} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
