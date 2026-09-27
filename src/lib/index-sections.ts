// Shared constants for the UK AI Energy Index sub-indices, regions and
// data classifications. Client-safe: no server imports.

export const SUBINDEX_SLUGS = ["electricity-demand", "data-centre-growth", "grid-pressure"] as const;
export type SubIndexSlug = (typeof SUBINDEX_SLUGS)[number];

export const SUBINDEX_META: Record<
  SubIndexSlug,
  { name: string; title: string; blurb: string; path: string }
> = {
  "electricity-demand": {
    name: "AI Electricity Demand Index",
    title: "UK AI Electricity Demand Index | Data Centre Power Use",
    blurb:
      "The electricity required to support AI and data-centre activity in the UK, separating verified figures from estimates and forecasts.",
    path: "/uk-ai-energy-index/electricity-demand",
  },
  "data-centre-growth": {
    name: "Data Centre Growth Index",
    title: "UK Data Centre Growth Index | AI Energy Intelligence",
    blurb:
      "The expansion of the physical infrastructure supporting AI, cloud computing and other digital services in the UK.",
    path: "/uk-ai-energy-index/data-centre-growth",
  },
  "grid-pressure": {
    name: "Grid Pressure Index",
    title: "UK Grid Pressure Index | AI Energy Intelligence",
    blurb:
      "Whether Britain's electricity networks appear capable of accommodating data-centre and AI-related demand.",
    path: "/uk-ai-energy-index/grid-pressure",
  },
};

// The nine index regions. These are deliberately broader than the twelve
// regions used by the data-centre tracker; Slough and the Thames Valley is
// separated out because of its concentration of existing capacity.
export const INDEX_REGIONS: { slug: string; name: string }[] = [
  { slug: "london", name: "London" },
  { slug: "slough-thames-valley", name: "Slough and the Thames Valley" },
  { slug: "south-east-england", name: "South East England" },
  { slug: "midlands", name: "Midlands" },
  { slug: "north-west-england", name: "North West England" },
  { slug: "north-east-and-yorkshire", name: "North East and Yorkshire" },
  { slug: "scotland", name: "Scotland" },
  { slug: "wales", name: "Wales" },
  { slug: "northern-ireland", name: "Northern Ireland" },
];

export const CLASSIFICATION_LABELS: Record<string, string> = {
  verified: "Verified",
  industry_estimate: "Industry estimate",
  aie_estimate: "AI Energy Intelligence estimate",
  forecast: "Forecast",
  not_disclosed: "Not disclosed",
  not_available: "Data not yet available",
};

export const CLASSIFICATION_STYLES: Record<string, string> = {
  verified: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  industry_estimate: "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-400",
  aie_estimate: "border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-400",
  forecast: "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  not_disclosed: "border-border bg-muted text-muted-foreground",
  not_available: "border-border bg-muted text-muted-foreground",
};

export const PRESSURE_LABELS: Record<string, string> = {
  low: "Low pressure",
  moderate: "Moderate pressure",
  high: "High pressure",
  severe: "Severe pressure",
  insufficient_evidence: "Insufficient evidence",
};

// Colour is always paired with the written label and a symbol, never used alone.
export const PRESSURE_STYLES: Record<string, string> = {
  low: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  moderate: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  high: "border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-400",
  severe: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400",
  insufficient_evidence: "border-border bg-muted text-muted-foreground",
};

export const PRESSURE_SYMBOLS: Record<string, string> = {
  low: "●",
  moderate: "◐",
  high: "◑",
  severe: "◆",
  insufficient_evidence: "○",
};

export const DIRECTION_LABELS: Record<string, string> = {
  rising: "Rising",
  stable: "Stable",
  falling: "Falling",
  unknown: "Unknown",
};

export const COMPLETENESS_LABELS: Record<string, string> = {
  complete: "Complete",
  partial: "Partial",
  minimal: "Minimal",
  none: "No data yet",
};

export const DEV_STATUS_LABELS: Record<string, string> = {
  operational: "Operational",
  under_construction: "Under construction",
  approved: "Approved",
  proposed: "Proposed",
  refused: "Refused",
  withdrawn: "Withdrawn",
  delayed: "Delayed",
  cancelled: "Cancelled",
  status_unconfirmed: "Status unconfirmed",
};

export const NOT_AVAILABLE = "Data not yet available";

export function fmtNumber(value: number | null | undefined, unit?: string | null) {
  if (value === null || value === undefined) return null;
  return `${value.toLocaleString("en-GB")}${unit ? ` ${unit}` : ""}`;
}

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Formatted manually so the server and browser always agree (locale data differs).
export function fmtDate(value: string | null | undefined) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getUTCDate()} ${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function regionName(slug: string) {
  return INDEX_REGIONS.find((r) => r.slug === slug)?.name ?? slug;
}

// ---------------------------------------------------------------------------
// Data-management vocabularies (source register, demand data, project
// register, grid evidence). Labels only — no figures are defined here.
// ---------------------------------------------------------------------------

export const GEO_COVERAGE_LABELS: Record<string, string> = {
  united_kingdom: "United Kingdom",
  great_britain: "Great Britain",
  england: "England",
  scotland: "Scotland",
  wales: "Wales",
  northern_ireland: "Northern Ireland",
  uk_region: "UK region",
  local_authority: "Local authority",
  individual_facility: "Individual facility",
  other: "Other",
};

export const SOURCE_TYPE_LABELS: Record<string, string> = {
  government_publication: "Government publication",
  official_statistics: "Official statistics",
  planning_record: "Planning record",
  network_operator: "Network operator publication",
  regulatory_publication: "Regulatory publication",
  company_report: "Company report",
  developer_announcement: "Developer announcement",
  industry_estimate: "Industry estimate",
  academic_research: "Academic research",
  news_report: "News report",
  other: "Other",
  // Values retained from the earlier source register.
  official: "Government publication",
  regulator: "Regulatory publication",
  operator: "Network operator publication",
  press: "News report",
  industry: "Industry estimate",
  modelled: "Other",
  survey: "Other",
  academic: "Academic research",
};

export const RELIABILITY_LABELS: Record<string, string> = {
  primary_verified: "Primary verified source",
  reliable_secondary: "Reliable secondary source",
  supporting_only: "Supporting evidence only",
  unverified: "Unverified",
  superseded: "Superseded",
};

export const SOURCE_CLASS_LABELS: Record<string, string> = {
  primary: "Primary source",
  secondary: "Secondary source",
};

// Extends CLASSIFICATION_LABELS above with the fuller data-classification set.
export const DATA_CLASSIFICATION_LABELS: Record<string, string> = {
  ...CLASSIFICATION_LABELS,
  official: "Official figure",
  calculated: "Calculated from official figures",
  verified: "Official figure",
  industry_estimate: "Industry estimate",
  aie_estimate: "AI Energy Intelligence estimate",
  forecast: "Forecast",
  not_disclosed: "Not disclosed",
  insufficient_evidence: "Insufficient evidence",
  not_available: "Data not yet available",
};

export const DATA_CLASSIFICATION_STYLES: Record<string, string> = {
  ...CLASSIFICATION_STYLES,
  official: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  calculated: "border-teal-500/25 bg-teal-500/10 text-teal-700 dark:text-teal-400",
  insufficient_evidence: "border-border bg-muted text-muted-foreground",
};

export const CONFIDENCE_LABELS: Record<string, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
  not_assessed: "Not assessed",
  indicative: "Indicative",
};

export const UNIT_OPTIONS = [
  "GWh per year",
  "TWh per year",
  "MW",
  "GW",
  "Percentage",
  "Percentage change",
  "Count",
] as const;

export const FACILITY_TYPE_LABELS: Record<string, string> = {
  hyperscale: "Hyperscale",
  colocation: "Colocation",
  enterprise: "Enterprise",
  ai_hpc: "AI or high-performance computing",
  government_research: "Government or research",
  edge: "Edge",
  type_unconfirmed: "Type unconfirmed",
};

export const CAPACITY_DEFINITION_LABELS: Record<string, string> = {
  it_load: "IT load",
  total_facility_load: "Total facility load",
  grid_connection: "Grid-connection capacity",
  campus_capacity: "Campus capacity",
  unclear: "Capacity definition unclear",
  not_disclosed: "Not disclosed",
};

export const NETWORK_LEVEL_LABELS: Record<string, string> = {
  transmission: "Transmission",
  distribution: "Distribution",
  both: "Both",
  not_established: "Not established",
};

export const CONSTRAINT_TYPE_LABELS: Record<string, string> = {
  connection_queue: "Connection queue",
  substation_capacity: "Substation capacity",
  transmission_capacity: "Transmission capacity",
  distribution_capacity: "Distribution capacity",
  reinforcement_requirement: "Reinforcement requirement",
  connection_delay: "Connection delay",
  flexible_connection: "Flexible connection",
  local_congestion: "Local congestion",
  constraint_not_established: "Constraint not established",
};

export const NATION_LABELS: Record<string, string> = {
  england: "England",
  scotland: "Scotland",
  wales: "Wales",
  northern_ireland: "Northern Ireland",
};

// The organisations whose publications the index draws on. These are source
// categories only: no document titles, URLs, dates or figures are implied.
export const SOURCE_ORGANISATIONS = [
  "Department for Energy Security and Net Zero",
  "Department for Science, Innovation and Technology",
  "National Energy System Operator",
  "Ofgem",
  "National Grid Electricity Transmission",
  "UK Power Networks",
  "National Grid Electricity Distribution",
  "Scottish and Southern Electricity Networks",
  "Electricity North West",
  "Northern Powergrid",
  "SP Energy Networks",
  "SONI",
  "NIE Networks",
  "Utility Regulator Northern Ireland",
  "Local-authority planning portals",
  "Planning Data service",
  "House of Commons Library",
] as const;

export const AI_SPECIFIC_STATEMENT =
  "Reliable AI-specific electricity-consumption data remains limited. General data-centre electricity use must not automatically be treated as electricity consumed by artificial intelligence.";

export const CLASSIFICATION_STATEMENT =
  "The UK AI Energy Index distinguishes between official figures, calculated figures, industry estimates, AI Energy Intelligence estimates and forecasts. Data-centre electricity consumption is not presented as AI-specific consumption unless reliable evidence supports that distinction.";

export function labelFor(map: Record<string, string>, key: string | null | undefined) {
  if (!key) return null;
  return map[key] ?? key;
}
