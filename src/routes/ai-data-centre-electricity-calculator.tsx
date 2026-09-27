import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Server, Home, Car, Coffee, Leaf, Zap, ArrowRight, Info } from "lucide-react";
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

export const Route = createFileRoute("/ai-data-centre-electricity-calculator")({
  head: () => ({
    meta: [
      { title: "AI Data Centre Electricity Calculator UK | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Estimate the electricity consumption, annual energy costs and carbon impact of AI data centres using realistic UK assumptions.",
      },
      { property: "og:title", content: "AI Data Centre Electricity Calculator UK | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content:
          "Estimate the electricity consumption, annual energy costs and carbon impact of AI data centres using realistic UK assumptions.",
      },
      {
        property: "og:url",
        content: "https://aienergyintelligence.co.uk/ai-data-centre-electricity-calculator",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://aienergyintelligence.co.uk/ai-data-centre-electricity-calculator",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "AI Data Centre Electricity Calculator",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Any",
          url: "https://aienergyintelligence.co.uk/ai-data-centre-electricity-calculator",
          description:
            "Estimate the electricity consumption, annual energy costs and carbon impact of AI data centres using realistic UK assumptions.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
          publisher: { "@type": "Organization", name: "AI Energy Intelligence UK" },
        }),
      },
    ],
  }),
  component: DataCentreElectricityCalc,
});

// UK assumptions
const UK_CARBON_FACTOR = 0.207; // kg CO2 per kWh (UK grid average)
const UK_HOME_ANNUAL_KWH = 2700; // typical UK household annual electricity use
const EV_CHARGE_KWH = 54; // full charge of a typical EV battery
const KETTLE_KWH = 0.1; // per boil

const PUE_OPTIONS = [
  { value: 1.2, label: "Excellent (1.2)" },
  { value: 1.4, label: "Good (1.4)" },
  { value: 1.6, label: "Average (1.6)" },
  { value: 2.0, label: "Poor (2.0)" },
];

const SERVER_PRESETS = [
  { value: 400, label: "Standard Server (400W)" },
  { value: 700, label: "AI GPU Server (700W)" },
  { value: 1500, label: "High Density AI Server (1,500W)" },
  { value: 3000, label: "Advanced AI Cluster Node (3,000W)" },
];

function clamp(n: number, min: number, max: number) {
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
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

function DataCentreElectricityCalc() {
  const [servers, setServers] = useState(1000);
  const [watts, setWatts] = useState(700);
  const [utilisation, setUtilisation] = useState(75);
  const [pue, setPue] = useState(1.4);
  const [price, setPrice] = useState(0.25);

  const r = useMemo(() => {
    const n = clamp(servers, 1, 500000);
    const w = clamp(watts, 1, 50000);
    const util = clamp(utilisation, 10, 100) / 100;

    const itLoadKw = (n * w * util) / 1000; // kW
    const facilityLoadKw = itLoadKw * pue; // kW including overhead

    const dailyKwh = facilityLoadKw * 24;
    const monthlyKwh = dailyKwh * 30;
    const annualKwh = facilityLoadKw * 24 * 365;

    const dailyCost = dailyKwh * price;
    const monthlyCost = monthlyKwh * price;
    const annualCost = annualKwh * price;

    const annualCo2Tonnes = (annualKwh * UK_CARBON_FACTOR) / 1000;

    // PUE improvement saving (towards excellent 1.2)
    const idealPue = 1.2;
    const betterAnnualKwh = pue > idealPue ? itLoadKw * 24 * 365 * idealPue : annualKwh;
    const pueSaving = (annualKwh - betterAnnualKwh) * price;

    return {
      itLoadKw,
      facilityLoadKw,
      dailyKwh,
      monthlyKwh,
      annualKwh,
      dailyCost,
      monthlyCost,
      annualCost,
      annualCo2Tonnes,
      homes: annualKwh / UK_HOME_ANNUAL_KWH,
      evCharges: annualKwh / EV_CHARGE_KWH,
      kettles: annualKwh / KETTLE_KWH,
      pueSaving,
    };
  }, [servers, watts, utilisation, pue, price]);

  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "AI Energy Intelligence UK", to: "/" },
          { label: "AI Energy Tools" },
          { label: "AI Energy Calculators", to: "/ai-energy-calculators" },
          { label: "AI Data Centre Electricity Calculator" },
        ]}
      />
      <EnergyHero
        eyebrow="AI Energy Tools"
        title="AI Data Centre Electricity Calculator"
        intro="Estimate the annual electricity consumption, energy costs and carbon impact of an AI data centre based on server count, utilisation and operating assumptions. An educational planning tool for businesses, researchers, journalists and policy analysts."
        icon={Server}
      />

      <EnergyContainer className="py-10 space-y-8">
        <DisclaimerBanner />

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Inputs */}
          <WhiteCard className="lg:col-span-2">
            <h3 className="font-display text-lg font-bold mb-5">Facility assumptions</h3>
            <div className="space-y-5">
              <EField label="Number of AI servers" hint="1 – 500,000">
                <ENumber
                  min={1}
                  max={500000}
                  value={servers}
                  onChange={(e) => setServers(clamp(+e.target.value, 1, 500000))}
                />
              </EField>

              <EField label="Average power per server (Watts)" hint="choose a preset or enter your own">
                <ESelect
                  value={SERVER_PRESETS.some((p) => p.value === watts) ? String(watts) : "custom"}
                  onChange={(e) => {
                    if (e.target.value !== "custom") setWatts(+e.target.value);
                  }}
                >
                  {SERVER_PRESETS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                  <option value="custom">Custom…</option>
                </ESelect>
                <div className="mt-2">
                  <ENumber min={1} value={watts} onChange={(e) => setWatts(clamp(+e.target.value, 1, 50000))} />
                </div>
              </EField>

              <EField label={`Data centre utilisation rate: ${utilisation}%`} hint="10% – 100%">
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={1}
                  value={utilisation}
                  onChange={(e) => setUtilisation(+e.target.value)}
                  className="w-full accent-[hsl(var(--electric,200_90%_50%))] cursor-pointer"
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
                  PUE measures total facility energy use compared with IT equipment energy use.
                </p>
              </EField>

              <EField label="Electricity price (£ per kWh)">
                <ENumber min={0} step={0.01} value={price} onChange={(e) => setPrice(clamp(+e.target.value, 0, 10))} />
              </EField>
            </div>
          </WhiteCard>

          {/* Results */}
          <div className="lg:col-span-3 space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <DataCard label="Annual electricity consumption" value={`${num.format(r.annualKwh)} kWh`} accent />
              <DataCard label="Annual electricity cost" value={gbp.format(r.annualCost)} accent />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <DataCard label="Total IT load" value={`${num.format(r.itLoadKw)} kW`} />
              <DataCard label="Facility load (incl. PUE)" value={`${num.format(r.facilityLoadKw)} kW`} />
              <DataCard label="Annual carbon" value={`${num.format(r.annualCo2Tonnes)} t CO₂`} />
              <DataCard label="Daily consumption" value={`${num.format(r.dailyKwh)} kWh`} />
              <DataCard label="Monthly consumption" value={`${num.format(r.monthlyKwh)} kWh`} />
              <DataCard label="Daily cost" value={gbp.format(r.dailyCost)} />
              <DataCard label="Monthly cost" value={gbp.format(r.monthlyCost)} />
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <Gauge label="Consumption" value={r.annualKwh / 1_000_000} max={500} unit="GWh / yr" accent />
              <Gauge label="Cost" value={r.annualCost / 1_000_000} max={150} unit="£m / yr" />
              <Gauge label="Carbon" value={r.annualCo2Tonnes / 1000} max={100} unit="kt CO₂ / yr" />
            </div>
          </div>
        </div>

        {/* Comparison cards */}
        <div>
          <h3 className="font-display text-lg font-bold text-white mb-4">What this consumption is equivalent to</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <CompareCard icon={Home} value={num.format(r.homes)} label="UK homes powered for a year" />
            <CompareCard icon={Car} value={num.format(r.evCharges)} label="Full EV charges" />
            <CompareCard icon={Coffee} value={num.format(r.kettles)} label="Kettles boiled" />
            <CompareCard
              icon={Leaf}
              value={`${num.format(r.homes)}×`}
              label="Household electricity usage equivalent"
            />
          </div>
        </div>

        {/* Insights */}
        <WhiteCard>
          <h3 className="font-display text-lg font-bold flex items-center gap-2">
            <Zap className="h-5 w-5 text-electric" /> Insights
          </h3>
          <ul className="mt-3 space-y-2.5 text-sm text-energy-ink/80 leading-relaxed list-disc pl-5">
            <li>
              This facility would consume more electricity than approximately{" "}
              <strong>{num.format(r.homes)} UK homes</strong> use in a year.
            </li>
            <li>
              Annual electricity costs could reach approximately{" "}
              <strong>{gbp.format(r.annualCost)}</strong>
              {r.annualCost >= 1_000_000 && (
                <> — over <strong>£{num.format(r.annualCost / 1_000_000)} million</strong></>
              )}
              .
            </li>
            {r.pueSaving > 0 && (
              <li>
                Improving PUE to <strong>1.2 (Excellent)</strong> could save approximately{" "}
                <strong>{gbp.format(r.pueSaving)}</strong> annually in electricity costs.
              </li>
            )}
            <li>
              At UK grid average carbon intensity, this facility would emit roughly{" "}
              <strong>{num.format(r.annualCo2Tonnes)} tonnes of CO₂</strong> per year.
            </li>
            <li>
              <strong>What does this mean for the UK grid?</strong> Large AI facilities place sustained, round-the-clock
              demand on local networks, which can require grid reinforcement and influence where new capacity is built.
            </li>
          </ul>
        </WhiteCard>

        {/* Educational */}
        <SeoSection title="What is a data centre?">
          <p>
            A data centre is a facility housing large numbers of servers that store data and run software. AI data
            centres are specialised for training and running machine-learning models, packing in power-hungry GPU and
            accelerator hardware that runs continuously.
          </p>
        </SeoSection>

        <SeoSection title="Why AI consumes large amounts of electricity">
          <p>
            AI workloads rely on dense clusters of high-performance processors that draw far more power than traditional
            servers. Training and serving large models keeps that hardware busy around the clock, and every watt of
            compute also generates heat that must be removed — adding further energy demand.
          </p>
        </SeoSection>

        <SeoSection title="What is PUE?">
          <p>
            Power Usage Effectiveness (PUE) compares the total energy a facility uses against the energy delivered to its
            IT equipment. A PUE of 1.0 would be perfectly efficient; 1.2 is excellent, 1.4 is good, 1.6 is average and
            2.0 is poor. The higher the PUE, the more energy is spent on cooling and overheads rather than computing.
          </p>
        </SeoSection>

        <SeoSection title="How cooling systems affect energy use">
          <p>
            Cooling can account for a large share of a data centre's overhead. Air cooling, evaporative cooling, liquid
            cooling and free-air cooling all carry different energy and water trade-offs. Efficient cooling and a cooler
            climate reduce PUE and overall electricity demand.
          </p>
        </SeoSection>

        <SeoSection title="Why AI infrastructure matters to UK energy policy">
          <p>
            As AI adoption grows, data centres are becoming a meaningful and concentrated source of electricity demand.
            This affects grid planning, where new capacity is built, electricity pricing and the UK's net-zero
            commitments — making AI infrastructure an increasingly important part of national energy policy.
          </p>
        </SeoSection>

        <SeoSection title="How This Calculator Works">
          <p>
            IT load (kW) = servers × watts per server × utilisation ÷ 1,000. Facility load = IT load × PUE. We multiply
            facility load by 24 hours to get daily kWh, then scale to monthly (×30) and annual (×365). Costs use the
            electricity price you enter. Carbon is estimated using the UK grid average of {UK_CARBON_FACTOR} kg CO₂ per
            kWh.
          </p>
          <p>
            Equivalents assume a typical UK home uses {num.format(UK_HOME_ANNUAL_KWH)} kWh per year, a full EV charge is
            about {EV_CHARGE_KWH} kWh and a kettle boil is around {KETTLE_KWH} kWh.
          </p>
        </SeoSection>

        {/* Internal links */}
        <SeoSection title="Related Tools & Resources">
          <ul className="mt-1 space-y-2">
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
                to="/ai-infrastructure-tools"
                className="flex items-center gap-2 rounded-lg bg-white p-3 border border-black/5 hover:border-electric/40 transition-colors text-electric font-semibold"
              >
                <ArrowRight className="h-4 w-4 shrink-0" /> AI Infrastructure Hub
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
              <Link
                to="/news"
                className="flex items-center gap-2 rounded-lg bg-white p-3 border border-black/5 hover:border-electric/40 transition-colors text-electric font-semibold"
              >
                <ArrowRight className="h-4 w-4 shrink-0" /> Latest UK AI energy news
              </Link>
            </li>
          </ul>
        </SeoSection>

        <EnergyFAQ
          items={[
            {
              q: "How accurate are these estimates?",
              a: "They are directional educational estimates based on simplified, public UK assumptions. Real facilities vary by hardware, workload, cooling, climate, location and contracted electricity prices.",
            },
            {
              q: "What carbon factor do you use?",
              a: `We apply the UK grid average of ${UK_CARBON_FACTOR} kg CO₂ per kWh. Facilities on renewable contracts or with on-site generation may have a very different footprint.`,
            },
            {
              q: "Why does PUE matter so much?",
              a: "PUE multiplies your IT load to account for cooling and overheads. Reducing PUE from 1.6 to 1.2 can cut total facility energy by around 25%, directly lowering cost and carbon.",
            },
          ]}
        />
      </EnergyContainer>
    </EnergyShell>
  );
}
