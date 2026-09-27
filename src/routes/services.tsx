import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { ServicesEnquiryForm } from "@/components/ServicesEnquiryForm";

const OFFERS = [
  { title: "Market Entry Sprint", price: "from £2,950 · 3 weeks", points: ["Which live UK projects fit your product and region", "Who buys at each level: developer, main contractor, M&E contractor", "Grid-date reality check on each target project", "Supplier qualification checklist", "A 90-day target list"] },
  { title: "Opportunity Desk", price: "from £995/month · 3-month minimum", points: ["Weekly tailored briefing", "Score-change and new-project alerts for your regions", "Quarterly call"] },
  { title: "Commissioned research", price: "from £3,000", points: ["Independent project or regional deliverability assessments for investors, lenders and councils"] },
];

export const Route = createFileRoute("/services")({
  head: () => ({ meta: [
    { title: "UK Data Centre Market Entry Services" },
    { name: "description", content: "Market-entry support, opportunity monitoring and commissioned research for firms entering the UK data-centre supply chain." },
    { property: "og:title", content: "UK Data Centre Market Entry Services" },
    { property: "og:description", content: "Know which UK data-centre projects are real, when work starts and who to call." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/services" }] }),
  component: ServicesPage,
});

function ServicesPage() { return <>
  <section className="border-b border-border bg-energy-deep text-electric-foreground"><div className="mx-auto max-w-7xl px-4 py-16 sm:px-6"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-electric">Services</p><h1 className="mt-3 font-display text-4xl font-bold">UK data-centre market entry</h1><p className="mt-4 max-w-3xl text-lg text-electric-foreground/75">For firms entering the UK data-centre supply chain: know which projects are real, when work starts, and who to call.</p></div></section>
  <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
    <div className="grid gap-5 lg:grid-cols-3">{OFFERS.map((offer) => <article key={offer.title} className="rounded-lg border border-border bg-card p-6 shadow-card"><h2 className="font-display text-xl font-bold">{offer.title}</h2><p className="mt-2 font-semibold text-brand">{offer.price}</p><ul className="mt-5 space-y-3 text-sm text-muted-foreground">{offer.points.map((point) => <li key={point} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />{point}</li>)}</ul></article>)}</div>
    <div className="mt-14 max-w-3xl"><ServicesEnquiryForm /></div>
  </main>
  </>; }