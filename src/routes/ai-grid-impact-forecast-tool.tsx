import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  LineChart as RLineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Activity,
  Home,
  Car,
  Factory,
  Server,
  PoundSterling,
  Leaf,
  Zap,
  ArrowRight,
  Info,
} from "lucide-react";
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

export const Route = createFileRoute("/ai-grid-impact-forecast-tool")({
  head: () => ({
    meta: [
      { title: "AI Grid Impact Forecast Tool UK | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Forecast how AI data centres and AI adoption could affect UK electricity demand, grid pressure, carbon emissions and infrastructure needs.",
      },
      { property: "og:title", content: "AI Grid Impact Forecast Tool UK | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content:
          "Forecast how AI data centres and AI adoption could affect UK electricity demand, grid pressure, carbon emissions and infrastructure needs.",
      },
      {
        property: "og:url",
        content: "https://aienergyintelligence.co.uk/ai-grid-impact-forecast-tool",
      },
    ],
    links: [
      { rel: "canonical", href: "https://aienergyintelligence.co.uk/ai-grid-impact-forecast-tool" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "AI Grid Impact Forecast Tool",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Any",
          url: "https://aienergyintelligence.co.uk/ai-grid-impact-forecast-tool",
          description:
            "Forecast how AI data centres and AI adoption could affect UK electricity demand, grid pressure, carbon emissions and infrastructure needs.",
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
              name: "How could AI affect the UK electricity grid?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "AI increases electricity demand mainly through data centres running power-hungry GPU clusters around the clock, plus the cooling and supporting infrastructure they need. Concentrated, sustained demand can require grid reinforcement and new generation capacity.",
              },
            },
            {
              "@type": "Question",
              name: "What is AI-related electricity demand?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "It is the estimated electricity used by AI workloads, including model training and inference in data centres, the servers that run them, cooling systems and supporting infrastructure.",
              },
            },
            {
              "@type": "Question",
              name: "Why do data centres need large grid connections?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Large AI data centres can draw hundreds of megawatts continuously — comparable to a small town — so they require substantial grid connections that may take years to secure and can compete with other local demand.",
              },
            },
            {
              "@type": "Question",
              name: "What does PUE mean?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Power Usage Effectiveness (PUE) compares total facility power use against the power delivered to IT equipment. A PUE of 1.2 is excellent, 1.4 good, 1.6 average and 2.0 poor. Lower is more efficient.",
              },
            },
            {
              "@type": "Question",
              name: "Could AI increase UK electricity prices?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Rising, concentrated demand can add pressure to wholesale prices and grid investment costs, though the effect depends on new generation, efficiency gains, policy and how demand is managed. This tool gives indicative scenarios, not price predictions.",
              },
            },
            {
              "@type": "Question",
              name: "Could AI require new power stations?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "At higher growth scenarios, AI-related demand can reach the scale of one or more large power stations, which may require new generation, renewables, storage or dedicated energy infrastructure.",
              },
            },
            {
              "@type": "Question",
              name: "Are these forecasts official?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No. This is an educational scenario model. It is not an official National Grid or government forecast and does not use live grid connection data.",
              },
            },
            {
              "@type": "Question",
              name: "Why are AI grid forecasts uncertain?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "AI demand depends on model efficiency, hardware improvements, adoption levels, policy, energy pricing, data centre location and grid connection availability — all of which can change quickly.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: GridImpactForecast,
});

// ---- UK assumptions ----
const HOME_ANNUAL_MWH = 2.7; // typical UK home ~2,700 kWh/yr
const EV_CHARGE_KWH = 54; // full charge of a typical EV
const LARGE_STATION_GW = 1.2; // typical large UK power station capacity
const DC_TYPICAL_MW = 100; // typical large AI data centre load
const HOURS_YEAR = 8760;

const PUE_OPTIONS = [
  { value: 1.2, label: "Excellent: 1.2" },
  { value: 1.3, label: "Very good: 1.3" },
  { value: 1.4, label: "Good: 1.4" },
  { value: 1.5, label: "Above average: 1.5" },
  { value: 1.6, label: "Average: 1.6" },
  { value: 2.0, label: "Poor: 2.0" },
];

const PERIODS = [
  { value: "2030", label: "2026 to 2030" },
  { value: "2035", label: "2026 to 2035" },
  { value: "2040", label: "2026 to 2040" },
  { value: "custom", label: "Custom" },
];

type ScenarioKey = "conservative" | "central" | "high" | "extreme" | "custom";

const SCENARIOS: Record<
  Exclude<ScenarioKey, "custom">,
  { label: string; growth: number; capacity: number; util: number; pue: number }
> = {
  conservative: { label: "Conservative", growth: 10, capacity: 250, util: 60, pue: 1.3 },
  central: { label: "Central", growth: 20, capacity: 500, util: 75, pue: 1.4 },
  high: { label: "High Growth", growth: 30, capacity: 1000, util: 80, pue: 1.5 },
  extreme: { label: "Extreme AI Expansion", growth: 40, capacity: 1500, util: 85, pue: 1.6 },
};

function clamp(n: number, min: number, max: number) {
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}

interface ModelInputs {
  startDemand: number; // TWh
  growth: number; // %
  capacity: number; // MW/year
  util: number; // %
  pue: number;
  price: number; // £/MWh
  carbon: number; // tCO2/MWh
  threshold: number; // TWh
  endYear: number;
}

function runModel(inp: ModelInputs) {
  const startYear = 2026;
  const dcAddTwh = (inp.capacity * (inp.util / 100) * inp.pue * HOURS_YEAR) / 1_000_000;
  const rows: {
    year: number;
    demand: number;
    cost: number;
    co2: number;
    cumulative: number;
  }[] = [];

  let demand = inp.startDemand;
  let cumulative = 0;
  let crossYear: number | null = null;

  for (let y = startYear; y <= inp.endYear; y++) {
    if (y === startYear) {
      demand = inp.startDemand;
    } else {
      demand = demand * (1 + inp.growth / 100) + dcAddTwh;
    }
    cumulative += demand;
    const mwh = demand * 1_000_000;
    const cost = mwh * inp.price;
    const co2 = mwh * inp.carbon;
    if (crossYear === null && demand >= inp.threshold) crossYear = y;
    rows.push({ year: y, demand, cost, co2, cumulative });
  }

  const final = rows[rows.length - 1];
  const finalMwh = final.demand * 1_000_000;
  const pressureScore = clamp((final.demand / inp.threshold) * 100, 0, 100);
  const ratio = final.demand / inp.threshold;
  const rating =
    ratio < 0.25 ? "Low" : ratio < 0.5 ? "Moderate" : ratio <= 1 ? "High" : "Severe";

  // additional generation required (average GW to serve final-year demand)
  const avgGw = (final.demand * 1000) / HOURS_YEAR;

  return {
    rows,
    final,
    dcAddTwh,
    crossYear,
    pressureScore,
    ratio,
    rating,
    homes: finalMwh / HOME_ANNUAL_MWH,
    evCharges: (finalMwh * 1000) / EV_CHARGE_KWH,
    stations: avgGw / LARGE_STATION_GW,
    dataCentres: (inp.capacity * (inp.endYear - startYear)) / DC_TYPICAL_MW,
    avgGw,
  };
}

function Gauge({ score, rating }: { score: number; rating: string }) {
  const color =
    rating === "Low"
      ? "#22c55e"
      : rating === "Moderate"
        ? "#eab308"
        : rating === "High"
          ? "#f97316"
          : "#ef4444";
  const radius = 70;
  const circ = Math.PI * radius; // semicircle
  const dash = (score / 100) * circ;
  return (
    <div className="rounded-2xl bg-energy-card text-energy-ink p-6 shadow-card border border-black/5 flex flex-col items-center">
      <div className="text-xs font-semibold uppercase tracking-wider text-energy-ink/60 mb-2">
        Grid pressure score
      </div>
      <svg viewBox="0 0 180 100" className="w-full max-w-[220px]">
        <path
          d="M 20 95 A 70 70 0 0 1 160 95"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 20 95 A 70 70 0 0 1 160 95"
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
        />
        <text x="90" y="80" textAnchor="middle" className="fill-current" fontSize="30" fontWeight="700">
          {Math.round(score)}
        </text>
      </svg>
      <div className="mt-1 text-lg font-display font-bold" style={{ color }}>
        {rating}
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

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <WhiteCard>
      <h3 className="font-display text-lg font-bold mb-4">{title}</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {children as any}
        </ResponsiveContainer>
      </div>
    </WhiteCard>
  );
}

function GridImpactForecast() {
  const [period, setPeriod] = useState("2035");
  const [customEnd, setCustomEnd] = useState(2035);
  const [startDemand, setStartDemand] = useState(5);
  const [growth, setGrowth] = useState(20);
  const [capacity, setCapacity] = useState(500);
  const [util, setUtil] = useState(75);
  const [pue, setPue] = useState(1.4);
  const [price, setPrice] = useState(120);
  const [carbon, setCarbon] = useState(0.15);
  const [threshold, setThreshold] = useState(20);
  const [scenario, setScenario] = useState<ScenarioKey>("central");

  const endYear =
    period === "custom"
      ? clamp(customEnd, 2027, 2060)
      : Number(period);

  function applyScenario(key: ScenarioKey) {
    setScenario(key);
    if (key !== "custom") {
      const s = SCENARIOS[key];
      setGrowth(s.growth);
      setCapacity(s.capacity);
      setUtil(s.util);
      setPue(s.pue);
    }
  }

  const inputs: ModelInputs = {
    startDemand,
    growth,
    capacity,
    util,
    pue,
    price,
    carbon,
    threshold,
    endYear,
  };

  const r = useMemo(() => runModel(inputs), [
    startDemand,
    growth,
    capacity,
    util,
    pue,
    price,
    carbon,
    threshold,
    endYear,
  ]);

  // scenario comparison (uses current shared assumptions for price/carbon/threshold/start/period)
  const comparison = useMemo(() => {
    return (["conservative", "central", "high", "extreme"] as const).map((key) => {
      const s = SCENARIOS[key];
      const res = runModel({
        startDemand,
        growth: s.growth,
        capacity: s.capacity,
        util: s.util,
        pue: s.pue,
        price,
        carbon,
        threshold,
        endYear,
      });
      return { name: s.label, demand: +res.final.demand.toFixed(1) };
    });
  }, [startDemand, price, carbon, threshold, endYear]);

  const chartData = r.rows.map((row) => ({
    year: row.year,
    demand: +row.demand.toFixed(2),
    cost: +(row.cost / 1_000_000).toFixed(1), // £m
    cumulative: +row.cumulative.toFixed(1),
  }));

  // PUE improvement insight
  const betterPue = runModel({ ...inputs, pue: 1.2 });
  const pueSavingTwh = r.final.demand - betterPue.final.demand;

  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "AI Energy Intelligence UK", to: "/" },
          { label: "AI Energy Tools" },
          { label: "AI Energy Calculators", to: "/ai-energy-calculators" },
          { label: "AI Grid Impact Forecast Tool" },
        ]}
      />
      <EnergyHero
        eyebrow="AI Energy Tools"
        title="AI Grid Impact Forecast Tool"
        intro="A UK-focused, scenario-based forecast model that estimates how AI adoption, data centre growth and AI infrastructure expansion could affect electricity demand, grid pressure, carbon emissions and infrastructure needs over time. Educational and indicative — not an official grid forecast."
        icon={Activity}
      />

      <EnergyContainer className="py-10 space-y-8">
        <DisclaimerBanner />

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Inputs */}
          <WhiteCard className="lg:col-span-2">
            <h3 className="font-display text-lg font-bold mb-5">Forecast assumptions</h3>
            <div className="space-y-5">
              <EField label="Scenario type" hint="auto-fills assumptions">
                <ESelect value={scenario} onChange={(e) => applyScenario(e.target.value as ScenarioKey)}>
                  <option value="conservative">Conservative</option>
                  <option value="central">Central</option>
                  <option value="high">High Growth</option>
                  <option value="extreme">Extreme AI Expansion</option>
                  <option value="custom">Custom</option>
                </ESelect>
              </EField>

              <EField label="Forecast period">
                <ESelect
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  {PERIODS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </ESelect>
                {period === "custom" && (
                  <div className="mt-2">
                    <ENumber
                      min={2027}
                      max={2060}
                      value={customEnd}
                      onChange={(e) => setCustomEnd(clamp(+e.target.value, 2027, 2060))}
                    />
                  </div>
                )}
              </EField>

              <EField label="Starting AI-related demand (TWh/yr)" hint="current AI workload demand">
                <ENumber
                  min={0}
                  step={0.5}
                  value={startDemand}
                  onChange={(e) => setStartDemand(clamp(+e.target.value, 0, 1000))}
                />
                <p className="mt-1.5 flex items-start gap-1.5 text-xs text-energy-ink/50">
                  <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  Estimated current annual electricity demand linked to AI workloads, data centres and AI
                  infrastructure.
                </p>
              </EField>

              <EField label={`Annual AI demand growth rate: ${growth}%`} hint="5% – 50%">
                <input
                  type="range"
                  min={5}
                  max={50}
                  step={1}
                  value={growth}
                  onChange={(e) => {
                    setGrowth(+e.target.value);
                    setScenario("custom");
                  }}
                  className="w-full cursor-pointer"
                  style={{ accentColor: "#1f9bff" }}
                />
              </EField>

              <EField label="Data centre capacity growth (MW added/yr)">
                <ENumber
                  min={0}
                  step={50}
                  value={capacity}
                  onChange={(e) => {
                    setCapacity(clamp(+e.target.value, 0, 100000));
                    setScenario("custom");
                  }}
                />
              </EField>

              <EField label={`Average utilisation rate: ${util}%`} hint="10% – 100%">
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={1}
                  value={util}
                  onChange={(e) => {
                    setUtil(+e.target.value);
                    setScenario("custom");
                  }}
                  className="w-full cursor-pointer"
                  style={{ accentColor: "#1f9bff" }}
                />
              </EField>

              <EField label="Average PUE" hint="lower is more efficient">
                <ESelect
                  value={String(pue)}
                  onChange={(e) => {
                    setPue(+e.target.value);
                    setScenario("custom");
                  }}
                >
                  {PUE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </ESelect>
                <p className="mt-1.5 flex items-start gap-1.5 text-xs text-energy-ink/50">
                  <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  PUE measures total facility power use compared with IT equipment power use. Lower is more
                  efficient.
                </p>
              </EField>

              <EField label="Electricity price (£/MWh)">
                <ENumber
                  min={0}
                  step={5}
                  value={price}
                  onChange={(e) => setPrice(clamp(+e.target.value, 0, 5000))}
                />
              </EField>

              <EField label="UK grid carbon factor (tCO₂/MWh)" hint="changes over time">
                <ENumber
                  min={0}
                  step={0.01}
                  value={carbon}
                  onChange={(e) => setCarbon(clamp(+e.target.value, 0, 2))}
                />
              </EField>

              <EField label="Grid stress threshold (TWh/yr)">
                <ENumber
                  min={1}
                  step={1}
                  value={threshold}
                  onChange={(e) => setThreshold(clamp(+e.target.value, 1, 10000))}
                />
                <p className="mt-1.5 flex items-start gap-1.5 text-xs text-energy-ink/50">
                  <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  Set a threshold where AI demand may become significant enough to require additional grid
                  planning, local reinforcement or new generation.
                </p>
              </EField>
            </div>
          </WhiteCard>

          {/* Results */}
          <div className="lg:col-span-3 space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <DataCard
                label={`AI demand by ${endYear}`}
                value={`${num.format(r.final.demand)} TWh/yr`}
                accent
              />
              <DataCard label="Cumulative AI demand" value={`${num.format(r.final.cumulative)} TWh`} accent />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <DataCard label={`Annual cost by ${endYear}`} value={gbp.format(r.final.cost)} />
              <DataCard label={`Annual CO₂ by ${endYear}`} value={`${num.format(r.final.co2 / 1000)} kt`} />
              <DataCard
                label="Threshold crossed"
                value={r.crossYear ? String(r.crossYear) : "Not reached"}
              />
              <DataCard label="UK homes powered" value={num.format(r.homes)} />
              <DataCard label="Full EV charges" value={num.format(r.evCharges)} />
              <DataCard label="Extra generation" value={`${num.format(r.avgGw)} GW avg`} />
            </div>

            <Gauge score={r.pressureScore} rating={r.rating} />
          </div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <ChartCard title="AI electricity demand over time (TWh/yr)">
            <RLineChart data={chartData} margin={{ left: -10, right: 10, top: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" fontSize={12} />
              <YAxis fontSize={12} />
              <RTooltip />
              <Line type="monotone" dataKey="demand" name="TWh/yr" stroke="#1f9bff" strokeWidth={2.5} dot={false} />
            </RLineChart>
          </ChartCard>

          <ChartCard title="Annual electricity cost over time (£m/yr)">
            <BarChart data={chartData} margin={{ left: -5, right: 10, top: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" fontSize={12} />
              <YAxis fontSize={12} />
              <RTooltip />
              <Bar dataKey="cost" name="£m/yr" fill="#0b3d91" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartCard>

          <ChartCard title="Cumulative AI demand over time (TWh)">
            <AreaChart data={chartData} margin={{ left: -10, right: 10, top: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" fontSize={12} />
              <YAxis fontSize={12} />
              <RTooltip />
              <Area
                type="monotone"
                dataKey="cumulative"
                name="Cumulative TWh"
                stroke="#1f9bff"
                fill="#1f9bff"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ChartCard>

          <ChartCard title={`Scenario comparison — demand by ${endYear} (TWh/yr)`}>
            <BarChart data={comparison} margin={{ left: -5, right: 10, top: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" fontSize={10} interval={0} />
              <YAxis fontSize={12} />
              <RTooltip />
              <Legend />
              <Bar dataKey="demand" name="TWh/yr" fill="#1f9bff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartCard>
        </div>

        {/* Comparison cards */}
        <div>
          <h3 className="font-display text-lg font-bold text-white mb-4">
            What final-year demand is equivalent to
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <CompareCard icon={Home} value={num.format(r.homes)} label="UK homes powered for a year" />
            <CompareCard icon={Car} value={num.format(r.evCharges)} label="Full EV charges" />
            <CompareCard
              icon={Factory}
              value={`${num.format(r.stations)}×`}
              label="Large power stations equivalent"
            />
            <CompareCard
              icon={Server}
              value={num.format(r.dataCentres)}
              label="Approx. large data centres added"
            />
            <CompareCard icon={PoundSterling} value={gbp.format(r.final.cost)} label="Annual electricity bill" />
            <CompareCard
              icon={Leaf}
              value={`${num.format(r.final.co2 / 1000)} kt`}
              label="Annual carbon emissions"
            />
          </div>
        </div>

        {/* Dynamic insights */}
        <WhiteCard>
          <h3 className="font-display text-lg font-bold flex items-center gap-2">
            <Zap className="h-5 w-5 text-electric" /> Scenario insights
          </h3>
          <ul className="mt-3 space-y-2.5 text-sm text-energy-ink/80 leading-relaxed list-disc pl-5">
            <li>
              Under this scenario, AI-related electricity demand could reach approximately{" "}
              <strong>{num.format(r.final.demand)} TWh per year by {endYear}</strong>.
            </li>
            <li>
              {r.crossYear ? (
                <>
                  The model crosses the selected grid stress threshold of{" "}
                  <strong>{num.format(threshold)} TWh</strong> in <strong>{r.crossYear}</strong>.
                </>
              ) : (
                <>
                  The model does not cross the selected grid stress threshold of{" "}
                  <strong>{num.format(threshold)} TWh</strong> within this forecast period.
                </>
              )}
            </li>
            {r.ratio >= 0.5 && (
              <li>
                At this level, AI demand may require additional grid reinforcement, new generation capacity or
                dedicated energy infrastructure.
              </li>
            )}
            {pueSavingTwh > 0.1 && (
              <li>
                Improving average PUE to <strong>1.2 (Excellent)</strong> could reduce final-year demand by
                approximately <strong>{num.format(pueSavingTwh)} TWh</strong>.
              </li>
            )}
            <li>
              This scenario suggests AI infrastructure could become a{" "}
              <strong>{r.rating === "Severe" || r.rating === "High" ? "major" : "growing"}</strong> planning
              factor for the UK electricity grid, with a grid pressure rating of <strong>{r.rating}</strong>.
            </li>
          </ul>
        </WhiteCard>

        {/* Educational content */}
        <SeoSection title="What is AI grid impact?">
          <p>
            AI grid impact describes how artificial intelligence increases electricity demand and places pressure
            on the power network. AI affects demand through data centres running dense clusters of GPU and
            accelerator hardware, the server loads they sustain around the clock, the cooling systems that remove
            their heat, and the supporting infrastructure needed to keep them online.
          </p>
        </SeoSection>

        <SeoSection title="Why data centre growth matters">
          <p>
            Large AI data centres can require substantial grid connections — often hundreds of megawatts each.
            Securing these connections can take years and may compete with other local demand such as housing,
            industry and electrification of transport and heating. Where and how quickly capacity is added has a
            direct influence on local infrastructure and the wider grid.
          </p>
        </SeoSection>

        <SeoSection title="What is PUE?">
          <p>
            Power Usage Effectiveness (PUE) compares the total energy a facility uses against the energy delivered
            to its IT equipment. A PUE of 1.0 would be perfectly efficient; 1.2 is excellent, 1.4 is good, 1.6 is
            average and 2.0 is poor. The higher the PUE, the more energy is spent on cooling and overheads rather
            than computing — so reducing PUE directly lowers total demand, cost and carbon.
          </p>
        </SeoSection>

        <SeoSection title="Why forecasting is uncertain">
          <p>
            AI electricity demand is genuinely hard to forecast. It depends on model efficiency, hardware
            improvements, AI adoption levels, government policy, energy pricing, where data centres are located and
            the availability of grid connections. Small changes in any of these can produce very different
            outcomes, which is why this tool presents scenarios rather than a single prediction.
          </p>
        </SeoSection>

        <SeoSection title="Why this matters for the UK">
          <p>
            AI infrastructure links directly to several UK priorities: AI Growth Zones, National Grid upgrades,
            electricity generation and renewables, planning and local infrastructure, and business energy costs.
            Understanding indicative demand trajectories helps businesses, local authorities and analysts ask
            better questions about grid readiness and energy strategy.
          </p>
        </SeoSection>

        <SeoSection title="Limitations">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>This is an educational scenario model, not a precise engineering tool.</li>
            <li>It does not use live grid connection data.</li>
            <li>It is not an official National Grid or government forecast.</li>
            <li>
              It should not be used as engineering, investment, planning or legal advice. Always seek qualified
              professional guidance for real decisions.
            </li>
          </ul>
        </SeoSection>

        <SeoSection title="How this forecast model works">
          <p>
            For each year, demand grows from the previous year by the annual growth rate, plus additional data
            centre demand calculated as MW added × utilisation × PUE × {num.format(HOURS_YEAR)} hours, converted to
            TWh. Annual cost uses total demand in MWh × electricity price, and annual carbon uses total demand in
            MWh × the grid carbon factor. Cumulative demand sums total AI-related demand across the period, and the
            grid pressure score compares final-year demand against your grid stress threshold.
          </p>
        </SeoSection>

        {/* Internal links */}
        <SeoSection title="Related Tools & Resources">
          <ul className="mt-1 space-y-2">
            {[
              { to: "/ai-data-centre-electricity-calculator", label: "AI Data Centre Electricity Calculator" },
              { to: "/ai-water-consumption-calculator", label: "AI Water Consumption Calculator" },
              { to: "/ai-growth-zone-impact-calculator", label: "AI Growth Zone Impact Calculator" },
              { to: "/guides/ai-electricity-cost-calculator", label: "AI Electricity Cost Calculator" },
              { to: "/reports", label: "AI Energy Reports & Research" },
            ].map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="flex items-center gap-2 rounded-lg bg-white p-3 border border-black/5 hover:border-electric/40 transition-colors text-electric font-semibold"
                >
                  <ArrowRight className="h-4 w-4 shrink-0" /> {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/news"
                className="flex items-center gap-2 rounded-lg bg-white p-3 border border-black/5 hover:border-electric/40 transition-colors text-electric font-semibold"
              >
                <ArrowRight className="h-4 w-4 shrink-0" /> Latest UK AI infrastructure & grid news
              </Link>
            </li>
          </ul>
        </SeoSection>

        <EnergyFAQ
          items={[
            {
              q: "How could AI affect the UK electricity grid?",
              a: "AI increases electricity demand mainly through data centres running power-hungry GPU clusters around the clock, plus cooling and supporting infrastructure. Concentrated, sustained demand can require grid reinforcement and new generation capacity.",
            },
            {
              q: "What is AI-related electricity demand?",
              a: "It is the estimated electricity used by AI workloads — model training and inference in data centres, the servers that run them, cooling systems and supporting infrastructure.",
            },
            {
              q: "Why do data centres need large grid connections?",
              a: "Large AI data centres can draw hundreds of megawatts continuously, comparable to a small town, so they need substantial grid connections that may take years to secure and can compete with other local demand.",
            },
            {
              q: "What does PUE mean?",
              a: "Power Usage Effectiveness compares total facility power against power delivered to IT equipment. 1.2 is excellent, 1.4 good, 1.6 average and 2.0 poor. Lower is more efficient.",
            },
            {
              q: "Could AI increase UK electricity prices?",
              a: "Rising, concentrated demand can add pressure to prices and grid investment, though the effect depends on new generation, efficiency, policy and demand management. This tool gives indicative scenarios, not price predictions.",
            },
            {
              q: "Could AI require new power stations?",
              a: "At higher growth scenarios, AI demand can reach the scale of one or more large power stations, which may require new generation, renewables, storage or dedicated infrastructure.",
            },
            {
              q: "Are these forecasts official?",
              a: "No. This is an educational scenario model. It is not an official National Grid or government forecast and does not use live grid connection data.",
            },
            {
              q: "Why are AI grid forecasts uncertain?",
              a: "AI demand depends on model efficiency, hardware improvements, adoption levels, policy, energy pricing, data centre location and grid connection availability — all of which can change quickly.",
            },
          ]}
        />

        {/* CTA */}
        <div className="rounded-2xl bg-energy-navy border border-white/10 p-8 text-center">
          <h3 className="font-display text-2xl font-bold text-white">Explore more AI energy tools</h3>
          <p className="mt-2 text-white/70 max-w-xl mx-auto">
            Estimate electricity, water, cost and grid impact across AI Energy Intelligence UK's suite of UK AI energy
            intelligence tools.
          </p>
          <Link
            to="/ai-energy-calculators"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-electric px-6 py-3 text-sm font-semibold text-electric-foreground hover:opacity-90 transition-opacity"
          >
            View all AI Energy Tools <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </EnergyContainer>
    </EnergyShell>
  );
}
