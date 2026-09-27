// Shared label maps and options for the UK data-centre tracker.
export const DC_STATUS_LABELS: Record<string, string> = {
  proposed: "Proposed",
  planning_submitted: "Planning submitted",
  approved: "Approved",
  under_construction: "Under construction",
  operational: "Operational",
  expansion: "Expansion",
  paused: "Paused",
  refused: "Refused",
  withdrawn: "Withdrawn",
};

export const DC_TYPE_LABELS: Record<string, string> = {
  data_centre: "Data centre",
  ai_campus: "AI campus",
  colocation: "Colocation",
  hyperscale: "Hyperscale",
  edge: "Edge facility",
  growth_zone: "AI growth zone",
};

export const DC_AI_RELEVANCE_LABELS: Record<string, string> = {
  high: "High — AI/compute led",
  medium: "Medium — AI-capable",
  low: "Low — general IT load",
  unknown: "Not stated",
};

export const DC_CONFIDENCE_LABELS: Record<string, string> = {
  high: "High confidence",
  medium: "Medium confidence",
  low: "Low confidence",
  indicative: "Indicative only",
};

export const DC_REGIONS = [
  "London",
  "South East",
  "South West",
  "East of England",
  "East Midlands",
  "West Midlands",
  "Yorkshire and the Humber",
  "North West",
  "North East",
  "Wales",
  "Scotland",
  "Northern Ireland",
  "Unknown",
];

export function labelFor(map: Record<string, string>, key: string) {
  return map[key] ?? key;
}

// Approximate geographic centre of each UK region/nation, used only as an
// indicative map position when a project has no published coordinates.
export const DC_REGION_CENTROIDS: Record<string, { lat: number; lng: number }> = {
  London: { lat: 51.51, lng: -0.13 },
  "South East": { lat: 51.3, lng: -0.8 },
  "South West": { lat: 50.9, lng: -3.5 },
  "East of England": { lat: 52.3, lng: 0.5 },
  "East Midlands": { lat: 52.9, lng: -0.9 },
  "West Midlands": { lat: 52.5, lng: -2.0 },
  "Yorkshire and the Humber": { lat: 53.8, lng: -1.3 },
  "North West": { lat: 53.8, lng: -2.6 },
  "North East": { lat: 54.9, lng: -1.7 },
  Wales: { lat: 52.3, lng: -3.6 },
  Scotland: { lat: 56.8, lng: -4.2 },
  "Northern Ireland": { lat: 54.6, lng: -6.6 },
};

export function regionSlug(region: string) {
  return region
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function regionFromSlug(slug: string): string | null {
  return DC_REGIONS.find((r) => regionSlug(r) === slug) ?? null;
}

// Progress stages recorded against an AI Growth Zone.
export const ZONE_STAGE_LABELS: Record<string, string> = {
  announced: "Announced",
  designated: "Designated",
  planning: "Planning",
  power: "Power and grid",
  construction: "Construction",
  live: "Live",
};

// ---------------------------------------------------------------------------
// Capacity accounting.
//
// Data-centre capacity figures are not interchangeable. An IT load, a grid
// connection capacity, a stated electrical demand, a whole-campus build-out
// figure and an undefined "MW" number reported at proposal stage all measure
// different things, so they are stored separately and never summed together.
// ---------------------------------------------------------------------------

export type CapacityKind =
  | "it_load"
  | "grid_connection"
  | "electrical_demand"
  | "campus_capacity"
  | "unspecified";

export const CAPACITY_KIND_LABELS: Record<CapacityKind, string> = {
  it_load: "Published IT load",
  grid_connection: "Published grid-connection capacity",
  electrical_demand: "Published electrical demand",
  campus_capacity: "Published campus build-out capacity",
  unspecified: "Reported capacity, definition not published",
};

export const CAPACITY_KIND_NOTES: Record<CapacityKind, string> = {
  it_load: "The IT load the operator or planning documents state the facility will draw.",
  grid_connection: "The connection capacity secured or applied for, which is not the same as demand.",
  electrical_demand: "The total electrical demand stated for the site, including cooling and losses.",
  campus_capacity:
    "A whole-campus figure covering all phases. It is not current operational capacity.",
  unspecified:
    "A megawatt figure was reported but the source does not define what it measures, so it is excluded from every total.",
};

export type CapacityFigure = { kind: CapacityKind; mw: number };

type CapacityBearing = {
  it_capacity_mw?: number | null;
  grid_connection_mw?: number | null;
  stated_electricity_demand_mw?: number | null;
  campus_capacity_mw?: number | null;
  capacity_mw?: number | null;
  capacity_definition?: string | null;
};

/**
 * Returns every published capacity figure for a project, each tagged with what
 * it actually measures. The legacy free-form `capacity_mw` column is mapped
 * through `capacity_definition`; where that definition is missing or unclear
 * the figure is classed as unspecified and kept out of all totals.
 */
export function capacityFigures(p: CapacityBearing): CapacityFigure[] {
  const out: CapacityFigure[] = [];
  const push = (kind: CapacityKind, mw: number | null | undefined) => {
    if (typeof mw === "number" && Number.isFinite(mw)) out.push({ kind, mw });
  };
  push("it_load", p.it_capacity_mw);
  push("grid_connection", p.grid_connection_mw);
  push("electrical_demand", p.stated_electricity_demand_mw);
  push("campus_capacity", p.campus_capacity_mw);

  if (typeof p.capacity_mw === "number" && Number.isFinite(p.capacity_mw)) {
    const def = p.capacity_definition ?? "unclear";
    const mapped: Record<string, CapacityKind> = {
      it_load: "it_load",
      total_facility_load: "electrical_demand",
      grid_connection: "grid_connection",
      campus_capacity: "campus_capacity",
    };
    const kind = mapped[def] ?? "unspecified";
    // Only add the legacy figure when a typed field has not already recorded it.
    if (!out.some((f) => f.kind === kind && f.mw === p.capacity_mw)) {
      out.push({ kind, mw: p.capacity_mw });
    }
  }
  return out;
}

/** Human-readable label for one figure, always naming its measurement type. */
export function describeCapacity(f: CapacityFigure) {
  if (f.kind === "unspecified") {
    return `${f.mw.toLocaleString("en-GB")} MW reported; capacity definition not published`;
  }
  return `${f.mw.toLocaleString("en-GB")} MW — ${CAPACITY_KIND_LABELS[f.kind].toLowerCase()}`;
}

/**
 * Totals one capacity type across a set of projects, returning the sum and the
 * coverage denominator so the figure is never presented without its context.
 * Unspecified figures are excluded by design.
 */
export function capacityTotal(projects: CapacityBearing[], kind: Exclude<CapacityKind, "unspecified">) {
  let mw = 0;
  let withFigure = 0;
  for (const p of projects) {
    const f = capacityFigures(p).find((x) => x.kind === kind);
    if (f) {
      mw += f.mw;
      withFigure += 1;
    }
  }
  return { mw, withFigure, of: projects.length };
}

/** Record types. AI Growth Zones are areas, not facilities, and are counted apart. */
export function isPhysicalFacility(projectType: string) {
  return projectType !== "growth_zone";
}
