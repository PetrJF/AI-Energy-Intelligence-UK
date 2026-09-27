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

export const getUptimeData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabase } = context;

    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [targetsRes, statesRes, checksRes, settingsRes] = await Promise.all([
      supabase
        .from("uptime_targets")
        .select("id, label, environment, url, path, enabled, expect_text")
        .order("environment")
        .order("label"),
      supabase
        .from("uptime_state")
        .select(
          "target_id, consecutive_failures, down_since, alerted, last_alert_at, last_ok_at, last_status_code, last_failure_reason, updated_at",
        ),
      supabase
        .from("uptime_checks")
        .select("target_id, checked_at, ok, status_code, latency_ms, failure_reason")
        .gte("checked_at", since)
        .order("checked_at", { ascending: false })
        .limit(5000),
      supabase
        .from("uptime_settings")
        .select("alert_email, alerts_enabled, failure_threshold")
        .eq("id", true)
        .maybeSingle(),
    ]);

    if (targetsRes.error) throw new Error(targetsRes.error.message);
    if (checksRes.error) throw new Error(checksRes.error.message);

    const checks = (checksRes.data ?? []) as any[];
    const states = new Map(
      ((statesRes.data ?? []) as any[]).map((s) => [s.target_id, s]),
    );

    const targets = ((targetsRes.data ?? []) as any[]).map((t) => {
      const mine = checks.filter((c) => c.target_id === t.id);
      const total = mine.length;
      const okCount = mine.filter((c) => c.ok).length;
      const latencies = mine
        .map((c) => c.latency_ms)
        .filter((n): n is number => typeof n === "number")
        .sort((a, b) => a - b);
      const state = states.get(t.id) ?? null;
      return {
        ...t,
        state,
        checks7d: total,
        uptimePct: total ? Math.round((okCount / total) * 1000) / 10 : null,
        medianLatency: latencies.length
          ? latencies[Math.floor(latencies.length / 2)]
          : null,
        recent: mine.slice(0, 60).reverse(),
        lastFailure: mine.find((c) => !c.ok) ?? null,
      };
    });

    return {
      targets,
      settings: settingsRes.data ?? {
        alert_email: "",
        alerts_enabled: true,
        failure_threshold: 2,
      },
      generatedAt: new Date().toISOString(),
    };
  });

export const updateUptimeSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        alert_email: z.string().trim().email().max(255),
        alerts_enabled: z.boolean(),
        failure_threshold: z.number().int().min(1).max(5),
      })
      .parse(data),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("uptime_settings")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", true);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const setUptimeTargetEnabled = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid(), enabled: z.boolean() }).parse(data),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("uptime_targets")
      .update({ enabled: data.enabled })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
