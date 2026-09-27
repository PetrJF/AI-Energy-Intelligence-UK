import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, CheckCircle2, AlertTriangle, PauseCircle } from "lucide-react";
import {
  getUptimeData,
  updateUptimeSettings,
  setUptimeTargetEnabled,
} from "@/lib/uptime.functions";
import { cn } from "@/lib/utils";

function timeAgo(iso: string | null | undefined): string {
  if (!iso) return "—";
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 48) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

function Sparkbar({ recent }: { recent: { ok: boolean; checked_at: string }[] }) {
  if (recent.length === 0)
    return <span className="text-xs text-muted-foreground">No checks yet</span>;
  return (
    <div className="flex items-end gap-[2px]">
      {recent.map((c, i) => (
        <span
          key={i}
          title={`${new Date(c.checked_at).toLocaleString()} — ${c.ok ? "OK" : "FAIL"}`}
          className={cn(
            "h-4 w-[3px] rounded-sm",
            c.ok ? "bg-emerald-500/70" : "bg-destructive",
          )}
        />
      ))}
    </div>
  );
}

export function UptimePanel() {
  const qc = useQueryClient();
  const fetchUptime = useServerFn(getUptimeData);
  const saveSettings = useServerFn(updateUptimeSettings);
  const toggleTarget = useServerFn(setUptimeTargetEnabled);

  const q = useQuery({
    queryKey: ["admin", "uptime"],
    queryFn: () => fetchUptime(),
    retry: false,
    refetchInterval: 60_000,
  });

  const [email, setEmail] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [threshold, setThreshold] = useState(2);

  useEffect(() => {
    if (q.data?.settings) {
      setEmail(q.data.settings.alert_email ?? "");
      setEnabled(!!q.data.settings.alerts_enabled);
      setThreshold(q.data.settings.failure_threshold ?? 2);
    }
  }, [q.data?.settings]);

  const save = useMutation({
    mutationFn: () =>
      saveSettings({
        data: { alert_email: email, alerts_enabled: enabled, failure_threshold: threshold },
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "uptime"] }),
  });

  const toggle = useMutation({
    mutationFn: (v: { id: string; enabled: boolean }) => toggleTarget({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "uptime"] }),
  });

  if (q.isLoading) {
    return (
      <div className="grid min-h-[30vh] place-items-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (q.isError) {
    return (
      <p className="text-sm text-destructive">
        Could not load uptime data: {(q.error as Error)?.message}
      </p>
    );
  }

  const targets = q.data?.targets ?? [];
  const failing = targets.filter((t: any) => t.state && t.state.consecutive_failures > 0);

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "flex items-start gap-3 rounded-xl border p-4",
          failing.length
            ? "border-destructive/40 bg-destructive/5"
            : "border-emerald-500/30 bg-emerald-500/5",
        )}
      >
        {failing.length ? (
          <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
        ) : (
          <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
        )}
        <div>
          <p className="font-medium">
            {failing.length
              ? `${failing.length} route${failing.length > 1 ? "s" : ""} currently failing`
              : "All monitored routes healthy"}
          </p>
          <p className="text-sm text-muted-foreground">
            Checks run every 5 minutes. Each check verifies the HTTP status, that the
            error fallback page is not rendered, and that the expected on-page content
            (including the main CTA wording) is present.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Route</th>
              <th className="px-3 py-2">Env</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">7d uptime</th>
              <th className="px-3 py-2">Median</th>
              <th className="px-3 py-2">Last 60 checks</th>
              <th className="px-3 py-2">Last failure</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {targets.map((t: any) => {
              const down = t.state && t.state.consecutive_failures > 0;
              return (
                <tr key={t.id} className="border-t border-border align-top">
                  <td className="px-3 py-3">
                    <div className="font-medium">{t.label}</div>
                    <a
                      href={t.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-muted-foreground underline-offset-2 hover:underline"
                    >
                      {t.path}
                    </a>
                  </td>
                  <td className="px-3 py-3 text-xs uppercase text-muted-foreground">
                    {t.environment}
                  </td>
                  <td className="px-3 py-3">
                    {!t.enabled ? (
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <PauseCircle className="h-4 w-4" /> Paused
                      </span>
                    ) : down ? (
                      <span className="font-medium text-destructive">
                        Failing ×{t.state.consecutive_failures}
                      </span>
                    ) : t.checks7d ? (
                      <span className="text-emerald-600">Healthy</span>
                    ) : (
                      <span className="text-muted-foreground">Awaiting first check</span>
                    )}
                  </td>
                  <td className="px-3 py-3 tabular-nums">
                    {t.uptimePct === null ? "—" : `${t.uptimePct}%`}
                  </td>
                  <td className="px-3 py-3 tabular-nums">
                    {t.medianLatency === null ? "—" : `${t.medianLatency}ms`}
                  </td>
                  <td className="px-3 py-3">
                    <Sparkbar recent={t.recent ?? []} />
                  </td>
                  <td className="px-3 py-3 text-xs text-muted-foreground">
                    {t.lastFailure ? (
                      <>
                        <div>{timeAgo(t.lastFailure.checked_at)}</div>
                        <div className="max-w-[220px] truncate" title={t.lastFailure.failure_reason ?? ""}>
                          {t.lastFailure.failure_reason}
                        </div>
                      </>
                    ) : (
                      "None in 7 days"
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <button
                      onClick={() => toggle.mutate({ id: t.id, enabled: !t.enabled })}
                      className="rounded-md border border-border px-2 py-1 text-xs hover:bg-secondary"
                    >
                      {t.enabled ? "Pause" : "Resume"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-border p-4">
        <h3 className="font-display text-lg font-semibold">Alerts</h3>
        <p className="mb-3 text-sm text-muted-foreground">
          An email is sent when a route fails the chosen number of consecutive checks,
          and again when it recovers.
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
              Alert email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-72 rounded-md border border-border bg-background px-3 py-2"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
              Failures before alert
            </span>
            <input
              type="number"
              min={1}
              max={5}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-24 rounded-md border border-border bg-background px-3 py-2"
            />
          </label>
          <label className="flex items-center gap-2 pb-2 text-sm">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
            Alerts enabled
          </label>
          <button
            onClick={() => save.mutate()}
            disabled={save.isPending}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {save.isPending ? "Saving…" : "Save"}
          </button>
          {save.isSuccess && <span className="pb-2 text-sm text-emerald-600">Saved</span>}
          {save.isError && (
            <span className="pb-2 text-sm text-destructive">
              {(save.error as Error)?.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
