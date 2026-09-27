import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

function parseDateOnly(value: string | null | undefined) {
  if (!value) return null;
  const datePart = value.slice(0, 10);
  const date = new Date(`${datePart}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function todayUtc() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function formatDate(value: string | null | undefined) {
  const date = parseDateOnly(value);
  return date?.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }) ?? null;
}

export function IndexReviewStatus({
  nextReviewAt,
  className,
}: {
  nextReviewAt: string | null | undefined;
  className?: string;
}) {
  const reviewDate = parseDateOnly(nextReviewAt);
  if (!reviewDate) return null;

  const overdue = todayUtc().getTime() > reviewDate.getTime();
  if (overdue) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400",
          className,
        )}
      >
        <AlertTriangle className="h-3 w-3" aria-hidden="true" />
        Recheck due
      </span>
    );
  }

  return (
    <span className={cn("text-xs text-muted-foreground", className)}>
      Next review: {formatDate(nextReviewAt)}
    </span>
  );
}

export function ReportVerificationStatus({
  lastVerified,
  reviewWindowDays = 365,
}: {
  lastVerified: string | null | undefined;
  reviewWindowDays?: number;
}) {
  const verifiedDate = parseDateOnly(lastVerified);
  const verifiedLabel = formatDate(lastVerified);
  const dueAt = verifiedDate
    ? new Date(verifiedDate.getTime() + reviewWindowDays * 24 * 60 * 60 * 1000)
    : null;
  const overdue = dueAt ? todayUtc().getTime() > dueAt.getTime() : false;

  if (overdue) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
        <AlertTriangle className="h-3 w-3" aria-hidden="true" />
        Recheck due
      </span>
    );
  }

  return (
    <span>
      Last verified: <span className="text-foreground">{verifiedLabel ?? "Not recorded"}</span>
    </span>
  );
}