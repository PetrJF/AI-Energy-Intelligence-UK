import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Landmark } from "lucide-react";
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
import { Tier3RelatedContent, Tier3NavButtons, scoreToIndex } from "@/components/energy/Tier3UI";
import { RatingBadge, type RatingLevel } from "@/components/energy/Tier2UI";

export const Route = createFileRoute("/advanced-ai-energy-tools/energy-cost-society")({
  head: () => ({
    meta: [
      { title: "AI Energy Cost To Society Calculator UK | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Explore the wider infrastructure investment pressure created by large-scale AI deployment across generation, transmission, storage and data centres.",
      },
      { property: "og:title", content: "AI Energy Cost To Society Calculator UK | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content: "Understand the societal infrastructure investment pressure created by large-scale AI.",
      },
      { property: "og:url", content: "https://aienergyintelligence.co.uk/advanced-ai-energy-tools/energy-cost-society" },
    ],
    links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/advanced-ai-energy-tools/energy-cost-society" }],
    scripts: [
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"WebApplication\",\"name\":\"AI Energy Cost To Society Calculator UK\",\"applicationCategory\":\"BusinessApplication\",\"operatingSystem\":\"Any\",\"url\":\"https://aienergyintelligence.co.uk/advanced-ai-energy-tools/energy-cost-society\",\"description\":\"Explore the wider infrastructure investment pressure created by large-scale AI deployment across generation, transmission, storage and data centres.\",\"offers\":{\"@type\":\"Offer\",\"price\":\"0\",\"priceCurrency\":\"GBP\"},\"publisher\":{\"@type\":\"Organization\",\"name\":\"AI Energy Intelligence UK\"},\"isAccessibleForFree\":true,\"inLanguage\":\"en-GB\"}" },
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"BreadcrumbList\",\"itemListElement\":[{\"@type\":\"ListItem\",\"position\":1,\"name\":\"Home\",\"item\":\"https://aienergyintelligence.co.uk/\"},{\"@type\":\"ListItem\",\"position\":2,\"name\":\"Advanced Ai Energy Tools\",\"item\":\"https://aienergyintelligence.co.uk/advanced-ai-energy-tools\"},{\"@type\":\"ListItem\",\"position\":3,\"name\":\"Energy Cost Society\",\"item\":\"https://aienergyintelligence.co.uk/advanced-ai-energy-tools/energy-cost-society\"}]}" },
    ],
  }),
  component: EnergyCostSociety,
});

const LMH: Record<string, number> = { low: 0.5, medium: 1, high: 1.7 };
const SECTOR_FACTOR: Record<string, number> = {
  consumer: 0.8,
  business: 1.1,
  public: 1.0,
  economy: 1.6,
};

function level(score: number): RatingLevel {
  return scoreToIndex(score);
}

function EnergyCostSociety() {
  const [adoption, setAdoption] = useState("medium");
  const [sector, setSector] = useState("economy");
  const [year, setYear] = useState("2035");

  const r = useMemo(() => {
    const t = Math.max(0, parseInt(year) - 2026);
    const base = LMH[adoption] * SECTOR_FACTOR[sector] * (1 + t * 0.1);

    const investPressure = Math.min(100, Math.round(base * 32));
    const systemImpact = Math.min(100, Math.round(base * 30 + 6));
    const gridUpgrade = Math.min(100, Math.round(base * 34));
    const publicInvest = Math.min(100, Math.round(base * 28 + 4));

    return {
      investPressure,
      systemImpact,
      gridUpgrade,
      publicInvest,
      investLevel: level(investPressure),
      systemLevel: level(systemImpact),
      gridLevel: level(gridUpgrade),
      publicLevel: level(publicInvest),
    };
  }, [adoption, sector, year]);

  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "AI Energy Intelligence UK", to: "/" },
          { label: "Advanced AI Energy Intelligence", to: "/advanced-ai-energy-tools" },
          { label: "AI Energy Cost To Society Calculator" },
        ]}
      />
      <EnergyHero
        eyebrow="Tool 15"
        title="AI Energy Cost To Society Calculator"
        intro="Explore the wider infrastructure costs associated with large-scale AI deployment, including generation, transmission, distribution, energy storage and data centre construction."
        icon={Landmark}
      />

      <EnergyContainer className="py-10 space-y-8">
        <DisclaimerBanner>
          <strong className="text-white">Important:</strong> This tool is designed to demonstrate scale and complexity
          rather than provide investment forecasts.
        </DisclaimerBanner>

        <div className="grid lg:grid-cols-5 gap-6">
          <WhiteCard className="lg:col-span-3">
            <h3 className="font-display text-lg font-bold mb-5">Your scenario</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <EField label="AI adoption level">
                <ESelect value={adoption} onChange={(e) => setAdoption(e.target.value)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </ESelect>
              </EField>
              <EField label="Sector">
                <ESelect value={sector} onChange={(e) => setSector(e.target.value)}>
                  <option value="consumer">Consumer</option>
                  <option value="business">Business</option>
                  <option value="public">Public Sector</option>
                  <option value="economy">Whole Economy</option>
                </ESelect>
              </EField>
              <EField label="Time horizon">
                <ESelect value={year} onChange={(e) => setYear(e.target.value)}>
                  {["2026", "2030", "2035", "2040"].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </ESelect>
              </EField>
            </div>
          </WhiteCard>

          <div className="lg:col-span-2 grid grid-cols-2 gap-3 content-start">
            <DataCard label="Investment pressure" value={`${r.investPressure}/100`} sub={r.investLevel} accent />
            <DataCard label="Energy system impact" value={`${r.systemImpact}/100`} sub={r.systemLevel} />
            <DataCard label="Grid upgrade requirement" value={`${r.gridUpgrade}/100`} sub={r.gridLevel} />
            <DataCard label="Public investment pressure" value={`${r.publicInvest}/100`} sub={r.publicLevel} />
          </div>
        </div>

        <WhiteCard>
          <h3 className="font-display text-lg font-bold">Your result</h3>
          <p className="mt-2 text-sm text-energy-ink/80 leading-relaxed">
            Under a <strong>{adoption}-adoption</strong> scenario, significant investment may be required across
            generation, transmission, storage and data centre infrastructure.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <span className="flex items-center gap-2">
              <span className="text-energy-ink/60">Investment pressure:</span> <RatingBadge level={r.investLevel} />
            </span>
            <span className="flex items-center gap-2">
              <span className="text-energy-ink/60">Grid upgrade:</span> <RatingBadge level={r.gridLevel} />
            </span>
          </div>
        </WhiteCard>

        <SeoSection title="How It Works">
          <p>
            We combine your AI adoption level, sector and time horizon into directional 0–100 pressure scores covering
            investment, energy system impact, grid upgrades and public investment. Whole-economy, high-adoption,
            longer-horizon scenarios produce the highest pressure.
          </p>
        </SeoSection>

        <SeoSection title="Why It Matters">
          <p>
            Large-scale AI touches the entire energy system. <strong>Electricity generation</strong> must expand to meet
            new demand. <strong>Transmission upgrades</strong> move that power to where it is needed.{" "}
            <strong>Distribution upgrades</strong> deliver it locally. <strong>Energy storage</strong> balances
            variability, and <strong>data centre construction</strong> requires its own significant capital — much of
            which ultimately affects public infrastructure and bills.
          </p>
        </SeoSection>

        <SeoSection title="Limitations">
          <p>
            This tool is designed to demonstrate scale and complexity rather than provide investment forecasts. It does
            not produce monetary figures and should not be used for budgeting or investment decisions.
          </p>
        </SeoSection>

        <Tier3RelatedContent tool="energy-cost-society" />

        <EnergyFAQ
          items={[
            {
              q: "Who pays for AI infrastructure?",
              a: "A mix of private operators, energy companies and ultimately consumers and taxpayers through bills and public investment in shared grid infrastructure.",
            },
            {
              q: "Could AI increase energy investment requirements?",
              a: "Yes. Rapid AI growth can accelerate the need for new generation, grid reinforcement and storage, increasing overall energy system investment.",
            },
            {
              q: "Why are grid upgrades expensive?",
              a: "They involve large-scale physical infrastructure — substations, cables, transformers and transmission lines — plus planning, land and long construction timelines.",
            },
          ]}
        />

        <div>
          <h3 className="font-display text-lg font-bold text-white mb-4">Explore more advanced AI energy tools</h3>
          <Tier3NavButtons current="/advanced-ai-energy-tools/energy-cost-society" />
        </div>
      </EnergyContainer>
    </EnergyShell>
  );
}
