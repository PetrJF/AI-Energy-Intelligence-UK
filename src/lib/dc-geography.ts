// Non-overlapping geographic groupings for the UK data-centre tracker.
//
// Every tracked project is assigned to exactly one group. Assignment is made
// from the stored region first, then narrowed by local authority or town where
// a sub-area is counted separately (Slough and the Thames Valley is carved out
// of South East England, so the two never overlap).

export type DcGeoGroup =
  | "london"
  | "thames-valley"
  | "south-east"
  | "midlands"
  | "north-west"
  | "north-east-yorkshire"
  | "scotland"
  | "wales"
  | "northern-ireland"
  | "south-west"
  | "east-of-england"
  | "unconfirmed";

export const DC_GEO_GROUPS: { key: DcGeoGroup; label: string; note?: string }[] = [
  { key: "london", label: "London" },
  {
    key: "thames-valley",
    label: "Slough and the Thames Valley",
    note: "Slough, Windsor and Maidenhead, Reading, Bracknell Forest, Wokingham and West Berkshire.",
  },
  {
    key: "south-east",
    label: "South East England",
    note: "South East England excluding the separately counted Thames Valley area.",
  },
  { key: "midlands", label: "Midlands", note: "East Midlands and West Midlands combined." },
  { key: "north-west", label: "North West England" },
  { key: "north-east-yorkshire", label: "North East England and Yorkshire" },
  { key: "scotland", label: "Scotland" },
  { key: "wales", label: "Wales" },
  { key: "northern-ireland", label: "Northern Ireland" },
  { key: "south-west", label: "South West England" },
  { key: "east-of-england", label: "East of England" },
  {
    key: "unconfirmed",
    label: "Region not confirmed",
    note: "Projects whose location has not been established from a published source.",
  },
];

export const DC_GEO_GROUP_LABELS: Record<DcGeoGroup, string> = Object.fromEntries(
  DC_GEO_GROUPS.map((g) => [g.key, g.label]),
) as Record<DcGeoGroup, string>;

/** Local-authority and town names that place a South East project in the Thames Valley group. */
const THAMES_VALLEY = [
  "slough",
  "windsor",
  "maidenhead",
  "reading",
  "bracknell",
  "wokingham",
  "west berkshire",
  "newbury",
];

const REGION_TO_GROUP: Record<string, DcGeoGroup> = {
  london: "london",
  "south east": "south-east",
  "south west": "south-west",
  "east of england": "east-of-england",
  "east midlands": "midlands",
  "west midlands": "midlands",
  midlands: "midlands",
  "yorkshire and the humber": "north-east-yorkshire",
  yorkshire: "north-east-yorkshire",
  "north east": "north-east-yorkshire",
  "north west": "north-west",
  wales: "wales",
  scotland: "scotland",
  "northern ireland": "northern-ireland",
};

type Locatable = {
  region?: string | null;
  town?: string | null;
  local_authority?: string | null;
};

/** Assigns a project to exactly one geographic group. */
export function geoGroupFor(p: Locatable): DcGeoGroup {
  const region = (p.region ?? "").trim().toLowerCase();
  const base = REGION_TO_GROUP[region];
  if (!base) return "unconfirmed";
  if (base === "south-east") {
    const local = `${p.local_authority ?? ""} ${p.town ?? ""}`.toLowerCase();
    if (THAMES_VALLEY.some((n) => local.includes(n))) return "thames-valley";
  }
  return base;
}
