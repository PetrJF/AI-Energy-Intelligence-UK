// AI Growth Zones — server functions.
// Growth zones are tracker entries with project_type = 'growth_zone', plus a
// milestone timeline stored in dc_zone_milestones. Reads are public and only
// return published zones.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { DcProject } from "@/lib/dc-projects.functions";
import { DC_PROJECT_PUBLIC_COLUMNS } from "@/lib/dc-public-columns";

export type ZoneMilestone = {
  id: string;
  project_id: string;
  milestone_date: string | null;
  title: string;
  stage: string;
  notes: string | null;
  source_title: string | null;
  source_url: string | null;
  display_order: number;
};

export type GrowthZone = DcProject & { milestones: ZoneMilestone[] };

function normalise(row: Record<string, unknown>): DcProject {
  return {
    ...(row as unknown as DcProject),
    key_facts: Array.isArray(row["key_facts"]) ? (row["key_facts"] as DcProject["key_facts"]) : [],
    sources: Array.isArray(row["sources"]) ? (row["sources"] as DcProject["sources"]) : [],
  };
}

async function db() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const listGrowthZones = createServerFn({ method: "GET" }).handler(async () => {
  const sb = await db();
  const { data, error } = await sb
    .from("dc_projects")
    .select(DC_PROJECT_PUBLIC_COLUMNS)
    .eq("project_type", "growth_zone")
    .eq("status_publication", "published")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true })
    .limit(200);
  if (error) throw new Error(error.message);
  const zones = (data ?? []).map((r) => normalise(r as Record<string, unknown>));

  const { data: ms, error: msError } = await sb
    .from("dc_zone_milestones")
    .select("*")
    .in(
      "project_id",
      zones.map((z) => z.id),
    )
    .order("display_order", { ascending: true });
  if (msError) throw new Error(msError.message);

  const byProject = new Map<string, ZoneMilestone[]>();
  for (const m of (ms ?? []) as unknown as ZoneMilestone[]) {
    const list = byProject.get(m.project_id) ?? [];
    list.push(m);
    byProject.set(m.project_id, list);
  }
  return zones.map((z) => ({ ...z, milestones: byProject.get(z.id) ?? [] })) as GrowthZone[];
});

export const getGrowthZone = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const sb = await db();
    const { data: row, error } = await sb
      .from("dc_projects")
      .select(DC_PROJECT_PUBLIC_COLUMNS)
      .eq("slug", data.slug)
      .eq("project_type", "growth_zone")
      .eq("status_publication", "published")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return null;
    const zone = normalise(row as Record<string, unknown>);

    const { data: ms, error: msError } = await sb
      .from("dc_zone_milestones")
      .select("*")
      .eq("project_id", zone.id)
      .order("display_order", { ascending: true });
    if (msError) throw new Error(msError.message);

    return { ...zone, milestones: (ms ?? []) as unknown as ZoneMilestone[] } as GrowthZone;
  });
