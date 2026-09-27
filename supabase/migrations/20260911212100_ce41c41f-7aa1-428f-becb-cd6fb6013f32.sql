-- 1. Source register: Ofgem consultation (primary), press release (secondary), NESO slidepack (supporting)
insert into public.index_sources (id, organisation, title, url, publication_date, source_type, indicators_supported, accessed_at, notes, reporting_period, geographic_coverage, source_class, reliability_status, last_reviewed_at, status)
values
  ('b1f2c3d4-0001-4a11-9c01-0f1a2b3c4d01', 'Ofgem',
   'Proposed data centre connection reforms: Curate consultation document',
   'https://www.ofgem.gov.uk/sites/default/files/2026-07/Proposed-data-centre-connection-reforms-curate-consultation-document.pdf',
   '2026-07-29', 'regulator',
   'Total contracted demand in the GB connection queue; data-centre share of the demand connection queue',
   '2026-09-11',
   'Paragraph 2.6 states that between November 2024 and June 2025 total contracted offers in the demand queue rose from 41 GW (17 GW transmission, 24 GW distribution) to 125 GW (97 GW transmission, 29 GW distribution). Paragraph 2.7 states that approximately 73 GW of the total demand queue are data centres, across around 315 projects with contracted capacities from 1 MW to 1,500 MW. Consultation open until 16 September 2026: its reform proposals are proposals, not rules in force.',
   'Demand connection queue as at November 2024 and June 2025',
   'great_britain', 'primary', 'primary_verified', '2026-09-11', 'published'),
  ('b1f2c3d4-0002-4a11-9c01-0f1a2b3c4d02', 'Ofgem',
   'Press release: Ofgem acts to free up grid capacity by tackling speculative data centre projects',
   'https://www.ofgem.gov.uk/press-release/ofgem-acts-free-grid-capacity-tackling-speculative-data-centre-projects',
   '2026-07-29', 'regulator',
   'Data-centre share of the demand connection queue (conflicting figure)',
   '2026-09-11',
   'Restates the 41 GW to 125 GW increase between November 2024 and June 2025. Also states data centre projects account for "at least 80GWs" while separately citing "around 73GW referenced in Ofgem''s consultation". The two figures are not reconciled in the release, so no data-centre-specific reading is published from it.',
   'Demand connection queue as at November 2024 and June 2025',
   'great_britain', 'secondary', 'reliable_secondary', '2026-09-11', 'published'),
  ('b1f2c3d4-0003-4a11-9c01-0f1a2b3c4d03', 'National Energy System Operator (NESO)',
   'Grid Code Development Forum slidepack, 5 November 2025 — Large Demand Technical Requirements',
   'https://www.neso.energy/document/370901/download',
   '2025-11-05', 'operator',
   'Total contracted demand in the GB connection queue (restatement)',
   '2026-09-11',
   'Slide 10 states "Total Contracted Connection Demand in the queue: 125 GW", footnoted to Energy Networks Association connections data. The slidepack does not state the date the 125 GW figure describes. Retained as supporting evidence only; the reporting date is taken from the Ofgem consultation, which states the figure is as at June 2025.',
   'Presentation published 5 November 2025; underlying figure undated in the document',
   'great_britain', 'secondary', 'supporting_only', '2026-09-11', 'published')
on conflict (id) do nothing;

-- 2. Correct the existing 125 GW reading: it describes June 2025, not November 2025.
update public.index_datapoints set
  period_label = 'June 2025',
  period_start = '2025-06-01',
  period_end = '2025-06-30',
  previous_value = 41,
  change_absolute = 84,
  percent_change = 204.9,
  data_classification = 'official',
  geographic_coverage = 'great_britain',
  source_id = 'b1f2c3d4-0001-4a11-9c01-0f1a2b3c4d01',
  source_name = 'Ofgem — Proposed data centre connection reforms (Curate consultation document), paragraph 2.6',
  source_url = 'https://www.ofgem.gov.uk/sites/default/files/2026-07/Proposed-data-centre-connection-reforms-curate-consultation-document.pdf',
  publication_date = '2026-07-29',
  reviewed_at = '2026-09-11',
  confidence_level_rating = 'high',
  notes = 'Total contracted offers in the Great Britain demand connection queue: 97 GW transmission and 29 GW distribution as reported by Ofgem. The change against November 2024 is growth in contracted connection offers, not growth in electricity consumed or in physical network pressure.',
  limitations = 'Contracted connection capacity only. It is not electricity being consumed, not operational data-centre capacity, not exclusively data-centre demand, and not evidence that every queued project will proceed. Ofgem states it is concerned a significant number of queued projects may not ultimately connect. Great Britain only; Northern Ireland is not covered.',
  assumptions = 'The reading was previously labelled "As at November 2025" after the date of the NESO slidepack that restated it. Ofgem''s consultation establishes that the figure describes the queue as at June 2025.'
where id = '21e0462f-0d87-4a1d-9c0a-49f0f4c2d4c7';

-- 3. Add the November 2024 observation of the same indicator.
insert into public.index_datapoints (id, indicator_id, period_label, period_start, period_end, value, unit, data_classification, geographic_coverage, publication_date, reviewed_at, confidence_level_rating, source_id, source_name, source_url, notes, limitations, status)
select 'c2f3d4e5-0001-4b22-9d02-1a2b3c4d5e01', i.id, 'November 2024', '2024-11-01', '2024-11-30', 41, 'GW', 'official', 'great_britain', '2026-07-29', '2026-09-11', 'high',
  'b1f2c3d4-0001-4a11-9c01-0f1a2b3c4d01',
  'Ofgem — Proposed data centre connection reforms (Curate consultation document), paragraph 2.6',
  'https://www.ofgem.gov.uk/sites/default/files/2026-07/Proposed-data-centre-connection-reforms-curate-consultation-document.pdf',
  'Total contracted offers in the Great Britain demand connection queue: 17 GW transmission and 24 GW distribution. Historical reading, not a current measurement.',
  'Contracted connection capacity only, on the same definition and coverage as the June 2025 reading. Not electricity consumed and not exclusively data-centre demand.',
  'published'
from public.index_indicators i where i.slug = 'grid-connection-queue'
on conflict (id) do nothing;

-- 4. Restate the indicator so the measure is unambiguous.
update public.index_indicators set
  name = 'Total contracted demand in the GB connection queue',
  short_name = 'Contracted demand in the connection queue',
  description = 'Total contracted electricity connection offers held by demand projects in the Great Britain connections queue, across transmission and distribution.',
  caveats = 'This is contracted connection capacity, not electricity being consumed, not operational data-centre capacity and not exclusively data-centre demand. It is not evidence that every queued project will proceed. A national queue total does not establish grid pressure in any particular region.',
  unit = 'GW',
  data_classification = 'official',
  source_name = 'Ofgem',
  source_url = 'https://www.ofgem.gov.uk/sites/default/files/2026-07/Proposed-data-centre-connection-reforms-curate-consultation-document.pdf',
  source_type = 'regulator',
  update_frequency = 'ad_hoc',
  last_updated_at = '2026-09-11',
  methodology = 'Taken directly from Ofgem''s published figures for the demand connection queue. Readings for different dates are only compared where Ofgem states the same definition and coverage.'
where slug = 'grid-connection-queue';

-- 5. Data-centre share of the queue: conflicting figures, published as unavailable.
insert into public.index_indicators (id, slug, name, short_name, category, description, unit, weight, direction, source_name, source_url, source_type, update_frequency, last_updated_at, methodology, confidence_level, collection_method, caveats, display_order, status, subindex_id, data_classification, is_forecast)
select 'd3e4f5a6-0001-4c33-9e03-2b3c4d5e6f01', 'dc-share-of-gb-demand-queue',
  'Data-centre capacity within the GB demand connection queue',
  'Data centres in the connection queue', 'grid',
  'How much of the contracted demand connection queue is accounted for by data-centre projects.',
  'GW', 1, 'neutral', 'Ofgem',
  'https://www.ofgem.gov.uk/sites/default/files/2026-07/Proposed-data-centre-connection-reforms-curate-consultation-document.pdf',
  'regulator', 'ad_hoc', '2026-09-11',
  'No figure is published while Ofgem''s own documents give conflicting totals. The consultation document states approximately 73 GW across around 315 projects; the accompanying press release states data centres account for "at least 80GWs" while also citing "around 73GW referenced in Ofgem''s consultation". Neither document states the date the data-centre subtotal describes. The discrepancy is flagged for review rather than resolved by choosing one figure or combining them.',
  'low', 'manual',
  'Figures conflict between Ofgem publications and the reporting date of the data-centre subtotal is not stated. No reading is published.',
  2, 'published', s.id, 'insufficient_evidence', false
from public.index_subindices s where s.slug = 'grid-pressure'
on conflict (id) do nothing;

insert into public.index_datapoints (id, indicator_id, period_label, value, value_text, unit, data_classification, geographic_coverage, publication_date, reviewed_at, confidence_level_rating, source_id, source_name, source_url, notes, limitations, status)
values ('c2f3d4e5-0002-4b22-9d02-1a2b3c4d5e02', 'd3e4f5a6-0001-4c33-9e03-2b3c4d5e6f01',
  'Not established', null, 'Insufficient evidence — sources conflict', 'GW', 'insufficient_evidence', 'great_britain', '2026-07-29', '2026-09-11', 'not_assessed',
  'b1f2c3d4-0001-4a11-9c01-0f1a2b3c4d01',
  'Ofgem — consultation document paragraph 2.7 and press release, 29 July 2026',
  'https://www.ofgem.gov.uk/sites/default/files/2026-07/Proposed-data-centre-connection-reforms-curate-consultation-document.pdf',
  'Ofgem''s consultation document states approximately 73 GW of the demand queue are data centres, across around 315 projects with contracted capacities from 1 MW to 1,500 MW. Ofgem''s press release of the same date states data centre projects account for "at least 80GWs" and separately refers to "around 73GW referenced in Ofgem''s consultation". The two figures are not reconciled and neither document states the date the subtotal describes, so no reading is published.',
  'Held for review. No figure will be published until the definition, reporting date and source of the data-centre subtotal can be established.',
  'published')
on conflict (id) do nothing;

-- 6. Section status
update public.index_subindices set
  status_label = 'National indicators published — regional assessment in development',
  period_label = 'November 2024 and June 2025',
  last_reviewed_at = '2026-09-11',
  intro = 'National connection-queue figures are published and sourced. Regional pressure ratings are not: a national queue total cannot establish how much pressure any individual region is under, so every region remains at "Insufficient evidence" while regional evidence is collected.'
where slug = 'grid-pressure';

-- 7. Public change history and revision records
insert into public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, source_id, changed_by_label, methodology_version, is_public)
values
  ('datapoint', '21e0462f-0d87-4a1d-9c0a-49f0f4c2d4c7', 'Reporting period', 'As at November 2025', 'June 2025',
   'The 125 GW connection-queue figure was labelled with the publication date of the NESO Grid Code Development Forum slidepack that restated it. Ofgem''s consultation document establishes that the figure describes the demand queue as at June 2025. The reading itself is unchanged; only its reporting period, source and supporting notes were corrected.',
   'b1f2c3d4-0001-4a11-9c01-0f1a2b3c4d01', 'AI Energy Intelligence editorial team', 'v1.0', true),
  ('datapoint', 'c2f3d4e5-0001-4b22-9d02-1a2b3c4d5e01', 'New reading', null, '41 GW, November 2024',
   'Added the November 2024 observation of the same indicator from Ofgem''s consultation document, so the June 2025 figure can be compared against a reading of matching definition and coverage. The change between them is growth in contracted connection offers, not growth in electricity use or in physical grid pressure.',
   'b1f2c3d4-0001-4a11-9c01-0f1a2b3c4d01', 'AI Energy Intelligence editorial team', 'v1.0', true),
  ('indicator', 'd3e4f5a6-0001-4c33-9e03-2b3c4d5e6f01', 'Data-centre share of the queue', null, 'Insufficient evidence — sources conflict',
   'Ofgem''s press release states data centres account for at least 80 GW of the demand queue; Ofgem''s consultation document states approximately 73 GW. Neither states the date the subtotal describes. The discrepancy is recorded and the indicator left unavailable rather than one figure being chosen.',
   'b1f2c3d4-0001-4a11-9c01-0f1a2b3c4d01', 'AI Energy Intelligence editorial team', 'v1.0', true)
on conflict do nothing;

insert into public.index_revisions (entity_type, entity_id, change_type, summary, previous_value, new_value, reason, methodology_version, revised_at, is_public)
values
  ('datapoint', '21e0462f-0d87-4a1d-9c0a-49f0f4c2d4c7', 'correction',
   'Corrected the reporting period of the 125 GW contracted demand queue reading from November 2025 to June 2025',
   'As at November 2025', 'June 2025',
   'The earlier label used the publication date of a NESO presentation rather than the date the data describes. Corrected against Ofgem''s consultation document, paragraph 2.6.',
   'v1.0', now(), true),
  ('datapoint', 'c2f3d4e5-0001-4b22-9d02-1a2b3c4d5e01', 'created',
   'Added the November 2024 contracted demand queue reading of 41 GW', null, '41 GW',
   'Historical reading of the same indicator, published by Ofgem alongside the June 2025 figure.',
   'v1.0', now(), true)
on conflict do nothing;