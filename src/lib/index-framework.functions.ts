// UK AI Energy Index — server functions.
// Public reads: published indicators, editions, datapoints and revision history.
// Admin writes: full CRUD, admin role required. Data entry is deliberately
// manual at this stage (no automated ingestion).

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type Confidence = "high" | "medium" | "low" | "indicative";

export type IndexIndicator = {
  id: string;
  slug: string;
  name: string;
  short_name: string | null;
  category: string;
  description: string | null;
  unit: string;
  weight: number;
  direction: string;
  source_name: string | null;
  source_url: string | null;
  source_type: string;
  update_frequency: string;
  next_review_at: string | null;
  last_updated_at: string | null;
  methodology: string | null;
  confidence_level: Confidence;
  collection_method: "manual" | "semi_automated" | "automated";
  caveats: string | null;
  display_order: number;
  status: "draft" | "published" | "retired";
  created_at: string;
  updated_at: string;
};

export type IndexDatapoint = {
  id: string;
  indicator_id: string;
  edition_id: string | null;
  period_label: string;
  period_start: string | null;
  period_end: string | null;
  value: number | null;
  value_text: string | null;
  unit: string | null;
  normalised_score: number | null;
  is_estimate: boolean;
  confidence_level: Confidence;
  source_name: string | null;
  source_url: string | null;
  collected_at: string;
  notes: string | null;
  status: "draft" | "published" | "superseded";
  created_at: string;
  updated_at: string;
};

export type IndexEdition = {
  id: string;
  slug: string;
  period_label: string;
  period_start: string | null;
  period_end: string | null;
  headline_score: number | null;
  previous_score: number | null;
  summary: string | null;
  methodology_version: string;
  confidence_level: Confidence;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type IndexRevision = {
  id: string;
  entity_type: "indicator" | "datapoint" | "edition" | "methodology";
  entity_id: string | null;
  indicator_id: string | null;
  edition_id: string | null;
  change_type: string;
  summary: string;
  previous_value: string | null;
  new_value: string | null;
  reason: string | null;
  methodology_version: string | null;
  revised_at: string;
  revised_by: string | null;
  is_public: boolean;
};

const INDICATOR_COLUMNS =
  "id, slug, name, short_name, category, description, unit, weight, direction, source_name, source_url, source_type, update_frequency, next_review_at, last_updated_at, methodology, confidence_level, collection_method, caveats, display_order, status, created_at, updated_at";

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error("Role check failed");
  if (!data) throw new Error("Forbidden");
}

// ---------- Public ----------

export const getIndexFramework = createServerFn({ method: "GET" }).handler(async () => {
  const [indicators, editions, datapoints, revisions] = await Promise.all([
    supabaseAdmin
      .from("index_indicators")
      .select(INDICATOR_COLUMNS)
      .eq("status", "published")
      .order("display_order", { ascending: true }),
    supabaseAdmin
      .from("index_editions")
      .select("*")
      .eq("status", "published")
      .order("period_start", { ascending: false })
      .limit(24),
    supabaseAdmin
      .from("index_datapoints")
      .select("*")
      .eq("status", "published")
      .order("period_start", { ascending: false })
      .limit(500),
    supabaseAdmin
      .from("index_revisions")
      .select("*")
      .eq("is_public", true)
      .order("revised_at", { ascending: false })
      .limit(50),
  ]);

  return {
    indicators: (indicators.data ?? []) as IndexIndicator[],
    editions: (editions.data ?? []) as IndexEdition[],
    datapoints: (datapoints.data ?? []) as IndexDatapoint[],
    revisions: (revisions.data ?? []) as IndexRevision[],
  };
});

// ---------- Admin ----------

export const adminGetIndexFramework = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const [indicators, editions, datapoints, revisions] = await Promise.all([
      supabaseAdmin
        .from("index_indicators")
        .select(INDICATOR_COLUMNS)
        .order("display_order", { ascending: true }),
      supabaseAdmin.from("index_editions").select("*").order("period_start", { ascending: false }),
      supabaseAdmin
        .from("index_datapoints")
        .select("*")
        .order("period_start", { ascending: false })
        .limit(1000),
      supabaseAdmin
        .from("index_revisions")
        .select("*")
        .order("revised_at", { ascending: false })
        .limit(200),
    ]);
    return {
      indicators: (indicators.data ?? []) as IndexIndicator[],
      editions: (editions.data ?? []) as IndexEdition[],
      datapoints: (datapoints.data ?? []) as IndexDatapoint[],
      revisions: (revisions.data ?? []) as IndexRevision[],
    };
  });

const confidence = z.enum(["high", "medium", "low", "indicative"]);

const indicatorInput = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(120),
  name: z.string().min(1).max(200),
  short_name: z.string().max(80).nullish(),
  category: z.enum(["demand", "infrastructure", "grid", "cost", "efficiency", "policy", "public"]),
  description: z.string().max(2000).nullish(),
  unit: z.string().max(60).default(""),
  weight: z.number().min(0).max(100).default(1),
  direction: z
    .enum(["higher_is_more_pressure", "lower_is_more_pressure", "neutral"])
    .default("higher_is_more_pressure"),
  source_name: z.string().max(200).nullish(),
  source_url: z.string().url().max(500).nullish().or(z.literal("")),
  source_type: z
    .enum(["official", "regulator", "operator", "press", "industry", "modelled", "survey"])
    .default("official"),
  update_frequency: z
    .enum(["monthly", "quarterly", "biannual", "annual", "ad_hoc"])
    .default("quarterly"),
  next_review_at: z.string().nullish().or(z.literal("")),
  methodology: z.string().max(4000).nullish(),
  confidence_level: confidence.default("medium"),
  collection_method: z.enum(["manual", "semi_automated", "automated"]).default("manual"),
  caveats: z.string().max(2000).nullish(),
  display_order: z.number().int().min(0).max(999).default(0),
  status: z.enum(["draft", "published", "retired"]).default("draft"),
});

function clean<T extends Record<string, unknown>>(row: T) {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) out[k] = v === "" ? null : v;
  return out;
}

export const adminUpsertIndicator = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => indicatorInput.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const payload = clean({ ...data, last_updated_at: new Date().toISOString() });
    const { data: row, error } = await supabaseAdmin
      .from("index_indicators")
      .upsert(payload as never, { onConflict: "id" })
      .select(INDICATOR_COLUMNS)
      .single();
    if (error) throw new Error(error.message);
    return { indicator: row as IndexIndicator };
  });

export const adminDeleteIndicator = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await supabaseAdmin.from("index_indicators").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const datapointInput = z.object({
  id: z.string().uuid().optional(),
  indicator_id: z.string().uuid(),
  edition_id: z.string().uuid().nullish().or(z.literal("")),
  period_label: z.string().min(1).max(60),
  period_start: z.string().nullish().or(z.literal("")),
  period_end: z.string().nullish().or(z.literal("")),
  value: z.number().nullish(),
  value_text: z.string().max(200).nullish(),
  unit: z.string().max(60).nullish(),
  is_estimate: z.boolean().default(false),
  confidence_level: confidence.default("medium"),
  source_name: z.string().max(200).nullish(),
  source_url: z.string().url().max(500).nullish().or(z.literal("")),
  notes: z.string().max(2000).nullish(),
  status: z.enum(["draft", "published", "superseded"]).default("draft"),
});

export const adminUpsertDatapoint = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => datapointInput.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: row, error } = await supabaseAdmin
      .from("index_datapoints")
      .upsert(clean(data) as never, { onConflict: "id" })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { datapoint: row as IndexDatapoint };
  });

export const adminDeleteDatapoint = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await supabaseAdmin.from("index_datapoints").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const editionInput = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(120),
  period_label: z.string().min(1).max(80),
  period_start: z.string().nullish().or(z.literal("")),
  period_end: z.string().nullish().or(z.literal("")),
  headline_score: z.number().nullish(),
  previous_score: z.number().nullish(),
  summary: z.string().max(4000).nullish(),
  methodology_version: z.string().max(20).default("1.0"),
  confidence_level: confidence.default("medium"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

export const adminUpsertEdition = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => editionInput.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const payload = clean({
      ...data,
      published_at: data.status === "published" ? new Date().toISOString() : null,
    });
    const { data: row, error } = await supabaseAdmin
      .from("index_editions")
      .upsert(payload as never, { onConflict: "id" })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { edition: row as IndexEdition };
  });

const revisionInput = z.object({
  entity_type: z.enum(["indicator", "datapoint", "edition", "methodology"]),
  entity_id: z.string().uuid().nullish().or(z.literal("")),
  indicator_id: z.string().uuid().nullish().or(z.literal("")),
  edition_id: z.string().uuid().nullish().or(z.literal("")),
  change_type: z.enum([
    "created",
    "update",
    "correction",
    "restatement",
    "source_change",
    "methodology_change",
    "retired",
  ]),
  summary: z.string().min(1).max(600),
  previous_value: z.string().max(300).nullish(),
  new_value: z.string().max(300).nullish(),
  reason: z.string().max(1000).nullish(),
  methodology_version: z.string().max(20).nullish(),
  is_public: z.boolean().default(true),
});

export const adminAddRevision = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => revisionInput.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: row, error } = await supabaseAdmin
      .from("index_revisions")
      .insert(clean({ ...data, revised_by: context.userId }) as never)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { revision: row as IndexRevision };
  });
