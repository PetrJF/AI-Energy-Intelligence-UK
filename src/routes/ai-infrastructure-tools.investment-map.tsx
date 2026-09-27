import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Map as MapIcon, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  EnergyShell,
  EnergyContainer,
  EnergyHero,
  Breadcrumb,
  DisclaimerBanner,
  WhiteCard,
  DataCard,
  SeoSection,
  EnergyFAQ,
  EField,
  ESelect,
} from "@/components/energy/EnergyUI";
import {
  Tier2RelatedContent,
  Tier2NavButtons,
  PROJECT_TYPES,
  PROJECT_STATUSES,
  gbpCompact,
  type InfraProject,
} from "@/components/energy/Tier2UI";

export const Route = createFileRoute("/ai-infrastructure-tools/investment-map")({
  head: () => ({
    meta: [
      { title: "AI Data Centre Investment Map UK | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "A visual UK map of major AI and data centre investment locations — existing and planned data centres, AI campuses, grid, battery and substation projects.",
      },
      { property: "og:title", content: "AI Data Centre Investment Map UK | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content: "Explore where UK AI and data centre investment is concentrated on an interactive map.",
      },
      { property: "og:url", content: "https://aienergyintelligence.co.uk/ai-infrastructure-tools/investment-map" },
    ],
    links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/ai-infrastructure-tools/investment-map" }],
    scripts: [
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"WebApplication\",\"name\":\"AI Data Centre Investment Map UK\",\"applicationCategory\":\"BusinessApplication\",\"operatingSystem\":\"Any\",\"url\":\"https://aienergyintelligence.co.uk/ai-infrastructure-tools/investment-map\",\"description\":\"A visual UK map of major AI and data centre investment locations — existing and planned data centres, AI campuses, grid, battery and substation projects.\",\"offers\":{\"@type\":\"Offer\",\"price\":\"0\",\"priceCurrency\":\"GBP\"},\"publisher\":{\"@type\":\"Organization\",\"name\":\"AI Energy Intelligence UK\"},\"isAccessibleForFree\":true,\"inLanguage\":\"en-GB\"}" },
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"BreadcrumbList\",\"itemListElement\":[{\"@type\":\"ListItem\",\"position\":1,\"name\":\"Home\",\"item\":\"https://aienergyintelligence.co.uk/\"},{\"@type\":\"ListItem\",\"position\":2,\"name\":\"Ai Infrastructure Tools\",\"item\":\"https://aienergyintelligence.co.uk/ai-infrastructure-tools\"},{\"@type\":\"ListItem\",\"position\":3,\"name\":\"Investment Map\",\"item\":\"https://aienergyintelligence.co.uk/ai-infrastructure-tools/investment-map\"}]}" },
    ],
  }),
  component: InvestmentMap,
});

// UK lat/lng bounding box for a simple SVG projection.
const LAT_MAX = 59;
const LAT_MIN = 50;
const LNG_MIN = -8;
const LNG_MAX = 2;

function project(lat: number, lng: number) {
  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * 100;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * 100;
  return { x: Math.max(2, Math.min(98, x)), y: Math.max(2, Math.min(98, y)) };
}

const TYPE_COLOUR: Record<string, string> = {
  data_centre: "#2563eb",
  ai_campus: "#7c3aed",
  grid_upgrade: "#f59e0b",
  battery_storage: "#10b981",
  substation_upgrade: "#ef4444",
  nuclear: "#0ea5e9",
  renewable_energy: "#22c55e",
  fibre_infrastructure: "#64748b",
};

function InvestmentMap() {
  const [rows, setRows] = useState<InfraProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [region, setRegion] = useState("All");
  const [type, setType] = useState("All");
  const [status, setStatus] = useState("All");
  const [minValue, setMinValue] = useState("0");
  const [selected, setSelected] = useState<InfraProject | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("infrastructure_projects" as any)
        .select("*")
        .order("estimated_value_gbp", { ascending: false, nullsFirst: false });
      if (!active) return;
      if (error) setError(true);
      else setRows((data as unknown as InfraProject[]) ?? []);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const regions = useMemo(
    () => ["All", ...Array.from(new Set(rows.map((r) => r.region).filter(Boolean) as string[])).sort()],
    [rows]
  );

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        if (region !== "All" && r.region !== region) return false;
        if (type !== "All" && r.project_type !== type) return false;
        if (status !== "All" && r.status !== status) return false;
        if (+minValue > 0 && (r.estimated_value_gbp ?? 0) < +minValue) return false;
        return true;
      }),
    [rows, region, type, status, minValue]
  );

  const mapped = filtered.filter((r) => r.latitude != null && r.longitude != null);

  const stats = useMemo(() => {
    const totalValue = filtered.reduce((s, r) => s + (r.estimated_value_gbp ?? 0), 0);
    const underConstruction = filtered.filter((r) => r.status === "under_construction").length;
    const operational = filtered.filter((r) => r.status === "operational").length;
    return { count: filtered.length, totalValue, underConstruction, operational };
  }, [filtered]);

  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "AI Energy Intelligence UK", to: "/" },
          { label: "AI Infrastructure Tools", to: "/ai-infrastructure-tools" },
          { label: "AI Data Centre Investment Map" },
        ]}
      />
      <EnergyHero
        eyebrow="Tool 10"
        title="AI Data Centre Investment Map"
        intro="A visual UK map showing major AI and data centre investment locations, including existing and planned data centres, AI campuses, grid, battery and substation projects."
        icon={MapIcon}
      />

      <EnergyContainer className="py-10 space-y-8">
        <DisclaimerBanner>
          <strong className="text-white">Important:</strong> Locations and investment values are indicative and should be
          verified against official announcements. Some entries are placeholders until verified data is added.
        </DisclaimerBanner>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <DataCard label="Total known projects" value={`${stats.count}`} accent />
          <DataCard label="Total estimated investment" value={gbpCompact(stats.totalValue)} />
          <DataCard label="Under construction" value={`${stats.underConstruction}`} />
          <DataCard label="Operational facilities" value={`${stats.operational}`} />
        </div>

        <WhiteCard>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <EField label="Region">
              <ESelect value={region} onChange={(e) => setRegion(e.target.value)}>
                {regions.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </ESelect>
            </EField>
            <EField label="Project type">
              <ESelect value={type} onChange={(e) => setType(e.target.value)}>
                <option value="All">All</option>
                {Object.entries(PROJECT_TYPES).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </ESelect>
            </EField>
            <EField label="Status">
              <ESelect value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="All">All</option>
                {Object.entries(PROJECT_STATUSES).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </ESelect>
            </EField>
            <EField label="Minimum estimated investment">
              <ESelect value={minValue} onChange={(e) => setMinValue(e.target.value)}>
                <option value="0">Any</option>
                <option value="50000000">£50m+</option>
                <option value="100000000">£100m+</option>
                <option value="500000000">£500m+</option>
                <option value="1000000000">£1bn+</option>
              </ESelect>
            </EField>
          </div>
        </WhiteCard>

        <div className="grid lg:grid-cols-5 gap-6">
          <WhiteCard className="lg:col-span-3 p-4">
            {loading ? (
              <div className="aspect-[3/4] flex items-center justify-center text-energy-ink/60 text-sm">Loading map…</div>
            ) : error ? (
              <div className="aspect-[3/4] flex items-center justify-center text-energy-ink/60 text-sm">
                The map could not be loaded. Please try again later.
              </div>
            ) : (
              <div className="relative w-full aspect-[3/4] rounded-xl bg-energy-grey overflow-hidden border border-black/5">
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                  {mapped.map((r) => {
                    const { x, y } = project(r.latitude!, r.longitude!);
                    const isSel = selected?.id === r.id;
                    return (
                      <g key={r.id} onClick={() => setSelected(r)} style={{ cursor: "pointer" }}>
                        <circle
                          cx={x}
                          cy={y}
                          r={isSel ? 2.6 : 1.8}
                          fill={TYPE_COLOUR[r.project_type] ?? "#2563eb"}
                          stroke="#fff"
                          strokeWidth={0.4}
                          opacity={0.9}
                        />
                      </g>
                    );
                  })}
                </svg>
                {mapped.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-energy-ink/50 text-sm">
                    No mappable projects match your filters.
                  </div>
                )}
              </div>
            )}
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-energy-ink/70">
              {Object.entries(PROJECT_TYPES).map(([k, v]) => (
                <span key={k} className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: TYPE_COLOUR[k] }} />
                  {v}
                </span>
              ))}
            </div>
          </WhiteCard>

          <WhiteCard className="lg:col-span-2">
            <h3 className="font-display text-lg font-bold">Selected project</h3>
            {selected ? (
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-base">{selected.project_name}</span>
                  {selected.is_placeholder && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                      <AlertTriangle className="h-3 w-3" /> Placeholder
                    </span>
                  )}
                </div>
                <div className="text-energy-ink/60">{selected.organisation ?? "Unknown organisation"}</div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div>
                    <div className="text-energy-ink/50 text-xs">Region</div>
                    <div className="font-medium">{selected.region ?? "—"}</div>
                  </div>
                  <div>
                    <div className="text-energy-ink/50 text-xs">Type</div>
                    <div className="font-medium">{PROJECT_TYPES[selected.project_type] ?? selected.project_type}</div>
                  </div>
                  <div>
                    <div className="text-energy-ink/50 text-xs">Status</div>
                    <div className="font-medium">{PROJECT_STATUSES[selected.status] ?? selected.status}</div>
                  </div>
                  <div>
                    <div className="text-energy-ink/50 text-xs">Estimated value</div>
                    <div className="font-medium">{gbpCompact(selected.estimated_value_gbp)}</div>
                  </div>
                </div>
                {selected.description && <p className="text-energy-ink/70 pt-1">{selected.description}</p>}
                {selected.source_url && (
                  <a
                    href={selected.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-electric hover:underline"
                  >
                    Source
                  </a>
                )}
              </div>
            ) : (
              <p className="mt-3 text-sm text-energy-ink/60">
                Select a marker on the map to view project details, or use the list below.
              </p>
            )}
          </WhiteCard>
        </div>

        <WhiteCard className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-energy-grey text-energy-ink/70 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Project</th>
                  <th className="px-4 py-3 font-semibold">Region</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    className="align-top cursor-pointer hover:bg-energy-grey/60"
                    onClick={() => setSelected(r)}
                  >
                    <td className="px-4 py-3 font-semibold text-energy-ink">{r.project_name}</td>
                    <td className="px-4 py-3 text-energy-ink/70">{r.region ?? "—"}</td>
                    <td className="px-4 py-3 text-energy-ink/70">{PROJECT_TYPES[r.project_type] ?? r.project_type}</td>
                    <td className="px-4 py-3 text-energy-ink/70">{PROJECT_STATUSES[r.status] ?? r.status}</td>
                    <td className="px-4 py-3 text-energy-ink/70">{gbpCompact(r.estimated_value_gbp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </WhiteCard>

        <SeoSection title="How It Works">
          <p>
            Projects are stored in our database and plotted by their latitude and longitude on a simplified UK map. Use
            the filters to narrow by region, type, status and minimum investment. Markers are colour-coded by project
            type, and selecting one shows its full details. Data can be updated over time without rebuilding the site.
          </p>
        </SeoSection>

        <SeoSection title="Why It Matters">
          <p>
            Seeing investment geographically reveals where AI and data centre activity is concentrating, which regions
            are attracting capital and how close major developments are to population centres, grid capacity and energy
            resources.
          </p>
        </SeoSection>

        <SeoSection title="Limitations">
          <p>
            The map uses a simplified projection and indicative coordinates. Locations and investment values should be
            verified against official announcements, and some entries are placeholders until verified data is added.
          </p>
        </SeoSection>

        <Tier2RelatedContent tool="investment-map" />

        <EnergyFAQ
          items={[
            {
              q: "Where are new UK data centres being built?",
              a: "Activity has historically clustered around London and the South East, with growing interest in regions offering land, power and grid capacity. Verify specific sites against official sources.",
            },
            {
              q: "Which regions are attracting AI investment?",
              a: "Regions with available power, land and strong connectivity tend to attract the most interest. The map highlights where listed projects are concentrated.",
            },
            {
              q: "Why are energy-rich locations attractive?",
              a: "AI facilities need large, reliable power supplies. Locations near generation, grid capacity or renewable resources can reduce constraints and connection delays.",
            },
          ]}
        />

        <div>
          <h3 className="font-display text-lg font-bold text-white mb-4">Explore more AI infrastructure tools</h3>
          <Tier2NavButtons current="/ai-infrastructure-tools/investment-map" />
        </div>
      </EnergyContainer>
    </EnergyShell>
  );
}
