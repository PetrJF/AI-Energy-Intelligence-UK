import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ClipboardCheck } from "lucide-react";
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

const PATH = "/business/ai-readiness-assessment";

const QUESTIONS = [
  { key: "use", label: "Current AI use" },
  { key: "energy", label: "Energy consumption visibility" },
  { key: "data", label: "Data maturity" },
  { key: "staff", label: "Staff capability" },
  { key: "infra", label: "Infrastructure readiness" },
] as const;
type QKey = (typeof QUESTIONS)[number]["key"];

const LEVELS = [
  { v: 1, label: "1 — Just starting" },
  { v: 2, label: "2 — Developing" },
  { v: 3, label: "3 — Good" },
  { v: 4, label: "4 — Strong" },
  { v: 5, label: "5 — Leading" },
];

const FAQ = [
  {
    q: "How is the readiness score calculated?",
    a: "Each of the five areas is scored 1–5; the total is converted to a percentage out of 25.",
  },
  {
    q: "What should I do with the score?",
    a: "Use it to prioritise — start with the lowest-scoring areas and the recommended tools and resources below.",
  },
];

export const Route = createFileRoute("/business/ai-readiness-assessment")({
  head: () => ({
    meta: [
      { title: "AI Readiness Assessment UK | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Score your organisation's AI readiness across AI use, energy, data, staff and infrastructure — with tailored recommendations and next steps.",
      },
      { property: "og:title", content: "AI Readiness Assessment UK | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content: "Score your AI readiness and get tailored recommendations.",
      },
      { property: "og:url", content: `https://aienergyintelligence.co.uk${PATH}` },
    ],
    links: [{ rel: "canonical", href: `https://aienergyintelligence.co.uk${PATH}` }],
    scripts: [
      toolLd("AI Readiness Assessment", PATH, "Score business AI readiness across five areas."),
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Business Hub", path: "/business" },
        { name: "AI Readiness Assessment", path: PATH },
      ]),
      faqLd(FAQ),
    ],
  }),
  component: Calc,
});

function band(pct: number) {
  if (pct < 40)
    return {
      label: "Early stage",
      recs: [
        "Run a baseline audit of current AI use and energy consumption.",
        "Build foundational data hygiene before scaling AI.",
        "Upskill a small pilot team with focused AI training.",
      ],
    };
  if (pct < 70)
    return {
      label: "Developing",
      recs: [
        "Standardise the AI tools and processes that already work.",
        "Connect AI initiatives to measurable energy and cost outcomes.",
        "Expand training and governance across more teams.",
      ],
    };
  return {
    label: "Advanced",
    recs: [
      "Optimise for ROI and energy efficiency at scale.",
      "Formalise AI governance, monitoring and infrastructure planning.",
      "Share internal best practice and pursue advanced use cases.",
    ],
  };
}

function Calc() {
  const [answers, setAnswers] = useState<Record<QKey, number>>({
    use: 3,
    energy: 2,
    data: 3,
    staff: 3,
    infra: 2,
  });

  const r = useMemo(() => {
    const total = Object.values(answers).reduce((a, b) => a + b, 0);
    const pct = (total / 25) * 100;
    return { total, pct, band: band(pct) };
  }, [answers]);

  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "UK AI Energy Intelligence Centre", to: "/" },
          { label: "Business Hub", to: "/business" },
          { label: "AI Readiness Assessment" },
        ]}
      />
      <EnergyHero
        eyebrow="Business Hub"
        title="AI Readiness Assessment"
        intro="Score your organisation's AI readiness across five areas and get tailored recommendations and suggested next steps."
        icon={ClipboardCheck}
      />

      <EnergyContainer className="py-10 space-y-8">
        <DisclaimerBanner />

        <div className="grid lg:grid-cols-5 gap-6">
          <WhiteCard className="lg:col-span-3">
            <h3 className="font-display text-lg font-bold mb-5">Rate each area (1–5)</h3>
            <div className="grid gap-5">
              {QUESTIONS.map((q) => (
                <EField key={q.key} label={q.label}>
                  <ESelect
                    value={answers[q.key]}
                    onChange={(e) => setAnswers((a) => ({ ...a, [q.key]: +e.target.value }))}
                  >
                    {LEVELS.map((l) => (
                      <option key={l.v} value={l.v}>
                        {l.label}
                      </option>
                    ))}
                  </ESelect>
                </EField>
              ))}
            </div>
          </WhiteCard>

          <div className="lg:col-span-2 grid grid-cols-2 gap-3 content-start">
            <DataCard label="Readiness score" value={`${num.format(r.pct)}%`} accent />
            <DataCard label="Rating" value={r.band.label} />
          </div>
        </div>

        <WhiteCard>
          <h3 className="font-display text-lg font-bold">Recommendations</h3>
          <ul className="mt-2 space-y-2 text-sm text-energy-ink/80 leading-relaxed list-disc pl-5">
            {r.band.recs.map((rec) => (
              <li key={rec}>{rec}</li>
            ))}
          </ul>
        </WhiteCard>

        <SeoSection title="How This Assessment Works">
          <p>
            You rate five readiness areas from 1 (just starting) to 5 (leading). The scores are summed and shown as a
            percentage out of 25, mapped to an Early stage, Developing or Advanced band with tailored recommendations.
          </p>
        </SeoSection>
        <SeoSection title="What The Result Means">
          <p>
            The band points to where to focus next; the lowest-scoring areas are usually the highest-impact place to
            start.
          </p>
        </SeoSection>

        <ToolPageFooter
          current={PATH}
          source="ai-readiness"
          inputs={answers}
          resultSummary={{ score: r.pct, band: r.band.label }}
        />

        <EnergyFAQ items={FAQ} />
      </EnergyContainer>
    </EnergyShell>
  );
}
