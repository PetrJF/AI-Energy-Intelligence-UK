import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Zap } from "lucide-react";
import { listGrowthZones, type GrowthZone } from "@/lib/growth-zones.functions";
import { ZoneCard, gbpCompactValue } from "@/components/dc/ZoneTemplate";

const BASE = "https://aienergyintelligence.co.uk";
const URL = `${BASE}/ai-growth-zones`;
const TITLE = "UK AI Growth Zones Hub | AI Energy Intelligence UK";
const DESC =
  "Every designated UK AI Growth Zone in one place: stated investment, published power and grid detail, planning status and a sourced progress timeline.";

const zonesQueryOptions = queryOptions({
  queryKey: ["growth-zones", "list"],
  queryFn: () => listGrowthZones(),
  staleTime: 5 * 60 * 1000,
});

export const Route = createFileRoute("/ai-growth-zones/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(zonesQueryOptions),
  errorComponent: ({ error }) => (
    <div role="alert" className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">We couldn't load the growth zones</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">No growth zones found</h1>
    </div>
  ),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
            { "@type": "ListItem", position: 2, name: "AI Growth Zones", item: URL },
          ],
        }),
      },
    ],
  }),
  component: GrowthZonesHub,
});

function GrowthZonesHub() {
  const { data } = useSuspenseQuery(zonesQueryOptions);
  const zones = data as GrowthZone[];
  const totalInvestment = zones.reduce((s, z) => s + (z.investment_gbp ?? 0), 0);
  const disclosedInvestment = zones.some((z) => z.investment_gbp !== null);
  const disclosedCapacity = zones.reduce((s, z) => s + (z.capacity_mw ?? 0), 0);

  return (
    <div className="bg-background">
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <p className="text-sm text-muted-foreground">Data centres / Growth zones</p>
          <h1 className="mt-2 flex items-center gap-3 text-3xl font-semibold sm:text-4xl">
            <Zap className="h-7 w-7 text-muted-foreground" aria-hidden />
            UK AI Growth Zones
          </h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            AI Growth Zones are government-designated locations where AI data centre development is
            backed by faster planning and improved access to power. Each zone below uses the same
            template: investment, power and grid, planning and a sourced progress timeline. Figures
            are only shown where an operator or government has published them — nothing here is
            estimated.
          </p>

          <dl className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Designated zones tracked
              </dt>
              <dd className="mt-1 text-2xl font-semibold">{zones.length}</dd>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Stated investment
              </dt>
              <dd className="mt-1 text-2xl font-semibold">
                {disclosedInvestment ? gbpCompactValue(totalInvestment) : "Not published"}
              </dd>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Disclosed capacity
              </dt>
              <dd className="mt-1 text-2xl font-semibold">
                {disclosedCapacity > 0
                  ? `${disclosedCapacity.toLocaleString("en-GB")} MW`
                  : "Not published"}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-xl font-semibold">Zones</h2>
        {zones.length === 0 ? (
          <p className="mt-3 text-muted-foreground">No published zones yet.</p>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {zones.map((z) => (
              <ZoneCard key={z.id} zone={z} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-base font-semibold">Related research</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/uk-data-centre-tracker" className="underline">
                UK data-centre tracker
              </Link>{" "}
              — every tracked project, including the zones above.
            </li>
            <li>
              <Link to="/uk-data-centre-tracker/regions" className="underline">
                Regional hubs
              </Link>{" "}
              — what each nation and region has on record.
            </li>
            <li>
              <Link to="/uk-ai-energy-index" className="underline">
                UK AI Energy Index
              </Link>{" "}
              — indicators behind AI-driven electricity demand.
            </li>
            <li>
              <Link to="/ai-energy-calculators/growth-zone" className="underline">
                AI growth zone impact calculator
              </Link>{" "}
              — model the electricity implications of a zone.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
