// Admin server functions for the weekly UK AI Energy Index source check.
// Reads the watch list, the review queue and the settings; lets an admin add,
// enable/disable and triage sources. No public reads.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error("Role check failed");
  if (!data) throw new Error("Forbidden");
}

export const getIndexWatchData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabase } = context;

    const [sourcesRes, findingsRes, settingsRes] = await Promise.all([
      supabase
        .from("index_watch_sources")
        .select(
          "id, label, organisation, url, area, notes, enabled, display_order, last_checked_at, last_changed_at, last_status_code, last_error",
        )
        .order("display_order", { ascending: true })
        .order("label", { ascending: true }),
      supabase
        .from("index_watch_findings")
        .select("id, watch_id, detected_at, kind, title, url, detail, status")
        .order("detected_at", { ascending: false })
        .limit(300),
      supabase
        .from("index_watch_settings")
        .select("alert_email, alerts_enabled, paused, last_run_at, last_run_summary")
        .eq("id", true)
        .maybeSingle(),
    ]);

    if (sourcesRes.error) throw new Error(sourcesRes.error.message);
    if (findingsRes.error) throw new Error(findingsRes.error.message);

    return {
      sources: sourcesRes.data ?? [],
      findings: findingsRes.data ?? [],
      settings:
        settingsRes.data ?? {
          alert_email: "",
          alerts_enabled: true,
          paused: false,
          last_run_at: null,
          last_run_summary: null,
        },
    };
  });

export const upsertIndexWatchSource = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().uuid().optional(),
        label: z.string().min(1).max(160),
        organisation: z.string().max(160).default(""),
        url: z.string().url().max(600),
        area: z
          .enum(["electricity-demand", "data-centre-growth", "grid-pressure", "general"])
          .default("general"),
        notes: z.string().max(1000).nullish(),
        enabled: z.boolean().default(true),
        display_order: z.number().int().min(0).max(999).default(0),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: row, error } = await context.supabase
      .from("index_watch_sources")
      .upsert(data as never, { onConflict: "id" })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: (row as { id: string }).id };
  });

export const setIndexWatchSourceEnabled = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid(), enabled: z.boolean() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("index_watch_sources")
      .update({ enabled: data.enabled })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteIndexWatchSource = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("index_watch_sources")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const setIndexWatchFindingStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["new", "reviewed", "dismissed"]),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("index_watch_findings")
      .update({
        status: data.status,
        reviewed_at: data.status === "new" ? null : new Date().toISOString(),
        reviewed_by: data.status === "new" ? null : context.userId,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateIndexWatchSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        alert_email: z.string().email().or(z.literal("")),
        alerts_enabled: z.boolean(),
        paused: z.boolean(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("index_watch_settings")
      .upsert({ id: true, ...data } as never, { onConflict: "id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Run the weekly check immediately (admin-triggered, same code path as cron). */
export const runIndexWatchNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { runIndexWatch } = await import("@/lib/index-watch/run-checks.server");
    return await runIndexWatch();
  });
