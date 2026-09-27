import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/* ------------------------------------------------------------------ */
/* Overview — one batched read for the dashboard shell                 */
/* ------------------------------------------------------------------ */

export const getDashboardOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const [calcs, reports, favs, activity, watch, notif, settings] =
      await Promise.all([
        supabase
          .from("saved_calculations")
          .select("id, tool_slug, tool_name, inputs, result_summary, last_viewed_at, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false }),
        supabase
          .from("saved_reports")
          .select("id, title, category, source, download_url, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false }),
        supabase
          .from("favourites")
          .select("id, item_type, item_slug, item_title, position, created_at")
          .eq("user_id", userId)
          .order("position", { ascending: true }),
        supabase
          .from("activity_log")
          .select("id, kind, title, link, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(40),
        supabase
          .from("watchlists")
          .select("id, topic, label, created_at")
          .eq("user_id", userId),
        supabase
          .from("notifications")
          .select("id, title, body, kind, link, read, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("user_settings")
          .select("default_landing, email_notifications, units, theme")
          .eq("user_id", userId)
          .maybeSingle(),
      ]);

    return {
      savedCalculations: calcs.data ?? [],
      savedReports: reports.data ?? [],
      favourites: favs.data ?? [],
      activity: activity.data ?? [],
      watchlists: watch.data ?? [],
      notifications: notif.data ?? [],
      settings:
        settings.data ?? {
          default_landing: "/dashboard",
          email_notifications: true,
          units: "metric",
          theme: "system",
        },
    };
  });

/* ------------------------------------------------------------------ */
/* Saved calculations                                                  */
/* ------------------------------------------------------------------ */

export const saveCalculation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: {
    toolSlug: string;
    toolName: string;
    inputs: Record<string, unknown>;
    resultSummary: Record<string, unknown>;
  }) =>
    z
      .object({
        toolSlug: z.string().min(1),
        toolName: z.string().min(1),
        inputs: z.record(z.string(), z.unknown()).default({}),
        resultSummary: z.record(z.string(), z.unknown()).default({}),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("saved_calculations")
      .insert({
        user_id: userId,
        tool_slug: data.toolSlug,
        tool_name: data.toolName,
        inputs: data.inputs as never,
        result_summary: data.resultSummary as never,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    await supabase.from("activity_log").insert({
      user_id: userId,
      kind: "calculation",
      title: `Saved a calculation — ${data.toolName}`,
      link: data.toolSlug,
    });

    return { id: row.id };
  });

export const duplicateCalculation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) =>
    z.object({ id: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: src, error: e1 } = await supabase
      .from("saved_calculations")
      .select("tool_slug, tool_name, inputs, result_summary")
      .eq("id", data.id)
      .eq("user_id", userId)
      .single();
    if (e1) throw new Error(e1.message);
    const { data: row, error } = await supabase
      .from("saved_calculations")
      .insert({
        user_id: userId,
        tool_slug: src.tool_slug,
        tool_name: `${src.tool_name} (copy)`,
        inputs: src.inputs,
        result_summary: src.result_summary,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const touchCalculation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) =>
    z.object({ id: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await supabase
      .from("saved_calculations")
      .update({ last_viewed_at: new Date().toISOString() })
      .eq("id", data.id)
      .eq("user_id", userId);
    return { ok: true };
  });

export const deleteCalculation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) =>
    z.object({ id: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("saved_calculations")
      .delete()
      .eq("id", data.id)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Favourites                                                          */
/* ------------------------------------------------------------------ */

export const toggleFavourite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: {
    itemType: string;
    itemSlug: string;
    itemTitle: string;
  }) =>
    z
      .object({
        itemType: z.string().default("tool"),
        itemSlug: z.string().min(1),
        itemTitle: z.string().min(1),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: existing } = await supabase
      .from("favourites")
      .select("id")
      .eq("user_id", userId)
      .eq("item_type", data.itemType)
      .eq("item_slug", data.itemSlug)
      .maybeSingle();

    if (existing) {
      await supabase.from("favourites").delete().eq("id", existing.id).eq("user_id", userId);
      return { favourited: false };
    }
    await supabase.from("favourites").insert({
      user_id: userId,
      item_type: data.itemType,
      item_slug: data.itemSlug,
      item_title: data.itemTitle,
    });
    return { favourited: true };
  });

export const removeFavourite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) =>
    z.object({ id: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await supabase.from("favourites").delete().eq("id", data.id).eq("user_id", userId);
    return { ok: true };
  });

export const reorderFavourite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; position: number }) =>
    z.object({ id: z.string().uuid(), position: z.number().int() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await supabase
      .from("favourites")
      .update({ position: data.position })
      .eq("id", data.id)
      .eq("user_id", userId);
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Watchlists                                                          */
/* ------------------------------------------------------------------ */

export const toggleWatchlist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { topic: string; label: string }) =>
    z.object({ topic: z.string().min(1), label: z.string().min(1) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: existing } = await supabase
      .from("watchlists")
      .select("id")
      .eq("user_id", userId)
      .eq("topic", data.topic)
      .maybeSingle();
    if (existing) {
      await supabase.from("watchlists").delete().eq("id", existing.id).eq("user_id", userId);
      return { following: false };
    }
    await supabase
      .from("watchlists")
      .insert({ user_id: userId, topic: data.topic, label: data.label });
    return { following: true };
  });

/* ------------------------------------------------------------------ */
/* Reports                                                             */
/* ------------------------------------------------------------------ */

export const saveReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: {
    title: string;
    category?: string;
    source?: string;
    downloadUrl?: string;
  }) =>
    z
      .object({
        title: z.string().min(1),
        category: z.string().default("general"),
        source: z.string().default("generated"),
        downloadUrl: z.string().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("saved_reports")
      .insert({
        user_id: userId,
        title: data.title,
        category: data.category,
        source: data.source,
        download_url: data.downloadUrl ?? null,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    await supabase.from("activity_log").insert({
      user_id: userId,
      kind: "report",
      title: `Report saved — ${data.title}`,
      link: data.downloadUrl ?? null,
    });
    return { id: row.id };
  });

export const deleteReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) =>
    z.object({ id: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await supabase.from("saved_reports").delete().eq("id", data.id).eq("user_id", userId);
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Activity                                                            */
/* ------------------------------------------------------------------ */

export const logActivity = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { kind: string; title: string; link?: string }) =>
    z
      .object({
        kind: z.string().default("view"),
        title: z.string().min(1),
        link: z.string().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await supabase.from("activity_log").insert({
      user_id: userId,
      kind: data.kind,
      title: data.title,
      link: data.link ?? null,
    });
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Notifications                                                       */
/* ------------------------------------------------------------------ */

export const markNotificationRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) =>
    z.object({ id: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", data.id)
      .eq("user_id", userId);
    return { ok: true };
  });

export const markAllNotificationsRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false);
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

export const saveSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: {
    defaultLanding?: string;
    emailNotifications?: boolean;
    units?: string;
    theme?: string;
  }) =>
    z
      .object({
        defaultLanding: z.string().optional(),
        emailNotifications: z.boolean().optional(),
        units: z.string().optional(),
        theme: z.string().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const patch: Record<string, unknown> = { user_id: userId };
    // built dynamically below
    if (data.defaultLanding !== undefined) patch.default_landing = data.defaultLanding;
    if (data.emailNotifications !== undefined) patch.email_notifications = data.emailNotifications;
    if (data.units !== undefined) patch.units = data.units;
    if (data.theme !== undefined) patch.theme = data.theme;

    const { error } = await supabase
      .from("user_settings")
      .upsert(patch as never, { onConflict: "user_id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
