import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Plus, ShieldAlert, Trash2, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  adminListDcProjects,
  adminUpsertDcProject,
  adminDeleteDcProject,
  type DcProject,
} from "@/lib/dc-projects.functions";
import {
  DC_STATUS_LABELS,
  DC_TYPE_LABELS,
  DC_AI_RELEVANCE_LABELS,
  DC_CONFIDENCE_LABELS,
  DC_REGIONS,
} from "@/lib/dc-projects";

export const Route = createFileRoute("/AIAdmin/data-centres/")({
  head: () => ({
    meta: [
      { title: "Data centre tracker admin — AI Energy Intelligence UK" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: DcAdmin,
});

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40";
const labelClass = "block text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1";

type FormState = {
  id?: string;
  slug: string;
  name: string;
  operator: string;
  town: string;
  region: string;
  country: string;
  latitude: string;
  longitude: string;
  status: string;
  project_type: string;
  ai_relevance: string;
  announced_date: string;
  target_live_date: string;
  capacity_mw: string;
  floor_area_sqm: string;
  investment_gbp: string;
  power_notes: string;
  cooling_notes: string;
  water_notes: string;
  grid_connection_notes: string;
  planning_reference: string;
  planning_authority: string;
  summary: string;
  key_facts: { label: string; value: string }[];
  sources: { title: string; url: string; publisher?: string; date?: string }[];
  confidence_level: string;
  verified: boolean;
  status_publication: string;
  display_order: string;
};

const EMPTY: FormState = {
  slug: "",
  name: "",
  operator: "",
  town: "",
  region: "Unknown",
  country: "United Kingdom",
  latitude: "",
  longitude: "",
  status: "proposed",
  project_type: "data_centre",
  ai_relevance: "unknown",
  announced_date: "",
  target_live_date: "",
  capacity_mw: "",
  floor_area_sqm: "",
  investment_gbp: "",
  power_notes: "",
  cooling_notes: "",
  water_notes: "",
  grid_connection_notes: "",
  planning_reference: "",
  planning_authority: "",
  summary: "",
  key_facts: [],
  sources: [],
  confidence_level: "medium",
  verified: false,
  status_publication: "draft",
  display_order: "0",
};

function toForm(p: DcProject): FormState {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    operator: p.operator ?? "",
    town: p.town ?? "",
    region: p.region,
    country: p.country,
    latitude: p.latitude === null ? "" : String(p.latitude),
    longitude: p.longitude === null ? "" : String(p.longitude),
    status: p.status,
    project_type: p.project_type,
    ai_relevance: p.ai_relevance,
    announced_date: p.announced_date ?? "",
    target_live_date: p.target_live_date ?? "",
    capacity_mw: p.capacity_mw === null ? "" : String(p.capacity_mw),
    floor_area_sqm: p.floor_area_sqm === null ? "" : String(p.floor_area_sqm),
    investment_gbp: p.investment_gbp === null ? "" : String(p.investment_gbp),
    power_notes: p.power_notes ?? "",
    cooling_notes: p.cooling_notes ?? "",
    water_notes: p.water_notes ?? "",
    grid_connection_notes: p.grid_connection_notes ?? "",
    planning_reference: p.planning_reference ?? "",
    planning_authority: p.planning_authority ?? "",
    summary: p.summary ?? "",
    key_facts: p.key_facts,
    sources: p.sources,
    confidence_level: p.confidence_level,
    verified: p.verified,
    status_publication: p.status_publication,
    display_order: String(p.display_order),
  };
}

const num = (v: string) => (v.trim() === "" ? null : Number(v));
const str = (v: string) => (v.trim() === "" ? null : v.trim());

function slugify(v: string) {
  return v
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function DcAdmin() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const qc = useQueryClient();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/login", search: { redirect: "/AIAdmin/data-centres" } });
    }
  }, [authLoading, user, navigate]);

  const fetchAll = useServerFn(adminListDcProjects);
  const query = useQuery({
    queryKey: ["admin", "dc-projects"],
    queryFn: () => fetchAll(),
    enabled: !!user,
  });

  const upsertFn = useServerFn(adminUpsertDcProject);
  const deleteFn = useServerFn(adminDeleteDcProject);

  const save = useMutation({
    mutationFn: (state: FormState) =>
      upsertFn({
        data: {
          ...(state.id ? { id: state.id } : {}),
          slug: state.slug || slugify(state.name),
          name: state.name,
          operator: str(state.operator),
          town: str(state.town),
          region: state.region,
          country: state.country || "United Kingdom",
          latitude: num(state.latitude),
          longitude: num(state.longitude),
          status: state.status,
          project_type: state.project_type,
          ai_relevance: state.ai_relevance,
          announced_date: str(state.announced_date),
          target_live_date: str(state.target_live_date),
          capacity_mw: num(state.capacity_mw),
          floor_area_sqm: num(state.floor_area_sqm),
          investment_gbp: num(state.investment_gbp),
          power_notes: str(state.power_notes),
          cooling_notes: str(state.cooling_notes),
          water_notes: str(state.water_notes),
          grid_connection_notes: str(state.grid_connection_notes),
          planning_reference: str(state.planning_reference),
          planning_authority: str(state.planning_authority),
          summary: str(state.summary),
          key_facts: state.key_facts.filter((f) => f.label && f.value),
          sources: state.sources.filter((s) => s.title && s.url),
          confidence_level: state.confidence_level,
          verified: state.verified,
          status_publication: state.status_publication,
          display_order: Number(state.display_order) || 0,
        },
      }),
    onSuccess: () => {
      setForm(EMPTY);
      setError(null);
      qc.invalidateQueries({ queryKey: ["admin", "dc-projects"] });
    },
    onError: (e: unknown) => setError(e instanceof Error ? e.message : "Save failed"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "dc-projects"] }),
  });

  if (authLoading || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <ShieldAlert className="mx-auto h-6 w-6 text-muted-foreground" aria-hidden />
        <p className="mt-3 font-medium">You don't have access to the tracker admin.</p>
      </div>
    );
  }

  const projects = query.data ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/AIAdmin" className="inline-flex items-center gap-1 text-sm text-muted-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Back to admin
      </Link>
      <h1 className="mt-3 text-2xl font-semibold">UK data-centre tracker</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Entry template for verified projects. Leave any field blank when the figure has not been
        published — blanks display as "Not published" rather than an estimate.
      </p>

      <form
        className="mt-8 space-y-6 rounded-xl border border-border bg-card p-5"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate(form);
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelClass}>Project name *</label>
            <input
              required
              className={inputClass}
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  name: e.target.value,
                  slug: f.id ? f.slug : slugify(e.target.value),
                }))
              }
            />
          </div>
          <div>
            <label className={labelClass}>Slug *</label>
            <input
              required
              className={inputClass}
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Operator / developer</label>
            <input
              className={inputClass}
              value={form.operator}
              onChange={(e) => setForm((f) => ({ ...f, operator: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Town</label>
            <input
              className={inputClass}
              value={form.town}
              onChange={(e) => setForm((f) => ({ ...f, town: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Region</label>
            <select
              className={inputClass}
              value={form.region}
              onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
            >
              {DC_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            >
              {Object.entries(DC_STATUS_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Project type</label>
            <select
              className={inputClass}
              value={form.project_type}
              onChange={(e) => setForm((f) => ({ ...f, project_type: e.target.value }))}
            >
              {Object.entries(DC_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>AI relevance</label>
            <select
              className={inputClass}
              value={form.ai_relevance}
              onChange={(e) => setForm((f) => ({ ...f, ai_relevance: e.target.value }))}
            >
              {Object.entries(DC_AI_RELEVANCE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Confidence</label>
            <select
              className={inputClass}
              value={form.confidence_level}
              onChange={(e) => setForm((f) => ({ ...f, confidence_level: e.target.value }))}
            >
              {Object.entries(DC_CONFIDENCE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Capacity (MW)</label>
            <input
              className={inputClass}
              value={form.capacity_mw}
              onChange={(e) => setForm((f) => ({ ...f, capacity_mw: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Floor area (m²)</label>
            <input
              className={inputClass}
              value={form.floor_area_sqm}
              onChange={(e) => setForm((f) => ({ ...f, floor_area_sqm: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Investment (£)</label>
            <input
              className={inputClass}
              value={form.investment_gbp}
              onChange={(e) => setForm((f) => ({ ...f, investment_gbp: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Announced date</label>
            <input
              type="date"
              className={inputClass}
              value={form.announced_date}
              onChange={(e) => setForm((f) => ({ ...f, announced_date: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Target live date</label>
            <input
              type="date"
              className={inputClass}
              value={form.target_live_date}
              onChange={(e) => setForm((f) => ({ ...f, target_live_date: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Planning authority</label>
            <input
              className={inputClass}
              value={form.planning_authority}
              onChange={(e) => setForm((f) => ({ ...f, planning_authority: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Planning reference</label>
            <input
              className={inputClass}
              value={form.planning_reference}
              onChange={(e) => setForm((f) => ({ ...f, planning_reference: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Latitude</label>
            <input
              className={inputClass}
              value={form.latitude}
              onChange={(e) => setForm((f) => ({ ...f, latitude: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Longitude</label>
            <input
              className={inputClass}
              value={form.longitude}
              onChange={(e) => setForm((f) => ({ ...f, longitude: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Summary</label>
            <textarea
              rows={3}
              className={inputClass}
              value={form.summary}
              onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Power notes</label>
            <textarea
              rows={2}
              className={inputClass}
              value={form.power_notes}
              onChange={(e) => setForm((f) => ({ ...f, power_notes: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Grid connection notes</label>
            <textarea
              rows={2}
              className={inputClass}
              value={form.grid_connection_notes}
              onChange={(e) => setForm((f) => ({ ...f, grid_connection_notes: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Cooling notes</label>
            <textarea
              rows={2}
              className={inputClass}
              value={form.cooling_notes}
              onChange={(e) => setForm((f) => ({ ...f, cooling_notes: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Water notes</label>
            <textarea
              rows={2}
              className={inputClass}
              value={form.water_notes}
              onChange={(e) => setForm((f) => ({ ...f, water_notes: e.target.value }))}
            />
          </div>
        </div>

        <fieldset>
          <legend className={labelClass}>Sources</legend>
          <div className="space-y-2">
            {form.sources.map((s, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-[2fr_3fr_1.5fr_1fr_auto]">
                <input
                  className={inputClass}
                  placeholder="Title"
                  value={s.title}
                  onChange={(e) =>
                    setForm((f) => {
                      const next = [...f.sources];
                      next[i] = { ...next[i]!, title: e.target.value };
                      return { ...f, sources: next };
                    })
                  }
                />
                <input
                  className={inputClass}
                  placeholder="https://"
                  value={s.url}
                  onChange={(e) =>
                    setForm((f) => {
                      const next = [...f.sources];
                      next[i] = { ...next[i]!, url: e.target.value };
                      return { ...f, sources: next };
                    })
                  }
                />
                <input
                  className={inputClass}
                  placeholder="Publisher"
                  value={s.publisher ?? ""}
                  onChange={(e) =>
                    setForm((f) => {
                      const next = [...f.sources];
                      next[i] = { ...next[i]!, publisher: e.target.value };
                      return { ...f, sources: next };
                    })
                  }
                />
                <input
                  className={inputClass}
                  placeholder="Date"
                  value={s.date ?? ""}
                  onChange={(e) =>
                    setForm((f) => {
                      const next = [...f.sources];
                      next[i] = { ...next[i]!, date: e.target.value };
                      return { ...f, sources: next };
                    })
                  }
                />
                <button
                  type="button"
                  className="rounded-md border border-border px-2"
                  onClick={() =>
                    setForm((f) => ({ ...f, sources: f.sources.filter((_, j) => j !== i) }))
                  }
                  aria-label="Remove source"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-2 inline-flex items-center gap-1 text-sm underline"
            onClick={() =>
              setForm((f) => ({ ...f, sources: [...f.sources, { title: "", url: "" }] }))
            }
          >
            <Plus className="h-4 w-4" aria-hidden /> Add source
          </button>
        </fieldset>

        <fieldset>
          <legend className={labelClass}>Key facts</legend>
          <div className="space-y-2">
            {form.key_facts.map((f0, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
                <input
                  className={inputClass}
                  placeholder="Label"
                  value={f0.label}
                  onChange={(e) =>
                    setForm((f) => {
                      const next = [...f.key_facts];
                      next[i] = { ...next[i]!, label: e.target.value };
                      return { ...f, key_facts: next };
                    })
                  }
                />
                <input
                  className={inputClass}
                  placeholder="Value"
                  value={f0.value}
                  onChange={(e) =>
                    setForm((f) => {
                      const next = [...f.key_facts];
                      next[i] = { ...next[i]!, value: e.target.value };
                      return { ...f, key_facts: next };
                    })
                  }
                />
                <button
                  type="button"
                  className="rounded-md border border-border px-2"
                  onClick={() =>
                    setForm((f) => ({ ...f, key_facts: f.key_facts.filter((_, j) => j !== i) }))
                  }
                  aria-label="Remove fact"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-2 inline-flex items-center gap-1 text-sm underline"
            onClick={() =>
              setForm((f) => ({ ...f, key_facts: [...f.key_facts, { label: "", value: "" }] }))
            }
          >
            <Plus className="h-4 w-4" aria-hidden /> Add key fact
          </button>
        </fieldset>

        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className={labelClass}>Publication</label>
            <select
              className={inputClass}
              value={form.status_publication}
              onChange={(e) => setForm((f) => ({ ...f, status_publication: e.target.value }))}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Display order</label>
            <input
              className={`${inputClass} w-28`}
              value={form.display_order}
              onChange={(e) => setForm((f) => ({ ...f, display_order: e.target.value }))}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.verified}
              onChange={(e) => setForm((f) => ({ ...f, verified: e.target.checked }))}
            />
            Verified against a named source
          </label>
          <div className="ml-auto flex gap-2">
            {form.id && (
              <button
                type="button"
                className="rounded-md border border-border px-4 py-2 text-sm"
                onClick={() => setForm(EMPTY)}
              >
                Cancel edit
              </button>
            )}
            <button
              type="submit"
              disabled={save.isPending}
              className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm text-background disabled:opacity-60"
            >
              {save.isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              {form.id ? "Save changes" : "Add project"}
            </button>
          </div>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </form>

      <h2 className="mt-10 text-lg font-semibold">Projects ({projects.length})</h2>
      {query.isLoading ? (
        <Loader2 className="mt-4 h-5 w-5 animate-spin" aria-hidden />
      ) : (
        <div className="mt-3 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Region</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">MW</th>
                <th className="px-3 py-2">Publication</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-3 py-2 font-medium">{p.name}</td>
                  <td className="px-3 py-2">{p.region}</td>
                  <td className="px-3 py-2">{DC_STATUS_LABELS[p.status] ?? p.status}</td>
                  <td className="px-3 py-2">{p.capacity_mw ?? "—"}</td>
                  <td className="px-3 py-2">{p.status_publication}</td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-3">
                      <button type="button" className="underline" onClick={() => setForm(toForm(p))}>
                        Edit
                      </button>
                      <Link
                        to="/uk-data-centre-tracker/$slug"
                        params={{ slug: p.slug }}
                        className="inline-flex items-center gap-1 underline"
                      >
                        View <ExternalLink className="h-3 w-3" aria-hidden />
                      </Link>
                      <button
                        type="button"
                        className="text-destructive underline"
                        onClick={() => {
                          if (confirm(`Delete ${p.name}?`)) remove.mutate(p.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
