import { cn } from "@/lib/utils";

/**
 * Programmatic, branded portrait report cover (A4 proportions).
 * Rendered from the report's real title, category and date — no invented data,
 * no manufactured artwork. Used wherever a report is listed or previewed.
 */

const CATEGORY_STYLE: Record<string, { from: string; to: string; accent: string; label: string }> = {
  "ai-energy": { from: "#0b1b33", to: "#123a5c", accent: "#38bdf8", label: "AI & Energy" },
  "data-centres": { from: "#0d1b2a", to: "#1b3a4b", accent: "#22d3ee", label: "Data Centres" },
  "electricity-demand": { from: "#0a1f2b", to: "#12463f", accent: "#34d399", label: "Electricity Demand" },
  infrastructure: { from: "#101a2e", to: "#2a3a55", accent: "#7dd3fc", label: "Infrastructure" },
  "business-ai": { from: "#111827", to: "#312e4e", accent: "#a5b4fc", label: "Business AI" },
  "cyber-security": { from: "#1a1120", to: "#3b1f33", accent: "#f0abfc", label: "Cyber Security" },
  "government-policy": { from: "#0f1b1a", to: "#1f3c37", accent: "#5eead4", label: "Government & Policy" },
};

const DEFAULT_STYLE = { from: "#0b1b33", to: "#1e3a5f", accent: "#38bdf8", label: "Research" };

type Props = {
  title: string;
  category?: string | null;
  categoryLabel?: string | null;
  publishedAt?: string | null;
  version?: string | null;
  tier?: "free" | "premium";
  /** "sm" renders tighter type for thumbnail-sized covers. */
  size?: "sm" | "md";
  className?: string;
};

export function ReportCover({
  title,
  category,
  categoryLabel,
  publishedAt,
  version,
  tier,
  size = "md",
  className,
}: Props) {
  const style = (category && CATEGORY_STYLE[category]) || DEFAULT_STYLE;
  const label = categoryLabel ?? style.label;
  const year = publishedAt ? new Date(publishedAt).getFullYear() : null;

  return (
    <div
      className={cn(
        "relative flex aspect-[210/297] w-full flex-col justify-between overflow-hidden rounded-lg border border-border text-white",
        size === "sm" ? "p-3" : "p-5",
        className,
      )}
      style={{ background: `linear-gradient(160deg, ${style.from} 0%, ${style.to} 100%)` }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="relative">
        <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/70">
          AI Energy Intelligence UK
        </div>
        <div className="mt-1 h-px w-10" style={{ background: style.accent }} />
      </div>

      <div className="relative">
        <div
          className="text-[10px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: style.accent }}
        >
          {label}
        </div>
        <h3
          className={cn(
            "mt-2 line-clamp-5 font-display font-bold leading-snug text-balance",
            size === "sm" ? "text-[11px]" : "text-[13px] sm:text-sm",
          )}
        >
          {title}
        </h3>

      </div>

      <div className="relative flex items-end justify-between text-[10px] text-white/70">
        <span>
          {[year, version].filter(Boolean).join(" · ")}
        </span>
        {tier && (
          <span className="rounded-sm border border-white/25 px-1.5 py-0.5 uppercase tracking-wider">
            {tier === "free" ? "Free" : "Premium"}
          </span>
        )}
      </div>
    </div>
  );
}
