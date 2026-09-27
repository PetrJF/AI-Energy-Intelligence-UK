import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, FileText, BarChart3, Table2, Zap, ArrowRight } from "lucide-react";
import { LeadCapture } from "@/components/LeadCapture";

const PDF_URL = "/guides/ai-electricity-cost-calculator-uk-business-guide-2026.pdf";

export const Route = createFileRoute("/guides/ai-electricity-cost-calculator")({
  head: () => ({
    meta: [
      { title: "Free Guide: AI Electricity Cost Calculator | UK Business 2026" },
      {
        name: "description",
        content:
          "Download the free 2026 UK business guide to AI electricity costs — methodology, worked scenarios, charts and benchmarks. Estimate the hidden energy cost of AI.",
      },
      { property: "og:title", content: "AI Electricity Cost Calculator: UK Business Guide 2026" },
      {
        property: "og:description",
        content:
          "A free, data-driven PDF guide to the hidden electricity costs of AI for UK businesses, energy and IT decision-makers.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://aienergyintelligence.co.uk/guides/ai-electricity-cost-calculator" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AI Electricity Cost Calculator: UK Business Guide 2026" },
      {
        name: "twitter:description",
        content: "Free UK business guide to the hidden electricity costs of AI — methodology, scenarios and benchmarks.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://aienergyintelligence.co.uk/guides/ai-electricity-cost-calculator" },
    ],
    scripts: [
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"WebApplication\",\"name\":\"Free Guide: AI Electricity Cost Calculator | UK Business 2026\",\"applicationCategory\":\"BusinessApplication\",\"operatingSystem\":\"Any\",\"url\":\"https://aienergyintelligence.co.uk/guides/ai-electricity-cost-calculator\",\"description\":\"Download the free 2026 UK business guide to AI electricity costs — methodology, worked scenarios, charts and benchmarks. Estimate the hidden energy cost of AI.\",\"offers\":{\"@type\":\"Offer\",\"price\":\"0\",\"priceCurrency\":\"GBP\"},\"publisher\":{\"@type\":\"Organization\",\"name\":\"AI Energy Intelligence UK\"},\"isAccessibleForFree\":true,\"inLanguage\":\"en-GB\"}" },
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"BreadcrumbList\",\"itemListElement\":[{\"@type\":\"ListItem\",\"position\":1,\"name\":\"Home\",\"item\":\"https://aienergyintelligence.co.uk/\"},{\"@type\":\"ListItem\",\"position\":2,\"name\":\"Guides\",\"item\":\"https://aienergyintelligence.co.uk/guides\"},{\"@type\":\"ListItem\",\"position\":3,\"name\":\"Ai Electricity Cost Calculator\",\"item\":\"https://aienergyintelligence.co.uk/guides/ai-electricity-cost-calculator\"}]}" },
    ],
  }),
  component: GuidePage,
});

const contents = [
  "How AI uses electricity — data centres, servers, cooling, training & inference",
  "Understanding consumption — LLMs, image and video generation, enterprise AI",
  "UK electricity costs explained — pricing, standing charges, peak vs off-peak, regions",
  "The cost-calculator methodology, inputs and outputs (energy, cost, carbon)",
  "Three worked UK scenarios — small business, mid-size org and enterprise",
  "AI vs everyday electricity — kettle, EV charge, washing machine and more",
  "AI & the future UK grid — demand forecasts, data-centre growth, AI Growth Zones",
  "Practical strategies to reduce AI energy costs and clear recommendations",
];

const highlights = [
  { icon: BarChart3, label: "7 custom charts", sub: "Built for UK decision-makers" },
  { icon: Table2, label: "Scenario tables", sub: "Annual, monthly & carbon" },
  { icon: Zap, label: "UK-focused data", sub: "2026 pricing & forecasts" },
  { icon: FileText, label: "16-page report", sub: "Free, no payment" },
];

function downloadPdf() {
  const a = document.createElement("a");
  a.href = PDF_URL;
  a.download = "AI-Electricity-Cost-Calculator-UK-Business-Guide-2026.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function GuidePage() {
  return (
    <>
      <section className="bg-hero-gradient text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-20">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90">
                <FileText className="h-3.5 w-3.5" /> Free PDF guide · 2026
              </div>
              <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">
                AI Electricity Cost Calculator: UK Business Guide
              </h1>
              <p className="mt-4 max-w-xl text-lg text-white/85 leading-relaxed">
                The hidden electricity cost of AI, explained for UK businesses. A practical,
                data-driven guide with methodology, worked scenarios, charts and clear
                recommendations for energy, IT and finance teams.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {highlights.map((h) => (
                  <div key={h.label} className="rounded-lg bg-white/10 p-3">
                    <h.icon className="h-5 w-5 text-white/90" />
                    <div className="mt-2 text-sm font-semibold">{h.label}</div>
                    <div className="text-xs text-white/70">{h.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-card p-1 shadow-card">
              <div className="rounded-xl bg-background p-5 sm:p-6 text-foreground">
                <h2 className="text-lg font-bold">Get the guide free</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Enter your email and we'll unlock the download instantly — and send you a
                  permanent link for later.
                </p>
                <div className="mt-4">
                  <LeadCapture
                    variant="checklist"
                    source="ai-electricity-guide"
                    context="ai-electricity-cost-guide"
                    onDownload={downloadPdf}
                    downloadLabel="Download the guide (PDF)"
                    compact
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-brand">What's inside</div>
            <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">
              Everything you need to understand AI energy costs
            </h2>
            <ul className="mt-6 space-y-3">
              {contents.map((c) => (
                <li key={c} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h3 className="text-lg font-bold">Prefer to run your own numbers?</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              The guide explains the methodology — our free interactive calculators let you
              model your own organisation's AI energy use, cost and carbon impact in seconds.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <Link
                to="/ai-energy-calculators/query-energy"
                className="inline-flex items-center justify-between gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
              >
                AI query energy calculator <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/ai-energy-calculators/vs-appliances"
                className="inline-flex items-center justify-between gap-2 rounded-md border border-input bg-background px-4 py-3 text-sm font-semibold hover:bg-accent transition"
              >
                AI vs everyday appliances <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/ai-infrastructure-tools/subscription-cost"
                className="inline-flex items-center justify-between gap-2 rounded-md border border-input bg-background px-4 py-3 text-sm font-semibold hover:bg-accent transition"
              >
                AI subscription cost calculator <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              See our <Link to="/news" className="text-brand hover:underline">latest AI energy news</Link> for
              analysis and commentary.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
