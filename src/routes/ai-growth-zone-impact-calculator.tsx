import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Network, Home, Car, PoundSterling, Leaf, Briefcase, Zap, ArrowRight, Info } from "lucide-react";
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

export const Route = createFileRoute("/ai-growth-zone-impact-calculator")({
  head: () => ({
    meta: [
      { title: "AI Growth Zone Impact Calculator UK | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Estimate the electricity demand, annual energy cost, grid pressure and local impact of a UK AI Growth Zone or AI data centre project.",
      },
      { property: "og:title", content: "AI Growth Zone Impact Calculator UK | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content:
          "Estimate the electricity demand, annual energy cost, grid pressure and local impact of a UK AI Growth Zone or AI data centre project.",
      },
      {
        property: "og:url",
        content: "https://aienergyintelligence.co.uk/ai-growth-zone-impact-calculator",
      },
    ],
    links: [
      { rel: "canonical", href: "https://aienergyintelligence.co.uk/ai-growth-zone-impact-calculator" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "AI Growth Zone Impact Calculator",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Any",
          url: "https://aienergyintelligence.co.uk/ai-growth-zone-impact-calculator",
          description:
            "Estimate the electricity demand, annual energy cost, grid pressure and local impact of a UK AI Growth Zone or AI data centre project.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
          publisher: { "@type": "Organization", name: "AI Energy Intelligence UK" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is an AI Growth Zone?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "AI Growth Zones are a UK policy idea intended to accelerate large-scale AI infrastructure — especially data centres — by improving planning coordination, grid access and investment support in chosen regions.",
              },
            },
            {
              "@type": "Question",
              name: "Why do AI Growth Zones need so much electricity?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "AI data centres run dense clusters of GPUs and accelerators around the clock. At hundreds of megawatts, a single development can require as much electricity as a small city, placing sustained demand on local grids.",
              },
            },
            {
              "@type": "Question",
              name: "How much power could an AI data centre use?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "It varies by design, but proposed AI campuses can range from tens of megawatts to over a gigawatt. This calculator lets you model 10MW to 2,000MW and estimate annual electricity use from utilisation and PUE.",
              },
            },
            {
              "@type": "Question",
              name: "Could AI Growth Zones affect local electricity infrastructure?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Large, continuous demand can require grid reinforcement, new connections and substantial planning. AI Growth Zones are intended to reduce these barriers, but local infrastructure pressure remains a key consideration.",
              },
            },
            {
              "@type": "Question",
              name: "What does PUE mean?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "PUE (Power Usage Effectiveness) compares total facility energy use with the energy delivered to IT equipment. A PUE of 1.2 is excellent and 2.0 is poor — the higher the PUE, the more energy goes to cooling and overheads.",
              },
            },
            {
              "@type": "Question",
              name: "Are AI Growth Zone cost savings guaranteed?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No. Any pricing support depends on policy decisions, region and eligibility, and may change over time. The savings shown here are indicative scenarios, not guaranteed reductions.",
              },
            },
            {
              "@type": "Question",
              name: "Could AI Growth Zones affect water use?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Potentially. Large data centres often use water for cooling, particularly evaporative cooling. In water-stressed regions this can add local pressure unless low-water cooling is used.",
              },
            },
            {
              "@type": "Question",
              name: "Are these calculations exact?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No. This is an educational, indicative tool. Real project impacts depend on grid connection agreements, planning consent, cooling design, energy contracts and operational behaviour. It is not engineering, planning, legal or investment advice.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: GrowthZoneImpactCalc,
});

// UK assumptions
const HOURS_PER_YEAR = 8760;
const UK_HOME_ANNUAL_MWH = 2.7; // ≈2,700 kWh per UK household per year
const EV_CHARGE_KWH = 54; // full charge of a typical EV battery

const PUE_OPTIONS = [
  { value: 1.2, label: "Excellent (1.2)" },
  { value: 1.4, label: "Good (1.4)" },
  { value: 1.6, label: "Average (1.6)" },
  { value: 2.0, label: "Poor (2.0)" },
];

const REGIONS: Record<string, { label: string; support: number }> = {
  scotland: { label: "Scotland", support: 24 },
  cumbria: { label: "Cumbria", support: 16 },
  "north-east": { label: "North East England", support: 14 },
  "north-wales": { label: "North Wales", support: 0 },
  "south-wales": { label: "South Wales", support: 0 },
  oxfordshire: { label: "Oxfordshire", support: 0 },
  other: { label: "Other UK region", support: 0 },
  custom: { label: "Custom", support: 0 },
};

const SUPPORT_OPTIONS = [
  { value: "none", label: "No support", discount: 0 },
  { value: "scotland", label: "Scotland: £24/MWh reduction", discount: 24 },
  { value: "cumbria", label: "Cumbria: £16/MWh reduction", discount: 16 },
  { value: "north-east", label: "North East: £14/MWh reduction", discount: 14 },
  { value: "custom", label: "Custom discount", discount: 0 },
];

function clamp(n: number, min: number, max: number) {
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function gridPressure(facilityLoadMw: number): { level: string; pct: number } {
  if (facilityLoadMw < 50) return { level: "Low", pct: 20 };
  if (facilityLoadMw < 200) return { level: "Moderate", pct: 45 };
  if (facilityLoadMw <= 500) return { level: "High", pct: 75 };
  return { level: "Very High", pct: 100 };
}

function Gauge({ label, value, max, unit, accent }: { label: string; value: number; max: number; unit: string; accent?: boolean }) {
  const pct = clamp((value / max) * 100, 0, 100);
  return (
    <div className="rounded-xl bg-energy-card text-energy-ink p-5 border border-black/5 shadow-card">
      <div className="text-xs font-semibold uppercase tracking-wider text-energy-ink/60">{label}</div>
      <div className="mt-2 font-display text-2xl font-bold">
        {num.format(value)} <span className="text-base font-semibold text-energy-ink/60">{unit}</span>
      </div>
      <div className="mt-3 h-2.5 w-full rounded-full bg-energy-grey overflow-hidden">
        <div
          className={`h-full rounded-full ${accent ? "bg-electric" : "bg-energy-navy"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function RatingCard({ label, level, pct }: { label: string; level: string; pct: number }) {
  return (
    <div className="rounded-xl bg-energy-card text-energy-ink p-5 border border-black/5 shadow-card">
      <div className="text-xs font-semibold uppercase tracking-wider text-energy-ink/60">{label}</div>
      <div className="mt-2 font-display text-2xl font-bold">{level}</div>
      <div className="mt-3 h-2.5 w-full rounded-full bg-energy-grey overflow-hidden">
        <div className="h-full rounded-full bg-electric" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function CompareCard({ icon: Icon, value, label }: { icon: any; value: string; label: string }) {
  return (
    <div className="rounded-xl bg-energy-card text-energy-ink p-5 border border-black/5 shadow-card flex items-start gap-3">
      <div className="rounded-lg bg-electric/10 p-2.5 shrink-0">
        <Icon className="h-5 w-5 text-electric" />
      </div>
      <div>
        <div className="font-display text-xl font-bold">{value}</div>
        <div className="mt-0.5 text-sm text-energy-ink/60">{label}</div>
      </div>
    </div>
  );
}

function GrowthZoneImpactCalc() {
  const [region, setRegion] = useState("scotland");
  const [capacityMw, setCapacityMw] = useState(500);
  const [utilisation, setUtilisation] = useState(75);
  const [pue, setPue] = useState(1.4);
  const [pricePerMwh, setPricePerMwh] = useState(120);
  const [support, setSupport] = useState("scotland");
  const [customDiscount, setCustomDiscount] = useState(20);
  const [investmentM, setInvestmentM] = useState(1000);
  const [jobsMultiplier, setJobsMultiplier] = useState(50);
  const [benefitScore, setBenefitScore] = useState(5);
  const [carbonFactor, setCarbonFactor] = useState(0.15);

  function applyRegion(key: string) {
    setRegion(key);
    const r = REGIONS[key];
    if (r) {
      if (key === "scotland") setSupport("scotland");
      else if (key === "cumbria") setSupport("cumbria");
      else if (key === "north-east") setSupport("north-east");
      else setSupport("none");
    }
  }

  const discount = useMemo(() => {
    if (support === "custom") return clamp(customDiscount, 0, 200);
    return SUPPORT_OPTIONS.find((s) => s.value === support)?.discount ?? 0;
  }, [support, customDiscount]);

  const r = useMemo(() => {
    const cap = clamp(capacityMw, 10, 2000);
    const util = clamp(utilisation, 10, 100) / 100;
    const price = clamp(pricePerMwh, 0, 100000);
    const cf = clamp(carbonFactor, 0, 5);

    const itLoadMw = cap * util;
    const facilityLoadMw = itLoadMw * pue;
    const annualMwh = facilityLoadMw * HOURS_PER_YEAR;

    const costBefore = annualMwh * price;
    const saving = annualMwh * discount;
    const costAfter = costBefore - saving;

    const jobs = (clamp(investmentM, 0, 1_000_000) / 100) * clamp(jobsMultiplier, 0, 100000);
    const co2Tonnes = annualMwh * cf;

    const gp = gridPressure(facilityLoadMw);

    return {
      itLoadMw,
      facilityLoadMw,
      annualMwh,
      annualKwh: annualMwh * 1000,
      costBefore,
      saving,
      costAfter,
      jobs,
      co2Tonnes,
      homes: annualMwh / UK_HOME_ANNUAL_MWH,
      evCharges: (annualMwh * 1000) / EV_CHARGE_KWH,
      pricePerKwh: price / 1000,
      grid: gp,
      benefitPct: (clamp(benefitScore, 0, 10) / 10) * 100,
    };
  }, [capacityMw, utilisation, pue, pricePerMwh, discount, investmentM, jobsMultiplier, benefitScore, carbonFactor]);

  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "AI Energy Intelligence UK", to: "/" },
          { label: "AI Energy Tools" },
          { label: "AI Energy Calculators", to: "/ai-energy-calculators" },
          { label: "AI Growth Zone Impact Calculator" },
        ]}
      />
      <EnergyHero
        eyebrow="AI Energy Tools"
        title="AI Growth Zone Impact Calculator"
        intro="Estimate the indicative electricity demand, annual energy cost, grid pressure, jobs and local impact of a proposed UK AI Growth Zone or AI data centre development. An educational, policy-focused scenario tool — not a precise engineering or official forecast."
        icon={Network}
      />

      <EnergyContainer className="py-10 space-y-8">
        <DisclaimerBanner>
          <strong className="text-white">Important:</strong> This is an educational, indicative scenario tool. Real
          project impacts depend on grid connection agreements, planning consent, local infrastructure, cooling design,
          energy contracts, water use and operational behaviour. Do not treat results as engineering, planning, legal or
          investment advice.
        </DisclaimerBanner>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Inputs */}
          <WhiteCard className="lg:col-span-2">
            <h3 className="font-display text-lg font-bold mb-5">Project assumptions</h3>
            <div className="space-y-5">
              <EField label="Growth Zone region">
                <ESelect value={region} onChange={(e) => applyRegion(e.target.value)}>
                  {Object.entries(REGIONS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </ESelect>
              </EField>

              <EField label="Proposed data centre capacity (MW)" hint="10 – 2,000 MW">
                <ENumber
                  min={10}
                  max={2000}
                  value={capacityMw}
                  onChange={(e) => setCapacityMw(clamp(+e.target.value, 10, 2000))}
                />
                <input
                  type="range"
                  min={10}
                  max={2000}
                  step={10}
                  value={capacityMw}
                  onChange={(e) => setCapacityMw(+e.target.value)}
                  className="mt-2 w-full cursor-pointer"
                  style={{ accentColor: "#1f9bff" }}
                />
              </EField>

              <EField label={`Utilisation rate: ${utilisation}%`} hint="10% – 100%">
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={1}
                  value={utilisation}
                  onChange={(e) => setUtilisation(+e.target.value)}
                  className="w-full cursor-pointer"
                  style={{ accentColor: "#1f9bff" }}
                />
              </EField>

              <EField label="PUE (Power Usage Effectiveness)" hint="total facility energy ÷ IT energy">
                <ESelect value={String(pue)} onChange={(e) => setPue(+e.target.value)}>
                  {PUE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </ESelect>
                <p className="mt-1.5 flex items-start gap-1.5 text-xs text-energy-ink/50">
                  <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  PUE compares total data centre energy use with the energy used by IT equipment. Lower is more
                  efficient.
                </p>
              </EField>

              <EField label="Electricity price (£ / MWh)" hint={`≈ £${r.pricePerKwh.toFixed(3)} / kWh`}>
                <ENumber
                  min={0}
                  step={1}
                  value={pricePerMwh}
                  onChange={(e) => setPricePerMwh(clamp(+e.target.value, 0, 100000))}
                />
              </EField>

              <EField label="AI Growth Zone pricing support">
                <ESelect value={support} onChange={(e) => setSupport(e.target.value)}>
                  {SUPPORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </ESelect>
                {support === "custom" && (
                  <div className="mt-2">
                    <ENumber
                      min={0}
                      step={1}
                      value={customDiscount}
                      onChange={(e) => setCustomDiscount(clamp(+e.target.value, 0, 200))}
                    />
                    <span className="mt-1 block text-xs text-energy-ink/50">Custom discount (£ / MWh)</span>
                  </div>
                )}
              </EField>

              <EField label="Estimated project investment (£ millions)">
                <ENumber
                  min={0}
                  step={10}
                  value={investmentM}
                  onChange={(e) => setInvestmentM(clamp(+e.target.value, 0, 1_000_000))}
                />
              </EField>

              <EField label="Jobs per £100 million investment" hint="editable">
                <ENumber
                  min={0}
                  step={1}
                  value={jobsMultiplier}
                  onChange={(e) => setJobsMultiplier(clamp(+e.target.value, 0, 100000))}
                />
              </EField>

              <EField label={`Local benefit score: ${benefitScore}/10`}>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={benefitScore}
                  onChange={(e) => setBenefitScore(+e.target.value)}
                  className="w-full cursor-pointer"
                  style={{ accentColor: "#1f9bff" }}
                />
                <p className="mt-1.5 text-xs text-energy-ink/50">
                  How strongly does the project support local jobs, skills, regeneration and infrastructure?
                </p>
              </EField>

              <EField label="UK grid carbon factor (t CO₂ / MWh)" hint="editable estimate">
                <ENumber
                  min={0}
                  step={0.01}
                  value={carbonFactor}
                  onChange={(e) => setCarbonFactor(clamp(+e.target.value, 0, 5))}
                />
              </EField>
            </div>
          </WhiteCard>

          {/* Results */}
          <div className="lg:col-span-3 space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <DataCard label="Annual electricity use" value={`${num.format(r.annualMwh)} MWh`} accent />
              <DataCard label="Annual cost after support" value={gbp.format(r.costAfter)} accent />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <DataCard label="IT load" value={`${num.format(r.itLoadMw)} MW`} />
              <DataCard label="Facility load (incl. PUE)" value={`${num.format(r.facilityLoadMw)} MW`} />
              <DataCard label="Cost before support" value={gbp.format(r.costBefore)} />
              <DataCard label="Annual support saving" value={gbp.format(r.saving)} />
              <DataCard label="Annual CO₂ emissions" value={`${num.format(r.co2Tonnes)} t`} />
              <DataCard label="Jobs supported" value={num.format(r.jobs)} />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <RatingCard label="Grid pressure rating" level={r.grid.level} pct={r.grid.pct} />
              <RatingCard label="Local benefit rating" level={`${benefitScore}/10`} pct={r.benefitPct} />
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <Gauge label="Electricity" value={r.annualMwh / 1_000_000} max={20} unit="TWh / yr" accent />
              <Gauge label="Cost" value={r.costAfter / 1_000_000} max={2000} unit="£m / yr" />
              <Gauge label="UK homes" value={r.homes / 1_000_000} max={5} unit="m homes" />
            </div>
          </div>
        </div>

        {/* Comparison cards */}
        <div>
          <h3 className="font-display text-lg font-bold text-white mb-4">What this project is equivalent to</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <CompareCard icon={Home} value={num.format(r.homes)} label="UK homes powered for a year" />
            <CompareCard icon={Car} value={num.format(r.evCharges)} label="Full EV charges" />
            <CompareCard icon={PoundSterling} value={gbp.format(r.costAfter)} label="Annual electricity cost (after support)" />
            <CompareCard icon={PoundSterling} value={gbp.format(r.saving)} label="Possible pricing support saving" />
            <CompareCard icon={Leaf} value={`${num.format(r.co2Tonnes)} t`} label="Estimated annual CO₂ emissions" />
            <CompareCard icon={Briefcase} value={num.format(r.jobs)} label="Estimated jobs supported" />
          </div>
        </div>

        {/* Insights */}
        <WhiteCard>
          <h3 className="font-display text-lg font-bold flex items-center gap-2">
            <Zap className="h-5 w-5 text-electric" /> Indicative insights
          </h3>
          <ul className="mt-3 space-y-2.5 text-sm text-energy-ink/80 leading-relaxed list-disc pl-5">
            <li>
              At this scale, the proposed AI Growth Zone could require approximately{" "}
              <strong>{num.format(r.annualMwh)} MWh</strong> of electricity per year — comparable to roughly{" "}
              <strong>{num.format(r.homes)} UK homes</strong>.
            </li>
            {r.saving > 0 && (
              <li>
                With the selected pricing support, the project could reduce annual electricity costs by approximately{" "}
                <strong>{gbp.format(r.saving)}</strong>, bringing the estimated annual bill from{" "}
                <strong>{gbp.format(r.costBefore)}</strong> to <strong>{gbp.format(r.costAfter)}</strong>.
              </li>
            )}
            <li>
              A facility load of around <strong>{num.format(r.facilityLoadMw)} MW</strong> suggests a{" "}
              <strong>{r.grid.level.toLowerCase()}</strong> grid pressure rating — large developments can place
              significant pressure on local grid capacity.
            </li>
            <li>
              This estimate shows why grid connections, planning speed and energy pricing are central to the UK AI Growth
              Zone debate.
            </li>
            <li>These figures are indicative scenarios for education and comparison — not official forecasts.</li>
          </ul>
        </WhiteCard>

        {/* Educational */}
        <SeoSection title="What is an AI Growth Zone?">
          <p>
            AI Growth Zones are a UK policy concept intended to support large-scale AI infrastructure — especially data
            centres — by improving planning coordination, grid access and investment support in selected regions. The aim
            is to make it faster and more attractive to build the compute capacity needed for AI, while channelling
            investment towards areas that can benefit from jobs and regeneration.
          </p>
        </SeoSection>

        <SeoSection title="Why electricity demand matters">
          <p>
            AI data centres require large, reliable and continuous power supplies. At hundreds of megawatts, a single
            campus can consume as much electricity as a small city, and that demand competes with other local needs such
            as housing, industry and electrification of transport and heating. Understanding the indicative scale of
            demand is essential to any serious discussion about siting and supporting these developments.
          </p>
        </SeoSection>

        <SeoSection title="Why grid connections matter">
          <p>
            The UK government has highlighted grid connections as a major blocker for large projects. Slow or limited
            connections can delay developments by years. AI Growth Zones are intended to reduce this barrier through
            faster, better-coordinated grid access — but the underlying capacity and reinforcement still have to be
            planned and built.
          </p>
        </SeoSection>

        <SeoSection title="What pricing support means">
          <p>
            Pricing support means a reduction in the effective electricity price a project pays, expressed here as a
            discount in £ per MWh. In plain English, it lowers the running cost of the facility. Crucially, any such
            support depends on policy, region and eligibility, and may change over time — so the savings shown are
            indicative scenarios, not guaranteed reductions.
          </p>
        </SeoSection>

        <SeoSection title="Local impact">
          <p>
            Large AI developments can bring jobs, investment and infrastructure upgrades, but they also raise questions
            about grid and water pressure, planning, noise, land use and environmental impact. The local benefit score in
            this tool is a simple way to reflect how strongly a project supports local jobs, skills, regeneration and
            infrastructure — alongside the harder energy and cost numbers.
          </p>
        </SeoSection>

        <SeoSection title="How this calculator works">
          <p>
            IT load (MW) = capacity × utilisation. Facility load (MW) = IT load × PUE. Annual electricity use (MWh) =
            facility load × {num.format(HOURS_PER_YEAR)} hours. Cost before support = annual MWh × electricity price.
            Support saving = annual MWh × discount. Cost after support = cost before − saving. Estimated jobs =
            investment ÷ £100m × jobs multiplier. CO₂ = annual MWh × your editable grid carbon factor (default 0.15 t
            CO₂/MWh). Home equivalents assume a UK household uses about {UK_HOME_ANNUAL_MWH} MWh per year.
          </p>
        </SeoSection>

        <SeoSection title="Limitations">
          <p>Please treat these figures as indicative estimates, not measurements or official forecasts. In particular:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>This is an educational estimate only.</li>
            <li>
              Real project impacts depend on grid connection agreements, planning consent, local infrastructure, cooling
              design, energy contracts, water use and operational behaviour.
            </li>
            <li>It should not be treated as engineering, planning, legal or investment advice.</li>
          </ul>
        </SeoSection>

        {/* Internal links */}
        <SeoSection title="Related Tools & Resources">
          <ul className="mt-1 space-y-2">
            <li>
              <Link
                to="/ai-data-centre-electricity-calculator"
                className="flex items-center gap-2 rounded-lg bg-white p-3 border border-black/5 hover:border-electric/40 transition-colors text-electric font-semibold"
              >
                <ArrowRight className="h-4 w-4 shrink-0" /> AI Data Centre Electricity Calculator
              </Link>
            </li>
            <li>
              <Link
                to="/ai-water-consumption-calculator"
                className="flex items-center gap-2 rounded-lg bg-white p-3 border border-black/5 hover:border-electric/40 transition-colors text-electric font-semibold"
              >
                <ArrowRight className="h-4 w-4 shrink-0" /> AI Water Consumption Calculator
              </Link>
            </li>
            <li>
              <Link
                to="/guides/ai-electricity-cost-calculator"
                className="flex items-center gap-2 rounded-lg bg-white p-3 border border-black/5 hover:border-electric/40 transition-colors text-electric font-semibold"
              >
                <ArrowRight className="h-4 w-4 shrink-0" /> AI Electricity Cost Calculator
              </Link>
            </li>
            <li>
              <Link
                to="/reports"
                className="flex items-center gap-2 rounded-lg bg-white p-3 border border-black/5 hover:border-electric/40 transition-colors text-electric font-semibold"
              >
                <ArrowRight className="h-4 w-4 shrink-0" /> AI Energy Reports & Research
              </Link>
            </li>
            <li>
              <a
                href="https://aienergyintelligence.co.uk/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-white p-3 border border-black/5 hover:border-electric/40 transition-colors text-electric font-semibold"
              >
                <ArrowRight className="h-4 w-4 shrink-0" /> UK AI Infrastructure on AI Energy Intelligence UK
              </a>
            </li>
            <li>
              <a
                href="https://aienergyintelligence.co.uk/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-white p-3 border border-black/5 hover:border-electric/40 transition-colors text-electric font-semibold"
              >
                <ArrowRight className="h-4 w-4 shrink-0" /> AI Growth Zone Articles
              </a>
            </li>
          </ul>
        </SeoSection>

        <EnergyFAQ
          items={[
            {
              q: "What is an AI Growth Zone?",
              a: "A UK policy idea intended to accelerate large-scale AI infrastructure — especially data centres — by improving planning coordination, grid access and investment support in chosen regions.",
            },
            {
              q: "Why do AI Growth Zones need so much electricity?",
              a: "AI data centres run dense clusters of GPUs around the clock. At hundreds of megawatts, a single development can require as much electricity as a small city, placing sustained demand on local grids.",
            },
            {
              q: "How much power could an AI data centre use?",
              a: "It varies by design, but proposed AI campuses can range from tens of megawatts to over a gigawatt. This calculator models 10MW to 2,000MW and estimates annual electricity use from utilisation and PUE.",
            },
            {
              q: "Could AI Growth Zones affect local electricity infrastructure?",
              a: "Yes. Large, continuous demand can require grid reinforcement, new connections and planning. AI Growth Zones aim to reduce these barriers, but local infrastructure pressure remains a key consideration.",
            },
            {
              q: "What does PUE mean?",
              a: "PUE (Power Usage Effectiveness) compares total facility energy use with energy delivered to IT equipment. A PUE of 1.2 is excellent and 2.0 is poor — higher means more energy spent on cooling and overheads.",
            },
            {
              q: "Are AI Growth Zone cost savings guaranteed?",
              a: "No. Any pricing support depends on policy, region and eligibility, and may change. The savings shown are indicative scenarios, not guaranteed reductions.",
            },
            {
              q: "Could AI Growth Zones affect water use?",
              a: "Potentially. Large data centres often use water for cooling, particularly evaporative cooling. In water-stressed regions this can add local pressure unless low-water cooling is used.",
            },
            {
              q: "Are these calculations exact?",
              a: "No. This is an educational, indicative tool. Real impacts depend on grid agreements, planning consent, cooling design, energy contracts and operations. It is not engineering, planning, legal or investment advice.",
            },
          ]}
        />

        {/* CTA */}
        <div className="rounded-2xl bg-energy-navy border border-white/10 p-8 text-center">
          <h3 className="font-display text-2xl font-bold text-white">Explore more AI energy tools</h3>
          <p className="mt-2 text-white/70 max-w-xl mx-auto">
            Estimate electricity, cost, carbon, water and infrastructure impact with the full AI Energy Intelligence UK suite of UK AI
            energy calculators.
          </p>
          <Link
            to="/ai-energy-calculators"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-electric px-5 py-3 text-sm font-semibold text-electric-foreground hover:opacity-90 transition-opacity"
          >
            Browse AI Energy Tools <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </EnergyContainer>
    </EnergyShell>
  );
}
