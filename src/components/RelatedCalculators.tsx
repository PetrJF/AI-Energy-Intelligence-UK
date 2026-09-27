import { Link } from "@tanstack/react-router";
import { ArrowRight, Calculator as CalcIcon } from "lucide-react";
import { pickRelatedCalculators } from "@/data/calculators";

export type RelatedCalculatorsProps = {
  text?: string;
  topics?: string[];
  excludeSlugs?: string[];
  limit?: number;
  eyebrow?: string;
  title?: string;
  intro?: string;
  className?: string;
};

export function RelatedCalculators({
  text = "",
  topics = [],
  excludeSlugs = [],
  limit = 3,
  eyebrow = "Try the numbers yourself",
  title = "Related calculators",
  intro = "Free interactive tools from AI Energy Intelligence UK — no signup required.",
  className = "",
}: RelatedCalculatorsProps) {
  const items = pickRelatedCalculators({ text, topics, excludeSlugs, limit });
  if (items.length === 0) return null;

  return (
    <section
      className={`not-prose mt-12 rounded-2xl border border-border bg-gradient-to-br from-accent/40 to-background p-6 sm:p-8 ${className}`}
      aria-labelledby="related-calculators-heading"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-brand">{eyebrow}</p>
      <h2
        id="related-calculators-heading"
        className="mt-1 font-display text-2xl font-bold tracking-tight"
      >
        {title}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">{intro}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <Link
            key={c.slug}
            to={c.path}
            className="group flex h-full flex-col rounded-xl border border-border bg-background p-5 transition hover:border-brand hover:shadow-md"
          >
            <div className="flex items-center gap-2 text-brand">
              <CalcIcon className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Calculator</span>
            </div>
            <h3 className="mt-2 font-semibold leading-snug text-foreground">{c.title}</h3>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{c.description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
              Open calculator
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
