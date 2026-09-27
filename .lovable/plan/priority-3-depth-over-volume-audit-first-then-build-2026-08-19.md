# Priority 3 — depth over volume: audit first, then build

The full audit is in `docs/editorial/priority-3-article-audit.md`. Nothing public has changed yet.
This is the summary and the decisions I need before touching content.

## The archive is smaller than the brief assumes

Four published articles. No drafts. The duplicate house-price draft from the last audit is already
gone. So there is **nothing to merge, nothing to remove and no redirects to create** — the
consolidation half of the brief has no work in it today.

| URL | Decision | Why |
|---|---|---|
| `/blog/how-many-data-centres-uk-energy` | Rewrite in place as cornerstone | Highest-intent topic; figures uncited, one dead NESO domain, four homepage links |
| `/blog/could-ai-use-more-energy-than-it-saves-uk` | Improve | Best-written piece, effectively zero citations behind quantified claims |
| `/blog/will-ai-data-centres-change-uk-house-prices` | Evidence it or withdraw it | Directional property claims with no Land Registry, ONS or planning evidence |
| `/blog/how-supermarkets-use-ai-to-save-electricity` | Keep, reclassify outside the pillars | Real subject, wrong section; two non-UK corporate sources |

The volume problem is the **71 approved news items** sitting at the same visual weight as analysis, not
the four articles.

## What I'd build (structure now, articles after)

1. **Fifth pillar** — Water, emissions and environmental impact — alongside the existing four.
2. **Pillar filters on /blog**, replacing the raw category chips. No new nav items.
3. **Populate the evidence fields** the article template already renders but that are empty on all four
   articles: key findings, structured sources with publication dates, methodology, limitations, named
   author, last-reviewed date.
4. **Editorial review flag** — an article without a completed evidence pass cannot appear in a featured
   slot on the homepage or the top of /blog. It is not labelled "verified" until it is.
5. **"What changed" box** rendered on any article with a last-updated date and a change note.
6. **Homepage**: at most three principal analyses; news demoted to a compact strip.
7. **/blog ordering**: cornerstones and recently reviewed pieces first, thin and routine material last.
8. **Schema and sitemap**: Article schema with datePublished, dateModified, named author and publisher;
   sitemap emits one entry per surviving analysis URL.

Then the four rewrites, one at a time, each shown to you with its sources before it publishes.

## Cadence I'd hold the site to

One substantial analysis a fortnight, Index and tracker updates whenever verified data changes, one
quarterly Index briefing. Nothing on the site will claim a cadence is running until it demonstrably is.

## Decisions I need

1. Add **Water, emissions and environmental impact** as a fifth pillar? (Water currently sits under Data
   Centres.)
2. Byline the analysis **"Peter Flynn"**, or keep the organisation byline?
3. The house-price article: **withdraw it** if Land Registry / planning evidence can't support it, or keep
   it published while reframed as "what evidence would be needed"?
4. Build the structure (items 1–8) first and rewrite articles after, or take one article end-to-end first
   so you can see the finished standard before the rest?
