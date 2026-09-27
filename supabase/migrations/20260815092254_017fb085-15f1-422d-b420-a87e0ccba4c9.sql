-- Annual GB consumption series (DESNZ workbook Table_2, Great Britain row)
insert into public.index_datapoints
 (indicator_id, period_label, period_start, period_end, value, unit, previous_value, percent_change,
  data_classification, publication_date, reviewed_at, source_name, source_url, source_id, notes,
  geographic_coverage, calculation_method, calculation_inputs, assumptions, limitations,
  confidence_level_rating, confidence_level, is_estimate, status)
select i.id, v.period_label, v.ps::date, v.pe::date, v.val, 'TWh per year', v.prev, v.pct,
  'official', '2026-06-30', '2026-08-15',
  'Department for Energy Security and Net Zero (DESNZ)',
  'https://assets.publishing.service.gov.uk/media/6a423ab97ac6fd9c6a94aac7/Energy_Trends_June_2026.pdf',
  s.id, v.note, 'great_britain', v.calc, v.inputs::jsonb,
  'Displayed to one decimal place, matching the rounding DESNZ uses. Changes are calculated from the unrounded workbook values.',
  'A DESNZ statistical estimate of electricity taken from the public grid by data centres. It covers data centres generally and does not separate electricity used by artificial-intelligence workloads. Great Britain only: Northern Ireland is excluded.',
  'high', 'high', true, 'published'
from (values
  ('2020','2020-01-01','2020-12-31',3.2,null::numeric,null::numeric,'DESNZ workbook Table_2, Great Britain row. Exact workbook value 3.1589039201 TWh.',null::text,'[{"label":"Workbook Table_2, Great Britain, 2020","value":3.1589039201,"unit":"TWh"}]'),
  ('2021','2021-01-01','2021-12-31',3.4,3.2,9.1,'DESNZ workbook Table_2, Great Britain row. Exact workbook value 3.4447971574 TWh.','Annual percentage change = ((3.4447971574 - 3.1589039201) / 3.1589039201) x 100 = 9.05%. Absolute change = +0.2858932373 TWh.','[{"label":"2021 workbook value","value":3.4447971574,"unit":"TWh"},{"label":"2020 workbook value","value":3.1589039201,"unit":"TWh"}]'),
  ('2022','2022-01-01','2022-12-31',3.8,3.4,11.6,'DESNZ workbook Table_2, Great Britain row. Exact workbook value 3.8432667736 TWh.','Annual percentage change = ((3.8432667736 - 3.4447971574) / 3.4447971574) x 100 = 11.57%. Absolute change = +0.3984696162 TWh.','[{"label":"2022 workbook value","value":3.8432667736,"unit":"TWh"},{"label":"2021 workbook value","value":3.4447971574,"unit":"TWh"}]'),
  ('2023','2023-01-01','2023-12-31',4.1,3.8,7.4,'DESNZ workbook Table_2, Great Britain row. Exact workbook value 4.1267614068 TWh.','Annual percentage change = ((4.1267614068 - 3.8432667736) / 3.8432667736) x 100 = 7.38%. Absolute change = +0.2834946332 TWh.','[{"label":"2023 workbook value","value":4.1267614068,"unit":"TWh"},{"label":"2022 workbook value","value":3.8432667736,"unit":"TWh"}]'),
  ('2024','2024-01-01','2024-12-31',4.5,4.1,8.1,'DESNZ workbook Table_2, Great Britain row. Exact workbook value 4.4595375820 TWh. DESNZ reports this as 4.5 TWh.','Annual percentage change = ((4.4595375820 - 4.1267614068) / 4.1267614068) x 100 = 8.06%. Absolute change = +0.3327761752 TWh. Change from 2020 = +41.17%.','[{"label":"2024 workbook value","value":4.459537582,"unit":"TWh"},{"label":"2023 workbook value","value":4.1267614068,"unit":"TWh"},{"label":"2020 workbook value","value":3.1589039201,"unit":"TWh"}]')
) as v(period_label, ps, pe, val, prev, pct, note, calc, inputs)
cross join (select id from public.index_indicators where slug = 'gb-dc-electricity-consumption-desnz') i
cross join (select id from public.index_sources where url = 'https://assets.publishing.service.gov.uk/media/6a423ab97ac6fd9c6a94aac7/Energy_Trends_June_2026.pdf') s
where not exists (
  select 1 from public.index_datapoints d
  where d.indicator_id = i.id and d.period_label = v.period_label
);

-- GB share of grid electricity consumption (DESNZ workbook Table_3)
insert into public.index_datapoints
 (indicator_id, period_label, period_start, period_end, value, unit, previous_value,
  data_classification, publication_date, reviewed_at, source_name, source_url, source_id, notes,
  geographic_coverage, assumptions, limitations, confidence_level_rating, confidence_level, is_estimate, status)
select i.id, v.period_label, v.ps::date, v.pe::date, v.val, 'Percentage', v.prev,
  'official', '2026-06-30', '2026-08-15',
  'Department for Energy Security and Net Zero (DESNZ)',
  'https://assets.publishing.service.gov.uk/media/6a423ab97ac6fd9c6a94aac7/Energy_Trends_June_2026.pdf',
  s.id, v.note, 'great_britain',
  'Displayed to one decimal place from the workbook value. DESNZ rounds the 2024 figure to 2 per cent in the article text.',
  'The share of grid electricity consumed by data centres generally. It is not a measure of electricity used by artificial-intelligence workloads. Great Britain only.',
  'high', 'high', true, 'published'
from (values
  ('2020','2020-01-01','2020-12-31',1.2,null::numeric,'DESNZ workbook Table_3, Great Britain row. Exact workbook value 1.228668%.'),
  ('2021','2021-01-01','2021-12-31',1.3,1.2,'DESNZ workbook Table_3, Great Britain row. Exact workbook value 1.331953%.'),
  ('2022','2022-01-01','2022-12-31',1.5,1.3,'DESNZ workbook Table_3, Great Britain row. Exact workbook value 1.538769%.'),
  ('2023','2023-01-01','2023-12-31',1.7,1.5,'DESNZ workbook Table_3, Great Britain row. Exact workbook value 1.658131%.'),
  ('2024','2024-01-01','2024-12-31',1.8,1.7,'DESNZ workbook Table_3, Great Britain row. Exact workbook value 1.789199%, reported by DESNZ as approximately 2 per cent of the 249.2 TWh consumed from the grid in Great Britain.')
) as v(period_label, ps, pe, val, prev, note)
cross join (select id from public.index_indicators where slug = 'gb-dc-share-of-grid-electricity-desnz') i
cross join (select id from public.index_sources where url = 'https://assets.publishing.service.gov.uk/media/6a423ab97ac6fd9c6a94aac7/Energy_Trends_June_2026.pdf') s
where not exists (
  select 1 from public.index_datapoints d where d.indicator_id = i.id and d.period_label = v.period_label
);

-- Growth, concentration and local readings (2024 / 2020 to 2024)
insert into public.index_datapoints
 (indicator_id, period_label, period_start, period_end, value, unit,
  data_classification, publication_date, reviewed_at, source_name, source_url, source_id, notes,
  geographic_coverage, calculation_method, calculation_inputs, limitations,
  confidence_level_rating, confidence_level, is_estimate, status)
select i.id, v.period_label, v.ps::date, v.pe::date, v.val, v.unit,
  v.cls, '2026-06-30', '2026-08-15',
  'Department for Energy Security and Net Zero (DESNZ)',
  'https://assets.publishing.service.gov.uk/media/6a423ab97ac6fd9c6a94aac7/Energy_Trends_June_2026.pdf',
  s.id, v.note, v.geo, v.calc, v.inputs::jsonb, v.lim, 'high', 'high', true, 'published'
from (values
  ('gb-dc-consumption-change-2020-2024-twh','2020 to 2024','2020-01-01','2024-12-31',1.3,'TWh per year','calculated','great_britain',
   'Increase of 1.3 TWh between 2020 and 2024, as reported by DESNZ.',
   '2024 value minus 2020 value = 4.4595375820 - 3.1589039201 = 1.3006336619 TWh, displayed as 1.3 TWh.',
   '[{"label":"2024 workbook value","value":4.459537582,"unit":"TWh"},{"label":"2020 workbook value","value":3.1589039201,"unit":"TWh"}]',
   'A change between two DESNZ statistical estimates for data centres generally. Not AI-specific.'),
  ('gb-dc-consumption-growth-2020-2024','2020 to 2024','2020-01-01','2024-12-31',41,'Percentage change','official','great_britain',
   'DESNZ workbook Table_2, percentage change column. Exact workbook value 41.1736%, reported by DESNZ as 41 per cent.',
   'Published by DESNZ. Equivalent to ((4.4595375820 - 3.1589039201) / 3.1589039201) x 100 = 41.17%.',
   '[{"label":"Workbook Table_2 percentage change 2020 to 2024","value":41.1736,"unit":"%"}]',
   'A historical estimate of change over four years. It is not a current or real-time growth rate and is not AI-specific.'),
  ('london-dc-electricity-consumption','2024','2024-01-01','2024-12-31',1.7,'TWh per year','calculated','uk_region',
   'Inner London and Outer London rows of the DESNZ workbook, Table_2, added together. DESNZ reports approximately 1.7 TWh for London.',
   'Outer London 1.1694257144 + Inner London 0.4891820591 = 1.6586077735 TWh, displayed as 1.7 TWh.',
   '[{"label":"Outer London, 2024","value":1.1694257144,"unit":"TWh"},{"label":"Inner London, 2024","value":0.4891820591,"unit":"TWh"}]',
   'Describes where data-centre electricity is consumed. It does not indicate where AI workloads run.'),
  ('south-east-dc-electricity-consumption','2024','2024-01-01','2024-12-31',1.8,'TWh per year','official','uk_region',
   'DESNZ workbook Table_2, South East row. Exact workbook value 1.7853198722 TWh.',null,
   '[{"label":"South East, 2024","value":1.7853198722,"unit":"TWh"}]',
   'Describes where data-centre electricity is consumed. It does not indicate where AI workloads run.'),
  ('london-south-east-share-of-gb-dc-consumption','2024','2024-01-01','2024-12-31',77,'Percentage','calculated','great_britain',
   'London and the South East together accounted for 77 per cent of Great Britain data-centre electricity consumption in 2024.',
   '((1.6586077735 + 1.7853198722) / 4.4595375820) x 100 = 77.23%, displayed as 77%.',
   '[{"label":"London, 2024","value":1.6586077735,"unit":"TWh"},{"label":"South East, 2024","value":1.7853198722,"unit":"TWh"},{"label":"Great Britain, 2024","value":4.459537582,"unit":"TWh"}]',
   'A concentration measure for data centres generally, not AI workloads.'),
  ('slough-dc-electricity-consumption','2024','2024-01-01','2024-12-31',1.3,'TWh per year','official','local_authority',
   'DESNZ workbook Table_2, Slough row. Exact workbook value 1.2934434192 TWh.',null,
   '[{"label":"Slough, 2024","value":1.2934434192,"unit":"TWh"}]',
   'A single local-authority area. Not comparable with regional or Great Britain totals without care, and not AI-specific.'),
  ('slough-share-of-gb-dc-consumption','2024','2024-01-01','2024-12-31',29,'Percentage','calculated','great_britain',
   'Slough accounted for about 29 per cent of Great Britain data-centre electricity consumption in 2024.',
   '(1.2934434192 / 4.4595375820) x 100 = 29.00%, displayed as 29%.',
   '[{"label":"Slough, 2024","value":1.2934434192,"unit":"TWh"},{"label":"Great Britain, 2024","value":4.459537582,"unit":"TWh"}]',
   'A concentration measure for data centres generally, not AI workloads.'),
  ('dc-share-of-slough-grid-electricity','2024','2024-01-01','2024-12-31',65,'Percentage','official','local_authority',
   'DESNZ workbook Table_3, Slough row. Exact workbook value 65.1642%, reported by DESNZ as approximately 65 per cent.',null,
   '[{"label":"Slough share of local grid electricity, 2024","value":65.1642,"unit":"%"}]',
   'Applies to Slough only and says nothing about the share of grid electricity used by data centres elsewhere. Not AI-specific.')
) as v(slug, period_label, ps, pe, val, unit, cls, geo, note, calc, inputs, lim)
join public.index_indicators i on i.slug = v.slug
cross join (select id from public.index_sources where url = 'https://assets.publishing.service.gov.uk/media/6a423ab97ac6fd9c6a94aac7/Energy_Trends_June_2026.pdf') s
where not exists (
  select 1 from public.index_datapoints d where d.indicator_id = i.id and d.period_label = v.period_label
);

-- Supersede the earlier NESO 5 TWh modelling input
update public.index_datapoints set
  status = 'superseded',
  superseded_by = (select d.id from public.index_datapoints d
                   join public.index_indicators i on i.id = d.indicator_id
                   where i.slug = 'gb-dc-electricity-consumption-desnz' and d.period_label = '2024'),
  superseded_reason = 'Replaced as the principal baseline by the DESNZ 2024 official estimate of 4.5 TWh. Retained as historical context: NESO used 5 TWh a year as a modelling input in its Clean Power 2030 analysis, did not state a precise base year, covered Great Britain, and the figure was not AI-specific. It is not directly interchangeable with the DESNZ annual historical series.',
  reviewed_at = '2026-08-15'
where id = '3cd0bbd3-7761-4da4-ac6d-223efbe3160c';

update public.index_indicators set
  name = 'GB data-centre electricity consumption (superseded NESO modelling input)',
  caveats = 'A modelling input rather than a measured statistic. NESO did not state a precise base year. Great Britain, not AI-specific. Superseded as the principal baseline by the DESNZ 2024 official estimate and retained here as historical context only.',
  display_order = 41, last_updated_at = now()
where id = '97e29f9d-78fe-4ea9-8899-50215e40de4b';

-- Supersede the internally calculated 1.9 per cent share
update public.index_datapoints set
  status = 'superseded',
  superseded_by = (select d.id from public.index_datapoints d
                   join public.index_indicators i on i.id = d.indicator_id
                   where i.slug = 'gb-dc-share-of-grid-electricity-desnz' and d.period_label = '2024'),
  superseded_reason = 'Replaced by the official DESNZ 2024 share of 1.8 per cent. The earlier figure was calculated by AI Energy Intelligence by comparing the NESO Clean Power 2030 data-centre modelling input with 2023 total demand, so its reporting periods did not match.',
  reviewed_at = '2026-08-15'
where id = '2f206699-543a-48f4-9994-02852652201f';

update public.index_indicators set
  name = 'Data-centre share of GB electricity demand (superseded internal calculation)',
  caveats = 'Calculated by AI Energy Intelligence from NESO figures with mismatched reporting periods. Superseded by the official DESNZ 2024 share and retained only as history.',
  display_order = 42, last_updated_at = now()
where id = '517f1b6a-3d63-4b5d-9c50-1753311f0e04';

-- NESO modelled estimate: label it clearly and keep it apart from the DESNZ series
update public.index_indicators set
  name = 'GB data-centre electricity demand - NESO modelled estimate',
  caveats = 'A modelled estimate covering data centres generally, not AI workloads. Its methodology differs from the DESNZ historical series, so it is not the next comparable annual observation after DESNZ 2024 and no growth rate is calculated between the two.',
  display_order = 30, last_updated_at = now()
where id = '3bccd0c0-5eda-4091-9e43-d96cfcc9f276';

update public.index_datapoints set
  period_label = 'NESO modelled estimate as at November 2025',
  reviewed_at = '2026-08-15'
where id = '815ff071-bc33-4e47-ac50-f14dad20b59c';

-- AI-specific measures: insufficient evidence
update public.index_indicators set
  data_classification = 'insufficient_evidence',
  caveats = 'No authoritative UK or Great Britain source reviewed to date separates electricity consumed by AI workloads from electricity consumed by other data-centre workloads.',
  last_updated_at = now()
where id in ('be085422-2c9f-426b-8ae3-cd4a7d43b4c1','696750f1-98f9-4434-8e72-87c2bec1d444','1757a4c4-5f22-4e22-9df7-d7b706c67254');

-- Sub-index headline
update public.index_subindices set
  status_label = '2024 baseline',
  period_label = '2024 (DESNZ, published 30 June 2026)',
  direction = 'rising',
  last_reviewed_at = '2026-08-15'
where id = '60cabc18-d2b4-486a-aa38-eb4303eec764';

-- Public change log
insert into public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, is_public)
values
 ('subindex','60cabc18-d2b4-486a-aa38-eb4303eec764','status_label','Baseline in development','2024 baseline',
  'Published the first evidence-based baseline for the AI Electricity Demand Index using the DESNZ Energy Trends June 2026 special feature article and its accompanying workbook.','AI Energy Intelligence editorial', true),
 ('indicator','97e29f9d-78fe-4ea9-8899-50215e40de4b','value','5 TWh per year (NESO modelling input)','Superseded by DESNZ 2024 estimate of 4.5 TWh',
  'The NESO Clean Power 2030 modelling input is no longer presented as the principal baseline. It is retained as historical context with its original classification.','AI Energy Intelligence editorial', true),
 ('indicator','517f1b6a-3d63-4b5d-9c50-1753311f0e04','value','1.9 per cent (internally calculated)','Superseded by DESNZ 2024 official share of 1.8 per cent',
  'The official DESNZ share for 2024 replaces an internal calculation whose reporting periods did not match.','AI Energy Intelligence editorial', true);