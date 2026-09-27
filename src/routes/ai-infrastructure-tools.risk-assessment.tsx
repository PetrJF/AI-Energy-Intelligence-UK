import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ShieldAlert } from "lucide-react";
import {
  EnergyShell,
  EnergyContainer,
  EnergyHero,
  Breadcrumb,
  DisclaimerBanner,
  WhiteCard,
  DataCard,
  SeoSection,
  EnergyFAQ,
  EField,
  ESelect,
} from "@/components/energy/EnergyUI";
import { Tier2RelatedContent, Tier2NavButtons, RatingBadge, type RatingLevel } from "@/components/energy/Tier2UI";

export const Route = createFileRoute("/ai-infrastructure-tools/risk-assessment")({
  head: () => ({
    meta: [
      { title: "AI Infrastructure Risk Assessment UK | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Assess potential UK infrastructure risks from rapid AI expansion — capacity, investment, grid pressure and delivery risk across growth scenarios.",
      },
      { property: "og:title", content: "AI Infrastructure Risk Assessment UK | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content: "Model capacity, grid, investment and delivery risk for UK AI infrastructure growth.",
      },
      { property: "og:url", content: "https://aienergyintelligence.co.uk/ai-infrastructure-tools/risk-assessment" },
    ],
    links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/ai-infrastructure-tools/risk-assessment" }],
    scripts: [
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"WebApplication\",\"name\":\"AI Infrastructure Risk Assessment UK\",\"applicationCategory\":\"BusinessApplication\",\"operatingSystem\":\"Any\",\"url\":\"https://aienergyintelligence.co.uk/ai-infrastructure-tools/risk-assessment\",\"description\":\"Assess potential UK infrastructure risks from rapid AI expansion — capacity, investment, grid pressure and delivery risk across growth scenarios.\",\"offers\":{\"@type\":\"Offer\",\"price\":\"0\",\"priceCurrency\":\"GBP\"},\"publisher\":{\"@type\":\"Organization\",\"name\":\"AI Energy Intelligence UK\"},\"isAccessibleForFree\":true,\"inLanguage\":\"en-GB\"}" },
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"BreadcrumbList\",\"itemListElement\":[{\"@type\":\"ListItem\",\"position\":1,\"name\":\"Home\",\"item\":\"https://aienergyintelligence.co.uk/\"},{\"@type\":\"ListItem\",\"position\":2,\"name\":\"Ai Infrastructure Tools\",\"item\":\"https://aienergyintelligence.co.uk/ai-infrastructure-tools\"},{\"@type\":\"ListItem\",\"position\":3,\"name\":\"Risk Assessment\",\"item\":\"https://aienergyintelligence.co.uk/ai-infrastructure-tools/risk-assessment\"}]}" },
    ],
  }),
  component: RiskAssessment,
});

type Scenario = "conservative" | "moderate" | "aggressive";

const SCENARIO_FACTOR: Record<Scenario, number> = { conservative: 1, moderate: 1.6, aggressive: 2.4 };

const INFRA_BASE: Record<string, { capacity: number; investment: number; grid: number; delivery: number }> = {
  "Data Centres": { capacity: 30, investment: 28, grid: 34, delivery: 26 },
  Grid: { capacity: 26, investment: 30, grid: 38, delivery: 30 },
  "Water Supply": { capacity: 28, investment: 22, grid: 20, delivery: 30 },
  "Fibre Networks": { capacity: 22, investment: 20, grid: 16, delivery: 22 },
  "Energy Generation": { capacity: 30, investment: 34, grid: 32, delivery: 34 },
};

const REGION_FACTOR: Record<string, number> = {
  London: 1.25,
  "South East": 1.15,
  "North West": 1.05,
  Scotland: 1.0,
  Wales: 0.95,
  "East of England": 1.1,
  "North East": 0.95,
  "South West": 0.95,
  Midlands: 1.05,
  "Northern Ireland": 0.9,
};

function levelFromScore(score: number): RatingLevel {
  if (score < 35) return "Low";
  if (score < 60) return "Medium";
  if (score < 85) return "High";
  return "Severe";
}

function RiskAssessment() {
  const [region, setRegion] = useState("London");
  const [scenario, setScenario] = useState<Scenario>("moderate");
  const [infra, setInfra] = useState("Data Centres");

  const r = useMemo(() => {
    const base = INFRA_BASE[infra];
    const f = SCENARIO_FACTOR[scenario] * (REGION_FACTOR[region] ?? 1);
    const clamp = (n: number) => Math.min(100, Math.round(n * f));
    const capacity = clamp(base.capacity);
    const investment = clamp(base.investment);
    const grid = clamp(base.grid);
    const delivery = clamp(base.delivery);
    return {
      capacity,
      investment,
      grid,
      delivery,
      capacityLevel: levelFromScore(capacity),
      investmentLevel: levelFromScore(investment),
      gridLevel: levelFromScore(grid),
      deliveryLevel: levelFromScore(delivery),
    };
  }, [region, scenario, infra]);

  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "AI Energy Intelligence UK", to: "/" },
          { label: "AI Infrastructure Tools", to: "/ai-infrastructure-tools" },
          { label: "AI Infrastructure Risk Assessment" },
        ]}
      />
      <EnergyHero
        eyebrow="Tool 9"
        title="AI Infrastructure Risk Assessment Tool"
        intro="Understand potential infrastructure risks created by rapid AI expansion across capacity, investment, grid pressure and delivery."
        icon={ShieldAlert}
      />

      <EnergyContainer className="py-10 space-y-8">
        <DisclaimerBanner>
          <strong className="text-white">Important:</strong> This tool provides educational estimates only and is not
          engineering, planning or investment advice.
        </DisclaimerBanner>

        <div className="grid lg:grid-cols-5 gap-6">
          <WhiteCard className="lg:col-span-3">
            <h3 className="font-display text-lg font-bold mb-5">Scenario inputs</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <EField label="Region">
                <ESelect value={region} onChange={(e) => setRegion(e.target.value)}>
                  {Object.keys(REGION_FACTOR).map((rg) => (
                    <option key={rg}>{rg}</option>
                  ))}
                </ESelect>
              </EField>
              <EField label="Growth scenario">
                <ESelect value={scenario} onChange={(e) => setScenario(e.target.value as Scenario)}>
                  <option value="conservative">Conservative</option>
                  <option value="moderate">Moderate</option>
                  <option value="aggressive">Aggressive</option>
                </ESelect>
              </EField>
              <EField label="Infrastructure type">
                <ESelect value={infra} onChange={(e) => setInfra(e.target.value)}>
                  {Object.keys(INFRA_BASE).map((i) => (
                    <option key={i}>{i}</option>
                  ))}
                </ESelect>
              </EField>
            </div>
          </WhiteCard>

          <div className="lg:col-span-2 grid grid-cols-2 gap-3 content-start">
            <DataCard label="Capacity risk" value={`${r.capacity}/100`} sub={r.capacityLevel} accent />
            <DataCard label="Investment risk" value={`${r.investment}/100`} sub={r.investmentLevel} />
            <DataCard label="Grid pressure risk" value={`${r.grid}/100`} sub={r.gridLevel} />
            <DataCard label="Delivery risk" value={`${r.delivery}/100`} sub={r.deliveryLevel} />
          </div>
        </div>

        <WhiteCard>
          <h3 className="font-display text-lg font-bold">Plain English explanation</h3>
          <p className="mt-2 text-sm text-energy-ink/80 leading-relaxed">
            Under a <strong>{scenario}</strong> AI growth scenario in <strong>{region}</strong>, grid pressure risk is{" "}
            <strong>{r.gridLevel.toLowerCase()}</strong> due to increasing demand for large-scale {infra.toLowerCase()}{" "}
            and associated cooling and power systems.
          </p>
          <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm text-energy-ink/80">
            <div className="rounded-lg bg-energy-grey p-3">
              <span className="font-semibold">Potential bottlenecks:</span> grid connection queues, planning timelines
              and specialist equipment lead times.
            </div>
            <div className="rounded-lg bg-energy-grey p-3">
              <span className="font-semibold">Infrastructure constraints:</span> available power, land, water and skilled
              labour in high-demand regions.
            </div>
            <div className="rounded-lg bg-energy-grey p-3">
              <span className="font-semibold">Investment requirements:</span> sustained capital for generation, storage
              and network reinforcement.
            </div>
            <div className="rounded-lg bg-energy-grey p-3">
              <span className="font-semibold">Likely mitigation:</span> phased delivery, grid upgrades, on-site
              generation, storage and demand flexibility.
            </div>
          </div>
        </WhiteCard>

        <SeoSection title="How It Works">
          <p>
            Each risk score combines a baseline for the chosen infrastructure type with multipliers for your selected
            growth scenario and region. Aggressive scenarios and high-demand regions raise scores, producing risk levels
            of low, medium, high or severe.
          </p>
        </SeoSection>

        <SeoSection title="Why It Matters">
          <p>
            Rapid AI expansion can place sudden pressure on shared infrastructure. Identifying where capacity, grid,
            investment and delivery risks are highest helps planners, investors and researchers anticipate bottlenecks
            and plan mitigation.
          </p>
        </SeoSection>

        <SeoSection title="Limitations">
          <p>
            Scores are directional indicators built on simplified assumptions. They do not replace detailed engineering,
            grid connection or planning analysis and cannot account for specific project conditions.
          </p>
        </SeoSection>

        <Tier2RelatedContent tool="risk-assessment" />

        <EnergyFAQ
          items={[
            {
              q: "Could AI overload electricity networks?",
              a: "Concentrated, rapid growth in large facilities can strain local grids, which is why connection queues, upgrades and demand flexibility are increasingly important.",
            },
            {
              q: "What infrastructure is needed for AI growth?",
              a: "More generation and storage, reinforced grids and substations, resilient power and cooling at data centres, and supporting water and fibre networks.",
            },
            {
              q: "How quickly can new capacity be built?",
              a: "It varies. Data centres can be built in a few years, but grid reinforcement, new generation and major connections often take much longer, creating delivery risk.",
            },
          ]}
        />

        <div>
          <h3 className="font-display text-lg font-bold text-white mb-4">Explore more AI infrastructure tools</h3>
          <Tier2NavButtons current="/ai-infrastructure-tools/risk-assessment" />
        </div>
      </EnergyContainer>
    </EnergyShell>
  );
}
