// UK data-centre tracker — server functions.
// Public reads return published, verified-or-not projects (publication status
// controls visibility). Admin writes require the admin role.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { DC_PROJECT_PUBLIC_COLUMNS } from "@/lib/dc-public-columns";

export type DcSource = {
  title: string;
  url: string;
  publisher?: string;
  date?: string;
  /** Whether the source is a primary record (planning portal, permit, official publication). */
  sourceClass?: "primary" | "secondary";
  /** Publisher-facing source type label, where recorded in the source register. */
  sourceType?: string;
  /** Date the source was last accessed/checked. */
  accessedAt?: string;
};
export type DcKeyFact = { label: string; value: string };

export type DcProject = {
  id: string;
  slug: string;
  name: string;
  operator: string | null;
  town: string | null;
  region: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  status: string;
  project_type: string;
  ai_relevance: string;
  announced_date: string | null;
  target_live_date: string | null;
  capacity_mw: number | null;
  floor_area_sqm: number | null;
  investment_gbp: number | null;
  power_notes: string | null;
  cooling_notes: string | null;
  water_notes: string | null;
  grid_connection_notes: string | null;
  planning_reference: string | null;
  planning_authority: string | null;
  summary: string | null;
  key_facts: DcKeyFact[];
  sources: DcSource[];
  confidence_level: string;
  // Typed capacity fields. These are never added together.
  it_capacity_mw: number | null;
  grid_connection_mw: number | null;
  stated_electricity_demand_mw: number | null;
  campus_capacity_mw: number | null;
  capacity_definition: string;
  capacity_unit: string;
  facility_type: string;
  campus_name: string | null;
  developer: string | null;
  local_authority: string | null;
  nation: string | null;
  index_region_slug: string | null;
  planning_decision: string | null;
  decision_date: string | null;
  construction_start_date: string | null;
  expected_operational_date: string | null;
  actual_operational_date: string | null;
  last_verified_at: string | null;
  /** All displayable sources: the stored JSON list plus the linked source register record. */
  all_sources: DcSource[];
  /** Count of primary-record sources among all_sources. */
  primary_source_count: number;
  /** True only when the record is flagged verified AND at least one source is displayable. */
  evidence_backed_verified: boolean;
  verified: boolean;
  verified_at: string | null;
  status_publication: string;
  display_order: number;
  created_at: string;
  updated_at: string;
  rs_planning: number | null;
  rs_grid: number | null;
  rs_land_funding: number | null;
  rs_team: number | null;
  rs_momentum: number | null;
  reality_score: number | null;
  rs_band: string | null;
  rs_scored_at: string | null;
  rs_published: boolean;
};

const SELECT = "*";

type SourceRegisterRow = {
  id: string;
  organisation: string | null;
  title: string;
  url: string | null;
  publication_date: string | null;
  source_type: string | null;
  source_class: string | null;
  last_reviewed_at: string | null;
  accessed_at: string | null;
};

function registerToSource(r: SourceRegisterRow): DcSource | null {
  if (!r.url) return null;
  return {
    title: r.title,
    url: r.url,
    publisher: r.organisation ?? undefined,
    date: r.publication_date ?? undefined,
    sourceClass: r.source_class === "primary" ? "primary" : "secondary",
    sourceType: r.source_type ?? undefined,
    accessedAt: r.accessed_at ?? undefined,
  };
}

function normalise(
  row: Record<string, unknown>,
  registry: Map<string, SourceRegisterRow>,
): DcProject {
  const stored = Array.isArray(row["sources"]) ? (row["sources"] as DcSource[]) : [];
  const linkedId = (row["primary_source_id"] as string | null) ?? null;
  const linkedRow = linkedId ? registry.get(linkedId) : undefined;
  const linked = linkedRow ? registerToSource(linkedRow) : null;

  // Merge the stored JSON sources with the linked source-register record,
  // de-duplicating on URL so a record is never shown twice.
  const seen = new Set<string>();
  const all: DcSource[] = [];
  for (const s of [...(linked ? [linked] : []), ...stored]) {
    if (!s?.url || seen.has(s.url)) continue;
    seen.add(s.url);
    all.push(s);
  }
  const primaryCount = all.filter((s) => s.sourceClass === "primary").length;
  const verified = Boolean(row["verified"]);

  return {
    ...(row as unknown as DcProject),
    key_facts: Array.isArray(row["key_facts"]) ? (row["key_facts"] as DcKeyFact[]) : [],
    sources: stored,
    all_sources: all,
    primary_source_count: primaryCount,
    evidence_backed_verified: verified && all.length > 0,
  };
}

/** Loads the source-register rows referenced by the given projects. */
async function loadRegistry(
  db: { from: (t: string) => any },
  rows: Record<string, unknown>[],
): Promise<Map<string, SourceRegisterRow>> {
  const ids = Array.from(
    new Set(rows.map((r) => r["primary_source_id"]).filter((v): v is string => typeof v === "string")),
  );
  const map = new Map<string, SourceRegisterRow>();
  if (ids.length === 0) return map;
  const { data } = await db
    .from("index_sources")
    .select("id,organisation,title,url,publication_date,source_type,source_class,last_reviewed_at,accessed_at")
    .in("id", ids);
  for (const r of (data ?? []) as SourceRegisterRow[]) map.set(r.id, r);
  return map;
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const listDcProjects = createServerFn({ method: "GET" }).handler(async () => {
  const db = await admin();
  const { data, error } = await db
    .from("dc_projects")
    .select(DC_PROJECT_PUBLIC_COLUMNS)
    .eq("status_publication", "published")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true })
    .limit(500);
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as Record<string, unknown>[];
  const registry = await loadRegistry(db, rows);
  return rows.map((r) => normalise(r, registry));
});

/**
 * Activity signal (job post, tender, permit, supplier registration) linked to a project.
 * Signals indicate activity such as staffing; they do not prove planning, funding, grid
 * connection, construction or capacity, and they never feed the Reality Score.
 * Only published signals are returned, and admin_notes is never exposed.
 */
export type DcSignal = {
  id: string;
  signal_type: string;
  signal_role: string | null;
  organisation: string;
  title: string;
  location: string | null;
  event_date: string | null;
  listed_date: string | null;
  observed_date: string;
  source_url: string;
  source_platform: string;
  source_class: string;
  reference: string | null;
  extract: string | null;
  indicates: string | null;
  does_not_indicate: string | null;
  link_confidence: string;
};

export type DcProjectWithSignals = DcProject & { signals: DcSignal[] };

const DC_SIGNAL_PUBLIC_COLUMNS =
  "id,signal_type,signal_role,organisation,title,location,event_date,listed_date,observed_date,source_url,source_platform,source_class,reference,extract,indicates,does_not_indicate,link_confidence";

/** Loads published signals for a project. Returns [] if the signals table is not yet installed. */
async function loadSignals(db: { from: (t: string) => any }, projectId: string): Promise<DcSignal[]> {
  const { data, error } = await db
    .from("dc_project_signals")
    .select(DC_SIGNAL_PUBLIC_COLUMNS)
    .eq("project_id", projectId)
    .eq("status_publication", "published")
    .order("event_date", { ascending: false, nullsFirst: false })
    .limit(50);
  if (error) {
    console.warn("dc_project_signals unavailable:", error.message);
    return [];
  }
  return (data ?? []) as DcSignal[];
}

export const getDcProject = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: row, error } = await db
      .from("dc_projects")
      .select(DC_PROJECT_PUBLIC_COLUMNS)
      .eq("slug", data.slug)
      .eq("status_publication", "published")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return null;
    const rows = [row as Record<string, unknown>];
    const registry = await loadRegistry(db, rows);
    const project = normalise(rows[0]!, registry);
    const signals = await loadSignals(db as unknown as { from: (t: string) => any }, project.id);
    return { ...project, signals } as DcProjectWithSignals;
  });

const projectInput = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1),
  name: z.string().min(1),
  operator: z.string().nullable().optional(),
  town: z.string().nullable().optional(),
  region: z.string().min(1),
  country: z.string().min(1).default("United Kingdom"),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  status: z.string().min(1),
  project_type: z.string().min(1),
  ai_relevance: z.string().min(1),
  announced_date: z.string().nullable().optional(),
  target_live_date: z.string().nullable().optional(),
  capacity_mw: z.number().nullable().optional(),
  floor_area_sqm: z.number().nullable().optional(),
  investment_gbp: z.number().nullable().optional(),
  power_notes: z.string().nullable().optional(),
  cooling_notes: z.string().nullable().optional(),
  water_notes: z.string().nullable().optional(),
  grid_connection_notes: z.string().nullable().optional(),
  planning_reference: z.string().nullable().optional(),
  planning_authority: z.string().nullable().optional(),
  summary: z.string().nullable().optional(),
  key_facts: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  sources: z
    .array(
      z.object({
        title: z.string(),
        url: z.string(),
        publisher: z.string().optional(),
        date: z.string().optional(),
      }),
    )
    .default([]),
  confidence_level: z.string().min(1),
  verified: z.boolean().default(false),
  status_publication: z.string().min(1),
  display_order: z.number().default(0),
});

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden");
}

export const adminListDcProjects = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as any);
    const db = await admin();
    const { data, error } = await db
      .from("dc_projects")
      .select(SELECT)
      .order("updated_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    const rows = (data ?? []) as Record<string, unknown>[];
    const registry = await loadRegistry(db, rows);
    return rows.map((r) => normalise(r, registry));
  });

export const adminUpsertDcProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => projectInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any);
    const db = await admin();
    const payload: Record<string, unknown> = {
      ...data,
      verified_at: data.verified ? new Date().toISOString() : null,
    };
    if (!data.id) delete payload["id"];
    const { data: row, error } = await db
      .from("dc_projects")
      .upsert(payload as never, { onConflict: "slug" })
      .select(SELECT)
      .single();
    if (error) throw new Error(error.message);
    const rows = [row as Record<string, unknown>];
    const registry = await loadRegistry(db, rows);
    return normalise(rows[0]!, registry);
  });

export const adminDeleteDcProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any);
    const db = await admin();
    const { error } = await db.from("dc_projects").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
