# Reposition the site around the Real Pipeline

## What will change

- Replace the homepage hero copy and actions exactly as supplied, then reduce the homepage to pipeline-focused content plus the monthly Real Pipeline signup. Existing Index, tools, reports, analysis, and news pages stay live but leave the homepage.
- Replace desktop and mobile navigation with Real Pipeline, Reality Score, AI Growth Zones, Services, and About. Update the header action, hide public sign-in links, preserve signed-in dashboard/admin access, and reorganise the footer with the requested Archive links.
- Add a reusable monthly signup block using the existing `tracker-updates` lead and Brevo-list flow, with consent and unsubscribe behaviour unchanged. Place it below the homepage hero and on the tracker; the header action will jump to the homepage signup.
- Surface published Reality Scores in the tracker: public-safe fields only, a band filter, highest-score sort, list badges, and a project detail panel. Unpublished scores will read “Not yet scored”; private notes remain excluded.
- Add `/reality-score` with the supplied scoring rules, bands, supplier meanings, independence statement, and correction link.
- Add `/services` with the three supplied offers and a captcha-protected enquiry form that writes to the existing leads flow as `services-enquiry`, emails both parties through the existing enquiry handling, and shows a confirmation state.
- Update the top of About, Peter Flynn’s role/email, the editorial-team role list, the Brevo sender address, contact enquiry options, and the two requested footer removals.
- Make homepage, Data Centres, and tracker project counts use the same published-project query and the same facility-count definition, while leaving every existing URL available.

## Technical details

- Extend the existing public project projection and `DcProject` type with all Reality Score fields except `rs_notes`; rendering will additionally require `rs_published === true`.
- Reuse a shared TanStack Query definition for published tracker rows so count displays cannot drift between the three requested pages.
- Add route-specific title, description, Open Graph, Twitter card, canonical, and breadcrumb metadata to the two new pages.
- Extend `/api/public/leads` validation for `services-enquiry` and require the existing signed captcha for that source; no database migration or data update will be made.
- Preserve the established navy/electric-blue visual system and existing page shells. Verify the build, the two new routes, responsive navigation, score states/filter/sort, signup submission UI, service-form captcha flow, and matching counts.

## Scope safeguards

- No existing route will be deleted or redirected.
- No database schema or project records will be changed.
- No score notes will be exposed publicly.
- The £100bn statement is user-supplied homepage copy; no additional figures or claims will be introduced.
