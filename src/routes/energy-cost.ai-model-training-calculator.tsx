import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Cpu } from "lucide-react";
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

const PATH = "/energy-cost/ai-model-training-calculator";
const UK_CARBON_FACTOR = 0.207; // kg CO2 / kWh
const UK_HOME_ANNUAL_KWH = 2700;

// kW draw per GPU including overhead
const GPUS = {
  a100: { label: "NVIDIA A100 (≈0.4 kW)", kw: 0.4 },
  h100: { label: "NVIDIA H100 (≈0.7 kW)", kw: 0.7 },
  h200: { label: "NVIDIA H200 (≈1.0 kW)", kw: 1.0 },
} as const;
type GpuKey = keyof typeof GPUS;
const PUE = 1.4;

const FAQ = [
  {
    q: "What does training energy depend on?",
    a: "Mostly the number and type of GPUs and how long they run, plus data centre overhead (cooling, power conversion), captured here by a PUE of 1.4.",
  },
  {
    q: "How is carbon estimated?",
    a: "Total kWh × the UK grid average of 0.207 kg CO₂ per kWh. Carbon will be lower on greener grids or with renewable power purchase agreements.",
  },
];

export const Route = createFileRoute("/energy-cost/ai-model-training-calculator")({
  head: () => ({
    meta: [
      { title: "AI Model Training Cost Calculator UK | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Estimate the energy consumption, electricity cost, carbon impact and infrastructure of training an AI model from GPU count, type and training hours.",
      },
      { property: "og:title", content: "AI Model Training Cost Calculator UK | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content: "Estimate energy, cost, carbon and infrastructure of an AI training run.",
      },
      { property: "og:url", content: `https://aienergyintelligence.co.uk${PATH}` },
    ],
    links: [{ rel: "canonical", href: `https://aienergyintelligence.co.uk${PATH}` }],
    scripts: [
      toolLd("AI Model Training Cost Calculator", PATH, "Estimate energy, cost and carbon of training an AI model."),
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Energy Cost Hub", path: "/energy-cost" },
        { name: "AI Model Training Cost Calculator", path: PATH },
      ]),
      faqLd(FAQ),
    ],
  }),
  component: Calc,
});

function Calc() {
  const [hours, setHours] = useState(720);
  const [gpus, setGpus] = useState(256);
  const [gpu, setGpu] = useState<GpuKey>("h100");
  const [price, setPrice] = useState(0.18);

  const r = useMemo(() => {
    const itKwh = hours * gpus * GPUS[gpu].kw;
    const kwh = itKwh * PUE;
    return {
      kwh,
      cost: kwh * price,
      co2: (kwh * UK_CARBON_FACTOR) / 1000,
      homes: kwh / UK_HOME_ANNUAL_KWH,
      peakMw: (gpus * GPUS[gpu].kw * PUE) / 1000,
    };
  }, [hours, gpus, gpu, price]);

  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "UK AI Energy Intelligence Centre", to: "/" },
          { label: "Energy Cost Hub", to: "/energy-cost" },
          { label: "AI Model Training Cost Calculator" },
        ]}
      />
      <EnergyHero
        eyebrow="Energy Cost Hub"
        title="AI Model Training Cost Calculator"
        intro="Estimate the energy, electricity cost, carbon footprint and infrastructure required to train an AI model based on GPU count, GPU type and training hours."
        icon={Cpu}
      />

      <EnergyContainer className="py-10 space-y-8">
        <DisclaimerBanner />

        <div className="grid lg:grid-cols-5 gap-6">
          <WhiteCard className="lg:col-span-3">
            <h3 className="font-display text-lg font-bold mb-5">Training run</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <EField label="Training hours">
                <ENumber min={0} value={hours} onChange={(e) => setHours(+e.target.value)} />
              </EField>
              <EField label="Number of GPUs">
                <ENumber min={1} value={gpus} onChange={(e) => setGpus(+e.target.value)} />
              </EField>
              <EField label="GPU type">
                <ESelect value={gpu} onChange={(e) => setGpu(e.target.value as GpuKey)}>
                  {Object.entries(GPUS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </ESelect>
              </EField>
              <EField label="Electricity rate (£ per kWh)" hint="commercial ≈ £0.18">
                <ENumber min={0} step={0.01} value={price} onChange={(e) => setPrice(+e.target.value)} />
              </EField>
            </div>
          </WhiteCard>

          <div className="lg:col-span-2 grid grid-cols-2 gap-3 content-start">
            <DataCard label="Energy" value={`${num.format(r.kwh)} kWh`} accent />
            <DataCard label="Cost" value={gbp.format(r.cost)} accent />
            <DataCard label="Carbon" value={`${num.format(r.co2)} t CO₂`} />
            <DataCard label="Peak power" value={`${num.format(r.peakMw)} MW`} sub="incl. PUE 1.4" />
            <DataCard label="UK homes equiv." value={`${num.format(r.homes)}×`} sub="annual household use" />
          </div>
        </div>

        <WhiteCard>
          <h3 className="font-display text-lg font-bold">Infrastructure requirements</h3>
          <p className="mt-2 text-sm text-energy-ink/80 leading-relaxed">
            This run draws roughly <strong>{num.format(r.peakMw)} MW</strong> of continuous power and consumes about{" "}
            <strong>{num.format(r.kwh)} kWh</strong> — equivalent to <strong>{num.format(r.homes)}×</strong> a UK
            household's annual electricity. Sustained loads at this scale typically require dedicated grid connections,
            high-density cooling and backup power.
          </p>
        </WhiteCard>

        <SeoSection title="How This Calculator Works">
          <p>
            IT energy = training hours × GPUs × per-GPU power. We multiply by a PUE of {PUE} for cooling and overhead.
            Cost = total kWh × your electricity rate; carbon = kWh × {UK_CARBON_FACTOR} kg CO₂/kWh.
          </p>
        </SeoSection>
        <SeoSection title="What The Result Means">
          <p>
            The energy and cost figures size a single training run; peak power indicates the connection and cooling
            capacity the hardware needs while running.
          </p>
        </SeoSection>
        <SeoSection title="Limitations">
          <p>Real runs vary with utilisation, networking, idle time and hardware generation. Use as a planning estimate.</p>
        </SeoSection>

        <ToolPageFooter
          current={PATH}
          source="ai-model-training"
          inputs={{ hours, gpus, gpu, price }}
          resultSummary={{ kwh: r.kwh, cost: r.cost, co2: r.co2 }}
        />

        <EnergyFAQ items={FAQ} />
      </EnergyContainer>
    </EnergyShell>
  );
}
