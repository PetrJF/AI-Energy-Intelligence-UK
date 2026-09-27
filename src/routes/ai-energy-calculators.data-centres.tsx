import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Server, Search, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  EnergyShell,
  EnergyContainer,
  EnergyHero,
  Breadcrumb,
  DisclaimerBanner,
  WhiteCard,
  SeoSection,
  RelatedContent,
  ToolNavButtons,
  EnergyFAQ,
  EField,
  EText,
  ESelect,
} from "@/components/energy/EnergyUI";

export const Route = createFileRoute("/ai-energy-calculators/data-centres")({
  head: () => ({
    meta: [
      { title: "UK AI Data Centre Map & Directory | AI Energy Intelligence UK" },
      {
        name: "description",
        content:
          "Search a UK directory of AI-related data centres by region, status, AI relevance and energy pressure. Some entries are placeholders until verified.",
      },
      { property: "og:title", content: "UK AI Data Centre Map & Directory | AI Energy Intelligence UK" },
      {
        property: "og:description",
        content: "A searchable, filterable directory of UK AI-related data centres.",
      },
      { property: "og:url", content: "https://aienergyintelligence.co.uk/ai-energy-calculators/data-centres" },
    ],
    links: [{ rel: "canonical", href: "https://aienergyintelligence.co.uk/ai-energy-calculators/data-centres" }],
    scripts: [
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"WebApplication\",\"name\":\"UK AI Data Centre Map & Directory\",\"applicationCategory\":\"BusinessApplication\",\"operatingSystem\":\"Any\",\"url\":\"https://aienergyintelligence.co.uk/ai-energy-calculators/data-centres\",\"description\":\"Search a UK directory of AI-related data centres by region, status, AI relevance and energy pressure. Some entries are placeholders until verified.\",\"offers\":{\"@type\":\"Offer\",\"price\":\"0\",\"priceCurrency\":\"GBP\"},\"publisher\":{\"@type\":\"Organization\",\"name\":\"AI Energy Intelligence UK\"},\"isAccessibleForFree\":true,\"inLanguage\":\"en-GB\"}" },
      { type: "application/ld+json", children: "{\"@context\":\"https://schema.org\",\"@type\":\"BreadcrumbList\",\"itemListElement\":[{\"@type\":\"ListItem\",\"position\":1,\"name\":\"Home\",\"item\":\"https://aienergyintelligence.co.uk/\"},{\"@type\":\"ListItem\",\"position\":2,\"name\":\"Ai Energy Calculators\",\"item\":\"https://aienergyintelligence.co.uk/ai-energy-calculators\"},{\"@type\":\"ListItem\",\"position\":3,\"name\":\"Data Centres\",\"item\":\"https://aienergyintelligence.co.uk/ai-energy-calculators/data-centres\"}]}" },
    ],
  }),
  component: DataCentreDirectory,
});

type DataCentre = {
  id: string;
  location_name: string;
  town: string | null;
  region: string | null;
  status: string;
  ai_relevance: string;
  energy_pressure: string;
  notes: string | null;
  source_url: string | null;
  is_placeholder: boolean;
  updated_at: string;
};

const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "Unknown");

function Pill({ value }: { value: string }) {
  const v = value.toLowerCase();
  const tone =
    v === "high"
      ? "bg-electric/15 text-electric"
      : v === "medium"
        ? "bg-amber-500/15 text-amber-700"
        : v === "low"
          ? "bg-emerald-500/15 text-emerald-700"
          : "bg-black/5 text-energy-ink/60";
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tone}`}>{cap(value)}</span>;
}

function DataCentreDirectory() {
  const [rows, setRows] = useState<DataCentre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [q, setQ] = useState("");
  const [region, setRegion] = useState("All");
  const [status, setStatus] = useState("All");
  const [pressure, setPressure] = useState("All");
  const [relevance, setRelevance] = useState("All");

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("data_centres" as any)
        .select("*")
        .order("location_name", { ascending: true });
      if (!active) return;
      if (error) {
        setError(true);
      } else {
        setRows((data as unknown as DataCentre[]) ?? []);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const regions = useMemo(
    () => ["All", ...Array.from(new Set(rows.map((r) => r.region).filter(Boolean) as string[]))],
    [rows]
  );

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const text = `${r.location_name} ${r.town ?? ""} ${r.region ?? ""} ${r.notes ?? ""}`.toLowerCase();
        if (q && !text.includes(q.toLowerCase())) return false;
        if (region !== "All" && r.region !== region) return false;
        if (status !== "All" && r.status !== status.toLowerCase()) return false;
        if (pressure !== "All" && r.energy_pressure !== pressure.toLowerCase()) return false;
        if (relevance !== "All" && r.ai_relevance !== relevance.toLowerCase()) return false;
        return true;
      }),
    [rows, q, region, status, pressure, relevance]
  );

  return (
    <EnergyShell>
      <Breadcrumb
        items={[
          { label: "AI Energy Intelligence UK", to: "/" },
          { label: "AI Energy Tools" },
          { label: "AI Energy Calculators", to: "/ai-energy-calculators" },
          { label: "AI Data Centre Directory" },
        ]}
      />
      <EnergyHero
        eyebrow="Calculator 5"
        title="AI Data Centre Map & Directory"
        intro="Search a UK directory of AI-related data centres by region, status, AI relevance and energy pressure."
        icon={Server}
      />

      <EnergyContainer className="py-10 space-y-8">
        <DisclaimerBanner>
          <strong className="text-white">Some entries may be placeholders until verified data is added.</strong> Do not
          treat unverified locations as confirmed data centres. This directory provides educational information only.
        </DisclaimerBanner>

        <WhiteCard>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <EField label="Search">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-energy-ink/40" />
                <EText
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Location, town or notes"
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
            <EField label="Status">
              <ESelect value={status} onChange={(e) => setStatus(e.target.value)}>
                {["All", "Existing", "Planned", "Proposed", "Unknown"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </ESelect>
            </EField>
            <EField label="Energy pressure">
              <ESelect value={pressure} onChange={(e) => setPressure(e.target.value)}>
                {["All", "Low", "Medium", "High", "Unknown"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </ESelect>
            </EField>
            <EField label="AI relevance">
              <ESelect value={relevance} onChange={(e) => setRelevance(e.target.value)}>
                {["All", "Low", "Medium", "High", "Unknown"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </ESelect>
            </EField>
          </div>
        </WhiteCard>

        <WhiteCard className="p-0 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-energy-ink/60 text-sm">Loading directory…</div>
          ) : error ? (
            <div className="p-8 text-center text-energy-ink/60 text-sm">
              The directory could not be loaded. Please try again later.
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-energy-ink/60 text-sm">No entries match your filters.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-energy-grey text-energy-ink/70 text-left">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Location</th>
                    <th className="px-4 py-3 font-semibold">Region</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">AI relevance</th>
                    <th className="px-4 py-3 font-semibold">Energy pressure</th>
                    <th className="px-4 py-3 font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {filtered.map((r) => (
                    <tr key={r.id} className="align-top">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-energy-ink flex items-center gap-2">
                          {r.location_name}
                          {r.is_placeholder && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                              <AlertTriangle className="h-3 w-3" /> Placeholder
                            </span>
                          )}
                        </div>
                        {r.town && <div className="text-energy-ink/50">{r.town}</div>}
                      </td>
                      <td className="px-4 py-3 text-energy-ink/70">{r.region ?? "—"}</td>
                      <td className="px-4 py-3 text-energy-ink/70">{cap(r.status)}</td>
                      <td className="px-4 py-3">
                        <Pill value={r.ai_relevance} />
                      </td>
                      <td className="px-4 py-3">
                        <Pill value={r.energy_pressure} />
                      </td>
                      <td className="px-4 py-3 text-energy-ink/60 max-w-xs">
                        {r.notes ?? "—"}
                        {r.source_url && (
                          <>
                            {" "}
                            <a
                              href={r.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-electric hover:underline"
                            >
                              Source
                            </a>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </WhiteCard>

        <SeoSection title="How This Directory Works">
          <p>
            Entries are stored in our database and can be updated over time without rebuilding the site. Each record
            includes a location name, town or city, region, status, AI relevance, energy pressure, notes, an optional
            source link and a last-updated date. Use the search and filters above to narrow the list.
          </p>
        </SeoSection>

        <SeoSection title="What The Entries Mean">
          <p>
            <strong>Status</strong> indicates whether a site is existing, planned, proposed or unknown.{" "}
            <strong>AI relevance</strong> and <strong>energy pressure</strong> are educational ratings (low, medium,
            high or unknown) reflecting likely significance to AI workloads and local grid demand.
          </p>
        </SeoSection>

        <SeoSection title="Limitations">
          <p>
            Some entries are placeholders until verified data is added and should not be treated as confirmed data
            centres. Always check primary and official sources before relying on any entry.
          </p>
        </SeoSection>

        <RelatedContent tool="data-centres" />

        <EnergyFAQ
          items={[
            {
              q: "Are all of these confirmed data centres?",
              a: "No. Some entries are clearly marked as placeholders until verified data is added. Do not treat unverified locations as confirmed.",
            },
            {
              q: "How is the directory kept up to date?",
              a: "Entries live in our database and can be edited or added over time without rebuilding the page, so the directory can grow as verified data becomes available.",
            },
          ]}
        />

        <div>
          <h3 className="font-display text-lg font-bold text-white mb-4">Explore more AI energy tools</h3>
          <ToolNavButtons current="/ai-energy-calculators/data-centres" />
        </div>
      </EnergyContainer>
    </EnergyShell>
  );
}
