import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Leaf } from "lucide-react";
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
  num,
} from "@/components/energy/EnergyUI";
import { Tier3RelatedContent, Tier3NavButtons } from "@/components/energy/Tier3UI";

export const Route = createFileRoute("/advanced-ai-energy-tools/carbon-impact")({
  head: () => ({
    meta: [
      { title: "AI Carbon Impact Calculator UK | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Estimate the potential carbon footprint of AI usage across prompts, images and video, with grid mix options and household comparisons.",
      },
      { property: "og:title", content: "AI Carbon Impact Calculator UK | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content: "Estimate AI electricity consumption and CO₂ emissions with UK grid mix scenarios.",
      },
      { property: "og:url", content: "https://aienergyintelligence.co.uk/advanced-ai-energy-tools/carbon-impact" },
    ],
    links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/advanced-ai-energy-tools/carbon-impact" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "AI Carbon Impact Calculator",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Any",
          url: "https://aienergyintelligence.co.uk/advanced-ai-energy-tools/carbon-impact",
          description:
            "Estimate the potential carbon footprint of AI usage across prompts, images and video, with grid mix options and household comparisons.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
          publisher: { "@type": "Organization", name: "AI Energy Intelligence UK" },
        }),
      },
    ],
  }),
  component: CarbonImpactCalc,
});

type Level = "light" | "medium" | "heavy";
type Period = "daily" | "monthly" | "annual";

const LEVEL_FACTOR: Record<Level, number> = { light: 0.6, medium: 1, heavy: 1.8 };

// Indicative energy per action (kWh) — educational estimates.
const KWH = { text: 0.0008, image: 0.004, video: 0.06 };

// Grid carbon intensity (kg CO2 per kWh) — indicative.
const GRID: Record<string, number> = {
  uk: 0.21,
  renewable: 0.05,
  fossil: 0.45,
  nuclear: 0.08,
  custom: 0,
};

const PERIOD_DAYS: Record<Period, number> = { daily: 1, monthly: 30, annual: 365 };

function CarbonImpactCalc() {
  const [texts, setTexts] = useState(50);
  const [images, setImages] = useState(10);
  const [videos, setVideos] = useState(1);
  const [users, setUsers] = useState(1);
  const [level, setLevel] = useState<Level>("medium");
  const [grid, setGrid] = useState("uk");
  const [customIntensity, setCustomIntensity] = useState(0.2);
  const [period, setPeriod] = useState<Period>("annual");

  const r = useMemo(() => {
    const factor = LEVEL_FACTOR[level];
    const perDayKwh = (texts * KWH.text + images * KWH.image + videos * KWH.video) * factor * users;
    const days = PERIOD_DAYS[period];
    const periodKwh = perDayKwh * days;
    const annualKwh = perDayKwh * 365;

    const intensity = grid === "custom" ? customIntensity : GRID[grid];
    const periodCo2 = periodKwh * intensity;
    const annualCo2 = annualKwh * intensity;

    // Comparisons (indicative)
    const petrolMiles = annualCo2 / 0.39; // ~0.39 kg CO2 per mile (petrol car)
    const ukHomeElec = annualKwh / 2700; // avg UK home ~2700 kWh/yr
    const trees = annualCo2 / 21; // ~21 kg CO2 absorbed per tree per year
    const ukHouseholdCarbon = annualCo2 / 2200; // ~2.2 t CO2 per household energy/yr

    return {
      periodKwh,
      annualKwh,
      periodCo2,
      annualCo2,
      petrolMiles,
      ukHomeElec,
      trees,
      ukHouseholdCarbon,
    };
  }, [texts, images, videos, users, level, grid, customIntensity, period]);

  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "AI Energy Intelligence UK", to: "/" },
          { label: "Advanced AI Energy Intelligence", to: "/advanced-ai-energy-tools" },
          { label: "AI Carbon Impact Calculator" },
        ]}
      />
      <EnergyHero
        eyebrow="Tool 11"
        title="AI Carbon Impact Calculator"
        intro="Estimate the potential carbon footprint associated with AI usage. Combine your daily prompts, images and video generations with an electricity grid mix to see indicative emissions and real-world comparisons."
        icon={Leaf}
      />

      <EnergyContainer className="py-10 space-y-8">
        <DisclaimerBanner>
          <strong className="text-white">Important:</strong> This calculator provides broad educational estimates only.
          Actual emissions depend heavily on electricity generation sources and data centre efficiency.
        </DisclaimerBanner>

        <div className="grid lg:grid-cols-5 gap-6">
          <WhiteCard className="lg:col-span-3">
            <h3 className="font-display text-lg font-bold mb-5">Your AI usage</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <EField label="Text prompts per day">
                <ENumber min={0} value={texts} onChange={(e) => setTexts(+e.target.value)} />
              </EField>
              <EField label="Image generations per day">
                <ENumber min={0} value={images} onChange={(e) => setImages(+e.target.value)} />
              </EField>
              <EField label="Video generations per day">
                <ENumber min={0} value={videos} onChange={(e) => setVideos(+e.target.value)} />
              </EField>
              <EField label="Number of users">
                <ENumber min={1} value={users} onChange={(e) => setUsers(+e.target.value)} />
              </EField>
              <EField label="Usage level">
                <ESelect value={level} onChange={(e) => setLevel(e.target.value as Level)}>
                  <option value="light">Light</option>
                  <option value="medium">Medium</option>
                  <option value="heavy">Heavy</option>
                </ESelect>
              </EField>
              <EField label="Electricity grid mix">
                <ESelect value={grid} onChange={(e) => setGrid(e.target.value)}>
                  <option value="uk">UK Average</option>
                  <option value="renewable">Renewable Heavy</option>
                  <option value="fossil">Fossil Heavy</option>
                  <option value="nuclear">Nuclear Supported</option>
                  <option value="custom">Custom</option>
                </ESelect>
              </EField>
              {grid === "custom" && (
                <EField label="Custom carbon intensity" hint="kg CO₂ per kWh">
                  <ENumber
                    min={0}
                    step={0.01}
                    value={customIntensity}
                    onChange={(e) => setCustomIntensity(+e.target.value)}
                  />
                </EField>
              )}
              <EField label="Time period">
                <ESelect value={period} onChange={(e) => setPeriod(e.target.value as Period)}>
                  <option value="daily">Daily</option>
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                </ESelect>
              </EField>
            </div>
          </WhiteCard>

          <div className="lg:col-span-2 grid grid-cols-2 gap-3 content-start">
            <DataCard label={`Electricity (${period})`} value={`${num.format(r.periodKwh)} kWh`} />
            <DataCard label={`CO₂ (${period})`} value={`${num.format(r.periodCo2)} kg`} accent />
            <DataCard label="Annual electricity" value={`${num.format(r.annualKwh)} kWh`} />
            <DataCard label="Annual carbon footprint" value={`${num.format(r.annualCo2)} kg CO₂e`} />
          </div>
        </div>

        <WhiteCard>
          <h3 className="font-display text-lg font-bold">Your result</h3>
          <p className="mt-2 text-sm text-energy-ink/80 leading-relaxed">
            Based on your inputs, estimated annual emissions are approximately{" "}
            <strong>{num.format(r.annualCo2)} kg of CO₂ equivalent</strong>. Actual emissions depend heavily on
            electricity generation sources and data centre efficiency.
          </p>
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            <Comparison label="Petrol vehicle miles" value={`${num.format(r.petrolMiles)} miles`} />
            <Comparison label="UK homes' annual electricity" value={`${num.format(r.ukHomeElec)} homes`} />
            <Comparison label="Trees needed to absorb (per year)" value={`${num.format(r.trees)} trees`} />
            <Comparison label="UK household carbon (energy)" value={`${num.format(r.ukHouseholdCarbon)} households`} />
          </div>
        </WhiteCard>

        <SeoSection title="How It Works">
          <p>
            We estimate energy per action (text, image and video) using indicative per-generation figures, scale them by
            your usage level and number of users, then multiply by your chosen time period. Emissions are calculated by
            applying the carbon intensity of your selected electricity grid mix to the total electricity used.
          </p>
        </SeoSection>

        <SeoSection title="Why It Matters">
          <p>
            How carbon intensity affects AI: the same workload can produce very different emissions depending on whether
            the supporting data centres are powered by renewables, nuclear or fossil fuels. Location matters because
            grids vary enormously by country and region, and the time of day changes the generation mix. Estimates vary
            because model efficiency, hardware and cooling all influence real energy use.
          </p>
        </SeoSection>

        <SeoSection title="Limitations">
          <p>
            This calculator provides broad educational estimates only. Per-action energy figures are indicative averages
            and real values are rarely published per request. Grid intensities are simplified and change continuously.
          </p>
        </SeoSection>

        <Tier3RelatedContent tool="carbon-impact" />

        <EnergyFAQ
          items={[
            {
              q: "Does AI produce carbon emissions?",
              a: "Indirectly, yes. AI itself produces no emissions, but the electricity used to train and run models does — and the carbon footprint depends on how that electricity is generated.",
            },
            {
              q: "How much electricity does AI consume?",
              a: "It varies hugely. A single text prompt uses very little, but billions of prompts plus image and video generation add up to significant data centre electricity demand.",
            },
            {
              q: "Why do estimates vary?",
              a: "Model size, hardware efficiency, data centre cooling and the local electricity grid mix all change the result, and most providers do not publish per-request figures.",
            },
          ]}
        />

        <div>
          <h3 className="font-display text-lg font-bold text-white mb-4">Explore more advanced AI energy tools</h3>
          <Tier3NavButtons current="/advanced-ai-energy-tools/carbon-impact" />
        </div>
      </EnergyContainer>
    </EnergyShell>
  );
}

function Comparison({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-energy-grey p-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-energy-ink/50">{label}</div>
      <div className="mt-1 font-display text-lg font-bold text-energy-ink">{value}</div>
    </div>
  );
}
