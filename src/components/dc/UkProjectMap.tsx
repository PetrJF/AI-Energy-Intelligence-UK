import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { MapPin, Zap } from "lucide-react";
import type { DcProject } from "@/lib/dc-projects.functions";
import {
  DC_REGION_CENTROIDS,
  DC_STATUS_LABELS,
  labelFor,
  regionSlug,
} from "@/lib/dc-projects";

// Simple equirectangular projection over a UK bounding box. This is a
// schematic locator map, not a survey-accurate basemap.
const LAT_MAX = 59.5;
const LAT_MIN = 49.8;
const LNG_MIN = -8.4;
const LNG_MAX = 2.2;

function project(lat: number, lng: number) {
  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * 100;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * 100;
  return { x: Math.max(3, Math.min(97, x)), y: Math.max(3, Math.min(97, y)) };
}

const STATUS_COLOUR: Record<string, string> = {
  operational: "#16a34a",
  under_construction: "#f59e0b",
  approved: "#2563eb",
  planning_submitted: "#7c3aed",
  proposed: "#64748b",
  expansion: "#0ea5e9",
  paused: "#a1a1aa",
  withdrawn: "#ef4444",
};

type Placed = {
  project: DcProject;
  x: number;
  y: number;
  exact: boolean;
};

export function UkProjectMap({ projects }: { projects: DcProject[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const placed = useMemo<Placed[]>(() => {
    const byRegion = new Map<string, number>();
    return projects
      .map((p) => {
        if (p.latitude !== null && p.longitude !== null) {
          const { x, y } = project(p.latitude, p.longitude);
          return { project: p, x, y, exact: true };
        }
        const c = DC_REGION_CENTROIDS[p.region];
        if (!c) return null;
        // Fan out multiple projects that share a region centroid.
        const n = byRegion.get(p.region) ?? 0;
        byRegion.set(p.region, n + 1);
        const angle = (n * 2 * Math.PI) / 6;
        const r = n === 0 ? 0 : 2.6;
        const { x, y } = project(c.lat, c.lng);
        return {
          project: p,
          x: x + Math.cos(angle) * r,
          y: y + Math.sin(angle) * r,
          exact: false,
        };
      })
      .filter(Boolean) as Placed[];
  }, [projects]);

  const selected = placed.find((m) => m.project.id === selectedId) ?? null;
  const statuses = Array.from(new Set(projects.map((p) => p.status)));

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="rounded-xl border border-border bg-card p-4 lg:col-span-3">
        <div className="relative w-full overflow-hidden rounded-lg border border-border bg-muted/40 pb-[120%]">
          <svg
            viewBox="0 0 100 120"
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label="Schematic map of UK data centre and AI infrastructure projects"
          >
            <defs>
              <pattern id="dc-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path
                  d="M10 0 L0 0 0 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.2"
                  className="text-border"
                />
              </pattern>
            </defs>
            <rect width="100" height="120" fill="url(#dc-grid)" />
            {Object.entries(DC_REGION_CENTROIDS).map(([region, c], i) => {
              const { x, y } = project(c.lat, c.lng);
              return (
                <text
                  key={region}
                  x={x}
                  y={y * 1.2 - (i % 2 === 0 ? 3.4 : 5.6)}
                  textAnchor="middle"
                  fontSize="2.4"
                  className="fill-muted-foreground"
                >
                  {region}
                </text>
              );
            })}
            {placed.map((m) => {
              const isSel = m.project.id === selectedId;
              return (
                <g
                  key={m.project.id}
                  onClick={() => setSelectedId(m.project.id)}
                  style={{ cursor: "pointer" }}
                  tabIndex={0}
                  role="button"
                  aria-label={m.project.name}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setSelectedId(m.project.id);
                  }}
                >
                  <circle
                    cx={m.x}
                    cy={m.y * 1.2}
                    r={isSel ? 3.2 : 2.2}
                    fill={STATUS_COLOUR[m.project.status] ?? "#2563eb"}
                    stroke="#fff"
                    strokeWidth={0.5}
                    opacity={m.exact ? 0.95 : 0.75}
                  />
                  {!m.exact && (
                    <circle
                      cx={m.x}
                      cy={m.y * 1.2}
                      r={isSel ? 4.6 : 3.6}
                      fill="none"
                      stroke={STATUS_COLOUR[m.project.status] ?? "#2563eb"}
                      strokeWidth={0.3}
                      strokeDasharray="1 1"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
          {statuses.map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: STATUS_COLOUR[s] ?? "#2563eb" }}
              />
              {labelFor(DC_STATUS_LABELS, s)}
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border border-dashed border-muted-foreground" />
            Regional position only
          </span>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Schematic locator map. Solid markers use coordinates recorded with the entry; dashed
          markers sit at the centre of the project's region because no site coordinates have been
          published. Nothing here should be read as a precise site boundary.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Selected project
        </h3>
        {selected ? (
          <div className="mt-3">
            <Link
              to="/uk-data-centre-tracker/$slug"
              params={{ slug: selected.project.slug }}
              className="text-lg font-semibold underline-offset-4 hover:underline"
            >
              {selected.project.name}
            </Link>
            {selected.project.operator && (
              <p className="mt-1 text-sm text-muted-foreground">{selected.project.operator}</p>
            )}
            <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {[selected.project.town, selected.project.region].filter(Boolean).join(", ")}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Zap className="h-3.5 w-3.5" aria-hidden />
              {selected.project.capacity_mw === null
                ? "Capacity not published"
                : `${selected.project.capacity_mw.toLocaleString("en-GB")} MW`}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {labelFor(DC_STATUS_LABELS, selected.project.status)}
            </p>
            {selected.project.summary && (
              <p className="mt-3 text-sm text-muted-foreground">{selected.project.summary}</p>
            )}
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Link
                to="/uk-data-centre-tracker/$slug"
                params={{ slug: selected.project.slug }}
                className="underline"
              >
                Full project profile
              </Link>
              <Link
                to="/uk-data-centre-tracker/regions/$region"
                params={{ region: regionSlug(selected.project.region) }}
                className="underline"
              >
                {selected.project.region} overview
              </Link>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Select a marker to see the project, its published capacity and a link to the full
            profile.
          </p>
        )}

        <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          On the map
        </h3>
        <ul className="mt-2 space-y-1 text-sm">
          {placed.map((m) => (
            <li key={m.project.id}>
              <button
                type="button"
                onClick={() => setSelectedId(m.project.id)}
                className={`text-left underline-offset-4 hover:underline ${
                  m.project.id === selectedId ? "font-semibold" : "text-muted-foreground"
                }`}
              >
                {m.project.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
