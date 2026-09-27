import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, ShieldAlert } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  adminGetIndexSections,
  adminUpsertSubindex,
  adminUpsertRegionStat,
  adminUpsertGridRating,
  adminUpsertSource,
  adminSetRecordStatus,
} from "@/lib/index-sections.functions";
import {
  INDEX_REGIONS,
  PRESSURE_LABELS,
  SUBINDEX_META,
  SUBINDEX_SLUGS,
  COMPLETENESS_LABELS,
  regionName,
} from "@/lib/index-sections";

export const Route = createFileRoute("/AIAdmin/energy-index/sections")({
  head: () => ({
    meta: [
      { title: "Index sub-indices, regions and sources — admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SectionsAdmin,
});

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40";
const labelClass = "block text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1";
const cardClass = "rounded-xl border border-border bg-card p-5";

type TabKey = "subindices" | "regions" | "pressure" | "sources";

const TABS: { key: TabKey; label: string }[] = [
  { key: "subindices", label: "Sub-indices" },
  { key: "regions", label: "Regional data" },
  { key: "pressure", label: "Grid pressure" },
  { key: "sources", label: "Sources" },
];

function num(v: FormDataEntryValue | null) {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}
function str(v: FormDataEntryValue | null) {
  return String(v ?? "").trim();
}

function SectionsAdmin() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const qc = useQueryClient();
  const [tab, setTab] = useState<TabKey>("subindices");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/login", search: { redirect: "/AIAdmin/energy-index/sections" } });
    }
  }, [authLoading, user, navigate]);

  const fetchAll = useServerFn(adminGetIndexSections);
  const query = useQuery({
    queryKey: ["admin", "index-sections"],
    queryFn: () => fetchAll(),
    enabled: !!user,
    retry: false,
  });

  const onDone = (label: string) => {
    setError(null);
    setMessage(`${label} saved.`);
    qc.invalidateQueries({ queryKey: ["admin", "index-sections"] });
    qc.invalidateQueries({ queryKey: ["uk-ai-energy-index"] });
  };
  const onFail = (e: unknown) => {
    setMessage(null);
    setError(e instanceof Error ? e.message : "Save failed.");
  };

  const saveSubindex = useMutation({
    mutationFn: useServerFn(adminUpsertSubindex),
    onSuccess: () => onDone("Sub-index"),
    onError: onFail,
  });
  const saveRegion = useMutation({
    mutationFn: useServerFn(adminUpsertRegionStat),
    onSuccess: () => onDone("Regional record"),
    onError: onFail,
  });
  const saveRating = useMutation({
    mutationFn: useServerFn(adminUpsertGridRating),
    onSuccess: () => onDone("Pressure rating"),
    onError: onFail,
  });
  const saveSource = useMutation({
    mutationFn: useServerFn(adminUpsertSource),
    onSuccess: () => onDone("Source"),
    onError: onFail,
  });
  const setStatus = useMutation({
    mutationFn: useServerFn(adminSetRecordStatus),
    onSuccess: () => onDone("Status"),
    onError: onFail,
  });

  if (authLoading || (!!user && query.isLoading)) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <ShieldAlert className="mx-auto h-8 w-8 text-muted-foreground" />
        <h1 className="mt-4 font-display text-2xl font-bold">Admin access required</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account cannot manage the UK AI Energy Index sections.
        </p>
      </div>
    );
  }

  const data = query.data;
  const subindices = data?.subindices ?? [];
  const regionStats = data?.regionStats ?? [];
  const gridRatings = data?.gridRatings ?? [];
  const sources = data?.sources ?? [];
  const busy =
    saveSubindex.isPending ||
    saveRegion.isPending ||
    saveRating.isPending ||
    saveSource.isPending ||
    setStatus.isPending;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        to="/AIAdmin/energy-index"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to index admin
      </Link>

      <h1 className="mt-4 font-display text-3xl font-bold">Sub-indices, regions and sources</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Everything here is entered by hand. Records save as drafts by default; only published
        records appear on the public index. Nothing is deleted &mdash; unpublish instead.
      </p>

      {message ? (
        <p className="mt-4 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm">
          {message}
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-2 border-b border-border pb-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              tab === t.key ? "bg-brand text-brand-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "subindices" ? (
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {SUBINDEX_SLUGS.map((slug) => {
            const record = subindices.find((s) => s.slug === slug);
            return (
              <form
                key={slug}
                className={cardClass}
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  saveSubindex.mutate({
                    data: {
                      ...(record?.id ? { id: record.id } : {}),
                      slug,
                      name: SUBINDEX_META[slug].name,
                      intro: str(f.get("intro")),
                      status_label: str(f.get("status_label")) || "Baseline in development",
                      score: num(f.get("score")),
                      direction: str(f.get("direction")) as "rising" | "stable" | "falling" | "unknown",
                      period_label: str(f.get("period_label")),
                      last_reviewed_at: str(f.get("last_reviewed_at")),
                      display_order: Number(f.get("display_order") ?? 0) || 0,
                      status: str(f.get("status")) as "draft" | "published",
                    },
                  });
                }}
              >
                <h2 className="font-semibold">{SUBINDEX_META[slug].name}</h2>
                <div className="mt-3 space-y-3">
                  <div>
                    <label className={labelClass} htmlFor={`intro-${slug}`}>Intro</label>
                    <textarea id={`intro-${slug}`} name="intro" rows={3} defaultValue={record?.intro ?? ""} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor={`status_label-${slug}`}>Status label</label>
                    <input id={`status_label-${slug}`} name="status_label" defaultValue={record?.status_label ?? "Baseline in development"} className={inputClass} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass} htmlFor={`score-${slug}`}>Score (optional)</label>
                      <input id={`score-${slug}`} name="score" type="number" step="0.1" defaultValue={record?.score ?? ""} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor={`direction-${slug}`}>Direction</label>
                      <select id={`direction-${slug}`} name="direction" defaultValue={record?.direction ?? "unknown"} className={inputClass}>
                        <option value="unknown">Unknown</option>
                        <option value="rising">Rising</option>
                        <option value="stable">Stable</option>
                        <option value="falling">Falling</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass} htmlFor={`period-${slug}`}>Period label</label>
                      <input id={`period-${slug}`} name="period_label" defaultValue={record?.period_label ?? ""} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor={`reviewed-${slug}`}>Last reviewed</label>
                      <input id={`reviewed-${slug}`} name="last_reviewed_at" type="date" defaultValue={record?.last_reviewed_at ?? ""} className={inputClass} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass} htmlFor={`order-${slug}`}>Order</label>
                      <input id={`order-${slug}`} name="display_order" type="number" defaultValue={record?.display_order ?? 0} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor={`status-${slug}`}>Status</label>
                      <select id={`status-${slug}`} name="status" defaultValue={record?.status ?? "draft"} className={inputClass}>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button type="submit" disabled={busy} className="mt-4 w-full rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground disabled:opacity-60">
                  Save
                </button>
              </form>
            );
          })}
        </div>
      ) : null}

      {tab === "regions" ? (
        <RegionForm
          busy={busy}
          stats={regionStats}
          onSave={(payload) => saveRegion.mutate({ data: payload })}
          onStatus={(id, status) =>
            setStatus.mutate({ data: { table: "dc_region_stats", id, status } })
          }
        />
      ) : null}

      {tab === "pressure" ? (
        <PressureForm
          busy={busy}
          ratings={gridRatings}
          onSave={(payload) => saveRating.mutate({ data: payload })}
          onStatus={(id, status) =>
            setStatus.mutate({ data: { table: "grid_pressure_ratings", id, status } })
          }
        />
      ) : null}

      {tab === "sources" ? (
        <SourceForm
          busy={busy}
          sources={sources}
          onSave={(payload) => saveSource.mutate({ data: payload })}
          onStatus={(id, status) =>
            setStatus.mutate({ data: { table: "index_sources", id, status } })
          }
        />
      ) : null}
    </div>
  );
}

function RegionPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className={labelClass} htmlFor="region-picker">Region</label>
      <select id="region-picker" value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
        {INDEX_REGIONS.map((r) => (
          <option key={r.slug} value={r.slug}>{r.name}</option>
        ))}
      </select>
    </div>
  );
}

function RegionForm({
  busy,
  stats,
  onSave,
  onStatus,
}: {
  busy: boolean;
  stats: { id: string; region_slug: string; status: string; [k: string]: unknown }[];
  onSave: (payload: Record<string, unknown>) => void;
  onStatus: (id: string, status: "draft" | "published") => void;
}) {
  const [region, setRegion] = useState(INDEX_REGIONS[0]!.slug);
  const record = stats.find((s) => s.region_slug === region) as Record<string, any> | undefined;

  return (
    <form
      key={region}
      className={`${cardClass} mt-6`}
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        onSave({
          ...(record?.id ? { id: record.id } : {}),
          region_slug: region,
          operational_count: num(f.get("operational_count")),
          under_construction_count: num(f.get("under_construction_count")),
          approved_count: num(f.get("approved_count")),
          proposed_count: num(f.get("proposed_count")),
          operational_mw: num(f.get("operational_mw")),
          development_mw: num(f.get("development_mw")),
          hyperscale_count: num(f.get("hyperscale_count")),
          latest_decision: str(f.get("latest_decision")),
          latest_decision_date: str(f.get("latest_decision_date")),
          data_completeness: str(f.get("data_completeness")),
          notes: str(f.get("notes")),
          last_reviewed_at: str(f.get("last_reviewed_at")),
          status: str(f.get("status")),
        });
      }}
    >
      <RegionPicker value={region} onChange={setRegion} />
      <p className="mt-2 text-xs text-muted-foreground">
        Leave a field blank where no verified figure exists &mdash; the public page shows a dash
        rather than a guess.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {[
          ["operational_count", "Operational"],
          ["under_construction_count", "Under construction"],
          ["approved_count", "Approved"],
          ["proposed_count", "Proposed"],
          ["hyperscale_count", "Hyperscale"],
        ].map(([name, label]) => (
          <div key={name}>
            <label className={labelClass} htmlFor={name}>{label}</label>
            <input id={name} name={name} type="number" defaultValue={record?.[name!] ?? ""} className={inputClass} />
          </div>
        ))}
        <div>
          <label className={labelClass} htmlFor="operational_mw">Operational MW</label>
          <input id="operational_mw" name="operational_mw" type="number" step="0.1" defaultValue={record?.["operational_mw"] ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="development_mw">Development MW</label>
          <input id="development_mw" name="development_mw" type="number" step="0.1" defaultValue={record?.["development_mw"] ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="data_completeness">Data completeness</label>
          <select id="data_completeness" name="data_completeness" defaultValue={record?.["data_completeness"] ?? "none"} className={inputClass}>
            {Object.entries(COMPLETENESS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="last_reviewed_at">Last reviewed</label>
          <input id="last_reviewed_at" name="last_reviewed_at" type="date" defaultValue={record?.["last_reviewed_at"] ?? ""} className={inputClass} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="latest_decision">Latest planning decision</label>
          <input id="latest_decision" name="latest_decision" defaultValue={record?.["latest_decision"] ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="latest_decision_date">Decision date</label>
          <input id="latest_decision_date" name="latest_decision_date" type="date" defaultValue={record?.["latest_decision_date"] ?? ""} className={inputClass} />
        </div>
      </div>

      <div className="mt-4">
        <label className={labelClass} htmlFor="notes">Notes</label>
        <textarea id="notes" name="notes" rows={3} defaultValue={record?.["notes"] ?? ""} className={inputClass} />
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <div className="w-40">
          <label className={labelClass} htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={record?.["status"] ?? "draft"} className={inputClass}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <button type="submit" disabled={busy} className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground disabled:opacity-60">
          Save {regionName(region)}
        </button>
        {record?.id ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => onStatus(record.id, record["status"] === "published" ? "draft" : "published")}
            className="rounded-md border border-border px-4 py-2 text-sm"
          >
            {record["status"] === "published" ? "Unpublish" : "Publish"}
          </button>
        ) : null}
      </div>
    </form>
  );
}

function PressureForm({
  busy,
  ratings,
  onSave,
  onStatus,
}: {
  busy: boolean;
  ratings: { id: string; region_slug: string; status: string; [k: string]: unknown }[];
  onSave: (payload: Record<string, unknown>) => void;
  onStatus: (id: string, status: "draft" | "published") => void;
}) {
  const [region, setRegion] = useState(INDEX_REGIONS[0]!.slug);
  const record = ratings.find((r) => r.region_slug === region) as Record<string, any> | undefined;

  return (
    <form
      key={region}
      className={`${cardClass} mt-6`}
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        onSave({
          ...(record?.id ? { id: record.id } : {}),
          region_slug: region,
          rating: str(f.get("rating")),
          rationale: str(f.get("rationale")),
          connection_demand_evidence: str(f.get("connection_demand_evidence")),
          known_delays: str(f.get("known_delays")),
          network_constraints: str(f.get("network_constraints")),
          planned_investment: str(f.get("planned_investment")),
          flexible_connections: str(f.get("flexible_connections")),
          evidence_confidence: str(f.get("evidence_confidence")),
          source_title: str(f.get("source_title")),
          source_url: str(f.get("source_url")),
          last_reviewed_at: str(f.get("last_reviewed_at")),
          status: str(f.get("status")),
        });
      }}
    >
      <RegionPicker value={region} onChange={setRegion} />
      <p className="mt-2 text-xs text-muted-foreground">
        A rating needs a written explanation of at least 20 characters. Publishing any rating other
        than &ldquo;Insufficient evidence&rdquo; requires a source URL.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="rating">Rating</label>
          <select id="rating" name="rating" defaultValue={record?.["rating"] ?? "insufficient_evidence"} className={inputClass}>
            {Object.entries(PRESSURE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="evidence_confidence">Evidence confidence</label>
          <select id="evidence_confidence" name="evidence_confidence" defaultValue={record?.["evidence_confidence"] ?? "low"} className={inputClass}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="indicative">Indicative</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className={labelClass} htmlFor="rationale">Rationale (required)</label>
        <textarea id="rationale" name="rationale" rows={3} required minLength={20} defaultValue={record?.["rationale"] ?? ""} className={inputClass} />
      </div>

      {[
        ["connection_demand_evidence", "Connection request evidence"],
        ["known_delays", "Known delays"],
        ["network_constraints", "Network constraints"],
        ["planned_investment", "Planned investment"],
        ["flexible_connections", "Flexible connection agreements"],
      ].map(([name, label]) => (
        <div key={name} className="mt-4">
          <label className={labelClass} htmlFor={name}>{label}</label>
          <textarea id={name} name={name} rows={2} defaultValue={record?.[name!] ?? ""} className={inputClass} />
        </div>
      ))}

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass} htmlFor="source_title">Source title</label>
          <input id="source_title" name="source_title" defaultValue={record?.["source_title"] ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="source_url">Source URL</label>
          <input id="source_url" name="source_url" type="url" defaultValue={record?.["source_url"] ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="p_last_reviewed_at">Last reviewed</label>
          <input id="p_last_reviewed_at" name="last_reviewed_at" type="date" defaultValue={record?.["last_reviewed_at"] ?? ""} className={inputClass} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <div className="w-40">
          <label className={labelClass} htmlFor="p_status">Status</label>
          <select id="p_status" name="status" defaultValue={record?.["status"] ?? "draft"} className={inputClass}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <button type="submit" disabled={busy} className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground disabled:opacity-60">
          Save {regionName(region)}
        </button>
        {record?.id ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => onStatus(record.id, record["status"] === "published" ? "draft" : "published")}
            className="rounded-md border border-border px-4 py-2 text-sm"
          >
            {record["status"] === "published" ? "Unpublish" : "Publish"}
          </button>
        ) : null}
      </div>
    </form>
  );
}

function SourceForm({
  busy,
  sources,
  onSave,
  onStatus,
}: {
  busy: boolean;
  sources: { id: string; organisation: string; title: string; status: string; [k: string]: unknown }[];
  onSave: (payload: Record<string, unknown>) => void;
  onStatus: (id: string, status: "draft" | "published") => void;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const record = sources.find((s) => s.id === editing) as Record<string, any> | undefined;

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <form
        key={editing ?? "new"}
        className={cardClass}
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          onSave({
            ...(record?.id ? { id: record.id } : {}),
            organisation: str(f.get("organisation")),
            title: str(f.get("title")),
            url: str(f.get("url")),
            publication_date: str(f.get("publication_date")),
            source_type: str(f.get("source_type")),
            indicators_supported: str(f.get("indicators_supported")),
            accessed_at: str(f.get("accessed_at")),
            notes: str(f.get("notes")),
            status: str(f.get("status")),
          });
          setEditing(null);
        }}
      >
        <h2 className="font-semibold">{record ? "Edit source" : "Add source"}</h2>
        <div className="mt-3 space-y-3">
          <div>
            <label className={labelClass} htmlFor="organisation">Organisation</label>
            <input id="organisation" name="organisation" required defaultValue={record?.["organisation"] ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="title">Publication or dataset</label>
            <input id="title" name="title" required defaultValue={record?.["title"] ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="url">URL</label>
            <input id="url" name="url" type="url" defaultValue={record?.["url"] ?? ""} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass} htmlFor="publication_date">Published</label>
              <input id="publication_date" name="publication_date" type="date" defaultValue={record?.["publication_date"] ?? ""} className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="accessed_at">Accessed</label>
              <input id="accessed_at" name="accessed_at" type="date" defaultValue={record?.["accessed_at"] ?? ""} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass} htmlFor="source_type">Type</label>
            <select id="source_type" name="source_type" defaultValue={record?.["source_type"] ?? "official"} className={inputClass}>
              {["official", "regulator", "operator", "press", "industry", "modelled", "survey", "academic"].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="indicators_supported">Indicators supported</label>
            <input id="indicators_supported" name="indicators_supported" defaultValue={record?.["indicators_supported"] ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="s_notes">Notes</label>
            <textarea id="s_notes" name="notes" rows={2} defaultValue={record?.["notes"] ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="s_status">Status</label>
            <select id="s_status" name="status" defaultValue={record?.["status"] ?? "draft"} className={inputClass}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button type="submit" disabled={busy} className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground disabled:opacity-60">
            Save source
          </button>
          {record ? (
            <button type="button" onClick={() => setEditing(null)} className="rounded-md border border-border px-4 py-2 text-sm">
              New source
            </button>
          ) : null}
        </div>
      </form>

      <div className={cardClass}>
        <h2 className="font-semibold">Source register ({sources.length})</h2>
        <ul className="mt-3 divide-y divide-border text-sm">
          {sources.length === 0 ? (
            <li className="py-3 text-muted-foreground">No sources recorded yet.</li>
          ) : null}
          {sources.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <div>
                <div className="font-medium">{s.title}</div>
                <div className="text-xs text-muted-foreground">
                  {s.organisation} · {s.status}
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setEditing(s.id)} className="rounded-md border border-border px-3 py-1 text-xs">
                  Edit
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onStatus(s.id, s.status === "published" ? "draft" : "published")}
                  className="rounded-md border border-border px-3 py-1 text-xs"
                >
                  {s.status === "published" ? "Unpublish" : "Publish"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
