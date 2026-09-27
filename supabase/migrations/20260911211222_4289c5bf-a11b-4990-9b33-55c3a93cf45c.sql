UPDATE public.index_subindices
SET status_label = 'Initial baseline published — coverage expanding',
    period_label = 'Autumn 2024',
    last_reviewed_at = DATE '2026-09-11',
    direction = 'unknown',
    intro = 'The initial baseline covers Great Britain''s colocation data-centre IT capacity. Project coverage is expanding. Growth will be calculated when comparable readings are available.'
WHERE slug = 'data-centre-growth';

UPDATE public.index_datapoints d
SET reviewed_at = DATE '2026-09-11'
FROM public.index_indicators i
WHERE i.id = d.indicator_id
  AND (i.slug = 'gb-colocation-data-centre-capacity' OR i.slug LIKE 'colocation-it-capacity-%')
  AND d.status = 'published';

INSERT INTO public.index_change_log (entity_type, field_name, reason, changed_by_label, is_public)
VALUES ('subindex', 'status_label',
        'DSIT "Estimate of Data Centre Capacity: Great Britain 2024" (published 1 May 2025) re-checked at source on 11 September 2026. GB total 1.6 GW and all eleven regional IT power figures confirmed unchanged; Autumn 2024 reporting period retained. Data Centre Growth Index status moved from "Baseline in development" to "Initial baseline published — coverage expanding".',
        'AI Energy Intelligence editorial review', true);