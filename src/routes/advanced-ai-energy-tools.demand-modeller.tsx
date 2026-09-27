import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LineChart } from "lucide-react";
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
import { Tier3RelatedContent, Tier3NavButtons, TrendChart } from "@/components/energy/Tier3UI";

export const Route = createFileRoute("/advanced-ai-energy-tools/demand-modeller")({
  head: () => ({
    meta: [
      { title: "AI Electricity Demand Modeller | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Model long-term UK electricity demand to 2040 across AI adoption, population growth, data centre expansion and electrification with scenario charts.",
      },
      { property: "og:title", content: "AI Electricity Demand Modeller | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content: "Advanced AI-era electricity demand forecasting to 2040 with trend charts.",
      },
      { property: "og:url", content: "https://aienergyintelligence.co.uk/advanced-ai-energy-tools/demand-modeller" },
    ],
    links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/advanced-ai-energy-tools/demand-modeller" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "AI Electricity Demand Modeller",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Any",
          url: "https://aienergyintelligence.co.uk/advanced-ai-energy-tools/demand-modeller",
          description:
            "Model long-term UK electricity demand to 2040 across AI adoption, population growth, data centre expansion and electrification with scenario charts.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
          publisher: { "@type": "Organization", name: "AI Energy Intelligence UK" },
        }),
      },
    ],
  }),
  component: DemandModeller,
});

const LMH: Record<string, number> = { low: 0.5, medium: 1, high: 1.7 };

function scenarioRating(index: number): string {
  if (index < 115) return "Stable";
  if (index < 140) return "Growing";
  if (index < 175) return "Significant Growth";
  return "Major Expansion";
}

function DemandModeller() {
  const [year, setYear] = useState("2035");
  const [adoption, setAdoption] = useState("medium");
  const [population, setPopulation] = useState("medium");
  const [dataCentre, setDataCentre] = useState("medium");
  const [electrification, setElectrification] = useState("medium");

  const r = useMemo(() => {
    const targetYear = parseInt(year);
    const compute = (yr: number) => {
      const t = Math.max(0, yr - 2026);
      const demandIndex =
        100 +
        t *
          (LMH[adoption] * 2.2 +
            LMH[population] * 0.6 +
            LMH[dataCentre] * 2.6 +
            LMH[electrification] * 1.6);
      return Math.round(demandIndex);
    };

    const years = [2026, 2030, 2035, 2040];
    const series = years.map((y) => ({ label: `${y}`, value: compute(y) }));
    const demandIndex = compute(targetYear);

    const infraPressure = Math.min(100, Math.round((demandIndex - 100) * 1.1));
    const dcDemand = Math.min(100, Math.round(LMH[dataCentre] * 30 + (demandIndex - 100) * 0.5));
    const capacityReq = Math.round((demandIndex - 100) * 0.45); // indicative GW-equivalent index

    return {
      demandIndex,
      series,
      infraPressure,
      dcDemand,
      capacityReq,
      rating: scenarioRating(demandIndex),
    };
  }, [year, adoption, population, dataCentre, electrification]);

  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "AI Energy Intelligence UK", to: "/" },
          { label: "Advanced AI Energy Intelligence", to: "/advanced-ai-energy-tools" },
          { label: "AI Electricity Demand Modeller" },
        ]}
      />
      <EnergyHero
        eyebrow="Tool 14"
        title="AI Electricity Demand Modeller"
        intro="A more advanced forecasting tool than the demand calculator. Model long-term electricity demand to 2040 by combining AI adoption, population growth, data centre expansion and wider electrification."
        icon={LineChart}
      />

      <EnergyContainer className="py-10 space-y-8">
        <DisclaimerBanner>
          <strong className="text-white">Important:</strong> This modeller produces educational scenario indices only.
          It is not an official electricity demand forecast.
        </DisclaimerBanner>

        <div className="grid lg:grid-cols-5 gap-6">
          <WhiteCard className="lg:col-span-3">
            <h3 className="font-display text-lg font-bold mb-5">Your scenario</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <EField label="Year">
                <ESelect value={year} onChange={(e) => setYear(e.target.value)}>
                  {Array.from({ length: 15 }, (_, i) => 2026 + i).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </ESelect>
              </EField>
              <EField label="AI adoption rate">
                <ESelect value={adoption} onChange={(e) => setAdoption(e.target.value)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </ESelect>
              </EField>
              <EField label="Population growth">
                <ESelect value={population} onChange={(e) => setPopulation(e.target.value)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </ESelect>
              </EField>
              <EField label="Data centre growth">
                <ESelect value={dataCentre} onChange={(e) => setDataCentre(e.target.value)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </ESelect>
              </EField>
              <EField label="Electrification level">
                <ESelect value={electrification} onChange={(e) => setElectrification(e.target.value)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </ESelect>
              </EField>
            </div>
          </WhiteCard>

          <div className="lg:col-span-2 grid grid-cols-2 gap-3 content-start">
            <DataCard label="Electricity demand index" value={`${r.demandIndex}`} sub={r.rating} accent />
            <DataCard label="Infrastructure pressure" value={`${r.infraPressure}/100`} />
            <DataCard label="Data centre demand" value={`${r.dcDemand}/100`} />
            <DataCard label="Capacity requirement" value={`+${r.capacityReq} idx`} sub="vs 2026" />
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg font-bold text-white mb-4">Demand trend & scenario comparison</h3>
          <TrendChart data={r.series} unit="index" />
        </div>

        <WhiteCard>
          <h3 className="font-display text-lg font-bold">Your result</h3>
          <p className="mt-2 text-sm text-energy-ink/80 leading-relaxed">
            The selected scenario suggests <strong>{r.rating.toLowerCase()}</strong> in electricity demand by {year},
            primarily driven by expanding AI infrastructure and broader electrification trends.
          </p>
        </WhiteCard>

        <SeoSection title="How It Works">
          <p>
            We start from a 2026 baseline index of 100 and grow it each year based on the weighted contribution of AI
            adoption, population growth, data centre expansion and electrification. The trend chart shows the resulting
            index across 2026, 2030, 2035 and 2040.
          </p>
        </SeoSection>

        <SeoSection title="Why It Matters">
          <p>
            Forecasting is difficult because AI adoption, hardware efficiency and policy all change rapidly. AI adoption
            can sharply increase data-centre demand, while EV growth and heat pumps add large new electrical loads that
            interact with AI demand on the same networks — compounding pressure on generation and grid capacity.
          </p>
        </SeoSection>

        <SeoSection title="Limitations">
          <p>
            This modeller produces relative indices, not absolute terawatt-hour forecasts. Real demand depends on
            efficiency gains, behavioural change, economic conditions and policy that no simple model can capture.
          </p>
        </SeoSection>

        <Tier3RelatedContent tool="demand-modeller" />

        <EnergyFAQ
          items={[
            {
              q: "How much electricity could AI use by 2040?",
              a: "Estimates vary widely. Under high-adoption scenarios AI and data centres could add substantial demand, but efficiency improvements could offset part of that growth.",
            },
            {
              q: "What assumptions matter most?",
              a: "Data centre growth and AI adoption rates have the biggest impact in this model, followed by electrification and population growth.",
            },
            {
              q: "Why are forecasts uncertain?",
              a: "Technology, efficiency, policy and behaviour all change quickly. Small changes in assumptions compound over many years, producing very different long-term outcomes.",
            },
          ]}
        />

        <div>
          <h3 className="font-display text-lg font-bold text-white mb-4">Explore more advanced AI energy tools</h3>
          <Tier3NavButtons current="/advanced-ai-energy-tools/demand-modeller" />
        </div>
      </EnergyContainer>
    </EnergyShell>
  );
}
