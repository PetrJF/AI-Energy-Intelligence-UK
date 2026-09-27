import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, ShieldAlert } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  adminGetIndexSections,
  adminUpsertDatapoint,
  adminUpsertGridEvidence,
  adminUpdateProjectIndexFields,
  adminFindDuplicateProjects,
  adminListCorrections,
  adminUpdateCorrection,
  type IndexSectionsData,
  type SectionDatapoint,
  type GridEvidence,
  type IndexProject,
} from "@/lib/index-sections.functions";
import {
  INDEX_REGIONS,
  GEO_COVERAGE_LABELS,
  DATA_CLASSIFICATION_LABELS,
  CONFIDENCE_LABELS,
  NETWORK_LEVEL_LABELS,
  CONSTRAINT_TYPE_LABELS,
  FACILITY_TYPE_LABELS,
  CAPACITY_DEFINITION_LABELS,
  NATION_LABELS,
  UNIT_OPTIONS,
  regionName,
} from "@/lib/index-sections";

export const Route = createFileRoute("/AIAdmin/energy-index/data")({
  head: () => ({
    meta: [
      { title: "Index data entry, evidence and corrections — admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: DataAdmin,
});

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40";
const labelClass = "block text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1";
const cardClass = "rounded-xl border border-border bg-card p-5";
const btnClass =
  "rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground disabled:opacity-60";

type TabKey = "datapoints" | "evidence" | "projects" | "corrections";
const TABS: { key: TabKey; label: string }[] = [
  { key: "datapoints", label: "Data entries" },
  { key: "evidence", label: "Grid evidence" },
  { key: "projects", label: "Project register" },
  { key: "corrections", label: "Corrections" },
];

function str(v: FormDataEntryValue | null) {
  return String(v ?? "").trim();
}
function num(v: FormDataEntryValue | null) {
  const s = str(v);
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function DataAdmin() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const qc = useQueryClient();
  const [tab, setTab] = useState<TabKey>("datapoints");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/login", search: { redirect: "/AIAdmin/energy-index/data" } });
    }
  }, [authLoading, user, navigate]);

  const fetchAll = useServerFn(adminGetIndexSections);
  const query = useQuery({
    queryKey: ["admin", "index-sections"],
    queryFn: () => fetchAll(),
    enabled: !!user,
    retry: false,
  });

  const fetchCorrections = useServerFn(adminListCorrections);
  const corrections = useQuery({
    queryKey: ["admin", "index-corrections"],
    queryFn: () => fetchCorrections(),
    enabled: !!user && tab === "corrections",
    retry: false,
  });

  const fetchDuplicates = useServerFn(adminFindDuplicateProjects);
  const duplicates = useQuery({
    queryKey: ["admin", "index-duplicates"],
    queryFn: () => fetchDuplicates(),
    enabled: !!user && tab === "projects",
    retry: false,
  });

  const onDone = (label: string) => {
    setError(null);
    setMessage(`${label} saved.`);
    qc.invalidateQueries({ queryKey: ["admin", "index-sections"] });
    qc.invalidateQueries({ queryKey: ["admin", "index-corrections"] });
    qc.invalidateQueries({ queryKey: ["admin", "index-duplicates"] });
    qc.invalidateQueries({ queryKey: ["uk-ai-energy-index"] });
  };
  const onFail = (e: unknown) => {
    setMessage(null);
    setError(e instanceof Error ? e.message : "Save failed.");
  };

  const saveDatapoint = useMutation({
    mutationFn: useServerFn(adminUpsertDatapoint),
    onSuccess: () => onDone("Data entry"),
    onError: onFail,
  });
  const saveEvidence = useMutation({
    mutationFn: useServerFn(adminUpsertGridEvidence),
    onSuccess: () => onDone("Evidence record"),
    onError: onFail,
  });
  const saveProject = useMutation({
    mutationFn: useServerFn(adminUpdateProjectIndexFields),
    onSuccess: () => onDone("Project record"),
    onError: onFail,
  });
  const saveCorrection = useMutation({
    mutationFn: useServerFn(adminUpdateCorrection),
    onSuccess: () => onDone("Correction"),
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
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <ShieldAlert className="mx-auto h-8 w-8 text-muted-foreground" />
        <h1 className="mt-3 text-xl font-semibold">Administrator access required</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {query.error instanceof Error ? query.error.message : "Could not load the index data."}
        </p>
      </div>
    );
  }

  const data = query.data as IndexSectionsData | undefined;
  if (!data) return null;

  const busy =
    saveDatapoint.isPending ||
    saveEvidence.isPending ||
    saveProject.isPending ||
    saveCorrection.isPending;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        to="/AIAdmin/energy-index"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to the index admin
      </Link>

      <h1 className="mt-3 font-display text-3xl font-bold">Data entry, evidence and corrections</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every figure recorded here is typed by hand, attributed to a source and reviewed before it is
        published. Nothing is estimated automatically.
      </p>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${
              tab === t.key
                ? "border-brand text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {message ? (
        <p className="mt-4 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-4 py-2 text-sm">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/5 px-4 py-2 text-sm">
          {error}
        </p>
      ) : null}

      {tab === "datapoints" ? (
        <DatapointPanel busy={busy} data={data} onSave={(p) => saveDatapoint.mutate({ data: p } as never)} />
      ) : null}

      {tab === "evidence" ? (
        <EvidencePanel busy={busy} data={data} onSave={(p) => saveEvidence.mutate({ data: p } as never)} />
      ) : null}

      {tab === "projects" ? (
        <ProjectPanel
          busy={busy}
          data={data}
          duplicates={duplicates.data?.warnings ?? []}
          onSave={(p) => saveProject.mutate({ data: p } as never)}
        />
      ) : null}

      {tab === "corrections" ? (
        <CorrectionsPanel
          busy={busy}
          loading={corrections.isLoading}
          items={corrections.data?.corrections ?? []}
          onSave={(p) => saveCorrection.mutate({ data: p } as never)}
        />
      ) : null}
    </div>
  );
}

/* ---------------- Data entries ---------------- */

function DatapointPanel({
  busy,
  data,
  onSave,
}: {
  busy: boolean;
  data: IndexSectionsData;
  onSave: (payload: Record<string, unknown>) => void;
}) {
  const [indicatorId, setIndicatorId] = useState(data.indicators[0]?.id ?? "");
  const [editing, setEditing] = useState<string | null>(null);
  const rows = data.datapoints.filter((d) => d.indicator_id === indicatorId);
  const record = rows.find((r) => r.id === editing) as SectionDatapoint | undefined;

  if (!data.indicators.length) {
    return (
      <p className="mt-6 rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
        Add an indicator first on the main index admin screen.
      </p>
    );
  }

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <form
        key={`${indicatorId}-${editing ?? "new"}`}
        className={cardClass}
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          onSave({
            ...(record?.id ? { id: record.id } : {}),
            indicator_id: indicatorId,
            period_label: str(f.get("period_label")),
            period_start: str(f.get("period_start")),
            period_end: str(f.get("period_end")),
            value: num(f.get("value")),
            value_text: str(f.get("value_text")),
            unit: str(f.get("unit")),
            previous_value: num(f.get("previous_value")),
            geographic_coverage: str(f.get("geographic_coverage")),
            data_classification: str(f.get("data_classification")),
            source_id: str(f.get("source_id")),
            source_name: str(f.get("source_name")),
            source_url: str(f.get("source_url")),
            calculation_method: str(f.get("calculation_method")),
            assumptions: str(f.get("assumptions")),
            limitations: str(f.get("limitations")),
            confidence_level_rating: str(f.get("confidence_level_rating")),
            publication_date: str(f.get("publication_date")),
            reviewed_at: str(f.get("reviewed_at")),
            notes: str(f.get("notes")),
            status: str(f.get("status")),
          });
          setEditing(null);
        }}
      >
        <div>
          <label className={labelClass} htmlFor="indicator">Indicator</label>
          <select
            id="indicator"
            value={indicatorId}
            onChange={(e) => {
              setIndicatorId(e.target.value);
              setEditing(null);
            }}
            className={inputClass}
          >
            {data.indicators.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          A calculated or in-house estimated figure cannot be published without a calculation method
          and a source.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="period_label">Reporting period</label>
            <input id="period_label" name="period_label" required defaultValue={record?.period_label ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="unit">Unit</label>
            <select id="unit" name="unit" defaultValue={record?.unit ?? ""} className={inputClass}>
              <option value="">Not stated</option>
              {UNIT_OPTIONS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="period_start">Period start</label>
            <input id="period_start" name="period_start" type="date" defaultValue={record?.period_start ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="period_end">Period end</label>
            <input id="period_end" name="period_end" type="date" defaultValue={record?.period_end ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="value">Value</label>
            <input id="value" name="value" type="number" step="any" defaultValue={record?.value ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="previous_value">Previous value</label>
            <input id="previous_value" name="previous_value" type="number" step="any" defaultValue={record?.previous_value ?? ""} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="value_text">
              Text value (used when no figure can be published)
            </label>
            <input id="value_text" name="value_text" defaultValue={record?.value_text ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="geographic_coverage">Geographic coverage</label>
            <select id="geographic_coverage" name="geographic_coverage" defaultValue={record?.geographic_coverage ?? "united_kingdom"} className={inputClass}>
              {Object.entries(GEO_COVERAGE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="data_classification">Classification</label>
            <select id="data_classification" name="data_classification" defaultValue={record?.data_classification ?? "not_available"} className={inputClass}>
              {Object.entries(DATA_CLASSIFICATION_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="source_id">Source record</label>
            <select id="source_id" name="source_id" defaultValue={record?.source_id ?? ""} className={inputClass}>
              <option value="">Not linked</option>
              {data.sources.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.organisation} — {s.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="confidence_level_rating">Confidence</label>
            <select id="confidence_level_rating" name="confidence_level_rating" defaultValue={record?.confidence_level_rating ?? "not_assessed"} className={inputClass}>
              {Object.entries(CONFIDENCE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="source_name">Source name</label>
            <input id="source_name" name="source_name" defaultValue={record?.source_name ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="source_url">Source URL</label>
            <input id="source_url" name="source_url" type="url" defaultValue={record?.source_url ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="publication_date">Publication date</label>
            <input id="publication_date" name="publication_date" type="date" defaultValue={record?.publication_date ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="reviewed_at">Reviewed on</label>
            <input id="reviewed_at" name="reviewed_at" type="date" defaultValue={record?.reviewed_at ?? ""} className={inputClass} />
          </div>
        </div>

        {[
          ["calculation_method", "Calculation method / workings"],
          ["assumptions", "Assumptions"],
          ["limitations", "Limitations"],
          ["notes", "Internal notes"],
        ].map(([name, label]) => (
          <div key={name} className="mt-4">
            <label className={labelClass} htmlFor={name}>{label}</label>
            <textarea
              id={name}
              name={name}
              rows={2}
              defaultValue={(record as Record<string, any> | undefined)?.[name!] ?? ""}
              className={inputClass}
            />
          </div>
        ))}

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="w-40">
            <label className={labelClass} htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue={record?.status ?? "draft"} className={inputClass}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <button type="submit" disabled={busy} className={btnClass}>
            Save data entry
          </button>
          {record ? (
            <button type="button" onClick={() => setEditing(null)} className="rounded-md border border-border px-4 py-2 text-sm">
              New entry
            </button>
          ) : null}
        </div>
      </form>

      <div className={cardClass}>
        <h2 className="font-semibold">Recorded entries ({rows.length})</h2>
        <ul className="mt-3 divide-y divide-border text-sm">
          {rows.length === 0 ? (
            <li className="py-3 text-muted-foreground">No entries recorded for this indicator.</li>
          ) : null}
          {rows.map((d) => (
            <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <div>
                <div className="font-medium">
                  {d.period_label} — {d.value ?? d.value_text ?? "No figure"} {d.unit ?? ""}
                </div>
                <div className="text-xs text-muted-foreground">
                  {DATA_CLASSIFICATION_LABELS[d.data_classification] ?? d.data_classification} · {d.status}
                </div>
              </div>
              <button type="button" onClick={() => setEditing(d.id)} className="rounded-md border border-border px-3 py-1 text-xs">
                Edit
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------------- Grid evidence ---------------- */

function EvidencePanel({
  busy,
  data,
  onSave,
}: {
  busy: boolean;
  data: IndexSectionsData;
  onSave: (payload: Record<string, unknown>) => void;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const record = data.gridEvidence.find((e) => e.id === editing) as GridEvidence | undefined;

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <form
        key={editing ?? "new"}
        className={cardClass}
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          onSave({
            ...(record?.id ? { id: record.id } : {}),
            title: str(f.get("title")),
            region_slug: str(f.get("region_slug")),
            local_area: str(f.get("local_area")),
            network_level: str(f.get("network_level")),
            network_operator: str(f.get("network_operator")),
            constraint_type: str(f.get("constraint_type")),
            description: str(f.get("description")),
            connection_delay_mentioned: str(f.get("connection_delay_mentioned")),
            reinforcement_required: str(f.get("reinforcement_required")),
            investment_announced: str(f.get("investment_announced")),
            flexible_connection_available: str(f.get("flexible_connection_available")),
            relevant_period: str(f.get("relevant_period")),
            relevant_date: str(f.get("relevant_date")),
            source_id: str(f.get("source_id")),
            confidence_level: str(f.get("confidence_level")),
            last_reviewed_at: str(f.get("last_reviewed_at")),
            admin_notes: str(f.get("admin_notes")),
            status: str(f.get("status")),
          });
          setEditing(null);
        }}
      >
        <h2 className="font-semibold">{record ? "Edit evidence record" : "Add evidence record"}</h2>
        <p className="mt-2 text-xs text-muted-foreground">
          Evidence cannot be published until it is attributed to a source record.
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <label className={labelClass} htmlFor="title">Title</label>
            <input id="title" name="title" required minLength={3} defaultValue={record?.title ?? ""} className={inputClass} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="region_slug">Region</label>
              <select id="region_slug" name="region_slug" defaultValue={record?.region_slug ?? INDEX_REGIONS[0]!.slug} className={inputClass}>
                {INDEX_REGIONS.map((r) => (
                  <option key={r.slug} value={r.slug}>{r.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="local_area">Local area</label>
              <input id="local_area" name="local_area" defaultValue={record?.local_area ?? ""} className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="network_level">Network level</label>
              <select id="network_level" name="network_level" defaultValue={record?.network_level ?? "not_established"} className={inputClass}>
                {Object.entries(NETWORK_LEVEL_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="network_operator">Network operator</label>
              <input id="network_operator" name="network_operator" defaultValue={record?.network_operator ?? ""} className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="constraint_type">Constraint type</label>
              <select id="constraint_type" name="constraint_type" defaultValue={record?.constraint_type ?? "constraint_not_established"} className={inputClass}>
                {Object.entries(CONSTRAINT_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="confidence_level">Confidence</label>
              <select id="confidence_level" name="confidence_level" defaultValue={record?.confidence_level ?? "not_assessed"} className={inputClass}>
                {Object.entries(CONFIDENCE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="description">Description (required)</label>
            <textarea id="description" name="description" rows={3} required minLength={20} defaultValue={record?.description ?? ""} className={inputClass} />
          </div>

          {[
            ["connection_delay_mentioned", "Connection delay mentioned"],
            ["reinforcement_required", "Reinforcement required"],
            ["investment_announced", "Investment announced"],
            ["flexible_connection_available", "Flexible connection available"],
          ].map(([name, label]) => (
            <div key={name}>
              <label className={labelClass} htmlFor={name}>{label}</label>
              <textarea
                id={name}
                name={name}
                rows={2}
                defaultValue={(record as Record<string, any> | undefined)?.[name!] ?? ""}
                className={inputClass}
              />
            </div>
          ))}

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelClass} htmlFor="relevant_period">Relevant period</label>
              <input id="relevant_period" name="relevant_period" defaultValue={record?.relevant_period ?? ""} className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="relevant_date">Relevant date</label>
              <input id="relevant_date" name="relevant_date" type="date" defaultValue={record?.relevant_date ?? ""} className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="last_reviewed_at">Last reviewed</label>
              <input id="last_reviewed_at" name="last_reviewed_at" type="date" defaultValue={record?.last_reviewed_at ?? ""} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="e_source_id">Source record</label>
            <select id="e_source_id" name="source_id" defaultValue={record?.source_id ?? ""} className={inputClass}>
              <option value="">Not linked</option>
              {data.sources.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.organisation} — {s.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="admin_notes">Internal notes</label>
            <textarea id="admin_notes" name="admin_notes" rows={2} defaultValue={record?.admin_notes ?? ""} className={inputClass} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="w-40">
            <label className={labelClass} htmlFor="e_status">Status</label>
            <select id="e_status" name="status" defaultValue={record?.status ?? "draft"} className={inputClass}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <button type="submit" disabled={busy} className={btnClass}>
            Save evidence
          </button>
          {record ? (
            <button type="button" onClick={() => setEditing(null)} className="rounded-md border border-border px-4 py-2 text-sm">
              New record
            </button>
          ) : null}
        </div>
      </form>

      <div className={cardClass}>
        <h2 className="font-semibold">Evidence register ({data.gridEvidence.length})</h2>
        <ul className="mt-3 divide-y divide-border text-sm">
          {data.gridEvidence.length === 0 ? (
            <li className="py-3 text-muted-foreground">No evidence recorded yet.</li>
          ) : null}
          {data.gridEvidence.map((e) => (
            <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <div>
                <div className="font-medium">{e.title}</div>
                <div className="text-xs text-muted-foreground">
                  {regionName(e.region_slug)} ·{" "}
                  {CONSTRAINT_TYPE_LABELS[e.constraint_type] ?? e.constraint_type} · {e.status}
                </div>
              </div>
              <button type="button" onClick={() => setEditing(e.id)} className="rounded-md border border-border px-3 py-1 text-xs">
                Edit
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------------- Project register ---------------- */

function ProjectPanel({
  busy,
  data,
  duplicates,
  onSave,
}: {
  busy: boolean;
  data: IndexSectionsData;
  duplicates: { reason: string; a: { id: string; name: string }; b: { id: string; name: string } }[];
  onSave: (payload: Record<string, unknown>) => void;
}) {
  const [selected, setSelected] = useState(data.projects[0]?.id ?? "");
  const record = data.projects.find((p) => p.id === selected) as IndexProject | undefined;

  if (!data.projects.length) {
    return (
      <p className="mt-6 rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
        No projects in the register yet. Add them on the data-centre admin screen first.
      </p>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      <div className={cardClass}>
        <h2 className="font-semibold">Possible duplicates ({duplicates.length})</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Flagged for review only. Nothing is merged or deleted automatically.
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          {duplicates.length === 0 ? (
            <li className="text-muted-foreground">No possible duplicates flagged.</li>
          ) : null}
          {duplicates.map((w, i) => (
            <li key={i} className="rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2">
              <span className="font-medium">{w.a.name}</span> and{" "}
              <span className="font-medium">{w.b.name}</span> — {w.reason}
            </li>
          ))}
        </ul>
      </div>

      <form
        key={selected}
        className={cardClass}
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          onSave({
            id: selected,
            record_ref: str(f.get("record_ref")),
            campus_name: str(f.get("campus_name")),
            developer: str(f.get("developer")),
            address_line: str(f.get("address_line")),
            postcode: str(f.get("postcode")),
            local_authority: str(f.get("local_authority")),
            nation: str(f.get("nation")),
            index_region_slug: str(f.get("index_region_slug")),
            facility_type: str(f.get("facility_type")),
            construction_start_date: str(f.get("construction_start_date")),
            actual_operational_date: str(f.get("actual_operational_date")),
            it_capacity_mw: num(f.get("it_capacity_mw")),
            stated_electricity_demand_mw: num(f.get("stated_electricity_demand_mw")),
            grid_connection_mw: num(f.get("grid_connection_mw")),
            campus_capacity_mw: num(f.get("campus_capacity_mw")),
            capacity_unit: str(f.get("capacity_unit")) || "MW",
            capacity_definition: str(f.get("capacity_definition")),
            primary_source_id: str(f.get("primary_source_id")),
            last_verified_at: str(f.get("last_verified_at")),
            admin_notes: str(f.get("admin_notes")),
            duplicate_reviewed: f.get("duplicate_reviewed") === "on",
          });
        }}
      >
        <div>
          <label className={labelClass} htmlFor="project">Project</label>
          <select id="project" value={selected} onChange={(e) => setSelected(e.target.value)} className={inputClass}>
            {data.projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="record_ref">Record reference</label>
            <input id="record_ref" name="record_ref" defaultValue={record?.record_ref ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="campus_name">Campus name</label>
            <input id="campus_name" name="campus_name" defaultValue={record?.campus_name ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="developer">Developer</label>
            <input id="developer" name="developer" defaultValue={record?.developer ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="address_line">Address</label>
            <input id="address_line" name="address_line" defaultValue={record?.address_line ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="postcode">Postcode</label>
            <input id="postcode" name="postcode" defaultValue={record?.postcode ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="local_authority">Local authority</label>
            <input id="local_authority" name="local_authority" defaultValue={record?.local_authority ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="nation">Nation</label>
            <select id="nation" name="nation" defaultValue={record?.nation ?? ""} className={inputClass}>
              <option value="">Not stated</option>
              {Object.entries(NATION_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="index_region_slug">Index region</label>
            <select id="index_region_slug" name="index_region_slug" defaultValue={record?.index_region_slug ?? ""} className={inputClass}>
              <option value="">Not mapped</option>
              {INDEX_REGIONS.map((r) => (
                <option key={r.slug} value={r.slug}>{r.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="facility_type">Facility type</label>
            <select id="facility_type" name="facility_type" defaultValue={record?.facility_type ?? "type_unconfirmed"} className={inputClass}>
              {Object.entries(FACILITY_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="capacity_definition">Capacity definition</label>
            <select id="capacity_definition" name="capacity_definition" defaultValue={record?.capacity_definition ?? "not_disclosed"} className={inputClass}>
              {Object.entries(CAPACITY_DEFINITION_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="it_capacity_mw">IT capacity (MW)</label>
            <input id="it_capacity_mw" name="it_capacity_mw" type="number" step="any" defaultValue={record?.it_capacity_mw ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="stated_electricity_demand_mw">Stated electricity demand (MW)</label>
            <input id="stated_electricity_demand_mw" name="stated_electricity_demand_mw" type="number" step="any" defaultValue={record?.stated_electricity_demand_mw ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="grid_connection_mw">Grid connection (MW)</label>
            <input id="grid_connection_mw" name="grid_connection_mw" type="number" step="any" defaultValue={record?.grid_connection_mw ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="campus_capacity_mw">Campus capacity (MW)</label>
            <input id="campus_capacity_mw" name="campus_capacity_mw" type="number" step="any" defaultValue={record?.campus_capacity_mw ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="capacity_unit">Capacity unit</label>
            <input id="capacity_unit" name="capacity_unit" defaultValue={record?.capacity_unit ?? "MW"} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="construction_start_date">Construction start</label>
            <input id="construction_start_date" name="construction_start_date" type="date" defaultValue={record?.construction_start_date ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="actual_operational_date">Actually operational</label>
            <input id="actual_operational_date" name="actual_operational_date" type="date" defaultValue={record?.actual_operational_date ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="last_verified_at">Last verified</label>
            <input id="last_verified_at" name="last_verified_at" type="date" defaultValue={record?.last_verified_at ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="primary_source_id">Primary source</label>
            <select id="primary_source_id" name="primary_source_id" defaultValue="" className={inputClass}>
              <option value="">Unchanged / not linked</option>
              {data.sources.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.organisation} — {s.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className={labelClass} htmlFor="p_admin_notes">Internal notes</label>
          <textarea id="p_admin_notes" name="admin_notes" rows={2} className={inputClass} />
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm">
          <input type="checkbox" name="duplicate_reviewed" className="h-4 w-4" />
          Duplicate check reviewed for this record
        </label>

        <div className="mt-4">
          <button type="submit" disabled={busy} className={btnClass}>
            Save project record
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------------- Corrections ---------------- */

function CorrectionsPanel({
  busy,
  loading,
  items,
  onSave,
}: {
  busy: boolean;
  loading: boolean;
  items: {
    id: string;
    page_or_record: string;
    description: string;
    suggested_correction: string | null;
    source_url: string | null;
    submitter_name: string | null;
    status: string;
    admin_notes: string | null;
    created_at: string;
  }[];
  onSave: (payload: Record<string, unknown>) => void;
}) {
  if (loading) {
    return (
      <div className="mt-10 text-center">
        <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
          No corrections have been submitted.
        </p>
      ) : null}
      {items.map((c) => (
        <form
          key={c.id}
          className={cardClass}
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            onSave({
              id: c.id,
              status: str(f.get("status")),
              admin_notes: str(f.get("admin_notes")),
            });
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold">{c.page_or_record}</h3>
            <span className="text-xs text-muted-foreground">
              {new Date(c.created_at).toLocaleDateString("en-GB")} · {c.status}
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
          {c.suggested_correction ? (
            <p className="mt-2 text-sm">
              <span className="font-medium">Suggested: </span>
              {c.suggested_correction}
            </p>
          ) : null}
          {c.source_url ? (
            <p className="mt-2 break-all text-sm">
              <a href={c.source_url} rel="nofollow noopener" className="text-brand hover:underline">
                {c.source_url}
              </a>
            </p>
          ) : null}
          <div className="mt-3 grid gap-3 sm:grid-cols-[200px_1fr]">
            <div>
              <label className={labelClass} htmlFor={`status-${c.id}`}>Status</label>
              <select id={`status-${c.id}`} name="status" defaultValue={c.status} className={inputClass}>
                <option value="pending">Pending</option>
                <option value="under_review">Under review</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor={`notes-${c.id}`}>Internal notes</label>
              <input id={`notes-${c.id}`} name="admin_notes" defaultValue={c.admin_notes ?? ""} className={inputClass} />
            </div>
          </div>
          <div className="mt-3">
            <button type="submit" disabled={busy} className={btnClass}>
              Save
            </button>
          </div>
        </form>
      ))}
    </div>
  );
}
