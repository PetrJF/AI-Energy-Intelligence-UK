import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Zap,
  Droplets,
  Smartphone,
  ArrowRight,
  Gauge,
  Coffee,
  WashingMachine,
  Tv,
  Lightbulb,
  Refrigerator,
  Server,
  FileDown,
} from "lucide-react";
import { LeadCapture } from "@/components/LeadCapture";

const PDF_URL = "/guides/ai-vs-household-appliances-energy-uk-2026.pdf";

function downloadPdf() {
  const a = document.createElement("a");
  a.href = PDF_URL;
  a.download = "AI-vs-Household-Appliances-UK-Energy-Comparison-2026.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

const CANONICAL =
  "https://aienergyintelligence.co.uk/guides/ai-vs-household-appliances-energy";

export const Route = createFileRoute("/guides/ai-vs-household-appliances-energy")({
  head: () => ({
    meta: [
      {
        title:
          "AI vs Household Appliances: The Complete UK Energy Comparison (2026)",
      },
      {
        name: "description",
        content:
          "A long-form guide comparing the energy use of AI prompts, images and video against everyday UK appliances — kettles, dishwashers, fridges, TVs and more.",
      },
      {
        property: "og:title",
        content: "AI vs Household Appliances: The Complete UK Energy Comparison",
      },
      {
        property: "og:description",
        content:
          "How AI energy use really compares to kettles, dishwashers, fridges and TVs — with clear UK numbers, methodology and interactive tools.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: CANONICAL },
      {
        property: "og:image",
        content: "https://aienergyintelligence.co.uk/og-image.jpg",
      },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "AI vs Household Appliances: The Complete UK Energy Comparison",
      },
      {
        name: "twitter:description",
        content:
          "AI prompts, images and video vs everyday UK appliances — a detailed, plain-English energy comparison.",
      },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline:
            "AI vs Household Appliances: The Complete UK Energy Comparison",
          description:
            "A detailed comparison of AI energy use versus everyday UK appliances including kettles, dishwashers, fridges and TVs.",
          author: { "@type": "Organization", name: "AI Energy Intelligence UK" },
          publisher: { "@type": "Organization", name: "AI Energy Intelligence UK" },
          mainEntityOfPage: CANONICAL,
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
              name: "How does one AI prompt compare to boiling a kettle?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "A typical AI text prompt uses roughly 0.001 kWh, while boiling a kettle uses about 0.1 kWh. That makes a single kettle boil comparable to around 100 typical text prompts.",
              },
            },
            {
              "@type": "Question",
              name: "Which uses more energy, an AI image or charging a phone?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "They are broadly similar. Generating one AI image is around 0.02 kWh and a full phone charge is about 0.012 kWh, so an image is a little more than one phone charge.",
              },
            },
            {
              "@type": "Question",
              name: "Does running a fridge use more energy than my AI use?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "For almost everyone, yes. A fridge-freezer runs 24/7 and uses roughly 1–1.5 kWh per day, which typically exceeds a normal person's daily AI text use many times over.",
              },
            },
            {
              "@type": "Question",
              name: "Why does AI energy still matter if a prompt is so small?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Because of scale. Billions of daily queries across global data centres add up, and training large models and cooling data centres carry significant energy and water costs even when each individual query is tiny.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: AppliancesGuide,
});

const rows = [
  { activity: "One AI text prompt", kwh: "~0.001", note: "Typical medium-complexity query" },
  { activity: "LED bulb (1 hour)", kwh: "~0.01", note: "10W bulb running for an hour" },
  { activity: "Charging a smartphone", kwh: "~0.012", note: "One full charge" },
  { activity: "One AI image generation", kwh: "~0.02", note: "Single generated image" },
  { activity: "Boiling a kettle", kwh: "~0.1", note: "One full boil (~1.5L)" },
  { activity: "One AI video generation", kwh: "~0.2", note: "Short clip, higher end" },
  { activity: "TV (1 hour, 4K)", kwh: "~0.2", note: "Large modern screen" },
  { activity: "Washing machine cycle", kwh: "~0.8", note: "One standard 40°C cycle" },
  { activity: "Fridge-freezer (1 day)", kwh: "~1.2", note: "24-hour running average" },
  { activity: "Dishwasher cycle", kwh: "~1.2", note: "One standard cycle" },
  { activity: "Tumble dryer cycle", kwh: "~2.5", note: "One full load" },
  { activity: "Electric oven (1 hour)", kwh: "~2.0", note: "One hour at ~200°C" },
];

const deepDives = [
  {
    icon: Coffee,
    title: "The kettle: the UK's favourite yardstick",
    body: "Boiling a kettle uses about 0.1 kWh. Almost every UK home owns one, and everyone knows it is a heavy hitter. At roughly 100 text prompts per boil, the kettle instantly reframes AI text use as a small everyday cost rather than something alarming.",
  },
  {
    icon: Smartphone,
    title: "Phone charging vs AI images",
    body: "A full phone charge is about 0.012 kWh. Generating a single AI image (~0.02 kWh) is a little more. Images and video are where AI energy starts to climb — a short AI video (~0.2 kWh) is in the same league as an hour of 4K TV.",
  },
  {
    icon: Refrigerator,
    title: "The always-on appliances win",
    body: "A fridge-freezer sips power constantly and totals around 1.2 kWh a day. That single always-on appliance quietly outweighs a heavy day of personal AI text use, which is why 'always-on' beats 'occasional' in the home energy picture.",
  },
  {
    icon: WashingMachine,
    title: "Laundry: the real household heavyweight",
    body: "A washing machine cycle (~0.8 kWh) and especially a tumble dryer load (~2.5 kWh) dwarf typical individual AI use. If you want to cut your personal footprint, drying clothes on a line beats worrying about AI prompts by a wide margin.",
  },
  {
    icon: Tv,
    title: "An hour of TV vs a day of prompts",
    body: "An hour of large 4K TV uses around 0.2 kWh — comparable to roughly 200 AI text prompts. Entertainment we barely think about routinely outweighs a normal person's daily AI queries.",
  },
  {
    icon: Lightbulb,
    title: "Even lighting is in the same range",
    body: "A single LED bulb burning for an hour (~0.01 kWh) uses about as much as 10 typical AI text prompts. Multiply across every bulb in a home and household lighting alone can rival casual AI use.",
  },
];

function AppliancesGuide() {
  return (
    <>
      <section className="bg-hero-gradient text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90">
            <Gauge className="h-3.5 w-3.5" /> Long-form energy guide · UK 2026
          </div>
          <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">
            AI vs Household Appliances: The Complete UK Energy Comparison
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85 leading-relaxed">
            Kilowatt-hours mean nothing until you place them next to the things you
            use every day. This guide benchmarks AI prompts, images and video
            against kettles, dishwashers, fridges, TVs and more — so you can judge
            the real scale of AI energy use for yourself.
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 sm:px-6 py-14 space-y-14">
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p className="text-lg text-foreground">
            "An AI prompt uses 0.001 kWh" is a meaningless statement in isolation.
            The only way to understand AI energy is to compare it with familiar
            appliances — and once you do, two things become clear at once.
          </p>
          <p>
            First, an individual <strong>AI text prompt</strong> is genuinely tiny:
            far less than boiling a kettle, and often less than an hour of a single
            LED bulb. Second, that does <em>not</em> make AI energy irrelevant —
            because the story that matters plays out at{" "}
            <strong>data-centre and population scale</strong>, where billions of
            daily queries, model training and cooling add up fast.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            The full comparison at a glance
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Estimated energy per activity, smallest to largest. AI figures cover
            typical models; appliance figures are UK household averages.
          </p>
          <div className="mt-5 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Activity</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">Energy (kWh)</th>
                  <th className="px-4 py-3 font-semibold hidden sm:table-cell">Notes</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.activity} className="border-t border-border">
                    <td className="px-4 py-3 font-medium text-foreground">{row.activity}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.kwh}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4 text-muted-foreground leading-relaxed">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Appliance by appliance
          </h2>
          <p>
            Averages hide the story. Here is how AI use stacks up against the
            specific appliances that dominate a typical UK home.
          </p>
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            {deepDives.map((d) => (
              <div key={d.title} className="rounded-xl border border-border bg-card p-5 shadow-card">
                <d.icon className="h-6 w-6 text-brand" />
                <h3 className="mt-3 font-bold text-foreground">{d.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{d.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 text-muted-foreground leading-relaxed">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Text vs image vs video: the AI ladder
          </h2>
          <p>
            Not all AI use is equal. A <strong>text prompt</strong> (~0.001 kWh) is
            the floor. An <strong>image generation</strong> (~0.02 kWh) is roughly
            20 times more — about the same as one phone charge. A short{" "}
            <strong>video generation</strong> (~0.2 kWh) is another order of
            magnitude, comparable to an hour of 4K TV or two kettle boils.
          </p>
          <p>
            So the honest headline is: if you only chat with AI, your personal
            energy use is trivial next to your kettle. If you generate a lot of
            images and video, it starts to matter — though it is still small
            compared with laundry, cooking and heating.
          </p>
        </section>

        <section className="space-y-4 text-muted-foreground leading-relaxed">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Why AI energy still matters
          </h2>
          <p>
            Everything above is about <strong>one person</strong>. Zoom out and the
            picture changes. Billions of daily queries across global data centres,
            the enormous one-off cost of <strong>training</strong> frontier models,
            and the electricity and <strong>water</strong> needed to cool warehouses
            of GPUs combine into a genuine infrastructure challenge — one that is
            reshaping the UK grid and data-centre landscape.
          </p>
          <p>
            The appliance comparison is about <strong>personal perspective</strong>,
            not dismissing the wider story. Both can be true: your individual AI use
            is smaller than your kettle, and AI's aggregate energy demand is a
            serious national question.
          </p>
        </section>

        <section className="space-y-4 text-muted-foreground leading-relaxed">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            How we calculated these figures
          </h2>
          <p>
            These are illustrative estimates drawn from published research and UK
            appliance averages, rounded for clarity. Real figures vary with the
            model, hardware, data-centre efficiency (PUE), tariff and appliance
            type. AI compute happens in data centres, so it does not appear on your
            home electricity bill — the comparison shows the underlying energy
            scale, not a domestic charge.
          </p>
        </section>

        <section className="rounded-2xl border border-brand/20 bg-accent/40 p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-brand/10 p-2">
              <FileDown className="h-5 w-5 text-brand" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-foreground">
                Download this guide as a PDF
              </h2>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Get the full comparison, appliance breakdowns and methodology as a
                free, shareable PDF. Enter your email and we'll unlock the download.
              </p>
              <div className="mt-4">
                <LeadCapture
                  variant="results"
                  source="ai-appliances-guide"
                  context="ai-vs-household-appliances-energy"
                  onDownload={downloadPdf}
                  downloadLabel="Download the PDF guide"
                  compact
                />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-lg font-bold text-foreground">Run your own numbers</h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Want figures for your specific usage? These free interactive tools let
            you model your own AI energy use and compare it directly with UK
            appliances and costs.
          </p>
          <div className="mt-5 flex flex-col gap-3">
            <Link
              to="/ai-energy-calculators/vs-appliances"
              className="inline-flex items-center justify-between gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
            >
              AI vs household appliance calculator <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/ai-energy-calculators/query-energy"
              className="inline-flex items-center justify-between gap-2 rounded-md border border-input bg-background px-4 py-3 text-sm font-semibold hover:bg-accent transition"
            >
              AI query energy calculator <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/energy-cost/ai-electricity-cost-calculator"
              className="inline-flex items-center justify-between gap-2 rounded-md border border-input bg-background px-4 py-3 text-sm font-semibold hover:bg-accent transition"
            >
              AI electricity cost calculator <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/ai-water-consumption-calculator"
              className="inline-flex items-center justify-between gap-2 rounded-md border border-input bg-background px-4 py-3 text-sm font-semibold hover:bg-accent transition"
            >
              AI water consumption calculator <Droplets className="h-4 w-4" />
            </Link>
            <Link
              to="/ai-energy-myth-checker"
              className="inline-flex items-center justify-between gap-2 rounded-md border border-input bg-background px-4 py-3 text-sm font-semibold hover:bg-accent transition"
            >
              AI energy myth checker <Zap className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-muted/30 p-6">
          <div className="flex items-start gap-3">
            <Server className="h-5 w-5 text-brand mt-0.5 shrink-0" />
            <div>
              <h2 className="text-base font-bold text-foreground">Related reading</h2>
              <div className="mt-3 flex flex-col gap-2 text-sm">
                <Link
                  to="/guides/ai-energy-comparison-kettle-vs-prompt"
                  className="text-brand hover:underline"
                >
                  Kettle vs AI prompt: the quick comparison →
                </Link>
                <Link
                  to="/guides/ai-electricity-cost-calculator"
                  className="text-brand hover:underline"
                >
                  AI Electricity Cost Calculator: UK Business Guide 2026 (PDF) →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
