import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Network } from "lucide-react";
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
import { Tier3RelatedContent, Tier3NavButtons } from "@/components/energy/Tier3UI";
import { RatingBadge, type RatingLevel } from "@/components/energy/Tier2UI";

export const Route = createFileRoute("/advanced-ai-energy-tools/grid-capacity")({
  head: () => ({
    meta: [
      { title: "AI Grid Capacity Checker UK | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Understand how AI growth may affect UK electricity networks. Model grid pressure, connection risk and infrastructure upgrade needs by region and scenario.",
      },
      { property: "og:title", content: "AI Grid Capacity Checker UK | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content: "Model how AI growth may strain UK substations, transmission and connections.",
      },
      { property: "og:url", content: "https://aienergyintelligence.co.uk/advanced-ai-energy-tools/grid-capacity" },
    ],
    links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/advanced-ai-energy-tools/grid-capacity" }],
    scripts: [
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"WebApplication\",\"name\":\"AI Grid Capacity Checker UK\",\"applicationCategory\":\"BusinessApplication\",\"operatingSystem\":\"Any\",\"url\":\"https://aienergyintelligence.co.uk/advanced-ai-energy-tools/grid-capacity\",\"description\":\"Understand how AI growth may affect UK electricity networks. Model grid pressure, connection risk and infrastructure upgrade needs by region and scenario.\",\"offers\":{\"@type\":\"Offer\",\"price\":\"0\",\"priceCurrency\":\"GBP\"},\"publisher\":{\"@type\":\"Organization\",\"name\":\"AI Energy Intelligence UK\"},\"isAccessibleForFree\":true,\"inLanguage\":\"en-GB\"}" },
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"BreadcrumbList\",\"itemListElement\":[{\"@type\":\"ListItem\",\"position\":1,\"name\":\"Home\",\"item\":\"https://aienergyintelligence.co.uk/\"},{\"@type\":\"ListItem\",\"position\":2,\"name\":\"Advanced Ai Energy Tools\",\"item\":\"https://aienergyintelligence.co.uk/advanced-ai-energy-tools\"},{\"@type\":\"ListItem\",\"position\":3,\"name\":\"Grid Capacity\",\"item\":\"https://aienergyintelligence.co.uk/advanced-ai-energy-tools/grid-capacity\"}]}" },
    ],
  }),
  component: GridCapacityChecker,
});

const DEMAND_FACTOR: Record<string, number> = {
  household: 0.7,
  business: 1,
  data_centres: 1.8,
  industrial: 1.4,
  mixed: 1.1,
};
const SCENARIO_FACTOR: Record<string, number> = { conservative: 0.6, moderate: 1, aggressive: 1.7 };

function riskLevel(score: number): RatingLevel {
  if (score < 30) return "Low";
  if (score < 55) return "Medium";
  if (score < 80) return "High";
  return "Severe";
}

function GridCapacityChecker() {
  const [region, setRegion] = useState("uk");
  const [demand, setDemand] = useState("mixed");
  const [scenario, setScenario] = useState("moderate");
  const [year, setYear] = useState("2030");

  const r = useMemo(() => {
    const yearsAhead = Math.max(0, parseInt(year) - 2026);
    const growth = SCENARIO_FACTOR[scenario];
    const demandF = DEMAND_FACTOR[demand];
    const time = 1 + yearsAhead * 0.12;

    const gridPressure = Math.min(100, Math.round(28 * demandF * growth * time));
    const connectionRisk = Math.min(100, Math.round(24 * demandF * growth * time + 8));
    const upgrade = Math.min(100, Math.round(26 * demandF * growth * time + 6));
    const trendPct = Math.round((growth * demandF * yearsAhead * 4));

    return {
      gridPressure,
      connectionRisk,
      upgrade,
      trendPct,
      gridLevel: riskLevel(gridPressure),
      connLevel: riskLevel(connectionRisk),
      upgradeLevel: riskLevel(upgrade),
    };
  }, [region, demand, scenario, year]);

  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "AI Energy Intelligence UK", to: "/" },
          { label: "Advanced AI Energy Intelligence", to: "/advanced-ai-energy-tools" },
          { label: "AI Grid Capacity Checker" },
        ]}
      />
      <EnergyHero
        eyebrow="Tool 13"
        title="AI Grid Capacity Checker"
        intro="Understand how AI growth may affect electricity networks. Model grid pressure, connection risk and infrastructure upgrade requirements across UK regions, demand types and growth scenarios."
        icon={Network}
      />

      <EnergyContainer className="py-10 space-y-8">
        <DisclaimerBanner>
          <strong className="text-white">Important:</strong> This tool models broad infrastructure scenarios and is not
          an official grid assessment.
        </DisclaimerBanner>

        <div className="grid lg:grid-cols-5 gap-6">
          <WhiteCard className="lg:col-span-3">
            <h3 className="font-display text-lg font-bold mb-5">Your scenario</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <EField label="Region">
                <ESelect value={region} onChange={(e) => setRegion(e.target.value)}>
                  <option value="uk">UK</option>
                  <option value="england">England</option>
                  <option value="scotland">Scotland</option>
                  <option value="wales">Wales</option>
                  <option value="ni">Northern Ireland</option>
                </ESelect>
              </EField>
              <EField label="Demand type">
                <ESelect value={demand} onChange={(e) => setDemand(e.target.value)}>
                  <option value="household">Household AI</option>
                  <option value="business">Business AI</option>
                  <option value="data_centres">Data Centres</option>
                  <option value="industrial">Industrial AI</option>
                  <option value="mixed">Mixed</option>
                </ESelect>
              </EField>
              <EField label="AI growth scenario">
                <ESelect value={scenario} onChange={(e) => setScenario(e.target.value)}>
                  <option value="conservative">Conservative</option>
                  <option value="moderate">Moderate</option>
                  <option value="aggressive">Aggressive</option>
                </ESelect>
              </EField>
              <EField label="Time horizon">
                <ESelect value={year} onChange={(e) => setYear(e.target.value)}>
                  {["2026", "2027", "2028", "2029", "2030", "2035"].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </ESelect>
              </EField>
            </div>
          </WhiteCard>

          <div className="lg:col-span-2 grid grid-cols-1 gap-3 content-start">
            <DataCard label="Grid pressure" value={`${r.gridPressure}/100`} sub={r.gridLevel} accent />
            <DataCard label="Connection risk" value={`${r.connectionRisk}/100`} sub={r.connLevel} />
            <DataCard label="Infrastructure upgrade" value={`${r.upgrade}/100`} sub={r.upgradeLevel} />
            <DataCard label="Electricity demand trend" value={`+${r.trendPct}%`} sub="vs 2026 baseline" />
          </div>
        </div>

        <WhiteCard>
          <h3 className="font-display text-lg font-bold">Your result</h3>
          <p className="mt-2 text-sm text-energy-ink/80 leading-relaxed">
            Under a <strong>{scenario}</strong> AI growth scenario, grid pressure in the selected region is likely to{" "}
            {r.gridLevel === "Low" ? "increase modestly" : "increase significantly"}. New generation capacity,
            substations and transmission upgrades may be required.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <span className="flex items-center gap-2">
              <span className="text-energy-ink/60">Grid pressure:</span> <RatingBadge level={r.gridLevel} />
            </span>
            <span className="flex items-center gap-2">
              <span className="text-energy-ink/60">Connection risk:</span> <RatingBadge level={r.connLevel} />
            </span>
            <span className="flex items-center gap-2">
              <span className="text-energy-ink/60">Upgrade need:</span> <RatingBadge level={r.upgradeLevel} />
            </span>
          </div>
        </WhiteCard>

        <SeoSection title="How It Works">
          <p>
            We combine your selected demand type, growth scenario and time horizon into directional 0–100 risk scores.
            Data-centre-heavy demand and aggressive growth over longer horizons produce higher grid pressure, connection
            risk and upgrade requirements.
          </p>
        </SeoSection>

        <SeoSection title="Why It Matters">
          <p>
            <strong>Substations</strong> step voltages up and down and can become bottlenecks for new connections.{" "}
            <strong>Transmission networks</strong> move power across long distances and need reinforcement as demand
            shifts. <strong>Distribution networks</strong> deliver power locally and face pressure from clustered demand.{" "}
            <strong>Data centre connections</strong> can require very large, fast capacity that strains local networks.{" "}
            <strong>Infrastructure investment</strong> is needed across all of these to keep pace with AI growth.
          </p>
        </SeoSection>

        <SeoSection title="Limitations">
          <p>
            This tool models broad infrastructure scenarios and is not an official grid assessment. It does not use live
            network data, planning queues or regional capacity figures, and should not inform connection or planning
            decisions.
          </p>
        </SeoSection>

        <Tier3RelatedContent tool="grid-capacity" />

        <EnergyFAQ
          items={[
            {
              q: "Can the grid support AI growth?",
              a: "It can, but often only with investment. Rapid, clustered AI and data centre demand can outpace local network capacity, requiring upgrades to substations, transmission and distribution.",
            },
            {
              q: "Why are new substations needed?",
              a: "Large new loads such as data centres need capacity to connect safely. Where existing substations are at capacity, new or upgraded ones are required before connections can proceed.",
            },
            {
              q: "What limits electricity connections?",
              a: "Available network capacity, substation headroom, transmission constraints and connection queues all limit how quickly new demand can be connected.",
            },
          ]}
        />

        <div>
          <h3 className="font-display text-lg font-bold text-white mb-4">Explore more advanced AI energy tools</h3>
          <Tier3NavButtons current="/advanced-ai-energy-tools/grid-capacity" />
        </div>
      </EnergyContainer>
    </EnergyShell>
  );
}
