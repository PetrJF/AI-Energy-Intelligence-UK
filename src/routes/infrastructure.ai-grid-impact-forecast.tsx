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
  num,
} from "@/components/energy/EnergyUI";
import { ToolPageFooter, breadcrumbLd, faqLd, toolLd } from "@/components/energy/hub";

const PATH = "/infrastructure/ai-grid-impact-forecast";

// baseline regional annual electricity demand (TWh, approximate)
const REGIONS = {
  london: { label: "London & South East", twh: 95 },
  midlands: { label: "Midlands", twh: 60 },
  north: { label: "North of England", twh: 70 },
  scotland: { label: "Scotland", twh: 35 },
  wales: { label: "Wales", twh: 20 },
} as const;
type RegionKey = keyof typeof REGIONS;

const SCENARIO = { low: { label: "Low growth", f: 0.04 }, medium: { label: "Medium growth", f: 0.09 }, high: { label: "High growth", f: 0.18 } } as const;
const ADOPTION = { low: { label: "Low adoption", f: 0.6 }, medium: { label: "Medium adoption", f: 1 }, high: { label: "High adoption", f: 1.6 } } as const;
type Lvl = "low" | "medium" | "high";

const FAQ = [
  {
    q: "What does the grid stress rating mean?",
    a: "It compares projected additional demand to the region's baseline. Higher ratings mean more reinforcement, new connections and capacity planning are likely needed.",
  },
  {
    q: "Are these official figures?",
    a: "No. They are illustrative estimates built on public regional demand figures and scenario multipliers, intended to show relative pressure, not formal forecasts.",
  },
];

export const Route = createFileRoute("/infrastructure/ai-grid-impact-forecast")({
  head: () => ({
    meta: [
      { title: "AI Grid Impact Forecast Tool UK | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Project the additional electricity demand, infrastructure requirements and grid stress that AI and data centre growth could place on a UK region.",
      },
      { property: "og:title", content: "AI Grid Impact Forecast Tool UK | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content: "Project AI-driven regional demand growth, infrastructure needs and grid stress.",
      },
      { property: "og:url", content: `https://aienergyintelligence.co.uk${PATH}` },
    ],
    links: [{ rel: "canonical", href: `https://aienergyintelligence.co.uk${PATH}` }],
    scripts: [
      toolLd("AI Grid Impact Forecast Tool", PATH, "Forecast AI-driven grid impact across UK regions."),
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Infrastructure Hub", path: "/infrastructure" },
        { name: "AI Grid Impact Forecast Tool", path: PATH },
      ]),
      faqLd(FAQ),
    ],
  }),
  component: Calc,
});

function rating(pct: number) {
  if (pct < 5) return { label: "Low", note: "Manageable with routine planning." };
  if (pct < 12) return { label: "Moderate", note: "Targeted reinforcement likely needed." };
  if (pct < 20) return { label: "High", note: "Significant new capacity and connections required." };
  return { label: "Severe", note: "Major grid investment and queue management required." };
}

function Calc() {
  const [region, setRegion] = useState<RegionKey>("london");
  const [scenario, setScenario] = useState<Lvl>("medium");
  const [adoption, setAdoption] = useState<Lvl>("medium");

  const r = useMemo(() => {
    const base = REGIONS[region].twh;
    const addl = base * SCENARIO[scenario].f * ADOPTION[adoption].f;
    const pct = (addl / base) * 100;
    return { base, addl, pct, rating: rating(pct), gw: (addl * 1000) / 8760 };
  }, [region, scenario, adoption]);

  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "UK AI Energy Intelligence Centre", to: "/" },
          { label: "Infrastructure Hub", to: "/infrastructure" },
          { label: "AI Grid Impact Forecast Tool" },
        ]}
      />
      <EnergyHero
        eyebrow="Infrastructure Hub"
        title="AI Grid Impact Forecast Tool"
        intro="Project how AI and data centre growth could increase electricity demand in a UK region, and what that means for infrastructure and grid stress."
        icon={Network}
      />

      <EnergyContainer className="py-10 space-y-8">
        <DisclaimerBanner />

        <div className="grid lg:grid-cols-5 gap-6">
          <WhiteCard className="lg:col-span-3">
            <h3 className="font-display text-lg font-bold mb-5">Scenario</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <EField label="Region">
                <ESelect value={region} onChange={(e) => setRegion(e.target.value as RegionKey)}>
                  {Object.entries(REGIONS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </ESelect>
              </EField>
              <EField label="Data centre growth scenario">
                <ESelect value={scenario} onChange={(e) => setScenario(e.target.value as Lvl)}>
                  {Object.entries(SCENARIO).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </ESelect>
              </EField>
              <EField label="AI adoption level">
                <ESelect value={adoption} onChange={(e) => setAdoption(e.target.value as Lvl)}>
                  {Object.entries(ADOPTION).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </ESelect>
              </EField>
            </div>
          </WhiteCard>

          <div className="lg:col-span-2 grid grid-cols-2 gap-3 content-start">
            <DataCard label="Demand increase" value={`${num.format(r.addl)} TWh`} accent />
            <DataCard label="As % of region" value={`${num.format(r.pct)}%`} accent />
            <DataCard label="Avg added load" value={`${num.format(r.gw)} GW`} />
            <DataCard label="Grid stress" value={r.rating.label} sub={r.rating.note} />
          </div>
        </div>

        <WhiteCard>
          <h3 className="font-display text-lg font-bold">Infrastructure requirements</h3>
          <p className="mt-2 text-sm text-energy-ink/80 leading-relaxed">
            In {REGIONS[region].label}, this scenario adds roughly <strong>{num.format(r.addl)} TWh</strong> per year
            (about <strong>{num.format(r.pct)}%</strong> of current regional demand). Grid stress is rated{" "}
            <strong>{r.rating.label}</strong> — {r.rating.note} Expect pressure on substations, transmission upgrades and
            connection queues.
          </p>
        </WhiteCard>

        <SeoSection title="How This Calculator Works">
          <p>
            We take an approximate baseline annual demand for the region, then apply a growth-scenario factor and an
            AI-adoption multiplier to estimate additional demand. The stress rating compares additional demand to the
            regional baseline.
          </p>
        </SeoSection>
        <SeoSection title="What The Result Means">
          <p>
            A higher percentage and stress rating signal a greater likelihood that the local network needs reinforcement,
            new connections or generation to keep pace with AI-driven growth.
          </p>
        </SeoSection>
        <SeoSection title="Limitations">
          <p>Regional baselines and multipliers are illustrative. Real planning uses detailed network and FES data.</p>
        </SeoSection>

        <ToolPageFooter
          current={PATH}
          source="ai-grid-impact"
          inputs={{ region, scenario, adoption }}
          resultSummary={{ additionalTWh: r.addl, pct: r.pct, stress: r.rating.label }}
        />

        <EnergyFAQ items={FAQ} />
      </EnergyContainer>
    </EnergyShell>
  );
}
