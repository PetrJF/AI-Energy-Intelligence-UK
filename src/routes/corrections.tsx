import { createFileRoute, Link } from "@tanstack/react-router";
import { PolicyPage, PolicySection, policyHead } from "@/components/PolicyPage";
import { CorrectionForm } from "@/components/index/CorrectionForm";
import { getRecentCorrections, type CorrectionEntry } from "@/lib/corrections-log.functions";

const SECTIONS = [
  { id: "commitment", label: "Our commitment" },
  { id: "types", label: "Types of change" },
  { id: "how-to-report", label: "How to report an error" },
  { id: "correction-form", label: "Submit a correction" },
  { id: "response", label: "What happens next" },
  { id: "labelling", label: "How corrections appear" },
  { id: "recent-corrections", label: "Recent corrections" },
  { id: "takedowns", label: "Takedowns & unpublishing" },
  { id: "news", label: "Third-party news items" },
  { id: "escalation", label: "If you are not satisfied" },
];

export const Route = createFileRoute("/corrections")({
  head: () =>
    policyHead({
      title: "Corrections Policy — AI Energy Intelligence UK",
      description:
        "How to report an error on AI Energy Intelligence UK, how quickly we respond, and how corrections, clarifications and updates are labelled on the page.",
      path: "/corrections",
    }),
  loader: () => getRecentCorrections(),
  errorComponent: () => <p className="p-8">This page could not be loaded. Please try again.</p>,
  notFoundComponent: () => <p className="p-8">Not found.</p>,
  component: Corrections,
});

const KIND_LABELS: Record<string, string> = { correction: "Correction", created: "New edition" };

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

function CorrectionLog({ entries }: { entries: CorrectionEntry[] }) {
  if (entries.length === 0) return <p>No public corrections have been logged yet.</p>;
  return (
    <ol className="not-prose mt-5 divide-y divide-border border-y border-border">
      {entries.map((e) => (
        <li key={e.key} className="py-4">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <time dateTime={e.date} className="font-mono">{fmtDate(e.date)}</time>
            <span className="uppercase tracking-wide">{KIND_LABELS[e.kind] ?? e.kind}</span>
            <span>· {e.source === "report" ? "Report" : "Index"}</span>
          </div>
          <p className="mt-1 font-medium text-foreground">{e.summary}</p>
          {(e.previousValue || e.newValue) && (
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="line-through">{e.previousValue ?? "—"}</span>
              {" → "}
              <span className="text-foreground">{e.newValue ?? "—"}</span>
            </p>
          )}
          {e.reason && e.reason !== e.summary && (
            <p className="mt-1 text-sm text-muted-foreground">{e.reason}</p>
          )}
          {e.href && (
            <a href={e.href} className="link mt-1 inline-block text-sm">
              {e.linkLabel ?? "View page"} →
            </a>
          )}
        </li>
      ))}
    </ol>
  );
}

function Corrections() {
  const entries = Route.useLoaderData();
  return (
    <PolicyPage
      eyebrow="Trust"
      title="Corrections Policy"
      intro="We publish numbers. Numbers can be wrong. This page explains how to tell us, what we do about it, and how the change is shown to readers."
      updated="24 September 2026"
      badge="Errors fixed openly, not quietly"
      sections={SECTIONS}
    >
      <PolicySection id="commitment" title="1. Our commitment">
        <p>
          When we get something wrong we fix it promptly and say what changed. We do not silently edit a factual
          claim out of a published page, and we do not delete a page to make an error disappear.
        </p>
      </PolicySection>

      <PolicySection id="types" title="2. Types of change">
        <ul>
          <li>
            <strong>Correction</strong> — a factual error (a wrong figure, name, date, unit or attribution). The
            text is fixed and a dated correction note is added to the page.
          </li>
          <li>
            <strong>Clarification</strong> — the facts were right but the wording was open to being misread. The
            wording is sharpened and a note explains the change.
          </li>
          <li>
            <strong>Update</strong> — new information has emerged, or a source has revised its own figures. The
            page is updated and the revision date changes.
          </li>
          <li>
            <strong>Model revision</strong> — an assumption or default value inside a calculator or report changes.
            We record the old value, the new value and the reason.
          </li>
          <li>
            <strong>Typographical fix</strong> — spelling, formatting or broken links. These are made without a
            note, provided no factual meaning changes.
          </li>
        </ul>
      </PolicySection>

      <PolicySection id="how-to-report" title="3. How to report an error">
        <p>
          Email <a className="link" href="mailto:info@aienergyintelligence.co.uk">info@aienergyintelligence.co.uk</a>{" "}
          with the subject line <strong>Correction</strong>, or use the{" "}
          <Link to="/contact" className="link">contact form</Link>. Please include:
        </p>
        <ul>
          <li>the page URL;</li>
          <li>the exact sentence, figure or calculator output you believe is wrong;</li>
          <li>what you believe the correct position is;</li>
          <li>a source, if you have one.</li>
        </ul>
        <p>You do not need to give a reason for your interest, and anyone can report an error.</p>
      </PolicySection>

      <PolicySection id="correction-form" title="4. Submit a correction">
        <p>
          You can send a correction directly using the form below. It reaches our review queue; it
          does not change anything published on the site by itself.
        </p>
        <div className="not-prose mt-5">
          <CorrectionForm />
        </div>
      </PolicySection>

      <PolicySection id="response" title="5. What happens next">
        <ul>
          <li>We acknowledge correction requests within <strong>2 working days</strong>.</li>
          <li>
            Clear factual errors are corrected within <strong>5 working days</strong> of being verified — usually
            much sooner.
          </li>
          <li>
            Disputed or complex points (contested modelling assumptions, for example) take longer; we will tell you
            our expected timescale and keep you updated.
          </li>
          <li>
            If we conclude the page is accurate, we will explain why and, where relevant, add a clarification so
            other readers do not hit the same ambiguity.
          </li>
        </ul>
      </PolicySection>

      <PolicySection id="labelling" title="6. How corrections appear on the page">
        <p>
          Corrections and clarifications are shown in a dated note at the foot of the affected article or report,
          stating what was previously published and what it now says. Where the error was significant enough to
          change the headline conclusion, the note goes at the top instead.
        </p>
      </PolicySection>

      <PolicySection id="recent-corrections" title="7. Recent corrections">
        <p>
          A dated log of corrections and revisions to our published reports and to the UK AI Energy Index, most
          recent first. Index entries are drawn directly from the Index's public revision history.
        </p>
        <CorrectionLog entries={entries} />
      </PolicySection>

      <PolicySection id="takedowns" title="8. Takedowns and unpublishing">
        <p>
          We only unpublish a page where there is a legal requirement, a serious privacy or safety risk, or where a
          piece is so wrong that correcting it is not possible. In those cases the URL is retained with a short
          note explaining that the content was withdrawn and why.
        </p>
      </PolicySection>

      <PolicySection id="news" title="9. Third-party news items">
        <p>
          Items in our <Link to="/news" className="link">news section</Link> summarise and link to reporting
          published elsewhere. If the original publisher corrects or retracts a story, tell us and we will update
          or remove our summary. Corrections to the original article itself must be raised with that publisher.
        </p>
      </PolicySection>

      <PolicySection id="escalation" title="10. If you are not satisfied">
        <p>
          Reply to our response setting out why you disagree. Your complaint will be reviewed again by the editor,
          who has final responsibility for published content — see the{" "}
          <Link to="/editorial-team" className="link">editorial team</Link> page. Our wider publishing rules are set
          out in our <Link to="/editorial-standards" className="link">editorial standards</Link>.
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
