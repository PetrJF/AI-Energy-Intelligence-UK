import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MapPinned, CheckCircle2, AlertTriangle } from "lucide-react";
import {
  EnergyShell,
  EnergyContainer,
  EnergyHero,
  Breadcrumb,
  DisclaimerBanner,
  WhiteCard,
  SeoSection,
  EnergyFAQ,
  EField,
  EText,
  ESelect,
} from "@/components/energy/EnergyUI";
import { Tier2RelatedContent, Tier2NavButtons, RatingBadge, type RatingLevel } from "@/components/energy/Tier2UI";

export const Route = createFileRoute("/ai-infrastructure-tools/data-centre-impact")({
  head: () => ({
    meta: [
      { title: "Data Centre Impact Checker UK | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Understand the potential local impact of nearby data centre development — jobs, electricity, water, traffic and house prices — with an educational impact rating.",
      },
      { property: "og:title", content: "Data Centre Impact Checker UK | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content: "Assess the potential positive impacts and challenges of a nearby data centre.",
      },
      { property: "og:url", content: "https://aienergyintelligence.co.uk/ai-infrastructure-tools/data-centre-impact" },
    ],
    links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/ai-infrastructure-tools/data-centre-impact" }],
    scripts: [
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"WebApplication\",\"name\":\"Data Centre Impact Checker UK\",\"applicationCategory\":\"BusinessApplication\",\"operatingSystem\":\"Any\",\"url\":\"https://aienergyintelligence.co.uk/ai-infrastructure-tools/data-centre-impact\",\"description\":\"Understand the potential local impact of nearby data centre development — jobs, electricity, water, traffic and house prices — with an educational impact rating.\",\"offers\":{\"@type\":\"Offer\",\"price\":\"0\",\"priceCurrency\":\"GBP\"},\"publisher\":{\"@type\":\"Organization\",\"name\":\"AI Energy Intelligence UK\"},\"isAccessibleForFree\":true,\"inLanguage\":\"en-GB\"}" },
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"BreadcrumbList\",\"itemListElement\":[{\"@type\":\"ListItem\",\"position\":1,\"name\":\"Home\",\"item\":\"https://aienergyintelligence.co.uk/\"},{\"@type\":\"ListItem\",\"position\":2,\"name\":\"Ai Infrastructure Tools\",\"item\":\"https://aienergyintelligence.co.uk/ai-infrastructure-tools\"},{\"@type\":\"ListItem\",\"position\":3,\"name\":\"Data Centre Impact\",\"item\":\"https://aienergyintelligence.co.uk/ai-infrastructure-tools/data-centre-impact\"}]}" },
    ],
  }),
  component: DataCentreImpact,
});

type Distance = "under1" | "1to5" | "5to15" | "over15";

const DIST_WEIGHT: Record<Distance, number> = { under1: 3, "1to5": 2, "5to15": 1, over15: 0.4 };

function ratingFromScore(score: number): RatingLevel {
  if (score < 1.2) return "Low";
  if (score < 2.4) return "Medium";
  return "High";
}

const POSITIVES = [
  "Employment opportunities",
  "Infrastructure investment",
  "Local business opportunities",
  "Increased connectivity",
];

const CHALLENGES = [
  "Electricity demand",
  "Water consumption",
  "Construction disruption",
  "Traffic during construction",
  "Noise from cooling systems",
  "Land use pressure",
];

const QUESTIONS = [
  "What power supply is required?",
  "Will grid upgrades be needed?",
  "What cooling system will be used?",
  "Will local water resources be affected?",
  "How many jobs will be created?",
];

function DataCentreImpact() {
  const [place, setPlace] = useState("");
  const [distance, setDistance] = useState<Distance>("1to5");
  const [concern, setConcern] = useState("Electricity");
  const [userType, setUserType] = useState("Resident");

  const rating = useMemo(() => {
    const w = DIST_WEIGHT[distance];
    const concernWeight = ["Electricity", "Water", "Environment"].includes(concern) ? 1 : 0.7;
    return ratingFromScore(w * concernWeight);
  }, [distance, concern]);

  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "AI Energy Intelligence UK", to: "/" },
          { label: "AI Infrastructure Tools", to: "/ai-infrastructure-tools" },
          { label: "Data Centre Impact Checker" },
        ]}
      />
      <EnergyHero
        eyebrow="Tool 8"
        title="Data Centre Impact Checker"
        intro="Understand the potential impact of nearby data centre development, from jobs and investment to electricity, water, traffic and house prices."
        icon={MapPinned}
      />

      <EnergyContainer className="py-10 space-y-8">
        <DisclaimerBanner>
          <strong className="text-white">Important:</strong> This checker provides educational assessments only and
          should not be interpreted as planning advice.
        </DisclaimerBanner>

        <div className="grid lg:grid-cols-5 gap-6">
          <WhiteCard className="lg:col-span-3">
            <h3 className="font-display text-lg font-bold mb-5">Your situation</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <EField label="Town or postcode">
                <EText value={place} onChange={(e) => setPlace(e.target.value)} placeholder="e.g. Slough or SL1" />
              </EField>
              <EField label="Distance from development">
                <ESelect value={distance} onChange={(e) => setDistance(e.target.value as Distance)}>
                  <option value="under1">Under 1 mile</option>
                  <option value="1to5">1–5 miles</option>
                  <option value="5to15">5–15 miles</option>
                  <option value="over15">Over 15 miles</option>
                </ESelect>
              </EField>
              <EField label="Main concern">
                <ESelect value={concern} onChange={(e) => setConcern(e.target.value)}>
                  {["Electricity", "Water", "Jobs", "Traffic", "Noise", "House Prices", "Local Economy", "Environment"].map(
                    (c) => (
                      <option key={c}>{c}</option>
                    )
                  )}
                </ESelect>
              </EField>
              <EField label="You are a">
                <ESelect value={userType} onChange={(e) => setUserType(e.target.value)}>
                  {["Resident", "Business", "Investor", "Journalist", "Researcher"].map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </ESelect>
              </EField>
            </div>
          </WhiteCard>

          <WhiteCard className="lg:col-span-2 flex flex-col items-start justify-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-energy-ink/60">Overall impact rating</div>
            <div className="mt-3">
              <RatingBadge level={rating} />
            </div>
            <p className="mt-4 text-sm text-energy-ink/70">
              Based on a <strong>{userType.toLowerCase()}</strong> primarily concerned about{" "}
              <strong>{concern.toLowerCase()}</strong>
              {place ? <> near <strong>{place}</strong></> : null}.
            </p>
          </WhiteCard>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <WhiteCard>
            <h3 className="font-display text-lg font-bold flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Positive impacts
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-energy-ink/80">
              {POSITIVES.map((p) => (
                <li key={p} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </WhiteCard>
          <WhiteCard>
            <h3 className="font-display text-lg font-bold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" /> Potential challenges
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-energy-ink/80">
              {CHALLENGES.map((c) => (
                <li key={c} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </WhiteCard>
        </div>

        <WhiteCard>
          <h3 className="font-display text-lg font-bold">Plain English explanation</h3>
          <p className="mt-2 text-sm text-energy-ink/80 leading-relaxed">
            Data centres can bring investment, employment and improved connectivity to an area, while also creating
            pressure on electricity supply, water resources, local roads and land. The closer you are to a development
            and the more it draws on shared resources, the greater the potential local impact. Your selected scenario
            suggests a <strong>{rating.toLowerCase()}</strong> overall impact, but local circumstances vary widely.
          </p>
        </WhiteCard>

        <WhiteCard>
          <h3 className="font-display text-lg font-bold">Suggested questions to ask</h3>
          <ul className="mt-3 space-y-2 text-sm text-energy-ink/80">
            {QUESTIONS.map((q) => (
              <li key={q} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-electric shrink-0" />
                {q}
              </li>
            ))}
          </ul>
        </WhiteCard>

        <SeoSection title="How It Works">
          <p>
            We combine how close you are to a development with the type of concern you select to produce an educational
            impact rating of low, medium or high. Concerns that draw on shared resources such as electricity, water and
            the environment carry more weight, as does close proximity.
          </p>
        </SeoSection>

        <SeoSection title="Why It Matters">
          <p>
            Data centre development is expanding rapidly to support AI. Understanding the likely local effects — both
            positive and challenging — helps residents, businesses and decision-makers ask better questions and engage
            constructively with planning processes.
          </p>
        </SeoSection>

        <SeoSection title="Limitations">
          <p>
            This is an educational assessment, not planning advice. Actual impacts depend on the specific design, scale,
            power and cooling approach of each development and on local grid, water and transport conditions.
          </p>
        </SeoSection>

        <Tier2RelatedContent tool="data-centre-impact" />

        <EnergyFAQ
          items={[
            {
              q: "Do data centres create jobs?",
              a: "Yes, particularly during construction and in skilled operational and maintenance roles, though large facilities can be relatively automated once operational.",
            },
            {
              q: "Do data centres increase electricity demand?",
              a: "Significantly. Large facilities can require substantial, continuous power, which is why grid capacity and upgrades are central to planning decisions.",
            },
            {
              q: "How much water do data centres use?",
              a: "It varies by cooling design. Some use water-based cooling that can draw notable volumes, while others use air or closed-loop systems that use far less.",
            },
          ]}
        />

        <div>
          <h3 className="font-display text-lg font-bold text-white mb-4">Explore more AI infrastructure tools</h3>
          <Tier2NavButtons current="/ai-infrastructure-tools/data-centre-impact" />
        </div>
      </EnergyContainer>
    </EnergyShell>
  );
}
