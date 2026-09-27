// Citation and sharing block for the UK AI Energy Index and its sub-indices.
// The citation is built from the published edition and methodology version —
// nothing is invented when either is missing.

import { useState } from "react";
import { Check, Copy, Link2 } from "lucide-react";

function todayUk() {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function buildCitation({
  title,
  edition,
  version,
  url,
}: {
  title: string;
  edition?: string | null;
  version?: string | null;
  url: string;
}) {
  const parts = [
    "AI Energy Intelligence",
    title,
    edition ? edition : null,
    version ? `version ${version}` : null,
    `accessed ${todayUk()}`,
  ].filter(Boolean);
  return `${parts.join(", ")}. ${url}`;
}

export function IndexCitation({
  title,
  edition,
  version,
  url,
}: {
  title: string;
  edition?: string | null;
  version?: string | null;
  url: string;
}) {
  const [copied, setCopied] = useState<"citation" | "link" | null>(null);
  const citation = buildCitation({ title, edition, version, url });

  async function copy(text: string, which: "citation" | "link") {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  }

  const shareText = encodeURIComponent(title);
  const shareUrl = encodeURIComponent(url);

  return (
    <section className="rounded-xl border border-border bg-card p-5" aria-labelledby="cite-heading">
      <h2 id="cite-heading" className="font-display text-lg font-semibold">
        Cite or share this index
      </h2>
      <p className="mt-2 rounded-lg border border-border bg-surface p-3 text-sm leading-relaxed text-muted-foreground">
        {citation}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => copy(citation, "citation")}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-secondary"
        >
          {copied === "citation" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied === "citation" ? "Citation copied" : "Copy citation"}
        </button>
        <button
          type="button"
          onClick={() => copy(url, "link")}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-secondary"
        >
          {copied === "link" ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
          {copied === "link" ? "Link copied" : "Copy link"}
        </button>
        <a
          href={`https://x.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-secondary"
        >
          Share on X
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-secondary"
        >
          Share on LinkedIn
        </a>
      </div>
    </section>
  );
}
