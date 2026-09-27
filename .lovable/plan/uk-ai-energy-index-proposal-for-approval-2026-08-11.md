## UK AI Energy Index — proposal for approval

You asked to see the structure before anything is built or any data added. Nothing below invents figures: every value shown publicly will come from a record an admin has entered, with a source and a classification, or it will read "Data not yet available".

## 1. Proposed database structure

Three sub-indices reuse the existing index framework where it fits and add what's missing.

**New: `index_subindices`** — the three sub-indices as records
`slug` (electricity-demand | data-centre-growth | grid-pressure), `name`, `intro`, `status_label` (defaults to "Baseline in development"), `score` (nullable), `direction` (rising | stable | falling | unknown), `period_label`, `last_reviewed_at`, `status` (draft/published).

**Reuse: `index_indicators`** — with new columns
Add `subindex_id`, `data_classification` (verified | industry_estimate | aie_estimate | forecast | not_disclosed | not_available), `is_forecast`, `forecast_year`. Existing fields already cover name, unit, source, methodology, caveats, review dates.

**Reuse: `index_datapoints`** — reporting periods and history
Already has value, unit, period label/start/end, previous comparison via prior rows, source name/URL, notes, status. Add `previous_value`, `percent_change`, `data_classification`, `publication_date`, `reviewed_at`.

**New: `dc_regions`** — the nine regional definitions (see section 3)
`slug`, `name`, `display_order`.

**New: `dc_region_stats`** — one row per region per review
Operational / under construction / approved / proposed counts, operational MW, MW under development, hyperscale count, latest planning decision (text + date), `data_completeness` (complete | partial | minimal | none), `last_reviewed_at`, `status`.

**New: `grid_pressure_ratings`** — one row per region per review
`rating` (low | moderate | high | severe | insufficient_evidence), written rationale (required), connection-demand evidence, known delays, network constraints, planned investment, flexible connection availability, `evidence_confidence`, `last_reviewed_at`, `status`.

**Reuse + extend: `dc_projects`** — the unique development register
Already holds name, operator, town, region, status, capacity MW, planning authority/reference, sources, verified flag. Add `planning_decision`, `decision_date`, `expected_operational_date`, `region_slug` (mapped to the nine regions), and a unique constraint on `(planning_authority, planning_reference)` plus the existing unique `slug` to prevent double-counting.

**New: `index_sources`** — the source register
Organisation, title, URL, publication date, source type, indicators supported, date accessed, notes.

**Reuse: `index_revisions`** — change history. Corrections write a new revision row and supersede rather than delete the previous record.

All new public tables get GRANTs, RLS on, public read limited to `status = 'published'`, and admin-only writes via the existing `has_role(auth.uid(), 'admin')`.

## 2. Scoring and rating logic

**Sub-index scores:** none at launch. Each of the three cards displays "Baseline in development" with direction "unknown" until enough published datapoints exist to support a defensible score. No formula is applied to partial data.

**Direction of change** is derived only when two published datapoints for the same indicator share a comparable period; otherwise "unknown".

**Grid-pressure ratings** are assigned manually by an admin and are rejected by the form unless all of these are present: at least one attached source, a written rationale, and an evidence-confidence level. Colour is paired with a text label and an icon, never colour alone.

**Data completeness** per region is derived from how many of its fields have published values: complete (all), partial (some), minimal (1–2), none.

## 3. Regional definitions

London · Slough and the Thames Valley · South East England · Midlands · North West England · North East and Yorkshire · Scotland · Wales · Northern Ireland

Note: this differs from the 12-region list already used by the data-centre tracker (which splits East/West Midlands, North East and Yorkshire, and includes East of England / South West). I will add a mapping table so tracker projects roll up into these nine index regions; East of England and South West map into "South East England" only where a project is genuinely in that footprint, otherwise they will be listed as "Other / not mapped" rather than forced into a region. **This needs your approval** — alternative is to keep the tracker's 12 regions for consistency.

## 4. Page structure

```text
/uk-ai-energy-index                      overview: 3 sub-index cards + Key UK indicators
/uk-ai-energy-index/electricity-demand   8 indicators, current vs forecast split, chart slot
/uk-ai-energy-index/data-centre-growth   growth indicators + regional table + region selector
/uk-ai-energy-index/grid-pressure        grid indicators + regional pressure table
/uk-ai-energy-index/methodology          methodology + full source register
```

The existing `/uk-ai-energy-index` page becomes a layout with the overview at its index route; its current framework content (indicator cards, trend chart, revision history) is preserved and folded into the overview and sub-index pages rather than discarded.

Regional section: lives on the growth and grid pages as a shared, filterable regional component with a region selector; a shared `RegionalTable` component is used by both.

Admin: extends `/AIAdmin/energy-index` with tabs for Sub-indices, Indicators, Datapoints, Regions, Grid ratings, Projects, Sources, Revisions. Publish/unpublish per record, "last reviewed" date, correction-with-history rather than delete.

SEO: the five titles you supplied, per-page descriptions, canonical + og tags, breadcrumb JSON-LD, Dataset JSON-LD on the overview, sitemap entries, and contextual cross-links between all four pages.

## 5. Assumptions needing your approval

1. **Regions** — nine index regions with a mapping from the tracker's twelve (section 3).
2. **No scores at launch** — all three cards read "Baseline in development" until you enter enough sourced data.
3. **Empty by default** — no seed data, no demo rows, no placeholder chart series. The pages will read "Data not yet available" everywhere until you populate them in admin.
4. **AI-specific consumption** — where it can't be separated from general data-centre consumption, the indicator shows "Data not yet available" with a standing caveat, rather than reusing the data-centre figure.
5. **Existing `/uk-ai-energy-index` content** is retained and reorganised, not deleted.

## Build order

Stage 1 page structure and components → Stage 2 database and admin fields → Stage 3 public tables, filters, regional views → Stage 4 methodology and source register → Stage 5 mobile/accessibility/link testing → Stage 6 review.

Confirm the five assumptions (especially the regional mapping) and I'll start Stage 1.
