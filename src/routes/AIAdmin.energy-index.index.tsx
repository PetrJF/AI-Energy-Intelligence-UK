import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Plus, ShieldAlert, Trash2, History } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  adminGetIndexFramework,
  adminUpsertIndicator,
  adminDeleteIndicator,
  adminUpsertDatapoint,
  adminDeleteDatapoint,
  adminUpsertEdition,
  adminAddRevision,
  type IndexIndicator,
} from "@/lib/index-framework.functions";

export const Route = createFileRoute("/AIAdmin/energy-index/")({
  head: () => ({
    meta: [
      { title: "UK AI Energy Index admin — AI Energy Intelligence UK" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: IndexAdmin,
});

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40";
const labelClass = "block text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1";

type TabKey = "indicators" | "datapoints" | "editions" | "revisions";

function IndexAdmin() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const qc = useQueryClient();
  const [tab, setTab] = useState<TabKey>("indicators");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/login", search: { redirect: "/AIAdmin/energy-index" } });
    }
  }, [authLoading, user, navigate]);

  const fetchAll = useServerFn(adminGetIndexFramework);
  const query = useQuery({
    queryKey: ["admin", "energy-index"],
    queryFn: () => fetchAll(),
    enabled: !!user,
    retry: false,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin", "energy-index"] });

  const upsertIndicator = useMutation({
    mutationFn: useServerFn(adminUpsertIndicator),
    onSuccess: invalidate,
  });
  const deleteIndicator = useMutation({
    mutationFn: useServerFn(adminDeleteIndicator),
    onSuccess: invalidate,
  });
  const upsertDatapoint = useMutation({
    mutationFn: useServerFn(adminUpsertDatapoint),
    onSuccess: invalidate,
  });
  const deleteDatapoint = useMutation({
    mutationFn: useServerFn(adminDeleteDatapoint),
    onSuccess: invalidate,
  });
  const upsertEdition = useMutation({
    mutationFn: useServerFn(adminUpsertEdition),
    onSuccess: invalidate,
  });
  const addRevision = useMutation({
    mutationFn: useServerFn(adminAddRevision),
    onSuccess: invalidate,
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
          Your account cannot manage the UK AI Energy Index.
        </p>
      </div>
    );
  }

  const data = query.data;
  const indicators = data?.indicators ?? [];
  const datapoints = data?.datapoints ?? [];
  const editions = data?.editions ?? [];
  const revisions = data?.revisions ?? [];

  const busy =
    upsertIndicator.isPending ||
    upsertDatapoint.isPending ||
    upsertEdition.isPending ||
    addRevision.isPending;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        to="/AIAdmin"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to admin
      </Link>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">UK AI Energy Index</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manual data entry. Nothing is ingested automatically — every reading is typed, sourced and
            signed off here.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <Link
            to="/AIAdmin/energy-index/sections"
            className="rounded-md border border-border px-3 py-1.5 hover:bg-surface"
          >
            Sub-indices, regions &amp; sources
          </Link>
          <Link
            to="/AIAdmin/energy-index/data"
            className="rounded-md border border-border px-3 py-1.5 hover:bg-surface"
          >
            Data, evidence &amp; corrections
          </Link>

          <Link to="/uk-ai-energy-index" className="text-brand hover:underline">
            View public page →
          </Link>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-border">
        {(
          [
            ["indicators", `Indicators (${indicators.length})`],
            ["datapoints", `Readings (${datapoints.length})`],
            ["editions", `Editions (${editions.length})`],
            ["revisions", `Revisions (${revisions.length})`],
          ] as [TabKey, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-3 py-2 text-sm font-medium ${
              tab === key
                ? "border-b-2 border-brand text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {busy ? (
        <p className="mt-4 text-sm text-muted-foreground">
          <Loader2 className="mr-1 inline h-3.5 w-3.5 animate-spin" /> Saving…
        </p>
      ) : null}

      {tab === "indicators" ? (
        <IndicatorsTab
          indicators={indicators}
          onSave={(payload) => upsertIndicator.mutate({ data: payload } as never)}
          onDelete={(id) => deleteIndicator.mutate({ data: { id } } as never)}
        />
      ) : null}

      {tab === "datapoints" ? (
        <DatapointsTab
          indicators={indicators}
          datapoints={datapoints}
          editions={editions}
          onSave={(payload) => upsertDatapoint.mutate({ data: payload } as never)}
          onDelete={(id) => deleteDatapoint.mutate({ data: { id } } as never)}
        />
      ) : null}

      {tab === "editions" ? (
        <EditionsTab
          editions={editions}
          onSave={(payload) => upsertEdition.mutate({ data: payload } as never)}
        />
      ) : null}

      {tab === "revisions" ? (
        <RevisionsTab
          indicators={indicators}
          revisions={revisions}
          onSave={(payload) => addRevision.mutate({ data: payload } as never)}
        />
      ) : null}
    </div>
  );
}

/* ---------------- Indicators ---------------- */

function IndicatorsTab({
  indicators,
  onSave,
  onDelete,
}: {
  indicators: IndexIndicator[];
  onSave: (payload: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState<Partial<IndexIndicator> | null>(null);

  return (
    <div className="mt-6">
      <button
        onClick={() =>
          setEditing({
            category: "demand",
            unit: "",
            weight: 1,
            direction: "higher_is_more_pressure",
            source_type: "official",
            update_frequency: "quarterly",
            confidence_level: "medium",
            collection_method: "manual",
            display_order: indicators.length,
            status: "draft",
          })
        }
        className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
      >
        <Plus className="h-4 w-4" /> New indicator
      </button>

      {editing ? (
        <form
          className="mt-5 grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            onSave({
              ...(editing.id ? { id: editing.id } : {}),
              slug: editing.slug ?? "",
              name: editing.name ?? "",
              short_name: editing.short_name ?? null,
              category: editing.category ?? "demand",
              description: editing.description ?? null,
              unit: editing.unit ?? "",
              weight: Number(editing.weight ?? 1),
              direction: editing.direction ?? "higher_is_more_pressure",
              source_name: editing.source_name ?? null,
              source_url: editing.source_url ?? "",
              source_type: editing.source_type ?? "official",
              update_frequency: editing.update_frequency ?? "quarterly",
              next_review_at: editing.next_review_at ?? "",
              methodology: editing.methodology ?? null,
              confidence_level: editing.confidence_level ?? "medium",
              collection_method: editing.collection_method ?? "manual",
              caveats: editing.caveats ?? null,
              display_order: Number(editing.display_order ?? 0),
              status: editing.status ?? "draft",
            });
            setEditing(null);
          }}
        >
          <div>
            <label className={labelClass}>Name</label>
            <input
              required
              className={inputClass}
              value={editing.name ?? ""}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Slug</label>
            <input
              required
              className={inputClass}
              value={editing.slug ?? ""}
              onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Short name</label>
            <input
              className={inputClass}
              value={editing.short_name ?? ""}
              onChange={(e) => setEditing({ ...editing, short_name: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Unit</label>
            <input
              className={inputClass}
              value={editing.unit ?? ""}
              onChange={(e) => setEditing({ ...editing, unit: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Description</label>
            <textarea
              rows={2}
              className={inputClass}
              value={editing.description ?? ""}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <select
              className={inputClass}
              value={editing.category ?? "demand"}
              onChange={(e) => setEditing({ ...editing, category: e.target.value })}
            >
              {["demand", "infrastructure", "grid", "cost", "efficiency", "policy", "public"].map(
                (c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ),
              )}
            </select>
          </div>
          <div>
            <label className={labelClass}>Direction</label>
            <select
              className={inputClass}
              value={editing.direction ?? "higher_is_more_pressure"}
              onChange={(e) => setEditing({ ...editing, direction: e.target.value })}
            >
              <option value="higher_is_more_pressure">Higher = more pressure</option>
              <option value="lower_is_more_pressure">Lower = more pressure</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Source name</label>
            <input
              className={inputClass}
              value={editing.source_name ?? ""}
              onChange={(e) => setEditing({ ...editing, source_name: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Source URL</label>
            <input
              type="url"
              className={inputClass}
              value={editing.source_url ?? ""}
              onChange={(e) => setEditing({ ...editing, source_url: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Source type</label>
            <select
              className={inputClass}
              value={editing.source_type ?? "official"}
              onChange={(e) => setEditing({ ...editing, source_type: e.target.value })}
            >
              {["official", "regulator", "operator", "press", "industry", "modelled", "survey"].map(
                (s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ),
              )}
            </select>
          </div>
          <div>
            <label className={labelClass}>Update frequency</label>
            <select
              className={inputClass}
              value={editing.update_frequency ?? "quarterly"}
              onChange={(e) => setEditing({ ...editing, update_frequency: e.target.value })}
            >
              {["monthly", "quarterly", "biannual", "annual", "ad_hoc"].map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Next review</label>
            <input
              type="date"
              className={inputClass}
              value={editing.next_review_at ?? ""}
              onChange={(e) => setEditing({ ...editing, next_review_at: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Confidence</label>
            <select
              className={inputClass}
              value={editing.confidence_level ?? "medium"}
              onChange={(e) =>
                setEditing({ ...editing, confidence_level: e.target.value as never })
              }
            >
              {["high", "medium", "low", "indicative"].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Collection method</label>
            <select
              className={inputClass}
              value={editing.collection_method ?? "manual"}
              onChange={(e) =>
                setEditing({ ...editing, collection_method: e.target.value as never })
              }
            >
              {["manual", "semi_automated", "automated"].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Weight</label>
            <input
              type="number"
              step="0.1"
              className={inputClass}
              value={editing.weight ?? 1}
              onChange={(e) => setEditing({ ...editing, weight: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className={labelClass}>Display order</label>
            <input
              type="number"
              className={inputClass}
              value={editing.display_order ?? 0}
              onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Methodology</label>
            <textarea
              rows={3}
              className={inputClass}
              value={editing.methodology ?? ""}
              onChange={(e) => setEditing({ ...editing, methodology: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Caveats</label>
            <textarea
              rows={2}
              className={inputClass}
              value={editing.caveats ?? ""}
              onChange={(e) => setEditing({ ...editing, caveats: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select
              className={inputClass}
              value={editing.status ?? "draft"}
              onChange={(e) => setEditing({ ...editing, status: e.target.value as never })}
            >
              {["draft", "published", "retired"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2 sm:col-span-2">
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Save indicator
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-md border border-border px-4 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Indicator</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Frequency</th>
              <th className="px-4 py-3">Confidence</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {indicators.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-muted-foreground">
                  No indicators yet.
                </td>
              </tr>
            ) : (
              indicators.map((i) => (
                <tr key={i.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{i.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{i.category}</td>
                  <td className="px-4 py-3 text-muted-foreground">{i.update_frequency}</td>
                  <td className="px-4 py-3 text-muted-foreground">{i.confidence_level}</td>
                  <td className="px-4 py-3 text-muted-foreground">{i.status}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setEditing(i)}
                      className="mr-3 text-sm text-brand hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${i.name}" and its readings?`)) onDelete(i.id);
                      }}
                      className="text-sm text-destructive hover:underline"
                    >
                      <Trash2 className="inline h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- Datapoints ---------------- */

function DatapointsTab({
  indicators,
  datapoints,
  editions,
  onSave,
  onDelete,
}: {
  indicators: IndexIndicator[];
  datapoints: any[];
  editions: any[];
  onSave: (payload: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
}) {
  const [form, setForm] = useState<Record<string, any>>({
    indicator_id: "",
    period_label: "",
    confidence_level: "medium",
    status: "draft",
    is_estimate: false,
  });

  const nameOf = (id: string) => indicators.find((i) => i.id === id)?.name ?? "—";

  return (
    <div className="mt-6">
      <form
        className="grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSave({
            ...(form.id ? { id: form.id } : {}),
            indicator_id: form.indicator_id,
            edition_id: form.edition_id ?? "",
            period_label: form.period_label,
            period_start: form.period_start ?? "",
            period_end: form.period_end ?? "",
            value: form.value === "" || form.value === undefined ? null : Number(form.value),
            value_text: form.value_text ?? null,
            unit: form.unit ?? null,
            is_estimate: !!form.is_estimate,
            confidence_level: form.confidence_level,
            source_name: form.source_name ?? null,
            source_url: form.source_url ?? "",
            notes: form.notes ?? null,
            status: form.status,
          });
          setForm({
            indicator_id: form.indicator_id,
            period_label: "",
            confidence_level: "medium",
            status: "draft",
            is_estimate: false,
          });
        }}
      >
        <div>
          <label className={labelClass}>Indicator</label>
          <select
            required
            className={inputClass}
            value={form.indicator_id}
            onChange={(e) => setForm({ ...form, indicator_id: e.target.value })}
          >
            <option value="">Select…</option>
            {indicators.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Period label</label>
          <input
            required
            placeholder="Q1 2026"
            className={inputClass}
            value={form.period_label}
            onChange={(e) => setForm({ ...form, period_label: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Edition (optional)</label>
          <select
            className={inputClass}
            value={form.edition_id ?? ""}
            onChange={(e) => setForm({ ...form, edition_id: e.target.value })}
          >
            <option value="">None</option>
            {editions.map((ed) => (
              <option key={ed.id} value={ed.id}>
                {ed.period_label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Period start</label>
          <input
            type="date"
            className={inputClass}
            value={form.period_start ?? ""}
            onChange={(e) => setForm({ ...form, period_start: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Period end</label>
          <input
            type="date"
            className={inputClass}
            value={form.period_end ?? ""}
            onChange={(e) => setForm({ ...form, period_end: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Value</label>
          <input
            type="number"
            step="any"
            className={inputClass}
            value={form.value ?? ""}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Unit</label>
          <input
            className={inputClass}
            value={form.unit ?? ""}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Source name</label>
          <input
            className={inputClass}
            value={form.source_name ?? ""}
            onChange={(e) => setForm({ ...form, source_name: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Source URL</label>
          <input
            type="url"
            className={inputClass}
            value={form.source_url ?? ""}
            onChange={(e) => setForm({ ...form, source_url: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Confidence</label>
          <select
            className={inputClass}
            value={form.confidence_level}
            onChange={(e) => setForm({ ...form, confidence_level: e.target.value })}
          >
            {["high", "medium", "low", "indicative"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select
            className={inputClass}
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            {["draft", "published", "superseded"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!form.is_estimate}
              onChange={(e) => setForm({ ...form, is_estimate: e.target.checked })}
            />
            Estimate
          </label>
        </div>
        <div className="sm:col-span-3">
          <label className={labelClass}>Notes</label>
          <textarea
            rows={2}
            className={inputClass}
            value={form.notes ?? ""}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>
        <div className="sm:col-span-3">
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            {form.id ? "Update reading" : "Add reading"}
          </button>
        </div>
      </form>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Indicator</th>
              <th className="px-4 py-3">Period</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Confidence</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {datapoints.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-muted-foreground">
                  No readings recorded yet.
                </td>
              </tr>
            ) : (
              datapoints.map((d) => (
                <tr key={d.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{nameOf(d.indicator_id)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.period_label}</td>
                  <td className="px-4 py-3">
                    {d.value ?? d.value_text ?? "—"} {d.unit ?? ""}
                    {d.is_estimate ? " (est.)" : ""}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{d.confidence_level}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.status}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setForm({ ...d, value: d.value ?? "" })}
                      className="mr-3 text-sm text-brand hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Delete this reading?")) onDelete(d.id);
                      }}
                      className="text-sm text-destructive hover:underline"
                    >
                      <Trash2 className="inline h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- Editions ---------------- */

function EditionsTab({
  editions,
  onSave,
}: {
  editions: any[];
  onSave: (payload: Record<string, unknown>) => void;
}) {
  const [form, setForm] = useState<Record<string, any>>({
    slug: "",
    period_label: "",
    methodology_version: "1.0",
    confidence_level: "medium",
    status: "draft",
  });

  return (
    <div className="mt-6">
      <form
        className="grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSave({
            ...(form.id ? { id: form.id } : {}),
            slug: form.slug,
            period_label: form.period_label,
            period_start: form.period_start ?? "",
            period_end: form.period_end ?? "",
            headline_score:
              form.headline_score === "" || form.headline_score === undefined
                ? null
                : Number(form.headline_score),
            previous_score:
              form.previous_score === "" || form.previous_score === undefined
                ? null
                : Number(form.previous_score),
            summary: form.summary ?? null,
            methodology_version: form.methodology_version || "1.0",
            confidence_level: form.confidence_level,
            status: form.status,
          });
        }}
      >
        <div>
          <label className={labelClass}>Period label</label>
          <input
            required
            placeholder="Q1 2026"
            className={inputClass}
            value={form.period_label}
            onChange={(e) => setForm({ ...form, period_label: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Slug</label>
          <input
            required
            placeholder="q1-2026"
            className={inputClass}
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Methodology version</label>
          <input
            className={inputClass}
            value={form.methodology_version}
            onChange={(e) => setForm({ ...form, methodology_version: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Period start</label>
          <input
            type="date"
            className={inputClass}
            value={form.period_start ?? ""}
            onChange={(e) => setForm({ ...form, period_start: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Period end</label>
          <input
            type="date"
            className={inputClass}
            value={form.period_end ?? ""}
            onChange={(e) => setForm({ ...form, period_end: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Headline score</label>
          <input
            type="number"
            step="any"
            className={inputClass}
            value={form.headline_score ?? ""}
            onChange={(e) => setForm({ ...form, headline_score: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Previous score</label>
          <input
            type="number"
            step="any"
            className={inputClass}
            value={form.previous_score ?? ""}
            onChange={(e) => setForm({ ...form, previous_score: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Confidence</label>
          <select
            className={inputClass}
            value={form.confidence_level}
            onChange={(e) => setForm({ ...form, confidence_level: e.target.value })}
          >
            {["high", "medium", "low", "indicative"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select
            className={inputClass}
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            {["draft", "published", "archived"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-3">
          <label className={labelClass}>Summary</label>
          <textarea
            rows={3}
            className={inputClass}
            value={form.summary ?? ""}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
          />
        </div>
        <div className="sm:col-span-3">
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            {form.id ? "Update edition" : "Create edition"}
          </button>
        </div>
      </form>

      <ul className="mt-6 space-y-3">
        {editions.map((ed) => (
          <li
            key={ed.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 text-sm"
          >
            <div>
              <span className="font-medium">{ed.period_label}</span>{" "}
              <span className="text-muted-foreground">
                · v{ed.methodology_version} · {ed.status} · {ed.confidence_level}
              </span>
            </div>
            <button
              onClick={() => setForm({ ...ed })}
              className="text-sm text-brand hover:underline"
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Revisions ---------------- */

function RevisionsTab({
  indicators,
  revisions,
  onSave,
}: {
  indicators: IndexIndicator[];
  revisions: any[];
  onSave: (payload: Record<string, unknown>) => void;
}) {
  const [form, setForm] = useState<Record<string, any>>({
    entity_type: "datapoint",
    change_type: "correction",
    summary: "",
    is_public: true,
  });

  return (
    <div className="mt-6">
      <form
        className="grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSave({
            entity_type: form.entity_type,
            indicator_id: form.indicator_id ?? "",
            change_type: form.change_type,
            summary: form.summary,
            previous_value: form.previous_value ?? null,
            new_value: form.new_value ?? null,
            reason: form.reason ?? null,
            methodology_version: form.methodology_version ?? null,
            is_public: !!form.is_public,
          });
          setForm({
            entity_type: "datapoint",
            change_type: "correction",
            summary: "",
            is_public: true,
          });
        }}
      >
        <div>
          <label className={labelClass}>What changed</label>
          <select
            className={inputClass}
            value={form.entity_type}
            onChange={(e) => setForm({ ...form, entity_type: e.target.value })}
          >
            {["indicator", "datapoint", "edition", "methodology"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Change type</label>
          <select
            className={inputClass}
            value={form.change_type}
            onChange={(e) => setForm({ ...form, change_type: e.target.value })}
          >
            {[
              "created",
              "update",
              "correction",
              "restatement",
              "source_change",
              "methodology_change",
              "retired",
            ].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Indicator (optional)</label>
          <select
            className={inputClass}
            value={form.indicator_id ?? ""}
            onChange={(e) => setForm({ ...form, indicator_id: e.target.value })}
          >
            <option value="">None</option>
            {indicators.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-3">
          <label className={labelClass}>Summary</label>
          <input
            required
            className={inputClass}
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Previous value</label>
          <input
            className={inputClass}
            value={form.previous_value ?? ""}
            onChange={(e) => setForm({ ...form, previous_value: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>New value</label>
          <input
            className={inputClass}
            value={form.new_value ?? ""}
            onChange={(e) => setForm({ ...form, new_value: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Methodology version</label>
          <input
            className={inputClass}
            value={form.methodology_version ?? ""}
            onChange={(e) => setForm({ ...form, methodology_version: e.target.value })}
          />
        </div>
        <div className="sm:col-span-3">
          <label className={labelClass}>Reason</label>
          <textarea
            rows={2}
            className={inputClass}
            value={form.reason ?? ""}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
          />
        </div>
        <div className="flex items-center gap-2 sm:col-span-3">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!form.is_public}
              onChange={(e) => setForm({ ...form, is_public: e.target.checked })}
            />
            Show publicly
          </label>
        </div>
        <div className="sm:col-span-3">
          <button className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            <History className="h-4 w-4" /> Log revision
          </button>
        </div>
      </form>

      <ol className="mt-6 space-y-3">
        {revisions.map((r) => (
          <li key={r.id} className="rounded-xl border border-border bg-card p-4 text-sm">
            <div className="text-xs text-muted-foreground">
              {new Date(r.revised_at).toLocaleString("en-GB")} · {r.entity_type} · {r.change_type}
              {r.is_public ? "" : " · internal"}
            </div>
            <p className="mt-1 font-medium">{r.summary}</p>
            {r.previous_value || r.new_value ? (
              <p className="text-muted-foreground">
                {r.previous_value ?? "—"} → {r.new_value ?? "—"}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
