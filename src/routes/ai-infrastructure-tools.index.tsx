import { createFileRoute, Link } from "@tanstack/react-router";
import { Calculator, TrendingUp, MapPinned, ShieldAlert, Map, ArrowRight, Layers } from "lucide-react";
import {
  EnergyShell,
  EnergyContainer,
  EnergyHero,
  Breadcrumb,
  DisclaimerBanner,
  SeoSection,
} from "@/components/energy/EnergyUI";

export const Route = createFileRoute("/ai-infrastructure-tools/")({
  head: () => ({
    meta: [
      { title: "AI Infrastructure Tools UK | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Explore AI subscription costs, data centre impacts, infrastructure investment and UK AI energy expansion through specialist AI infrastructure tools.",
      },
      { property: "og:title", content: "AI Infrastructure Tools UK | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content:
          "Specialist UK tools covering AI subscription costs, data centres, infrastructure investment and grid expansion.",
      },
      { property: "og:url", content: "https://aienergyintelligence.co.uk/ai-infrastructure-tools" },
    ],
    links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/ai-infrastructure-tools" }],
    scripts: [
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"WebApplication\",\"name\":\"AI Infrastructure Tools UK\",\"applicationCategory\":\"BusinessApplication\",\"operatingSystem\":\"Any\",\"url\":\"https://aienergyintelligence.co.uk/ai-infrastructure-tools\",\"description\":\"Explore AI subscription costs, data centre impacts, infrastructure investment and UK AI energy expansion through specialist AI infrastructure tools.\",\"offers\":{\"@type\":\"Offer\",\"price\":\"0\",\"priceCurrency\":\"GBP\"},\"publisher\":{\"@type\":\"Organization\",\"name\":\"AI Energy Intelligence UK\"},\"isAccessibleForFree\":true,\"inLanguage\":\"en-GB\"}" },
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"BreadcrumbList\",\"itemListElement\":[{\"@type\":\"ListItem\",\"position\":1,\"name\":\"Home\",\"item\":\"https://aienergyintelligence.co.uk/\"},{\"@type\":\"ListItem\",\"position\":2,\"name\":\"Ai Infrastructure Tools\",\"item\":\"https://aienergyintelligence.co.uk/ai-infrastructure-tools\"}]}" },
    ],
  }),
  component: Tier2Landing,
});

const cards = [
  {
    to: "/ai-infrastructure-tools/subscription-cost" as const,
    icon: Calculator,
    title: "AI Subscription Real Cost Calculator",
    desc: "See how AI subscription fees represent only part of the wider infrastructure cost behind AI services.",
    cta: "Calculate Real AI Cost",
    bestFor: "Businesses and consumers sizing the true cost of AI.",
    preview: "Annual spend + infrastructure, energy & data centre scores",
  },
  {
    to: "/ai-infrastructure-tools/spending-tracker" as const,
    icon: TrendingUp,
    title: "AI Infrastructure Spending Tracker",
    desc: "Track major AI-related infrastructure projects across the UK with search, filters and a dashboard.",
    cta: "Open Spending Tracker",
    bestFor: "Journalists, researchers and analysts tracking UK investment.",
    preview: "Searchable project database + investment dashboard",
  },
  {
    to: "/ai-infrastructure-tools/data-centre-impact" as const,
    icon: MapPinned,
    title: "Data Centre Impact Checker",
    desc: "Understand the potential local impact of nearby data centre development.",
    cta: "Check Local Impact",
    bestFor: "Residents, businesses and investors near developments.",
    preview: "Positive impacts, challenges and an impact rating",
  },
  {
    to: "/ai-infrastructure-tools/risk-assessment" as const,
    icon: ShieldAlert,
    title: "AI Infrastructure Risk Assessment",
    desc: "Understand potential infrastructure risks created by rapid AI expansion.",
    cta: "Assess Infrastructure Risk",
    bestFor: "Planners and researchers modelling AI growth scenarios.",
    preview: "Capacity, investment, grid pressure & delivery risk scores",
  },
  {
    to: "/ai-infrastructure-tools/investment-map" as const,
    icon: Map,
    title: "AI Data Centre Investment Map",
    desc: "A visual UK map showing major AI and data centre investment locations.",
    cta: "View Investment Map",
    bestFor: "Anyone exploring where UK AI investment is concentrated.",
    preview: "Map markers, filters and investment metrics",
  },
];

function Tier2Landing() {
  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "AI Energy Intelligence UK", to: "/" },
          { label: "AI Infrastructure Tools" },
        ]}
      />
      <EnergyHero
        eyebrow="AI Infrastructure & Cost Tools"
        title="AI Infrastructure & Cost Tools"
        intro="These tools focus on the hidden infrastructure behind artificial intelligence, including data centres, electricity demand, investment, grid expansion and the true costs of large-scale AI deployment."
        icon={Layers}
      />

      <EnergyContainer className="py-10 space-y-8">
        <SeoSection title="Introduction">
          <p>
            These specialist tools expand AI Energy Intelligence UK beyond basic AI energy calculators into AI infrastructure, energy
            costs, data centres, grid investment and future electricity demand. They are designed for UK consumers,
            businesses, journalists, researchers and investors who want to understand what sits behind AI services.
          </p>
        </SeoSection>

        <DisclaimerBanner>
          <strong className="text-white">Important:</strong> These tools provide educational estimates and
          infrastructure insights only. They are not financial, engineering, planning or investment advice.
        </DisclaimerBanner>

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
