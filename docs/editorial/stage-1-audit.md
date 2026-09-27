# Stage 1 — Existing content audit and editorial programme
AI Energy Intelligence UK · prepared 12 August 2026 · nothing on the public site has been changed

## Scope of what exists today

The "Analysis & Research" archive contains **five** long-form articles (four published, one draft). Everything else on the site is news aggregation, tools, reports or the UK AI Energy Index — none of it is original analysis and none of it is included in this audit.

Reading time is calculated at render from the actual word count of the stored HTML (`src/routes/blog.$slug.tsx`), so there are **no stated-vs-actual reading-time inconsistencies to correct**. No article carries a named author: all five are attributed to the organisation in both the byline and the Article structured data.

---

## 1. Article-by-article audit

### A. How Much Electricity Do UK Data Centres Use / "How Many Data Centres in the UK Are There Devouring Energy?"
| Field | Finding |
|---|---|
| URL | `/blog/how-many-data-centres-uk-energy` |
| Published | 20 July 2026 |
| Last updated | 20 July 2026 (metadata touch only) |
| Stated reading time | 6 min (auto-calculated) |
| Actual reading time | ~5 min |
| Word count | 1,039 |
| Primary subject | Number and electricity use of UK data centres |
| Recommended pillar | **AI Electricity Demand** (secondary: Data Centres) |
| Author | None named — organisation byline |
| Sources | 6 external links, but 4 are generic homepages (techUK, LINX, NIC, DESNZ department page). One NESO link uses the retired `nationalgrideso.com` domain. Only the IEA *Electricity 2024* and the AI Opportunities Action Plan point at an actual document |
| Primary UK sources | Partially — no DESNZ dataset, no ONS, no NESO FES document link |
| Claims supported | **No.** Headline counts and demand figures are asserted without a citation adjacent to the number. Evidence not available for verification of the stated UK data-centre count |
| Key-findings box | No |
| Chart or table | No |
| Uncertainty explained | Loosely, in prose only |
| Methodology needed | Yes — any UK data-centre count or TWh figure needs a stated definition, base year and source |
| Broken/unsuitable links | `nationalgrideso.com` (renamed to NESO); four homepage-level links |
| Recommendation | **Consolidate and rewrite** as Batch 1 cornerstone "How Much Electricity Do UK Data Centres Use in 2026?" at the same URL. Do not create a competing new URL |

### B. Could AI Use More Energy Than It Saves in the UK?
| Field | Finding |
|---|---|
| URL | `/blog/could-ai-use-more-energy-than-it-saves-uk` |
| Published | 20 July 2026 · Last updated 20 July 2026 |
| Reading time | ~14 min stated and actual |
| Word count | 3,027 — the strongest piece on the site structurally |
| Primary subject | Net energy balance of AI: efficiency gains vs compute demand, rebound effect |
| Recommended pillar | **AI Electricity Demand** (secondary: Policy and Economics) |
| Author | None named |
| Sources | **Zero external links.** Substantial quantified claims with no citation at all |
| Primary UK sources | No |
| Claims supported | **No** — this is the largest credibility gap in the archive |
| Key findings | No box; 13 H3 sections, correct heading discipline |
| Chart/table | No |
| Uncertainty | Discussed in prose, not labelled |
| Methodology needed | Yes, if any figure is retained |
| Recommendation | **Improve, keep published URL.** Add a sources section, attach a citation to every number or delete the number, add a key-findings box and a scenario table |

### C. Will AI Data Centres Change House Prices in the UK?
| Field | Finding |
|---|---|
| URL | `/blog/will-ai-data-centres-change-uk-house-prices` |
| Published | 20 July 2026 · Last updated 10 August 2026 |
| Word count | 1,616 · ~8 min |
| Recommended pillar | **Data Centres** (secondary: Policy and Economics) |
| Sources | **Zero external links**, no mention of sources anywhere |
| Claims supported | No. Property-price effects are stated directionally without any UK evidence base (no ONS/HM Land Registry data, no planning case studies) |
| Key findings / chart / methodology | None |
| Recommendation | **Consolidate with D, then improve.** Off the four core pillars but defensible as a Data Centres/local-impact piece *if* it is grounded in Land Registry and planning evidence. If that evidence cannot be found, archive rather than leave unsourced |

### D. Will AI Data Centres Affect Local House Prices? (draft)
| Field | Finding |
|---|---|
| URL | `/blog/will-ai-data-centres-affect-local-house-prices` — **draft, not public** |
| Word count | 1,153 |
| Recommendation | **Near-duplicate of C.** Merge anything worth keeping into C and delete this draft. Two articles answering the same question would be duplicate content. No redirect needed — it was never published |

### E. How Are Supermarkets Using AI to Save Electricity?
| Field | Finding |
|---|---|
| URL | `/blog/how-supermarkets-use-ai-to-save-electricity` |
| Published | 20 July 2026 · Last updated 10 August 2026 |
| Word count | 1,334 · ~7 min |
| Recommended pillar | **None of the four.** This is commercial energy efficiency, not AI electricity demand, data centres, grid or policy |
| Sources | 10 external links, mostly corporate sustainability landing pages. Two (Walmart, Carrefour) are not UK. One is a commercial link to PowerGuardian |
| Claims supported | Weakly — corporate sustainability pages do not evidence specific savings percentages |
| Recommendation | **Keep published, classify outside the four pillars** as a standing "Business & Efficiency" secondary tag, or archive. It should not be shown as pillar research. Replace non-UK corporate links with UK evidence (Carbon Trust refrigeration guidance, DESNZ non-domestic energy statistics) or remove the claims they were supporting |

---

## 2. Proposed allocation to the four pillars

| Pillar | Existing articles | Batch 1 addition |
|---|---|---|
| AI Electricity Demand | A (rewritten), B | How Much Electricity Do UK Data Centres Use in 2026? (= A) |
| Data Centres | C (after merging D) | Where Are New UK Data Centres Being Built? |
| Grid and Infrastructure | *none* | Can the UK Grid Supply 6 GW of AI Data-Centre Capacity by 2030? |
| Policy and Economics | *none* | What the AI Energy Council Means for Britain's Electricity System |

Two pillars start empty. Their landing pages will state plainly what the section will cover and surface only genuine adjacent material (Index pages, tracker, tools) until the first article publishes. No placeholder articles.

The existing three research topic slugs (`electricity-demand`, `grid-infrastructure`, `policy-investment`) map onto three of the four pillars; a fourth, `data-centres`, is needed. Renaming the visitor-facing labels to the four pillar names requires no URL change except adding the new pillar page.

---

## 3. Pillar landing-page structure

One template, four instances:

1. Pillar name, one-paragraph explanation of the subject and why it matters in Britain
2. Featured analysis (the pillar's cornerstone article) — omitted entirely when the pillar has none, replaced by a short "what this section will cover" statement
3. All analysis in the pillar, newest first
4. Related UK AI Energy Index indicators for the pillar, with the current published values and their confidence labels
5. Related data-centre tracker material (Data Centres and Grid pillars only)
6. Two or three genuinely relevant tools
7. Reports carrying **Published** status only
8. Recent news items filtered to the pillar, shown only when items exist
9. Link to the research methodology and corrections page
10. One newsletter / free-report call to action at the foot, not repeated mid-page

---

## 4. Briefs — all 12 articles

Every brief lists sources to be **opened and verified during drafting**. Nothing below is treated as an established finding yet.

### Pillar: AI Electricity Demand

**1. How Much Electricity Do UK Data Centres Use in 2026?** — cornerstone, priority 1
- Research question: what is the best-evidenced figure for total UK data-centre electricity consumption, and what can and cannot be said about the AI share of it?
- Reader: informed non-specialist, journalists, local decision-makers
- Why it matters: this is the single most-searched number in the subject and the one most often misquoted
- Question answered: a defensible range, with the AI share explicitly separated from total data-centre demand
- Proposed findings (unconfirmed until sourced): a total-demand range for the most recent complete year; an explicit statement that no official UK dataset isolates AI-specific consumption
- Evidence required: DESNZ Energy Consumption in the UK / DUKES, NESO Future Energy Scenarios, DSIT compute publications, IEA *Energy and AI*
- Calculations: conversion between installed IT capacity (MW), utilisation assumption and annual TWh — published in full as an AI Energy Intelligence modelled estimate
- Visual: scenario table of demand under stated utilisation assumptions
- Uncertainties: no official AI/non-AI split; colocation vs enterprise vs hyperscale boundary; base-year mismatch between sources
- Internal links: Index electricity-demand page, data-centre tracker, data-centre electricity calculator
- **Premise risk:** the title implies a 2026 figure exists. Official statistics lag. Recommended honest title if confirmed: "How Much Electricity Do UK Data Centres Use? What the Evidence Shows in 2026"
- Depends on data that may change: yes — DESNZ annual release

**2. UK AI Electricity Demand: Low, Central and High Scenarios to 2035** — cornerstone, priority 5
- Question: under transparent assumptions, what range of additional demand could AI compute add by 2035?
- Evidence: NESO FES scenario data, DSIT compute roadmap ambitions, published grid connection volumes
- Calculations: three scenarios from capacity build-out × utilisation × PUE, each assumption stated in a table
- Visual: three-line scenario chart, all inputs published beneath it
- Uncertainty: this is a model, not a forecast; labelled as an AI Energy Intelligence modelled estimate throughout
- **Premise risk:** none, provided the article never presents a single central number as expected reality

**3. Could AI Data Centres Increase UK Electricity Prices?** — standard, priority 9
- Question: what mechanisms could connect data-centre demand to retail and wholesale prices, and what UK evidence exists for each?
- Evidence: Ofgem price cap methodology, network charging (TNUoS/DUoS) documents, NESO constraint-cost reporting
- **Premise risk: high.** There is unlikely to be UK evidence isolating an AI-driven price effect. The article must be framed as mechanisms and their evidence status, not as a quantified price impact. Publish only if the mechanisms can be sourced

### Pillar: Data Centres

**4. Where Are New UK Data Centres Being Built?** — cornerstone, priority 2
- Question: where is UK data-centre development concentrated, and what does the verified project record show?
- Evidence: the site's own `dc_projects` register (each row already carrying a source), local planning portals, the Planning Inspectorate, company announcements
- Visual: regional table of projects by status, drawn from the register, with a completeness note stating the register is not a complete national census
- **Trust constraint:** must not claim comprehensive national coverage
- Internal links: data-centre tracker, regional pages, AI Growth Zones

**5. UK Data-Centre Planning Tracker: Approved, Proposed and Refused Projects** — standard, priority 6
- Question: what is the planning status of known large UK data-centre applications?
- Evidence: individual local authority planning portals and the Planning Inspectorate only — one verified reference per project
- **Depends on changing data:** yes, high. Needs a stated cut-off date and a review cadence
- Gap: refusals are the hardest to enumerate; if refusals cannot be evidenced the article must say so rather than imply there are none

**6. Data Centres, Water Use and Local Planning in Britain** — standard, priority 10
- Question: how much water do UK data centres use, and how is it treated in planning?
- Evidence: Environment Agency abstraction licensing, water company resource management plans, planning statements for named schemes
- **Premise risk:** UK-specific water figures are scarce. If per-site consumption cannot be sourced, the article covers the planning and licensing framework and states that consumption data are not published

### Pillar: Grid and Infrastructure

**7. Can the UK Grid Supply 6 GW of AI Data-Centre Capacity by 2030?** — cornerstone, priority 3
- Question: what does the connection queue, reform timetable and reinforcement programme imply about delivering large new AI compute load by 2030?
- Evidence: NESO connections reform documents and queue data, Ofgem decisions, National Grid ET investment plans, DSIT compute ambition
- Visual: table of the stated ambition against connection and reinforcement timelines
- **Premise risk: the "6 GW" figure must be traced to its origin before it appears in the title.** If it cannot be attributed to a published UK source, the title changes to "Can the UK Grid Supply the AI Data-Centre Capacity Government Wants by 2030?"
- Uncertainty: connection dates are indicative; reform outcomes unresolved

**8. Who Pays for the Grid Upgrades Required by AI Data Centres?** — standard, priority 7
- Question: how are reinforcement costs allocated between developers, networks and consumers?
- Evidence: Ofgem connection charging methodology, TNUoS/DUoS charging statements, RIIO-T3 documents
- Visual: cost-allocation table by charge type
- Strong candidate: the framework is documented, so claims can be sourced precisely

**9. Can Small Modular Reactors Power UK AI Infrastructure?** — standard, priority 11
- Question: what is the realistic SMR timeline against data-centre demand growth?
- Evidence: Great British Energy – Nuclear / GBN competition outcomes, ONR licensing status, company announcements
- **Premise risk:** deployment dates are announcements, not deliveries. Must be presented as stated timelines with delivery risk, never as capacity that will exist

### Pillar: Policy and Economics

**10. What the AI Energy Council Means for Britain's Electricity System** — cornerstone, priority 4
- Question: what is the Council, what has it actually done, and what powers does it have?
- Evidence: DSIT/DESNZ announcements and terms of reference, published membership, any minutes or outputs
- Visual: table of remit vs statutory power vs published output to date
- **Premise risk:** if the Council has produced little published output, the honest finding is that its influence is not yet demonstrable — that is a legitimate article, and the draft must not inflate it

**11. How AI Growth Zones Could Affect Regional Grid Capacity** — standard, priority 8
- Evidence: DSIT AI Growth Zone designations, regional DNO network development plans, NESO regional data
- Internal links: the existing AI Growth Zones hub and the growth-zone calculator
- Uncertainty: designations are policy intentions; capacity effects are conditional

**12. Monthly UK AI Energy Briefing: August 2026** — briefing, priority 12
- Built only from developments with a primary source, up to a stated cut-off date
- Must state that it is a selection, not comprehensive coverage
- Publishes last in Batch 3 so the cut-off is as late as possible

---

## 5. Recommended publication order

Batch 1: 1, 4, 7, 10 (one per pillar) → Batch 2: 2, 5, 8, 11 → Batch 3: 3, 6, 9, 12.
Existing-article remediation (B sources, C+D merge, E reclassification) runs alongside Batch 1 and does not need new research.

---

## 6. Editorial article template — fields

Research pillar · article type (cornerstone / standard / briefing) · author · publication date · last-updated date (only on substantive revision) · auto-calculated reading time · standfirst · clear answer paragraph · key-findings box · body (H3 sections, H4 subsections, no H2) · chart/table with title, unit, period, source, notes and text description · evidence explanation · uncertainty and limitations · methodology notes · source list with direct document links and access dates · related internal links · corrections contact · estimate/forecast disclaimer · Article + BreadcrumbList structured data.

FAQ schema is added only where genuine visitor-facing questions appear on the page.

## 7. Monthly briefing template — fields

Cut-off date · development of the month · electricity demand · data-centre planning and construction · grid and connections · government and regulation · investment · indicator changes · what to watch next month · source links · explicit "selected developments, not comprehensive" statement.

## 8. Publishing calendar — next 12 weeks

Weeks 1–4: Batch 1 (one cornerstone per week) plus existing-article remediation.
Weeks 5–8: Batch 2. Week 8 also carries the September briefing.
Weeks 9–12: Batch 3. Week 12 carries the quarterly Index update and the October briefing.

The calendar is a plan. Nothing on the site will claim a weekly schedule is operating until four consecutive weeks have genuinely published.

## 9. Decisions needed from you

1. Confirm the four pillar names, and confirm renaming the existing three research topic labels to match.
2. Confirm the supermarkets article sits outside the pillars (keep, reclassified) rather than being archived.
3. Confirm merging the two house-price articles into the published URL and deleting the unpublished draft.
4. Named author: articles currently carry an organisation byline. Should analysis be bylined "Peter Flynn", or remain organisational?
5. Confirm rewriting article A in place at its existing URL rather than publishing a new one.

## 10. Technical limitations

- No official UK dataset isolates AI-specific electricity consumption; every AI-share figure on this site will be a labelled modelled estimate or absent.
- Planning-portal data cannot be fetched automatically at scale; the planning tracker will be manually verified and therefore explicitly partial.
- Sources for existing articles B and C must be found retrospectively; where a claim cannot be evidenced it will be removed rather than softened.
