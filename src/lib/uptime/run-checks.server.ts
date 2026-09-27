// Server-only synthetic uptime checker.
//
// Fetches every enabled target, records the result, tracks consecutive
// failures and emails an alert when a target crosses the failure threshold
// (and again when it recovers). Called by the pg_cron-driven route at
// /api/public/hooks/uptime.

import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendUptimeAlert } from "./send-alert.server";

const TIMEOUT_MS = 20_000;
const UA = "AIEI-UptimeBot/1.0 (+https://aienergyintelligence.co.uk)";

export type Target = {
  id: string;
  label: string;
  environment: string;
  url: string;
  path: string;
  expect_text: string | null;
  expect_status: number;
  allow_statuses: number[] | null;
};

export type CheckResult = {
  target: Target;
  ok: boolean;
  status_code: number | null;
  latency_ms: number;
  body_bytes: number | null;
  failure_reason: string | null;
};

const ERROR_MARKERS = [
  "This page didn&#x27;t load",
  "This page didn't load",
  "Something went wrong on our end",
  '"unhandled":true',
];

async function checkOne(target: Target): Promise<CheckResult> {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(target.url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml,*/*" },
    });
    const body = await res.text();
    const latency = Date.now() - started;
    const allowed = new Set<number>([
      target.expect_status,
      ...(target.allow_statuses ?? []),
    ]);

    let reason: string | null = null;
    if (!allowed.has(res.status)) {
      reason = `HTTP ${res.status} (expected ${[...allowed].join(" or ")})`;
    } else if (ERROR_MARKERS.some((m) => body.includes(m))) {
      reason = "Error fallback page rendered";
    } else if (
      target.expect_text &&
      !body.toLowerCase().includes(target.expect_text.toLowerCase())
    ) {
      reason = `Expected content missing: "${target.expect_text}"`;
    }

    return {
      target,
      ok: reason === null,
      status_code: res.status,
      latency_ms: latency,
      body_bytes: body.length,
      failure_reason: reason,
    };
  } catch (e) {
    const aborted = e instanceof Error && e.name === "AbortError";
    return {
      target,
      ok: false,
      status_code: null,
      latency_ms: Date.now() - started,
      body_bytes: null,
      failure_reason: aborted
        ? `No response within ${TIMEOUT_MS / 1000}s`
        : `Request failed: ${e instanceof Error ? e.message : String(e)}`,
    };
  }
}

export async function runUptimeChecks(): Promise<{
  checked: number;
  failing: number;
  alerts: number;
  results: { label: string; environment: string; ok: boolean; reason: string | null }[];
}> {
  const { data: targets, error } = await supabaseAdmin
    .from("uptime_targets")
    .select("id, label, environment, url, path, expect_text, expect_status, allow_statuses")
    .eq("enabled", true);
  if (error) throw new Error(`Failed to load targets: ${error.message}`);

  const list = (targets ?? []) as Target[];
  const results = await Promise.all(list.map(checkOne));

  await supabaseAdmin.from("uptime_checks").insert(
    results.map((r) => ({
      target_id: r.target.id,
      ok: r.ok,
      status_code: r.status_code,
      latency_ms: r.latency_ms,
      body_bytes: r.body_bytes,
      failure_reason: r.failure_reason,
    })),
  );

  const { data: settings } = await supabaseAdmin
    .from("uptime_settings")
    .select("alert_email, alerts_enabled, failure_threshold")
    .eq("id", true)
    .maybeSingle();

  const threshold = settings?.failure_threshold ?? 2;
  const alertsEnabled = settings?.alerts_enabled ?? true;
  const alertEmail = settings?.alert_email ?? null;

  const { data: states } = await supabaseAdmin
    .from("uptime_state")
    .select("target_id, consecutive_failures, alerted, down_since");
  const stateById = new Map(
    (states ?? []).map((s: any) => [s.target_id as string, s]),
  );

  const now = new Date().toISOString();
  const wentDown: CheckResult[] = [];
  const recovered: CheckResult[] = [];
  const rows: any[] = [];

  for (const r of results) {
    const prev = stateById.get(r.target.id) ?? {
      consecutive_failures: 0,
      alerted: false,
      down_since: null,
    };

    if (r.ok) {
      if (prev.alerted) recovered.push(r);
      rows.push({
        target_id: r.target.id,
        consecutive_failures: 0,
        down_since: null,
        alerted: false,
        last_ok_at: now,
        last_status_code: r.status_code,
        last_failure_reason: null,
        updated_at: now,
      });
    } else {
      const fails = (prev.consecutive_failures ?? 0) + 1;
      const shouldAlert = !prev.alerted && fails >= threshold;
      if (shouldAlert) wentDown.push(r);
      const row: Record<string, unknown> = {
        target_id: r.target.id,
        consecutive_failures: fails,
        down_since: prev.down_since ?? now,
        alerted: prev.alerted || shouldAlert,
        last_status_code: r.status_code,
        last_failure_reason: r.failure_reason,
        updated_at: now,
      };
      // Only rows that trigger an alert carry last_alert_at; others omit the
      // column entirely so the existing value is preserved.
      if (shouldAlert) row.last_alert_at = now;
      rows.push(row);
    }
  }

  // Upsert rows with and without last_alert_at separately: a bulk upsert with
  // mixed keys would fill the missing column with null and wipe it.
  const withAlert = rows.filter((x) => "last_alert_at" in x);
  const withoutAlert = rows.filter((x) => !("last_alert_at" in x));
  if (withoutAlert.length) {
    await supabaseAdmin.from("uptime_state").upsert(withoutAlert, { onConflict: "target_id" });
  }
  if (withAlert.length) {
    await supabaseAdmin.from("uptime_state").upsert(withAlert, { onConflict: "target_id" });
  }

  let alerts = 0;
  if (alertsEnabled && alertEmail && (wentDown.length || recovered.length)) {
    await sendUptimeAlert({ to: alertEmail, down: wentDown, recovered });
    alerts = wentDown.length + recovered.length;
  }

  return {
    checked: results.length,
    failing: results.filter((r) => !r.ok).length,
    alerts,
    results: results.map((r) => ({
      label: r.target.label,
      environment: r.target.environment,
      ok: r.ok,
      reason: r.failure_reason,
    })),
  };
}
