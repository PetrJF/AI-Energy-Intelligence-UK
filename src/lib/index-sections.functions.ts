// UK AI Energy Index — sub-indices, regional figures, grid-pressure ratings
// and the source register.
//
// Public reads return published records only. Admin functions require the
// admin role. No data is fabricated anywhere in this module: absent values
// are returned as null and rendered as "Data not yet available".

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { GRID_EVIDENCE_PUBLIC_COLUMNS } from "@/lib/dc-public-columns";

export type SubIndex = {
  id: string;
  slug: string;
  name: string;
  intro: string | null;
  status_label: string;
  score: number | null;
  direction: "rising" | "stable" | "falling" | "unknown";
  period_label: string | null;
  last_reviewed_at: string | null;
  display_order: number;
  status: "draft" | "published";
};

export type RegionStat = {
  id: string;
  region_slug: string;
  operational_count: number | null;
  under_construction_count: number | null;
  approved_count: number | null;
  proposed_count: number | null;
  operational_mw: number | null;
  development_mw: number | null;
  hyperscale_count: number | null;
  latest_decision: string | null;
  latest_decision_date: string | null;
  data_completeness: "complete" | "partial" | "minimal" | "none";
  notes: string | null;
  last_reviewed_at: string | null;
  status: "draft" | "published";
};

export type GridRating = {
  id: string;
  region_slug: string;
  rating: "low" | "moderate" | "high" | "severe" | "insufficient_evidence";
  rationale: string;
  connection_demand_evidence: string | null;
  known_delays: string | null;
  network_constraints: string | null;
  planned_investment: string | null;
  flexible_connections: string | null;
  evidence_confidence: "high" | "medium" | "low" | "indicative";
  source_title: string | null;
  source_url: string | null;
  last_reviewed_at: string | null;
  assessment_date: string | null;
  next_review_at: string | null;
  assessed_by: string | null;
  methodology_version: string;
  limitations: string | null;
  status: "draft" | "published";
};

export type IndexSource = {
  id: string;
  organisation: string;
  title: string;
  url: string | null;
  publication_date: string | null;
  source_type: string;
  indicators_supported: string | null;
  accessed_at: string | null;
  notes: string | null;
  reporting_period: string | null;
  geographic_coverage: string;
  source_class: "primary" | "secondary";
  reliability_status: string;
  last_reviewed_at: string | null;
  status: "draft" | "published";
};

export type GridEvidence = {
  id: string;
  title: string;
  region_slug: string;
  local_area: string | null;
  network_level: string;
  network_operator: string | null;
  constraint_type: string;
  description: string;
  connection_delay_mentioned: string | null;
  reinforcement_required: string | null;
  investment_announced: string | null;
  flexible_connection_available: string | null;
  relevant_period: string | null;
  relevant_date: string | null;
  source_id: string | null;
  /** Page, section or table the finding comes from. */
  source_section: string | null;
  /** observation | estimate | forecast | planned_project | not_established */
  evidence_nature: string;
  /** What this record does not show. */
  limitations: string | null;
  confidence_level: string;
  last_reviewed_at: string | null;
  /** Internal review note. Never included in public reads. */
  admin_notes?: string | null;
  status: "draft" | "published";
};

export type AssessmentEvidenceLink = {
  id: string;
  assessment_id: string;
  evidence_id: string;
};

export type IndexProject = {
  id: string;
  slug: string;
  name: string;
  record_ref: string | null;
  campus_name: string | null;
  operator: string | null;
  developer: string | null;
  town: string | null;
  address_line: string | null;
  postcode: string | null;
  local_authority: string | null;
  nation: string | null;
  region: string;
  index_region_slug: string | null;
  status: string;
  facility_type: string;
  planning_authority: string | null;
  planning_reference: string | null;
  planning_decision: string | null;
  decision_date: string | null;
  construction_start_date: string | null;
  expected_operational_date: string | null;
  actual_operational_date: string | null;
  it_capacity_mw: number | null;
  stated_electricity_demand_mw: number | null;
  grid_connection_mw: number | null;
  campus_capacity_mw: number | null;
  capacity_mw: number | null;
  capacity_unit: string;
  capacity_definition: string;
  confidence_level: string;
  last_verified_at: string | null;
  verified: boolean;
  status_publication: string;
};

export type ChangeLogEntry = {
  id: string;
  entity_type: string;
  entity_id: string | null;
  field_name: string | null;
  previous_value: string | null;
  new_value: string | null;
  reason: string;
  changed_by_label: string | null;
  methodology_version: string | null;
  created_at: string;
};

export type CorrectionSubmission = {
  id: string;
  page_or_record: string;
  description: string;
  suggested_correction: string | null;
  source_url: string | null;
  submitter_name: string | null;
  submitter_email: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
};

export type SectionIndicator = {
  id: string;
  slug: string;
  name: string;
  short_name: string | null;
  category: string;
  description: string | null;
  unit: string;
  subindex_id: string | null;
  data_classification: string;
  is_forecast: boolean;
  forecast_year: number | null;
  source_name: string | null;
  source_url: string | null;
  update_frequency: string;
  last_updated_at: string | null;
  next_review_at: string | null;
  methodology: string | null;
  caveats: string | null;
  display_order: number;
  status: string;
};

export type SectionDatapoint = {
  id: string;
  indicator_id: string;
  period_label: string;
  period_start: string | null;
  period_end: string | null;
  value: number | null;
  value_text: string | null;
  unit: string | null;
  previous_value: number | null;
  percent_change: number | null;
  data_classification: string;
  publication_date: string | null;
  reviewed_at: string | null;
  source_name: string | null;
  source_url: string | null;
  notes: string | null;
  geographic_coverage: string;
  source_id: string | null;
  calculation_method: string | null;
  calculation_inputs: Record<string, string | number | null>[];
  assumptions: string | null;
  limitations: string | null;
  confidence_level_rating: string;
  status: string;
  superseded_by: string | null;
  superseded_reason: string | null;
  change_absolute: number | null;
  change_from_baseline_percent: number | null;
};

const INDICATOR_COLS =
  "id, slug, name, short_name, category, description, unit, subindex_id, data_classification, is_forecast, forecast_year, source_name, source_url, update_frequency, last_updated_at, next_review_at, methodology, caveats, display_order, status";

const DATAPOINT_COLS =
  "id, indicator_id, period_label, period_start, period_end, value, value_text, unit, previous_value, percent_change, data_classification, publication_date, reviewed_at, source_name, source_url, notes, geographic_coverage, source_id, calculation_method, calculation_inputs, assumptions, limitations, confidence_level_rating, status, superseded_by, superseded_reason, change_absolute, change_from_baseline_percent";

const PROJECT_COLS =
  "id, slug, name, record_ref, campus_name, operator, developer, town, address_line, postcode, local_authority, nation, region, index_region_slug, status, facility_type, planning_authority, planning_reference, planning_decision, decision_date, construction_start_date, expected_operational_date, actual_operational_date, it_capacity_mw, stated_electricity_demand_mw, grid_connection_mw, campus_capacity_mw, capacity_mw, capacity_unit, capacity_definition, confidence_level, last_verified_at, verified, status_publication";

export type IndexSectionsData = {
  subindices: SubIndex[];
  indicators: SectionIndicator[];
  datapoints: SectionDatapoint[];
  /** Readings replaced by a newer figure. Kept so the published record is never deleted. */
  supersededDatapoints: SectionDatapoint[];
  regionStats: RegionStat[];
  gridRatings: GridRating[];
  sources: IndexSource[];
  gridEvidence: GridEvidence[];
  assessmentEvidence: AssessmentEvidenceLink[];
  projects: IndexProject[];
  changeLog: ChangeLogEntry[];
};

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error("Role check failed");
  if (!data) throw new Error("Forbidden");
}

// ---------- Public ----------

export const getIndexSections = createServerFn({ method: "GET" }).handler(
  async (): Promise<IndexSectionsData> => {
    const [
      subindices,
      indicators,
      datapoints,
      regionStats,
      gridRatings,
      sources,
      gridEvidence,
      assessmentEvidence,
      projects,
      changeLog,
    ] = await Promise.all([
        supabaseAdmin
          .from("index_subindices")
          .select("*")
          .eq("status", "published")
          .order("display_order", { ascending: true }),
        supabaseAdmin
          .from("index_indicators")
          .select(INDICATOR_COLS)
          .eq("status", "published")
          .order("display_order", { ascending: true }),
        supabaseAdmin
          .from("index_datapoints")
          .select(DATAPOINT_COLS)
          .in("status", ["published", "superseded"])
          .order("period_start", { ascending: false })
          .limit(1000),
        supabaseAdmin
          .from("dc_region_stats")
          .select("*")
          .eq("status", "published")
          .order("last_reviewed_at", { ascending: false }),
        supabaseAdmin
          .from("grid_pressure_ratings")
          .select("*")
          .eq("status", "published")
          .order("last_reviewed_at", { ascending: false }),
        supabaseAdmin
          .from("index_sources")
          .select("*")
          .eq("status", "published")
          .order("publication_date", { ascending: false }),
        supabaseAdmin
          .from("grid_evidence")
          .select(GRID_EVIDENCE_PUBLIC_COLUMNS)
          .eq("status", "published")
          .order("relevant_date", { ascending: false }),
        supabaseAdmin.from("grid_assessment_evidence").select("id, assessment_id, evidence_id"),
        supabaseAdmin
          .from("dc_projects")
          .select(PROJECT_COLS)
          .eq("status_publication", "published")
          .order("name"),
        supabaseAdmin
          .from("index_change_log")
          .select("*")
          .eq("is_public", true)
          .order("created_at", { ascending: false })
          .limit(100),
      ]);

    const allPoints = (datapoints.data ?? []) as SectionDatapoint[];
    return {
      subindices: (subindices.data ?? []) as SubIndex[],
      indicators: (indicators.data ?? []) as SectionIndicator[],
      datapoints: allPoints.filter((d) => d.status === "published"),
      supersededDatapoints: allPoints.filter((d) => d.status === "superseded"),
      regionStats: (regionStats.data ?? []) as RegionStat[],
      gridRatings: (gridRatings.data ?? []) as GridRating[],
      sources: (sources.data ?? []) as IndexSource[],
      gridEvidence: (gridEvidence.data ?? []) as GridEvidence[],
      assessmentEvidence: (assessmentEvidence.data ?? []) as AssessmentEvidenceLink[],
      projects: (projects.data ?? []) as unknown as IndexProject[],
      changeLog: (changeLog.data ?? []) as ChangeLogEntry[],
    };
  },
);

// ---------- Admin ----------

export const adminGetIndexSections = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<IndexSectionsData> => {
    await assertAdmin(context);
    const [
      subindices,
      indicators,
      datapoints,
      regionStats,
      gridRatings,
      sources,
      gridEvidence,
      assessmentEvidence,
      projects,
      changeLog,
    ] = await Promise.all([
        supabaseAdmin.from("index_subindices").select("*").order("display_order"),
        supabaseAdmin.from("index_indicators").select(INDICATOR_COLS).order("display_order"),
        supabaseAdmin
          .from("index_datapoints")
          .select(DATAPOINT_COLS)
          .order("period_start", { ascending: false })
          .limit(1000),
        supabaseAdmin.from("dc_region_stats").select("*").order("region_slug"),
        supabaseAdmin.from("grid_pressure_ratings").select("*").order("region_slug"),
        supabaseAdmin.from("index_sources").select("*").order("organisation"),
        supabaseAdmin.from("grid_evidence").select("*").order("region_slug"),
        supabaseAdmin.from("grid_assessment_evidence").select("id, assessment_id, evidence_id"),
        supabaseAdmin.from("dc_projects").select(PROJECT_COLS).order("name"),
        supabaseAdmin
          .from("index_change_log")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(200),
      ]);
    return {
      subindices: (subindices.data ?? []) as SubIndex[],
      indicators: (indicators.data ?? []) as SectionIndicator[],
      datapoints: (datapoints.data ?? []) as SectionDatapoint[],
      supersededDatapoints: [],
      regionStats: (regionStats.data ?? []) as RegionStat[],
      gridRatings: (gridRatings.data ?? []) as GridRating[],
      sources: (sources.data ?? []) as IndexSource[],
      gridEvidence: (gridEvidence.data ?? []) as GridEvidence[],
      assessmentEvidence: (assessmentEvidence.data ?? []) as AssessmentEvidenceLink[],
      projects: (projects.data ?? []) as unknown as IndexProject[],
      changeLog: (changeLog.data ?? []) as ChangeLogEntry[],
    };
  });

const nullable = (max: number) => z.string().max(max).nullish().or(z.literal(""));

function clean<T extends Record<string, unknown>>(row: T) {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) out[k] = v === "" ? null : v;
  return out;
}

const subindexInput = z.object({
  id: z.string().uuid().optional(),
  slug: z.enum(["electricity-demand", "data-centre-growth", "grid-pressure"]),
  name: z.string().min(1).max(120),
  intro: nullable(2000),
  status_label: z.string().min(1).max(80).default("Baseline in development"),
  score: z.number().nullish(),
  direction: z.enum(["rising", "stable", "falling", "unknown"]).default("unknown"),
  period_label: nullable(80),
  last_reviewed_at: nullable(20),
  display_order: z.number().int().min(0).max(99).default(0),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const adminUpsertSubindex = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => subindexInput.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: row, error } = await supabaseAdmin
      .from("index_subindices")
      .upsert(clean(data) as never, { onConflict: "id" })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { subindex: row as SubIndex };
  });

const regionStatInput = z.object({
  id: z.string().uuid().optional(),
  region_slug: z.string().min(1).max(60),
  operational_count: z.number().int().nullish(),
  under_construction_count: z.number().int().nullish(),
  approved_count: z.number().int().nullish(),
  proposed_count: z.number().int().nullish(),
  operational_mw: z.number().nullish(),
  development_mw: z.number().nullish(),
  hyperscale_count: z.number().int().nullish(),
  latest_decision: nullable(400),
  latest_decision_date: nullable(20),
  data_completeness: z.enum(["complete", "partial", "minimal", "none"]).default("none"),
  notes: nullable(2000),
  last_reviewed_at: nullable(20),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const adminUpsertRegionStat = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => regionStatInput.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: row, error } = await supabaseAdmin
      .from("dc_region_stats")
      .upsert(clean(data) as never, { onConflict: "id" })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { regionStat: row as RegionStat };
  });

const gridRatingInput = z.object({
  id: z.string().uuid().optional(),
  region_slug: z.string().min(1).max(60),
  rating: z
    .enum(["low", "moderate", "high", "severe", "insufficient_evidence"])
    .default("insufficient_evidence"),
  // A rating is only accepted with a written explanation behind it.
  rationale: z.string().min(20).max(2000),
  connection_demand_evidence: nullable(2000),
  known_delays: nullable(2000),
  network_constraints: nullable(2000),
  planned_investment: nullable(2000),
  flexible_connections: nullable(2000),
  evidence_confidence: z.enum(["high", "medium", "low", "indicative"]).default("low"),
  source_title: nullable(300),
  source_url: nullable(500),
  last_reviewed_at: nullable(20),
  assessment_date: nullable(20),
  next_review_at: nullable(20),
  assessed_by: nullable(120),
  methodology_version: z.string().min(1).max(20).default("v1.0"),
  limitations: nullable(2000),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const adminUpsertGridRating = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => gridRatingInput.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    // A published rating other than "insufficient evidence" must cite a source.
    if (data.status === "published" && data.rating !== "insufficient_evidence" && !data.source_url) {
      throw new Error("A published pressure rating must have a supporting source URL.");
    }
    const { data: row, error } = await supabaseAdmin
      .from("grid_pressure_ratings")
      .upsert(clean(data) as never, { onConflict: "id" })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { gridRating: row as GridRating };
  });

const sourceInput = z.object({
  id: z.string().uuid().optional(),
  organisation: z.string().min(1).max(200),
  title: z.string().min(1).max(300),
  url: nullable(500),
  publication_date: nullable(20),
  source_type: z.string().min(1).max(60).default("government_publication"),
  indicators_supported: nullable(500),
  accessed_at: nullable(20),
  notes: nullable(1000),
  reporting_period: nullable(120),
  geographic_coverage: z
    .enum([
      "united_kingdom",
      "great_britain",
      "england",
      "scotland",
      "wales",
      "northern_ireland",
      "uk_region",
      "local_authority",
      "individual_facility",
      "other",
    ])
    .default("united_kingdom"),
  source_class: z.enum(["primary", "secondary"]).default("primary"),
  reliability_status: z
    .enum([
      "primary_verified",
      "reliable_secondary",
      "supporting_only",
      "unverified",
      "superseded",
    ])
    .default("unverified"),
  last_reviewed_at: nullable(20),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const adminUpsertSource = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => sourceInput.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: row, error } = await supabaseAdmin
      .from("index_sources")
      .upsert(clean(data) as never, { onConflict: "id" })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { source: row as IndexSource };
  });

// Unpublishing is preferred over deletion so the previous record survives.
export const adminSetRecordStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        table: z.enum([
          "index_subindices",
          "dc_region_stats",
          "grid_pressure_ratings",
          "index_sources",
          "grid_evidence",
        ]),
        id: z.string().uuid(),
        status: z.enum(["draft", "published"]),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await supabaseAdmin
      .from(data.table)
      .update({ status: data.status } as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Grid evidence register ----------

const gridEvidenceInput = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(3).max(300),
  region_slug: z.string().min(1).max(60),
  local_area: nullable(160),
  network_level: z.enum(["transmission", "distribution", "both", "not_established"]).default("not_established"),
  network_operator: nullable(160),
  constraint_type: z
    .enum([
      "connection_queue",
      "substation_capacity",
      "transmission_capacity",
      "distribution_capacity",
      "reinforcement_requirement",
      "connection_delay",
      "flexible_connection",
      "local_congestion",
      "constraint_not_established",
    ])
    .default("constraint_not_established"),
  description: z.string().min(20).max(4000),
  connection_delay_mentioned: nullable(1000),
  reinforcement_required: nullable(1000),
  investment_announced: nullable(1000),
  flexible_connection_available: nullable(1000),
  relevant_period: nullable(120),
  relevant_date: nullable(20),
  source_id: z.string().uuid().nullish().or(z.literal("")),
  confidence_level: z.enum(["high", "medium", "low", "not_assessed"]).default("not_assessed"),
  last_reviewed_at: nullable(20),
  admin_notes: nullable(2000),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const adminUpsertGridEvidence = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => gridEvidenceInput.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    // Evidence may only be published once it is attributed to a source record.
    if (data.status === "published" && !data.source_id) {
      throw new Error("Evidence cannot be published without a linked source record.");
    }
    const { data: row, error } = await supabaseAdmin
      .from("grid_evidence")
      .upsert(clean(data) as never, { onConflict: "id" })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { evidence: row as GridEvidence };
  });

export const adminLinkAssessmentEvidence = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        assessment_id: z.string().uuid(),
        evidence_id: z.string().uuid(),
        action: z.enum(["link", "unlink"]).default("link"),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    if (data.action === "unlink") {
      const { error } = await supabaseAdmin
        .from("grid_assessment_evidence")
        .delete()
        .eq("assessment_id", data.assessment_id)
        .eq("evidence_id", data.evidence_id);
      if (error) throw new Error(error.message);
      return { ok: true };
    }
    const { error } = await supabaseAdmin
      .from("grid_assessment_evidence")
      .insert({ assessment_id: data.assessment_id, evidence_id: data.evidence_id } as never);
    if (error && !error.message.includes("duplicate")) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Electricity-demand data entries ----------

const datapointInput = z.object({
  id: z.string().uuid().optional(),
  indicator_id: z.string().uuid(),
  period_label: z.string().min(1).max(120),
  period_start: nullable(20),
  period_end: nullable(20),
  value: z.number().nullish(),
  value_text: nullable(200),
  unit: nullable(60),
  previous_value: z.number().nullish(),
  percent_change: z.number().nullish(),
  geographic_coverage: z.string().min(1).max(40).default("united_kingdom"),
  data_classification: z
    .enum([
      "official",
      "calculated",
      "industry_estimate",
      "aie_estimate",
      "forecast",
      "not_disclosed",
      "insufficient_evidence",
      "not_available",
    ])
    .default("not_available"),
  source_id: z.string().uuid().nullish().or(z.literal("")),
  source_name: nullable(300),
  source_url: nullable(500),
  calculation_method: nullable(4000),
  calculation_inputs: z
    .array(z.record(z.string(), z.union([z.string(), z.number(), z.null()])))
    .default([]),
  assumptions: nullable(4000),
  limitations: nullable(4000),
  confidence_level_rating: z.enum(["high", "medium", "low", "not_assessed"]).default("not_assessed"),
  publication_date: nullable(20),
  reviewed_at: nullable(20),
  notes: nullable(2000),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const adminUpsertDatapoint = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => datapointInput.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    // Calculated and in-house estimated figures must carry their workings.
    if (
      data.status === "published" &&
      ["calculated", "aie_estimate"].includes(data.data_classification) &&
      (!data.calculation_method || (!data.source_id && !data.source_url))
    ) {
      throw new Error(
        "A calculated or in-house estimated figure cannot be published without a calculation method and a source.",
      );
    }
    const { data: row, error } = await supabaseAdmin
      .from("index_datapoints")
      .upsert(clean(data) as never, { onConflict: "id" })
      .select(DATAPOINT_COLS)
      .single();
    if (error) throw new Error(error.message);
    return { datapoint: row as unknown as SectionDatapoint };
  });

// ---------- Project register ----------

const projectIndexInput = z.object({
  id: z.string().uuid(),
  record_ref: nullable(60),
  campus_name: nullable(200),
  developer: nullable(200),
  address_line: nullable(300),
  postcode: nullable(20),
  local_authority: nullable(160),
  nation: z.enum(["england", "scotland", "wales", "northern_ireland"]).nullish().or(z.literal("")),
  index_region_slug: nullable(60),
  facility_type: z
    .enum([
      "hyperscale",
      "colocation",
      "enterprise",
      "ai_hpc",
      "government_research",
      "edge",
      "type_unconfirmed",
    ])
    .default("type_unconfirmed"),
  construction_start_date: nullable(20),
  actual_operational_date: nullable(20),
  it_capacity_mw: z.number().nullish(),
  stated_electricity_demand_mw: z.number().nullish(),
  grid_connection_mw: z.number().nullish(),
  campus_capacity_mw: z.number().nullish(),
  capacity_unit: z.string().min(1).max(20).default("MW"),
  capacity_definition: z
    .enum(["it_load", "total_facility_load", "grid_connection", "campus_capacity", "unclear", "not_disclosed"])
    .default("not_disclosed"),
  primary_source_id: z.string().uuid().nullish().or(z.literal("")),
  last_verified_at: nullable(20),
  admin_notes: nullable(4000),
  duplicate_reviewed: z.boolean().default(false),
});

export const adminUpdateProjectIndexFields = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => projectIndexInput.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { id, ...rest } = data;
    const { error } = await supabaseAdmin
      .from("dc_projects")
      .update(clean(rest) as never)
      .eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export type DuplicateWarning = {
  reason: string;
  a: { id: string; name: string };
  b: { id: string; name: string };
};

// Flags likely duplicates for administrator review. Nothing is merged or
// deleted automatically.
export const adminFindDuplicateProjects = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ warnings: DuplicateWarning[] }> => {
    await assertAdmin(context);
    const { data, error } = await supabaseAdmin
      .from("dc_projects")
      .select(
        "id, name, operator, postcode, address_line, planning_authority, planning_reference, latitude, longitude, town, duplicate_reviewed",
      );
    if (error) throw new Error(error.message);
    const rows = (data ?? []) as Array<Record<string, unknown>>;
    const norm = (v: unknown) =>
      typeof v === "string" ? v.toLowerCase().replace(/[^a-z0-9]/g, "") : "";
    const warnings: DuplicateWarning[] = [];
    for (let i = 0; i < rows.length; i++) {
      for (let j = i + 1; j < rows.length; j++) {
        const a = rows[i]!;
        const b = rows[j]!;
        if (a["duplicate_reviewed"] === true && b["duplicate_reviewed"] === true) continue;
        const reasons: string[] = [];
        if (norm(a["name"]) && norm(a["name"]) === norm(b["name"])) reasons.push("Same facility name");
        if (norm(a["postcode"]) && norm(a["postcode"]) === norm(b["postcode"]))
          reasons.push("Same postcode");
        if (norm(a["address_line"]) && norm(a["address_line"]) === norm(b["address_line"]))
          reasons.push("Same address");
        if (
          norm(a["planning_reference"]) &&
          norm(a["planning_reference"]) === norm(b["planning_reference"])
        )
          reasons.push("Same planning reference");
        if (
          norm(a["operator"]) &&
          norm(a["operator"]) === norm(b["operator"]) &&
          norm(a["town"]) &&
          norm(a["town"]) === norm(b["town"])
        )
          reasons.push("Same operator and location");
        if (
          a["latitude"] != null &&
          a["longitude"] != null &&
          a["latitude"] === b["latitude"] &&
          a["longitude"] === b["longitude"]
        )
          reasons.push("Same coordinates");
        if (reasons.length) {
          warnings.push({
            reason: reasons.join("; "),
            a: { id: a["id"] as string, name: a["name"] as string },
            b: { id: b["id"] as string, name: b["name"] as string },
          });
        }
      }
    }
    return { warnings };
  });

// ---------- Change history ----------

export const adminLogChange = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        entity_type: z.string().min(1).max(60),
        entity_id: z.string().uuid().nullish().or(z.literal("")),
        field_name: nullable(120),
        previous_value: nullable(1000),
        new_value: nullable(1000),
        reason: z.string().min(5).max(2000),
        source_id: z.string().uuid().nullish().or(z.literal("")),
        changed_by_label: nullable(160),
        methodology_version: nullable(20),
        is_public: z.boolean().default(true),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await supabaseAdmin
      .from("index_change_log")
      .insert({ ...clean(data), changed_by: context.userId } as never);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Corrections queue ----------

export const adminListCorrections = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ corrections: CorrectionSubmission[] }> => {
    await assertAdmin(context);
    const { data, error } = await supabaseAdmin
      .from("correction_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return { corrections: (data ?? []) as CorrectionSubmission[] };
  });

export const adminUpdateCorrection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["pending", "under_review", "accepted", "rejected"]),
        admin_notes: nullable(2000),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await supabaseAdmin
      .from("correction_submissions")
      .update({
        status: data.status,
        admin_notes: data.admin_notes || null,
        reviewed_at: new Date().toISOString(),
        reviewed_by: context.userId,
      } as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
