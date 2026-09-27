import { Link } from "@tanstack/react-router";
import { SeoSection } from "./EnergyUI";
import { RELATED_INFRA, type InfraKey } from "./relatedLinks";
import { RelatedLinkRow } from "./RelatedLinkRow";

/* ---------------- Tier 2 related content ---------------- */

export function Tier2RelatedContent({ tool }: { tool: InfraKey }) {
  const rows = RELATED_INFRA[tool];
  return (
    <SeoSection title="Related Articles & Reference Material">
      <p>
        Further reading from our <Link to="/blog" className="text-electric underline-offset-2 hover:underline">blog</Link>,
        the <Link to="/news" className="text-electric underline-offset-2 hover:underline">UK AI energy news feed</Link>,
        AI Energy Intelligence UK long-reads, PowerGuardian for live pricing, and official UK sources.
      </p>
      <ul className="mt-2 space-y-2">
        {rows.map((r, i) => (
          <RelatedLinkRow key={`${r.label}-${r.href}-${i}`} link={r} />
        ))}
      </ul>
    </SeoSection>
  );
}

/* ---------------- Tier 2 cross-tool navigation ---------------- */

const TIER2_LINKS = [
  { to: "/ai-infrastructure-tools/subscription-cost", label: "AI Subscription Real Cost Calculator" },
  { to: "/ai-infrastructure-tools/spending-tracker", label: "AI Infrastructure Spending Tracker" },
  { to: "/ai-infrastructure-tools/data-centre-impact", label: "Data Centre Impact Checker" },
  { to: "/ai-infrastructure-tools/risk-assessment", label: "AI Infrastructure Risk Assessment" },
  { to: "/ai-infrastructure-tools/investment-map", label: "AI Data Centre Investment Map" },
] as const;

export function Tier2NavButtons({ current }: { current?: string }) {
  return (
    <div className="flex flex-wrap gap-3">
      {TIER2_LINKS.filter((t) => t.to !== current).map((t) => (
        <Link
          key={t.to}
          to={t.to}
          className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-electric hover:border-electric transition-colors"
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}

/* ---------------- Score / rating badge ---------------- */

export type RatingLevel = "Low" | "Medium" | "High" | "Very High" | "Severe";

export function RatingBadge({ level }: { level: RatingLevel }) {
  const tone: Record<RatingLevel, string> = {
    Low: "bg-emerald-500/15 text-emerald-700",
    Medium: "bg-amber-500/15 text-amber-700",
    High: "bg-orange-500/15 text-orange-700",
    "Very High": "bg-red-500/15 text-red-700",
    Severe: "bg-red-600/20 text-red-700",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${tone[level]}`}>
      {level}
    </span>
  );
}

/* ---------------- Project type / status helpers (shared by tracker + map) ---------------- */

export const PROJECT_TYPES: Record<string, string> = {
  data_centre: "Data Centre",
  grid_upgrade: "Grid Upgrade",
  battery_storage: "Battery Storage",
  nuclear: "Nuclear",
  renewable_energy: "Renewable Energy",
  ai_campus: "AI Campus",
  fibre_infrastructure: "Fibre Infrastructure",
  substation_upgrade: "Substation Upgrade",
};

export const PROJECT_STATUSES: Record<string, string> = {
  proposed: "Proposed",
  approved: "Approved",
  under_construction: "Under Construction",
  operational: "Operational",
  cancelled: "Cancelled",
};

export const gbpCompact = (v: number | null | undefined) => {
  if (v == null) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(v);
};

export type InfraProject = {
  id: string;
  project_name: string;
  organisation: string | null;
  region: string | null;
  project_type: string;
  status: string;
  estimated_value_gbp: number | null;
  description: string | null;
  source_url: string | null;
  latitude: number | null;
  longitude: number | null;
  is_placeholder: boolean;
  updated_at: string;
};
