import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, ShieldCheck } from "lucide-react";
import { getGrowthZone, type GrowthZone } from "@/lib/growth-zones.functions";
import { ZoneProfile } from "@/components/dc/ZoneTemplate";

const BASE = "https://aienergyintelligence.co.uk";

const zoneQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["growth-zones", "zone", slug],
    queryFn: () => getGrowthZone({ data: { slug } }),
    staleTime: 5 * 60 * 1000,
  });

export const Route = createFileRoute("/ai-growth-zones/$slug")({
  loader: async ({ context, params }) => {
    const zone = await context.queryClient.ensureQueryData(zoneQueryOptions(params.slug));
    if (!zone) throw notFound();
    return zone;
  },
  errorComponent: ({ error }) => (
    <div role="alert" className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">We couldn't load this growth zone</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">Growth zone not found</h1>
      <Link to="/ai-growth-zones" className="mt-4 inline-block underline">
        Back to all AI Growth Zones
      </Link>
    </div>
  ),
  head: ({ loaderData, params }) => {
    const z = loaderData as GrowthZone | undefined;
    const url = `${BASE}/ai-growth-zones/${params.slug}`;
    const title = z ? `${z.name} — investment, power and planning` : "UK AI Growth Zone";
    const description = (
      z?.summary ??
      "Investment, power, planning and progress for a designated UK AI Growth Zone."
    ).slice(0, 155);
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
      scripts: z
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Place",
                name: z.name,
                url,
                description: z.summary ?? undefined,
                address: {
                  "@type": "PostalAddress",
                  addressLocality: z.town ?? undefined,
                  addressRegion: z.region,
                  addressCountry: "GB",
                },
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
                    name: "AI Growth Zones",
                    item: `${BASE}/ai-growth-zones`,
                  },
                  { "@type": "ListItem", position: 3, name: z.name, item: url },
                ],
              }),
            },
          ]
        : [],
    };
  },
  component: ZonePage,
});

function ZonePage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(zoneQueryOptions(slug));
  const zone = data as GrowthZone;

  return (
    <div className="bg-background">
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <Link
            to="/ai-growth-zones"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> All AI Growth Zones
          </Link>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{zone.name}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" aria-hidden />
              {zone.town ? `${zone.town}, ${zone.region}` : zone.region}
            </span>
            {zone.verified && (
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" aria-hidden /> Verified against published sources
              </span>
            )}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10">
        <ZoneProfile zone={zone} />
      </section>
    </div>
  );
}
