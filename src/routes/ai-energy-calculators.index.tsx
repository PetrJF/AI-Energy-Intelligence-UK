import { createFileRoute, Link } from "@tanstack/react-router";
import { Zap, Gauge, LineChart, MapPin, Server, Droplets, Network, Activity, ShieldQuestion, ArrowRight } from "lucide-react";
import {
  EnergyShell,
  EnergyContainer,
  EnergyHero,
  Breadcrumb,
  DisclaimerBanner,
  SeoSection,
} from "@/components/energy/EnergyUI";

export const Route = createFileRoute("/ai-energy-calculators/")({
  head: () => ({
    meta: [
      { title: "AI Energy Calculators UK | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "UK AI energy calculators to estimate AI electricity use, compare AI with household appliances and explore AI data centre impact.",
      },
      { property: "og:title", content: "AI Energy Calculators UK | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content:
          "Estimate AI electricity use, compare AI with household appliances, forecast AI demand and explore UK AI data centre impact.",
      },
      { property: "og:url", content: "https://aienergyintelligence.co.uk/ai-energy-calculators" },
    ],
    links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/ai-energy-calculators" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "AI Energy Calculators",
          url: "https://aienergyintelligence.co.uk/ai-energy-calculators",
          description:
            "UK AI energy calculators to estimate AI electricity use, compare AI with household appliances and explore AI data centre impact.",
          mainEntity: {
            "@type": "ItemList",
            itemListElement: cards.map((c, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: c.title,
              url: `https://aienergyintelligence.co.uk${c.to}`,
            })),
          },
        }),
      },
    ],
  }),
  component: Tier1Landing,
});

const cards = [
  {
    to: "/ai-energy-calculators/query-energy" as const,
    icon: Zap,
    title: "AI Query Energy Calculator",
    desc: "Estimate the electricity consumption associated with your AI text, image and video usage.",
    cta: "Use AI Query Energy Calculator",
    bestFor: "Consumers and businesses sizing their AI electricity footprint.",
    preview: "Daily, monthly & annual kWh + estimated cost",
  },
  {
    to: "/ai-energy-calculators/vs-appliances" as const,
    icon: Gauge,
    title: "AI vs Household Appliance Calculator",
    desc: "Compare estimated AI energy use against common UK household appliances.",
    cta: "Compare AI With Household Appliances",
    bestFor: "Anyone wanting AI energy use put into everyday terms.",
    preview: "AI use expressed in tumble dryer & kettle equivalents",
  },
  {
    to: "/ai-energy-calculators/demand-forecast" as const,
    icon: LineChart,
    title: "AI Electricity Demand Forecast Tool",
    desc: "Explore how AI adoption could affect UK electricity demand between 2026 and 2035.",
    cta: "Explore AI Electricity Demand",
    bestFor: "Journalists, researchers and planners exploring grid impact.",
    preview: "Demand pressure rating by year, sector & region",
  },
  {
    to: "/ai-energy-calculators/growth-zone" as const,
    icon: MapPin,
    title: "AI Growth Zone Checker",
    desc: "Understand whether your area could have relevance to future AI infrastructure growth.",
    cta: "Check AI Growth Zone Relevance",
    bestFor: "Residents, businesses and investors gauging local relevance.",
    preview: "Relevance rating + suggested questions to ask",
  },
  {
    to: "/ai-energy-calculators/data-centres" as const,
    icon: Server,
    title: "AI Data Centre Map / Directory",
    desc: "Search a UK directory of AI-related data centres by region, status and energy pressure.",
    cta: "View AI Data Centre Directory",
    bestFor: "Researchers and journalists tracking UK data centre activity.",
    preview: "Searchable, filterable UK directory",
  },
  {
    to: "/ai-data-centre-electricity-calculator" as const,
    icon: Server,
    title: "AI Data Centre Electricity Calculator",
    desc: "Estimate the annual electricity use, energy cost and carbon impact of an AI data centre.",
    cta: "Use AI Data Centre Electricity Calculator",
    bestFor: "Businesses, researchers, journalists and policy analysts.",
    preview: "Annual kWh, cost, carbon + UK equivalents",
  },
  {
    to: "/ai-water-consumption-calculator" as const,
    icon: Droplets,
    title: "AI Water Consumption Calculator",
    desc: "Estimate the water consumption of AI data centres and infrastructure by cooling method and electricity use.",
    cta: "Use AI Water Consumption Calculator",
    bestFor: "Businesses, researchers, journalists and policy analysts.",
    preview: "Annual litres & m³, daily/monthly use + UK equivalents",
  },
  {
    to: "/ai-growth-zone-impact-calculator" as const,
    icon: Network,
    title: "AI Growth Zone Impact Calculator",
    desc: "Estimate the electricity demand, energy cost, grid pressure, jobs and local impact of a UK AI Growth Zone or data centre project.",
    cta: "Use AI Growth Zone Impact Calculator",
    bestFor: "Local authorities, policy analysts, researchers and journalists.",
    preview: "Annual MWh, cost before/after support, grid pressure + jobs",
  },
  {
    to: "/ai-grid-impact-forecast-tool" as const,
    icon: Activity,
    title: "AI Grid Impact Forecast Tool",
    desc: "Forecast how AI adoption and data centre growth could affect UK electricity demand, grid pressure, carbon and infrastructure over time.",
    cta: "Use AI Grid Impact Forecast Tool",
    bestFor: "Researchers, policy analysts, energy consultants and journalists.",
    preview: "Demand & cost charts, grid pressure score + scenario comparison",
  },
  {
    to: "/ai-energy-myth-checker" as const,
    icon: ShieldQuestion,
    title: "AI Energy Myth Checker",
    desc: "Test common claims about AI electricity use, data centres, carbon, water and UK grid impact with evidence-led verdicts.",
    cta: "Use AI Energy Myth Checker",
    bestFor: "Journalists, researchers, students, policymakers and general readers.",
    preview: "Verdict & confidence badges, search, filters + score mode",
  },
];

function Tier1Landing() {
  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "AI Energy Intelligence UK", to: "/" },
          { label: "AI Energy Tools" },
          { label: "AI Energy Calculators" },
        ]}
      />
      <EnergyHero
        eyebrow="Core AI Energy Calculators"
        title="UK AI Energy, Demand & Data Centre Calculators"
        intro="Specialist calculators to help UK consumers, businesses, journalists and researchers understand how artificial intelligence affects electricity demand, household energy costs, data centres, infrastructure and the UK grid."
        icon={Zap}
      />

      <EnergyContainer className="py-10 space-y-8">
        <SeoSection title="Introduction">
          <p>
            AI Energy Intelligence UK helps UK consumers, businesses, journalists and researchers understand how artificial
            intelligence affects electricity demand, household energy costs, data centres, infrastructure and the UK
            grid. These calculators provide educational estimates and are not official engineering, planning or
            government advice.
          </p>
        </SeoSection>

        <DisclaimerBanner />

        <div className="grid gap-5 md:grid-cols-2">
          {cards.map((c) => (
            <div
              key={c.to}
              className="flex flex-col rounded-2xl bg-energy-card text-energy-ink p-6 shadow-elegant border border-black/5"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-electric/10 p-3">
                  <c.icon className="h-6 w-6 text-electric" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-xl font-bold">{c.title}</h3>
                  <p className="mt-1.5 text-sm text-energy-ink/70 leading-relaxed">{c.desc}</p>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-energy-grey p-3 text-sm">
                <span className="font-semibold">Best for:</span>{" "}
                <span className="text-energy-ink/70">{c.bestFor}</span>
              </div>

              <div className="mt-3 rounded-lg border border-dashed border-black/15 p-3 text-xs text-energy-ink/60">
                <div className="font-semibold uppercase tracking-wide text-energy-ink/50">Result preview</div>
                <div className="mt-1">{c.preview}</div>
              </div>



              <Link
                to={c.to}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-electric px-4 py-2.5 text-sm font-semibold text-electric-foreground hover:opacity-90 transition-opacity"
              >
                {c.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </EnergyContainer>
    </EnergyShell>
  );
}
