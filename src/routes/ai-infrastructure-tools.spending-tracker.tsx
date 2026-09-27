import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { TrendingUp, Search, AlertTriangle, LayoutGrid, Table as TableIcon } from "lucide-react";
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
  EText,
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

export const Route = createFileRoute("/ai-infrastructure-tools/spending-tracker")({
  head: () => ({
    meta: [
      { title: "AI Infrastructure Spending Tracker UK | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Track major UK AI-related infrastructure projects — data centres, grid upgrades, battery storage and more — with search, filters and an investment dashboard.",
      },
      { property: "og:title", content: "AI Infrastructure Spending Tracker UK | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content: "A searchable database of UK AI infrastructure projects and estimated investment.",
      },
      { property: "og:url", content: "https://aienergyintelligence.co.uk/ai-infrastructure-tools/spending-tracker" },
    ],
    links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/ai-infrastructure-tools/spending-tracker" }],
    scripts: [
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"WebApplication\",\"name\":\"AI Infrastructure Spending Tracker UK\",\"applicationCategory\":\"BusinessApplication\",\"operatingSystem\":\"Any\",\"url\":\"https://aienergyintelligence.co.uk/ai-infrastructure-tools/spending-tracker\",\"description\":\"Track major UK AI-related infrastructure projects — data centres, grid upgrades, battery storage and more — with search, filters and an investment dashboard.\",\"offers\":{\"@type\":\"Offer\",\"price\":\"0\",\"priceCurrency\":\"GBP\"},\"publisher\":{\"@type\":\"Organization\",\"name\":\"AI Energy Intelligence UK\"},\"isAccessibleForFree\":true,\"inLanguage\":\"en-GB\"}" },
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"BreadcrumbList\",\"itemListElement\":[{\"@type\":\"ListItem\",\"position\":1,\"name\":\"Home\",\"item\":\"https://aienergyintelligence.co.uk/\"},{\"@type\":\"ListItem\",\"position\":2,\"name\":\"Ai Infrastructure Tools\",\"item\":\"https://aienergyintelligence.co.uk/ai-infrastructure-tools\"},{\"@type\":\"ListItem\",\"position\":3,\"name\":\"Spending Tracker\",\"item\":\"https://aienergyintelligence.co.uk/ai-infrastructure-tools/spending-tracker\"}]}" },
    ],
  }),
  component: SpendingTracker,
});

const fmtDate = (s: string) => new Date(s).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" });

function StatusPill({ status }: { status: string }) {
  const v = status.toLowerCase();
  const tone =
    v === "operational"
      ? "bg-emerald-500/15 text-emerald-700"
      : v === "under_construction"
        ? "bg-electric/15 text-electric"
        : v === "approved"
          ? "bg-amber-500/15 text-amber-700"
          : v === "cancelled"
            ? "bg-red-500/15 text-red-700"
            : "bg-black/5 text-energy-ink/60";
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tone}`}>
      {PROJECT_STATUSES[status] ?? status}
    </span>
  );
}

function SpendingTracker() {
  const [rows, setRows] = useState<InfraProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [q, setQ] = useState("");
  const [region, setRegion] = useState("All");
  const [type, setType] = useState("All");
  const [status, setStatus] = useState("All");
  const [org, setOrg] = useState("All");
  const [sort, setSort] = useState("value_desc");
  const [view, setView] = useState<"cards" | "table">("cards");

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
  const orgs = useMemo(
    () => ["All", ...Array.from(new Set(rows.map((r) => r.organisation).filter(Boolean) as string[])).sort()],
    [rows]
  );

  const filtered = useMemo(() => {
    const out = rows.filter((r) => {
      const text = `${r.project_name} ${r.organisation ?? ""} ${r.region ?? ""} ${r.description ?? ""}`.toLowerCase();
      if (q && !text.includes(q.toLowerCase())) return false;
      if (region !== "All" && r.region !== region) return false;
      if (type !== "All" && r.project_type !== type) return false;
      if (status !== "All" && r.status !== status) return false;
      if (org !== "All" && r.organisation !== org) return false;
      return true;
    });
    out.sort((a, b) => {
      if (sort === "value_desc") return (b.estimated_value_gbp ?? 0) - (a.estimated_value_gbp ?? 0);
      if (sort === "value_asc") return (a.estimated_value_gbp ?? 0) - (b.estimated_value_gbp ?? 0);
      if (sort === "name") return a.project_name.localeCompare(b.project_name);
      if (sort === "updated") return +new Date(b.updated_at) - +new Date(a.updated_at);
      return 0;
    });
    return out;
  }, [rows, q, region, type, status, org, sort]);

  const stats = useMemo(() => {
    const totalValue = filtered.reduce((s, r) => s + (r.estimated_value_gbp ?? 0), 0);
    const byRegion = new Set(filtered.map((r) => r.region).filter(Boolean)).size;
    const underConstruction = filtered.filter((r) => r.status === "under_construction").length;
    return { count: filtered.length, totalValue, byRegion, underConstruction };
  }, [filtered]);

  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "AI Energy Intelligence UK", to: "/" },
          { label: "AI Infrastructure Tools", to: "/ai-infrastructure-tools" },
          { label: "AI Infrastructure Spending Tracker" },
        ]}
      />
      <EnergyHero
        eyebrow="Tool 7"
        title="AI Infrastructure Spending Tracker"
        intro="Track major AI-related infrastructure projects across the UK — data centres, grid upgrades, battery storage, nuclear, renewables and more."
        icon={TrendingUp}
      />

      <EnergyContainer className="py-10 space-y-8">
        <DisclaimerBanner>
          <strong className="text-white">Important:</strong> Investment values and project details should always be
          verified against official announcements. Some entries are placeholders until verified data is added.
        </DisclaimerBanner>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <DataCard label="Total projects" value={`${stats.count}`} accent />
          <DataCard label="Total estimated investment" value={gbpCompact(stats.totalValue)} />
          <DataCard label="Regions covered" value={`${stats.byRegion}`} />
          <DataCard label="Under construction" value={`${stats.underConstruction}`} />
        </div>

        <WhiteCard>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <EField label="Search">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-energy-ink/40" />
                <EText
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Project, organisation or region"
                  style={{ paddingLeft: "2.25rem" }}
                />
              </div>
            </EField>
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
            <EField label="Organisation">
              <ESelect value={org} onChange={(e) => setOrg(e.target.value)}>
                {orgs.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </ESelect>
            </EField>
            <EField label="Sort by">
              <ESelect value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="value_desc">Investment (high to low)</option>
                <option value="value_asc">Investment (low to high)</option>
                <option value="name">Project name</option>
                <option value="updated">Recently updated</option>
              </ESelect>
            </EField>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setView("cards")}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium ${view === "cards" ? "bg-electric text-electric-foreground" : "bg-energy-grey text-energy-ink/70"}`}
            >
              <LayoutGrid className="h-4 w-4" /> Cards
            </button>
            <button
              onClick={() => setView("table")}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium ${view === "table" ? "bg-electric text-electric-foreground" : "bg-energy-grey text-energy-ink/70"}`}
            >
              <TableIcon className="h-4 w-4" /> Table
            </button>
          </div>
        </WhiteCard>

        {loading ? (
          <WhiteCard>
            <div className="p-4 text-center text-energy-ink/60 text-sm">Loading projects…</div>
          </WhiteCard>
        ) : error ? (
          <WhiteCard>
            <div className="p-4 text-center text-energy-ink/60 text-sm">
              The tracker could not be loaded. Please try again later.
            </div>
          </WhiteCard>
        ) : filtered.length === 0 ? (
          <WhiteCard>
            <div className="p-4 text-center text-energy-ink/60 text-sm">No projects match your filters.</div>
          </WhiteCard>
        ) : view === "cards" ? (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((r) => (
              <WhiteCard key={r.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display text-lg font-bold">{r.project_name}</h3>
                      {r.is_placeholder && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                          <AlertTriangle className="h-3 w-3" /> Placeholder
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-energy-ink/60">{r.organisation ?? "Unknown organisation"}</p>
                  </div>
                  <StatusPill status={r.status} />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="text-energy-ink/50 text-xs">Region</div>
                    <div className="font-medium">{r.region ?? "—"}</div>
                  </div>
                  <div>
                    <div className="text-energy-ink/50 text-xs">Type</div>
                    <div className="font-medium">{PROJECT_TYPES[r.project_type] ?? r.project_type}</div>
                  </div>
                  <div>
                    <div className="text-energy-ink/50 text-xs">Estimated value</div>
                    <div className="font-medium">{gbpCompact(r.estimated_value_gbp)}</div>
                  </div>
                </div>
                {r.description && <p className="mt-3 text-sm text-energy-ink/70">{r.description}</p>}
                <div className="mt-3 flex items-center justify-between text-xs text-energy-ink/50">
                  <span>Updated {fmtDate(r.updated_at)}</span>
                  {r.source_url && (
                    <a href={r.source_url} target="_blank" rel="noopener noreferrer" className="text-electric hover:underline">
                      Source
                    </a>
                  )}
                </div>
              </WhiteCard>
            ))}
          </div>
        ) : (
          <WhiteCard className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-energy-grey text-energy-ink/70 text-left">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Project</th>
                    <th className="px-4 py-3 font-semibold">Organisation</th>
                    <th className="px-4 py-3 font-semibold">Region</th>
                    <th className="px-4 py-3 font-semibold">Type</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {filtered.map((r) => (
                    <tr key={r.id} className="align-top">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-energy-ink flex items-center gap-2">
                          {r.project_name}
                          {r.is_placeholder && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                              <AlertTriangle className="h-3 w-3" /> Placeholder
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-energy-ink/70">{r.organisation ?? "—"}</td>
                      <td className="px-4 py-3 text-energy-ink/70">{r.region ?? "—"}</td>
                      <td className="px-4 py-3 text-energy-ink/70">{PROJECT_TYPES[r.project_type] ?? r.project_type}</td>
                      <td className="px-4 py-3">
                        <StatusPill status={r.status} />
                      </td>
                      <td className="px-4 py-3 text-energy-ink/70">{gbpCompact(r.estimated_value_gbp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </WhiteCard>
        )}

        <SeoSection title="How It Works">
          <p>
            Projects are stored in our database and can be updated over time without rebuilding the site. Each record
            holds a project name, organisation, region, type, status, estimated value, description, source link and a
            last-updated date. Use the search, filters and sort controls to explore, and switch between card and table
            views.
          </p>
        </SeoSection>

        <SeoSection title="Why It Matters">
          <p>
            The scale of UK AI infrastructure investment is significant and growing. Tracking projects in one place helps
            journalists, researchers and analysts understand where capital is flowing, which regions are most active and
            how the pipeline is progressing.
          </p>
        </SeoSection>

        <SeoSection title="Limitations">
          <p>
            Investment values and project details are indicative and should always be verified against official
            announcements. Some entries are clearly marked as placeholders until verified data is added.
          </p>
        </SeoSection>

        <Tier2RelatedContent tool="spending-tracker" />

        <EnergyFAQ
          items={[
            {
              q: "Why are governments investing in AI infrastructure?",
              a: "AI is seen as economically strategic. Supporting data centres, grids and energy capacity aims to attract investment, create jobs and keep nations competitive.",
            },
            {
              q: "What projects are currently being built?",
              a: "The tracker lists data centres, grid upgrades, storage and related projects at various stages. Always verify entries against official sources before relying on them.",
            },
            {
              q: "Why do AI projects need so much electricity?",
              a: "AI accelerators draw substantial continuous power and require energy-intensive cooling, so large facilities can rival the demand of sizeable towns.",
            },
          ]}
        />

        <div>
          <h3 className="font-display text-lg font-bold text-white mb-4">Explore more AI infrastructure tools</h3>
          <Tier2NavButtons current="/ai-infrastructure-tools/spending-tracker" />
        </div>
      </EnergyContainer>
    </EnergyShell>
  );
}
