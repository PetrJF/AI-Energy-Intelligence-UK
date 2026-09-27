import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Mail, FileText, ShieldCheck } from "lucide-react";
import { PageHero, ToolShell } from "@/components/ToolUI";

export type PolicySection = { id: string; label: string };

export function PolicyPage({
  eyebrow,
  title,
  intro,
  updated,
  badge,
  sections,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  badge?: string;
  sections: PolicySection[];
  children: ReactNode;
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} intro={intro}>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1">
            <FileText className="h-3.5 w-3.5" /> Last updated {updated}
          </span>
          {badge ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1">
              <ShieldCheck className="h-3.5 w-3.5" /> {badge}
            </span>
          ) : null}
        </div>
      </PageHero>

      <ToolShell>
        <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
          <article className="prose-content space-y-10">
            <nav className="lg:hidden rounded-xl border border-border bg-card p-4 text-sm">
              <div className="text-xs uppercase tracking-wider font-semibold text-brand mb-2">Contents</div>
              <ol className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-muted-foreground">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="hover:text-foreground">{i + 1}. {s.label}</a>
                  </li>
                ))}
              </ol>
            </nav>

            {children}

            <div className="rounded-2xl border border-border bg-surface p-6 flex items-start gap-3">
              <Mail className="h-5 w-5 text-brand mt-0.5" />
              <div className="text-sm">
                <div className="font-semibold">Questions, corrections or right of reply?</div>
                <div className="text-muted-foreground">
                  Email{" "}
                  <a className="link" href="mailto:info@aienergyintelligence.co.uk">info@aienergyintelligence.co.uk</a>{" "}
                  or use the <Link to="/contact" className="link">contact form</Link>.
                </div>
              </div>
            </div>
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="text-xs uppercase tracking-wider font-semibold text-brand mb-3">On this page</div>
              <ol className="space-y-1.5 text-sm text-muted-foreground">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="hover:text-foreground">{i + 1}. {s.label}</a>
                  </li>
                ))}
              </ol>
              <div className="mt-5 border-t border-border pt-4">
                <div className="text-xs uppercase tracking-wider font-semibold text-brand mb-2">Trust</div>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li><Link to="/editorial-team" className="hover:text-foreground">Editorial team</Link></li>
                  <li><Link to="/editorial-standards" className="hover:text-foreground">Editorial standards</Link></li>
                  <li><Link to="/corrections" className="hover:text-foreground">Corrections policy</Link></li>
                  <li><Link to="/research-methodology" className="hover:text-foreground">Research methodology</Link></li>
                  <li><Link to="/ai-use-and-conflicts" className="hover:text-foreground">AI use &amp; conflicts</Link></li>
                </ul>
              </div>
            </div>
          </aside>
        </div>

        <style>{`
          .prose-content :where(h2) { font-family: var(--font-display); font-weight: 700; font-size: 1.5rem; letter-spacing: -0.02em; scroll-margin-top: 90px; }
          .prose-content :where(h3) { font-weight: 600; font-size: 1.05rem; margin-top: 1.25rem; }
          .prose-content :where(p, li) { color: var(--muted-foreground); line-height: 1.65; font-size: 0.95rem; }
          .prose-content :where(strong) { color: var(--foreground); }
          .prose-content :where(ul, ol) { list-style: disc; padding-left: 1.25rem; display: grid; gap: 0.4rem; }
          .prose-content :where(ol) { list-style: decimal; }
          .prose-content :where(p) { margin-top: 0.75rem; }
          .link { color: var(--brand); text-decoration: underline; text-underline-offset: 2px; }
          .link:hover { opacity: 0.85; }
        `}</style>
      </ToolShell>
    </>
  );
}

export function PolicySection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function policyHead({
  title,
  description,
  path,
  type = "WebPage",
}: {
  title: string;
  description: string;
  path: string;
  type?: string;
}) {
  const url = `https://aienergyintelligence.co.uk${path}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:site_name", content: "AI Energy Intelligence UK" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": type,
          name: title,
          description,
          url,
          inLanguage: "en-GB",
          isPartOf: {
            "@type": "WebSite",
            name: "AI Energy Intelligence UK",
            url: "https://aienergyintelligence.co.uk",
          },
          publisher: {
            "@type": "Organization",
            name: "AI Energy Intelligence UK",
            url: "https://aienergyintelligence.co.uk",
          },
        }),
      },
    ],
  };
}
