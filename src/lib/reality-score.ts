import type { DcProject } from "@/lib/dc-projects.functions";

export const REALITY_SCORE_BANDS = [
  "Building",
  "Likely",
  "Possible",
  "Speculative",
  "Headline only",
] as const;

export type RealityScoreBand = (typeof REALITY_SCORE_BANDS)[number];

export function hasPublishedRealityScore(project: DcProject): boolean {
  return project.rs_published === true && project.reality_score !== null && project.rs_band !== null;
}

export function realityBandClass(band: string | null): string {
  if (band === "Building") return "border-success/40 bg-success/10 text-success";
  if (band === "Likely") return "border-brand/40 bg-brand/10 text-brand";
  if (band === "Possible") return "border-warning/50 bg-warning/10 text-warning-foreground";
  if (band === "Speculative") return "border-destructive/30 bg-destructive/10 text-destructive";
  return "border-border bg-muted text-muted-foreground";
}