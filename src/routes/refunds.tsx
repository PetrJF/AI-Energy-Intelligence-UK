import { createFileRoute } from "@tanstack/react-router";
import { PageHero, ToolShell } from "@/components/ToolUI";

const LEGAL_NAME = "AI Energy Intelligence UK";
const CONTACT_EMAIL = "info@aienergyintelligence.co.uk";
const CONTACT_URL = "https://aienergyintelligence.co.uk";
const UPDATED = "25 September 2026";

const TITLE = "Refund Policy — currently not applicable — AI Energy Intelligence UK";
const DESCRIPTION =
  "AI Energy Intelligence UK does not currently offer a paid Pro subscription, so this refund policy is not presently in effect. Last updated 25 September 2026.";

export const Route = createFileRoute("/refunds")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Refund Policy — currently not applicable" },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Refunds,
});

function Refunds() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Refund Policy"
        intro={`AI Energy Intelligence UK does not currently sell a paid subscription, so no refund terms are in effect. Last updated ${UPDATED}.`}
      />
      <ToolShell>
        <article className="prose-content space-y-8 max-w-3xl">
          <section>
            <h2>No paid subscription is currently offered</h2>
            <p>
              {LEGAL_NAME} does not currently offer a paid Pro subscription or any other paid
              product, and there is no checkout on this site. Because nothing is being sold, this
              refund policy is <strong>not presently in effect</strong> — there is nothing to refund
              and no subscription to cancel.
            </p>
            <p>
              This page will be updated if and when a paid tier is introduced, at which point the
              refund terms that will apply will be set out here before any payment is taken.
            </p>
          </section>

          <section>
            <h2>Statutory rights</h2>
            <p>
              Nothing in this policy limits your statutory rights as a consumer under the laws of
              your country of residence.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              Questions about this policy or anything else on the site? Get in touch via{" "}
              <a className="link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>{" "}
              or <a className="link" href={CONTACT_URL} target="_blank" rel="noopener noreferrer">{CONTACT_URL}</a>.
            </p>
          </section>
        </article>

        <style>{`
          .prose-content :where(h2) { font-family: var(--font-display); font-weight: 700; font-size: 1.35rem; letter-spacing: -0.02em; }
          .prose-content :where(p, li) { color: var(--muted-foreground); line-height: 1.65; font-size: 0.95rem; }
          .prose-content :where(strong) { color: var(--foreground); }
          .prose-content :where(p) { margin-top: 0.6rem; }
          .link { color: var(--brand); text-decoration: underline; text-underline-offset: 2px; }
          .link:hover { opacity: 0.85; }
        `}</style>
      </ToolShell>
    </>
  );
}
