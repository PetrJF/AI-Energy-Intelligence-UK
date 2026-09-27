import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { LayoutDashboard, Printer, FileDown, Save, Image as ImageIcon } from "lucide-react";
import {
  EnergyShell,
  EnergyContainer,
  EnergyHero,
  Breadcrumb,
  DisclaimerBanner,
  WhiteCard,
  SeoSection,
  EnergyFAQ,
} from "@/components/energy/EnergyUI";
import { Tier3RelatedContent, Tier3NavButtons, type IndexLevel } from "@/components/energy/Tier3UI";
import { RatingBadge } from "@/components/energy/Tier2UI";

export const Route = createFileRoute("/advanced-ai-energy-tools/scenario-comparison")({
  head: () => ({
    meta: [
      { title: "AI Infrastructure Scenario Comparison Dashboard UK | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Compare conservative, moderate and aggressive AI growth futures side by side across electricity demand, carbon, water, infrastructure, grid capacity and investment.",
      },
      { property: "og:title", content: "AI Infrastructure Scenario Comparison Dashboard | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content: "Compare AI growth scenarios side by side across energy and infrastructure metrics.",
      },
      { property: "og:url", content: "https://aienergyintelligence.co.uk/advanced-ai-energy-tools/scenario-comparison" },
    ],
    links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/advanced-ai-energy-tools/scenario-comparison" }],
    scripts: [
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"WebApplication\",\"name\":\"AI Infrastructure Scenario Comparison Dashboard UK\",\"applicationCategory\":\"BusinessApplication\",\"operatingSystem\":\"Any\",\"url\":\"https://aienergyintelligence.co.uk/advanced-ai-energy-tools/scenario-comparison\",\"description\":\"Compare conservative, moderate and aggressive AI growth futures side by side across electricity demand, carbon, water, infrastructure, grid capacity and investment.\",\"offers\":{\"@type\":\"Offer\",\"price\":\"0\",\"priceCurrency\":\"GBP\"},\"publisher\":{\"@type\":\"Organization\",\"name\":\"AI Energy Intelligence UK\"},\"isAccessibleForFree\":true,\"inLanguage\":\"en-GB\"}" },
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"BreadcrumbList\",\"itemListElement\":[{\"@type\":\"ListItem\",\"position\":1,\"name\":\"Home\",\"item\":\"https://aienergyintelligence.co.uk/\"},{\"@type\":\"ListItem\",\"position\":2,\"name\":\"Advanced Ai Energy Tools\",\"item\":\"https://aienergyintelligence.co.uk/advanced-ai-energy-tools\"},{\"@type\":\"ListItem\",\"position\":3,\"name\":\"Scenario Comparison\",\"item\":\"https://aienergyintelligence.co.uk/advanced-ai-energy-tools/scenario-comparison\"}]}" },
    ],
  }),
  component: ScenarioComparison,
});

type Metric = {
  key: string;
  label: string;
  values: [number, number, number]; // conservative, moderate, aggressive (0-100)
};

const METRICS: Metric[] = [
  { key: "demand", label: "Electricity Demand", values: [35, 62, 88] },
  { key: "carbon", label: "Carbon Impact", values: [30, 55, 82] },
  { key: "water", label: "Water Pressure", values: [28, 50, 78] },
  { key: "infra", label: "Infrastructure Requirements", values: [40, 65, 92] },
  { key: "grid", label: "Grid Capacity Pressure", values: [38, 64, 90] },
  { key: "investment", label: "Investment Requirements", values: [42, 70, 95] },
];

const SCENARIOS = ["Conservative Growth", "Moderate Growth", "Aggressive Growth"] as const;
const COLORS = ["#0ea5e9", "#6366f1", "#dc2626"];

function toLevel(v: number): IndexLevel {
  if (v < 25) return "Low";
  if (v < 50) return "Medium";
  if (v < 75) return "High";
  return "Very High";
}

function ScenarioComparison() {
  const chartRef = useRef<SVGSVGElement>(null);
  const [saved, setSaved] = useState(false);

  const summaries = useMemo(() => {
    return SCENARIOS.map((s, i) => {
      const avg = Math.round(METRICS.reduce((a, m) => a + m.values[i], 0) / METRICS.length);
      return { scenario: s, avg, level: toLevel(avg) };
    });
  }, []);

  const handlePrint = () => window.print();

  const handleSave = () => {
    try {
      localStorage.setItem(
        "aiei_scenario_comparison",
        JSON.stringify({ savedAt: new Date().toISOString(), metrics: METRICS, summaries })
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      /* ignore */
    }
  };

  const handleExportImage = () => {
    const svg = chartRef.current;
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 900;
      canvas.height = 500;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const a = document.createElement("a");
        a.download = "ai-scenario-comparison.png";
        a.href = canvas.toDataURL("image/png");
        a.click();
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "AI Energy Intelligence UK", to: "/" },
          { label: "Advanced AI Energy Intelligence", to: "/advanced-ai-energy-tools" },
          { label: "Scenario Comparison Dashboard" },
        ]}
      />
      <EnergyHero
        eyebrow="Tool 16"
        title="AI Infrastructure Scenario Comparison Dashboard"
        intro="Compare multiple AI growth futures side by side. See how conservative, moderate and aggressive AI growth scenarios differ across electricity demand, carbon impact, water pressure, infrastructure, grid capacity and investment."
        icon={LayoutDashboard}
      />

      <EnergyContainer className="py-10 space-y-8">
        <DisclaimerBanner>
          <strong className="text-white">Important:</strong> These scenarios provide educational modelling and scenario
          analysis only. They are not engineering, environmental, financial or investment advice.
        </DisclaimerBanner>

        {/* Dashboard controls */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportImage}
            className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-electric hover:border-electric transition-colors"
          >
            <ImageIcon className="h-4 w-4" /> Export chart image
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-electric hover:border-electric transition-colors"
          >
            <FileDown className="h-4 w-4" /> Export PDF summary
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-electric hover:border-electric transition-colors"
          >
            <Save className="h-4 w-4" /> {saved ? "Saved" : "Save comparison"}
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-electric hover:border-electric transition-colors"
          >
            <Printer className="h-4 w-4" /> Print view
          </button>
        </div>

        {/* Scenario summary cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {summaries.map((s, i) => (
            <WhiteCard key={s.scenario}>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold" style={{ color: COLORS[i] }}>
                  {s.scenario}
                </h3>
                <RatingBadge level={s.level} />
              </div>
              <div className="mt-2 font-display text-3xl font-bold text-energy-ink">{s.avg}/100</div>
              <p className="mt-1 text-sm text-energy-ink/60">Overall pressure index</p>
            </WhiteCard>
          ))}
        </div>

        {/* Grouped bar chart */}
        <WhiteCard>
          <h3 className="font-display text-lg font-bold mb-4">Side-by-side comparison chart</h3>
          <svg ref={chartRef} viewBox="0 0 900 480" className="w-full">
            <rect width="900" height="480" fill="#ffffff" />
            {METRICS.map((m, mi) => {
              const groupW = 900 / METRICS.length;
              const x0 = mi * groupW;
              const barW = (groupW - 30) / 3;
              return (
                <g key={m.key}>
                  {m.values.map((v, si) => {
                    const h = (v / 100) * 360;
                    return (
                      <rect
                        key={si}
                        x={x0 + 12 + si * barW}
                        y={400 - h}
                        width={barW - 4}
                        height={h}
                        fill={COLORS[si]}
                        rx="2"
                      />
                    );
                  })}
                  <text
                    x={x0 + groupW / 2}
                    y={430}
                    textAnchor="middle"
                    fontSize="13"
                    fill="#475569"
                  >
                    {m.label.split(" ")[0]}
                  </text>
                </g>
              );
            })}
            {/* legend */}
            {SCENARIOS.map((s, i) => (
              <g key={s} transform={`translate(${250 + i * 200}, 458)`}>
                <rect width="14" height="14" fill={COLORS[i]} rx="2" />
                <text x="20" y="12" fontSize="13" fill="#475569">
                  {s}
                </text>
              </g>
            ))}
          </svg>
        </WhiteCard>

        {/* Comparison table */}
        <WhiteCard>
          <h3 className="font-display text-lg font-bold mb-4">Side-by-side comparison table</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/10 text-left text-energy-ink/60">
                  <th className="py-2 pr-4 font-semibold">Metric</th>
                  {SCENARIOS.map((s) => (
                    <th key={s} className="py-2 px-3 font-semibold">
                      {s}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {METRICS.map((m) => (
                  <tr key={m.key} className="border-b border-black/5">
                    <td className="py-2.5 pr-4 font-medium text-energy-ink">{m.label}</td>
                    {m.values.map((v, i) => (
                      <td key={i} className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-energy-ink">{v}</span>
                          <RatingBadge level={toLevel(v)} />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </WhiteCard>

        <SeoSection title="Scenario Summaries">
          <p>
            <strong>Conservative growth</strong> assumes slower AI adoption and modest data centre expansion, keeping
            pressure on energy and infrastructure relatively contained. <strong>Moderate growth</strong> reflects steady
            adoption with meaningful but manageable increases across demand, carbon, water and investment.{" "}
            <strong>Aggressive growth</strong> assumes rapid, large-scale AI deployment, producing the highest pressure
            across every metric and the greatest need for new generation, grid upgrades and investment.
          </p>
        </SeoSection>

        <SeoSection title="How It Works">
          <p>
            Each metric is scored from 0–100 for three pre-defined growth scenarios. The dashboard presents these side by
            side as summary cards, a grouped bar chart and a comparison table so you can quickly see how outcomes diverge
            as AI growth accelerates.
          </p>
        </SeoSection>

        <SeoSection title="Why It Matters">
          <p>
            Comparing scenarios highlights how sensitive energy and infrastructure outcomes are to the pace of AI growth.
            Small differences in adoption can compound into very different demands on the grid, water resources and
            public investment over the coming decade.
          </p>
        </SeoSection>

        <SeoSection title="Limitations">
          <p>
            The scenarios use illustrative, fixed scores to demonstrate relative differences. They are not forecasts and
            do not reflect live data, regional variation or specific projects.
          </p>
        </SeoSection>

        <Tier3RelatedContent tool="scenario-comparison" />

        <EnergyFAQ
          items={[
            {
              q: "What happens under different AI growth scenarios?",
              a: "Faster AI growth increases electricity demand, carbon and water pressure, and the need for infrastructure investment. Slower growth keeps these pressures more contained.",
            },
            {
              q: "Which scenario creates the most pressure?",
              a: "The aggressive growth scenario produces the highest pressure across every metric, particularly investment and infrastructure requirements.",
            },
            {
              q: "How should uncertainty be interpreted?",
              a: "Treat these as illustrative ranges, not predictions. The real future is likely to fall somewhere between scenarios and will depend on technology, policy and behaviour.",
            },
          ]}
        />

        <div>
          <h3 className="font-display text-lg font-bold text-white mb-4">Explore more advanced AI energy tools</h3>
          <Tier3NavButtons current="/advanced-ai-energy-tools/scenario-comparison" />
        </div>
      </EnergyContainer>
    </EnergyShell>
  );
}
