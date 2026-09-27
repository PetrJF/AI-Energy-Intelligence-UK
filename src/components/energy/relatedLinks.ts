/**
 * Single source of truth for the "Related Articles & Reference Material" links
 * shown on every Tier 1 AI energy calculator.
 *
 * Each calculator maps to:
 *  - one AI Energy Intelligence UK article (aienergyintelligence.co.uk)
 *  - one PowerGuardian page (powerguardian.co.uk)
 *  - one Energy Sector cyber-security page (energysector.co.uk/cyber-security)
 *  - one official UK source (gov.uk / NESO)
 *
 * This module is intentionally framework-free so it can be imported by both the
 * React UI and the automated link-validation script (scripts/validate-related-links.ts).
 */

export type RelatedLink = {
  label: string;
  href: string;
  title: string;
  /** True for links to routes inside this app (rendered with TanStack Link). */
  internal?: boolean;
  /** Optional short sentence shown under the link title for extra context. */
  description?: string;
};

/* ---------------- Internal blog & news shortcuts ---------------- */

/** Slugs of published blog posts, kept here for type-safe internal links. */
const BLOG = {
  supermarkets: "/blog/how-supermarkets-use-ai-to-save-electricity",
  moreEnergyThanSaves: "/blog/could-ai-use-more-energy-than-it-saves-uk",
  howManyDataCentres: "/blog/how-many-data-centres-uk-energy",
  housePricesLocal: "/blog/will-ai-data-centres-change-uk-house-prices",
  housePricesUk: "/blog/will-ai-data-centres-change-uk-house-prices",
} as const;

/** News hub filters. */
const NEWS = {
  all: "/news",
  dataCentres: "/news?category=Data%20Centres",
  grid: "/news?category=Grid",
  policy: "/news?category=Policy",
  business: "/news?category=Business",
} as const;

/** PowerGuardian — UK energy price & supplier intelligence partner. */
const PG_LINKS = {
  home: {
    label: "PowerGuardian",
    href: "https://powerguardian.co.uk/",
    title: "Compare UK Energy Suppliers & Business Tariffs",
    description:
      "Independent UK energy price comparison for households and businesses — useful when your AI workload starts to show up on the electricity bill.",
  } as RelatedLink,
  forecast: {
    label: "PowerGuardian",
    href: "https://powerguardian.co.uk/energy-price-forecast-uk",
    title: "UK Energy Price Forecast",
    description:
      "PowerGuardian's forward view on UK wholesale and retail electricity prices — the demand baseline against which AI growth is measured.",
  } as RelatedLink,
  business: {
    label: "PowerGuardian",
    href: "https://powerguardian.co.uk/business-energy",
    title: "PowerGuardian Business Energy",
    description:
      "Business energy contracts and procurement guidance — pair with our AI cost calculators to model the true bill impact of scaling AI.",
  } as RelatedLink,
} as const;

export type RelatedKey =
  | "query-energy"
  | "vs-appliances"
  | "demand-forecast"
  | "growth-zone"
  | "data-centres";

export const RELATED_KEYS: RelatedKey[] = [
  "query-energy",
  "vs-appliances",
  "demand-forecast",
  "growth-zone",
  "data-centres",
];

const PG = {
  home: "https://powerguardian.co.uk/",
  forecast: "https://powerguardian.co.uk/energy-price-forecast-uk",
};
const ENERGYSECTOR_CYBER = "https://energysector.co.uk/cyber-security";
const GOV_DATA_CENTRES =
  "https://assets.publishing.service.gov.uk/media/689d9dc487bf475940723f6c/impact-of-growth-of-data-centres.pdf";
const NESO_FES = "https://www.neso.energy/publications/future-energy-scenarios-fes";

/**
 * Expected destination host per label, used by the validator to confirm each
 * calculator points at the correct brand / source (not just any reachable URL).
 */
export const EXPECTED_HOSTS: Record<string, string[]> = {
  "AI Energy Intelligence UK": ["aienergyintelligence.co.uk"],
  PowerGuardian: ["powerguardian.co.uk"],
  "Energy Sector — Cyber Security": ["energysector.co.uk"],
  "Official Source": ["assets.publishing.service.gov.uk", "www.neso.energy", "neso.energy"],
};

/* ---------------- Tier 2: AI infrastructure tools ---------------- */

export type InfraKey =
  | "subscription-cost"
  | "spending-tracker"
  | "data-centre-impact"
  | "risk-assessment"
  | "investment-map";

export const RELATED_INFRA: Record<InfraKey, RelatedLink[]> = {
  "subscription-cost": [
    { label: "Blog", href: BLOG.moreEnergyThanSaves, title: "Could AI Use More Energy Than It Saves in the UK?", internal: true },
    { label: "News", href: NEWS.business, title: "Latest UK AI business & pricing news", internal: true },
    PG_LINKS.business,
    { label: "Official Source", href: GOV_DATA_CENTRES, title: "DESNZ: Impact of Growth of Data Centres on Energy Consumption" },
  ],
  "spending-tracker": [
    { label: "Blog", href: BLOG.howManyDataCentres, title: "How Many Data Centres in the UK Are Devouring Energy?", internal: true },
    { label: "News", href: NEWS.dataCentres, title: "Latest UK data-centre news & investment moves", internal: true },
    PG_LINKS.forecast,
    { label: "Official Source", href: GOV_DATA_CENTRES, title: "DESNZ: Impact of Growth of Data Centres on Energy Consumption" },
  ],
  "data-centre-impact": [
    { label: "Blog", href: BLOG.housePricesLocal, title: "Will AI Data Centres Change House Prices in the UK?", internal: true },
    { label: "Blog", href: BLOG.howManyDataCentres, title: "How Many Data Centres in the UK Are Devouring Energy?", internal: true },
    { label: "News", href: NEWS.dataCentres, title: "Latest UK data-centre planning & grid news", internal: true },
    PG_LINKS.home,
    { label: "Official Source", href: GOV_DATA_CENTRES, title: "DESNZ: Impact of Growth of Data Centres on Energy Consumption" },
  ],
  "risk-assessment": [
    { label: "Blog", href: BLOG.moreEnergyThanSaves, title: "Could AI Use More Energy Than It Saves in the UK?", internal: true },
    { label: "News", href: NEWS.grid, title: "Latest UK grid capacity & constraint news", internal: true },
    PG_LINKS.forecast,
    { label: "Official Source", href: NESO_FES, title: "NESO: Future Energy Scenarios" },
  ],
  "investment-map": [
    { label: "Blog", href: BLOG.housePricesUk, title: "Will AI Data Centres Change House Prices in the UK?", internal: true },
    { label: "Blog", href: BLOG.howManyDataCentres, title: "How Many Data Centres in the UK Are Devouring Energy?", internal: true },
    { label: "News", href: NEWS.dataCentres, title: "Latest UK data-centre investment news", internal: true },
    PG_LINKS.business,
    { label: "Official Source", href: GOV_DATA_CENTRES, title: "DESNZ: Impact of Growth of Data Centres on Energy Consumption" },
  ],
};

/* ---------------- Tier 3: advanced AI energy tools ---------------- */

export type AdvancedKey =
  | "carbon-impact"
  | "demand-modeller"
  | "energy-cost-society"
  | "grid-capacity"
  | "scenario-comparison"
  | "water-usage";

export const RELATED_ADVANCED: Record<AdvancedKey, RelatedLink[]> = {
  "carbon-impact": [
    { label: "Blog", href: BLOG.moreEnergyThanSaves, title: "Could AI Use More Energy Than It Saves in the UK?", internal: true },
    { label: "News", href: NEWS.policy, title: "Latest UK net-zero & energy policy news", internal: true },
    PG_LINKS.home,
    { label: "Official Source", href: NESO_FES, title: "NESO: Future Energy Scenarios" },
  ],
  "demand-modeller": [
    { label: "Blog", href: BLOG.moreEnergyThanSaves, title: "Could AI Use More Energy Than It Saves in the UK?", internal: true },
    { label: "News", href: NEWS.grid, title: "Latest UK electricity demand & grid news", internal: true },
    PG_LINKS.forecast,
    { label: "Official Source", href: NESO_FES, title: "NESO: Future Energy Scenarios" },
  ],
  "energy-cost-society": [
    { label: "Blog", href: BLOG.supermarkets, title: "How Are Supermarkets Using AI to Save Electricity?", internal: true },
    { label: "News", href: NEWS.business, title: "Latest UK business energy & AI news", internal: true },
    PG_LINKS.business,
    { label: "Official Source", href: GOV_DATA_CENTRES, title: "DESNZ: Impact of Growth of Data Centres on Energy Consumption" },
  ],
  "grid-capacity": [
    { label: "Blog", href: BLOG.howManyDataCentres, title: "How Many Data Centres in the UK Are Devouring Energy?", internal: true },
    { label: "News", href: NEWS.grid, title: "Latest UK grid & network news", internal: true },
    PG_LINKS.forecast,
    { label: "Official Source", href: NESO_FES, title: "NESO: Future Energy Scenarios" },
  ],
  "scenario-comparison": [
    { label: "Blog", href: BLOG.moreEnergyThanSaves, title: "Could AI Use More Energy Than It Saves in the UK?", internal: true },
    { label: "News", href: NEWS.all, title: "Latest UK AI & energy news", internal: true },
    PG_LINKS.forecast,
    { label: "Official Source", href: NESO_FES, title: "NESO: Future Energy Scenarios" },
  ],
  "water-usage": [
    { label: "Blog", href: BLOG.howManyDataCentres, title: "How Many Data Centres in the UK Are Devouring Energy?", internal: true },
    { label: "News", href: NEWS.dataCentres, title: "Latest UK data-centre & cooling news", internal: true },
    PG_LINKS.home,
    { label: "Official Source", href: GOV_DATA_CENTRES, title: "DESNZ: Impact of Growth of Data Centres on Energy Consumption" },
  ],
};

export const RELATED: Record<RelatedKey, RelatedLink[]> = {
  "query-energy": [
    { label: "Blog", href: BLOG.supermarkets, title: "How Are Supermarkets Using AI to Save Electricity?", internal: true },
    { label: "News", href: NEWS.all, title: "Latest UK AI & energy news", internal: true },
    PG_LINKS.home,
    { label: "Energy Sector — Cyber Security", href: ENERGYSECTOR_CYBER, title: "UK Cyber Energy Security 2026–2035" },
    { label: "Official Source", href: GOV_DATA_CENTRES, title: "DESNZ: Impact of Growth of Data Centres on Energy Consumption" },
  ],
  "vs-appliances": [
    { label: "Blog", href: BLOG.supermarkets, title: "How Are Supermarkets Using AI to Save Electricity?", internal: true },
    { label: "News", href: NEWS.all, title: "Latest UK AI & energy news", internal: true },
    PG_LINKS.forecast,
    { label: "Energy Sector — Cyber Security", href: ENERGYSECTOR_CYBER, title: "UK Cyber Energy Security 2026–2035" },
    { label: "Official Source", href: GOV_DATA_CENTRES, title: "DESNZ: Impact of Growth of Data Centres on Energy Consumption" },
  ],
  "demand-forecast": [
    { label: "Blog", href: BLOG.moreEnergyThanSaves, title: "Could AI Use More Energy Than It Saves in the UK?", internal: true },
    { label: "News", href: NEWS.grid, title: "Latest UK grid & demand news", internal: true },
    PG_LINKS.forecast,
    { label: "Energy Sector — Cyber Security", href: ENERGYSECTOR_CYBER, title: "UK Cyber Energy Security 2026–2035" },
    { label: "Official Source", href: NESO_FES, title: "NESO: Future Energy Scenarios" },
  ],
  "growth-zone": [
    { label: "Blog", href: BLOG.housePricesLocal, title: "Will AI Data Centres Change House Prices in the UK?", internal: true },
    { label: "News", href: NEWS.dataCentres, title: "Latest UK data-centre planning news", internal: true },
    { label: "Blog", href: BLOG.howManyDataCentres, title: "How Many Data Centres in the UK Are There Devouring Energy?", internal: true },
    PG_LINKS.home,
    { label: "Energy Sector — Cyber Security", href: ENERGYSECTOR_CYBER, title: "UK Cyber Energy Security 2026–2035" },
    { label: "Official Source", href: GOV_DATA_CENTRES, title: "DESNZ: Impact of Growth of Data Centres on Energy Consumption" },
  ],
  "data-centres": [
    { label: "Blog", href: BLOG.howManyDataCentres, title: "How Many Data Centres in the UK Are Devouring Energy?", internal: true },
    { label: "Blog", href: BLOG.housePricesUk, title: "Will AI Data Centres Change House Prices in the UK?", internal: true },
    { label: "News", href: NEWS.dataCentres, title: "Latest UK data-centre news", internal: true },
    PG_LINKS.business,
    { label: "Energy Sector — Cyber Security", href: ENERGYSECTOR_CYBER, title: "UK Cyber Energy Security 2026–2035" },
    { label: "Official Source", href: GOV_DATA_CENTRES, title: "DESNZ: Impact of Growth of Data Centres on Energy Consumption" },
  ],
};

