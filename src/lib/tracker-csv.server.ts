// Builds the public tracker CSV: published rows only, public columns only.
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { DC_PROJECT_PUBLIC_COLUMNS } from "@/lib/dc-public-columns";

function cell(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = typeof v === "object" ? JSON.stringify(v) : String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function buildTrackerCsv(): Promise<string> {
  const columns = DC_PROJECT_PUBLIC_COLUMNS.split(",").map((c) => c.trim());
  const { data, error } = await supabaseAdmin
    .from("dc_projects")
    .select(DC_PROJECT_PUBLIC_COLUMNS)
    .eq("status_publication", "published")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw new Error(`Tracker export failed: ${error.message}`);
  const rows = (data ?? []) as unknown as Record<string, unknown>[];
  const lines = [columns.join(",")];
  for (const r of rows) lines.push(columns.map((c) => cell(r[c])).join(","));
  return lines.join("\r\n");
}
