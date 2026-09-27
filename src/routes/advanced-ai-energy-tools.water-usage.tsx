import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Droplets } from "lucide-react";
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
} from "@/components/energy/EnergyUI";
import { Tier3RelatedContent, Tier3NavButtons, scoreToIndex } from "@/components/energy/Tier3UI";
import { RatingBadge, type RatingLevel } from "@/components/energy/Tier2UI";

export const Route = createFileRoute("/advanced-ai-energy-tools/water-usage")({
  head: () => ({
    meta: [
      { title: "AI Water Usage Calculator UK | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Understand the relationship between AI infrastructure and data centre cooling. Estimate water demand pressure, cooling dependency and infrastructure pressure.",
      },
      { property: "og:title", content: "AI Water Usage Calculator UK | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content: "Estimate AI cooling-related water demand pressure across cooling methods and climates.",
      },
      { property: "og:url", content: "https://aienergyintelligence.co.uk/advanced-ai-energy-tools/water-usage" },
    ],
    links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/advanced-ai-energy-tools/water-usage" }],
    scripts: [
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"WebApplication\",\"name\":\"AI Water Usage Calculator UK\",\"applicationCategory\":\"BusinessApplication\",\"operatingSystem\":\"Any\",\"url\":\"https://aienergyintelligence.co.uk/advanced-ai-energy-tools/water-usage\",\"description\":\"Understand the relationship between AI infrastructure and data centre cooling. Estimate water demand pressure, cooling dependency and infrastructure pressure.\",\"offers\":{\"@type\":\"Offer\",\"price\":\"0\",\"priceCurrency\":\"GBP\"},\"publisher\":{\"@type\":\"Organization\",\"name\":\"AI Energy Intelligence UK\"},\"isAccessibleForFree\":true,\"inLanguage\":\"en-GB\"}" },
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"BreadcrumbList\",\"itemListElement\":[{\"@type\":\"ListItem\",\"position\":1,\"name\":\"Home\",\"item\":\"https://aienergyintelligence.co.uk/\"},{\"@type\":\"ListItem\",\"position\":2,\"name\":\"Advanced Ai Energy Tools\",\"item\":\"https://aienergyintelligence.co.uk/advanced-ai-energy-tools\"},{\"@type\":\"ListItem\",\"position\":3,\"name\":\"Water Usage\",\"item\":\"https://aienergyintelligence.co.uk/advanced-ai-energy-tools/water-usage\"}]}" },
    ],
  }),
  component: WaterUsageCalc,
});

type Level = "light" | "medium" | "heavy";

const LEVEL_FACTOR: Record<Level, number> = { light: 0.6, medium: 1, heavy: 1.8 };
const WORKLOAD_FACTOR: Record<string, number> = { text: 0.7, image: 1, video: 1.6, mixed: 1.1 };
const COOLING_FACTOR: Record<string, number> = { air: 0.4, evaporative: 1.6, hybrid: 1, unknown: 1.1 };
const CLIMATE_FACTOR: Record<string, number> = { cool: 0.7, moderate: 1, warm: 1.5 };

function toRating(score: number): RatingLevel {
  const lvl = scoreToIndex(score);
  return lvl;
}

function WaterUsageCalc() {
  const [level, setLevel] = useState<Level>("medium");
  const [workload, setWorkload] = useState("mixed");
  const [cooling, setCooling] = useState("hybrid");
  const [climate, setClimate] = useState("moderate");
  const [users, setUsers] = useState(100);

  const r = useMemo(() => {
    const base = LEVEL_FACTOR[level] * WORKLOAD_FACTOR[workload] * Math.min(Math.log10(users + 1) / 2, 2.5);
    const waterScore = Math.min(100, Math.round(base * COOLING_FACTOR[cooling] * CLIMATE_FACTOR[climate] * 22));
    const coolingScore = Math.min(100, Math.round(COOLING_FACTOR[cooling] * 40 + CLIMATE_FACTOR[climate] * 15 + base * 8));
    const infraScore = Math.min(100, Math.round(base * 18 + COOLING_FACTOR[cooling] * 12 + CLIMATE_FACTOR[climate] * 10));
    return {
      waterScore,
      coolingScore,
      infraScore,
      waterLevel: toRating(waterScore),
      coolingLevel: toRating(coolingScore),
      infraLevel: toRating(infraScore),
    };
  }, [level, workload, cooling, climate, users]);

  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "AI Energy Intelligence UK", to: "/" },
          { label: "Advanced AI Energy Intelligence", to: "/advanced-ai-energy-tools" },
          { label: "AI Water Usage Calculator" },
        ]}
      />
      <EnergyHero
        eyebrow="Tool 12"
        title="AI Water Usage Calculator"
        intro="Understand the relationship between AI infrastructure and data centre cooling requirements. This tool estimates the water demand pressure created by different AI workloads, cooling methods and regional climates."
        icon={Droplets}
      />

      <EnergyContainer className="py-10 space-y-8">
        <DisclaimerBanner>
          <strong className="text-white">Important:</strong> This tool provides educational estimates and should not be
          interpreted as actual water consumption data.
        </DisclaimerBanner>

        <div className="grid lg:grid-cols-5 gap-6">
          <WhiteCard className="lg:col-span-3">
            <h3 className="font-display text-lg font-bold mb-5">Your scenario</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <EField label="AI usage level">
                <ESelect value={level} onChange={(e) => setLevel(e.target.value as Level)}>
                  <option value="light">Light</option>
                  <option value="medium">Medium</option>
                  <option value="heavy">Heavy</option>
                </ESelect>
              </EField>
              <EField label="Estimated workload type">
                <ESelect value={workload} onChange={(e) => setWorkload(e.target.value)}>
                  <option value="text">Text</option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="mixed">Mixed</option>
                </ESelect>
              </EField>
              <EField label="Cooling method">
                <ESelect value={cooling} onChange={(e) => setCooling(e.target.value)}>
                  <option value="air">Air Cooling</option>
                  <option value="evaporative">Evaporative Cooling</option>
                  <option value="hybrid">Hybrid Cooling</option>
                  <option value="unknown">Unknown</option>
                </ESelect>
              </EField>
              <EField label="Region climate">
                <ESelect value={climate} onChange={(e) => setClimate(e.target.value)}>
                  <option value="cool">Cool</option>
                  <option value="moderate">Moderate</option>
                  <option value="warm">Warm</option>
                </ESelect>
              </EField>
              <EField label="Number of users">
                <ENumber min={1} value={users} onChange={(e) => setUsers(+e.target.value)} />
              </EField>
            </div>
          </WhiteCard>

          <div className="lg:col-span-2 grid grid-cols-1 gap-3 content-start">
            <DataCard label="Water demand pressure" value={`${r.waterScore}/100`} sub={r.waterLevel} accent />
            <DataCard label="Cooling dependency" value={`${r.coolingScore}/100`} sub={r.coolingLevel} />
            <DataCard label="Infrastructure pressure" value={`${r.infraScore}/100`} sub={r.infraLevel} />
          </div>
        </div>

        <WhiteCard>
          <h3 className="font-display text-lg font-bold">Your result</h3>
          <p className="mt-2 text-sm text-energy-ink/80 leading-relaxed">
            Your selected scenario suggests a <strong>{r.waterLevel.toLowerCase()}</strong> cooling demand profile.
            Actual water consumption depends on the specific design and efficiency of the supporting data centre
            infrastructure.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <span className="flex items-center gap-2">
              <span className="text-energy-ink/60">Water pressure:</span> <RatingBadge level={r.waterLevel} />
            </span>
            <span className="flex items-center gap-2">
              <span className="text-energy-ink/60">Cooling dependency:</span> <RatingBadge level={r.coolingLevel} />
            </span>
            <span className="flex items-center gap-2">
              <span className="text-energy-ink/60">Infrastructure pressure:</span> <RatingBadge level={r.infraLevel} />
            </span>
          </div>
        </WhiteCard>

        <SeoSection title="How It Works">
          <p>
            We combine your AI usage level, workload type, the number of users and your selected cooling method and
            regional climate into directional 0–100 scores. Evaporative cooling and warmer climates increase water
            pressure, while air cooling and cooler climates reduce it.
          </p>
        </SeoSection>

        <SeoSection title="Why Data Centres Use Water">
          <p>
            Many data centres use water as part of their cooling systems, particularly evaporative cooling, which relies
            on evaporation to remove heat. This can be highly efficient for electricity use but increases water demand,
            especially in warmer regions.
          </p>
        </SeoSection>

        <SeoSection title="Cooling Technologies Explained">
          <p>
            Air cooling uses fans and chillers with little or no water. Evaporative cooling uses water evaporation to
            shed heat efficiently. Hybrid systems switch between methods depending on conditions. Newer approaches such
            as liquid and immersion cooling aim to reduce both water and energy demand.
          </p>
        </SeoSection>

        <SeoSection title="Why It Matters">
          <p>
            Regional differences are significant: a facility in a cool, water-rich location places far less pressure on
            local resources than one in a warm, water-stressed region. Future cooling innovation — including closed-loop
            and immersion cooling — could materially reduce AI's water footprint.
          </p>
        </SeoSection>

        <SeoSection title="Limitations">
          <p>
            This tool provides educational estimates and should not be interpreted as actual water consumption data.
            Real water use depends on facility design, water reuse, local climate and operational choices.
          </p>
        </SeoSection>

        <Tier3RelatedContent tool="water-usage" />

        <EnergyFAQ
          items={[
            {
              q: "Why do data centres use water?",
              a: "Primarily for cooling. Removing heat from servers using water-based or evaporative systems can be more energy-efficient than air cooling, but it consumes water.",
            },
            {
              q: "Are some cooling systems more efficient?",
              a: "Yes. Air cooling uses little water but more electricity, while evaporative cooling uses less electricity but more water. Hybrid and liquid cooling aim to balance both.",
            },
            {
              q: "Could AI increase water demand?",
              a: "Potentially. As AI workloads and data centre capacity grow, cooling demand rises, which can increase water use unless more efficient cooling technologies are adopted.",
            },
          ]}
        />

        <div>
          <h3 className="font-display text-lg font-bold text-white mb-4">Explore more advanced AI energy tools</h3>
          <Tier3NavButtons current="/advanced-ai-energy-tools/water-usage" />
        </div>
      </EnergyContainer>
    </EnergyShell>
  );
}
