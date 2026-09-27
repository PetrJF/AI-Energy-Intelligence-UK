import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, BookOpen, Compass, ShieldCheck } from "lucide-react";
import { OG_DEFAULT, ogImageMeta } from "@/lib/og-images";
import { SmartImage } from "@/components/media/SmartImage";
import infrastructureImage from "@/assets/hub-infrastructure.jpg";


export const Route = createFileRoute("/about/")({
  head: () => ({
    meta: [
      { title: "About AI Energy Intelligence UK | AI & Energy Insights" },
      {
        name: "description",
        content:
          "AI Energy Intelligence UK is an independent platform covering the intersection of artificial intelligence, electricity demand, data centres, grid infrastructure and UK energy policy.",
      },
      {
        name: "keywords",
        content:
          "AI energy UK, artificial intelligence energy, UK data centres, National Grid AI, AI electricity demand, UK energy policy, AI sustainability",
      },
      { property: "og:title", content: "About AI Energy Intelligence UK | AI & Energy Insights" },
      {
        property: "og:description",
        content:
          "Independent UK intelligence on the intersection of artificial intelligence, electricity demand, data centres, grid infrastructure and UK energy policy.",
      },
      { property: "og:url", content: "https://aienergyintelligence.co.uk/about" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "AI Energy Intelligence UK" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "About AI Energy Intelligence UK | AI & Energy Insights" },
      {
        name: "twitter:description",
        content:
          "Independent UK intelligence on the intersection of artificial intelligence, electricity demand, data centres, grid infrastructure and UK energy policy.",
      },
      ...ogImageMeta(OG_DEFAULT),
    ],
    links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/about" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About AI Energy Intelligence UK",
          description:
            "AI Energy Intelligence UK is an independent platform covering the intersection of artificial intelligence, electricity demand, data centres, grid infrastructure and UK energy policy.",
          url: "https://aienergyintelligence.co.uk/about",
          inLanguage: "en-GB",
          isPartOf: {
            "@type": "WebSite",
            name: "AI Energy Intelligence UK",
            url: "https://aienergyintelligence.co.uk",
          },
          mainEntity: {
            "@type": "Organization",
            name: "AI Energy Intelligence UK",
            url: "https://aienergyintelligence.co.uk",
            description:
              "Independent UK-based intelligence platform dedicated to explaining the relationship between artificial intelligence and energy in clear, evidence-based language.",
            areaServed: {
              "@type": "Country",
              name: "United Kingdom",
            },
            knowsAbout: [
              "Artificial Intelligence",
              "Electricity Demand",
              "Data Centres",
              "National Grid",
              "Renewable Energy",
              "UK Energy Policy",
              "Sustainability",
            ],
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://aienergyintelligence.co.uk/" },
            { "@type": "ListItem", position: 2, name: "About", item: "https://aienergyintelligence.co.uk/about" },
          ],
        }),
      },
    ],
  }),
  component: About,
});

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "Independent",
    body: "Free from supplier, vendor and political influence.",
  },
  {
    icon: BarChart3,
    title: "Evidence-based",
    body: "Built on trusted sources, official data and transparent research.",
  },
  {
    icon: BookOpen,
    title: "Accessible",
    body: "Written for everyone, not just technical specialists.",
  },
  {
    icon: Compass,
    title: "Forward-looking",
    body: "Focused on the challenges and opportunities shaping the next decade.",
  },
];

const COVERAGE = [
  "AI electricity consumption",
  "UK data centres and digital infrastructure",
  "National Grid capacity and future demand",
  "Renewable energy and storage",
  "Energy policy and regulation",
  "Water use and environmental impacts",
  "AI's role in the future energy system",
  "Industry trends and investment",
  "Cyber security risks affecting energy infrastructure",
];

const TRUST_LINKS = [
  { to: "/editorial-standards" as const, label: "Editorial standards" },
  { to: "/research-methodology" as const, label: "Research methodology" },
  { to: "/corrections" as const, label: "Corrections policy" },
  { to: "/ai-use-and-conflicts" as const, label: "AI use and conflicts" },
];

function About() {
  return (
    <>
      {/* Editorial hero */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-2">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-brand">About us</div>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">Peter Flynn, Editor</h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Peter Flynn runs AI Energy Intelligence UK and scores every UK data-centre project for
              its likelihood of being built. The work remains editorially independent from every
              operator, vendor and campaign group, and is sourced to public evidence including NESO,
              Ofgem, planning authorities and company records. See our{" "}
              <Link to="/ai-use-and-conflicts" className="link">conflicts policy</Link>.
            </p>
            <p className="mt-4 text-muted-foreground">
              Peter Flynn has a technical background and began his career in the power industry with
              National Power in the Midlands. He now focuses on how artificial intelligence is
              reshaping the UK energy system, especially the wave of data-centre projects competing
              for grid capacity. He set up AI Energy Intelligence UK to give suppliers and investors
              an independent, evidence-based view of which projects will actually get built.
            </p>
            <p className="mt-4 text-sm"><a href="mailto:info@aienergyintelligence.co.uk" className="link">info@aienergyintelligence.co.uk</a></p>
            <p className="mt-4 text-sm font-semibold">Editorial scores are independent of paid work: no client can buy or change a score.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/uk-data-centre-tracker"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                See the Real Pipeline <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-5 py-3 text-sm font-semibold transition hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                View services
              </Link>
            </div>
          </div>
          <SmartImage
            src={infrastructureImage}
            alt="UK electricity transmission infrastructure supporting data centre demand"
            ratio="16/9"
            priority
            className="rounded-xl border border-border"
          />
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h2 className="font-display text-2xl font-bold">Our mission</h2>
        <p className="mt-3 text-lg leading-relaxed text-foreground">
          To become the UK's leading independent source of intelligence on artificial intelligence
          and energy.
        </p>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          The future of AI cannot be understood without understanding energy, and the future of
          energy cannot be understood without understanding AI. Our aim is to make complex subjects
          understandable without sacrificing accuracy — for firms supplying the build-out, investors
          and policymakers.
        </p>
      </section>

      {/* Principles */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <h2 className="font-display text-2xl font-bold">Our principles</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="rounded-xl border border-border bg-card p-5">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-accent">
                  <p.icon className="h-4 w-4 text-brand" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we cover */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 className="font-display text-2xl font-bold">What we cover</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Nine research areas at the intersection of artificial intelligence, electricity and UK
          infrastructure.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COVERAGE.map((c) => (
            <li
              key={c}
              className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
              {c}
            </li>
          ))}
        </ul>
      </section>

      {/* Research process */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h2 className="font-display text-2xl font-bold">How we research</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            We work from official and primary sources — including NESO, DESNZ, DSIT and Ofgem
            publications — and record the definition, coverage, period and limitations behind every
            figure we publish. Where the evidence base is not strong enough to support a number, we
            label it as insufficient evidence rather than estimating. Alongside our news coverage we
            publish in-depth reports, research briefings, interactive tools and data-driven analysis.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {TRUST_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold transition-colors hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <h2 className="font-display text-2xl font-bold">Start with the evidence</h2>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            See which UK data-centre projects are real, or talk to us about entering the market.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/uk-data-centre-tracker"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              See the Real Pipeline <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-5 py-3 text-sm font-semibold transition hover:bg-accent"
            >
              View services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

