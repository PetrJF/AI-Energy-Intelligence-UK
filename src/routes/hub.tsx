import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Cpu, Zap, Factory, ShieldCheck, ExternalLink } from "lucide-react";
import hubHeroAsset from "@/assets/hub-hero-bg.jpg.asset.json";

const CANONICAL = "https://aienergyintelligence.co.uk/hub";

export const Route = createFileRoute("/hub")({
  head: () => ({
    meta: [
      { title: "The UK AI, Energy and Cyber Security Hub | AI Energy Intelligence" },
      {
        name: "description",
        content:
          "The UK hub connecting AI, energy and cyber security. Led by AI Energy Intelligence with specialist analysis from PowerGuardian and Energy Sector, including Energy Sector's dedicated cyber security coverage.",
      },
      { property: "og:title", content: "The UK AI, Energy and Cyber Security Hub" },
      {
        property: "og:description",
        content:
          "How artificial intelligence is reshaping Britain's energy system, infrastructure and cyber resilience — one connected hub.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: CANONICAL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
  }),
  component: HubPage,
});

type Pillar = {
  icon: typeof Cpu;
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  cta: { label: string; href: string };
};

const PILLARS: Pillar[] = [
  {
    icon: Cpu,
    eyebrow: "AI & Energy",
    title: "How AI is changing Britain's energy future",
    body: "Artificial intelligence systems require enormous computing power. Every AI model, chatbot, image generator and automation platform relies on servers housed within energy-hungry data centres. As AI adoption accelerates across the UK, questions are emerging about:",
    bullets: [
      "Future electricity demand",
      "Data centre expansion",
      "Grid capacity",
      "Water consumption",
      "Renewable energy requirements",
      "Carbon emissions",
    ],
    cta: { label: "AI Energy Intelligence", href: "https://aienergyintelligence.co.uk" },
  },
  {
    icon: Zap,
    eyebrow: "Household bills",
    title: "What this means for household energy bills",
    body: "Increased electricity demand does not just affect technology companies. It can also influence infrastructure investment, generation requirements and long-term energy costs. Consumers increasingly want answers to questions such as:",
    bullets: [
      "Will AI increase electricity prices?",
      "Can the UK grid handle future demand?",
      "How will energy bills change?",
      "What does this mean for electric vehicles?",
      "Which suppliers offer the best value?",
    ],
    cta: { label: "PowerGuardian", href: "https://powerguardian.co.uk" },
  },
  {
    icon: Factory,
    eyebrow: "Industry",
    title: "The industry behind the headlines",
    body: "Behind every discussion about AI and electricity sits a much larger energy system involving power stations, renewable generation, grid operators, suppliers and regulators. Key questions include:",
    bullets: [
      "Can the UK generate enough electricity?",
      "How many new data centres are planned?",
      "Will renewable energy meet future demand?",
      "What infrastructure investment is required?",
      "How will the energy market evolve by 2030 and beyond?",
    ],
    cta: { label: "Energy Sector", href: "https://energysector.co.uk" },
  },
  {
    icon: ShieldCheck,
    eyebrow: "Cyber security",
    title: "Why cyber security is becoming critical",
    body: "As energy systems become increasingly digital, cyber security becomes just as important as physical infrastructure. Smart meters, EV chargers, energy suppliers, renewable assets and data centres all rely on connected technologies that could become targets for cyber criminals, hostile states or organised groups. Important questions include:",
    bullets: [
      "Could cyber attacks disrupt energy supplies?",
      "Are smart meters secure?",
      "How vulnerable is critical infrastructure?",
      "How is AI changing cyber threats?",
      "What risks do energy companies face?",
    ],
    cta: { label: "Energy Sector — Cyber Security", href: "https://energysector.co.uk/cyber-security" },
  },
];

const NETWORK = [
  {
    name: "AI Energy Intelligence",
    href: "https://aienergyintelligence.co.uk",
    desc: "Understanding how artificial intelligence affects energy, infrastructure, business and society across the UK.",
    flagship: true,
  },
  {
    name: "PowerGuardian",
    href: "https://powerguardian.co.uk",
    desc: "Helping consumers understand energy prices, suppliers, forecasts and electricity usage.",
  },
  {
    name: "Energy Sector",
    href: "https://energysector.co.uk",
    desc: "Investigating the UK energy industry, infrastructure and future power requirements.",
  },
];

function HubPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-[#0a0f1c] text-white">
        <img
          src={hubHeroAsset.url}
          alt="UK data centre at dusk with transmission pylons and glowing data-flow light trails representing the intersection of AI, energy and cyber security"
          width={1920}
          height={1088}
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1c] via-[#0a0f1c]/85 to-[#0a0f1c]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-transparent to-[#0a0f1c]/60" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 py-20 md:py-28">
          <div className="text-xs font-semibold uppercase tracking-wider text-sky-300">Hub</div>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold leading-tight">
            The UK AI, Energy and Cyber Security Hub
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/80 leading-relaxed">
            The future of Britain's economy will be shaped by three forces that are becoming
            increasingly connected: artificial intelligence, energy and cyber security.
          </p>
          <p className="mt-4 max-w-2xl text-lg text-white/70 leading-relaxed">
            Artificial intelligence is driving demand for new data centres, increasing electricity
            consumption and creating new opportunities for businesses and consumers. At the same
            time, the UK's energy infrastructure must adapt to support this growth while remaining
            secure against rising cyber threats.
          </p>
          <p className="mt-4 max-w-2xl text-lg text-white/90 leading-relaxed">
            This hub is led by <strong>AI Energy Intelligence</strong> and connects specialist
            analysis from PowerGuardian and Energy Sector, including Energy Sector's dedicated
            cyber security coverage, providing a complete picture of how artificial intelligence is
            reshaping Britain's energy system, infrastructure and cyber resilience.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/tools"
              className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-[#0a0f1c] hover:bg-sky-400 hover:text-white transition"
            >
              Explore UK AI energy tools <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/news"
              className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/10 transition"
            >
              Latest UK AI energy news
            </Link>
          </div>
        </div>
      </section>

      {PILLARS.map((p) => (
        <section key={p.title} className="border-b border-border">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent p-2">
                <p.icon className="h-5 w-5 text-brand" />
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-brand">
                {p.eyebrow}
              </div>
            </div>
            <h2 className="mt-3 font-display text-2xl md:text-3xl font-bold">{p.title}</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{p.body}</p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2 text-sm text-foreground">
              {p.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  {b}
                </li>
              ))}
            </ul>
            <a
              href={p.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
            >
              Explore {p.cta.label} <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </section>
      ))}

      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
          <h2 className="font-display text-2xl md:text-3xl font-bold">Following the full story</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Many of the biggest stories affecting Britain now overlap multiple sectors.
          </p>
          <ul className="mt-5 space-y-2 text-foreground">
            <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />A new AI data centre project may increase local electricity demand.</li>
            <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />That demand could require new energy infrastructure.</li>
            <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />The infrastructure may introduce new cyber security risks.</li>
            <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />The resulting investment costs could ultimately affect consumer energy bills.</li>
          </ul>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Understanding only one part of the story often means missing the bigger picture. That is
            why these three specialist websites work together to cover the complete journey from
            technological innovation to consumer impact.
          </p>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
          <h2 className="font-display text-2xl md:text-3xl font-bold">Explore the network</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {NETWORK.map((n) => (
              <a
                key={n.href}
                href={n.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex flex-col rounded-2xl border p-6 shadow-card hover:shadow-elegant hover:-translate-y-0.5 transition-all ${
                  n.flagship ? "border-brand bg-accent/30" : "border-border bg-card"
                }`}
              >
                {n.flagship && (
                  <span className="mb-3 w-fit rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-foreground">
                    Flagship
                  </span>
                )}
                <h3 className="font-display text-lg font-bold">{n.name}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed">{n.desc}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                  Visit site{" "}
                  <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-20 text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-brand">
            The bigger question
          </div>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold leading-tight">
            Can Britain deliver enough secure, affordable and sustainable energy to support the AI
            revolution?
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            The answer will depend on decisions made across technology, energy policy,
            infrastructure investment and cyber security. This hub exists to help readers understand
            all four pieces of that puzzle.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/tools"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
            >
              Explore the tools <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
