# Architecture decisions

- Published data-centre rows use the shared `publishedDcProjectsQueryOptions` query so public project counts use one definition and cache key.
- Reality Score display logic lives in `src/lib/reality-score.ts`; public views must require `rs_published` and must never select `rs_notes`.
- Commercial enquiries reuse `/api/public/leads` with source `services-enquiry` and the existing signed captcha rather than adding a separate data store.