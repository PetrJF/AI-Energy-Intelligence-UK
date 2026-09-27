import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: string;
  intro?: string;
  action?: { to: string; label: string; params?: Record<string, string> };
  children?: ReactNode;
};

export function SectionHeading({ eyebrow, title, intro, action, children }: Props) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">{eyebrow}</div>
        <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
        {intro && <p className="mt-3 text-muted-foreground">{intro}</p>}
      </div>
      {action && (
        <Link
          to={action.to}
          params={action.params as never}
          className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2.5 text-sm font-semibold transition hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {action.label} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
      {children}
    </div>
  );
}
