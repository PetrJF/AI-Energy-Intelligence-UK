import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Server } from "lucide-react";
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
import { ToolPageFooter, breadcrumbLd, faqLd, toolLd } from "@/components/energy/hub";

const PATH = "/infrastructure/data-centre-demand-calculator";
const UK_HOME_ANNUAL_KWH = 2700;
const PUE = 1.4;
// litres of water per kWh (cooling), approximate
const WATER_L_PER_KWH = 1.8;

const DENSITY = {
  standard: { label: "Standard (5 kW / rack)", kw: 5 },
  high: { label: "High density (15 kW / rack)", kw: 15 },
  ai: { label: "AI / GPU (40 kW / rack)", kw: 40 },
} as const;
type DensityKey = keyof typeof DENSITY;

const FAQ = [
  {
    q: "How is water demand estimated?",
    a: "Using a rough 1.8 litres per kWh for evaporative cooling. Air-cooled or closed-loop systems use far less water but more electricity.",
  },
  {
    q: "What is rack density?",
    a: "The average power drawn per server rack. AI/GPU racks are far denser than traditional ones, which sharply raises both electricity and cooling needs.",
  },
];

export const Route = createFileRoute("/infrastructure/data-centre-demand-calculator")({
  head: () => ({
    meta: [
      { title: "Data Centre Demand Calculator UK | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Estimate the annual electricity demand, water demand and household-equivalent consumption of a data centre from its size, rack count and server density.",
      },
      { property: "og:title", content: "Data Centre Demand Calculator UK | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content: "Estimate annual electricity, water demand and household equivalent for a data centre.",
      },
      { property: "og:url", content: `https://aienergyintelligence.co.uk${PATH}` },
    ],
    links: [{ rel: "canonical", href: `https://aienergyintelligence.co.uk${PATH}` }],
    scripts: [
      toolLd("Data Centre Demand Calculator", PATH, "Estimate electricity and water demand of a data centre."),
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Infrastructure Hub", path: "/infrastructure" },
        { name: "Data Centre Demand Calculator", path: PATH },
      ]),
      faqLd(FAQ),
    ],
  }),
  component: Calc,
});

function Calc() {
  const [racks, setRacks] = useState(500);
  const [density, setDensity] = useState<DensityKey>("ai");
  const [utilisation, setUtilisation] = useState(75);

  const r = useMemo(() => {
    const itKw = racks * DENSITY[density].kw * (utilisation / 100);
    const facilityKw = itKw * PUE;
    const annualKwh = facilityKw * 24 * 365;
    return {
      annualKwh,
      facilityKw,
      water: annualKwh * WATER_L_PER_KWH,
      homes: annualKwh / UK_HOME_ANNUAL_KWH,
    };
  }, [racks, density, utilisation]);

  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "UK AI Energy Intelligence Centre", to: "/" },
          { label: "Infrastructure Hub", to: "/infrastructure" },
          { label: "Data Centre Demand Calculator" },
        ]}
      />
      <EnergyHero
        eyebrow="Infrastructure Hub"
        title="Data Centre Demand Calculator"
        intro="Estimate the annual electricity demand, water demand and household-equivalent consumption of a data centre from its rack count and server density."
        icon={Server}
      />

      <EnergyContainer className="py-10 space-y-8">
        <DisclaimerBanner />

        <div className="grid lg:grid-cols-5 gap-6">
          <WhiteCard className="lg:col-span-3">
            <h3 className="font-display text-lg font-bold mb-5">Facility</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <EField label="Rack count">
                <ENumber min={1} value={racks} onChange={(e) => setRacks(+e.target.value)} />
              </EField>
              <EField label="Server density">
                <ESelect value={density} onChange={(e) => setDensity(e.target.value as DensityKey)}>
                  {Object.entries(DENSITY).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </ESelect>
              </EField>
              <EField label={`Utilisation: ${utilisation}%`} hint="10% – 100%">
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={utilisation}
                  onChange={(e) => setUtilisation(+e.target.value)}
                  className="w-full cursor-pointer"
                  style={{ accentColor: "#1f9bff" }}
                />
              </EField>
            </div>
          </WhiteCard>

          <div className="lg:col-span-2 grid grid-cols-2 gap-3 content-start">
            <DataCard label="Annual electricity" value={`${num.format(r.annualKwh / 1_000_000)} GWh`} accent />
            <DataCard label="Facility load" value={`${num.format(r.facilityKw / 1000)} MW`} accent />
            <DataCard label="Water demand" value={`${num.format(r.water / 1_000_000)} Ml`} sub="megalitres / yr" />
            <DataCard label="UK homes equiv." value={num.format(r.homes)} sub="homes / yr" />
          </div>
        </div>

        <WhiteCard>
          <h3 className="font-display text-lg font-bold">Plain English summary</h3>
          <p className="mt-2 text-sm text-energy-ink/80 leading-relaxed">
            This facility could consume about <strong>{num.format(r.annualKwh / 1_000_000)} GWh</strong> per year —
            equivalent to <strong>{num.format(r.homes)}</strong> UK homes — and around{" "}
            <strong>{num.format(r.water / 1_000_000)} megalitres</strong> of cooling water if evaporatively cooled.
          </p>
        </WhiteCard>

        <SeoSection title="How This Calculator Works">
          <p>
            IT load = racks × per-rack power × utilisation. Facility load = IT load × PUE ({PUE}). Annual electricity =
            facility load × 24 × 365. Water uses ≈{WATER_L_PER_KWH} litres per kWh for evaporative cooling.
          </p>
        </SeoSection>
        <SeoSection title="What The Result Means">
          <p>
            The figures size the facility's draw on the grid and water network, and translate it into homes-equivalent
            terms for context.
          </p>
        </SeoSection>
        <SeoSection title="Limitations">
          <p>Cooling method changes the water/electricity trade-off significantly; treat results as directional.</p>
        </SeoSection>

        <ToolPageFooter
          current={PATH}
          source="data-centre-demand"
          inputs={{ racks, density, utilisation }}
          resultSummary={{ annualGWh: r.annualKwh / 1_000_000, waterMl: r.water / 1_000_000 }}
        />

        <EnergyFAQ items={FAQ} />
      </EnergyContainer>
    </EnergyShell>
  );
}
