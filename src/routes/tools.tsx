import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { HUBS } from "@/components/energy/hub";
import toolsHero from "@/assets/tools-hero.jpg.asset.json";


const HUB_LIST = [HUBS["energy-cost"], HUBS.infrastructure, HUBS.business];
const TOTAL_TOOLS = HUB_LIST.reduce((n, h) => n + h.tools.length, 0);
const CANONICAL = "https://aienergyintelligence.co.uk/tools";
const HERO_IMAGE = `https://aienergyintelligence.co.uk${toolsHero.url}`;


export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "Specialist UK AI Energy Tools — All Calculators | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Every UK-focused AI energy calculator in one place. Estimate AI electricity use, compare it with household appliances, forecast grid demand and explore data centre impact across Britain.",
      },
      { property: "og:title", content: "Specialist UK AI Energy Tools — All Calculators" },
      {
        property: "og:description",
        content:
          "Every UK-focused AI energy calculator in one place — electricity cost, appliance comparisons, grid demand and data centre impact.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: CANONICAL },
      { property: "og:image", content: HERO_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: HERO_IMAGE },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Specialist UK AI Energy Tools",
          url: CANONICAL,
          hasPart: HUB_LIST.flatMap((h) =>
            h.tools.map((t) => ({
              "@type": "SoftwareApplication",
              name: t.title,
              applicationCategory: "UtilityApplication",
              operatingSystem: "Web",
              url: `https://aienergyintelligence.co.uk${t.to}`,
              description: t.desc,
            })),
          ),
        }),
      },
    ],
  }),
  component: ToolsLanding,
});

function ToolsLanding() {
  return (
    <>
      <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-20 grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-brand">
                Specialist UK AI energy tools
              </div>
              <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold leading-tight">
                Every UK AI energy calculator, in one place.
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                Estimate AI electricity use, compare it with household appliances, forecast grid
                demand and explore data centre impact across Britain — using transparent,
                UK-specific assumptions.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/energy-cost/ai-electricity-cost-calculator"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
                >
                  Start with electricity cost <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/news"
                  className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-5 py-3 text-sm font-semibold hover:bg-accent transition"
                >
                  Latest UK AI energy news
                </Link>
              </div>
              <div className="mt-6 text-sm text-muted-foreground">
                {TOTAL_TOOLS} free calculators across {HUB_LIST.length} hubs. No sign-up required.
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-border shadow-elegant aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[360px]">
              <img
                src={toolsHero.url}
                alt="Aerial view of a UK data centre with wind turbines and electricity pylons at sunset, illustrating UK AI tools and Britain's energy infrastructure"
                width={1920}
                height={1088}
                className="absolute inset-0 h-full w-full object-cover"
                fetchPriority="high"
              />
            </div>
          </div>
        </section>


        {HUB_LIST.map((hub) => (
          <section key={hub.key} className="border-b border-border">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
              <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-accent p-2">
                      <hub.icon className="h-5 w-5 text-brand" />
                    </div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold">{hub.label}</h2>
                  </div>
                  <p className="mt-3 max-w-2xl text-muted-foreground">{hub.intro}</p>
                </div>
                <Link
                  to={hub.to}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
                >
                  Hub overview <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {hub.tools.map((t) => (
                  <Link
                    key={t.to}
                    to={t.to}
                    className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-elegant hover:-translate-y-0.5 transition-all"
                  >
                    <div className="rounded-lg bg-accent p-2 w-fit">
                      <t.icon className="h-5 w-5 text-brand" />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold leading-snug">{t.title}</h3>
                    <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed">
                      {t.desc}
                    </p>
                    <div className="mt-4 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">Best for:</span> {t.bestFor}
                    </div>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                      Open tool{" "}
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
        </section>
      ))}
    </>
  );
}

