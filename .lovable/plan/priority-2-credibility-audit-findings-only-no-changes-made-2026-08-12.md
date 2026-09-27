# Priority 2 — Credibility Audit (findings only, no changes made)

## 1. Report inventory

Verified by downloading every PDF referenced in `src/data/reports.ts` and opening it. "Doc?" = a genuine document exists and was opened.

| # | Title / URL (`/reports/...`) | Shown status | Pages claimed | Ver | Date | Price | Doc? | Actual pages | Supports description? | Method/sources in doc | Recommended status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | UK AI Electricity Demand Outlook 2026 · `uk-ai-electricity-demand-outlook-2026` | Free, download | 68 | v1.2 | 2026-05-14 | – | **No** | – | n/a | none | **IN DEVELOPMENT** |
| 2 | UK Data Centre Capacity Atlas 2026 · `uk-data-centre-capacity-atlas-2026` | Premium, enquire | 92 | v2.0 | 2026-04-02 | in £1,800 pack | **No** | – | n/a | none | **FORTHCOMING** |
| 3 | AI Data Centres & the UK Electricity Grid 2026 | Free, download | 20 | v1.0 | 2026-07-13 | – | Yes | 20 ✓ | Yes | sources+assumptions; **no methodology/limitations**; published by **AcrossAI** | PUBLISHED — METHODOLOGY INCOMPLETE |
| 4 | UK Grid Connection Queue Analysis | Free, download | 54 | v1.0 | 2026-03-18 | – | **No** | – | n/a | none | **IN DEVELOPMENT** |
| 5 | UK Electricity Demand to 2035 | Premium, enquire | 78 | v1.1 | 2026-02-05 | in £1,200 pack | **No** | – | n/a | none | **FORTHCOMING** |
| 6 | Business AI ROI Benchmark 2026 | Free, download | 46 | v1.0 | 2026-06-20 | in £950 pack | **No** | – | n/a | none | **IN DEVELOPMENT / rewrite as modelled framework** |
| 7 | AI Electricity Cost Calculator: UK Business Guide 2026 | Free, download | 16 | v1.0 | 2026-03-01 | – | Yes (`/guides/...pdf`) | 17 | Yes | to confirm | PUBLISHED (fix page count) |
| 8 | The Business Guide to AI Energy Costs 2026 | Free, download | 12 | v1.0 | 2026-07-13 | – | Yes | 12 ✓ | Yes | sources+assumptions; no methodology; **AcrossAI** branded | PUBLISHED — METHODOLOGY INCOMPLETE |
| 9 | AI & Energy Crisis: UK Power Demand Forecast 2026 | Free, download | 12 | v1.0 | 2026-07-13 | – | Yes | 12 ✓ | Yes | no methodology/assumptions; **AcrossAI** branded | PUBLISHED — METHODOLOGY INCOMPLETE |
| 10 | UK Business AI Policy Template & Governance Pack 2026 | Free, download | 15 | v1.0 | 2026-07-12 | – | Yes | 15 ✓ | Yes (template, not research) | n/a | PUBLISHED — but **off-topic** (see §7) |
| 11 | AI Energy Consumption Index: Q2 2025 | Free, download | 44 | Q2 2025 | 2025-07-01 | – | Yes | 44 ✓ | Yes | methodology, sources, assumptions, limitations, disclaimer ✓ | **PUBLISHED** (best-in-class) |
| 12 | AI Search vs Traditional Search Index 2026 | Free, download | 44 | v1.0 | 2026-07-01 | – | Yes | 44 ✓ | Yes | methodology/sources/limits ✓; PDF says "July 2026", file named 2025 | PUBLISHED (align dates) |
| 13 | UK AI Energy Report 2026 | Free, download | **60** | v1.0 | 2026-07-13 | in £1,200 pack | Yes | **25** | Partly | methodology, version, disclaimer ✓; **AcrossAI** branded, "Published June 2026" | PUBLISHED (correct pages/date/publisher) |
| 14 | Best Value Energy Suppliers Report 2026 | Free, download | 21 | v1.0 | 2026-06-01 | in £1,200 pack | Yes | 21 ✓ | Yes | methodology+sources; **produced by PowerGuardian.co.uk** | **RELOCATE to PowerGuardian** |
| 15 | UK AI Infrastructure Investment Report 2026 | Free, download | 22 | v1.0 | 2026-07-13 | – | Yes | 22 ✓ | Yes | no methodology/assumptions; **AcrossAI** branded | PUBLISHED — METHODOLOGY INCOMPLETE |
| 16 | AI-Era Cyber Threats to UK Energy Infrastructure | Premium, enquire | 58 | v1.0 | 2026-05-30 | in £1,400 pack | **No** | – | n/a | none | **FORTHCOMING** + off-topic review |
| 17 | UK AI & Energy Policy Briefing 2026 | Free, download | 42 | v1.1 | 2026-06-01 | – | **No** | – | n/a | none | **IN DEVELOPMENT** |

Orphan file: `public/guides/ai-implementation-playbook-uk-sme-2026.pdf` still hosted after the report was removed.

## 2. Most serious issue — synthetic downloads

`src/routes/reports.$slug.tsx` → `triggerDownload()`: when a report has no `downloadUrl` it calls `buildReportPdf(r)` and generates a PDF **on the fly from the invented site metadata**. Reports 1, 4, 6, 17 therefore serve visitors (after an email capture) a machine-made document presented as a 68/54/46/42-page research report. This is the highest-priority correction.

## 3. Numerical claims audit (all unverifiable)

| Claim | Where | Named source | Verifiable? | Type | Recommendation |
|---|---|---|---|---|---|
| "AI adds 14–22 TWh/year by 2030 (central case)" | report 1 exec summary + key findings | none on page; FAQ cites "Ofgem, ESO, DSIT, DESNZ, IEA and our own model" | **Evidence not available for verification** — no model, no workings, no document | Forecast | Remove, or restate against a published NESO/DESNZ figure |
| "80% of new load concentrates in six clusters" | report 1 | none | Evidence not available for verification | Modelled | Remove |
| "Efficiency saves 6–9 TWh/year" | report 1 | none | Evidence not available for verification | Modelled | Remove |
| "8.6 GW across 74 sites"; "3.1 GW pre-2030" | report 2 | none | Evidence not available for verification; site's own `dc_projects` table does not contain a 74-site register | Estimate | Remove until register exists |
| "Median payback 11 months across 340 UK firms"; "top quartile <5 months"; "70% of failed pilots" | report 6 | FAQ: "stratified… ONS classifications, cross-referenced with Companies House" | **No dataset, sample frame, survey instrument or fieldwork exists in the project** | Presented as observed | Remove all four; see §4 |
| "Total UK AI infrastructure investment exceeds £100bn" | report 15 page + PDF | PDF asserts it without citation | Third-party assertion, uncited | Mixed | Attribute or drop |
| "485 TWh global data centre electricity 2025; AI 20–25%" | report 11 | PDF states estimate basis | Supported *as an estimate* in the document | Estimate | Label "estimate" on page too |
| Index figures (5 TWh baseline, 22 TWh 2030, 1.6 GW, ≥6 GW) | `/uk-ai-energy-index` | NESO / DSIT / DESNZ rows in `index_sources` | Yes — sourced, per your approved baseline | Observed + forecast | No change (out of scope) |

## 4. Business AI ROI Benchmark 2026 — verdict

No dataset, no participant list, no survey, no fieldwork record, no calculation exists anywhere in the project. Companies House and ONS are named in a FAQ answer only. Nothing is reproducible. **Recommendation: relabel "In development", strip the 340-companies / 11-month / 5-month / 70% claims, and either rewrite as an explicitly modelled ROI framework or withdraw the page.** No replacement figures will be invented.

## 5. Pricing and commercial claims

Four collections priced £950–£1,800 (`/collections/*`). Every one bundles at least one report that has no document: AI & Energy (£1,200 → reports 5), Data Centre (£1,800 → 2, 4), Business AI (£950 → 6), Cyber Security (£1,400 → 16, 17). There is no checkout — buttons route to `/contact` — so no payment can complete, but a price is displayed for undeliverable packs. There is no VAT wording, delivery timing or refund reference on the collection pages (`/refunds` exists but is unlinked from them). **Recommendation: remove displayed prices until each pack is deliverable, or relabel packs as commissioned/bespoke research with "price on enquiry".** No live payment will be touched.

## 6. Index transparency (audit only — no calculation changes)

`/uk-ai-energy-index/methodology` shows only "Methodology version 1.0". Missing for visitors: what each sub-index measures, observed vs estimated flags at page level, base period, weighting, treatment of missing data, revision history, limitations, and version history. The database already holds `methodology_versions`, `index_revisions`, `confidence_level` and `data_classification` — this is a surfacing gap, not a data gap. Recommendation: expand the existing Methodology page from data already stored; write nothing new.

## 7. Off-topic / relocation

| Item | Recommendation |
|---|---|
| Best Value Energy Suppliers Report 2026 (PowerGuardian-produced, household tariffs) | Move to PowerGuardian; remove from AI Energy Intelligence promotion |
| UK Business AI Policy Template & Governance Pack | Off-topic for AI-energy focus — relocate or de-promote |
| AI-Era Cyber Threats (report 16) + Cyber Security collection & category | No document exists and no direct AI-energy link — Cyber England, or drop the category |
| Business AI ROI Benchmark | Keep only if rewritten as an AI-energy-cost framework |

## 8. Trust / editorial gaps

Pages exist for About, Editorial Standards, Research Methodology, Corrections, Contact, Editorial Team, AI Use & Conflicts, Privacy, Terms, Refunds. Gaps: (a) **text corruption** — "AI-assisted" has been mangled to "n" in `ai-use-and-conflicts.tsx`, `editorial-standards.tsx`, `editorial-team.tsx`, `terms.tsx` and a guide route, breaking sentences on trust pages; (b) no independence/funding statement; (c) no affiliate/commercial-relationship disclosure despite priced collections; (d) `editorial-standards.tsx` implies peer-reviewed sourcing — fine as a source type, but must not imply this site's own output is peer reviewed.

## 9. Proposed wording changes (sample — full set on approval)

| Page | Current | Problem | Proposed |
|---|---|---|---|
| Report 1 hero | "68 pages · v1.2 · Download PDF report" | Document does not exist | "In development — register for publication updates" (page count, version and date removed) |
| Report 1 key finding | "AI adds an estimated 14–22 TWh/year by 2030" | Unsupported | Remove; link to the Index electricity-demand page, which is sourced |
| Report 6 summary | "Benchmark of realised AI ROI across 340 UK companies" | No dataset | "Planned framework for assessing AI return on investment for UK organisations. In development." |
| Report 13 meta | "60 pages" | Document has 25 | "25 pages" + publisher credit "AcrossAI Intelligence" |
| Collections | "Collection price £1,800" | Undeliverable | "Available on enquiry" until contents exist |
| Reports hub stats | "17 research reports" | 8 documents exist | "8 published reports · 9 in development" |

## 10. Decisions I need from you

1. AcrossAI-published PDFs (3, 8, 9, 13, 15): credit as third-party research republished here, or re-badge as AI Energy Intelligence (only if you own them)?
2. Best Value Energy Suppliers — relocate to PowerGuardian now, or de-promote only?
3. Collection prices — remove, or switch to "price on enquiry"?
4. Reports 1, 2, 4, 5, 16, 17 — keep as "In development"/"Forthcoming" pages (SEO retained), or unpublish?
5. Is there any offline dataset behind the 340-company benchmark that I have not been given access to?

**Nothing has been changed.** On approval I will apply §9 across report data, report pages, hub cards, collections, structured data (removing Offer/Product where unpurchasable), the sitemap and status labels.
