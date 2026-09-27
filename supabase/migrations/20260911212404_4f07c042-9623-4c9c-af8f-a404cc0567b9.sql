-- 1. Record where in a document a finding comes from, what kind of finding it is, and its limits.
alter table public.grid_evidence
  add column if not exists source_section text,
  add column if not exists evidence_nature text not null default 'not_established',
  add column if not exists limitations text;

alter table public.grid_evidence drop constraint if exists grid_evidence_nature_check;
alter table public.grid_evidence add constraint grid_evidence_nature_check
  check (evidence_nature = any (array['observation','estimate','forecast','planned_project','not_established']));

-- 2. Network-operator sources
insert into public.index_sources (id, organisation, title, url, publication_date, source_type, indicators_supported, accessed_at, notes, reporting_period, geographic_coverage, source_class, reliability_status, last_reviewed_at, status)
values
  ('e4a5b6c7-0001-4d44-9f04-3c4d5e6f7a01', 'UK Power Networks',
   'Distribution Network Options Assessment (DNOA) Outcomes Report, March 2025, third edition',
   'https://media.umbraco.io/ukpn-cms/q0ghtzyi/ukpn-dnoa-report-march-2025.pdf',
   '2025-03-01', 'operator',
   'Regional grid evidence: London Power Networks substation constraints',
   '2026-09-11',
   'Substation-level constraint assessments for UK Power Networks'' three licence areas. London entries used here are in the London Power Networks (LPN) results section, page 49. Flexibility requirements are stated per DFES 2024 scenario and are therefore scenario forecasts, not measured shortfalls.',
   'Assessed against DFES 2024; constraint years from 2025 onwards',
   'uk_region', 'primary', 'primary_verified', '2026-09-11', 'published'),
  ('e4a5b6c7-0002-4d44-9f04-3c4d5e6f7a02', 'Scottish and Southern Electricity Networks (SSEN) Distribution',
   'Iver 132kV Grid Supply Point Strategic Development Plan (draft for consultation), May 2025',
   'https://www.ssen.co.uk/globalassets/about-us/dso/current-consultations/iver-132kv-grid-supply-point---strategic-development-plan---for-consultation.pdf',
   '2025-05-01', 'operator',
   'Regional grid evidence: Slough and the Thames Valley',
   '2026-09-11',
   'Covers the Iver 132kV Grid Supply Point area, which SSEN describes as serving communities across Windsor and Slough, with sections addressing Slough, Windsor and Maidenhead, Buckinghamshire, Spelthorne, Hillingdon and Surrey councils. Draft published for consultation. Future network needs are modelled from DFES 2023 scenarios.',
   'Published May 2025; forecasts run to 2035 and 2050',
   'uk_region', 'primary', 'primary_verified', '2026-09-11', 'published')
on conflict (id) do nothing;

-- 3. Evidence records — London
insert into public.grid_evidence (id, title, region_slug, local_area, network_level, network_operator, constraint_type, description, connection_delay_mentioned, reinforcement_required, investment_announced, flexible_connection_available, relevant_period, relevant_date, source_id, source_section, evidence_nature, limitations, confidence_level, last_reviewed_at, admin_notes, status)
values
  ('f5b6c7d8-0001-4e55-9a05-4d5e6f7a8b01',
   'Bow grid supply point: N-1 overload expected from winter 2026',
   'london', 'Bow, E15 2GN — London Boroughs of Newham and Tower Hamlets',
   'distribution', 'UK Power Networks (London Power Networks)', 'substation_capacity',
   'UK Power Networks records Bow as expected to be overloaded under an N-1 outage condition because of limited transformer capacity, with a constraint season of winter and a constraint year of 2026. The site serves 28,024 customers. The stated traditional solution is a third 132/11 kV transformer and an extension of the 132 kV switchboard at Bow GIS. Flexibility requirements under the Holistic Transition scenario rise from 1.1 MW in 2026/27 to 4.5 MW in 2029/30.',
   null,
   'Yes — third 132/11 kV transformer and 132 kV switchboard extension identified as the traditional solution.',
   'No investment figure is published in this document. UK Power Networks states it has partially fulfilled the system need through its Autumn 2024 flexibility tender and will continue procuring flexibility.',
   'Flexibility procurement is the approved route for this site; 90% of the 2026/27 requirement is recorded as procured.',
   'Constraint year 2026; flexibility requirements 2025/26 to 2029/30', '2025-03-01',
   'e4a5b6c7-0001-4d44-9f04-3c4d5e6f7a01',
   'London Power Networks (LPN) results, page 49',
   'observation',
   'Applies to one grid supply point in east London, not to London as a whole. The constraint is a general N-1 transformer capacity assessment; the document does not attribute it to data-centre or AI demand. The megawatt figures are scenario-based flexibility requirements, not a measured capacity shortfall, and demand headroom is not the same as generation headroom.',
   'high', '2026-09-11',
   'Checked against the primary PDF on 11 September 2026.', 'published'),
  ('f5b6c7d8-0002-4e55-9a05-4d5e6f7a8b02',
   'Willesden Grid: capacity deficiency recorded in the adjoining West London network',
   'london', 'Willesden Grid, NW10 6PE — north-west London, at the boundary with the SSEN network in West London',
   'distribution', 'UK Power Networks (London Power Networks)', 'local_congestion',
   'UK Power Networks records the constraint at Willesden Grid as "There is a deficiency in capacity within the Scottish and Southern Energy Networks'' service area in West London." Its approved recommendation is to procure as much flexibility as possible to support demand growth in West London''s SSEN network, with a stated flexibility requirement of 25 MW a year across 2025/26 to 2027/28. The stated traditional solution is a whole-systems approach rather than works at the site itself.',
   null,
   'No site reinforcement is identified; the document calls for a whole-systems approach across the licence-area boundary.',
   'No investment figure is published in this document.',
   'Flexibility procurement is the approved route.',
   'Flexibility requirements 2025/26 to 2027/28', '2025-03-01',
   'e4a5b6c7-0001-4d44-9f04-3c4d5e6f7a01',
   'London Power Networks (LPN) results, page 49',
   'observation',
   'The capacity deficiency described sits in the adjoining SSEN network in West London, not in UK Power Networks'' own site capacity, so the geography straddles two licence areas and is narrower than "London". The document does not attribute the deficiency to data centres. Published by the same operator as the Bow record, so the two are not independent corroboration.',
   'medium', '2026-09-11',
   'Checked against the primary PDF on 11 September 2026.', 'published'),

-- 4. Evidence records — Slough and the Thames Valley
  ('f5b6c7d8-0003-4e55-9a05-4d5e6f7a8b03',
   'Over 600 MVA of data centres connected and contracted across the Iver 132kV grid supply point',
   'slough-thames-valley', 'Iver 132kV Grid Supply Point area — SSEN states the majority of this load comes from the Slough area',
   'distribution', 'SSEN Distribution (Southern Electric Power Distribution)', 'connection_queue',
   'SSEN Distribution states: "There are over 600MVA of data centres already connected and contracted with capacity across Iver 132kV GSP with the majority of this load coming from the Slough area." The same section notes that increased data-centre demand across west London and Slough and the resulting capacity issues are well documented, and that a data-centre building block has been added to SSEN''s DFES analysis to improve forecasting.',
   null, null, null, null,
   'Published May 2025; no separate as-at date is stated for the 600 MVA figure', '2025-05-01',
   'e4a5b6c7-0002-4d44-9f04-3c4d5e6f7a02',
   'Section 5.5.1 "Data Centres", page 19',
   'observation',
   'The figure covers the whole Iver 132kV grid supply point area — Slough plus parts of Windsor and Maidenhead, Buckinghamshire and Hillingdon — not Slough alone, and SSEN gives no separate Slough figure. It combines capacity already connected with capacity contracted but not yet built, so it is not operational load. It is stated in MVA, which is not interchangeable with MW. No as-at date is given beyond the report date, and the document is a draft published for consultation.',
   'high', '2026-09-11',
   'Quote checked word for word against the primary PDF on 11 September 2026.', 'published'),
  ('f5b6c7d8-0004-4e55-9a05-4d5e6f7a8b04',
   'Chalvey bulk supply point transformers forecast to overload, with reinforcement options identified',
   'slough-thames-valley', 'Chalvey bulk supply point and Chalvey 132kV, Slough',
   'distribution', 'SSEN Distribution (Southern Electric Power Distribution)', 'reinforcement_requirement',
   'SSEN''s future network needs table records both 132/33kV transformers feeding Chalvey bulk supply point as forecast to overload under an N-1 condition, with the year varying between 2030 and 2041 depending on the DFES scenario applied. The options set out include adding a third 132/33kV transformer and a 132kV circuit from the proposed new Langley Hall switching station.',
   null,
   'Reinforcement options are identified but not committed: a third 132/33kV transformer and a 132kV circuit from the proposed Langley Hall switching station.',
   'No investment figure or delivery date is published in this document.',
   null,
   'Forecast overload years between 2030 and 2041 depending on scenario', '2025-05-01',
   'e4a5b6c7-0002-4d44-9f04-3c4d5e6f7a02',
   'Section 8.2 "Future EHV system needs to 2035", needs table',
   'forecast',
   'This is a scenario forecast, not an observed overload, and the year varies widely with the scenario used. The options listed are options in a draft consultation document: identifying reinforcement does not mean it is funded, committed or that any connection date is guaranteed. Planned reinforcement is not capacity already available.',
   'medium', '2026-09-11',
   'Checked against the primary PDF on 11 September 2026.', 'published')
on conflict (id) do nothing;

-- 5. Assessments held at "Insufficient evidence" with the evidence attached
insert into public.grid_pressure_ratings (id, region_slug, rating, rationale, connection_demand_evidence, known_delays, network_constraints, planned_investment, flexible_connections, evidence_confidence, source_title, source_url, assessment_date, last_reviewed_at, next_review_at, assessed_by, methodology_version, limitations, status)
values
  ('a6c7d8e9-0001-4f66-9b06-5e6f7a8b9c01', 'london', 'insufficient_evidence',
   'Evidence collection has begun for London but no pressure rating can be published. The published methodology does not yet define what separates Low, Moderate, High and Severe pressure, and both current evidence records come from a single publisher and describe individual grid supply points rather than the capital as a whole. A national connection-queue total cannot be used to fill that gap.',
   'No London-specific connection-queue figure has been established. The 125 GW Great Britain queue figure is national and is not apportioned to any region.',
   'No published average connection waiting time for London has been established. Individual delayed projects are not used to infer one.',
   'UK Power Networks records Bow (E15) as expected to be overloaded under an N-1 outage condition from winter 2026 because of limited transformer capacity, and records a capacity deficiency in the adjoining SSEN network in West London affecting Willesden Grid (NW10). Both are individual sites, not a London-wide position.',
   'Flexibility procurement is the approved route at both sites. No investment figure is published in the source document.',
   'UK Power Networks reports procuring flexibility at both Bow and Willesden Grid, with 90% of the 2026/27 Bow requirement recorded as procured.',
   'low',
   'UK Power Networks — DNOA Outcomes Report, March 2025',
   'https://media.umbraco.io/ukpn-cms/q0ghtzyi/ukpn-dnoa-report-march-2025.pdf',
   '2026-09-11', '2026-09-11', '2026-12-11', 'AI Energy Intelligence editorial team', 'v1.0',
   'Both records come from one operator and one document, so they do not independently corroborate each other. Neither attributes the constraint to data-centre or AI demand. Flexibility requirements are scenario forecasts, not measured shortfalls. Demand headroom is not generation headroom.',
   'published'),
  ('a6c7d8e9-0002-4f66-9b06-5e6f7a8b9c02', 'slough-thames-valley', 'insufficient_evidence',
   'Evidence collection has begun for Slough and the Thames Valley but no pressure rating can be published. The published methodology does not yet define what separates Low, Moderate, High and Severe pressure, and both current evidence records come from a single SSEN consultation draft covering the Iver 132kV grid supply point area rather than Slough alone.',
   'SSEN states that over 600 MVA of data centres are already connected and contracted with capacity across the Iver 132kV grid supply point, with the majority of that load coming from the Slough area. The figure covers the whole grid supply point area, combines connected with contracted capacity, and is stated in MVA.',
   'No published average connection waiting time for this area has been established.',
   'Both 132/33kV transformers feeding Chalvey bulk supply point are forecast to overload under an N-1 condition, in a year varying between 2030 and 2041 depending on the scenario applied.',
   'Reinforcement options are identified — a third 132/33kV transformer and a 132kV circuit from the proposed Langley Hall switching station — but no funding, cost or delivery date is published, and identifying an option does not guarantee a connection date.',
   'No flexible-connection information for this area has been established.',
   'low',
   'SSEN Distribution — Iver 132kV Grid Supply Point Strategic Development Plan, May 2025',
   'https://www.ssen.co.uk/globalassets/about-us/dso/current-consultations/iver-132kv-grid-supply-point---strategic-development-plan---for-consultation.pdf',
   '2026-09-11', '2026-09-11', '2026-12-11', 'AI Energy Intelligence editorial team', 'v1.0',
   'The Iver 132kV grid supply point area is not the same as Slough: it also covers parts of Windsor and Maidenhead, Buckinghamshire and Hillingdon. No SSEN total for the whole southern England licence area is applied to Slough. The source is a draft published for consultation, and both records come from it, so they are not independent corroboration.',
   'published')
on conflict (id) do nothing;

insert into public.grid_assessment_evidence (assessment_id, evidence_id)
values
  ('a6c7d8e9-0001-4f66-9b06-5e6f7a8b9c01', 'f5b6c7d8-0001-4e55-9a05-4d5e6f7a8b01'),
  ('a6c7d8e9-0001-4f66-9b06-5e6f7a8b9c01', 'f5b6c7d8-0002-4e55-9a05-4d5e6f7a8b02'),
  ('a6c7d8e9-0002-4f66-9b06-5e6f7a8b9c02', 'f5b6c7d8-0003-4e55-9a05-4d5e6f7a8b03'),
  ('a6c7d8e9-0002-4f66-9b06-5e6f7a8b9c02', 'f5b6c7d8-0004-4e55-9a05-4d5e6f7a8b04')
on conflict do nothing;

insert into public.index_change_log (entity_type, entity_id, field_name, previous_value, new_value, reason, changed_by_label, methodology_version, is_public)
values
  ('grid_assessment', 'a6c7d8e9-0001-4f66-9b06-5e6f7a8b9c01', 'London evidence', null, 'Two evidence records added; rating remains Insufficient evidence',
   'Regional evidence collection began with London. Substation-level constraint records were added from UK Power Networks'' DNOA Outcomes Report. No rating was assigned: the methodology does not yet define the thresholds separating Low, Moderate, High and Severe, and both records come from one publisher.',
   'AI Energy Intelligence editorial team', 'v1.0', true),
  ('grid_assessment', 'a6c7d8e9-0002-4f66-9b06-5e6f7a8b9c02', 'Slough and Thames Valley evidence', null, 'Two evidence records added; rating remains Insufficient evidence',
   'Regional evidence collection began with Slough and the Thames Valley, using SSEN Distribution''s Iver 132kV grid supply point plan. The area covered is wider than Slough and no Slough-only figure is published, so the evidence is recorded at grid-supply-point level and no rating was assigned.',
   'AI Energy Intelligence editorial team', 'v1.0', true)
on conflict do nothing;