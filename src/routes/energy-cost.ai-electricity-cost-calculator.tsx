import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Zap } from "lucide-react";
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
  ESelect,
  gbp,
  num,
} from "@/components/energy/EnergyUI";
import { ToolPageFooter, breadcrumbLd, faqLd, toolLd } from "@/components/energy/hub";

const PATH = "/energy-cost/ai-electricity-cost-calculator";
const UK_HOME_ANNUAL_KWH = 2700;

const MODELS = {
  small: { label: "Small / efficient model", kwh: 0.0003 },
  medium: { label: "Medium model (default)", kwh: 0.001 },
  large: { label: "Large frontier model", kwh: 0.005 },
} as const;
type ModelKey = keyof typeof MODELS;

const FAQ = [
  {
    q: "Does this show up on my electricity bill?",
    a: "Usually not directly — most AI compute runs in data centres. This estimates the underlying electricity demand behind your AI usage, not your home meter reading.",
  },
  {
    q: "What electricity price should I use?",
    a: "The default of £0.27 per kWh reflects a typical UK domestic rate. Businesses on commercial tariffs can enter their own figure.",
  },
  {
    q: "How accurate is this?",
    a: "It's directional. Real AI energy use varies by model size, hardware and data centre efficiency, so treat the result as an indication of scale.",
  },
];

export const Route = createFileRoute("/energy-cost/ai-electricity-cost-calculator")({
  head: () => ({
    meta: [
      { title: "AI Electricity Cost Calculator UK | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Estimate the daily, monthly and annual electricity consumption and cost of your AI prompts, with a UK household energy comparison.",
      },
      { property: "og:title", content: "AI Electricity Cost Calculator UK | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content: "Estimate AI electricity use and cost in kWh and £ with a UK household comparison.",
      },
      { property: "og:url", content: `https://aienergyintelligence.co.uk${PATH}` },
    ],
    links: [{ rel: "canonical", href: `https://aienergyintelligence.co.uk${PATH}` }],
    scripts: [
      toolLd("AI Electricity Cost Calculator", PATH, "Estimate the electricity cost of AI prompts in the UK."),
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Energy Cost Hub", path: "/energy-cost" },
        { name: "AI Electricity Cost Calculator", path: PATH },
      ]),
      faqLd(FAQ),
    ],
  }),
  component: Calc,
});

function Calc() {
  const [prompts, setPrompts] = useState(40);
  const [users, setUsers] = useState(1);
  const [model, setModel] = useState<ModelKey>("medium");
  const [price, setPrice] = useState(0.27);

  const r = useMemo(() => {
    const perDay = prompts * users * MODELS[model].kwh;
    const annual = perDay * 365;
    return {
      daily: perDay,
      monthly: perDay * 30,
      annual,
      annualCost: annual * price,
      monthlyCost: perDay * 30 * price,
      homes: annual / UK_HOME_ANNUAL_KWH,
    };
  }, [prompts, users, model, price]);

  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "UK AI Energy Intelligence Centre", to: "/" },
          { label: "Energy Cost Hub", to: "/energy-cost" },
          { label: "AI Electricity Cost Calculator" },
        ]}
      />
      <EnergyHero
        eyebrow="Energy Cost Hub"
        title="AI Electricity Cost Calculator"
        intro="Estimate the electricity consumption and cost of your AI prompts across daily, monthly and annual periods, using transparent UK assumptions."
        icon={Zap}
      />

      <EnergyContainer className="py-10 space-y-8">
        <DisclaimerBanner />

        <div className="grid lg:grid-cols-5 gap-6">
          <WhiteCard className="lg:col-span-3">
            <h3 className="font-display text-lg font-bold mb-5">Your AI usage</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <EField label="Prompts per day">
                <ENumber min={0} value={prompts} onChange={(e) => setPrompts(+e.target.value)} />
              </EField>
              <EField label="Number of users">
                <ENumber min={1} value={users} onChange={(e) => setUsers(+e.target.value)} />
              </EField>
              <EField label="AI model type">
                <ESelect value={model} onChange={(e) => setModel(e.target.value as ModelKey)}>
                  {Object.entries(MODELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </ESelect>
              </EField>
              <EField label="Electricity price (£ per kWh)" hint="UK average ≈ £0.27">
                <ENumber min={0} step={0.01} value={price} onChange={(e) => setPrice(+e.target.value)} />
              </EField>
            </div>
          </WhiteCard>

          <div className="lg:col-span-2 grid grid-cols-2 gap-3 content-start">
            <DataCard label="Daily" value={`${num.format(r.daily)} kWh`} />
            <DataCard label="Monthly" value={`${num.format(r.monthly)} kWh`} />
            <DataCard label="Annual" value={`${num.format(r.annual)} kWh`} accent />
            <DataCard label="Annual cost" value={gbp.format(r.annualCost)} accent />
            <DataCard label="Monthly cost" value={gbp.format(r.monthlyCost)} />
            <DataCard label="UK homes equiv." value={`${num.format(r.homes)}×`} sub="annual household use" />
          </div>
        </div>

        <WhiteCard>
          <h3 className="font-display text-lg font-bold">Plain English explanation</h3>
          <p className="mt-2 text-sm text-energy-ink/80 leading-relaxed">
            Based on your inputs, this AI usage could consume roughly{" "}
            <strong>{num.format(r.annual)} kWh per year</strong>, costing about{" "}
            <strong>{gbp.format(r.annualCost)}</strong>. That is similar to{" "}
            <strong>{num.format(r.homes)}×</strong> a typical UK household's annual electricity use.
          </p>
        </WhiteCard>

        <SeoSection title="How This Calculator Works">
          <p>
            We multiply prompts per day by the number of users and a per-prompt energy assumption for your chosen model
            (small 0.0003 kWh, medium 0.001 kWh, large 0.005 kWh), then scale to monthly (×30) and annual (×365) totals.
            Cost is total kWh × your electricity price.
          </p>
        </SeoSection>
        <SeoSection title="What The Result Means">
          <p>
            The annual figure shows the approximate electricity behind your AI activity, and the household comparison
            translates it into familiar terms. Cost uses the electricity price you entered.
          </p>
        </SeoSection>
        <SeoSection title="Limitations">
          <p>
            Real AI energy use varies by model, data centre, cooling and hardware. These are simplified public estimates
            for scale, not precise metering.
          </p>
        </SeoSection>

        <ToolPageFooter
          current={PATH}
          source="ai-electricity-cost"
          inputs={{ prompts, users, model, price }}
          resultSummary={{ annualKwh: r.annual, annualCost: r.annualCost }}
        />

        <EnergyFAQ items={FAQ} />
      </EnergyContainer>
    </EnergyShell>
  );
}
