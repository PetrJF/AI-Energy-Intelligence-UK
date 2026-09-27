import { createFileRoute, Link } from "@tanstack/react-router";
import { PolicyPage, PolicySection, policyHead } from "@/components/PolicyPage";

const SECTIONS = [
  { id: "purpose", label: "Purpose" },
  { id: "independence", label: "Independence" },
  { id: "sourcing", label: "Sourcing" },
  { id: "news-pipeline", label: "News pipeline" },
  { id: "analysis", label: "Analysis & research" },
  { id: "calculators", label: "Calculators & models" },
  { id: "uncertainty", label: "Uncertainty & labels" },
  { id: "right-of-reply", label: "Right of reply" },
  { id: "complaints", label: "Complaints" },
];

export const Route = createFileRoute("/editorial-standards")({
  head: () =>
    policyHead({
      title: "Editorial Standards — AI Energy Intelligence UK",
      description:
        "How AI Energy Intelligence UK sources, checks and publishes news, analysis, reports and calculators on AI energy use in the UK.",
      path: "/editorial-standards",
    }),
  component: EditorialStandards,
});

function EditorialStandards() {
  return (
    <PolicyPage
      eyebrow="Trust"
      title="Editorial Standards"
      intro="The rules we hold ourselves to when publishing anything on this site — news, analysis, reports and the numbers inside our calculators."
      updated="10 August 2026"
      badge="Applies to every page we publish"
      sections={SECTIONS}
    >
      <PolicySection id="purpose" title="1. Purpose of this site">
        <p>
          AI Energy Intelligence UK exists to explain, in plain English and with UK figures, how artificial
          intelligence interacts with electricity demand, data centres, grid infrastructure and energy policy.
          Everything we publish falls into one of four categories: <strong>news</strong>, <strong>analysis and
          research</strong>, <strong>reports</strong> and <strong>calculators</strong>. Each has its own checks,
          set out below.
        </p>
      </PolicySection>

      <PolicySection id="independence" title="2. Independence">
        <p>
          We are an independent UK publisher. No energy supplier, data centre operator, AI vendor, political party
          or lobby group has editorial control, pre-publication review or veto over what appears here. Where a
          commercial or personal relationship could reasonably be seen to affect coverage, we disclose it on the
          page and in our{" "}
          <Link to="/ai-use-and-conflicts" className="link">AI use and conflicts of interest statement</Link>.
        </p>
      </PolicySection>

      <PolicySection id="sourcing" title="3. Sourcing rules">
        <ul>
          <li>Every factual claim is traceable to a named, linked source, or is labelled as our own estimate.</li>
          <li>
            We prioritise primary sources: Ofgem, DESNZ, NESO, National Grid, the ONS, planning authorities,
            regulators, company filings and peer-reviewed research.
          </li>
          <li>
            Secondary reporting is used to point at a primary source, not to replace it. Where only secondary
            reporting exists, we say so.
          </li>
          <li>We do not publish figures we cannot attribute. If a number is unknown, we write that it is unknown.</li>
          <li>We do not use anonymous claims, unverifiable leaks or AI-generated "facts" as a source.</li>
        </ul>
      </PolicySection>

      <PolicySection id="news-pipeline" title="4. How the news pipeline works">
        <p>
          Our <Link to="/news" className="link">news section</Link> is assembled by an automated pipeline with
          human sign-off. In order, each candidate story is:
        </p>
        <ol>
          <li><strong>Discovered</strong> against a fixed set of UK AI-and-energy topics.</li>
          <li>
            <strong>Filtered for suitability</strong> — job vacancies, tag and author index pages, PDFs, paywalled
            pages, bot walls, error pages and inaccessible URLs are rejected automatically.
          </li>
          <li>
            <strong>De-duplicated</strong> — by source URL and by headline similarity, so the same story from
            several outlets appears once.
          </li>
          <li>
            <strong>Tiered by source quality</strong> — Tier 1 (government, regulators, primary research bodies),
            Tier 2 (established news organisations), Tier 3 (specialist or niche publishers).
          </li>
          <li>
            <strong>Scored</strong> — a composite quality score combining source tier, UK relevance, confidence and
            whether the story contains verifiable data.
          </li>
          <li>
            <strong>Reviewed</strong> — Tier 1 and high-scoring Tier 2 items publish automatically; everything else
            is held in an editorial queue for a human to approve or reject before it can appear.
          </li>
        </ol>
        <p>
          Summaries in the news section are AI-assisted and clearly labelled. The original publisher is always
          named and linked, and we do not republish full articles.
        </p>
      </PolicySection>

      <PolicySection id="analysis" title="5. Analysis, research and reports">
        <p>
          Longer pieces in <Link to="/blog" className="link">Analysis &amp; Research</Link> and in{" "}
          <Link to="/reports" className="link">Reports</Link> are written to a fixed structure: the question, the
          evidence, the assumptions, the answer, and what would change the answer. Before publication we check
          that:
        </p>
        <ul>
          <li>every statistic has a source link and a date;</li>
          <li>every calculation can be reproduced from the stated inputs;</li>
          <li>opinion and interpretation are visibly separated from reported fact;</li>
          <li>the piece states clearly where UK evidence is thin or contested.</li>
        </ul>
      </PolicySection>

      <PolicySection id="calculators" title="6. Calculators and models">
        <p>
          Our calculators are estimation tools, not measurements. Each one states its assumptions, its default
          values and their sources on the page. They are intended for orientation and comparison, not for
          engineering, procurement or investment decisions. Our full approach is described in the{" "}
          <Link to="/research-methodology" className="link">research methodology</Link>.
        </p>
      </PolicySection>

      <PolicySection id="uncertainty" title="7. Uncertainty and labelling">
        <ul>
          <li><strong>Reported</strong> — sourced from a named publisher or primary document.</li>
          <li><strong>Estimated</strong> — produced by our own model, with inputs and assumptions shown.</li>
          <li><strong>Scenario</strong> — a hypothetical projection, not a forecast.</li>
          <li><strong>AI-assisted</strong> — drafted or summarised with AI support and checked by a human.</li>
        </ul>
        <p>
          Ranges are preferred to single numbers where the underlying evidence is uncertain, and we do not round
          an estimate into a headline it cannot support.
        </p>
      </PolicySection>

      <PolicySection id="right-of-reply" title="8. Right of reply">
        <p>
          If we make a specific critical claim about a named organisation, we will put it to them and include their
          response, or note that they were approached and did not respond by the time of publication. Any
          organisation named on this site can request a right of reply at any time.
        </p>
      </PolicySection>

      <PolicySection id="complaints" title="9. Complaints and corrections">
        <p>
          We correct errors quickly and visibly. Every published correction is logged under our{" "}
          <Link to="/corrections" className="link">corrections policy</Link>. If you believe a page breaches these
          standards, email <a className="link" href="mailto:info@aienergyintelligence.co.uk">info@aienergyintelligence.co.uk</a>{" "}
          with the URL and the specific claim in question.
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
