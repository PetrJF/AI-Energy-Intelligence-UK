// Detailed explanation behind a regional grid-pressure rating: why it was
// assigned, the evidence used, limitations, dates and the original sources.

import { ExternalLink } from "lucide-react";
import {
  CONFIDENCE_LABELS,
  CONSTRAINT_TYPE_LABELS,
  NETWORK_LEVEL_LABELS,
  NOT_AVAILABLE,
  fmtDate,
  regionName,
} from "@/lib/index-sections";
import { PressureBadge } from "@/components/index/IndexSectionUI";

// Whether a finding is something measured, estimated, projected or merely planned.
const EVIDENCE_NATURE_LABELS: Record<string, string> = {
  observation: "Observation",
  estimate: "Estimate",
  forecast: "Forecast",
  planned_project: "Planned project",
  not_established: "Nature not established",
};
import type {
  AssessmentEvidenceLink,
  GridEvidence,
  GridRating,
  IndexSource,
} from "@/lib/index-sections.functions";

export function GridEvidencePanel({
  regionSlug,
  assessment,
  evidence,
  links,
  sources,
}: {
  regionSlug: string;
  assessment: GridRating | undefined;
  evidence: GridEvidence[];
  links: AssessmentEvidenceLink[];
  sources: IndexSource[];
}) {
  // Evidence is shown whether or not a rating has been assigned: collecting
  // evidence for a region comes first, and a rating may never follow.
  const linked = assessment
    ? evidence.filter((e) =>
        links.some((l) => l.assessment_id === assessment.id && l.evidence_id === e.id),
      )
    : [];
  const supporting =
    linked.length > 0 ? linked : evidence.filter((e) => e.region_slug === regionSlug);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">{regionName(regionSlug)}</h3>
        <PressureBadge rating={assessment?.rating ?? "insufficient_evidence"} />
      </div>

      <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
        <div className="sm:col-span-2">
          <dt className="font-medium">Why this rating was assigned</dt>
          <dd className="mt-1 text-muted-foreground">
            {assessment?.rationale ??
              `No assessment has been published for this region. ${NOT_AVAILABLE}.`}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="font-medium">Important limitations</dt>
          <dd className="mt-1 text-muted-foreground">
            {assessment?.limitations ?? "No limitations have been recorded for this assessment yet."}
          </dd>
        </div>
        <div>
          <dt className="font-medium">Evidence confidence</dt>
          <dd className="mt-1 text-muted-foreground">
            {CONFIDENCE_LABELS[assessment?.evidence_confidence ?? ""] ?? "Not assessed"}
          </dd>
        </div>
        <div>
          <dt className="font-medium">Methodology version</dt>
          <dd className="mt-1 text-muted-foreground">{assessment?.methodology_version ?? "—"}</dd>
        </div>
        <div>
          <dt className="font-medium">Date assessed</dt>
          <dd className="mt-1 text-muted-foreground">
            {fmtDate(assessment?.assessment_date ?? assessment?.last_reviewed_at) ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="font-medium">Next review date</dt>
          <dd className="mt-1 text-muted-foreground">{fmtDate(assessment?.next_review_at) ?? "—"}</dd>
        </div>
      </dl>

      <h4 className="mt-6 text-sm font-semibold">Evidence collected</h4>
      {supporting.length === 0 ? (
        <p className="mt-2 text-sm italic text-muted-foreground">
          No published evidence records have been collected for this region yet. A rating other than
          &ldquo;Insufficient evidence&rdquo; cannot be published until at least two independent
          records exist for the same geography and period.
        </p>
      ) : (
        <ul className="mt-2 space-y-3">
          {supporting.map((e) => {
            const source = sources.find((s) => s.id === e.source_id);
            return (
              <li key={e.id} className="rounded-lg border border-border p-4 text-sm">
                <p className="font-medium">{e.title}</p>
                {e.local_area ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Area covered: {e.local_area}
                  </p>
                ) : null}
                <p className="mt-1 text-muted-foreground">{e.description}</p>
                {e.limitations ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">What this does not show: </span>
                    {e.limitations}
                  </p>
                ) : null}
                <p className="mt-2 text-xs text-muted-foreground">
                  {EVIDENCE_NATURE_LABELS[e.evidence_nature] ?? "Nature not established"}
                  {e.source_section ? ` · ${e.source_section}` : ""} &middot;{" "}
                  {NETWORK_LEVEL_LABELS[e.network_level] ?? e.network_level} &middot;{" "}
                  {CONSTRAINT_TYPE_LABELS[e.constraint_type] ?? e.constraint_type}
                  {e.network_operator ? ` · ${e.network_operator}` : ""}
                  {e.relevant_period ? ` · ${e.relevant_period}` : ""}
                  {` · Confidence: ${CONFIDENCE_LABELS[e.confidence_level] ?? e.confidence_level}`}
                </p>
                {source ? (
                  <p className="mt-2 text-xs">
                    {source.url ? (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-brand hover:underline"
                      >
                        {source.organisation} &mdash; {source.title}
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </a>
                    ) : (
                      `${source.organisation} — ${source.title}`
                    )}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
