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
  RelatedContent,
  ToolNavButtons,
  EnergyFAQ,
  EField,
  EText,
  ESelect,
} from "@/components/energy/EnergyUI";

export const Route = createFileRoute("/ai-energy-calculators/growth-zone")({
  head: () => ({
    meta: [
      { title: "AI Growth Zone Checker UK | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Check whether your UK area could have relevance to future AI infrastructure growth, including data centres, grid upgrades, jobs and investment.",
      },
      { property: "og:title", content: "AI Growth Zone Checker UK | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content: "An educational assessment of your area's potential relevance to AI infrastructure growth.",
      },
      { property: "og:url", content: "https://aienergyintelligence.co.uk/ai-energy-calculators/growth-zone" },
    ],
    links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/ai-energy-calculators/growth-zone" }],
    scripts: [
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"WebApplication\",\"name\":\"AI Growth Zone Checker UK\",\"applicationCategory\":\"BusinessApplication\",\"operatingSystem\":\"Any\",\"url\":\"https://aienergyintelligence.co.uk/ai-energy-calculators/growth-zone\",\"description\":\"Check whether your UK area could have relevance to future AI infrastructure growth, including data centres, grid upgrades, jobs and investment.\",\"offers\":{\"@type\":\"Offer\",\"price\":\"0\",\"priceCurrency\":\"GBP\"},\"publisher\":{\"@type\":\"Organization\",\"name\":\"AI Energy Intelligence UK\"},\"isAccessibleForFree\":true,\"inLanguage\":\"en-GB\"}" },
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"BreadcrumbList\",\"itemListElement\":[{\"@type\":\"ListItem\",\"position\":1,\"name\":\"Home\",\"item\":\"https://aienergyintelligence.co.uk/\"},{\"@type\":\"ListItem\",\"position\":2,\"name\":\"Ai Energy Calculators\",\"item\":\"https://aienergyintelligence.co.uk/ai-energy-calculators\"},{\"@type\":\"ListItem\",\"position\":3,\"name\":\"Growth Zone\",\"item\":\"https://aienergyintelligence.co.uk/ai-energy-calculators/growth-zone\"}]}" },
    ],
  }),
  component: GrowthZoneChecker,
});

const HIGH_TERMS = [
  "london",
  "south east",
  "thames valley",
  "slough",
  "reading",
  "manchester",
  "birmingham",
  "newcastle",
  "edinburgh",
  "glasgow",
  "central belt",
  "cardiff",
  "swansea",
  "newport",
  "university",
  "science park",
  "grid",
];

const MEDIUM_TERMS = ["england", "scotland", "wales", "bristol", "leeds", "sheffield", "cambridge", "oxford"];

type Rating = "High" | "Medium" | "Low" | "Unknown";

const INTERESTS = ["Jobs", "Data Centres", "Electricity Demand", "Grid Upgrades", "Local Disruption", "Investment"];

function GrowthZoneChecker() {
  const [place, setPlace] = useState("");
  const [region, setRegion] = useState("UK Wide");
  const [interests, setInterests] = useState<string[]>(["Data Centres"]);
  const [userType, setUserType] = useState("Resident");
  const [submitted, setSubmitted] = useState(false);

  const rating: Rating = useMemo(() => {
    if (!submitted) return "Unknown";
    const hay = `${place} ${region}`.toLowerCase().trim();
    if (!hay.replace("uk wide", "").trim()) return "Unknown";
    if (HIGH_TERMS.some((t) => hay.includes(t))) return "High";
    if (MEDIUM_TERMS.some((t) => hay.includes(t))) return "Medium";
    return "Low";
  }, [submitted, place, region]);

  const toggle = (i: string) =>
    setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  const assessment: Record<Rating, string> = {
    High: "Your area shows characteristics often associated with AI infrastructure interest — such as proximity to major demand centres, grid infrastructure, universities or science parks. This is an educational signal, not confirmation of any official designation.",
    Medium: "Your area may have some relevance to future AI infrastructure activity, but the signals are mixed. Local planning and grid context will matter a great deal.",
    Low: "Your area shows fewer of the characteristics typically linked to large-scale AI infrastructure growth, though this can change as networks and investment evolve.",
    Unknown: "Enter a postcode or town and select a region, then run the check for an educational assessment.",
  };

  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "AI Energy Intelligence UK", to: "/" },
          { label: "AI Energy Tools" },
          { label: "AI Energy Calculators", to: "/ai-energy-calculators" },
          { label: "AI Growth Zone Checker" },
        ]}
      />
      <EnergyHero
        eyebrow="Calculator 4"
        title="AI Growth Zone Checker"
        intro="Understand whether your area could have relevance to future AI infrastructure growth, from data centres and grid upgrades to jobs and investment."
        icon={MapPin}
      />

      <EnergyContainer className="py-10 space-y-8">
        <DisclaimerBanner>
          <strong className="text-white">This checker does not confirm official AI Growth Zone status.</strong> It
          provides an educational assessment only. Users should always check official government and local planning
          information.
        </DisclaimerBanner>

        <div className="grid lg:grid-cols-5 gap-6">
          <WhiteCard className="lg:col-span-3">
            <h3 className="font-display text-lg font-bold mb-5">Your area</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <EField label="Postcode or town">
                <EText value={place} placeholder="e.g. Slough or SL1" onChange={(e) => setPlace(e.target.value)} />
              </EField>
              <EField label="Region">
                <ESelect value={region} onChange={(e) => setRegion(e.target.value)}>
                  <option>UK Wide</option>
                  <option>London</option>
                  <option>South East England</option>
                  <option>England</option>
                  <option>Scotland</option>
                  <option>Wales</option>
                  <option>Northern Ireland</option>
                </ESelect>
              </EField>
              <EField label="User type">
                <ESelect value={userType} onChange={(e) => setUserType(e.target.value)}>
                  <option>Resident</option>
                  <option>Business Owner</option>
                  <option>Investor</option>
                  <option>Journalist</option>
                  <option>Researcher</option>
                </ESelect>
              </EField>
              <div className="sm:col-span-2">
                <span className="text-sm font-semibold text-energy-ink">Interests</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {INTERESTS.map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggle(i)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                        interests.includes(i)
                          ? "bg-electric text-electric-foreground border-electric"
                          : "bg-white text-energy-ink/70 border-black/15 hover:border-electric"
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => setSubmitted(true)}
              className="mt-6 inline-flex items-center justify-center rounded-md bg-electric px-5 py-2.5 text-sm font-semibold text-electric-foreground hover:opacity-90"
            >
              Check area relevance
            </button>
          </WhiteCard>

          <div className="lg:col-span-2 grid grid-cols-1 gap-3 content-start">
            <DataCard label="Relevance rating" value={rating} accent={rating !== "Unknown"} />
            <DataCard label="User type" value={userType} sub={interests.join(", ") || "No interests selected"} />
          </div>
        </div>

        <WhiteCard>
          <h3 className="font-display text-lg font-bold">Area assessment</h3>
          <p className="mt-2 text-sm text-energy-ink/80 leading-relaxed">{assessment[rating]}</p>

          <h3 className="font-display text-lg font-bold mt-5">Suggested questions to ask</h3>
          <ul className="mt-2 space-y-1.5 text-sm text-energy-ink/80 list-disc pl-5">
            <li>Are there any data centre planning applications submitted in my local authority?</li>
            <li>What grid connection or substation upgrades are planned for my area?</li>
            <li>How would additional electricity demand affect local network capacity?</li>
            <li>What jobs, investment or local disruption could AI infrastructure bring?</li>
            <li>Where can I find official government and local planning information?</li>
          </ul>

          <p className="mt-4 text-xs text-energy-ink/50">
            Related articles: <span className="italic">[Add Verified Links Here]</span>
          </p>
        </WhiteCard>

        <SeoSection title="How This Calculator Works">
          <p>
            We compare your postcode, town and region against characteristics often associated with AI infrastructure
            interest — major demand centres, the Thames Valley, large cities, the Scottish Central Belt, Welsh industrial
            regions, and proximity to universities, science parks or major grid infrastructure — to produce an
            educational relevance rating.
          </p>
        </SeoSection>

        <SeoSection title="What The Result Means">
          <p>
            A higher rating suggests your area shares features commonly linked to AI infrastructure activity. It is a
            prompt for further research and the suggested questions above, not a statement of fact about your specific
            location.
          </p>
        </SeoSection>

        <SeoSection title="Limitations">
          <p>
            This tool uses broad heuristics and does not access live planning, grid or government datasets. It cannot
            confirm official AI Growth Zone status. Always verify with official government and local planning sources.
          </p>
        </SeoSection>

        <RelatedContent tool="growth-zone" />

        <EnergyFAQ
          items={[
            {
              q: "Does a High rating mean a data centre is coming to my area?",
              a: "No. It only means your area shares characteristics often associated with AI infrastructure interest. It is educational and not a confirmation of any plans.",
            },
            {
              q: "Where can I find official information?",
              a: "Check your local planning authority's portal and official UK government announcements. This tool does not replace those sources.",
            },
          ]}
        />

        <div>
          <h3 className="font-display text-lg font-bold text-white mb-4">Explore more AI energy tools</h3>
          <ToolNavButtons current="/ai-energy-calculators/growth-zone" />
        </div>
      </EnergyContainer>
    </EnergyShell>
  );
}
