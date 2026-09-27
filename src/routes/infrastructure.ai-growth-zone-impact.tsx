import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
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

const PATH = "/infrastructure/ai-growth-zone-impact";
const UK_HOME_ANNUAL_KWH = 2700;

const REGIONS = {
  london: "London & South East",
  midlands: "Midlands",
  north: "North of England",
  scotland: "Scotland",
  wales: "Wales",
} as const;
type RegionKey = keyof typeof REGIONS;

const SIZES = {
  small: { label: "Small (≤20 MW)", jobsPerMw: 6, capexPerMw: 8 },
  medium: { label: "Medium (20–100 MW)", jobsPerMw: 5, capexPerMw: 9 },
  large: { label: "Large (100 MW+)", jobsPerMw: 4, capexPerMw: 11 },
} as const;
type SizeKey = keyof typeof SIZES;

const FAQ = [
  {
    q: "How are jobs estimated?",
    a: "Using a rough jobs-per-MW factor covering construction and operations. Actual job creation depends heavily on the project and local supply chain.",
  },
  {
    q: "Is the investment figure capital or operating cost?",
    a: "It estimates capital investment (build cost) at roughly £8–11m per MW depending on scale and density.",
  },
];

export const Route = createFileRoute("/infrastructure/ai-growth-zone-impact")({
  head: () => ({
    meta: [
      { title: "AI Growth Zone Impact Calculator UK | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Estimate the additional electricity demand, jobs created and infrastructure investment from a proposed AI growth zone or data centre capacity in the UK.",
      },
      { property: "og:title", content: "AI Growth Zone Impact Calculator UK | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content: "Estimate demand, jobs and investment from proposed AI capacity in a UK region.",
      },
      { property: "og:url", content: `https://aienergyintelligence.co.uk${PATH}` },
    ],
    links: [{ rel: "canonical", href: `https://aienergyintelligence.co.uk${PATH}` }],
    scripts: [
      toolLd("AI Growth Zone Impact Calculator", PATH, "Estimate demand, jobs and investment from AI capacity."),
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Infrastructure Hub", path: "/infrastructure" },
        { name: "AI Growth Zone Impact Calculator", path: PATH },
      ]),
      faqLd(FAQ),
    ],
  }),
  component: Calc,
});

function Calc() {
  const [capacity, setCapacity] = useState(100);
  const [region, setRegion] = useState<RegionKey>("london");
  const [size, setSize] = useState<SizeKey>("large");

  const r = useMemo(() => {
    const s = SIZES[size];
    const annualKwh = capacity * 1000 * 8760 * 0.7; // 70% load factor
    return {
      annualKwh,
      homes: annualKwh / UK_HOME_ANNUAL_KWH,
      jobs: capacity * s.jobsPerMw,
      capex: capacity * s.capexPerMw * 1_000_000,
    };
  }, [capacity, region, size]);

  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "UK AI Energy Intelligence Centre", to: "/" },
          { label: "Infrastructure Hub", to: "/infrastructure" },
          { label: "AI Growth Zone Impact Calculator" },
        ]}
      />
      <EnergyHero
        eyebrow="Infrastructure Hub"
        title="AI Growth Zone Impact Calculator"
        intro="Estimate the electricity demand, jobs and infrastructure investment created by a proposed AI growth zone or data centre capacity in a UK region."
        icon={MapPin}
      />

      <EnergyContainer className="py-10 space-y-8">
        <DisclaimerBanner />

        <div className="grid lg:grid-cols-5 gap-6">
          <WhiteCard className="lg:col-span-3">
            <h3 className="font-display text-lg font-bold mb-5">Proposed development</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <EField label="Proposed AI capacity (MW)">
                <ENumber min={1} value={capacity} onChange={(e) => setCapacity(+e.target.value)} />
              </EField>
              <EField label="Region">
                <ESelect value={region} onChange={(e) => setRegion(e.target.value as RegionKey)}>
                  {Object.entries(REGIONS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </ESelect>
              </EField>
              <EField label="Data centre size">
                <ESelect value={size} onChange={(e) => setSize(e.target.value as SizeKey)}>
                  {Object.entries(SIZES).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </ESelect>
              </EField>
            </div>
          </WhiteCard>

          <div className="lg:col-span-2 grid grid-cols-2 gap-3 content-start">
            <DataCard label="Annual demand" value={`${num.format(r.annualKwh / 1_000_000)} GWh`} accent />
            <DataCard label="UK homes equiv." value={`${num.format(r.homes)}`} sub="homes / yr" accent />
            <DataCard label="Jobs created" value={num.format(r.jobs)} />
            <DataCard label="Investment" value={gbp.format(r.capex)} />
          </div>
        </div>

        <WhiteCard>
          <h3 className="font-display text-lg font-bold">Plain English summary</h3>
          <p className="mt-2 text-sm text-energy-ink/80 leading-relaxed">
            A {num.format(capacity)} MW build in {REGIONS[region]} could draw about{" "}
            <strong>{num.format(r.annualKwh / 1_000_000)} GWh</strong> per year — equivalent to{" "}
            <strong>{num.format(r.homes)}</strong> UK homes — while supporting around{" "}
            <strong>{num.format(r.jobs)} jobs</strong> and roughly <strong>{gbp.format(r.capex)}</strong> of capital
            investment.
          </p>
        </WhiteCard>

        <SeoSection title="How This Calculator Works">
          <p>
            Annual demand = capacity (MW) × 1,000 × 8,760 hours × a 70% load factor. Jobs and investment use per-MW
            factors that vary with project size (≈4–6 jobs/MW and ≈£8–11m/MW).
          </p>
        </SeoSection>
        <SeoSection title="What The Result Means">
          <p>
            These figures help compare the scale of a proposal — its demand footprint against local homes, plus the
            economic upside in jobs and investment.
          </p>
        </SeoSection>
        <SeoSection title="Limitations">
          <p>Job and investment factors are indicative; real outcomes depend on design, automation and local supply chains.</p>
        </SeoSection>

        <ToolPageFooter
          current={PATH}
          source="ai-growth-zone"
          inputs={{ capacity, region, size }}
          resultSummary={{ annualGWh: r.annualKwh / 1_000_000, jobs: r.jobs, capex: r.capex }}
        />

        <EnergyFAQ items={FAQ} />
      </EnergyContainer>
    </EnergyShell>
  );
}
