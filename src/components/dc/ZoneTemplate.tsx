// Reusable AI Growth Zone templates.
// ZoneCard = hub summary card. ZoneProfile = full zone page body.
// Both render only what has been published for a zone; nothing is estimated.

import { Link } from "@tanstack/react-router";
import { ExternalLink, MapPin, ShieldCheck, Zap, CalendarClock, FileText, Activity } from "lucide-react";
import {
  DC_STATUS_LABELS,
  DC_AI_RELEVANCE_LABELS,
  DC_CONFIDENCE_LABELS,
  ZONE_STAGE_LABELS,
  labelFor,
  regionSlug,
} from "@/lib/dc-projects";
import type { GrowthZone } from "@/lib/growth-zones.functions";

export function gbpCompactValue(v: number | null) {
  if (v === null || v === undefined) return "Not published";
  if (v >= 1e9) return `£${(v / 1e9).toLocaleString("en-GB", { maximumFractionDigits: 1 })}bn`;
  if (v >= 1e6) return `£${(v / 1e6).toLocaleString("en-GB", { maximumFractionDigits: 1 })}m`;
  return `£${v.toLocaleString("en-GB")}`;
}

function ukDate(d: string | null) {
  if (!d) return "Not published";
  const parsed = new Date(d);
  if (Number.isNaN(parsed.getTime())) return d;
  return parsed.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function orNotPublished(v: string | null | undefined) {
  return v && v.trim() !== "" ? v : "Not published";
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border py-3 last:border-0 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">{children}</dd>
    </div>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="flex items-center gap-2 text-base font-semibold">
        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function ZoneCard({ zone }: { zone: GrowthZone }) {
  const latest = zone.milestones[zone.milestones.length - 1];
  return (
    <Link
      to="/ai-growth-zones/$slug"
      params={{ slug: zone.slug }}
      className="block rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground/30"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold">{zone.name}</h3>
        {zone.verified && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3 w-3" aria-hidden /> Verified
          </span>
        )}
      </div>
      <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
        <MapPin className="h-3.5 w-3.5" aria-hidden />
        {zone.town ? `${zone.town}, ${zone.region}` : zone.region}
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Stated investment</dt>
          <dd className="font-medium">{gbpCompactValue(zone.investment_gbp)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Published capacity</dt>
          <dd className="font-medium">
            {zone.capacity_mw ? `${zone.capacity_mw.toLocaleString("en-GB")} MW` : "Not published"}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Status</dt>
          <dd className="font-medium">{labelFor(DC_STATUS_LABELS, zone.status)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Announced</dt>
          <dd className="font-medium">{ukDate(zone.announced_date)}</dd>
        </div>
      </dl>
      {latest && (
        <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
          Latest: {latest.title}
          {latest.milestone_date ? ` — ${ukDate(latest.milestone_date)}` : ""}
        </p>
      )}
    </Link>
  );
}

export function ZoneProfile({ zone }: { zone: GrowthZone }) {
  return (
    <div className="space-y-6">
      {zone.summary && <p className="text-muted-foreground">{zone.summary}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        <Panel title="Investment" icon={FileText}>
          <dl>
            <Row label="Stated investment">{gbpCompactValue(zone.investment_gbp)}</Row>
            <Row label="Lead organisations">{orNotPublished(zone.operator)}</Row>
            <Row label="Announced">{ukDate(zone.announced_date)}</Row>
            <Row label="Target live">{ukDate(zone.target_live_date)}</Row>
          </dl>
        </Panel>

        <Panel title="Power and grid" icon={Zap}>
          <dl>
            <Row label="Published capacity">
              {zone.capacity_mw ? `${zone.capacity_mw.toLocaleString("en-GB")} MW` : "Not published"}
            </Row>
            <Row label="Power notes">{orNotPublished(zone.power_notes)}</Row>
            <Row label="Grid connection">{orNotPublished(zone.grid_connection_notes)}</Row>
            <Row label="Cooling and water">
              {orNotPublished(zone.cooling_notes ?? zone.water_notes)}
            </Row>
          </dl>
        </Panel>

        <Panel title="Planning" icon={CalendarClock}>
          <dl>
            <Row label="Planning authority">{orNotPublished(zone.planning_authority)}</Row>
            <Row label="Planning reference">{orNotPublished(zone.planning_reference)}</Row>
            <Row label="Current status">{labelFor(DC_STATUS_LABELS, zone.status)}</Row>
            <Row label="Floor area">
              {zone.floor_area_sqm
                ? `${zone.floor_area_sqm.toLocaleString("en-GB")} m²`
                : "Not published"}
            </Row>
          </dl>
        </Panel>

        <Panel title="Evidence quality" icon={ShieldCheck}>
          <dl>
            <Row label="Confidence">{labelFor(DC_CONFIDENCE_LABELS, zone.confidence_level)}</Row>
            <Row label="AI relevance">{labelFor(DC_AI_RELEVANCE_LABELS, zone.ai_relevance)}</Row>
            <Row label="Verified">{zone.verified ? "Yes" : "Not yet verified"}</Row>
            <Row label="Last updated">{ukDate(zone.updated_at.slice(0, 10))}</Row>
          </dl>
        </Panel>
      </div>

      <Panel title="Progress" icon={Activity}>
        {zone.milestones.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No milestones have been recorded for this zone yet. We only log steps that appear in
            official announcements or planning records.
          </p>
        ) : (
          <ol className="space-y-4">
            {zone.milestones.map((m) => (
              <li key={m.id} className="border-l-2 border-border pl-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {labelFor(ZONE_STAGE_LABELS, m.stage)}
                  {m.milestone_date ? ` · ${ukDate(m.milestone_date)}` : ""}
                </p>
                <p className="font-medium">{m.title}</p>
                {m.notes && <p className="text-sm text-muted-foreground">{m.notes}</p>}
                {m.source_url && (
                  <a
                    href={m.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-sm underline"
                  >
                    {m.source_title ?? "Source"} <ExternalLink className="h-3 w-3" aria-hidden />
                  </a>
                )}
              </li>
            ))}
          </ol>
        )}
      </Panel>

      {zone.key_facts.length > 0 && (
        <Panel title="Key facts as published" icon={FileText}>
          <dl>
            {zone.key_facts.map((f) => (
              <Row key={`${f.label}-${f.value}`} label={f.label}>
                {f.value}
              </Row>
            ))}
          </dl>
        </Panel>
      )}

      {zone.sources.length > 0 && (
        <Panel title="Sources" icon={ExternalLink}>
          <ul className="space-y-2 text-sm">
            {zone.sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 underline"
                >
                  {s.title} <ExternalLink className="h-3 w-3" aria-hidden />
                </a>
                <span className="text-muted-foreground">
                  {s.publisher ? ` — ${s.publisher}` : ""}
                  {s.date ? `, ${s.date}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <Panel title="Where this connects" icon={MapPin}>
        <ul className="space-y-2 text-sm">
          <li>
            <Link to="/uk-data-centre-tracker/$slug" params={{ slug: zone.slug }} className="underline">
              Tracker entry for {zone.name}
            </Link>{" "}
            — the same record inside the UK data-centre tracker.
          </li>
          <li>
            <Link
              to="/uk-data-centre-tracker/regions/$region"
              params={{ region: regionSlug(zone.region) }}
              className="underline"
            >
              All tracked projects in {zone.region}
            </Link>
          </li>
          <li>
            <Link to="/uk-ai-energy-index" className="underline">
              UK AI Energy Index
            </Link>{" "}
            — the indicators we track for AI-driven electricity demand.
          </li>
          <li>
            <Link to="/ai-energy-calculators/growth-zone" className="underline">
              AI growth zone impact calculator
            </Link>{" "}
            — model the electricity implications of a zone of a given size.
          </li>
        </ul>
      </Panel>
    </div>
  );
}
