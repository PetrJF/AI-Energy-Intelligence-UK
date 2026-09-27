# Priority 1 — Make the UK AI Energy Index the centre of the site

I audited what already exists before planning, because a lot of this brief is already built and I don't want to create a second version of the same thing.

## Already in place (will be reused, not rebuilt)

- Structured data model with per-observation provenance: indicators, datapoints, editions, revisions, source register, geographic coverage, reporting period, source name/URL, classification, confidence, reviewed-at date. (`index_indicators`, `index_datapoints`, `index_sources`, editions + revision history.)
- Evidence-status labels and "Insufficient evidence" handling across index pages.
- Three sub-indices with their own pages: `/uk-ai-energy-index/electricity-demand`, `/data-centre-growth`, `/grid-pressure`.
- Main index page with edition, methodology version, charts, revision history, source register, `/uk-ai-energy-index/methodology`, corrections form, Dataset + Breadcrumb JSON-LD, canonical.
- Header nav already leads with UK AI Energy Index; header CTA exists.
- Homepage already has an indicator strip and an index preview section.

So the gap is positioning, hierarchy and the citation/subscription/article-linking layer — not a rebuild of the data model.

## What I will change

### 1. Homepage hierarchy (Phase 3 of your sequence, done first because it's the visible gap)
- New hero copy and buttons exactly as specified: headline "Tracking the energy impact of artificial intelligence in the UK", supporting line about the index, primary "Explore the UK AI Energy Index" → `/uk-ai-energy-index`, secondary "Read the latest analysis" → `/blog`.
- Replace the current indicator strip **and** the lower index-preview section with one "Latest Index" panel directly under the hero (removing the duplication that exists today). It shows: current edition/update period, publication status, the three sub-indices with one headline finding each, verified values only, change vs previous comparable period **only where a previous comparable datapoint exists in the record**, then "View the full index", "Read the methodology", "View sources", and a "Get UK AI Energy Index updates" email CTA.
- Reorder the rest: Latest Index → Latest analysis → Data centres → Tools → Reports → News → signup. Intelligence Hubs card block is demoted below analysis (kept, not deleted).

### 2. Main index page (Phase 2)
- Reorder to put evidence above introductory copy: summary + last-verified date → three sub-index cards with headline findings → key findings → data/charts → changes since previous edition → regional evidence → outlook → methodology/definitions/sources/limitations/revision history → citation & share → related analysis → subscribe.
- Add a citation and share block: "Copy citation" (`AI Energy Intelligence, UK AI Energy Index, [edition], version [n], accessed [date]`), "Copy link", social share, using the existing `ShareButtons` component where it fits.
- SEO title becomes "UK AI Energy Index: Data Centres, Electricity Demand and Grid Pressure" with a matching description; canonical and sitemap entry checked for duplicates.

### 3. Sub-index pages
- Each of the three keeps its existing route and content; I add the same headline-finding header, citation line, and "Get UK AI Energy Index updates" CTA so the three read as one publication.
- No new indicators or values invented. Where the brief lists a metric we hold no verified source for (for example AI-attributable demand, peak-power requirements, connection-queue counts), the page states the specific "Insufficient evidence" wording from your brief rather than showing a number.

### 4. Article linkage (Phase 4)
- Add a "UK AI Energy Index" context panel to blog/news article pages that maps the article's existing research pillar to a sub-index and links back to it, plus related index analysis. Uses the pillar field already on `blog_posts`; articles with no mapping show nothing rather than a guessed link.

### 5. Navigation (Phase 3)
- Header becomes: UK AI Energy Index · Analysis · Data Centres · Grid & Infrastructure · Reports · About. "Home" moves to the logo only; Tools moves under Data Centres/Analysis groupings in the footer and hub pages so no page is orphaned. Sub-indices stay inside the index, not in the top menu.
- I will record every route/nav change in a short changelog file.

### 6. Subscription
- One shared "Get UK AI Energy Index updates" component (existing lead-capture plumbing, existing Brevo list) placed on homepage, index, sub-indices, relevant articles and reports. Copy states what subscribers receive; no frequency promise.

## Explicitly not doing
- No composite index score — there is no published methodology for one.
- No invented values, trends, percentage changes, projections or update dates. Change-vs-previous only renders where two comparable records exist.
- No re-verification pass of every existing source link in this phase; that's a data task I'll run separately and report on, rather than silently marking things verified.

## Technical notes
Work is front-end plus one small server-function addition to fetch previous-comparable datapoints and edition metadata in a single call for the homepage panel. No schema migration is required — the fields in your data-model list already exist on `index_datapoints`.
