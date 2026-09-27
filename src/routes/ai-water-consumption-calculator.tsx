import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Droplets, Home, Bath, Waves, Server, Zap, ArrowRight, Info } from "lucide-react";
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

export const Route = createFileRoute("/ai-water-consumption-calculator")({
  head: () => ({
    meta: [
      { title: "AI Water Consumption Calculator | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Estimate the water consumption of AI data centres and AI infrastructure using server load, cooling method, electricity use and operational assumptions.",
      },
      { property: "og:title", content: "AI Water Consumption Calculator | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content:
          "Estimate the water consumption of AI data centres and AI infrastructure using server load, cooling method, electricity use and operational assumptions.",
      },
      {
        property: "og:url",
        content: "https://aienergyintelligence.co.uk/ai-water-consumption-calculator",
      },
    ],
    links: [
      { rel: "canonical", href: "https://aienergyintelligence.co.uk/ai-water-consumption-calculator" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "AI Water Consumption Calculator",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Any",
          url: "https://aienergyintelligence.co.uk/ai-water-consumption-calculator",
          description:
            "Estimate the water consumption of AI data centres and AI infrastructure using server load, cooling method, electricity use and operational assumptions.",
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
              name: "Do AI data centres use water?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Many AI data centres use water as part of their cooling systems — particularly evaporative cooling — to remove the large amounts of heat produced by densely packed AI servers. Some facilities also have an indirect water footprint through the electricity they consume.",
              },
            },
            {
              "@type": "Question",
              name: "Why do AI data centres need cooling?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "AI servers run power-hungry GPUs and accelerators around the clock, converting almost all of that electricity into heat. Without effective cooling, hardware would overheat and fail, so facilities use air, liquid, evaporative or hybrid cooling to keep equipment within safe temperatures.",
              },
            },
            {
              "@type": "Question",
              name: "How much water can a data centre use?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "It varies enormously by design and cooling method. A facility using evaporative cooling can consume far more water than one using air or closed-loop liquid cooling. This calculator estimates water use from electricity consumption and a litres-per-kWh water intensity factor.",
              },
            },
            {
              "@type": "Question",
              name: "Is liquid cooling better for water consumption?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Closed-loop liquid cooling typically uses far less water than evaporative cooling because the coolant is recirculated rather than evaporated. It can also improve energy efficiency, though some systems still rely on water for heat rejection.",
              },
            },
            {
              "@type": "Question",
              name: "Could AI data centres increase pressure on UK water supplies?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Potentially. As AI workloads and data centre capacity grow, cooling demand rises. In water-stressed regions this can add pressure on local supplies unless more efficient, low-water cooling technologies are adopted.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: WaterConsumptionCalc,
});

// UK assumptions
const UK_HOUSEHOLD_DAILY_LITRES = 142 * 2.3; // ~litres per UK household per day (≈142 L/person, 2.3 people)
const BATH_LITRES = 80; // typical bath
const OLYMPIC_POOL_LITRES = 2_500_000; // ≈2.5 million litres

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

const SIZE_PRESETS: Record<string, { servers: number; label: string }> = {
  small: { servers: 200, label: "Small AI facility" },
  regional: { servers: 1000, label: "Regional AI data centre" },
  large: { servers: 5000, label: "Large AI data centre" },
  hyperscale: { servers: 50000, label: "Hyperscale AI data centre" },
  custom: { servers: 1000, label: "Custom" },
};

const COOLING_WATER: Record<string, { label: string; intensity: number }> = {
  air: { label: "Air cooling", intensity: 0.1 },
  liquid: { label: "Liquid cooling", intensity: 0.3 },
  hybrid: { label: "Hybrid cooling", intensity: 0.7 },
  evaporative: { label: "Evaporative cooling", intensity: 1.8 },
  unknown: { label: "Unknown", intensity: 1.0 },
};

function clamp(n: number, min: number, max: number) {
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}

const litres = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });

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

function WaterConsumptionCalc() {
  const [size, setSize] = useState("regional");
  const [servers, setServers] = useState(1000);
  const [watts, setWatts] = useState(700);
  const [utilisation, setUtilisation] = useState(75);
  const [pue, setPue] = useState(1.4);
  const [cooling, setCooling] = useState("evaporative");
  const [waterIntensity, setWaterIntensity] = useState(COOLING_WATER.evaporative.intensity);
  const [days, setDays] = useState(365);

  function applySize(key: string) {
    setSize(key);
    if (key !== "custom") setServers(SIZE_PRESETS[key].servers);
  }

  function applyCooling(key: string) {
    setCooling(key);
    setWaterIntensity(COOLING_WATER[key].intensity);
  }

  const r = useMemo(() => {
    const n = clamp(servers, 1, 1_000_000);
    const w = clamp(watts, 1, 50000);
    const util = clamp(utilisation, 10, 100) / 100;
    const opDays = clamp(days, 1, 365);
    const intensity = clamp(waterIntensity, 0, 20);

    const itLoadKw = (n * w * util) / 1000; // kW
    const facilityLoadKw = itLoadKw * pue; // kW including overhead

    const dailyKwh = facilityLoadKw * 24;
    const monthlyKwh = (facilityLoadKw * 24 * opDays) / 12;
    const annualKwh = facilityLoadKw * 24 * opDays;

    const dailyWater = dailyKwh * intensity; // litres
    const annualWater = annualKwh * intensity; // litres
    const monthlyWater = annualWater / 12;

    // air-cooling comparison for insight
    const annualWaterAir = annualKwh * COOLING_WATER.air.intensity;
    const reductionPct = annualWater > 0 ? ((annualWater - annualWaterAir) / annualWater) * 100 : 0;

    return {
      itLoadKw,
      facilityLoadKw,
      dailyKwh,
      monthlyKwh,
      annualKwh,
      dailyWater,
      monthlyWater,
      annualWater,
      annualWaterM3: annualWater / 1000,
      waterPerServer: annualWater / n,
      households: dailyWater / UK_HOUSEHOLD_DAILY_LITRES,
      baths: dailyWater / BATH_LITRES,
      pools: annualWater / OLYMPIC_POOL_LITRES,
      reductionPct,
    };
  }, [servers, watts, utilisation, pue, waterIntensity, days]);

  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "AI Energy Intelligence UK", to: "/" },
          { label: "AI Energy Tools" },
          { label: "AI Energy Calculators", to: "/ai-energy-calculators" },
          { label: "AI Water Consumption Calculator" },
        ]}
      />
      <EnergyHero
        eyebrow="AI Energy Tools"
        title="AI Water Consumption Calculator"
        intro="Estimate the water consumption linked to AI data centres, cooling systems and AI infrastructure based on server load, cooling method and operating assumptions. A UK-focused educational tool for businesses, researchers, journalists and policy analysts."
        icon={Droplets}
      />

      <EnergyContainer className="py-10 space-y-8">
        <DisclaimerBanner>
          <strong className="text-white">Important:</strong> This tool provides educational estimates only. Real water
          use varies heavily by facility design, cooling system, water reuse and local climate. Do not treat these
          results as engineering, planning or environmental advice.
        </DisclaimerBanner>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Inputs */}
          <WhiteCard className="lg:col-span-2">
            <h3 className="font-display text-lg font-bold mb-5">Facility assumptions</h3>
            <div className="space-y-5">
              <EField label="Data centre size">
                <ESelect value={size} onChange={(e) => applySize(e.target.value)}>
                  {Object.entries(SIZE_PRESETS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </ESelect>
              </EField>

              <EField label="Number of AI servers" hint="1 – 1,000,000">
                <ENumber
                  min={1}
                  max={1_000_000}
                  value={servers}
                  onChange={(e) => {
                    setServers(clamp(+e.target.value, 1, 1_000_000));
                    setSize("custom");
                  }}
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
                <p className="mt-1.5 flex items-start gap-1.5 text-xs text-energy-ink/50">
                  <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  Utilisation is the average share of server capacity in active use. Higher utilisation means more
                  electricity, heat and cooling water.
                </p>
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
                  PUE measures total facility energy use compared with IT equipment energy use. A higher PUE means more
                  overhead energy and, often, more cooling.
                </p>
              </EField>

              <EField label="Cooling method">
                <ESelect value={cooling} onChange={(e) => applyCooling(e.target.value)}>
                  {Object.entries(COOLING_WATER).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </ESelect>
              </EField>

              <EField label="Water usage intensity (litres / kWh)" hint="adjust for your facility">
                <ENumber
                  min={0}
                  step={0.1}
                  value={waterIntensity}
                  onChange={(e) => setWaterIntensity(clamp(+e.target.value, 0, 20))}
                />
                <p className="mt-1.5 flex items-start gap-1.5 text-xs text-energy-ink/50">
                  <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  Water intensity is litres of water used per kWh of electricity. Evaporative cooling is highest;
                  closed-loop air and liquid cooling are far lower.
                </p>
              </EField>

              <EField label="Operating days per year" hint="1 – 365">
                <ENumber min={1} max={365} value={days} onChange={(e) => setDays(clamp(+e.target.value, 1, 365))} />
              </EField>
            </div>
          </WhiteCard>

          {/* Results */}
          <div className="lg:col-span-3 space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <DataCard label="Annual water consumption" value={`${litres.format(r.annualWater)} L`} accent />
              <DataCard label="Annual water consumption" value={`${num.format(r.annualWaterM3)} m³`} accent />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <DataCard label="Daily water use" value={`${litres.format(r.dailyWater)} L`} />
              <DataCard label="Monthly water use" value={`${litres.format(r.monthlyWater)} L`} />
              <DataCard label="Water per AI server" value={`${litres.format(r.waterPerServer)} L / yr`} />
              <DataCard label="Annual electricity use" value={`${num.format(r.annualKwh)} kWh`} />
              <DataCard label="Total IT load" value={`${num.format(r.itLoadKw)} kW`} />
              <DataCard label="Facility load (incl. PUE)" value={`${num.format(r.facilityLoadKw)} kW`} />
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <Gauge label="Water" value={r.annualWaterM3} max={200000} unit="m³ / yr" accent />
              <Gauge label="Electricity" value={r.annualKwh / 1_000_000} max={500} unit="GWh / yr" />
              <Gauge label="Olympic pools" value={r.pools} max={50} unit="pools / yr" />
            </div>
          </div>
        </div>

        {/* Comparison cards */}
        <div>
          <h3 className="font-display text-lg font-bold text-white mb-4">What this water use is equivalent to</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <CompareCard icon={Home} value={num.format(r.households)} label="UK household daily water uses (per day)" />
            <CompareCard icon={Bath} value={num.format(r.baths)} label="Baths filled per day" />
            <CompareCard icon={Waves} value={num.format(r.pools)} label="Olympic swimming pools per year" />
            <CompareCard icon={Droplets} value={`${litres.format(r.dailyWater)} L`} label="Litres per day" />
          </div>
        </div>

        {/* Insights */}
        <WhiteCard>
          <h3 className="font-display text-lg font-bold flex items-center gap-2">
            <Zap className="h-5 w-5 text-electric" /> Insights
          </h3>
          <ul className="mt-3 space-y-2.5 text-sm text-energy-ink/80 leading-relaxed list-disc pl-5">
            <li>
              This AI facility could consume approximately <strong>{litres.format(r.annualWater)} litres</strong> (
              {num.format(r.annualWaterM3)} m³) of water per year.
            </li>
            {cooling !== "air" && r.reductionPct > 0 && (
              <li>
                Changing from <strong>{COOLING_WATER[cooling].label.toLowerCase()}</strong> to{" "}
                <strong>air cooling</strong> could reduce estimated water consumption by roughly{" "}
                <strong>{num.format(r.reductionPct)}%</strong>.
              </li>
            )}
            <li>
              That is comparable to about <strong>{num.format(r.pools)}</strong> Olympic swimming pools, or the daily
              water of roughly <strong>{num.format(r.households)}</strong> UK households each day.
            </li>
            <li>
              Water use is highly dependent on cooling method, local climate and data centre design — two facilities with
              identical electricity use can have very different water footprints.
            </li>
            <li>
              This calculator provides estimates only and should not be treated as engineering advice.
            </li>
          </ul>
        </WhiteCard>

        {/* Educational */}
        <SeoSection title="Why AI data centres use water">
          <p>
            AI servers run dense clusters of GPUs and accelerators that draw large amounts of electricity and convert
            almost all of it into heat. To keep hardware within safe operating temperatures, many facilities use
            water-based cooling — particularly evaporative cooling, which removes heat by evaporating water. The higher
            the server density and the more continuously the hardware runs, the more heat must be removed and the more
            cooling water may be required.
          </p>
        </SeoSection>

        <SeoSection title="What affects water consumption">
          <p>
            Estimated water use depends on several factors working together: the number of AI servers, the power each
            server draws, the utilisation rate (how busy the hardware is), the PUE (how much overhead energy the facility
            adds for cooling and infrastructure), and — most importantly — the cooling method. Air and closed-loop liquid
            cooling use relatively little water, while evaporative cooling can use considerably more. Local climate also
            matters: warmer regions place more strain on evaporative systems.
          </p>
        </SeoSection>

        <SeoSection title="Why this matters in the UK">
          <p>
            The UK is seeing rapid growth in AI and data centre development at the same time as growing concern about
            water stress in parts of the country, especially the South East. New AI facilities can add local pressure on
            water supplies, raise planning and environmental questions, and intersect with infrastructure constraints
            around both power and water. Understanding the potential scale of water demand helps businesses, communities,
            journalists and policy analysts ask better questions about new developments.
          </p>
        </SeoSection>

        <SeoSection title="How this calculator works">
          <p>
            IT load (kW) = servers × watts per server × utilisation ÷ 1,000. Facility load = IT load × PUE. We multiply
            facility load by 24 hours to get daily electricity (kWh), then scale by your operating days for annual
            electricity. Water use is estimated by multiplying electricity consumption by the water usage intensity in
            litres per kWh. Defaults assume air cooling 0.1, liquid 0.3, hybrid 0.7, evaporative 1.8 and unknown 1.0
            litres/kWh — all editable.
          </p>
          <p>
            Equivalents assume a UK household uses roughly {litres.format(UK_HOUSEHOLD_DAILY_LITRES)} litres of water per
            day, a bath holds about {BATH_LITRES} litres and an Olympic swimming pool holds about{" "}
            {litres.format(OLYMPIC_POOL_LITRES)} litres.
          </p>
        </SeoSection>

        <SeoSection title="Limitations">
          <p>Please treat these figures as directional estimates, not measurements. In particular:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Real water use varies heavily by facility design, efficiency and operating practices.</li>
            <li>Some data centres use closed-loop cooling that recirculates water and consumes very little.</li>
            <li>
              Some facilities use little direct water but still have an indirect water footprint through the electricity
              they consume (water used in power generation).
            </li>
            <li>This tool is for education, comparison and early-stage analysis only.</li>
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
              q: "Do AI data centres use water?",
              a: "Yes. Many AI data centres use water for cooling — particularly evaporative cooling — to remove the large amounts of heat produced by densely packed AI servers. Some also have an indirect water footprint through the electricity they consume.",
            },
            {
              q: "Why do AI data centres need cooling?",
              a: "AI servers run power-hungry GPUs around the clock, converting almost all of that electricity into heat. Without effective cooling, hardware would overheat and fail, so facilities use air, liquid, evaporative or hybrid cooling.",
            },
            {
              q: "How much water can a data centre use?",
              a: "It varies enormously by design and cooling method. Evaporative cooling can use far more water than air or closed-loop liquid cooling. This calculator estimates water use from electricity consumption and a litres-per-kWh water intensity factor.",
            },
            {
              q: "Is liquid cooling better for water consumption?",
              a: "Closed-loop liquid cooling typically uses far less water than evaporative cooling because the coolant is recirculated rather than evaporated, and it can improve energy efficiency — though some systems still rely on water for heat rejection.",
            },
            {
              q: "Could AI data centres increase pressure on UK water supplies?",
              a: "Potentially. As AI workloads and capacity grow, cooling demand rises. In water-stressed regions this can add pressure on local supplies unless more efficient, low-water cooling technologies are adopted.",
            },
          ]}
        />

        {/* CTA */}
        <div className="rounded-2xl bg-energy-navy border border-white/10 p-8 text-center">
          <h3 className="font-display text-2xl font-bold text-white">Explore more AI energy tools</h3>
          <p className="mt-2 text-white/70 max-w-xl mx-auto">
            Estimate electricity, cost, carbon and infrastructure impact with the full AI Energy Intelligence UK suite of UK AI energy
            calculators.
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
