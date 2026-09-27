import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PiggyBank } from "lucide-react";
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
  ENumber,
  gbp,
  num,
} from "@/components/energy/EnergyUI";
import { ToolPageFooter, breadcrumbLd, faqLd, toolLd } from "@/components/energy/hub";

const PATH = "/business/ai-energy-savings-calculator";
const UK_CARBON_FACTOR = 0.207; // kg CO2 / kWh

const FAQ = [
  {
    q: "What kind of AI optimisation does this model?",
    a: "AI-driven efficiency such as smart HVAC, demand shifting, predictive maintenance and load optimisation that cuts electricity use.",
  },
  {
    q: "How is carbon reduction calculated?",
    a: "kWh saved × the UK grid average of 0.207 kg CO₂ per kWh, shown in tonnes per year.",
  },
];

export const Route = createFileRoute("/business/ai-energy-savings-calculator")({
  head: () => ({
    meta: [
      { title: "AI Energy Savings Calculator UK | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Estimate the annual cost savings, carbon reduction and payback from using AI to optimise your business energy use.",
      },
      { property: "og:title", content: "AI Energy Savings Calculator UK | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content: "Estimate annual savings, carbon reduction and payback from AI energy optimisation.",
      },
      { property: "og:url", content: `https://aienergyintelligence.co.uk${PATH}` },
    ],
    links: [{ rel: "canonical", href: `https://aienergyintelligence.co.uk${PATH}` }],
    scripts: [
      toolLd("AI Energy Savings Calculator", PATH, "Estimate savings and carbon reduction from AI energy optimisation."),
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Business Hub", path: "/business" },
        { name: "AI Energy Savings Calculator", path: PATH },
      ]),
      faqLd(FAQ),
    ],
  }),
  component: Calc,
});

function Calc() {
  const [usage, setUsage] = useState(500000);
  const [optimisation, setOptimisation] = useState(12);
  const [price, setPrice] = useState(0.25);
  const [investment, setInvestment] = useState(20000);

  const r = useMemo(() => {
    const kwhSaved = usage * (optimisation / 100);
    const savings = kwhSaved * price;
    return {
      kwhSaved,
      savings,
      co2: (kwhSaved * UK_CARBON_FACTOR) / 1000,
      paybackYears: savings > 0 ? investment / savings : 0,
    };
  }, [usage, optimisation, price, investment]);

  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "UK AI Energy Intelligence Centre", to: "/" },
          { label: "Business Hub", to: "/business" },
          { label: "AI Energy Savings Calculator" },
        ]}
      />
      <EnergyHero
        eyebrow="Business Hub"
        title="AI Energy Savings Calculator"
        intro="Estimate the annual cost savings, carbon reduction and payback period from using AI to optimise your business energy consumption."
        icon={PiggyBank}
      />

      <EnergyContainer className="py-10 space-y-8">
        <DisclaimerBanner />

        <div className="grid lg:grid-cols-5 gap-6">
          <WhiteCard className="lg:col-span-3">
            <h3 className="font-display text-lg font-bold mb-5">Your energy</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <EField label="Current annual energy use (kWh)">
                <ENumber min={0} value={usage} onChange={(e) => setUsage(+e.target.value)} />
              </EField>
              <EField label={`AI optimisation: ${optimisation}%`} hint="typical 5–20%">
                <input
                  type="range"
                  min={1}
                  max={40}
                  value={optimisation}
                  onChange={(e) => setOptimisation(+e.target.value)}
                  className="w-full cursor-pointer"
                  style={{ accentColor: "#1f9bff" }}
                />
              </EField>
              <EField label="Electricity price (£ per kWh)">
                <ENumber min={0} step={0.01} value={price} onChange={(e) => setPrice(+e.target.value)} />
              </EField>
              <EField label="Implementation cost (£)" hint="for payback">
                <ENumber min={0} value={investment} onChange={(e) => setInvestment(+e.target.value)} />
              </EField>
            </div>
          </WhiteCard>

          <div className="lg:col-span-2 grid grid-cols-2 gap-3 content-start">
            <DataCard label="Annual savings" value={gbp.format(r.savings)} accent />
            <DataCard label="Energy saved" value={`${num.format(r.kwhSaved)} kWh`} accent />
            <DataCard label="Carbon reduction" value={`${num.format(r.co2)} t CO₂`} sub="per year" />
            <DataCard label="Payback" value={`${num.format(r.paybackYears)} yr`} />
          </div>
        </div>

        <WhiteCard>
          <h3 className="font-display text-lg font-bold">Plain English summary</h3>
          <p className="mt-2 text-sm text-energy-ink/80 leading-relaxed">
            Cutting energy use by <strong>{optimisation}%</strong> saves about{" "}
            <strong>{num.format(r.kwhSaved)} kWh</strong> and <strong>{gbp.format(r.savings)}</strong> per year, avoiding
            roughly <strong>{num.format(r.co2)} tonnes of CO₂</strong>. At your stated cost, that pays back in about{" "}
            <strong>{num.format(r.paybackYears)} years</strong>.
          </p>
        </WhiteCard>

        <SeoSection title="How This Calculator Works">
          <p>
            Energy saved = current usage × optimisation %. Savings = kWh saved × electricity price. Carbon = kWh saved ×
            {" "}
            {UK_CARBON_FACTOR} kg CO₂/kWh. Payback = implementation cost ÷ annual savings.
          </p>
        </SeoSection>
        <SeoSection title="What The Result Means">
          <p>
            The savings and carbon figures show the upside of AI-driven efficiency; payback indicates how quickly the
            investment is recovered.
          </p>
        </SeoSection>
        <SeoSection title="Limitations">
          <p>Achievable optimisation varies by sector and starting efficiency. Validate with a site energy audit.</p>
        </SeoSection>

        <ToolPageFooter
          current={PATH}
          source="ai-energy-savings"
          inputs={{ usage, optimisation, price, investment }}
          resultSummary={{ savings: r.savings, co2: r.co2, paybackYears: r.paybackYears }}
        />

        <EnergyFAQ items={FAQ} />
      </EnergyContainer>
    </EnergyShell>
  );
}
