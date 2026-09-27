// Single subscription CTA for the UK AI Energy Index, reused on the homepage,
// the index, its sub-indices, related analysis and reports. Wraps the existing
// lead-capture plumbing — no new email system.

import { LeadCapture } from "@/components/LeadCapture";

export function IndexUpdatesCTA({
  context = "uk-ai-energy-index",
  compact = false,
}: {
  context?: string;
  compact?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h2 className="font-display text-lg font-semibold">Get UK AI Energy Index updates</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Emails cover new index editions, material indicator changes, significant data-centre and
        grid developments, and updates to the methodology or source register.
      </p>
      <div className="mt-4">
        <LeadCapture
          variant="newsletter"
          source="energy-index"
          context={context}
          compact={compact}
          title="Get UK AI Energy Index updates"
          subtitle="New editions, indicator changes and methodology updates."
        />
      </div>
    </div>
  );
}
