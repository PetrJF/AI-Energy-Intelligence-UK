
INSERT INTO public.index_subindices (slug, name, intro, status_label, score, direction, period_label, display_order, status)
VALUES
  ('electricity-demand', 'AI Electricity Demand Index',
   'The electricity required to support AI and data-centre activity in the UK: consumption, share of national demand, growth rates and published forecasts.',
   'Baseline in development', NULL, 'unknown', NULL, 1, 'published'),
  ('data-centre-growth', 'Data Centre Growth Index',
   'The physical build-out of UK data centre capacity: operational sites, construction, approvals and proposals, with capacity recorded only where it is disclosed.',
   'Baseline in development', NULL, 'unknown', NULL, 2, 'published'),
  ('grid-pressure', 'Grid Pressure Index',
   'Whether regional electricity networks can accommodate new data-centre load, based on published connection, constraint and reinforcement evidence.',
   'Baseline in development', NULL, 'unknown', NULL, 3, 'published')
ON CONFLICT (slug) DO UPDATE
  SET name = EXCLUDED.name,
      intro = EXCLUDED.intro,
      status = 'published';

UPDATE public.index_indicators SET subindex_id = (SELECT id FROM public.index_subindices WHERE slug = 'electricity-demand')
WHERE slug IN ('ai-attributable-electricity-demand', 'uk-data-centre-electricity-demand', 'data-centre-energy-efficiency');

UPDATE public.index_indicators SET subindex_id = (SELECT id FROM public.index_subindices WHERE slug = 'data-centre-growth')
WHERE slug IN ('announced-data-centre-capacity');

UPDATE public.index_indicators SET subindex_id = (SELECT id FROM public.index_subindices WHERE slug = 'grid-pressure')
WHERE slug IN ('grid-connection-queue');
