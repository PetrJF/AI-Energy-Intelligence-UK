// Public project register for the Data Centre Growth Index.
// Only records approved for publication reach this component, and totals are
// reported separately by development status — never combined.

import { useMemo, useState } from "react";
import {
  CAPACITY_DEFINITION_LABELS,
  DEV_STATUS_LABELS,
  FACILITY_TYPE_LABELS,
  INDEX_REGIONS,
  NOT_AVAILABLE,
  fmtDate,
  regionName,
} from "@/lib/index-sections";
import type { IndexProject } from "@/lib/index-sections.functions";

const TOTAL_GROUPS: { key: string; label: string; statuses: string[] }[] = [
  { key: "operational", label: "Operational", statuses: ["operational"] },
  { key: "under_construction", label: "Under construction", statuses: ["under_construction"] },
  { key: "approved", label: "Approved", statuses: ["approved"] },
  { key: "proposed", label: "Proposed", statuses: ["proposed"] },
  { key: "refused", label: "Refused", statuses: ["refused", "withdrawn"] },
  { key: "delayed", label: "Delayed or cancelled", statuses: ["delayed", "cancelled"] },
];

function capacityCell(p: IndexProject) {
  const value =
    p.capacity_mw ??
    p.it_capacity_mw ??
    p.stated_electricity_demand_mw ??
    p.grid_connection_mw ??
    p.campus_capacity_mw;
  if (value === null || value === undefined) return null;
  return `${value.toLocaleString("en-GB")} ${p.capacity_unit ?? "MW"}`;
}

export function ProjectRegister({ projects }: { projects: IndexProject[] }) {
  const [region, setRegion] = useState("all");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          (region === "all" || p.index_region_slug === region) &&
          (status === "all" || p.status === status) &&
          (type === "all" || p.facility_type === type),
      ),
    [projects, region, status, type],
  );

  const totals = TOTAL_GROUPS.map((g) => ({
    ...g,
    count: filtered.filter((p) => g.statuses.includes(p.status)).length,
  }));

  const select = "rounded-md border border-border bg-background px-3 py-2 text-sm";

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-sm">
          <span className="block font-medium">Region</span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className={`mt-1 w-full ${select}`}
          >
            <option value="all">All regions</option>
            {INDEX_REGIONS.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="block font-medium">Development status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={`mt-1 w-full ${select}`}
          >
            <option value="all">All statuses</option>
            {Object.entries(DEV_STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="block font-medium">Facility type</span>
          <select value={type} onChange={(e) => setType(e.target.value)} className={`mt-1 w-full ${select}`}>
            <option value="all">All types</option>
            {Object.entries(FACILITY_TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ul className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {totals.map((t) => (
          <li key={t.key} className="rounded-lg border border-border bg-card p-3">
            <p className="text-xs text-muted-foreground">{t.label}</p>
            <p className="text-xl font-semibold">{t.count.toLocaleString("en-GB")}</p>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-muted-foreground">
        Counts cover published records only, and are never combined across statuses: a proposed
        development is not added to operational capacity.
      </p>

      {filtered.length === 0 ? (
        <p className="mt-5 rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
          No published project records match this selection. {NOT_AVAILABLE}.
        </p>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <caption className="sr-only">Published UK data-centre project records</caption>
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-3">Project</th>
                <th scope="col" className="px-4 py-3">Operator</th>
                <th scope="col" className="px-4 py-3">Location</th>
                <th scope="col" className="px-4 py-3">Region</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3">Capacity</th>
                <th scope="col" className="px-4 py-3">Capacity definition</th>
                <th scope="col" className="px-4 py-3">Planning decision</th>
                <th scope="col" className="px-4 py-3">Expected opening</th>
                <th scope="col" className="px-4 py-3">Last verified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => (
                <tr key={p.id} className="align-top">
                  <th scope="row" className="px-4 py-3 font-medium">
                    {p.name}
                    {p.campus_name ? (
                      <span className="mt-1 block text-xs font-normal text-muted-foreground">
                        Campus: {p.campus_name}
                      </span>
                    ) : null}
                    <span className="mt-1 block text-xs font-normal text-muted-foreground">
                      {FACILITY_TYPE_LABELS[p.facility_type] ?? p.facility_type}
                    </span>
                  </th>
                  <td className="px-4 py-3">{p.operator ?? "—"}</td>
                  <td className="px-4 py-3">
                    {p.town ?? "—"}
                    {p.local_authority ? (
                      <span className="block text-xs text-muted-foreground">{p.local_authority}</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    {p.index_region_slug ? regionName(p.index_region_slug) : (p.region ?? "—")}
                  </td>
                  <td className="px-4 py-3">{DEV_STATUS_LABELS[p.status] ?? p.status}</td>
                  <td className="px-4 py-3">{capacityCell(p) ?? "—"}</td>
                  <td className="px-4 py-3 text-xs">
                    {CAPACITY_DEFINITION_LABELS[p.capacity_definition] ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    {p.planning_decision ?? "—"}
                    {p.decision_date ? (
                      <span className="block text-xs text-muted-foreground">{fmtDate(p.decision_date)}</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    {fmtDate(p.actual_operational_date ?? p.expected_operational_date) ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {fmtDate(p.last_verified_at) ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
