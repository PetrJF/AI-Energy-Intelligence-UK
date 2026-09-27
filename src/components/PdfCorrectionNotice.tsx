import { Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { formatDate } from "@/data/reports";
import { cn } from "@/lib/utils";

/**
 * Shown next to a report's PDF download when the report has a logged correction.
 * Driven purely by the presence of `correctionNote`, so it needs no manual upkeep.
 */
export function PdfCorrectionNotice({
  publishedAt,
  tone = "light",
  className,
}: {
  publishedAt?: string | null;
  tone?: "light" | "dark";
  className?: string;
}) {
  const edition = publishedAt ? formatDate(publishedAt) : "published";

  return (
    <p
      className={cn(
        "flex items-start gap-2 rounded-md border px-3 py-2 text-xs leading-relaxed",
        tone === "dark"
          ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
          : "border-amber-500/30 bg-amber-500/10 text-amber-800",
        className,
      )}
    >
      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>
        This PDF reflects the original {edition} edition and does not include corrections made since — see the{" "}
        <Link
          to="/corrections"
          className={cn(
            "font-medium underline underline-offset-2",
            tone === "dark" ? "decoration-amber-200/60 hover:text-amber-50" : "decoration-amber-600/50 hover:text-amber-900",
          )}
        >
          corrections log
        </Link>{" "}
        for what&apos;s changed.
      </span>
    </p>
  );
}
