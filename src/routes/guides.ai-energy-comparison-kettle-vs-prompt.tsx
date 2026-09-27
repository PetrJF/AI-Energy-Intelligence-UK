import { createFileRoute, Link } from "@tanstack/react-router";
import { Zap, Droplets, Smartphone, ArrowRight, Gauge } from "lucide-react";

const CANONICAL = "https://aienergyintelligence.co.uk/guides/ai-energy-comparison-kettle-vs-prompt";

export const Route = createFileRoute("/guides/ai-energy-comparison-kettle-vs-prompt")({
  head: () => ({
    meta: [
      { title: "AI Energy Consumption Comparison: Kettle vs AI Prompt (UK 2026)" },
      {
        name: "description",
        content:
          "How much energy does an AI prompt really use? A plain-English comparison of AI queries vs boiling a kettle, running a dishwasher and charging a phone.",
      },
      { property: "og:title", content: "AI Energy Consumption Comparison: Kettle vs AI Prompt" },
      {
        property: "og:description",
        content:
          "Benchmark AI energy use against everyday UK appliances — kettles, dishwashers and phone charges — with clear, relatable numbers.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: CANONICAL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AI Energy Consumption Comparison: Kettle vs AI Prompt" },
      {
        name: "twitter:description",
        content: "AI queries vs boiling a kettle, a dishwasher cycle and charging a phone — a relatable UK energy comparison.",
      },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "AI Energy Consumption Comparison: Kettle vs AI Prompt",
          description:
            "A plain-English comparison of AI energy use versus everyday UK appliances like kettles, dishwashers and phone charging.",
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
              name: "How much energy does one AI prompt use?",
              acceptAnswer: {
                "@type": "Answer",
                text: "A single AI text prompt is estimated at roughly 0.0003–0.003 kWh depending on the model and question. That means one kettle boil (about 0.1 kWh) is comparable to tens or even hundreds of typical AI prompts.",
              },
            },
            {
              "@type": "Question",
              name: "Is an AI query worse than boiling a kettle?",
              acceptAnswer: {
                "@type": "Answer",
                text: "No. Boiling a kettle uses far more energy than a typical AI text prompt. AI image and video generation use more, but a single kettle boil still outweighs many everyday AI queries combined.",
              },
            },
            {
              "@type": "Question",
              name: "Does my AI use appear on my home electricity bill?",
              acceptAnswer: {
                "@type": "Answer",
                text: "Generally no. AI compute happens in data centres, not on your home meter. The appliance comparison shows the underlying energy scale, not a charge on your domestic bill.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: ComparisonGuide,
});

const rows = [
  { activity: "One AI text prompt", kwh: "~0.001", note: "Typical medium-complexity query" },
  { activity: "One AI image generation", kwh: "~0.02", note: "Single generated image" },
  { activity: "Charging a smartphone", kwh: "~0.012", note: "One full charge" },
  { activity: "Boiling a kettle", kwh: "~0.1", note: "One full boil (~1.5L)" },
  { activity: "One AI video generation", kwh: "~0.2", note: "Short clip, higher end" },
  { activity: "Washing machine cycle", kwh: "~0.8", note: "One standard 40°C cycle" },
  { activity: "Dishwasher cycle", kwh: "~1.2", note: "One standard cycle" },
  { activity: "Tumble dryer cycle", kwh: "~2.5", note: "One full load" },
];

const cards = [
  {
    icon: Zap,
    title: "Kettle vs prompt",
    body:
      "Boiling a kettle uses around 0.1 kWh. A typical AI text prompt is roughly 0.001 kWh — so a single boil is in the same ballpark as around 100 text prompts.",
  },
  {
    icon: Smartphone,
    title: "Phone charge vs image",
    body:
      "Fully charging a phone uses about 0.012 kWh. Generating one AI image (~0.02 kWh) is broadly similar — a little more than topping up your phone once.",
  },
  {
    icon: Droplets,
    title: "Dishwasher vs a day of AI",
    body:
      "A dishwasher cycle (~1.2 kWh) outweighs a heavy day of mixed AI use for most individual users. Everyday appliances remain the bigger household draw.",
  },
];

function ComparisonGuide() {
  return (
    <>
      <section className="bg-hero-gradient text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90">
            <Gauge className="h-3.5 w-3.5" /> Energy comparison guide · UK 2026
          </div>
          <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">
            AI Energy Consumption Comparison: Kettle vs AI Prompt
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85 leading-relaxed">
            How much energy does an AI query actually use? We benchmark AI prompts, images and
            videos against everyday things you already understand — boiling a kettle, running a
            dishwasher and charging your phone.
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 sm:px-6 py-14 space-y-12">
        <div className="prose-tool space-y-4 text-muted-foreground leading-relaxed">
          <p className="text-lg text-foreground">
            Kilowatt-hours are hard to picture. "0.001 kWh per prompt" means nothing until you
            put it next to something you do every day. This guide translates AI energy use into
            familiar terms so you can judge the real scale for yourself.
          </p>
          <p>
            The short version: a single <strong>AI text prompt</strong> uses far less energy
            than <strong>boiling a kettle</strong>. AI image and video generation cost more, but
            for most individual users, everyday household appliances are still the bigger draw.
            The energy story that matters is at the <strong>data-centre</strong> scale, where
            millions of queries add up.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            The comparison at a glance
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Estimated energy per activity, from smallest to largest. AI figures cover typical
            models; appliance figures are UK household averages.
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

        <section className="grid gap-4 sm:grid-cols-3">
          {cards.map((c) => (
            <div key={c.title} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <c.icon className="h-6 w-6 text-brand" />
              <h3 className="mt-3 font-bold text-foreground">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.body}</p>
            </div>
          ))}
        </section>

        <section className="space-y-4 text-muted-foreground leading-relaxed">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Why the kettle comparison works
          </h2>
          <p>
            The kettle is the perfect yardstick because almost everyone in the UK owns one and
            knows it's a heavy user of power. When you learn that a single boil is comparable to
            around a hundred typical AI text prompts, the scale of individual AI use suddenly
            feels manageable rather than alarming.
          </p>
          <p>
            That doesn't mean AI energy is trivial. Image and video generation cost noticeably
            more than text, and at population scale — billions of queries a day across global
            data centres — the totals become significant for the grid. The comparison is about{" "}
            <strong>personal perspective</strong>, not dismissing the wider infrastructure story.
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground pt-2">
            The important caveats
          </h2>
          <p>
            These are illustrative estimates. Real figures vary with the model, hardware, data
            centre efficiency (PUE) and appliance type. AI compute also happens in data centres,
            so it doesn't appear directly on your home electricity bill — the comparison shows
            the underlying energy scale, not a domestic charge.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-lg font-bold text-foreground">Run your own numbers</h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Want an estimate for your specific usage? These free interactive tools let you model
            your own AI energy use and compare it directly with UK appliances.
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
              to="/guides/ai-vs-household-appliances-energy"
              className="inline-flex items-center justify-between gap-2 rounded-md border border-input bg-background px-4 py-3 text-sm font-semibold hover:bg-accent transition"
            >
              Full guide: AI vs household appliances <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/guides/ai-electricity-cost-calculator"
              className="inline-flex items-center justify-between gap-2 rounded-md border border-input bg-background px-4 py-3 text-sm font-semibold hover:bg-accent transition"
            >
              Free UK business guide (PDF) <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
