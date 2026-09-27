import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, ToolShell } from "@/components/ToolUI";

const LEGAL_NAME = "AI Energy Intelligence UK";
const TRADING_NAME = "AI Energy Intelligence UK";
const SITE = "aienergyintelligence.co.uk";
const CONTACT_EMAIL = "info@aienergyintelligence.co.uk";
const UPDATED = "25 September 2026";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — AI Energy Intelligence UK" },
      { name: "description", content: "Terms of Use governing your use of AI Energy Intelligence UK, including acceptable use, AI-generated content and intellectual property." },
      { property: "og:title", content: "Terms of Use — AI Energy Intelligence UK" },
      { property: "og:description", content: "Terms governing the use of AI Energy Intelligence UK." },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Use" intro={`The agreement between you and ${LEGAL_NAME} when you use ${SITE}. Last updated ${UPDATED}.`} />
      <ToolShell>
        <article className="prose-content space-y-8 max-w-3xl">
          <Section title="1. Who you are contracting with">
            <p>
              These Terms form a contract between you and <strong>{LEGAL_NAME}</strong> (trading as {TRADING_NAME}, “we”, “us”, “our”),
              the operator of {SITE}. By accessing or using the site or any of its tools, free or paid, you agree to these Terms.
              If you do not agree, do not use the service.
            </p>
            <p>
              If you are using the service on behalf of an organisation, you confirm you have authority to bind that
              organisation. If you are an individual, you confirm you are of legal age in your jurisdiction.
            </p>
          </Section>

          <Section title="2. The service">
            <p>
              We provide interactive AI-related tools for UK businesses, including readiness checks, savings calculators,
              risk audits and reports (the “Service”). Free features are available without an account. We do not currently
              offer paid “Pro” features or any paid tier.
            </p>
            <p>
              We may add, change or remove features at any time. We do not guarantee the Service will be uninterrupted,
              error-free, or always available.
            </p>
          </Section>

          <Section title="3. Accounts">
            <p>
              You must provide accurate information when signing up and keep it up to date. You are responsible for
              keeping your credentials confidential and for activity under your account.
            </p>
          </Section>

          <Section title="4. Acceptable use">
            <p>You agree not to:</p>
            <ul>
              <li>use the Service for unlawful, fraudulent, harassing or harmful purposes;</li>
              <li>infringe anyone's intellectual property, privacy or other rights;</li>
              <li>upload malware, probe, scan, or interfere with the security or integrity of the Service;</li>
              <li>scrape, mass-extract or resell content or outputs without our written permission;</li>
              <li>attempt to reverse engineer, decompile, or circumvent technical limits;</li>
              <li>use the Service to build a competing product.</li>
            </ul>
          </Section>

          <Section title="5. AI-generated content">
            <p>
              Some tools use generative AI to produce reports, scores or recommendations. You acknowledge that:
            </p>
            <ul>
              <li>outputs may be inaccurate, incomplete or out of date and must be reviewed by a competent human before relying on them;</li>
              <li>outputs do not constitute legal, financial, tax, regulatory, medical or other professional advice;</li>
              <li>you are responsible for your prompts and inputs, for verifying outputs, and for ensuring you have the rights to any content you submit;</li>
              <li>you must not use the Service to generate illegal content, deepfakes, hateful, discriminatory, defamatory or sexually explicit material, malware, or content designed to deceive or harm others;</li>
              <li>we may filter, refuse, restrict or remove inputs or outputs, and suspend accounts that repeatedly or seriously violate these rules.</li>
            </ul>
            <p>
              If you believe content infringes your rights, contact us at <a className="link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
              We will investigate and may remove content and terminate accounts of repeat infringers.
            </p>
          </Section>

          <Section title="6. Intellectual property">
            <p>
              We and our licensors retain all rights in the Service, including software, design, branding and documentation.
              We grant you a limited, non-exclusive, non-transferable right to use the Service in accordance with these
              Terms. You retain ownership of content you submit; you grant us a limited licence
              to host and process it solely to provide the Service.
            </p>
          </Section>

          <Section title="7. Subscriptions, payment, billing and refunds">
            <p>
              {TRADING_NAME} does not currently offer a paid Pro subscription or any paid tier, so there is presently
              no billing, subscription or cancellation process in effect. See our{" "}
              <Link to="/refunds" className="link">Refund Policy</Link> page for details. These Terms will be updated
              if a paid tier is introduced.
            </p>
          </Section>

          <Section title="8. Suspension and termination">
            <p>
              We may suspend or terminate your access if you materially breach these Terms, create a security
              or fraud risk, or repeatedly violate our acceptable use rules. You may stop using the Service at any
              time. On termination, your right to access the Service ends; we may delete account
              data after a reasonable period.
            </p>
          </Section>

          <Section title="9. Disclaimers">
            <p>
              To the fullest extent permitted by law, the Service is provided “as is” and “as available”. We disclaim all
              implied warranties, including merchantability, fitness for a particular purpose and non-infringement. We do
              not warrant that the Service will meet your requirements or that outputs will be accurate.
            </p>
          </Section>

          <Section title="10. Limitation of liability">
            <p>
              To the fullest extent permitted by law, neither party is liable for indirect, special, incidental,
              consequential, exemplary or punitive damages, or loss of profits, revenue, data, goodwill or business
              opportunity. Our aggregate liability arising out of or relating to the Service is limited to the fees you
              paid us in the 12 months before the event giving rise to the claim. Nothing limits liability for fraud,
              death or personal injury caused by negligence, or any other liability that cannot be excluded by law.
            </p>
          </Section>

          <Section title="11. Indemnity">
            <p>
              You will indemnify us against claims, damages and reasonable costs arising from your content, your unlawful
              use of the Service, or your breach of these Terms.
            </p>
          </Section>

          <Section title="12. Changes to these Terms">
            <p>
              We may update these Terms. The “Last updated” date at the top will change. Material changes will be
              communicated via the Service or by email where appropriate. Continued use after changes means you accept them.
            </p>
          </Section>

          <Section title="13. Governing law">
            <p>
              These Terms are governed by the laws of England and Wales. The courts of England and Wales have exclusive
              jurisdiction over disputes, except where mandatory consumer law gives you the right to bring proceedings in
              your country of residence.
            </p>
          </Section>

          <Section title="14. Contact">
            <p>
              {LEGAL_NAME}, trading as {TRADING_NAME}. Get in touch via{" "}
              <a className="link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </Section>
        </article>

        <style>{`
          .prose-content :where(h2) { font-family: var(--font-display); font-weight: 700; font-size: 1.35rem; letter-spacing: -0.02em; }
          .prose-content :where(p, li) { color: var(--muted-foreground); line-height: 1.65; font-size: 0.95rem; }
          .prose-content :where(strong) { color: var(--foreground); }
          .prose-content :where(ul) { list-style: disc; padding-left: 1.25rem; display: grid; gap: 0.4rem; margin-top: 0.5rem; }
          .prose-content :where(p) { margin-top: 0.6rem; }
          .link { color: var(--brand); text-decoration: underline; text-underline-offset: 2px; }
          .link:hover { opacity: 0.85; }
        `}</style>
      </ToolShell>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
