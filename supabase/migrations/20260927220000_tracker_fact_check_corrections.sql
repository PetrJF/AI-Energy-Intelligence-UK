-- Tracker corrections from the 27 September 2026 fact-check.
-- Confirmed corrections only: regions, statuses, operator/developer names,
-- published capacity figures, and summaries that contradicted the record's own
-- capacity fields. Every change is logged publicly in index_change_log.
-- Idempotent: sources are appended only when the URL is not already present,
-- and developer/operator names only fill empty fields (except DC01UK -> Equinix).

DO $$
DECLARE missing text;
BEGIN
  SELECT string_agg(s, ', ') INTO missing
  FROM unnest(ARRAY['dc01uk-south-mimms', 'kao-data-harlow-plot-f', 'northtree-hemel-hempstead', 'aws-maylands-avenue-hemel', 'atlantic-hub-foyle-port', 'cambois-data-centre-campus', 'manor-farm-poyle-road-slough', 'virtus-london1-enfield', 'tudor-works-hayes-data-centre-campus', 'datavita-dv3-chapelhall', 'rover-way-energy-park-data-centre-cardiff', 'vantage-bridgend', 'hayes-bridge-heathrow-interchange-data-centre-campus', 'kao-data-stockport', 'edinburgh-redheughs-avenue', 'north-wales-ai-growth-zone', 'premier-park-park-royal', 'whites-reclamation-eccles-data-centre', 'haspielaw-farm-hamilton', 'bedford-ampthill-road-campus']) AS s
  WHERE NOT EXISTS (SELECT 1 FROM public.dc_projects p WHERE p.slug = s);
  IF missing IS NOT NULL THEN
    RAISE EXCEPTION 'dc_projects slugs not found: %', missing;
  END IF;
END $$;

-- dc01uk-south-mimms
UPDATE public.dc_projects SET
  region = 'East of England',
  index_region_slug = CASE WHEN index_region_slug = 'south-east-england' THEN NULL ELSE index_region_slug END,
  operator = 'Equinix',
  developer = COALESCE(developer, 'DC01UK'),
  summary = 'Outline permission only. The council cites 87,000 sq m of floorspace; no IT-load or grid-connection figure has been verified. DC01UK announced the sale of the 85-acre site to Equinix on 30 October 2025, and the transaction was confirmed by Equinix''s adviser, BNP Paribas Real Estate.',
  last_verified_at = DATE '2026-09-27'
WHERE slug = 'dc01uk-south-mimms';
UPDATE public.dc_projects SET sources = COALESCE(sources, '[]'::jsonb) || '[{"title": "DC01UK delivers major UK infrastructure deal with landmark sale", "url": "https://dc01uk.com/news/dc01uk-delivers-major-uk-infrastructure-deal-with-landmark-sale/", "publisher": "DC01UK", "date": "2025-10-30"}]'::jsonb
WHERE slug = 'dc01uk-south-mimms' AND NOT (COALESCE(sources, '[]'::jsonb) @> '[{"url": "https://dc01uk.com/news/dc01uk-delivers-major-uk-infrastructure-deal-with-landmark-sale/"}]'::jsonb);
UPDATE public.dc_projects SET sources = COALESCE(sources, '[]'::jsonb) || '[{"title": "Advisors on landmark £3.9 billion UK data centre investment", "url": "https://www.realestate.bnpparibas.co.uk/advisors-landmark-ps39-billion-uk-data-centre-investment", "publisher": "BNP Paribas Real Estate"}]'::jsonb
WHERE slug = 'dc01uk-south-mimms' AND NOT (COALESCE(sources, '[]'::jsonb) @> '[{"url": "https://www.realestate.bnpparibas.co.uk/advisors-landmark-ps39-billion-uk-data-centre-investment"}]'::jsonb);
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', id, 'region', 'South East', 'East of England', 'DC01UK, South Mimms is in Hertsmere, Hertfordshire, which is in the East of England region, not the South East. Region corrected; the project now counts under East of England in the area table and regional hubs.', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects WHERE slug = 'dc01uk-south-mimms';
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', id, 'operator', NULL, 'Equinix', 'DC01UK announced the sale of the South Mimms site to Equinix on 30 October 2025, confirmed by BNP Paribas Real Estate. Operator updated; the summary no longer describes the sale as unverified.', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects WHERE slug = 'dc01uk-south-mimms';

-- kao-data-harlow-plot-f
UPDATE public.dc_projects SET
  region = 'East of England',
  index_region_slug = CASE WHEN index_region_slug = 'south-east-england' THEN NULL ELSE index_region_slug END,
  last_verified_at = DATE '2026-09-27'
WHERE slug = 'kao-data-harlow-plot-f';
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', id, 'region', 'South East', 'East of England', 'Kao Data Harlow, Plot F is in Harlow, Essex, which is in the East of England region, not the South East. Region corrected; the project now counts under East of England in the area table and regional hubs.', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects WHERE slug = 'kao-data-harlow-plot-f';

-- northtree-hemel-hempstead
UPDATE public.dc_projects SET
  region = 'East of England',
  index_region_slug = CASE WHEN index_region_slug = 'south-east-england' THEN NULL ELSE index_region_slug END,
  last_verified_at = DATE '2026-09-27'
WHERE slug = 'northtree-hemel-hempstead';
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', id, 'region', 'South East', 'East of England', '45 Maylands Avenue, Hemel Hempstead is in Dacorum, Hertfordshire, which is in the East of England region, not the South East. Region corrected; the project now counts under East of England in the area table and regional hubs.', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects WHERE slug = 'northtree-hemel-hempstead';

-- aws-maylands-avenue-hemel
UPDATE public.dc_projects SET
  region = 'East of England',
  index_region_slug = CASE WHEN index_region_slug = 'south-east-england' THEN NULL ELSE index_region_slug END,
  last_verified_at = DATE '2026-09-27'
WHERE slug = 'aws-maylands-avenue-hemel';
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', id, 'region', 'South East', 'East of England', 'Amazon Web Services, Plot 3 Maylands Avenue is in Dacorum, Hertfordshire, which is in the East of England region, not the South East. Region corrected; the project now counts under East of England in the area table and regional hubs.', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects WHERE slug = 'aws-maylands-avenue-hemel';

-- atlantic-hub-foyle-port
UPDATE public.dc_projects SET
  summary = 'Reserved matters approval (LA11/2023/1729/RM) granted by Derry City and Strabane District Council on 9 October 2024 for one IT service and data centre building with substation compounds, generators, switchgear and transformers on land east and west of Maydown Road, Derry. The statutory planning register states no capacity. The operator, GreenScale, states that the campus has secured grid connections totalling 100 MW, which is recorded here as grid-connection capacity rather than IT load.',
  last_verified_at = DATE '2026-09-27'
WHERE slug = 'atlantic-hub-foyle-port';
UPDATE public.dc_projects SET sources = COALESCE(sources, '[]'::jsonb) || '[{"title": "GreenScale Derry/Londonderry Campus", "url": "https://greenscaledc.com/data-centres/derry-campus/", "publisher": "GreenScale"}]'::jsonb
WHERE slug = 'atlantic-hub-foyle-port' AND NOT (COALESCE(sources, '[]'::jsonb) @> '[{"url": "https://greenscaledc.com/data-centres/derry-campus/"}]'::jsonb);
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', id, 'summary', 'No capacity figure is disclosed', '100 MW grid-connection capacity explained', 'The summary said no capacity was disclosed while the record showed 100 MW of grid-connection capacity. The summary now explains that the figure comes from the operator, not the planning register.', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects WHERE slug = 'atlantic-hub-foyle-port';

-- cambois-data-centre-campus
UPDATE public.dc_projects SET
  status = 'under_construction',
  operator = COALESCE(operator, 'QTS (Blackstone)'),
  summary = 'Outline planning permission, with all matters reserved, granted by Northumberland County Council on 8 May 2025 for up to ten Class B8 data centre buildings totalling up to 540,000 sqm gross internal area, plus a substation, emergency generators and ancillary structures. The council committee report states approximately 72 MW of IT capacity per building, about 720 MW across the full campus; this is recorded as IT load. Initial earthworks began in October 2025 and reserved matters for phase 1 were approved in December 2025, so the project is recorded as under construction.',
  last_verified_at = DATE '2026-09-27'
WHERE slug = 'cambois-data-centre-campus';
UPDATE public.dc_projects SET sources = COALESCE(sources, '[]'::jsonb) || '[{"title": "Enabling works now underway for £10 billion QTS data centre campus in Northumberland", "url": "https://ridge.co.uk/news/enabling-works-now-underway-for-10-billion-qts-data-centre-campus-in-northumberland/", "publisher": "Ridge and Partners", "date": "2025-11-12"}]'::jsonb
WHERE slug = 'cambois-data-centre-campus' AND NOT (COALESCE(sources, '[]'::jsonb) @> '[{"url": "https://ridge.co.uk/news/enabling-works-now-underway-for-10-billion-qts-data-centre-campus-in-northumberland/"}]'::jsonb);
UPDATE public.dc_projects SET sources = COALESCE(sources, '[]'::jsonb) || '[{"title": "First phase of Blyth data centre construction approved", "url": "https://www.bbc.co.uk/news/articles/clyd1enx3p4o", "publisher": "BBC News", "date": "2025-12-02"}]'::jsonb
WHERE slug = 'cambois-data-centre-campus' AND NOT (COALESCE(sources, '[]'::jsonb) @> '[{"url": "https://www.bbc.co.uk/news/articles/clyd1enx3p4o"}]'::jsonb);
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', id, 'status', 'approved', 'under_construction', 'Enabling works and earthworks began in October 2025 and phase 1 reserved matters were approved in December 2025 (BBC; Ridge).', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects WHERE slug = 'cambois-data-centre-campus';
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', id, 'summary', 'no electrical capacity figure recorded', '720 MW IT load explained', 'The summary said no electrical capacity was recorded while the record showed 720 MW of IT load from the committee report. The summary now matches the figure.', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects WHERE slug = 'cambois-data-centre-campus';

-- manor-farm-poyle-road-slough
UPDATE public.dc_projects SET
  developer = COALESCE(developer, 'Manor Farm Propco Limited (Tritax Big Box REIT)'),
  summary = 'Recovered appeal (ref 3366043) allowed on 10 June 2026 by the Minister of State for Housing and Planning on behalf of the Secretary of State, granting planning permission subject to conditions. The appellant is Manor Farm Propco Limited, a subsidiary of Tritax Big Box REIT; the end operator is not identified. The decision letter and Inspector''s Report record 72 MW of proposed data-centre IT capacity, together with a co-located 100 MW battery energy storage system.',
  last_verified_at = DATE '2026-09-27'
WHERE slug = 'manor-farm-poyle-road-slough';
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', id, 'summary', 'no capacity figure is given', '72 MW IT load explained', 'The summary said the decision letter gives no capacity figure, but the decision letter and Inspector''s Report state 72 MW of IT capacity, which the record already shows. Summary corrected.', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects WHERE slug = 'manor-farm-poyle-road-slough';

-- virtus-london1-enfield
UPDATE public.dc_projects SET
  summary = 'The VIRTUS LONDON1 data centre at Trade City, Crown Road, Enfield holds Environment Agency permit EPR/PP3225SX, issued on 13 September 2023 to Enfield DC Service Company Limited and covering combustion plant on the site. The permit states no electrical capacity; the 4.3 MW IT load recorded here comes from the operator''s published LONDON1 specification sheet.',
  last_verified_at = DATE '2026-09-27'
WHERE slug = 'virtus-london1-enfield';
UPDATE public.dc_projects SET sources = COALESCE(sources, '[]'::jsonb) || '[{"title": "VIRTUS LONDON1 specification sheet", "url": "https://virtusdatacentres.com/images/2021specsheets/LONDON1_Spec_Sheet_2021_v2.pdf", "publisher": "VIRTUS Data Centres"}]'::jsonb
WHERE slug = 'virtus-london1-enfield' AND NOT (COALESCE(sources, '[]'::jsonb) @> '[{"url": "https://virtusdatacentres.com/images/2021specsheets/LONDON1_Spec_Sheet_2021_v2.pdf"}]'::jsonb);
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', id, 'summary', 'No electrical capacity is stated, so none is recorded', '4.3 MW IT load explained', 'The summary said no capacity was recorded while the record showed 4.3 MW of IT load. The summary now names the operator''s specification sheet as the source.', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects WHERE slug = 'virtus-london1-enfield';

-- tudor-works-hayes-data-centre-campus
UPDATE public.dc_projects SET
  status = 'under_construction',
  operator = COALESCE(operator, 'Colt Data Centre Services'),
  summary = 'The London Borough of Hillingdon approved application 38421/APP/2021/4045 on 26 April 2022 for redevelopment of the Tudor Works site at Beaconsfield Road, Hayes, by Colt Data Centre Services, to deliver a data centre campus of two buildings (Use Class B8) with associated energy and electricity infrastructure, plant, a security gatehouse, highway works, parking, landscaping and ancillary office use. Colt broke ground on the first building, London 4, in February 2023 and describes it as under construction with 31 MW of IT power; that operator figure is recorded here as IT load. The council register itself states no electrical capacity.',
  last_verified_at = DATE '2026-09-27'
WHERE slug = 'tudor-works-hayes-data-centre-campus';
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', id, 'status', 'approved', 'under_construction', 'Construction of Colt London 4 started in February 2023 (Colt DCS via PR Newswire) and the operator describes it as under construction.', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects WHERE slug = 'tudor-works-hayes-data-centre-campus';
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', id, 'summary', 'states no floorspace or electrical capacity, so none is recorded', '31 MW IT load explained', 'The summary said no capacity was recorded while the record showed 31 MW of IT load. The summary now names Colt''s London 4 page as the source.', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects WHERE slug = 'tudor-works-hayes-data-centre-campus';

-- datavita-dv3-chapelhall
UPDATE public.dc_projects SET
  status = 'under_construction',
  last_verified_at = DATE '2026-09-27'
WHERE slug = 'datavita-dv3-chapelhall';
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', id, 'status', 'approved', 'under_construction', 'DataVita''s c.£300m debt facility (August 2026) funds construction of DV3, and trade press reported it under construction in September 2026. The status now matches the record''s own summary.', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects WHERE slug = 'datavita-dv3-chapelhall';

-- rover-way-energy-park-data-centre-cardiff
UPDATE public.dc_projects SET
  status = 'under_construction',
  developer = COALESCE(developer, 'Latos Data Centres'),
  summary = summary || ' Latos Data Centres, which is delivering the data-centre element, stated in December 2024 that the Cardiff data centre was under construction. The associated energy park includes 1,000 MW of battery storage, which is not data-centre load.',
  last_verified_at = DATE '2026-09-27'
WHERE slug = 'rover-way-energy-park-data-centre-cardiff';
UPDATE public.dc_projects SET sources = COALESCE(sources, '[]'::jsonb) || '[{"title": "Construction work starts on major new data centre project", "url": "https://nation.cymru/news/construction-work-starts-on-major-new-data-centre-project/", "publisher": "Nation.Cymru", "date": "2024-12-03"}]'::jsonb
WHERE slug = 'rover-way-energy-park-data-centre-cardiff' AND NOT (COALESCE(sources, '[]'::jsonb) @> '[{"url": "https://nation.cymru/news/construction-work-starts-on-major-new-data-centre-project/"}]'::jsonb);
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', id, 'status', 'approved', 'under_construction', 'Latos Data Centres stated in December 2024 that the Cardiff data centre at Rover Way was under construction (Nation.Cymru).', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects WHERE slug = 'rover-way-energy-park-data-centre-cardiff';

-- vantage-bridgend
UPDATE public.dc_projects SET
  summary = 'Bridgend County Borough Council''s planning committee unanimously approved Vantage Data Centers'' hybrid application (P/25/247/HYB) in October 2025, subject to 32 conditions. The consent gives full planning permission for the first data centre on the north-eastern part of the former Ford engine plant at Waterton, and outline permission for up to nine further data centres to be built over about 15 years. No power capacity figure is stated.',
  last_verified_at = DATE '2026-09-27'
WHERE slug = 'vantage-bridgend';
UPDATE public.dc_projects SET sources = COALESCE(sources, '[]'::jsonb) || '[{"title": "Data centre campus at former Ford engine plant approved", "url": "https://oggybloggyogwr.com/2025/10/data-centre-campus-at-former-ford-engine-plant-approved/", "publisher": "Oggy Bloggy Ogwr", "date": "2025-10-06"}]'::jsonb
WHERE slug = 'vantage-bridgend' AND NOT (COALESCE(sources, '[]'::jsonb) @> '[{"url": "https://oggybloggyogwr.com/2025/10/data-centre-campus-at-former-ford-engine-plant-approved/"}]'::jsonb);
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', id, 'summary', 'Hybrid planning application submitted', 'Approved October 2025', 'The summary still described an application awaiting a decision, although the record''s status is approved. Summary updated to the October 2025 committee approval.', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects WHERE slug = 'vantage-bridgend';

-- hayes-bridge-heathrow-interchange-data-centre-campus
UPDATE public.dc_projects SET
  developer = COALESCE(developer, 'Colt Data Centre Services'),
  stated_electricity_demand_mw = 250,
  power_notes = 'The Hillingdon planning committee report states that the development requires 250 MW of power, secured through two independent National Grid connections. Recorded as a stated electrical demand, not IT load.',
  summary = replace(summary, 'The register states no electrical capacity, so none is recorded.', 'The planning committee report states that the development requires 250 MW of power, secured through two independent National Grid connections; this is recorded as a stated electrical demand, not IT load.'),
  last_verified_at = DATE '2026-09-27'
WHERE slug = 'hayes-bridge-heathrow-interchange-data-centre-campus';
UPDATE public.dc_projects SET sources = COALESCE(sources, '[]'::jsonb) || '[{"title": "Planning committee report: Hayes Bridge Retail Park, Uxbridge Road (78343/APP/2025/719)", "url": "https://modgov.hillingdon.gov.uk/documents/s64694/Hayes%20Bridge%20Retail%20Park%20Uxb%20Road.pdf", "publisher": "London Borough of Hillingdon", "date": "2025-10-02"}]'::jsonb
WHERE slug = 'hayes-bridge-heathrow-interchange-data-centre-campus' AND NOT (COALESCE(sources, '[]'::jsonb) @> '[{"url": "https://modgov.hillingdon.gov.uk/documents/s64694/Hayes%20Bridge%20Retail%20Park%20Uxb%20Road.pdf"}]'::jsonb);
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', id, 'stated_electricity_demand_mw', NULL, '250', 'The Hillingdon committee report (2 October 2025) states the development requires 250 MW of power through two National Grid connections. Recorded as stated electrical demand; it is kept separate from IT-load totals.', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects WHERE slug = 'hayes-bridge-heathrow-interchange-data-centre-campus';

-- kao-data-stockport
UPDATE public.dc_projects SET
  capacity_mw = COALESCE(capacity_mw, 40),
  capacity_definition = CASE WHEN capacity_mw IS NULL THEN 'unclear' ELSE capacity_definition END,
  summary = summary || ' Kao Data describes the scheme as a 40 MW data centre without stating whether that is IT load or grid capacity, so the figure is shown but excluded from totals.',
  last_verified_at = DATE '2026-09-27'
WHERE slug = 'kao-data-stockport';
UPDATE public.dc_projects SET sources = COALESCE(sources, '[]'::jsonb) || '[{"title": "Kao Data announces planning approved for new £350m Greater Manchester data centre", "url": "https://kaodata.com/discover/news/kao-data-announces-planning-approved-for-new-350m-greater-manchester-data-centre-2/", "publisher": "Kao Data"}]'::jsonb
WHERE slug = 'kao-data-stockport' AND NOT (COALESCE(sources, '[]'::jsonb) @> '[{"url": "https://kaodata.com/discover/news/kao-data-announces-planning-approved-for-new-350m-greater-manchester-data-centre-2/"}]'::jsonb);
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', id, 'capacity_mw', NULL, '40 (definition not published)', 'Kao Data publishes a 40 MW figure for Kenwood Point without a stated definition. Shown on the profile and excluded from totals.', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects WHERE slug = 'kao-data-stockport';

-- edinburgh-redheughs-avenue
UPDATE public.dc_projects SET
  developer = COALESCE(developer, 'Shelborn Drummond Ltd'),
  summary = 'Planning permission in principle (25/04239/PPP) sought by Shelborn Drummond Ltd was refused by the City of Edinburgh Council''s planning sub-committee in February 2026, against officer recommendation, and is now under appeal (DPEA ref PPA-230-2794). Capacity has been reported variously as 210 MW, 212 MW, 212.42 MW and 213 MW; the measure is not stated, so the figure is excluded from every capacity total.',
  last_verified_at = DATE '2026-09-27'
WHERE slug = 'edinburgh-redheughs-avenue';
UPDATE public.dc_projects SET sources = COALESCE(sources, '[]'::jsonb) || '[{"title": "South Gyle data centre", "url": "https://aprs.scot/gyle-dc/", "publisher": "Association for the Protection of Rural Scotland"}]'::jsonb
WHERE slug = 'edinburgh-redheughs-avenue' AND NOT (COALESCE(sources, '[]'::jsonb) @> '[{"url": "https://aprs.scot/gyle-dc/"}]'::jsonb);
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', id, 'summary', '213 MW', '212.42 MW (reported range 210–213 MW)', 'The summary cited 213 MW while the record showed 212.42 MW. Both now reflect the range of reported figures; the definition is still unstated.', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects WHERE slug = 'edinburgh-redheughs-avenue';

-- north-wales-ai-growth-zone
UPDATE public.dc_projects SET
  summary = replace(summary, 'more than 3,400 new jobs', '3,450 jobs'),
  last_verified_at = DATE '2026-09-27'
WHERE slug = 'north-wales-ai-growth-zone';
UPDATE public.dc_projects SET sources = COALESCE(sources, '[]'::jsonb) || '[{"title": "AI Growth Zones to create thousands of jobs and unlock up to £100 billion in investment as new site confirmed for North Wales", "url": "https://www.gov.uk/government/news/ai-growth-zones-to-create-thousands-of-jobs-and-unlock-up-to-100-billion-in-investment-as-new-site-confirmed-for-north-wales", "publisher": "UK Government", "date": "2025-11-13"}]'::jsonb
WHERE slug = 'north-wales-ai-growth-zone' AND NOT (COALESCE(sources, '[]'::jsonb) @> '[{"url": "https://www.gov.uk/government/news/ai-growth-zones-to-create-thousands-of-jobs-and-unlock-up-to-100-billion-in-investment-as-new-site-confirmed-for-north-wales"}]'::jsonb);
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', id, 'summary', 'more than 3,400 new jobs', '3,450 jobs', 'The government announcement gives 3,450 jobs for the North Wales AI Growth Zone.', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects WHERE slug = 'north-wales-ai-growth-zone';

-- premier-park-park-royal
UPDATE public.dc_projects SET
  developer = COALESCE(developer, 'Segro and Pure Data Centres Group'),
  last_verified_at = DATE '2026-09-27'
WHERE slug = 'premier-park-park-royal';
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', id, 'developer', NULL, 'Segro and Pure Data Centres Group', 'Applicant/developer is named in published sources but was missing from the record.', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects WHERE slug = 'premier-park-park-royal';

-- whites-reclamation-eccles-data-centre
UPDATE public.dc_projects SET
  developer = COALESCE(developer, 'Digital Land & Development with Peel Waters'),
  last_verified_at = DATE '2026-09-27'
WHERE slug = 'whites-reclamation-eccles-data-centre';
UPDATE public.dc_projects SET sources = COALESCE(sources, '[]'::jsonb) || '[{"title": "Salford paves way for £250m data centre", "url": "https://www.investmanchester.co.uk/news/salford-paves-way-for-250m-data-centre/", "publisher": "Invest Manchester"}]'::jsonb
WHERE slug = 'whites-reclamation-eccles-data-centre' AND NOT (COALESCE(sources, '[]'::jsonb) @> '[{"url": "https://www.investmanchester.co.uk/news/salford-paves-way-for-250m-data-centre/"}]'::jsonb);
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', id, 'developer', NULL, 'Digital Land & Development with Peel Waters', 'Applicant/developer is named in published sources but was missing from the record.', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects WHERE slug = 'whites-reclamation-eccles-data-centre';

-- haspielaw-farm-hamilton
UPDATE public.dc_projects SET
  developer = COALESCE(developer, 'Apatura'),
  last_verified_at = DATE '2026-09-27'
WHERE slug = 'haspielaw-farm-hamilton';
UPDATE public.dc_projects SET sources = COALESCE(sources, '[]'::jsonb) || '[{"title": "Hamilton data centre", "url": "https://aprs.scot/hamilton-dc/", "publisher": "Association for the Protection of Rural Scotland"}]'::jsonb
WHERE slug = 'haspielaw-farm-hamilton' AND NOT (COALESCE(sources, '[]'::jsonb) @> '[{"url": "https://aprs.scot/hamilton-dc/"}]'::jsonb);
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', id, 'developer', NULL, 'Apatura', 'Applicant/developer is named in published sources but was missing from the record.', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects WHERE slug = 'haspielaw-farm-hamilton';

-- bedford-ampthill-road-campus
UPDATE public.dc_projects SET
  developer = COALESCE(developer, 'QuestPit Limited'),
  last_verified_at = DATE '2026-09-27'
WHERE slug = 'bedford-ampthill-road-campus';
UPDATE public.dc_projects SET sources = COALESCE(sources, '[]'::jsonb) || '[{"title": "Bedford data centre moves into national planning route", "url": "https://data-central.co.uk/bedford-data-centre-moves-into-national-planning-route/", "publisher": "Data Central"}]'::jsonb
WHERE slug = 'bedford-ampthill-road-campus' AND NOT (COALESCE(sources, '[]'::jsonb) @> '[{"url": "https://data-central.co.uk/bedford-data-centre-moves-into-national-planning-route/"}]'::jsonb);
INSERT INTO public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
SELECT 'dc_project', id, 'developer', NULL, 'QuestPit Limited', 'Applicant/developer is named in published sources but was missing from the record.', 'AI Energy Intelligence editorial team', true
FROM public.dc_projects WHERE slug = 'bedford-ampthill-road-campus';
