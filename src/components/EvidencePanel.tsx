// Shown at the foot of every article. Ties the piece back to the measured
// evidence base: the UK AI Energy Index, the Data Centre Tracker and how we work.

import { Link } from "@tanstack/react-router";
import { ArrowRight, Gauge } from "lucide-react";
import { SUBINDEX_META, SUBINDEX_SLUGS } from "@/lib/index-sections";

type EvidenceLink = { to: string; name: string; note: string };

export function EvidencePanel({
  variant = "analysis",
}: {
  variant?: "analysis" | "story";
}) {
  const heading =
    variant === "story" ? "Evidence behind this story" : "Evidence behind this analysis";

  const links: EvidenceLink[] = [
    ...SUBINDEX_SLUGS.map((slug) => ({
      to: SUBINDEX_META[slug].path,
      name: SUBINDEX_META[slug].name,
      note: "Sourced, dated figures",
    })),
    {
      to: "/uk-data-centre-tracker",
      name: "UK Data Centre Tracker",
      note: "Project-by-project register",
    },
    {
      to: "/research-methodology",
      name: "Research methodology",
      note: "How figures are gathered and checked",
    },
    {
      to: "/editorial-standards",
      name: "Editorial standards",
      note: "Sourcing, review and corrections",
    },
  ];

  return (
    <section
      className="mt-10 rounded-xl border border-border bg-surface p-6"
      aria-labelledby="evidence-panel-heading"
    >
      <div className="flex items-center gap-2 text-brand">
        <Gauge className="h-4 w-4" aria-hidden="true" />
        <span className="text-xs font-semibold uppercase tracking-[0.16em]">Evidence base</span>
      </div>
      <h2 id="evidence-panel-heading" className="mt-2 font-display text-lg font-semibold">
        {heading}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Our reporting sits on top of the UK AI Energy Index and Data Centre Tracker — a sourced,
        dated record of AI and data-centre electricity demand, data-centre development and grid
        pressure.
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((l) => (
          <li key={l.to}>
            <Link
              to={l.to}
              className="block h-full rounded-lg border border-border bg-card p-3 hover:border-brand"
            >
              <span className="block text-sm font-medium">{l.name}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{l.note}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
        <Link
          to="/uk-ai-energy-index"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
        >
          View the full index <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
        <Link to="/corrections" className="text-sm text-muted-foreground hover:text-foreground">
          Request a correction
        </Link>
      </div>
    </section>
  );
}
