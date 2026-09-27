import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { ReportVerificationStatus } from "@/components/ReviewStatus";

export function AboutThisData({
  lastVerified,
  showByline = true,
  reviewWindowDays,
}: {
  lastVerified?: string | null;
  showByline?: boolean;
  reviewWindowDays?: number;
}) {
  return (
    <aside
      aria-labelledby="about-this-data"
      className="my-10 rounded-xl border border-border bg-surface p-5 sm:p-6 text-sm"
    >
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-brand" />
        <h2 id="about-this-data" className="text-base font-semibold text-foreground">
          About this data
        </h2>
      </div>
      {showByline && (
        <p className="mt-3 text-foreground/90">
          By{" "}
          <Link to="/editorial-team" className="font-medium text-brand hover:underline">
            Peter Flynn, Editor
          </Link>
        </p>
      )}
      <p className="mt-3 leading-relaxed text-muted-foreground">
        Our figures are built to be reproducible from the stated inputs, with assumptions shown rather than
        buried. Where evidence is contested we give conservative ranges instead of the most dramatic number, and
        where public data does not exist we say so rather than filling the gap.{" "}
        <Link to="/research-methodology" className="inline-flex items-center gap-1 font-medium text-brand hover:underline">
          Full methodology <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </p>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-3 text-xs text-muted-foreground">
        <ReportVerificationStatus lastVerified={lastVerified} reviewWindowDays={reviewWindowDays} />
        <Link to="/corrections" className="text-brand hover:underline">
          Corrections policy
        </Link>
      </div>
    </aside>
  );
}
