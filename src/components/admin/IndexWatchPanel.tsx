import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, ExternalLink, AlertTriangle, CheckCircle2, Trash2 } from "lucide-react";
import {
  getIndexWatchData,
  upsertIndexWatchSource,
  setIndexWatchSourceEnabled,
  deleteIndexWatchSource,
  setIndexWatchFindingStatus,
  updateIndexWatchSettings,
  runIndexWatchNow,
} from "@/lib/index-watch.functions";
import { cn } from "@/lib/utils";

const AREAS = [
  { value: "electricity-demand", label: "Electricity demand" },
  { value: "data-centre-growth", label: "Data centre growth" },
  { value: "grid-pressure", label: "Grid pressure" },
  { value: "general", label: "General" },
] as const;

function when(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

export function IndexWatchPanel() {
  const qc = useQueryClient();
  const fetchData = useServerFn(getIndexWatchData);
  const addSource = useServerFn(upsertIndexWatchSource);
  const toggleSource = useServerFn(setIndexWatchSourceEnabled);
  const removeSource = useServerFn(deleteIndexWatchSource);
  const setFinding = useServerFn(setIndexWatchFindingStatus);
  const saveSettings = useServerFn(updateIndexWatchSettings);
  const runNow = useServerFn(runIndexWatchNow);

  const q = useQuery({
    queryKey: ["admin", "index-watch"],
    queryFn: () => fetchData(),
    retry: false,
  });

  const [email, setEmail] = useState("");
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [paused, setPaused] = useState(false);
  const [form, setForm] = useState({
    label: "",
    organisation: "",
    url: "",
    area: "general",
  });

  useEffect(() => {
    if (!q.data) return;
    setEmail(q.data.settings.alert_email ?? "");
    setAlertsEnabled(!!q.data.settings.alerts_enabled);
    setPaused(!!q.data.settings.paused);
  }, [q.data]);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin", "index-watch"] });
  const mutate = (fn: () => Promise<unknown>) =>
    fn()
      .then(invalidate)
      .catch((e) => alert(e instanceof Error ? e.message : String(e)));

  const runMutation = useMutation({
    mutationFn: () => runNow(),
    onSuccess: invalidate,
    onError: (e) => alert(e instanceof Error ? e.message : String(e)),
  });

  if (q.isLoading) {
    return (
      <div className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading source watch…
      </div>
    );
  }
  if (q.isError) {
    return (
      <p className="p-6 text-sm text-destructive">
        {q.error instanceof Error ? q.error.message : "Could not load source watch."}
      </p>
    );
  }

  const data = q.data!;
  const sourceById = new Map(data.sources.map((s: any) => [s.id, s]));
  const open = data.findings.filter((f: any) => f.status === "new");
  const closed = data.findings.filter((f: any) => f.status !== "new");

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold">Index source watch</h2>
        <p className="text-sm text-muted-foreground">
          Every Monday the official sources below are checked for new publications. Findings
          appear here for you to verify — no index figure is ever changed automatically.
        </p>
        <p className="text-xs text-muted-foreground">
          Last run: {when(data.settings.last_run_at)}
          {data.settings.last_run_summary ? ` — ${data.settings.last_run_summary}` : ""}
        </p>
      </header>

      {/* Settings */}
      <section className="rounded-lg border bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold">Weekly summary email</h3>
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex-1 min-w-[240px] text-xs text-muted-foreground">
            Send to
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground"
              placeholder="you@example.com"
            />
          </label>
          <label className="flex items-center gap-2 py-2 text-sm">
            <input
              type="checkbox"
              checked={alertsEnabled}
              onChange={(e) => setAlertsEnabled(e.target.checked)}
            />
            Email me each week
          </label>
          <label className="flex items-center gap-2 py-2 text-sm">
            <input
              type="checkbox"
              checked={paused}
              onChange={(e) => setPaused(e.target.checked)}
            />
            Pause the weekly check
          </label>
          <button
            type="button"
            onClick={() =>
              mutate(() =>
                saveSettings({
                  data: { alert_email: email, alerts_enabled: alertsEnabled, paused },
                }),
              )
            }
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => runMutation.mutate()}
            disabled={runMutation.isPending}
            className="rounded-md border px-4 py-2 text-sm font-medium"
          >
            {runMutation.isPending ? "Checking…" : "Run check now"}
          </button>
        </div>
      </section>

      {/* Review queue */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold">
          To review <span className="text-muted-foreground">({open.length})</span>
        </h3>
        {open.length === 0 ? (
          <p className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
            Nothing awaiting review. The next check runs on Monday.
          </p>
        ) : (
          <ul className="space-y-3">
            {open.map((f: any) => {
              const src = sourceById.get(f.watch_id);
              return (
                <li key={f.id} className="rounded-lg border bg-card p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-sm font-medium">
                        {f.kind === "error" ? (
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        )}
                        {f.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {src?.label ?? "Unknown source"}
                        {src?.organisation ? ` · ${src.organisation}` : ""} · detected{" "}
                        {when(f.detected_at)}
                      </p>
                      {f.detail && (
                        <p className="mt-2 text-sm text-muted-foreground">{f.detail}</p>
                      )}
                      {f.url && (
                        <a
                          href={f.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-sm text-primary underline"
                        >
                          Open source <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          mutate(() => setFinding({ data: { id: f.id, status: "reviewed" } }))
                        }
                        className="rounded-md border px-3 py-1.5 text-xs font-medium"
                      >
                        Mark reviewed
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          mutate(() => setFinding({ data: { id: f.id, status: "dismissed" } }))
                        }
                        className="rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Watched sources */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold">Watched sources ({data.sources.length})</h3>
        <div className="overflow-x-auto rounded-lg border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Source</th>
                <th className="px-3 py-2">Area</th>
                <th className="px-3 py-2">Last checked</th>
                <th className="px-3 py-2">Last change</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {data.sources.map((s: any) => (
                <tr key={s.id} className="border-t align-top">
                  <td className="px-3 py-2">
                    <p className="font-medium">{s.label}</p>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all text-xs text-muted-foreground underline"
                    >
                      {s.url}
                    </a>
                  </td>
                  <td className="px-3 py-2 text-xs">{s.area}</td>
                  <td className="px-3 py-2 text-xs">{when(s.last_checked_at)}</td>
                  <td className="px-3 py-2 text-xs">{when(s.last_changed_at)}</td>
                  <td className="px-3 py-2 text-xs">
                    <span
                      className={cn(
                        s.last_error ? "text-destructive" : "text-muted-foreground",
                      )}
                    >
                      {s.last_error ? s.last_error : s.enabled ? "Watching" : "Paused"}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          mutate(() =>
                            toggleSource({ data: { id: s.id, enabled: !s.enabled } }),
                          )
                        }
                        className="rounded-md border px-2 py-1 text-xs"
                      >
                        {s.enabled ? "Pause" : "Resume"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Remove "${s.label}" from the watch list?`))
                            mutate(() => removeSource({ data: { id: s.id } }));
                        }}
                        className="rounded-md border px-2 py-1 text-xs text-destructive"
                        aria-label={`Remove ${s.label}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <h4 className="mb-3 text-sm font-semibold">Add a source</h4>
          <div className="flex flex-wrap items-end gap-3">
            <label className="text-xs text-muted-foreground">
              Label
              <input
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                className="mt-1 block w-56 rounded-md border bg-background px-3 py-2 text-sm text-foreground"
              />
            </label>
            <label className="text-xs text-muted-foreground">
              Organisation
              <input
                value={form.organisation}
                onChange={(e) => setForm({ ...form, organisation: e.target.value })}
                className="mt-1 block w-44 rounded-md border bg-background px-3 py-2 text-sm text-foreground"
              />
            </label>
            <label className="flex-1 min-w-[240px] text-xs text-muted-foreground">
              Web address
              <input
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://www.gov.uk/…"
                className="mt-1 block w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground"
              />
            </label>
            <label className="text-xs text-muted-foreground">
              Index area
              <select
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                className="mt-1 block rounded-md border bg-background px-3 py-2 text-sm text-foreground"
              >
                {AREAS.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() =>
                mutate(async () => {
                  await addSource({ data: { ...form, enabled: true, display_order: 0 } as any });
                  setForm({ label: "", organisation: "", url: "", area: "general" });
                })
              }
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Add
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
