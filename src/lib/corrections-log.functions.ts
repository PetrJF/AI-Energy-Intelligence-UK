import { createServerFn } from "@tanstack/react-start";
import { REPORTS } from "@/data/reports";

export type CorrectionEntry = {
  key: string;
  date: string; // ISO
  kind: string;
  summary: string;
  previousValue: string | null;
  newValue: string | null;
  reason: string | null;
  href: string | null;
  linkLabel: string | null;
  source: "index" | "report";
};

function indexLink(entityType: string | null): { href: string; label: string } {
  if (entityType === "grid_assessment" || entityType === "grid_evidence")
    return { href: "/uk-ai-energy-index/grid-pressure", label: "Grid Pressure sub-index" };
  return { href: "/uk-ai-energy-index", label: "UK AI Energy Index" };
}

const FIELD_LABELS: Record<string, string> = {
  status_label: "Status updated",
  value: "Value revised",
  record: "Record added",
};
function humanise(field: string | null, entity: string | null): string {
  if (field && FIELD_LABELS[field]) return FIELD_LABELS[field];
  if (field && !field.includes("_")) return field;
  if (field) return field.replace(/_/g, " ").replace(/^./, (m) => m.toUpperCase());
  return entity ? `${entity.replace(/_/g, " ")} updated` : "Update";
}

const norm = (v: string | null | undefined) => (v ?? "").trim().toLowerCase();

export const getRecentCorrections = createServerFn({ method: "GET" }).handler(async () => {
  const entries: CorrectionEntry[] = [];

  try {
    const { getPublicSupabase } = await import("./supabase-public.server");
    const sb = getPublicSupabase();
    const [rev, log] = await Promise.all([
      sb
        .from("index_revisions")
        .select("id, revised_at, entity_type, change_type, summary, previous_value, new_value, reason")
        .eq("is_public", true)
        .order("revised_at", { ascending: false })
        .limit(100),
      sb
        .from("index_change_log")
        .select("id, created_at, entity_type, field_name, previous_value, new_value, reason")
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(100),
    ]);

    const revRows = rev.data ?? [];
    for (const r of revRows) {
      const l = indexLink(r.entity_type);
      entries.push({
        key: `rev-${r.id}`,
        date: r.revised_at,
        kind: r.change_type,
        summary: r.summary,
        previousValue: r.previous_value,
        newValue: r.new_value,
        reason: r.reason,
        href: l.href,
        linkLabel: l.label,
        source: "index",
      });
    }

    for (const c of log.data ?? []) {
      // Skip change-log rows already recorded as a revision (same day, same before/after values).
      const day = c.created_at.slice(0, 10);
      const dup = revRows.some(
        (r) =>
          r.revised_at.slice(0, 10) === day &&
          norm(r.previous_value) === norm(c.previous_value) &&
          (norm(r.new_value) === norm(c.new_value) ||
            (!!r.new_value && norm(c.new_value).startsWith(norm(r.new_value)))) &&
          (c.previous_value || c.new_value),
      );
      if (dup) continue;
      const l = indexLink(c.entity_type);
      entries.push({
        key: `log-${c.id}`,
        date: c.created_at,
        kind: humanise(c.field_name, c.entity_type),
        summary: c.reason ?? humanise(c.field_name, c.entity_type),
        previousValue: c.previous_value,
        newValue: c.new_value,
        reason: c.reason,
        href: l.href,
        linkLabel: l.label,
        source: "index",
      });
    }
  } catch (e) {
    console.error("getRecentCorrections: index log unavailable", e);
  }

  for (const r of REPORTS) {
    if (!r.correctionNote) continue;
    entries.push({
      key: `report-${r.slug}`,
      date: r.correctionNote.date,
      kind: "correction",
      summary: `Correction to report: ${r.title}`,
      previousValue: null,
      newValue: null,
      reason: r.correctionNote.text,
      href: `/reports/${r.slug}`,
      linkLabel: r.title,
      source: "report",
    });
  }

  entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return entries;
});
