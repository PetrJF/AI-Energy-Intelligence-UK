import { Link } from "@tanstack/react-router";
import { SeoSection } from "./EnergyUI";
import { RELATED_ADVANCED, type AdvancedKey } from "./relatedLinks";
import { RelatedLinkRow } from "./RelatedLinkRow";

/* ---------------- Tier 3 related content ---------------- */

export function Tier3RelatedContent({ tool }: { tool: AdvancedKey }) {
  const rows = RELATED_ADVANCED[tool];
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

/* ---------------- Tier 3 cross-tool navigation ---------------- */

const TIER3_LINKS = [
  { to: "/advanced-ai-energy-tools/carbon-impact", label: "AI Carbon Impact Calculator" },
  { to: "/advanced-ai-energy-tools/water-usage", label: "AI Water Usage Calculator" },
  { to: "/advanced-ai-energy-tools/grid-capacity", label: "AI Grid Capacity Checker" },
  { to: "/advanced-ai-energy-tools/demand-modeller", label: "AI Electricity Demand Modeller" },
  { to: "/advanced-ai-energy-tools/energy-cost-society", label: "AI Energy Cost To Society Calculator" },
  { to: "/advanced-ai-energy-tools/scenario-comparison", label: "Scenario Comparison Dashboard" },
] as const;

export function Tier3NavButtons({ current }: { current?: string }) {
  return (
    <div className="flex flex-wrap gap-3">
      {TIER3_LINKS.filter((t) => t.to !== current).map((t) => (
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

/* ---------------- Index levels ---------------- */

export type IndexLevel = "Low" | "Medium" | "High" | "Very High";

export function scoreToIndex(score: number): IndexLevel {
  if (score < 25) return "Low";
  if (score < 50) return "Medium";
  if (score < 75) return "High";
  return "Very High";
}

const LEVEL_TONE: Record<IndexLevel, string> = {
  Low: "text-emerald-600",
  Medium: "text-amber-600",
  High: "text-orange-600",
  "Very High": "text-red-600",
};

const LEVEL_STROKE: Record<IndexLevel, string> = {
  Low: "#059669",
  Medium: "#d97706",
  High: "#ea580c",
  "Very High": "#dc2626",
};

/* ---------------- Semi-circular gauge (data-viz) ---------------- */

export function Gauge({
  label,
  score,
  sub,
}: {
  label: string;
  score: number;
  sub?: string;
}) {
  const clamped = Math.max(0, Math.min(100, score));
  const level = scoreToIndex(clamped);
  const radius = 52;
  const circ = Math.PI * radius; // semicircle length
  const dash = (clamped / 100) * circ;

  return (
    <div className="rounded-xl bg-energy-card text-energy-ink p-5 border border-black/5 shadow-card flex flex-col items-center">
      <svg viewBox="0 0 140 80" className="w-full max-w-[180px]">
        <path
          d="M 14 74 A 56 56 0 0 1 126 74"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 14 74 A 56 56 0 0 1 126 74"
          fill="none"
          stroke={LEVEL_STROKE[level]}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: "stroke-dasharray 0.5s ease" }}
        />
        <text x="70" y="60" textAnchor="middle" className="fill-energy-ink" fontSize="22" fontWeight="700">
          {Math.round(clamped)}
        </text>
      </svg>
      <div className="mt-1 text-center">
        <div className={`text-sm font-bold ${LEVEL_TONE[level]}`}>{level}</div>
        <div className="text-xs font-semibold uppercase tracking-wider text-energy-ink/60 mt-0.5">{label}</div>
        {sub && <div className="text-xs text-energy-ink/50 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

/* ---------------- Index summary card (for dashboard) ---------------- */

export function IndexCard({ label, level, hint }: { label: string; level: IndexLevel; hint?: string }) {
  return (
    <div className="rounded-xl bg-energy-card text-energy-ink p-5 border border-black/5 shadow-card">
      <div className="text-xs font-semibold uppercase tracking-wider text-energy-ink/60">{label}</div>
      <div className={`mt-2 font-display text-2xl font-bold ${LEVEL_TONE[level]}`}>{level}</div>
      <div className="mt-3 flex gap-1">
        {(["Low", "Medium", "High", "Very High"] as IndexLevel[]).map((l) => {
          const active =
            ["Low", "Medium", "High", "Very High"].indexOf(l) <=
            ["Low", "Medium", "High", "Very High"].indexOf(level);
          return (
            <span
              key={l}
              className="h-1.5 flex-1 rounded-full"
              style={{ background: active ? LEVEL_STROKE[level] : "#e5e7eb" }}
            />
          );
        })}
      </div>
      {hint && <div className="mt-2 text-xs text-energy-ink/50">{hint}</div>}
    </div>
  );
}

/* ---------------- Simple bar / trend chart (data-viz) ---------------- */

export function TrendChart({
  data,
  unit = "",
  color = "#2563eb",
}: {
  data: { label: string; value: number }[];
  unit?: string;
  color?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const w = 100 / data.length;
  return (
    <div className="rounded-xl bg-energy-card text-energy-ink p-5 border border-black/5 shadow-card">
      <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="w-full h-40">
        {data.map((d, i) => {
          const h = (d.value / max) * 50;
          return (
            <g key={d.label}>
              <rect
                x={i * w + w * 0.18}
                y={56 - h}
                width={w * 0.64}
                height={h}
                rx="0.8"
                fill={color}
                opacity={0.85}
              />
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex justify-between text-[10px] text-energy-ink/50">
        {data.map((d) => (
          <span key={d.label} className="flex-1 text-center">
            {d.label}
          </span>
        ))}
      </div>
      <div className="mt-1 text-center text-xs text-energy-ink/60">
        Peak: {max.toLocaleString("en-GB")} {unit}
      </div>
    </div>
  );
}

/* ---------------- shared option lists ---------------- */

export const USAGE_LEVELS = ["Light", "Medium", "Heavy"] as const;
export const LOW_MED_HIGH = ["Low", "Medium", "High"] as const;
