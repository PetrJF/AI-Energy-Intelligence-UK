import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Cookie, Mail, FileText } from "lucide-react";
import { PageHero, ToolShell } from "@/components/ToolUI";
import { openConsent } from "@/components/CookieConsent";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy & Cookie Policy — AI Energy Intelligence UK" },
      { name: "description", content: "How AI Energy Intelligence UK handles your data, cookies and analytics. UK GDPR-compliant privacy and cookie policy for aienergyintelligence.co.uk." },
      { property: "og:title", content: "Privacy & Cookie Policy — AI Energy Intelligence UK" },
      { property: "og:description", content: "Our UK GDPR privacy and cookie policy." },
    ],
  }),
  component: Privacy,
});

const updated = "25 September 2026";

function Privacy() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy & Cookie Policy"
        intro="How aienergyintelligence.co.uk handles your data, what cookies we use and how to control them. Written in plain English."
      >
        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1"><FileText className="h-3.5 w-3.5" /> Last updated {updated}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1"><Shield className="h-3.5 w-3.5" /> UK GDPR compliant</span>
        </div>
      </PageHero>

      <ToolShell>
        <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
          <article className="prose-content space-y-10">
            <Toc />

            <Section id="who-we-are" title="1. Who we are">
              <p>
                <strong>AI Energy Intelligence UK</strong> (“we”, “our”, “us”) operates
                this site at <strong>aienergyintelligence.co.uk</strong> and is the data controller for personal data
                processed through it.
              </p>
              <p>
                For privacy questions, please email us at{" "}
                <a className="link" href="mailto:info@aienergyintelligence.co.uk">info@aienergyintelligence.co.uk</a>.
              </p>
            </Section>

            <Section id="what-we-collect" title="2. What we collect">
              <p>The interactive tools on this site are designed to run in your browser. Specifically:</p>
              <ul>
                <li><strong>Tool inputs (e.g. answers in the readiness, savings or risk checkers)</strong> — processed locally in your browser. We do not store them on a server.</li>
                <li><strong>Email address</strong> — only when you choose to use a "Email me my results" or newsletter form. Used to send the requested content and, if you opt in, our briefing.</li>
                <li><strong>Project and region alerts</strong> — if you ask to be emailed when a tracker project or region changes, we store your email and the project or region you chose, and when we last sent you an alert.</li>
                <li><strong>Tracker CSV download</strong> — we ask for your email before the CSV of published tracker records downloads, and store it with the date of the request.</li>
                <li><strong>Analytics data</strong> — only if you accept analytics cookies. See section 4.</li>
                <li><strong>Server logs</strong> — standard request data (IP, user agent, page accessed) retained briefly for security and abuse prevention. Lawful basis: legitimate interest.</li>
              </ul>
              <p>We do not knowingly collect special category data through these tools. Please do not paste confidential or personal information into the input fields.</p>
            </Section>

            <Section id="legal-basis" title="3. Legal basis (UK GDPR)">
              <ul>
                <li><strong>Consent</strong> — for analytics, marketing cookies and newsletter sign-up.</li>
                <li><strong>Legitimate interests</strong> — for running and securing the site, and for limited server logs.</li>
                <li><strong>Contract / pre-contract</strong> — when you request information that we send to your email.</li>
              </ul>
            </Section>

            <Section id="cookies" title="4. Cookies & tracking">
              <p>We use a small number of cookies and similar storage. None of them are loaded until you give consent (or choose “analytics only”).</p>

              <CookieTable
                rows={[
                  { name: "aiei-consent-v1", type: "Strictly necessary", duration: "1 year (localStorage)", purpose: "Stores your cookie preference so we don't ask again." },
                  { name: "_ga, _ga_*", type: "Analytics (GA4)", duration: "Up to 2 years", purpose: "Google Analytics 4 — anonymous usage measurement (page views, tool completions, downloads)." },
                  { name: "Google Consent Mode v2", type: "Strictly necessary", duration: "Session", purpose: "Records your choice so Google tags respect it." },
                ]}
              />

              <p>
                We use Google's <strong>Consent Mode v2</strong> with all categories set to <em>denied</em> by default. We never load Google Analytics scripts before consent. We anonymise IP addresses and disable ad personalisation unless you accept all.
              </p>
              <p>
                <button onClick={openConsent} className="link font-semibold">Manage cookie preferences →</button>
              </p>
            </Section>

            <Section id="email" title="5. Email & newsletter">
              <p>
                If you submit your email to receive results, a download or our weekly briefing, we use it only for the purpose you requested. You can unsubscribe at any time using the link in any email.
              </p>
              <p>
                Email is sent via <strong>Brevo</strong> (Sendinblue SAS). If you opt in to the monthly tracker update, your email address is added to a Brevo contact list so we can send it; unsubscribing removes you.
              </p>
            </Section>

            <Section id="sharing" title="6. Who we share data with">
              <ul>
                <li><strong>Google Analytics</strong> (Google Ireland Ltd.) — only if you consent. Data may be transferred to the US under appropriate safeguards (UK IDTA / EU SCCs + UK Addendum).</li>
                <li><strong>Hosting provider</strong> — to serve the site.</li>
                <li><strong>Brevo (Sendinblue SAS)</strong> — sub-processor that sends our emails and holds the contact list for the monthly tracker update. See <a className="link" href="https://www.brevo.com/legal/privacypolicy/" target="_blank" rel="noopener noreferrer">Brevo's privacy policy</a>.</li>
                <li><strong>Supabase</strong> — sub-processor that hosts our database, including email addresses submitted through forms.</li>
                <li><strong>Authorities</strong> — where required by law.</li>
                <li><strong>Professional advisers</strong> — legal, accounting and similar, where necessary.</li>
              </ul>
              <p>We never sell personal data.</p>
            </Section>

            <Section id="retention" title="7. How long we keep data">
              <ul>
                <li>Cookie preference: up to 1 year, or until you clear it.</li>
                <li>Email subscriptions: until you unsubscribe.</li>
                <li>Server logs: typically up to 30 days.</li>
                <li>Analytics: per Google's GA4 retention settings (we use 14 months).</li>
              </ul>
            </Section>

            <Section id="rights" title="8. Your rights">
              <p>Under UK GDPR you have the right to:</p>
              <ul>
                <li>Access the personal data we hold about you</li>
                <li>Request correction or deletion</li>
                <li>Restrict or object to processing</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time (this doesn't affect prior processing)</li>
                <li>Complain to the ICO at <a className="link" href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">ico.org.uk</a></li>
              </ul>
              <p>To exercise any of these, please get in touch using the contact details below.</p>
            </Section>

            <Section id="security" title="9. Security">
              <p>
                Tool inputs are processed in your browser and not transmitted to our servers. Email and analytics data are transmitted over HTTPS. We restrict access to systems on a need-to-know basis.
              </p>
            </Section>

            <Section id="changes" title="10. Changes to this policy">
              <p>
                We may update this policy as the site evolves. The "Last updated" date at the top will change. For material changes affecting consent, we will re-prompt the cookie banner.
              </p>
            </Section>

            <div className="rounded-2xl border border-border bg-surface p-6 flex items-start gap-3">
              <Mail className="h-5 w-5 text-brand mt-0.5" />
              <div className="text-sm">
                <div className="font-semibold">Questions about this policy?</div>
                <div className="text-muted-foreground">
                  Email us at{" "}
                  <a className="link" href="mailto:info@aienergyintelligence.co.uk">info@aienergyintelligence.co.uk</a>.
                </div>
              </div>
            </div>
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="text-xs uppercase tracking-wider font-semibold text-brand mb-3">On this page</div>
              <TocList />
              <button onClick={openConsent} className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-md bg-brand-gradient px-3 py-2 text-xs font-semibold text-brand-foreground hover:opacity-90">
                <Cookie className="h-3.5 w-3.5" /> Manage cookies
              </button>
            </div>
          </aside>
        </div>

        <style>{`
          .prose-content :where(h2) { font-family: var(--font-display); font-weight: 700; font-size: 1.5rem; letter-spacing: -0.02em; scroll-margin-top: 90px; }
          .prose-content :where(p, li) { color: var(--muted-foreground); line-height: 1.65; font-size: 0.95rem; }
          .prose-content :where(strong) { color: var(--foreground); }
          .prose-content :where(ul) { list-style: disc; padding-left: 1.25rem; display: grid; gap: 0.4rem; }
          .prose-content :where(p) { margin-top: 0.75rem; }
          .link { color: var(--brand); text-decoration: underline; text-underline-offset: 2px; }
          .link:hover { opacity: 0.85; }
        `}</style>
      </ToolShell>
    </>
  );
}

const TOC = [
  { id: "who-we-are", label: "Who we are" },
  { id: "what-we-collect", label: "What we collect" },
  { id: "legal-basis", label: "Legal basis" },
  { id: "cookies", label: "Cookies & tracking" },
  { id: "email", label: "Email & newsletter" },
  { id: "sharing", label: "Sharing" },
  { id: "retention", label: "Retention" },
  { id: "rights", label: "Your rights" },
  { id: "security", label: "Security" },
  { id: "changes", label: "Changes" },
];

function Toc() {
  return (
    <nav className="lg:hidden rounded-xl border border-border bg-card p-4 text-sm">
      <div className="text-xs uppercase tracking-wider font-semibold text-brand mb-2">Contents</div>
      <ol className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-muted-foreground">
        {TOC.map((t, i) => (
          <li key={t.id}><a href={`#${t.id}`} className="hover:text-foreground">{i + 1}. {t.label}</a></li>
        ))}
      </ol>
    </nav>
  );
}

function TocList() {
  return (
    <ol className="space-y-1.5 text-sm text-muted-foreground">
      {TOC.map((t, i) => (
        <li key={t.id}><a href={`#${t.id}`} className="hover:text-foreground">{i + 1}. {t.label}</a></li>
      ))}
    </ol>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function CookieTable({ rows }: { rows: { name: string; type: string; duration: string; purpose: string }[] }) {
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="text-left font-semibold p-3">Name</th>
            <th className="text-left font-semibold p-3">Type</th>
            <th className="text-left font-semibold p-3">Duration</th>
            <th className="text-left font-semibold p-3">Purpose</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r) => (
            <tr key={r.name} className="bg-card">
              <td className="p-3 font-mono text-xs text-foreground">{r.name}</td>
              <td className="p-3 text-foreground">{r.type}</td>
              <td className="p-3 text-muted-foreground">{r.duration}</td>
              <td className="p-3 text-muted-foreground">{r.purpose}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
