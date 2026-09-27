// Calculated summary figures for the UK data-centre tracker.
//
// Every figure here is derived from published tracker records only. Capacity
// measures are never mixed: each total covers one measurement type, campus
// build-out figures are never added to their own phases, and records with no
// published figure are excluded from totals rather than counted as zero.

import {
  capacityFigures,
  isPhysicalFacility,
  type CapacityKind,
} from "@/lib/dc-projects";
import { geoGroupFor, type DcGeoGroup } from "@/lib/dc-geography";

/** Documented review interval. Records older than this are flagged for review;
 *  flagging never changes a record's verification date. */
export const REVIEW_INTERVAL_DAYS = 180;

type SummaryInput = {
  id: string;
  name: string;
  slug: string;
  status: string;
  project_type: string;
  region: string;
  town: string | null;
  local_authority: string | null;
  operator: string | null;
  developer: string | null;
  campus_name: string | null;
  planning_reference: string | null;
  last_verified_at: string | null;
  all_sources: { url: string }[];
  it_capacity_mw: number | null;
  grid_connection_mw: number | null;
  stated_electricity_demand_mw: number | null;
  campus_capacity_mw: number | null;
  capacity_mw: number | null;
  capacity_definition: string | null;
};

export const PIPELINE_STATUSES = ["under_construction", "approved", "planning_submitted", "proposed"];
export const CLOSED_STATUSES = ["withdrawn", "paused"];

export type CapacityTotal = {
  mw: number;
  records: number;
  of: number;
  /** Campuses where several phase records were collapsed to a single figure. */
  collapsed: string[];
};

/**
 * Totals one capacity measure, counting each campus once. Where several
 * records share a campus name the largest single published figure is used, so
 * a whole-campus figure and its individual phases can never be added together.
 */
export function capacitySum(projects: SummaryInput[], kind: CapacityKind): CapacityTotal {
  const groups = new Map<string, { label: string; values: number[] }>();
  for (const p of projects) {
    const f = capacityFigures(p).find((x) => x.kind === kind);
    if (!f) continue;
    const key = p.campus_name ? `campus:${p.campus_name.trim().toLowerCase()}` : `id:${p.id}`;
    const g = groups.get(key) ?? { label: p.campus_name ?? p.name, values: [] };
    g.values.push(f.mw);
    groups.set(key, g);
  }
  let mw = 0;
  let records = 0;
  const collapsed: string[] = [];
  for (const g of groups.values()) {
    mw += Math.max(...g.values);
    records += g.values.length;
    if (g.values.length > 1) collapsed.push(g.label);
  }
  return { mw, records, of: projects.length, collapsed };
}

export type StatusCounts = Record<string, number>;

export type TrackerSummary = {
  facilities: SummaryInput[];
  zones: number;
  total: number;
  byStatus: StatusCounts;
  operationalItLoad: CapacityTotal;
  operationalDemand: CapacityTotal;
  pipelineItLoadByStatus: { status: string; total: CapacityTotal }[];
  pipelineItLoad: CapacityTotal;
  noUsableCapacity: number;
  unspecifiedCapacity: number;
};

export function summarise(projects: SummaryInput[]): TrackerSummary {
  const facilities = projects.filter((p) => isPhysicalFacility(p.project_type));
  const byStatus: StatusCounts = {};
  for (const p of facilities) byStatus[p.status] = (byStatus[p.status] ?? 0) + 1;

  const operational = facilities.filter((p) => p.status === "operational");
  const pipeline = facilities.filter((p) => PIPELINE_STATUSES.includes(p.status));

  const noUsableCapacity = facilities.filter((p) => {
    const figs = capacityFigures(p);
    return figs.length === 0 || figs.every((f) => f.kind === "unspecified");
  }).length;

  return {
    facilities,
    zones: projects.length - facilities.length,
    total: facilities.length,
    byStatus,
    operationalItLoad: capacitySum(operational, "it_load"),
    operationalDemand: capacitySum(operational, "electrical_demand"),
    pipelineItLoadByStatus: PIPELINE_STATUSES.map((status) => ({
      status,
      total: capacitySum(
        facilities.filter((p) => p.status === status),
        "it_load",
      ),
    })).filter((r) => r.total.records > 0),
    pipelineItLoad: capacitySum(pipeline, "it_load"),
    noUsableCapacity,
    unspecifiedCapacity: facilities.filter((p) =>
      capacityFigures(p).some((f) => f.kind === "unspecified"),
    ).length,
  };
}

export type RegionSummary = {
  group: DcGeoGroup;
  count: number;
  byStatus: StatusCounts;
  itLoad: CapacityTotal;
  withoutCapacity: number;
};

/** Counts and comparable capacity per geographic group. Each project appears once. */
export function summariseByRegion(projects: SummaryInput[]): RegionSummary[] {
  const facilities = projects.filter((p) => isPhysicalFacility(p.project_type));
  const buckets = new Map<DcGeoGroup, SummaryInput[]>();
  for (const p of facilities) {
    const g = geoGroupFor(p);
    buckets.set(g, [...(buckets.get(g) ?? []), p]);
  }
  return Array.from(buckets.entries()).map(([group, rows]) => {
    const byStatus: StatusCounts = {};
    for (const p of rows) byStatus[p.status] = (byStatus[p.status] ?? 0) + 1;
    return {
      group,
      count: rows.length,
      byStatus,
      itLoad: capacitySum(rows, "it_load"),
      withoutCapacity: rows.filter((p) => {
        const figs = capacityFigures(p);
        return figs.length === 0 || figs.every((f) => f.kind === "unspecified");
      }).length,
    };
  });
}

// ---------------------------------------------------------------------------
// Data-quality safeguards. These flag records for human review; nothing here
// edits a record, merges it or changes a verification date.
// ---------------------------------------------------------------------------

export type QualityFlags = {
  missingSources: SummaryInput[];
  neverVerified: SummaryInput[];
  overdueReview: SummaryInput[];
  unspecifiedCapacity: SummaryInput[];
  possibleDuplicates: { reason: string; records: SummaryInput[] }[];
};

/** Words that appear in almost every record name and cannot identify a project. */
const GENERIC_WORDS = new Set([
  "data",
  "centre",
  "center",
  "centres",
  "campus",
  "the",
  "and",
  "of",
  "uk",
  "project",
  "site",
  "former",
  "land",
  "park",
  "plot",
  "north",
  "south",
  "east",
  "west",
]);

/** Distinctive words in a project name, used only to raise a duplicate for review. */
function nameKey(name: string) {
  const words = name
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !GENERIC_WORDS.has(w));
  if (words.length < 2) return "";
  return words.slice(0, 2).sort().join(" ");
}

export function qualityFlags(projects: SummaryInput[], now = new Date()): QualityFlags {
  const cutoff = now.getTime() - REVIEW_INTERVAL_DAYS * 24 * 60 * 60 * 1000;

  const dupGroups: { reason: string; records: SummaryInput[] }[] = [];
  const collect = (reason: string, keyOf: (p: SummaryInput) => string | null) => {
    const map = new Map<string, SummaryInput[]>();
    for (const p of projects) {
      const k = keyOf(p);
      if (!k) continue;
      map.set(k, [...(map.get(k) ?? []), p]);
    }
    for (const rows of map.values()) {
      if (rows.length > 1) dupGroups.push({ reason, records: rows });
    }
  };
  collect("Same planning reference", (p) =>
    p.planning_reference ? p.planning_reference.trim().toLowerCase() : null,
  );
  // A similar name only raises a flag when the projects are also in the same
  // town, so two sites run by one operator in different places are not flagged.
  collect("Similar name in the same town", (p) => {
    const key = nameKey(p.name);
    return key && p.town ? `${key}|${p.town.trim().toLowerCase()}` : null;
  });
  collect("Same operator and town", (p) =>
    p.operator && p.town ? `${p.operator.toLowerCase()}|${p.town.toLowerCase()}` : null,
  );

  return {
    missingSources: projects.filter((p) => (p.all_sources ?? []).length === 0),
    neverVerified: projects.filter((p) => !p.last_verified_at),
    overdueReview: projects.filter(
      (p) => p.last_verified_at && new Date(p.last_verified_at).getTime() < cutoff,
    ),
    unspecifiedCapacity: projects.filter((p) =>
      capacityFigures(p).some((f) => f.kind === "unspecified"),
    ),
    possibleDuplicates: dupGroups,
  };
}
