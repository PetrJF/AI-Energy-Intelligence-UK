import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
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

const PATH = "/energy-cost/ai-search-cost-calculator";

// kWh per search
const SEARCH = {
  traditional: { label: "Traditional search", kwh: 0.0003 },
  ai: { label: "AI-powered search", kwh: 0.0029 },
} as const;
type SearchKey = keyof typeof SEARCH;

const FAQ = [
  {
    q: "Why does AI search use more energy than traditional search?",
    a: "AI search runs a large language model to generate an answer, which uses far more compute than returning a ranked list of links.",
  },
  {
    q: "Are these figures exact?",
    a: "No — they use mid-range public estimates (≈0.0003 kWh per traditional search vs ≈0.0029 kWh per AI search) to show the difference in scale.",
  },
];

export const Route = createFileRoute("/energy-cost/ai-search-cost-calculator")({
  head: () => ({
    meta: [
      { title: "AI Search Cost Calculator UK | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Compare the annual energy consumption and electricity cost of AI search versus traditional search across your user base.",
      },
      { property: "og:title", content: "AI Search Cost Calculator UK | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content: "Compare AI search vs traditional search energy and cost across your users.",
      },
      { property: "og:url", content: `https://aienergyintelligence.co.uk${PATH}` },
    ],
    links: [{ rel: "canonical", href: `https://aienergyintelligence.co.uk${PATH}` }],
    scripts: [
      toolLd("AI Search Cost Calculator", PATH, "Compare AI search and traditional search energy cost."),
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Energy Cost Hub", path: "/energy-cost" },
        { name: "AI Search Cost Calculator", path: PATH },
      ]),
      faqLd(FAQ),
    ],
  }),
  component: Calc,
});

function Calc() {
  const [searches, setSearches] = useState(20);
  const [users, setUsers] = useState(1000);
  const [type, setType] = useState<SearchKey>("ai");
  const [price, setPrice] = useState(0.27);

  const r = useMemo(() => {
    const annual = searches * users * SEARCH[type].kwh * 365;
    const baseline = searches * users * SEARCH.traditional.kwh * 365;
    return {
      annual,
      annualCost: annual * price,
      extra: annual - baseline,
      extraCost: (annual - baseline) * price,
    };
  }, [searches, users, type, price]);

  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "UK AI Energy Intelligence Centre", to: "/" },
          { label: "Energy Cost Hub", to: "/energy-cost" },
          { label: "AI Search Cost Calculator" },
        ]}
      />
      <EnergyHero
        eyebrow="Energy Cost Hub"
        title="AI Search Cost Calculator"
        intro="Compare the energy and cost of AI search against traditional search across your whole user base, scaled to annual totals."
        icon={Search}
      />

      <EnergyContainer className="py-10 space-y-8">
        <DisclaimerBanner />

        <div className="grid lg:grid-cols-5 gap-6">
          <WhiteCard className="lg:col-span-3">
            <h3 className="font-display text-lg font-bold mb-5">Search activity</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <EField label="Searches per user per day">
                <ENumber min={0} value={searches} onChange={(e) => setSearches(+e.target.value)} />
              </EField>
              <EField label="Number of users">
                <ENumber min={1} value={users} onChange={(e) => setUsers(+e.target.value)} />
              </EField>
              <EField label="Search type">
                <ESelect value={type} onChange={(e) => setType(e.target.value as SearchKey)}>
                  {Object.entries(SEARCH).map(([k, v]) => (
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
            <DataCard label="Annual energy" value={`${num.format(r.annual)} kWh`} accent />
            <DataCard label="Annual cost" value={gbp.format(r.annualCost)} accent />
            <DataCard label="Extra vs traditional" value={`${num.format(r.extra)} kWh`} />
            <DataCard label="Extra cost" value={gbp.format(r.extraCost)} />
          </div>
        </div>

        <WhiteCard>
          <h3 className="font-display text-lg font-bold">Infrastructure impact</h3>
          <p className="mt-2 text-sm text-energy-ink/80 leading-relaxed">
            At this volume, {type === "ai" ? "AI" : "traditional"} search consumes about{" "}
            <strong>{num.format(r.annual)} kWh per year</strong>. Switching to AI search adds roughly{" "}
            <strong>{num.format(r.extra)} kWh</strong> annually compared with traditional search — sustained extra
            demand on data centres and the grid as adoption scales.
          </p>
        </WhiteCard>

        <SeoSection title="How This Calculator Works">
          <p>
            Annual energy = searches per user per day × users × per-search energy × 365. Per-search assumptions are
            ≈0.0003 kWh for traditional search and ≈0.0029 kWh for AI search. Cost = total kWh × electricity price.
          </p>
        </SeoSection>
        <SeoSection title="What The Result Means">
          <p>
            The headline figure is the annual electricity behind your search activity; the "extra" figures isolate the
            additional demand created by moving from traditional to AI search.
          </p>
        </SeoSection>
        <SeoSection title="Limitations">
          <p>Per-search energy varies widely by provider and model. Treat these as directional estimates.</p>
        </SeoSection>

        <ToolPageFooter
          current={PATH}
          source="ai-search-cost"
          inputs={{ searches, users, type, price }}
          resultSummary={{ annualKwh: r.annual, annualCost: r.annualCost }}
        />

        <EnergyFAQ items={FAQ} />
      </EnergyContainer>
    </EnergyShell>
  );
}
