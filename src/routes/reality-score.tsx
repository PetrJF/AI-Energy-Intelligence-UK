import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const FACTORS = [
  { name: "Planning", points: 25, criteria: ["Full consent — 25", "Outline, hybrid or resolution to grant — 18", "Application submitted or appeal live — 8", "Nothing filed — 0"] },
  { name: "Grid connection", points: 25, criteria: ["Offer or supply dated before 2030, or capacity stated as secured — 25", "Dated 2030–33, interim-only or undated reservation — 12", "No evidence or after 2033 — 0"] },
  { name: "Land and funding", points: 20, criteria: ["Land owned plus named operator or committed financing — 20", "Land controlled or funding announced but not closed — 10", "None shown — 0"] },
  { name: "Delivery team", points: 15, criteria: ["Main contractor appointed or construction under way — 15", "Design team named — 8", "None — 0"] },
  { name: "Momentum", points: 15, criteria: ["Site works, site hiring or new Companies House charges in the last 90 days — 15", "Dated activity in the last 6 months — 7", "Nothing for 6+ months — 0"] },
];

const BANDS = [
  ["80–100", "Building", "Main contractors are buying now. Approach the main contractor and M&E contractor."],
  ["60–79", "Likely", "Packages tender within 6–18 months. Get onto the design team's radar."],
  ["40–59", "Possible", "Watch. Early relationship with the developer only."],
  ["20–39", "Speculative", "Don't spend sales time yet."],
  ["0–19", "Headline only", "Announcement with no evidence behind it."],
];

export const Route = createFileRoute("/reality-score")({
  head: () => ({ meta: [
    { title: "The Reality Score | UK Data Centre Projects" },
    { name: "description", content: "How AI Energy Intelligence scores UK data-centre projects using public evidence on planning, grid, funding, delivery and momentum." },
    { property: "og:title", content: "The Reality Score | UK Data Centre Projects" },
    { property: "og:description", content: "A transparent 100-point method for judging which announced UK data-centre projects are most likely to be built." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/reality-score" }] }),
  component: RealityScorePage,
});

function RealityScorePage() {
  return <>
    <section className="border-b border-border bg-energy-deep text-electric-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-electric">Methodology</p>
        <h1 className="mt-3 font-display text-4xl font-bold">The Reality Score</h1>
        <p className="mt-4 max-w-3xl text-lg text-electric-foreground/75">A 100-point, evidence-led assessment of whether an announced UK data-centre project is moving towards construction.</p>
      </div>
    </section>
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <section>
        <h2 className="font-display text-2xl font-bold">Five factors, 100 points</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {FACTORS.map((factor) => <article key={factor.name} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-baseline justify-between gap-4"><h3 className="font-display text-lg font-bold">{factor.name}</h3><span className="font-mono text-sm text-brand">/{factor.points}</span></div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">{factor.criteria.map((criterion) => <li key={criterion} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />{criterion}</li>)}</ul>
          </article>)}
        </div>
      </section>
      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold">Score bands and supplier implications</h2>
        <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[40rem] text-left text-sm"><thead><tr className="border-b border-border"><th className="py-3 pr-4">Score</th><th className="py-3 pr-4">Band</th><th className="py-3">What it means for a supplier</th></tr></thead><tbody>{BANDS.map(([range, band, meaning]) => <tr key={band} className="border-b border-border"><td className="py-4 pr-4 font-mono">{range}</td><th className="py-4 pr-4">{band}</th><td className="py-4 text-muted-foreground">{meaning}</td></tr>)}</tbody></table></div>
      </section>
      <section className="mt-14 max-w-3xl rounded-lg border border-border bg-surface p-6">
        <h2 className="font-display text-2xl font-bold">Rules we apply</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
          <li>Every point is backed by a public source.</li><li>No evidence, no points.</li><li>Every score is dated and re-checked.</li><li>Developers can send corrections with evidence.</li><li>No one can pay for a score.</li><li>Editorial scores are independent of paid work.</li>
        </ul>
        <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold text-brand"><Link to="/corrections" className="inline-flex items-center gap-1">Submit a correction <ArrowRight className="h-4 w-4" /></Link><Link to="/uk-data-centre-tracker" className="inline-flex items-center gap-1">See the scores <ArrowRight className="h-4 w-4" /></Link></div>
      </section>
    </main>
  </>;
}