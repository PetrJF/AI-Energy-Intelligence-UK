import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, Droplets, Network, LineChart, Landmark, LayoutDashboard, ArrowRight, Gauge as GaugeIcon } from "lucide-react";
import {
  EnergyShell,
  EnergyContainer,
  EnergyHero,
  Breadcrumb,
  DisclaimerBanner,
  SeoSection,
} from "@/components/energy/EnergyUI";
import { IndexCard } from "@/components/energy/Tier3UI";

export const Route = createFileRoute("/advanced-ai-energy-tools/")({
  head: () => ({
    meta: [
      { title: "Advanced AI Energy Intelligence Tools UK | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Explore AI carbon impact, water consumption, grid pressure and long-term electricity demand using advanced AI infrastructure tools from AI Energy Intelligence UK.",
      },
      { property: "og:title", content: "Advanced AI Energy Intelligence Tools UK | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content:
          "Advanced UK AI energy intelligence: carbon impact, water usage, grid capacity, electricity demand and infrastructure scenario modelling.",
      },
      { property: "og:url", content: "https://aienergyintelligence.co.uk/advanced-ai-energy-tools" },
    ],
    links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/advanced-ai-energy-tools" }],
    scripts: [
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"WebApplication\",\"name\":\"Advanced AI Energy Intelligence Tools UK\",\"applicationCategory\":\"BusinessApplication\",\"operatingSystem\":\"Any\",\"url\":\"https://aienergyintelligence.co.uk/advanced-ai-energy-tools\",\"description\":\"Explore AI carbon impact, water consumption, grid pressure and long-term electricity demand using advanced AI infrastructure tools from AI Energy Intelligence UK.\",\"offers\":{\"@type\":\"Offer\",\"price\":\"0\",\"priceCurrency\":\"GBP\"},\"publisher\":{\"@type\":\"Organization\",\"name\":\"AI Energy Intelligence UK\"},\"isAccessibleForFree\":true,\"inLanguage\":\"en-GB\"}" },
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"BreadcrumbList\",\"itemListElement\":[{\"@type\":\"ListItem\",\"position\":1,\"name\":\"Home\",\"item\":\"https://aienergyintelligence.co.uk/\"},{\"@type\":\"ListItem\",\"position\":2,\"name\":\"Advanced Ai Energy Tools\",\"item\":\"https://aienergyintelligence.co.uk/advanced-ai-energy-tools\"}]}" },
    ],
  }),
  component: Tier3Landing,
});

const cards = [
  {
    to: "/advanced-ai-energy-tools/carbon-impact" as const,
    icon: Leaf,
    title: "AI Carbon Impact Calculator",
    desc: "Estimate the potential carbon footprint of AI usage across prompts, images and video generation.",
    cta: "Calculate Carbon Impact",
    bestFor: "Researchers and businesses sizing AI emissions.",
  },
  {
    to: "/advanced-ai-energy-tools/water-usage" as const,
    icon: Droplets,
    title: "AI Water Usage Calculator",
    desc: "Understand how AI workloads and data centre cooling translate into water demand pressure.",
    cta: "Check Water Pressure",
    bestFor: "Anyone exploring AI's hidden water footprint.",
  },
  {
    to: "/advanced-ai-energy-tools/grid-capacity" as const,
    icon: Network,
    title: "AI Grid Capacity Checker",
    desc: "See how AI growth may affect regional electricity networks, substations and connections.",
    cta: "Check Grid Capacity",
    bestFor: "Policymakers and grid-focused analysts.",
  },
  {
    to: "/advanced-ai-energy-tools/demand-modeller" as const,
    icon: LineChart,
    title: "AI Electricity Demand Modeller",
    desc: "Model long-term electricity demand to 2040 across AI adoption, population and electrification.",
    cta: "Open Demand Modeller",
    bestFor: "Forecasters comparing demand scenarios.",
  },
  {
    to: "/advanced-ai-energy-tools/energy-cost-society" as const,
    icon: Landmark,
    title: "AI Energy Cost To Society Calculator",
    desc: "Explore the wider infrastructure investment pressure created by large-scale AI deployment.",
    cta: "Explore Societal Cost",
    bestFor: "Journalists and policy analysts.",
  },
  {
    to: "/advanced-ai-energy-tools/scenario-comparison" as const,
    icon: LayoutDashboard,
    title: "AI Infrastructure Scenario Comparison Dashboard",
    desc: "Compare conservative, moderate and aggressive AI growth futures side by side.",
    cta: "Compare Scenarios",
    bestFor: "Decision-makers weighing AI growth futures.",
  },
];

function Tier3Landing() {
  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "AI Energy Intelligence UK", to: "/" },
          { label: "Advanced AI Energy Intelligence Tools" },
        ]}
      />
      <EnergyHero
        eyebrow="Advanced AI Energy Intelligence"
        title="Advanced AI Energy Intelligence Tools"
        intro="These tools explore the wider environmental, infrastructure and energy consequences of artificial intelligence. They help users understand how AI may affect electricity systems, water resources, carbon emissions and national infrastructure over the coming decade."
        icon={GaugeIcon}
      />

      <EnergyContainer className="py-10 space-y-8">
        <SeoSection title="Introduction">
          <p>
            These advanced tools are designed for researchers, journalists, businesses, investors, policymakers and
            highly engaged consumers who want deeper insight into the long-term consequences of AI growth. They model the
            environmental, infrastructure and electricity-demand implications of artificial intelligence across the UK.
          </p>
        </SeoSection>

        <DisclaimerBanner>
          <strong className="text-white">Important:</strong> These tools provide educational modelling and scenario
          analysis only. They are not engineering, environmental, financial, planning or investment advice.
        </DisclaimerBanner>

        {/* Advanced Intelligence Dashboard */}
        <div>
          <h3 className="font-display text-xl md:text-2xl font-bold text-white">Advanced Intelligence Dashboard</h3>
          <p className="mt-2 text-sm text-white/70 max-w-2xl">
            A snapshot of the headline pressure indices that AI growth is placing on UK energy and infrastructure
            systems under a moderate growth outlook.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <IndexCard label="AI Demand Index" level="High" hint="Electricity demand from AI workloads" />
            <IndexCard label="Grid Pressure Index" level="High" hint="Strain on networks & substations" />
            <IndexCard label="Carbon Pressure Index" level="Medium" hint="Emissions from AI electricity use" />
            <IndexCard label="Water Pressure Index" level="Medium" hint="Cooling-related water demand" />
            <IndexCard label="Infrastructure Investment Index" level="Very High" hint="Required capital investment" />
          </div>
          <p className="mt-3 text-xs text-white/50">
            Indicative indices for illustration. Use the tools below to model your own scenarios.
          </p>
        </div>

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
                <span className="font-semibold">Best for:</span> <span className="text-energy-ink/70">{c.bestFor}</span>
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
