# Priority 1 — Navigation and homepage reorganisation

Audit first, then the proposed structure. No code changed yet.

## 1. Current navigation

Desktop + mobile header (`src/components/SiteChrome.tsx`), 8 items plus a button:
Home · Hub · AI Tools · Reports · Free Guide · Energy Index · News · Analysis & Research, plus "Open calculators" button, Sign in, Admin.

Footer already carries: Free Guide, AI Energy, UK Grid, Data Centres, Future Scenarios, Analysis & Research, News, UK AI Energy Index, Reports, About, Contact, Editorial team, Editorial standards, Corrections, Research methodology, AI use & conflicts, Terms, Refunds, Privacy, Cookie preferences.

Note: "Data Centres" is currently **not** in the header at all — only in the footer.

## 2. Proposed navigation

Six primary items: Home · UK AI Energy Index · Research (dropdown) · Data Centres · Tools · Reports.
One header CTA: "Get the Free UK AI Energy Report".
Removed from header: Hub, Free Guide, News, Analysis & Research, "Open calculators" (all pages kept).

## 3. Route mapping

| Menu item | Destination | Status |
|---|---|---|
| Home | `/` | exists |
| UK AI Energy Index | `/uk-ai-energy-index` | exists |
| Research › Latest Analysis | `/blog` | exists |
| Research › UK AI Energy News | `/news` | exists |
| Research › AI & Electricity Demand | `/research/electricity-demand` | new filtered page |
| Research › Grid & Infrastructure | `/research/grid-infrastructure` | new filtered page |
| Research › Policy & Investment | `/research/policy-investment` | new filtered page |
| Data Centres | `/data-centres` | exists (currently a thin tools-only hub — will be expanded) |
| Tools | `/tools` | exists |
| Reports | `/reports` | exists |
| Header CTA | `/guides/ai-electricity-cost-calculator` (working lead-capture form) | exists |

### Why three new research pages
Published analysis carries only three categories today (Data Centres, AI & Energy, AI & Energy Efficiency), so no existing page matches "Grid & Infrastructure" or "Policy & Investment". Each new page is a **filtered view over existing blog posts + existing news items** using the category vocabulary already in the database — no new articles, no duplicated content, no placeholder cards. `/research/$topic` will be one shared route.

If a topic returns nothing at all, the page shows the genuine empty state and a link to `/blog` and `/news` rather than filler.

`/research` itself already 301-redirects to `/blog`; that stays.

## 4. Homepage changes

| Current section | Action |
|---|---|
| Hero (2 CTAs + metric ledger) | Retain design; new H1 "UK AI Energy Intelligence", new standfirst, CTAs become "Explore the UK AI Energy Index" and "Read the Latest Research". Metric ledger removed (hard-coded "+500%" / "~400 GW" figures are unsourced). |
| — | **Add** Latest UK AI Energy Index figures (live from the index framework, real published datapoints only) |
| "Three hubs of AI energy intelligence" | Remove (duplicates Tools) |
| "Latest analysis" (blog grid) | Keep, rename to "Latest Analysis", move up |
| "Latest AI Energy Research" promo card | Remove — it duplicates the section above and its buttons link off-site to the homepage itself |
| — | **Add** Data centre overview linking `/uk-data-centre-tracker` and `/data-centres` |
| Featured tools (6) | Keep, cut to 3 |
| Latest reports (2 hard-coded, both pointing at the same guide) | Replace with 3 real reports from the reports library |
| — | **Add** Latest news (3 most recent items) |
| Newsletter / free report | Keep, moves to the end |

Final order: Hero → Index figures → Latest Analysis → Data centres → 3 tools → 3 reports → 3 news → signup → footer.

## 5. Footer

Add About, Contact, Privacy, Cookie preferences, Terms, Editorial standards, Corrections (most already present — I will group them, not duplicate them). The Hub link is relabelled **"Our Specialist Network"** in the footer; `/hub` route and page untouched.

## 6. Redirects

None required — no existing URL changes. The only new URLs are the three `/research/*` topic pages, which get canonical tags, sitemap entries, and `noindex` if a topic has no content.

## 7. Blockers / things to confirm

- **No missing destinations.** The free-guide page has a working lead-capture form, so the CTA keeps its intended label.
- The homepage index-figures section will only render figures already published in the UK AI Energy Index (currently a small evidence-based set); where a figure is absent it shows "Insufficient evidence", never an invented number.
- Data Centres landing page will be assembled purely from existing trackers, growth zones, reports, blog posts and news.

Approve and I'll implement, test every link at desktop/tablet/mobile widths, and publish.
