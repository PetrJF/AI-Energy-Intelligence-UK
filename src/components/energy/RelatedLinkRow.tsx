import { Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { RelatedLink } from "./relatedLinks";

/**
 * Single related-links row used by Tier 1/2/3 tool pages.
 * Renders internal routes as TanStack <Link> (preserves SPA nav + preloading)
 * and external references as <a target="_blank">. Optional description gives
 * extra SEO context under the title.
 */
export function RelatedLinkRow({ link }: { link: RelatedLink }) {
  const inner = (
    <>
      {link.internal ? (
        <ArrowRight className="h-4 w-4 text-electric shrink-0" />
      ) : (
        <ExternalLink className="h-4 w-4 text-electric shrink-0" />
      )}
      <span className="font-semibold text-energy-ink">{link.label}:</span>
      <span className="text-electric underline-offset-2 hover:underline">{link.title}</span>
    </>
  );

  const cls =
    "flex flex-wrap items-center gap-2 rounded-lg bg-white p-3 border border-black/5 hover:border-electric/40 transition-colors";

  return (
    <li>
      {link.internal ? (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <Link to={link.href as any} className={cls}>
          {inner}
        </Link>
      ) : (
        <a href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>
          {inner}
        </a>
      )}
      {link.description ? (
        <p className="mt-1 pl-3 text-sm text-energy-ink/70">{link.description}</p>
      ) : null}
    </li>
  );
}
