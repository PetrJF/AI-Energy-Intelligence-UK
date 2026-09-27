import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LineChart } from "lucide-react";
import {
  EnergyShell,
  EnergyContainer,
  EnergyHero,
  Breadcrumb,
  DisclaimerBanner,
  WhiteCard,
  DataCard,
  SeoSection,
  RelatedContent,
  ToolNavButtons,
  EnergyFAQ,
  EField,
  ESelect,
} from "@/components/energy/EnergyUI";

export const Route = createFileRoute("/ai-energy-calculators/demand-forecast")({
  head: () => ({
    meta: [
      { title: "AI Electricity Demand Forecast Tool UK 2026–2035 | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Explore how AI adoption could affect UK electricity demand between 2026 and 2035 by year, sector and region, with demand pressure ratings.",
      },
      { property: "og:title", content: "AI Electricity Demand Forecast Tool UK 2026–2035" },
      {
        property: "og:description",
        content: "Simplified scenario tool showing AI electricity demand pressure on the UK grid.",
      },
      { property: "og:url", content: "https://aienergyintelligence.co.uk/ai-energy-calculators/demand-forecast" },
    ],
    links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/ai-energy-calculators/demand-forecast" }],
    scripts: [
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"WebApplication\",\"name\":\"AI Electricity Demand Forecast Tool UK 2026–2035\",\"applicationCategory\":\"BusinessApplication\",\"operatingSystem\":\"Any\",\"url\":\"https://aienergyintelligence.co.uk/ai-energy-calculators/demand-forecast\",\"description\":\"Explore how AI adoption could affect UK electricity demand between 2026 and 2035 by year, sector and region, with demand pressure ratings.\",\"offers\":{\"@type\":\"Offer\",\"price\":\"0\",\"priceCurrency\":\"GBP\"},\"publisher\":{\"@type\":\"Organization\",\"name\":\"AI Energy Intelligence UK\"},\"isAccessibleForFree\":true,\"inLanguage\":\"en-GB\"}" },
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"BreadcrumbList\",\"itemListElement\":[{\"@type\":\"ListItem\",\"position\":1,\"name\":\"Home\",\"item\":\"https://aienergyintelligence.co.uk/\"},{\"@type\":\"ListItem\",\"position\":2,\"name\":\"Ai Energy Calculators\",\"item\":\"https://aienergyintelligence.co.uk/ai-energy-calculators\"},{\"@type\":\"ListItem\",\"position\":3,\"name\":\"Demand Forecast\",\"item\":\"https://aienergyintelligence.co.uk/ai-energy-calculators/demand-forecast\"}]}" },
    ],
  }),
  component: DemandForecastTool,
});

type Adoption = "low" | "medium" | "high";

const YEARS = Array.from({ length: 10 }, (_, i) => 2026 + i);

function bucket(year: number): 0 | 1 | 2 {
  if (year <= 2028) return 0;
  if (year <= 2032) return 1;
  return 2;
}

const MATRIX: Record<Adoption, [string, string, string]> = {
  low: ["Low Pressure", "Medium Pressure", "Medium Pressure"],
  medium: ["Medium Pressure", "Medium-High Pressure", "High Pressure"],
  high: ["Medium-High Pressure", "High Pressure", "Very High Pressure"],
};

function DemandForecastTool() {
  const [year, setYear] = useState(2030);
  const [adoption, setAdoption] = useState<Adoption>("medium");
  const [sector, setSector] = useState("Data Centre Growth");
  const [region, setRegion] = useState("UK Wide");

  const rating = useMemo(() => MATRIX[adoption][bucket(year)], [adoption, year]);

  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "AI Energy Intelligence UK", to: "/" },
          { label: "AI Energy Tools" },
          { label: "AI Energy Calculators", to: "/ai-energy-calculators" },
          { label: "AI Electricity Demand Forecast Tool" },
        ]}
      />
      <EnergyHero
        eyebrow="Calculator 3"
        title="AI Electricity Demand Forecast Tool"
        intro="Explore how AI adoption could affect UK electricity demand between 2026 and 2035 across sectors and regions."
        icon={LineChart}
      />

      <EnergyContainer className="py-10 space-y-8">
        <DisclaimerBanner />

        <div className="grid lg:grid-cols-5 gap-6">
          <WhiteCard className="lg:col-span-3">
            <h3 className="font-display text-lg font-bold mb-5">Scenario inputs</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <EField label="Year">
                <ESelect value={year} onChange={(e) => setYear(+e.target.value)}>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </ESelect>
              </EField>
              <EField label="AI adoption level">
                <ESelect value={adoption} onChange={(e) => setAdoption(e.target.value as Adoption)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </ESelect>
              </EField>
              <EField label="Sector">
                <ESelect value={sector} onChange={(e) => setSector(e.target.value)}>
                  <option>Household AI</option>
                  <option>Business AI</option>
                  <option>Public Sector AI</option>
                  <option>Data Centre Growth</option>
                  <option>Whole Economy</option>
                </ESelect>
              </EField>
              <EField label="Region">
                <ESelect value={region} onChange={(e) => setRegion(e.target.value)}>
                  <option>UK Wide</option>
                  <option>England</option>
                  <option>Scotland</option>
                  <option>Wales</option>
                  <option>Northern Ireland</option>
                </ESelect>
              </EField>
            </div>
          </WhiteCard>

          <div className="lg:col-span-2 grid grid-cols-1 gap-3 content-start">
            <DataCard label="Demand pressure rating" value={rating} accent />
            <DataCard label="Scenario" value={`${region}, ${year}`} sub={`${adoption} adoption · ${sector}`} />
          </div>
        </div>

        <WhiteCard>
          <h3 className="font-display text-lg font-bold">Plain English summary</h3>
          <p className="mt-2 text-sm text-energy-ink/80 leading-relaxed">
            Under a <strong>{adoption}</strong> AI adoption scenario in <strong>{year}</strong> for{" "}
            <strong>{region}</strong>, electricity demand pressure from AI would likely be{" "}
            <strong>{rating.toLowerCase()}</strong>. The biggest pressure would come from data centres, cooling systems,
            grid connections and always-on compute infrastructure rather than individual prompts.
          </p>
          <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-energy-grey p-3">
              <div className="font-semibold">Grid impact</div>
              <p className="mt-1 text-energy-ink/70">
                Higher ratings imply tighter headroom at peak, more constrained connection queues and growing reliance on
                flexibility and storage.
              </p>
            </div>
            <div className="rounded-lg bg-energy-grey p-3">
              <div className="font-semibold">Infrastructure challenges</div>
              <p className="mt-1 text-energy-ink/70">
                Data centre connections, substation upgrades, regional grid constraints, infrastructure investment and
                peak demand pressure all become more significant.
              </p>
            </div>
          </div>
          <p className="mt-3 rounded-lg bg-electric/10 p-3 text-xs text-energy-ink/70">
            This is a simplified scenario tool and not an official electricity demand forecast.
          </p>
        </WhiteCard>

        <SeoSection title="How This Calculator Works">
          <p>
            We group years into three periods (2026–2028, 2029–2032, 2033–2035) and combine them with the chosen
            adoption level to produce a demand pressure rating. Sector and region frame where pressure is most likely to
            concentrate.
          </p>
        </SeoSection>

        <SeoSection title="What The Result Means">
          <p>
            The rating signals the relative strain AI-related electricity demand could place on the grid. It covers data
            centre connections, substation upgrades, regional grid constraints, infrastructure investment and peak demand
            pressure — not a precise megawatt figure.
          </p>
        </SeoSection>

        <SeoSection title="Limitations">
          <p>
            This is a simplified, illustrative scenario model. It does not reflect official National Grid, NESO or
            government forecasts and should not be used for planning or investment decisions.
          </p>
        </SeoSection>

        <RelatedContent tool="demand-forecast" />

        <EnergyFAQ
          items={[
            {
              q: "Is this an official UK demand forecast?",
              a: "No. It is a simplified educational scenario tool and is not based on official National Grid, NESO or government modelling.",
            },
            {
              q: "Why does data centre growth dominate?",
              a: "Always-on AI compute and cooling concentrate demand in data centres, which typically drives more grid pressure than individual user prompts.",
            },
          ]}
        />

        <div>
          <h3 className="font-display text-lg font-bold text-white mb-4">Explore more AI energy tools</h3>
          <ToolNavButtons current="/ai-energy-calculators/demand-forecast" />
        </div>
      </EnergyContainer>
    </EnergyShell>
  );
}
