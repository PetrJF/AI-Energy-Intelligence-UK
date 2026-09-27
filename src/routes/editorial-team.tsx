import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, ShieldCheck, ScrollText, FlaskConical, Bot } from "lucide-react";
import { PageHero, ToolShell } from "@/components/ToolUI";
import { EDITORIAL_TEAM } from "@/data/editorial-team";

const URL = "https://aienergyintelligence.co.uk/editorial-team";
const TITLE = "Editorial Team & Accountability — AI Energy Intelligence UK";
const DESCRIPTION =
  "Who is accountable for what we publish at AI Energy Intelligence UK, the editorial roles behind our news, analysis, reports and calculators, and how to reach us.";

export const Route = createFileRoute("/editorial-team")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { property: "og:site_name", content: "AI Energy Intelligence UK" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: TITLE,
          description: DESCRIPTION,
          url: URL,
          inLanguage: "en-GB",
          publisher: {
            "@type": "Organization",
            name: "AI Energy Intelligence UK",
            url: "https://aienergyintelligence.co.uk",
            email: "info@aienergyintelligence.co.uk",
            ...(EDITORIAL_TEAM.length
              ? {
                  employee: EDITORIAL_TEAM.map((m) => ({
                    "@type": "Person",
                    name: m.name,
                    jobTitle: m.role,
                    description: m.bio,
                    url: `${URL}#${m.slug}`,
                    ...(m.links?.length ? { sameAs: m.links.map((l) => l.url) } : {}),
                  })),
                }
              : {}),
          },
        }),
      },
    ],
  }),
  component: EditorialTeam,
});

function EditorialTeam() {
  return (
    <>
      <PageHero
        eyebrow="Trust"
        title="Editorial team & accountability"
        intro="Independent UK coverage of AI and energy. This page sets out who is responsible for what we publish, the roles behind each type of content, and how to reach the people accountable for it."
      >
        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1">
            <ShieldCheck className="h-3.5 w-3.5" /> Editorially independent
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1">
            <Bot className="h-3.5 w-3.5" /> AI-assisted, human-signed-off
          </span>
        </div>
      </PageHero>

      <ToolShell>
        {EDITORIAL_TEAM.length > 0 && (
          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold">Who we are</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {EDITORIAL_TEAM.map((m) => (
                <article key={m.slug} id={m.slug} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                  <div className="flex items-start gap-4">
                    {m.imageUrl ? (
                      <img
                        src={m.imageUrl}
                        alt={`${m.name}, ${m.role} at AI Energy Intelligence UK`}
                        loading="lazy"
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : null}
                    <div>
                      <h3 className="font-display text-lg font-bold">{m.name}</h3>
                      <div className="text-xs uppercase tracking-wider text-brand font-semibold">{m.role}</div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{m.bio}</p>
                  {m.background?.length ? (
                    <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground list-disc pl-5">
                      {m.background.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  ) : null}
                  {m.beats.length ? (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {m.beats.map((b) => (
                        <span key={b} className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-muted-foreground">
                          {b}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                    {m.email ? (
                      <a className="text-brand underline underline-offset-2" href={`mailto:${m.email}`}>
                        Email {m.name.split(" ")[0]}
                      </a>
                    ) : null}
                    {m.links?.map((l) => (
                      <a
                        key={l.url}
                        className="text-brand underline underline-offset-2"
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer me"
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="grid gap-5 md:grid-cols-2">
          <RoleCard
            title="Research & modelling"
            body="Owns the assumptions, default values and data sources behind the calculators and reports, keeps them aligned with current UK figures, and logs every model revision with its previous value and reason."
          />
          <RoleCard
            title="News desk"
            body="Runs the automated discovery pipeline and the human review queue: checking suitability, removing duplicates, verifying the original publisher and deciding what reaches the news section."
          />
          <RoleCard
            title="Contributors"
            body="Anyone contributing to this site declares relevant financial, employment or advisory interests before working on a piece that touches them, and steps back where a conflict cannot be managed by disclosure."
          />
        </section>

        <section className="mt-12 rounded-2xl border border-border bg-surface p-7">
          <h2 className="font-display text-2xl font-bold">How to hold us to it</h2>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground leading-relaxed">
            Our commitments are written down, dated and public. If a page falls short of them, tell us — the
            corrections process is open to anyone, and you do not need to explain your interest.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <TrustLink to="/editorial-standards" icon={<ScrollText className="h-4 w-4" />} label="Editorial standards" hint="Sourcing, labelling and right of reply" />
            <TrustLink to="/corrections" icon={<ShieldCheck className="h-4 w-4" />} label="Corrections policy" hint="How to report an error and what happens next" />
            <TrustLink to="/research-methodology" icon={<FlaskConical className="h-4 w-4" />} label="Research methodology" hint="Data sources, assumptions and uncertainty" />
            <TrustLink to="/ai-use-and-conflicts" icon={<Bot className="h-4 w-4" />} label="AI use & conflicts of interest" hint="Where AI is used, and how we are funded" />
          </div>
          <div className="mt-6 flex items-start gap-3 text-sm">
            <Mail className="mt-0.5 h-5 w-5 text-brand" />
            <div>
              <div className="font-semibold">Contact the editorial team</div>
              <div className="text-muted-foreground">
                <a className="text-brand underline underline-offset-2" href="mailto:info@aienergyintelligence.co.uk">
                  info@aienergyintelligence.co.uk
                </a>{" "}
                — or use the{" "}
                <Link to="/contact" className="text-brand underline underline-offset-2">
                  contact form
                </Link>
                . More about the platform on our{" "}
                <Link to="/about" className="text-brand underline underline-offset-2">
                  about page
                </Link>
                .
              </div>
            </div>
          </div>
        </section>
      </ToolShell>
    </>
  );
}

function RoleCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}

function TrustLink({
  to,
  icon,
  label,
  hint,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  hint: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand/40"
    >
      <span className="mt-0.5 text-brand">{icon}</span>
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
      </span>
    </Link>
  );
}
