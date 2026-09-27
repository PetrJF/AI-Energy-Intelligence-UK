import { Link } from "@tanstack/react-router";
import { ArrowRight, FileText, Lock } from "lucide-react";
import { REPORTS, type CategorySlug, type Report } from "@/data/reports";

export type RelatedReportsProps = {
  /** Preferred report categories, in priority order. */
  categories?: CategorySlug[];
  /** Optional topic tags to boost relevance. */
  topics?: string[];
  /** Slugs to exclude (e.g. the current report). */
  excludeSlugs?: string[];
  limit?: number;
  eyebrow?: string;
  title?: string;
  intro?: string;
  /** Visual variant: "light" for white/card surfaces, "dark" for hub dark backgrounds. */
  variant?: "light" | "dark";
  className?: string;
};

function scoreReport(r: Report, categories: CategorySlug[], topics: string[]): number {
  let score = 0;
  const catIdx = categories.indexOf(r.category);
  if (catIdx !== -1) score += 100 - catIdx * 10;
  for (const t of topics) if (r.topics.includes(t)) score += 5;
  // Small recency boost
  const days = (Date.now() - new Date(r.publishedAt ?? 0).getTime()) / (1000 * 60 * 60 * 24);
  score += Math.max(0, 30 - days / 30);
  return score;
}

export function pickRelatedReports({
  categories = [],
  topics = [],
  excludeSlugs = [],
  limit = 3,
}: Pick<RelatedReportsProps, "categories" | "topics" | "excludeSlugs" | "limit">): Report[] {
  const pool = REPORTS.filter((r) => !excludeSlugs.includes(r.slug));
  const ranked = [...pool].sort(
    (a, b) => scoreReport(b, categories, topics) - scoreReport(a, categories, topics),
  );
  return ranked.slice(0, limit);
}

export function RelatedReports({
  categories = [],
  topics = [],
  excludeSlugs = [],
  limit = 3,
  eyebrow = "Reports & Research",
  title = "Recommended reports",
  intro = "Deeper analysis from the AI Energy Intelligence UK research library.",
  variant = "light",
  className = "",
}: RelatedReportsProps) {
  const items = pickRelatedReports({ categories, topics, excludeSlugs, limit });
  if (items.length === 0) return null;

  const isDark = variant === "dark";
  const surface = isDark
    ? "bg-energy-card text-energy-ink"
    : "bg-surface text-foreground border border-border";

  return (
    <section className={`rounded-2xl p-6 md:p-8 ${surface} ${className}`}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-brand">{eyebrow}</div>
          <h3 className="mt-1 font-display text-xl md:text-2xl font-bold">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl">{intro}</p>
        </div>
        <Link
          to="/reports"
          search={{ category: "all", tier: "all", sort: "newest", topic: "all" }}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
        >
          Browse all reports <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {items.map((r) => (
          <Link
            key={r.slug}
            to="/reports/$slug"
            params={{ slug: r.slug }}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card hover:shadow-elegant hover:-translate-y-0.5 transition-all"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-muted">
              <img
                src={r.cover}
                alt={r.title}
                className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground">
                {r.tier === "premium" ? <Lock className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                {r.tier}
              </div>
            </div>
            <div className="flex flex-1 flex-col p-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {r.category.replace(/-/g, " ")} · {r.pages} pages
              </div>
              <div className="mt-1.5 font-display font-bold leading-snug line-clamp-2 text-foreground">
                {r.title}
              </div>
              <p className="mt-2 flex-1 text-sm text-muted-foreground line-clamp-3">{r.summary}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand">
                {r.tier === "premium" ? "Preview report" : "Read the report"}
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/** Map a tool path prefix to preferred report categories. */
export function categoriesForToolPath(path: string): CategorySlug[] {
  if (path.startsWith("/business")) return ["business-ai", "ai-energy"];
  if (path.startsWith("/infrastructure") || path.startsWith("/ai-infrastructure-tools"))
    return ["infrastructure", "data-centres", "electricity-demand"];
  if (path.startsWith("/data-centres")) return ["data-centres", "infrastructure"];
  if (path.startsWith("/uk-grid")) return ["electricity-demand", "infrastructure"];
  if (path.startsWith("/future-scenarios")) return ["electricity-demand", "government-policy"];
  if (path.startsWith("/energy-cost")) return ["ai-energy", "electricity-demand"];
  return ["ai-energy"];
}

/** Map free-form news / article category strings to report categories. */
export function categoriesForNews(newsCategories: string[]): CategorySlug[] {
  const out = new Set<CategorySlug>();
  for (const raw of newsCategories) {
    const c = raw.toLowerCase();
    if (c.includes("data centre") || c.includes("data center")) out.add("data-centres");
    if (c.includes("grid") || c.includes("transmission") || c.includes("network")) out.add("infrastructure");
    if (c.includes("demand") || c.includes("electricity")) out.add("electricity-demand");
    if (c.includes("business") || c.includes("enterprise") || c.includes("roi")) out.add("business-ai");
    if (c.includes("cyber") || c.includes("security")) out.add("cyber-security");
    if (c.includes("policy") || c.includes("government") || c.includes("regulat")) out.add("government-policy");
    if (c.includes("ai") || c.includes("energy") || c.includes("carbon") || c.includes("water"))
      out.add("ai-energy");
  }
  if (out.size === 0) out.add("ai-energy");
  return Array.from(out);
}
