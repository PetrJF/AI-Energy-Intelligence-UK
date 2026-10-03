-- Tracker corrections from the 3 October 2026 research review.
-- Confirmed corrections only, each logged publicly in index_change_log.
-- Safe to run more than once: summaries are replaced (not appended), the status change only
-- applies while the record is still 'approved', empty fields are only filled if empty,
-- sources are appended only if the URL is not already present, and log rows are not duplicated.

DO $$
DECLARE missing text;
BEGIN
  SELECT string_agg(s, ', ') INTO missing
  FROM unnest(ARRAY['microsoft-newport-imperial-park', 'nscale-loughton', 'dc01uk-south-mimms', 'north-east-ai-growth-zone', 'cambois-data-centre-campus', 'lanarkshire-ai-growth-zone']) AS s
  WHERE NOT EXISTS (SELECT 1 FROM public.dc_projects p WHERE p.slug = s);
  IF missing IS NOT NULL THEN
    RAISE EXCEPTION 'dc_projects slugs not found: %', missing;
  END IF;
END $$;


-- microsoft-newport-imperial-park
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', p.id, 'status', 'approved', 'under_construction', 'Construction has started. Trade & Invest Wales (Welsh Government, 13 July 2026) reports "spades are in the ground" at Imperial Park, and Senedd Research''s July 2026 briefing describes Microsoft''s Newport site as under construction.', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects p WHERE p.slug = 'microsoft-newport-imperial-park' AND p.status = 'approved'
  AND NOT EXISTS (SELECT 1 FROM public.index_change_log l WHERE l.entity_id = p.id AND l.field_name = 'status' AND l.new_value = 'under_construction');
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', p.id, 'summary', 'Approval-stage summary', 'Construction start and jobs added', 'Summary updated to record that construction is under way, with about 750 construction jobs and 200 permanent roles (Trade & Invest Wales, July 2026). The earlier figure of about 120 jobs was reported at approval.', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects p WHERE p.slug = 'microsoft-newport-imperial-park'
  AND NOT EXISTS (SELECT 1 FROM public.index_change_log l WHERE l.entity_id = p.id AND l.field_name = 'summary' AND l.new_value = 'Construction start and jobs added');
UPDATE public.dc_projects SET status = 'under_construction' WHERE slug = 'microsoft-newport-imperial-park' AND status = 'approved';
UPDATE public.dc_projects SET
  summary = 'Microsoft''s datacentre on the former Quinn Radiators factory site at Celtic Way, Imperial Park, Newport (application 24/0006). Newport City Council''s planning committee unanimously approved demolition of the remaining buildings and two data centre buildings with diesel backup generators on 3 July 2024; Microsoft agreed a £104,000 walking and cycling contribution. Construction is under way: the Welsh Government''s Trade & Invest Wales reported in July 2026 that "spades are in the ground", with around 750 construction jobs and 200 permanent roles expected, and Senedd Research (July 2026) describes the site as under construction. Senedd Research puts the planned site at around 200 MW IT load; the planning papers give no MW figure. The site is separate from the Vantage (former NGD) campus at Imperial Park.',
  last_verified_at = DATE '2026-10-03'
WHERE slug = 'microsoft-newport-imperial-park';
UPDATE public.dc_projects SET sources = COALESCE(sources, '[]'::jsonb) || '[{"title": "Microsoft", "url": "https://tradeandinvest.wales/inside-story/microsoft", "publisher": "Trade & Invest Wales (Welsh Government)", "date": "2026-07-13"}]'::jsonb
WHERE slug = 'microsoft-newport-imperial-park' AND NOT (COALESCE(sources, '[]'::jsonb) @> '[{"url": "https://tradeandinvest.wales/inside-story/microsoft"}]'::jsonb);
UPDATE public.dc_projects SET sources = COALESCE(sources, '[]'::jsonb) || '[{"title": "Data centres in Wales", "url": "https://research.senedd.wales/media/eytgh5cx/data-centres-in-wales.pdf", "publisher": "Senedd Research", "date": "2026-07"}]'::jsonb
WHERE slug = 'microsoft-newport-imperial-park' AND NOT (COALESCE(sources, '[]'::jsonb) @> '[{"url": "https://research.senedd.wales/media/eytgh5cx/data-centres-in-wales.pdf"}]'::jsonb);

-- nscale-loughton
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', p.id, 'investment_gbp', NULL, '2000000000', 'The Telegraph (5 July 2026) values the Loughton data centre, co-developed with Microsoft, at £2bn. The record previously showed no investment figure.', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects p WHERE p.slug = 'nscale-loughton'
  AND NOT EXISTS (SELECT 1 FROM public.index_change_log l WHERE l.entity_id = p.id AND l.field_name = 'investment_gbp' AND l.new_value = '2000000000');
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', p.id, 'summary', 'Grid-delay summary', 'Capacity, GPUs, approval month and timetable added', 'Summary now gives the published 50 MW initial / 90 MW maximum capacity and 23,040 GPUs (Nscale, 16 September 2025), the June 2026 approval of the revised scheme (Telegraph), and the move to a Q2 2027 opening before the grid delay (Politico).', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects p WHERE p.slug = 'nscale-loughton'
  AND NOT EXISTS (SELECT 1 FROM public.index_change_log l WHERE l.entity_id = p.id AND l.field_name = 'summary' AND l.new_value = 'Capacity, GPUs, approval month and timetable added');
UPDATE public.dc_projects SET
  investment_gbp = COALESCE(investment_gbp, 2000000000),
  summary = 'Nscale''s Loughton, Essex site was named by government as the UK''s largest sovereign AI supercomputer, with Microsoft as anchor customer for Azure services. Nscale''s September 2025 announcement gives 50 MW initially, scalable to 90 MW, housing 23,040 NVIDIA GB300 GPUs; the Telegraph values the scheme at £2bn. Epping Forest District Council approved the revised, larger scheme in June 2026, after the investment minister, Lord Stockwood, wrote to the council expressing government support. The opening was moved from 2026 to Q2 2027 (Politico, April 2026). The Guardian reported on 24 September 2026 that UK Power Networks has told Nscale it cannot supply the requested 90 MW until the early-to-mid 2030s; Nscale is looking at on-site generation.',
  last_verified_at = DATE '2026-10-03'
WHERE slug = 'nscale-loughton';
UPDATE public.dc_projects SET sources = COALESCE(sources, '[]'::jsonb) || '[{"title": "Nscale announces UK AI infrastructure commitment", "url": "https://www.nscale.com/press-releases/nscale-uk-ai-infrastructure-announcement", "publisher": "Nscale", "date": "2025-09-16"}]'::jsonb
WHERE slug = 'nscale-loughton' AND NOT (COALESCE(sources, '[]'::jsonb) @> '[{"url": "https://www.nscale.com/press-releases/nscale-uk-ai-infrastructure-announcement"}]'::jsonb);
UPDATE public.dc_projects SET sources = COALESCE(sources, '[]'::jsonb) || '[{"title": "Labour pressured council to back giant AI data centre", "url": "https://www.telegraph.co.uk/business/2026/07/05/labour-pressured-local-council-to-back-giant-ai-data-centr/", "publisher": "The Telegraph", "date": "2026-07-05"}]'::jsonb
WHERE slug = 'nscale-loughton' AND NOT (COALESCE(sources, '[]'::jsonb) @> '[{"url": "https://www.telegraph.co.uk/business/2026/07/05/labour-pressured-local-council-to-back-giant-ai-data-centr/"}]'::jsonb);
UPDATE public.dc_projects SET sources = COALESCE(sources, '[]'::jsonb) || '[{"title": "OpenAI puts ''Stargate UK'' on hold in blow to Britain''s AI ambitions", "url": "https://www.politico.eu/article/openai-stargate-uk-pause-setback-britain-ai-ambitions/", "publisher": "Politico Europe", "date": "2026-04-08"}]'::jsonb
WHERE slug = 'nscale-loughton' AND NOT (COALESCE(sources, '[]'::jsonb) @> '[{"url": "https://www.politico.eu/article/openai-stargate-uk-pause-setback-britain-ai-ambitions/"}]'::jsonb);
UPDATE public.dc_projects SET sources = COALESCE(sources, '[]'::jsonb) || '[{"title": "UK''s biggest AI supercomputer may have to wait until 2030s for enough power", "url": "https://www.euronews.com/2026/09/29/uks-biggest-ai-supercomputer-may-have-to-wait-until-2030s-for-enough-power", "publisher": "Euronews", "date": "2026-09-29"}]'::jsonb
WHERE slug = 'nscale-loughton' AND NOT (COALESCE(sources, '[]'::jsonb) @> '[{"url": "https://www.euronews.com/2026/09/29/uks-biggest-ai-supercomputer-may-have-to-wait-until-2030s-for-enough-power"}]'::jsonb);

-- dc01uk-south-mimms
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', p.id, 'summary', 'Sale-only summary', 'Equinix timetable added', 'Equinix''s Hertfordshire Campus FAQ (August 2026) states construction from 2027 and opening in 2031, not 2030, tied to the National Grid connection date, plus first reserved matters submitted, a £3.9bn investment and about 2,500 construction jobs. The record''s 2029 grid-connection note and 500 construction-jobs figure should be read against this operator statement.', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects p WHERE p.slug = 'dc01uk-south-mimms'
  AND NOT EXISTS (SELECT 1 FROM public.index_change_log l WHERE l.entity_id = p.id AND l.field_name = 'summary' AND l.new_value = 'Equinix timetable added');
UPDATE public.dc_projects SET
  summary = 'Outline permission granted by Hertsmere Borough Council (committee resolution 23 January 2025). The council cites 87,000 sq m of floorspace; no IT-load figure has been verified. DC01UK announced the sale of the 85-acre site to Equinix on 30 October 2025, confirmed by Equinix''s adviser, BNP Paribas Real Estate; Equinix has renamed it the Hertfordshire Campus and states a £3.9bn investment. Equinix says it has submitted its first reserved matters and discharge-of-condition applications, expects construction to begin in 2027 and the campus to open in 2031, later than the 2030 date previously publicised by DC01UK, because of when the National Grid connection will be available. Equinix expects around 2,500 construction jobs and over 200 permanent roles.',
  last_verified_at = DATE '2026-10-03'
WHERE slug = 'dc01uk-south-mimms';
UPDATE public.dc_projects SET sources = COALESCE(sources, '[]'::jsonb) || '[{"title": "Hertfordshire Campus: Frequently asked questions", "url": "https://equinixtogether.com/hertfordshire/frequently-asked-questions/", "publisher": "Equinix", "date": "2026-08-14"}]'::jsonb
WHERE slug = 'dc01uk-south-mimms' AND NOT (COALESCE(sources, '[]'::jsonb) @> '[{"url": "https://equinixtogether.com/hertfordshire/frequently-asked-questions/"}]'::jsonb);

-- north-east-ai-growth-zone
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', p.id, 'operator', 'Blackstone (via QTS) at Blyth; Stargate UK (OpenAI, Nvidia, Nscale) at Cobalt Park', 'Blackstone (via QTS) at Blyth; Stargate UK (OpenAI, Nvidia, Nscale) at Cobalt Park, paused April 2026', 'The operator field still presented Stargate UK as an active operator. OpenAI paused Stargate UK on 9 April 2026 (BBC; Reuters).', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects p WHERE p.slug = 'north-east-ai-growth-zone'
  AND NOT EXISTS (SELECT 1 FROM public.index_change_log l WHERE l.entity_id = p.id AND l.field_name = 'operator' AND l.new_value = 'Blackstone (via QTS) at Blyth; Stargate UK (OpenAI, Nvidia, Nscale) at Cobalt Park, paused April 2026');
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', p.id, 'summary', 'Stargate UK "will deploy"', 'Pause and Cobalt Park position stated', 'The summary said Stargate UK "will deploy" compute at Cobalt Park. It now records the April 2026 pause and that no planning applications or construction existed at Cobalt Park at that point (Computer Weekly, 10 April 2026).', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects p WHERE p.slug = 'north-east-ai-growth-zone'
  AND NOT EXISTS (SELECT 1 FROM public.index_change_log l WHERE l.entity_id = p.id AND l.field_name = 'summary' AND l.new_value = 'Pause and Cobalt Park position stated');
UPDATE public.dc_projects SET
  operator = 'Blackstone (via QTS) at Blyth; Stargate UK (OpenAI, Nvidia, Nscale) at Cobalt Park, paused April 2026',
  summary = 'UK''s second AI Growth Zone, announced on 16 September 2025 alongside the UK-US Tech Prosperity Deal and anchored at Cobalt Park (North Tyneside) and Blyth (Northumberland). Stargate UK, a partnership of OpenAI, Nvidia and British firm Nscale, was to deploy sovereign AI compute at Cobalt Park, starting with up to 8,000 GPUs and scaling to 31,000. OpenAI paused Stargate UK on 9 April 2026, citing energy costs and regulation, and says it will proceed when conditions allow; at that point no planning applications had been lodged and no construction had begun at Cobalt Park, which hosts about 35 MW of existing data centre capacity (Computer Weekly). At Blyth, Blackstone''s QTS is building its £10bn Cambois campus, where enabling works began in October 2025. Government says the designation creates headroom for a further £20bn from other partners.',
  last_verified_at = DATE '2026-10-03'
WHERE slug = 'north-east-ai-growth-zone';
UPDATE public.dc_projects SET sources = COALESCE(sources, '[]'::jsonb) || '[{"title": "OpenAI pauses UK investment deal over energy costs and regulation", "url": "https://www.bbc.com/news/articles/clyd032ej70o", "publisher": "BBC News", "date": "2026-04-09"}]'::jsonb
WHERE slug = 'north-east-ai-growth-zone' AND NOT (COALESCE(sources, '[]'::jsonb) @> '[{"url": "https://www.bbc.com/news/articles/clyd032ej70o"}]'::jsonb);
UPDATE public.dc_projects SET sources = COALESCE(sources, '[]'::jsonb) || '[{"title": "OpenAI ''pauses'' Stargate UK: Sudden setback or calculated move?", "url": "https://www.computerweekly.com/news/366641483/OpenAI-pauses-Stargate-UK-Sudden-setback-or-calculated-move", "publisher": "Computer Weekly", "date": "2026-04-10"}]'::jsonb
WHERE slug = 'north-east-ai-growth-zone' AND NOT (COALESCE(sources, '[]'::jsonb) @> '[{"url": "https://www.computerweekly.com/news/366641483/OpenAI-pauses-Stargate-UK-Sudden-setback-or-calculated-move"}]'::jsonb);

-- cambois-data-centre-campus
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', p.id, 'investment_gbp', NULL, '10000000000', 'QTS states the Cambois campus represents an investment of up to £10bn; the figure appeared only in a source title, not in the investment field.', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects p WHERE p.slug = 'cambois-data-centre-campus'
  AND NOT EXISTS (SELECT 1 FROM public.index_change_log l WHERE l.entity_id = p.id AND l.field_name = 'investment_gbp' AND l.new_value = '10000000000');
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', p.id, 'summary', 'Earthworks summary', 'Delivery timetable added', 'QTS''s 2026 application to vary the outline permission schedules data centres 1-2 to start construction later in 2026 and operate from 2029, with four buildings by 2030 (Business Northumberland, 20 May 2026).', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects p WHERE p.slug = 'cambois-data-centre-campus'
  AND NOT EXISTS (SELECT 1 FROM public.index_change_log l WHERE l.entity_id = p.id AND l.field_name = 'summary' AND l.new_value = 'Delivery timetable added');
UPDATE public.dc_projects SET
  investment_gbp = COALESCE(investment_gbp, 10000000000),
  summary = 'Outline planning permission, with all matters reserved, granted by Northumberland County Council on 8 May 2025 for up to ten Class B8 data centre buildings totalling up to 540,000 sqm gross internal area, plus a substation, emergency generators and ancillary structures. The council committee report states approximately 72 MW of IT capacity per building, about 720 MW across the full campus; this is recorded as IT load. QTS, owned by funds managed by Blackstone, states an investment of up to £10bn. Initial earthworks began in October 2025 and reserved matters for phase 1 were approved in December 2025, so the project is recorded as under construction. In 2026 QTS applied to vary the outline permission to speed delivery: construction of data centres 1 and 2 is scheduled to start later in 2026 with operations from 2029, and four of the ten buildings are targeted for 2030.',
  last_verified_at = DATE '2026-10-03'
WHERE slug = 'cambois-data-centre-campus';
UPDATE public.dc_projects SET sources = COALESCE(sources, '[]'::jsonb) || '[{"title": "Cambois", "url": "https://q.com/data-centers/cambois/", "publisher": "QTS", "date": "2026-07-01"}]'::jsonb
WHERE slug = 'cambois-data-centre-campus' AND NOT (COALESCE(sources, '[]'::jsonb) @> '[{"url": "https://q.com/data-centers/cambois/"}]'::jsonb);
UPDATE public.dc_projects SET sources = COALESCE(sources, '[]'::jsonb) || '[{"title": "QTS applies to speed up £10bn UK data centre delivery", "url": "https://www.businessnorthumberland.co.uk/qts-applies-to-speed-up-10bn-uk-data-centre-delivery/", "publisher": "Business Northumberland", "date": "2026-05-20"}]'::jsonb
WHERE slug = 'cambois-data-centre-campus' AND NOT (COALESCE(sources, '[]'::jsonb) @> '[{"url": "https://www.businessnorthumberland.co.uk/qts-applies-to-speed-up-10bn-uk-data-centre-delivery/"}]'::jsonb);

-- lanarkshire-ai-growth-zone
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', p.id, 'local_authority', NULL, 'North Lanarkshire Council', 'Local authority was blank. The zone centres on DataVita''s Chapelhall/Airdrie campus in North Lanarkshire; DataVita''s DV4 application is with North Lanarkshire Council (Data Centre Review, September 2026).', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects p WHERE p.slug = 'lanarkshire-ai-growth-zone'
  AND NOT EXISTS (SELECT 1 FROM public.index_change_log l WHERE l.entity_id = p.id AND l.field_name = 'local_authority' AND l.new_value = 'North Lanarkshire Council');
UPDATE public.dc_projects SET
  local_authority = COALESCE(local_authority, 'North Lanarkshire Council'),
  last_verified_at = DATE '2026-10-03'
WHERE slug = 'lanarkshire-ai-growth-zone';
UPDATE public.dc_projects SET sources = COALESCE(sources, '[]'::jsonb) || '[{"title": "DataVita submits £850m DV4 plans in Scotland''s first AI Growth Zone", "url": "https://datacentrereview.com/2026/09/datavita-submits-850m-dv4-plans-in-scotlands-first-ai-growth-zone/", "publisher": "Data Centre Review", "date": "2026-09-07"}]'::jsonb
WHERE slug = 'lanarkshire-ai-growth-zone' AND NOT (COALESCE(sources, '[]'::jsonb) @> '[{"url": "https://datacentrereview.com/2026/09/datavita-submits-850m-dv4-plans-in-scotlands-first-ai-growth-zone/"}]'::jsonb);

-- Check: should show microsoft-newport-imperial-park as under_construction
SELECT slug, status, operator, local_authority, investment_gbp, last_verified_at
FROM public.dc_projects WHERE slug IN ('microsoft-newport-imperial-park', 'nscale-loughton', 'dc01uk-south-mimms', 'north-east-ai-growth-zone', 'cambois-data-centre-campus', 'lanarkshire-ai-growth-zone') ORDER BY slug;
