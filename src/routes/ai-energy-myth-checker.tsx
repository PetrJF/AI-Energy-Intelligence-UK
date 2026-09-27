import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ShieldQuestion,
  Search,
  ArrowRight,
  X,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  RotateCcw,
} from "lucide-react";
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
} from "@/components/energy/EnergyUI";
import {
  MYTHS,
  ALL_CATEGORIES,
  VERDICT_STYLES,
  CONFIDENCE_STYLES,
  TOOL_LINKS,
  type Myth,
  type MythCategory,
  type Verdict,
} from "@/data/aiEnergyMyths";

const FAQ_ITEMS = [
  {
    q: "Does AI really use a lot of electricity?",
    a: "Per query the energy is small, but aggregate and concentrated AI demand from data centres is growing fast enough to matter for grid planning and infrastructure.",
  },
  {
    q: "Are AI energy claims exaggerated?",
    a: "Some are. Catchy comparisons (like a prompt equalling a phone charge) are often misleading, while the broader point that AI demand is rising has merit. Context and scale matter.",
  },
  {
    q: "Do AI data centres use water?",
    a: "Some do, for cooling. Consumption varies enormously by cooling design and climate — evaporative cooling uses a lot, closed-loop and air cooling much less.",
  },
  {
    q: "Could AI affect UK electricity bills?",
    a: "It is genuinely uncertain. Rising demand and network costs could add pressure, but new generation, efficiency and cost allocation rules could offset it. It depends on policy and scale.",
  },
  {
    q: "Will AI require new power stations?",
    a: "It depends on scale. Modest growth may be absorbed by efficiency and existing plans; high-growth scenarios may need new generation, renewables or storage.",
  },
  {
    q: "Are AI energy forecasts reliable?",
    a: "They are best read as scenarios, not certainties. Forecasts vary widely because they depend on uncertain assumptions about adoption, efficiency, hardware and policy.",
  },
  {
    q: "Why do different sources give different AI energy estimates?",
    a: "Because AI energy use is hard to measure: model sizes, hardware efficiency, data centre design, cooling, usage mix and measurement boundaries all differ between studies.",
  },
];

export const Route = createFileRoute("/ai-energy-myth-checker")({
  head: () => ({
    meta: [
      { title: "AI Energy Myth Checker UK | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Check common myths about AI electricity use, data centres, carbon emissions and UK grid impact with an interactive AI energy myth checker.",
      },
      { property: "og:title", content: "AI Energy Myth Checker UK | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content:
          "Check common myths about AI electricity use, data centres, carbon emissions and UK grid impact with an interactive AI energy myth checker.",
      },
      { property: "og:url", content: "https://aienergyintelligence.co.uk/ai-energy-myth-checker" },
    ],
    links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/ai-energy-myth-checker" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            ...FAQ_ITEMS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
            ...MYTHS.map((m) => ({
              "@type": "Question",
              name: `Myth: ${m.claim} (Verdict: ${m.verdict})`,
              acceptedAnswer: { "@type": "Answer", text: `${m.short} ${m.evidence}` },
            })),
          ],
        }),
      },
    ],
  }),
  component: MythChecker,
});

// expected answer for score mode
function expectedAnswer(v: Verdict): "True" | "False" | "It depends" {
  if (v === "Mostly true") return "True";
  if (v === "Mostly false" || v === "Misleading") return "False";
  return "It depends";
}

function Badge({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
}

function MythModal({ myth, onClose, onPick }: { myth: Myth; onClose: () => void; onPick: (id: string) => void }) {
  const next = MYTHS.find((m) => m.claim.toLowerCase().includes(myth.nextQuestion.toLowerCase().slice(0, 12)));
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative my-8 w-full max-w-2xl rounded-2xl bg-energy-card text-energy-ink p-6 md:p-8 shadow-elegant"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-md p-1.5 text-energy-ink/50 hover:bg-black/5"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-wrap gap-2">
          <Badge className={VERDICT_STYLES[myth.verdict]}>{myth.verdict}</Badge>
          <Badge className={CONFIDENCE_STYLES[myth.confidence]}>Confidence: {myth.confidence}</Badge>
        </div>

        <h2 className="mt-4 font-display text-2xl font-bold leading-snug">“{myth.claim}”</h2>

        <div className="mt-5 space-y-5 text-sm leading-relaxed text-energy-ink/80">
          <div>
            <h3 className="font-display text-base font-bold text-energy-ink">In short</h3>
            <p className="mt-1">{myth.short}</p>
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-energy-ink">Why people believe this</h3>
            <p className="mt-1">{myth.whyBelieve}</p>
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-energy-ink">What the evidence actually suggests</h3>
            <p className="mt-1">{myth.evidence}</p>
          </div>
          <div className="rounded-xl bg-energy-grey p-4">
            <h3 className="font-display text-base font-bold text-energy-ink">UK context</h3>
            <p className="mt-1">{myth.ukRelevance}</p>
          </div>
        </div>

        {myth.tools.length > 0 && (
          <div className="mt-5">
            <h3 className="font-display text-base font-bold">Related tools</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {myth.tools.map((t) => (
                <Link
                  key={t}
                  to={TOOL_LINKS[t].to}
                  className="inline-flex items-center gap-1.5 rounded-md bg-electric/10 px-3 py-1.5 text-xs font-semibold text-electric hover:bg-electric/20"
                >
                  {TOOL_LINKS[t].label} <ArrowRight className="h-3 w-3" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {myth.articles.length > 0 && (
          <div className="mt-4">
            <h3 className="font-display text-base font-bold">Related reading</h3>
            <ul className="mt-2 space-y-1.5">
              {myth.articles.map((a) => (
                <li key={a.href}>
                  <a
                    href={a.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-electric hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> {a.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {next && (
          <button
            onClick={() => onPick(next.id)}
            className="mt-6 flex w-full items-center justify-between gap-2 rounded-xl border border-electric/30 bg-electric/5 p-4 text-left hover:bg-electric/10"
          >
            <span>
              <span className="block text-xs font-semibold uppercase tracking-wide text-electric">
                Suggested next question
              </span>
              <span className="mt-0.5 block font-semibold text-energy-ink">{myth.nextQuestion}</span>
            </span>
            <ArrowRight className="h-5 w-5 shrink-0 text-electric" />
          </button>
        )}
      </div>
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function ScoreMode() {
  const [quiz, setQuiz] = useState<Myth[]>(() => shuffle(MYTHS).slice(0, 10));
  const [answers, setAnswers] = useState<Record<string, "True" | "False" | "It depends">>({});
  const [submitted, setSubmitted] = useState(false);

  const score = quiz.reduce(
    (acc, m) => acc + (answers[m.id] === expectedAnswer(m.verdict) ? 1 : 0),
    0,
  );

  function reset() {
    setQuiz(shuffle(MYTHS).slice(0, 10));
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <WhiteCard>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-lg font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-electric" /> Score mode
        </h3>
        <button onClick={reset} className="inline-flex items-center gap-1.5 text-sm font-semibold text-electric">
          <RotateCcw className="h-4 w-4" /> New set
        </button>
      </div>
      <p className="mt-1 text-sm text-energy-ink/70">
        Answer 10 random AI energy claims with “True”, “False” or “It depends”, then check how your instincts compare
        with the evidence-led verdicts.
      </p>

      <ol className="mt-5 space-y-4">
        {quiz.map((m, i) => {
          const picked = answers[m.id];
          const correct = expectedAnswer(m.verdict);
          return (
            <li key={m.id} className="rounded-xl border border-black/10 p-4">
              <div className="font-semibold text-energy-ink">
                {i + 1}. “{m.claim}”
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(["True", "False", "It depends"] as const).map((opt) => {
                  const isPicked = picked === opt;
                  let cls = "border-black/15 bg-white text-energy-ink hover:border-electric/40";
                  if (submitted) {
                    if (opt === correct) cls = "border-green-300 bg-green-100 text-green-800";
                    else if (isPicked) cls = "border-red-300 bg-red-100 text-red-800";
                    else cls = "border-black/10 bg-white text-energy-ink/50";
                  } else if (isPicked) {
                    cls = "border-electric bg-electric/10 text-electric";
                  }
                  return (
                    <button
                      key={opt}
                      disabled={submitted}
                      onClick={() => setAnswers((a) => ({ ...a, [m.id]: opt }))}
                      className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${cls}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <div className="mt-3 text-sm">
                  <Badge className={VERDICT_STYLES[m.verdict]}>{m.verdict}</Badge>
                  <p className="mt-2 text-energy-ink/70">{m.short}</p>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {!submitted ? (
        <button
          onClick={() => setSubmitted(true)}
          disabled={Object.keys(answers).length < quiz.length}
          className="mt-5 w-full rounded-md bg-electric px-4 py-3 text-sm font-semibold text-electric-foreground hover:opacity-90 disabled:opacity-40"
        >
          See my score
        </button>
      ) : (
        <div className="mt-5 rounded-xl bg-energy-navy p-6 text-center text-white">
          <div className="font-display text-3xl font-bold">
            {score} / {quiz.length}
          </div>
          <p className="mt-2 text-white/80 text-sm">
            {score >= 8
              ? "Strong grasp of the evidence — you see past the headlines."
              : score >= 5
                ? "A solid start. The nuances of scale and UK context are worth a closer look."
                : "AI energy claims are genuinely tricky. The explanations above show why most need a 'it depends'."}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link
              to="/ai-grid-impact-forecast-tool"
              className="rounded-md bg-electric px-4 py-2 text-sm font-semibold text-electric-foreground"
            >
              Try the Grid Impact Forecast Tool
            </Link>
            <Link
              to="/reports"
              className="rounded-md border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
            >
              Read AI energy reports
            </Link>
          </div>
        </div>
      )}
    </WhiteCard>
  );
}

function SubmitMyth() {
  const [claim, setClaim] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (claim.trim().length < 5) return;
    setState("sending");
    try {
      const res = await fetch("/api/public/myth-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          claim: claim.trim(),
          email: email.trim() || undefined,
          source_url: source.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setState("done");
      setClaim("");
      setEmail("");
      setSource("");
    } catch {
      setState("error");
    }
  }

  return (
    <WhiteCard>
      <h3 className="font-display text-lg font-bold">Submit an AI energy claim for review</h3>
      <p className="mt-1 text-sm text-energy-ink/70">
        Spotted a claim about AI energy you'd like us to check? Send it in. Submissions are stored privately for our
        team to review — nothing is published automatically.
      </p>
      {state === "done" ? (
        <div className="mt-5 flex items-center gap-2 rounded-xl bg-green-100 p-4 text-green-800">
          <CheckCircle2 className="h-5 w-5" /> Thanks — your claim has been submitted for review.
        </div>
      ) : (
        <form onSubmit={submit} className="mt-5 space-y-4">
          <EField label="Claim *" hint="the statement to review">
            <textarea
              required
              maxLength={500}
              value={claim}
              onChange={(e) => setClaim(e.target.value)}
              rows={3}
              placeholder="e.g. “AI will double UK electricity demand by 2030.”"
              className="w-full rounded-md border border-black/15 bg-white px-3 py-2.5 text-sm text-energy-ink focus:outline-none focus:ring-2 focus:ring-electric"
            />
          </EField>
          <EField label="Email (optional)" hint="if you'd like a reply">
            <EText
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </EField>
          <EField label="Source link (optional)">
            <EText
              type="url"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="https://…"
            />
          </EField>
          {state === "error" && (
            <p className="text-sm text-red-600">Something went wrong. Please try again in a moment.</p>
          )}
          <button
            type="submit"
            disabled={state === "sending" || claim.trim().length < 5}
            className="rounded-md bg-electric px-5 py-2.5 text-sm font-semibold text-electric-foreground hover:opacity-90 disabled:opacity-40"
          >
            {state === "sending" ? "Submitting…" : "Submit claim"}
          </button>
        </form>
      )}
    </WhiteCard>
  );
}

function MythChecker() {
  const [query, setQuery] = useState("");
  const [activeCats, setActiveCats] = useState<MythCategory[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MYTHS.filter((m) => {
      const matchQ =
        !q ||
        m.claim.toLowerCase().includes(q) ||
        m.short.toLowerCase().includes(q) ||
        m.categories.some((c) => c.toLowerCase().includes(q));
      const matchCat = activeCats.length === 0 || m.categories.some((c) => activeCats.includes(c));
      return matchQ && matchCat;
    });
  }, [query, activeCats]);

  const openMyth = openId ? MYTHS.find((m) => m.id === openId) ?? null : null;

  function toggleCat(c: MythCategory) {
    setActiveCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "AI Energy Intelligence UK", to: "/" },
          { label: "AI Energy Tools" },
          { label: "AI Energy Calculators", to: "/ai-energy-calculators" },
          { label: "AI Energy Myth Checker" },
        ]}
      />
      <EnergyHero
        eyebrow="AI Energy Tools"
        title="AI Energy Myth Checker"
        intro="Test common claims about AI electricity use, data centres, carbon emissions, water use and UK grid impact. Each verdict is evidence-led, plain-English and focused on what it means for Britain — not sensational headlines."
        icon={ShieldQuestion}
      />

      <EnergyContainer className="py-10 space-y-8">
        <DisclaimerBanner />

        {/* Search + filters */}
        <WhiteCard>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-energy-ink/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search myths — electricity, water, data centres, grid, carbon, bills, Growth Zones, power stations…"
              className="w-full rounded-md border border-black/15 bg-white pl-9 pr-3 py-2.5 text-sm text-energy-ink focus:outline-none focus:ring-2 focus:ring-electric"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {ALL_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => toggleCat(c)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  activeCats.includes(c)
                    ? "border-electric bg-electric text-electric-foreground"
                    : "border-black/15 bg-white text-energy-ink hover:border-electric/40"
                }`}
              >
                {c}
              </button>
            ))}
            {(activeCats.length > 0 || query) && (
              <button
                onClick={() => {
                  setActiveCats([]);
                  setQuery("");
                }}
                className="rounded-full px-3 py-1 text-xs font-semibold text-electric underline-offset-2 hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          <p className="mt-3 text-xs text-energy-ink/50">
            Showing {filtered.length} of {MYTHS.length} claims
          </p>
        </WhiteCard>

        {/* Myth cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <div
              key={m.id}
              className="flex flex-col rounded-2xl bg-energy-card text-energy-ink p-5 shadow-card border border-black/5"
            >
              <div className="flex flex-wrap gap-2">
                <Badge className={VERDICT_STYLES[m.verdict]}>{m.verdict}</Badge>
                <Badge className={CONFIDENCE_STYLES[m.confidence]}>{m.confidence}</Badge>
              </div>
              <h3 className="mt-3 font-display text-base font-bold leading-snug">“{m.claim}”</h3>
              <p className="mt-2 text-sm text-energy-ink/70 leading-relaxed line-clamp-3">{m.short}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {m.categories.map((c) => (
                  <span key={c} className="rounded bg-energy-grey px-2 py-0.5 text-[11px] font-medium text-energy-ink/60">
                    {c}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setOpenId(m.id)}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-md bg-electric px-4 py-2 text-sm font-semibold text-electric-foreground hover:opacity-90"
              >
                Check this myth <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full rounded-xl bg-energy-card p-6 text-center text-energy-ink/60">
              No claims match your search. Try a different keyword or clear the filters.
            </p>
          )}
        </div>

        {/* Score mode */}
        <ScoreMode />

        {/* Submit a myth */}
        <SubmitMyth />

        {/* Educational sections */}
        <SeoSection title="Why AI energy myths spread">
          <p>
            AI energy use is hard to measure. Workloads, model sizes, data centre designs, cooling systems and
            electricity sources all vary, so credible estimates differ. Into that uncertainty step catchy
            comparisons and confident headlines that simplify a genuinely complex picture — and they spread quickly
            because they feel concrete.
          </p>
        </SeoSection>
        <SeoSection title="Why simple comparisons can mislead">
          <p>
            Comparing one AI prompt with one household appliance can oversimplify the issue. A single text query is
            tiny; a rich image or video generation is much larger; and the real story is the cumulative effect of
            billions of interactions plus the infrastructure behind them. Single-number comparisons rarely capture
            that.
          </p>
        </SeoSection>
        <SeoSection title="Why scale matters">
          <p>
            There is a big difference between individual AI usage and national-scale AI infrastructure. One person's
            use is negligible, but concentrated data centres drawing hundreds of megawatts continuously are a
            different category of demand. Many myths flip between these scales, which is why so many verdicts come
            down to “it depends on scale”.
          </p>
        </SeoSection>
        <SeoSection title="Why the UK context matters">
          <p>
            Britain's grid, planning rules, data centre locations, AI Growth Zones and electricity prices shape the
            real impact. The same AI workload can have very different consequences depending on where it is built,
            how it is cooled, when it runs and how the grid is reinforced. UK-specific context is essential to
            judging these claims.
          </p>
        </SeoSection>
        <SeoSection title="Limitations">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>This tool is educational.</li>
            <li>Verdicts are based on available public evidence and reasonable interpretation.</li>
            <li>AI energy estimates can change as technology, policy and infrastructure evolve.</li>
            <li>It is not official government, engineering or investment advice.</li>
          </ul>
        </SeoSection>

        {/* Internal links */}
        <SeoSection title="Related Tools & Resources">
          <ul className="mt-1 space-y-2">
            {[
              { to: "/ai-energy-calculators", label: "AI Energy Tools Hub" },
              { to: "/ai-grid-impact-forecast-tool", label: "AI Grid Impact Forecast Tool" },
              { to: "/ai-data-centre-electricity-calculator", label: "AI Data Centre Electricity Calculator" },
              { to: "/ai-water-consumption-calculator", label: "AI Water Consumption Calculator" },
              { to: "/ai-growth-zone-impact-calculator", label: "AI Growth Zone Impact Calculator" },
              { to: "/reports", label: "AI Energy Reports & Research" },
            ].map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="flex items-center gap-2 rounded-lg bg-white p-3 border border-black/5 hover:border-electric/40 transition-colors text-electric font-semibold"
                >
                  <ArrowRight className="h-4 w-4 shrink-0" /> {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="/blog/how-many-data-centres-uk-energy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-white p-3 border border-black/5 hover:border-electric/40 transition-colors text-electric font-semibold"
              >
                <ArrowRight className="h-4 w-4 shrink-0" /> AI Energy Intelligence UK UK AI Infrastructure Articles
              </a>
            </li>
          </ul>
        </SeoSection>

        <EnergyFAQ items={FAQ_ITEMS} />

        {/* CTA */}
        <div className="rounded-2xl bg-energy-navy border border-white/10 p-8 text-center">
          <h3 className="font-display text-2xl font-bold text-white">Explore the evidence behind AI energy claims</h3>
          <p className="mt-2 text-white/70 max-w-xl mx-auto">
            Move from myths to numbers with AI Energy Intelligence UK's UK AI energy intelligence tools.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              to="/ai-grid-impact-forecast-tool"
              className="inline-flex items-center gap-2 rounded-md bg-electric px-5 py-3 text-sm font-semibold text-electric-foreground hover:opacity-90"
            >
              Use the AI Grid Impact Forecast Tool <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/ai-data-centre-electricity-calculator"
              className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Estimate data centre electricity use
            </Link>
            <Link
              to="/reports"
              className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Read AI energy reports
            </Link>
          </div>
        </div>
      </EnergyContainer>

      {openMyth && <MythModal myth={openMyth} onClose={() => setOpenId(null)} onPick={(id) => setOpenId(id)} />}
    </EnergyShell>
  );
}
