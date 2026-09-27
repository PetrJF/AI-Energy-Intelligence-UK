# Priority 3 — article audit before consolidation

AI Energy Intelligence UK · prepared 19 August 2026 · **nothing on the public site has been changed**

## What actually exists

The Analysis & Research archive contains **four published articles and no drafts**. The near-duplicate
house-price draft identified in the Stage 1 audit is no longer in the database. Everything else on the
site is news, tools, reports, the Index or the tracker — none of it is original analysis.

There is therefore no set of "10–15 articles with the greatest search potential" to upgrade. Depth has
to be built, not selected.

Alongside the archive sit **71 approved news items** (11 July – 18 August 2026), which is the volume
problem the brief describes: automated rewrites of stories reported elsewhere, given the same visual
weight as analysis.

## Article audit

| URL | Subject | Words (approx.) | Source links | Evidence fields | Decision | Destination | Reason |
|---|---|---|---|---|---|---|---|
| `/blog/how-many-data-centres-uk-energy` | Number and electricity use of UK data centres | ~1,150 | 8 in body, 0 structured sources | none | **Improve (rewrite in place)** | same URL | Highest-intent query on the site. Figures are asserted without adjacent citation; one link uses the retired `nationalgrideso.com` domain; four are homepages. Rewrite as the AI Electricity Demand cornerstone at the existing URL — no new competing URL. |
| `/blog/could-ai-use-more-energy-than-it-saves-uk` | Net energy balance of AI: efficiency vs compute growth | ~3,400 | 5 in body, 0 structured sources | none | **Improve** | same URL | Structurally the strongest piece, and the biggest credibility gap: quantified claims with essentially no citation. Every number gets a source or is removed. |
| `/blog/will-ai-data-centres-change-uk-house-prices` | Local property-price effects of data centres | ~1,900 | 3 in body, 0 structured sources | none | **Improve, or archive if unevidenced** | same URL | Directional claims with no UK evidence base. Must be grounded in HM Land Registry / ONS and named planning cases. If that evidence cannot be found, the article is withdrawn rather than softened. No merge target exists — the duplicate draft is gone. |
| `/blog/how-supermarkets-use-ai-to-save-electricity` | AI in retail refrigeration and lighting control | ~1,600 | 16 in body, 0 structured sources | none | **Keep, reclassify** | same URL, `Business & Efficiency` (outside the five pillars) | Genuine subject but not AI electricity demand, data centres, grid, water or policy. Two sources are non-UK (Walmart, Carrefour) and most are corporate landing pages that do not evidence the savings percentages. Replace or drop those claims. Never featured as pillar research. |

**Merges: none.** **Removals: none.** **Redirects: none required** — every published URL is being kept.
That is the honest outcome of an archive this small; consolidation machinery is only worth building when
there is something to consolidate.

## Where the volume problem actually is

71 approved news items against four analyses. The fix is presentational and procedural, not deletion:
news stays at `/news` as a dated feed, but stops competing with analysis for prominence, and the
default publishing response to a development becomes "update the cornerstone or the tracker", not
"write another summary".

## What needs building

1. A fifth pillar — **Water, emissions and environmental impact** — added to the four existing ones.
2. Visible pillar filters on `/blog`, replacing the raw category chips.
3. The evidence fields the article template already renders (key findings, structured sources,
   methodology, limitations, named author, last-reviewed date) populated for every article — they are
   currently empty on all four.
4. An "Editorial review status" flag so an article that has not had its evidence pass cannot be
   featured on the homepage or at the top of `/blog`.
5. A "What changed" box for material updates.
6. Homepage limited to three principal analyses.

## Evidence rules applied to every rewrite

Primary sources only for load-bearing numbers: DESNZ, Ofgem, NESO, Environment Agency, planning
authorities, Parliament, company filings, developer documents. Every figure carries its unit, period
and publication date. Estimates are labelled as estimates; forecasts name their producer, scenario and
horizon. Where evidence does not exist — as with any AI-specific share of UK data-centre consumption —
the article says so rather than inferring a number.
