// Visible breadcrumb trail plus a matching schema.org BreadcrumbList
// helper, so the rendered page and the structured data always agree.

import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export const SITE_ORIGIN = "https://aienergyintelligence.co.uk";

export type Crumb = {
  /** Label shown to readers and used in the BreadcrumbList. */
  label: string;
  /** Absolute site path. Omit on the final crumb (the current page). */
  to?: string;
};

/** Builds the JSON-LD BreadcrumbList for a trail, including the current page. */
export function breadcrumbJsonLd(crumbs: Crumb[], currentPath: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: `${SITE_ORIGIN}${c.to ?? currentPath}`,
    })),
  };
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />}
              {isLast || !item.to ? (
                <span aria-current="page" className="font-medium text-foreground">
                  {item.label}
                </span>
              ) : (
                <Link to={item.to} className="hover:text-foreground hover:underline">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
