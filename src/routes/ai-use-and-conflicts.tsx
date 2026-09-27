import { createFileRoute, Link } from "@tanstack/react-router";
import { PolicyPage, PolicySection, policyHead } from "@/components/PolicyPage";

const SECTIONS = [
  { id: "summary", label: "Summary" },
  { id: "where-ai", label: "Where AI is used" },
  { id: "where-not", label: "Where AI is not used" },
  { id: "human-oversight", label: "Human oversight" },
  { id: "labelling", label: "Labelling" },
  { id: "your-data", label: "Your data and AI" },
  { id: "coi-position", label: "Conflicts: our position" },
  { id: "coi-revenue", label: "How we make money" },
  { id: "coi-related", label: "Related interests" },
  { id: "coi-declare", label: "Declaring and reporting" },
];

export const Route = createFileRoute("/ai-use-and-conflicts")({
  head: () =>
    policyHead({
      title: "AI Use & Conflicts of Interest — AI Energy Intelligence UK",
      description:
        "Where AI Energy Intelligence UK uses AI in its publishing workflow, where it does not, how AI-assisted content is labelled, and our conflicts of interest disclosures.",
      path: "/ai-use-and-conflicts",
    }),
  component: AiUseAndConflicts,
});

function AiUseAndConflicts() {
  return (
    <PolicyPage
      eyebrow="Trust"
      title="AI Use & Conflicts of Interest"
      intro="We write about AI, so we owe you an unusually clear account of how we use it ourselves — and of any interest that could affect what we publish."
      updated="10 August 2026"
      badge="AI-assisted, human-accountable"
      sections={SECTIONS}
    >
      <PolicySection id="summary" title="1. Summary">
        <p>
          AI tools help us find, sort and draft. They do not decide what is true and they do not publish unchecked.
          A named human is accountable for every page on this site, including pages where AI did part of the work.
        </p>
      </PolicySection>

      <PolicySection id="where-ai" title="2. Where we use AI">
        <ul>
          <li>
            <strong>News discovery and triage</strong> — searching for UK AI-and-energy stories, extracting page
            content, detecting duplicates and scoring source quality.
          </li>
          <li>
            <strong>Summarising</strong> — producing the short summaries and key-point lists that sit alongside
            linked news items.
          </li>
          <li>
            <strong>Drafting support</strong> — first drafts, structure, headline options and plain-English
            rewrites of technical material.
          </li>
          <li>
            <strong>Metadata</strong> — suggesting descriptions, tags, categories and structured data.
          </li>
          <li>
            <strong>Checking</strong> — flagging inconsistencies, unclear passages and unsupported claims for a
            human to resolve.
          </li>
        </ul>
      </PolicySection>

      <PolicySection id="where-not" title="3. Where we do not use AI">
        <ul>
          <li>We do not treat AI output as a source. A model's assertion is never a citation.</li>
          <li>We do not let AI invent statistics, quotes, case studies, testimonials or named experts.</li>
          <li>We do not auto-publish uncertain or lower-tier stories; those are held for human review.</li>
          <li>We do not use AI-generated imagery to depict real people, places or events as if photographed.</li>
          <li>We do not use AI to set the assumptions or default values inside our calculators.</li>
        </ul>
      </PolicySection>

      <PolicySection id="human-oversight" title="4. Human oversight">
        <p>
          Automated news items are gated by source tier and quality score: official and high-scoring established
          sources can publish automatically, and everything else waits in an editorial queue until a person
          approves or rejects it. Analysis, research and reports are written and signed off by a human before
          publication. The process is described in full in our{" "}
          <Link to="/editorial-standards" className="link">editorial standards</Link>.
        </p>
      </PolicySection>

      <PolicySection id="labelling" title="5. Labelling">
        <p>
          Summaries produced with AI assistance are identified as such, and the original publisher is always named
          and linked. Where a longer piece was substantially AI-drafted, the page says so. Absence of a label means
          the page was written by a person.
        </p>
      </PolicySection>

      <PolicySection id="your-data" title="6. Your data and AI">
        <p>
          Calculator inputs run in your browser and are not sent to an AI provider. Content we process through AI
          services is published or publicly available material, not reader personal data. Details of what we
          collect are in our <Link to="/privacy" className="link">privacy policy</Link>.
        </p>
      </PolicySection>

      <PolicySection id="coi-position" title="7. Conflicts of interest: our position">
        <p>
          No advertiser, sponsor, supplier, data centre operator, AI vendor, political party or campaign group has
          any editorial control over this site, and none receives pre-publication review. Coverage is never sold,
          traded or withheld as part of a commercial arrangement.
        </p>
      </PolicySection>

      <PolicySection id="coi-revenue" title="8. How we make money">
        <p>
          The site is funded through paid subscriptions and paid reports. Free tools and articles are supported by
          that revenue. Payments are handled by our payment provider; we never see or store card details. Buying a
          report does not buy influence over its findings, and subscribers receive no editorial privileges beyond
          access to paid material.
        </p>
        <p>
          If we ever introduce advertising, sponsorship or affiliate links, each instance will be labelled on the
          page and this section will be updated before it goes live.
        </p>
      </PolicySection>

      <PolicySection id="coi-related" title="9. Related interests">
        <p>
          Where we link to a site, product or organisation connected to us, or to anyone who writes for us, we say
          so at the point of the link. The same applies to any organisation we hold a financial interest in or
          receive payment from.
        </p>
      </PolicySection>

      <PolicySection id="coi-declare" title="10. Declaring, and reporting a concern">
        <p>
          Anyone contributing to this site must declare relevant financial holdings, employment, consultancy or
          advisory relationships before working on a piece that touches them, and steps back from coverage where
          the conflict cannot be managed by disclosure.
        </p>
        <p>
          If you think an undisclosed interest has shaped something we published, email{" "}
          <a className="link" href="mailto:info@aienergyintelligence.co.uk">info@aienergyintelligence.co.uk</a> with
          the URL. Concerns are handled under our{" "}
          <Link to="/corrections" className="link">corrections policy</Link>.
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
