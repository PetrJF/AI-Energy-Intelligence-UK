// Server-only weekly source check for the UK AI Energy Index.
//
// Fetches each enabled watched source page, compares a hash of its main text
// against the last check, and records a finding when the page changes or the
// fetch fails. It NEVER writes index data — every finding is a prompt for a
// human to verify and publish manually.
//
// Called by the pg_cron-driven route at /api/public/hooks/index-watch.

import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendIndexWatchSummary } from "./send-summary.server";

const TIMEOUT_MS = 25_000;
const MAX_SOURCES_PER_RUN = 40;
const UA = "AIEI-SourceWatch/1.0 (+https://aienergyintelligence.co.uk)";

export type WatchSource = {
  id: string;
  label: string;
  organisation: string;
  url: string;
  area: string;
  content_hash: string | null;
};

export type WatchFinding = {
  watch: WatchSource;
  kind: "changed" | "new_item" | "error";
  title: string;
  url: string | null;
  detail: string | null;
};

/** Strip markup, scripts and volatile whitespace so only real copy is hashed. */
function extractText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200_000);
}

function pageTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m?.[1] ? m[1].replace(/\s+/g, " ").trim().slice(0, 200) : null;
}

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function checkOne(watch: WatchSource): Promise<WatchFinding | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const now = new Date().toISOString();

  try {
    const res = await fetch(watch.url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml,*/*" },
    });
    const html = await res.text();

    if (!res.ok) {
      await supabaseAdmin
        .from("index_watch_sources")
        .update({
          last_checked_at: now,
          last_status_code: res.status,
          last_error: `HTTP ${res.status}`,
        })
        .eq("id", watch.id);
      return {
        watch,
        kind: "error",
        title: `${watch.label} could not be checked`,
        url: watch.url,
        detail: `The page returned HTTP ${res.status}. The address may have moved.`,
      };
    }

    const hash = await sha256(extractText(html));
    const changed = !!watch.content_hash && watch.content_hash !== hash;

    await supabaseAdmin
      .from("index_watch_sources")
      .update({
        last_checked_at: now,
        last_status_code: res.status,
        last_error: null,
        content_hash: hash,
        ...(changed || !watch.content_hash ? { last_changed_at: now } : {}),
      })
      .eq("id", watch.id);

    if (!changed) return null;

    return {
      watch,
      kind: "changed",
      title: pageTitle(html) ?? `${watch.label} has been updated`,
      url: watch.url,
      detail:
        "The published content on this page has changed since the last weekly check. Open it, confirm what is new, and enter any figure manually with its source before publishing.",
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    await supabaseAdmin
      .from("index_watch_sources")
      .update({ last_checked_at: now, last_status_code: null, last_error: message })
      .eq("id", watch.id);
    return {
      watch,
      kind: "error",
      title: `${watch.label} could not be reached`,
      url: watch.url,
      detail: message,
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function runIndexWatch(): Promise<{
  checked: number;
  findings: number;
  skipped?: string;
}> {
  const { data: settings } = await supabaseAdmin
    .from("index_watch_settings")
    .select("alert_email, alerts_enabled, paused")
    .eq("id", true)
    .maybeSingle();

  if (settings?.paused) return { checked: 0, findings: 0, skipped: "paused" };

  const { data, error } = await supabaseAdmin
    .from("index_watch_sources")
    .select("id, label, organisation, url, area, content_hash")
    .eq("enabled", true)
    .order("display_order", { ascending: true })
    .limit(MAX_SOURCES_PER_RUN);

  if (error) throw new Error(error.message);
  const sources = (data ?? []) as WatchSource[];

  const findings: WatchFinding[] = [];
  // Sequential on purpose: these are public government sites, and the run is
  // weekly, so there is no reason to hit them in parallel.
  for (const s of sources) {
    const finding = await checkOne(s);
    if (finding) findings.push(finding);
  }

  if (findings.length) {
    const { error: insertError } = await supabaseAdmin.from("index_watch_findings").insert(
      findings.map((f) => ({
        watch_id: f.watch.id,
        kind: f.kind,
        title: f.title,
        url: f.url,
        detail: f.detail,
      })) as never,
    );
    if (insertError) console.error("[index-watch] finding insert failed", insertError.message);
  }

  const summary = `${sources.length} sources checked, ${findings.length} to review`;
  await supabaseAdmin
    .from("index_watch_settings")
    .update({ last_run_at: new Date().toISOString(), last_run_summary: summary })
    .eq("id", true);

  if (settings?.alerts_enabled && settings.alert_email) {
    await sendIndexWatchSummary({
      to: settings.alert_email,
      checked: sources.length,
      findings,
    });
  }

  return { checked: sources.length, findings: findings.length };
}
