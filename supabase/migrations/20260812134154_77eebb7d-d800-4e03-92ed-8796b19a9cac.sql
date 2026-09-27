-- ============================================================
-- UK AI Energy Index: Phase 1 corrections + Phase 2/3/4 expansion
-- ============================================================

-- 1. Source register -----------------------------------------
INSERT INTO public.index_sources
  (organisation, title, url, publication_date, source_type, indicators_supported,
   accessed_at, notes, status, reporting_period, geographic_coverage, source_class,
   reliability_status, last_reviewed_at)
VALUES
  ('National Energy System Operator (NESO)',
   'Future Energy Scenarios 2025: Pathways to Net Zero',
   'https://www.neso.energy/document/364541/download',
   '2025-07-01', 'official',
   'GB data-centre electricity demand; 2035 and 2050 pathway demand',
   '2026-08-12',
   'FES 2025 rebuilt the data-centre demand model using DNO and TO connection information. Pathway figures are scenarios, not predictions.',
   'published', '2025 to 2050', 'great_britain', 'primary', 'primary_verified', '2026-08-12'),
  ('National Energy System Operator (NESO)',
   'Grid Code Development Forum, 5 November 2025 - Large Demand Technical Requirements',
   'https://www.neso.energy/document/370901/download',
   '2025-11-05', 'operator',
   'GB data-centre demand and connected capacity; FES 2025 pathway demand for 2035 and 2050; contracted connection demand in the queue',
   '2026-08-12',
   'NESO industry forum pack. Slide 10 states current GB data-centre demand, connected capacity and pathway figures, citing FES 2025 and Energy Networks Association connections data.',
   'published', 'As at November 2025', 'great_britain', 'primary', 'primary_verified', '2026-08-12');

-- 2. Phase 1 corrections --------------------------------------
UPDATE public.index_datapoints d
SET publication_date = '2025-05-01',
    notes = 'Parliamentary Question answer reproduced in the DSIT research and analysis page published 1 May 2025; the answer was first published 11 March 2025.',
    limitations = 'Colocation data centres only - enterprise facilities operated by businesses for their own use are excluded. DSIT internal modelled estimates derived from rack densities and floor area. Great Britain only: Northern Ireland is not covered. Measures maximum rated IT load, not total facility load or grid-connection capacity.',
    reviewed_at = '2026-08-12'
FROM public.index_indicators i
WHERE d.indicator_id = i.id AND i.slug = 'gb-colocation-data-centre-capacity';

UPDATE public.index_datapoints d
SET limitations = 'Great Britain only. Stated in NESO Clean Power 2030 Annex 1 (November 2024) as "5 TWh today" without a named reporting year, so it cannot be attributed to a specific calendar year. Superseded for current reporting by the NESO FES 2025 estimate of 7.6 TWh; retained here as the published November 2024 position.',
    reviewed_at = '2026-08-12'
FROM public.index_indicators i
WHERE d.indicator_id = i.id AND i.slug = 'gb-data-centre-electricity-consumption';

UPDATE public.index_datapoints d
SET limitations = 'Forecast, not an observation. Great Britain only. NESO Clean Power 2030 pathway (November 2024). Superseded for current forecasting by FES 2025, which models 30-41 TWh by 2035; retained here as the published November 2024 position.',
    reviewed_at = '2026-08-12'
FROM public.index_indicators i
WHERE d.indicator_id = i.id AND i.slug = 'gb-data-centre-electricity-consumption-2030';

UPDATE public.index_datapoints d
SET value_text = 'At least 6 GW',
    publication_date = '2025-07-01',
    limitations = 'Forecast requirement, not an observation of installed capacity. The UK Compute Roadmap states the UK "will need at least 6GW of AI-capable data centre capacity by 2030" and adds that demand could exceed this baseline significantly. The roadmap does not define whether this is IT load, total facility load or grid-connection capacity.',
    reviewed_at = '2026-08-12'
FROM public.index_indicators i
WHERE d.indicator_id = i.id AND i.slug = 'uk-ai-capable-capacity-requirement-2030';

UPDATE public.index_indicators
SET caveats = 'No UK or Great Britain source reviewed to date separates electricity consumed by artificial-intelligence workloads from wider data-centre consumption. NESO models data-centre demand in aggregate; DSIT reports colocation IT capacity, not AI workload. This indicator remains "Insufficient evidence" until a credible source makes that distinction explicitly.',
    last_updated_at = now()
WHERE slug = 'ai-attributable-electricity-demand';

-- 3. New electricity-demand indicators -------------------------
INSERT INTO public.index_indicators
  (slug, name, short_name, category, description, unit, weight, direction, source_name, source_url,
   source_type, update_frequency, methodology, confidence_level, collection_method, caveats,
   display_order, status, subindex_id, data_classification, is_forecast, forecast_year, last_updated_at)
SELECT v.slug, v.name, v.short_name, v.category, v.description, v.unit, 1, v.direction,
       v.source_name, v.source_url, v.source_type, 'annual', v.methodology, 'medium', 'manual',
       v.caveats, v.ord, 'published',
       (SELECT id FROM public.index_subindices WHERE slug = 'electricity-demand'),
       v.classification, v.is_forecast, v.forecast_year, now()
FROM (VALUES
  ('gb-data-centre-demand-fes2025', 'GB data-centre electricity demand (FES 2025 estimate)', 'DC demand (FES 2025)', 'demand',
   'NESO current estimate of annual electricity demand from data centres connected in Great Britain.', 'TWh per year', 'higher_is_more_pressure',
   'National Energy System Operator (NESO)', 'https://www.neso.energy/document/370901/download', 'operator',
   'Taken verbatim from the NESO Grid Code Development Forum pack, 5 November 2025, slide 10, sourced to FES 2025.',
   'Aggregate data-centre demand. Not AI-specific.', 10, 'industry_estimate', false, NULL::int),
  ('gb-connected-data-centre-capacity', 'GB connected data-centre capacity', 'Connected DC capacity', 'infrastructure',
   'Electrical capacity of data-centre facilities already connected to the Great Britain electricity system.', 'GW', 'higher_is_more_pressure',
   'National Energy System Operator (NESO)', 'https://www.neso.energy/document/370901/download', 'operator',
   'Taken verbatim from the NESO Grid Code Development Forum pack, 5 November 2025, slide 10.',
   'Connected capacity, not IT load and not contracted future capacity. NESO does not state the capacity definition.', 11, 'industry_estimate', false, NULL),
  ('gb-total-electricity-demand', 'GB total annual electricity demand', 'GB total demand', 'demand',
   'Total annual electricity demand across Great Britain, used as the denominator for share calculations.', 'TWh per year', 'neutral',
   'National Energy System Operator (NESO)', 'https://www.neso.energy/document/346791/download', 'official',
   'NESO Clean Power 2030, Annex 1, section 2.1.1.', 'Great Britain, not the United Kingdom.', 12, 'verified', false, NULL),
  ('gb-peak-electricity-demand', 'GB peak electricity demand', 'GB peak demand', 'demand',
   'Peak electricity demand recorded across Great Britain.', 'GW', 'neutral',
   'National Energy System Operator (NESO)', 'https://www.neso.energy/document/346791/download', 'official',
   'NESO Clean Power 2030, Annex 1, section 2.1.1.', 'A capacity measure in gigawatts; not comparable with annual consumption in TWh.', 13, 'verified', false, NULL),
  ('gb-data-centre-share-of-demand', 'Data-centre share of GB electricity demand', 'DC share of demand', 'demand',
   'Data-centre electricity demand expressed as a share of total Great Britain electricity demand.', 'Percentage', 'higher_is_more_pressure',
   'National Energy System Operator (NESO)', 'https://www.neso.energy/document/346791/download', 'modelled',
   'Calculated by AI Energy Intelligence from two figures published in the same NESO document. No cross-source division is performed.',
   'Calculated figure, not published by NESO. Aggregate data centres, not AI-specific.', 14, 'aie_estimate', false, NULL),
  ('gb-data-centre-demand-2035', 'GB data-centre electricity demand, 2035', 'DC demand 2035', 'demand',
   'FES 2025 pathway projections of Great Britain data-centre electricity demand in 2035.', 'TWh per year', 'higher_is_more_pressure',
   'National Energy System Operator (NESO)', 'https://www.neso.energy/document/370901/download', 'operator',
   'Pathway values are reported individually; no average is calculated across pathways.',
   'Scenario projections, not predictions.', 20, 'forecast', true, 2035),
  ('gb-data-centre-demand-2050', 'GB data-centre electricity demand, 2050', 'DC demand 2050', 'demand',
   'Published long-range projections of Great Britain data-centre electricity demand in 2050.', 'TWh per year', 'higher_is_more_pressure',
   'National Energy System Operator (NESO)', 'https://www.neso.energy/document/370901/download', 'operator',
   'FES 2025 pathway values and the earlier Clean Power 2030 figure are reported separately.',
   'Scenario projections, not predictions.', 21, 'forecast', true, 2050),
  ('gb-total-electricity-demand-2030', 'GB total annual electricity demand, 2030', 'GB total demand 2030', 'demand',
   'NESO Clean Power 2030 projection of total Great Britain electricity demand in 2030.', 'TWh per year', 'neutral',
   'National Energy System Operator (NESO)', 'https://www.neso.energy/document/346791/download', 'official',
   'NESO Clean Power 2030, Annex 1, section 2.1.2.', 'Forecast, not an observation.', 22, 'forecast', true, 2030)
) AS v(slug, name, short_name, category, description, unit, direction, source_name, source_url,
       source_type, methodology, caveats, ord, classification, is_forecast, forecast_year)
ON CONFLICT (slug) DO NOTHING;

-- 4. Datapoints for the new electricity-demand indicators -------
INSERT INTO public.index_datapoints
  (indicator_id, period_label, value, value_text, unit, confidence_level, source_name, source_url,
   status, data_classification, publication_date, reviewed_at, geographic_coverage,
   confidence_level_rating, calculation_method, assumptions, limitations, notes, is_estimate)
SELECT i.id, v.period_label, v.value, v.value_text, v.unit, 'medium', v.source_name, v.source_url,
       'published', v.classification, v.publication_date::date, '2026-08-12'::date, v.geo,
       'medium', v.calc_method, v.assumptions, v.limitations, v.notes, v.is_estimate
FROM (VALUES
  ('gb-data-centre-demand-fes2025', 'As at November 2025 (FES 2025)', 7.6::numeric, NULL::text, 'TWh per year',
   'National Energy System Operator (NESO)', 'https://www.neso.energy/document/370901/download', 'industry_estimate',
   '2025-11-05', 'great_britain', NULL::text,
   'NESO states this demand arises from 2.4 GW of connected facilities and is mainly for traditional services.',
   'Modelled estimate, not metered outturn. Great Britain only. Aggregate data-centre demand - it is not AI-specific and must not be presented as AI electricity consumption. Supersedes the 5 TWh figure published in Clean Power 2030 (November 2024).',
   'NESO Grid Code Development Forum, 5 November 2025, slide 10, citing FES 2025.', true),
  ('gb-connected-data-centre-capacity', 'As at November 2025', 2.4::numeric, NULL, 'GW',
   'National Energy System Operator (NESO)', 'https://www.neso.energy/document/370901/download', 'industry_estimate',
   '2025-11-05', 'great_britain', NULL,
   'NESO describes these as connected facilities; the capacity definition is not stated in the source.',
   'Definition unclear: NESO does not state whether this is IT load, total facility load or grid-connection capacity. Excluded from any aggregate capacity total on this site. Great Britain only.',
   'NESO Grid Code Development Forum, 5 November 2025, slide 10.', true),
  ('gb-total-electricity-demand', '2023', 263::numeric, NULL, 'TWh per year',
   'National Energy System Operator (NESO)', 'https://www.neso.energy/document/346791/download', 'verified',
   '2024-11-05', 'great_britain', NULL, NULL,
   'Great Britain only; excludes Northern Ireland.',
   'NESO Clean Power 2030, Annex 1: Electricity demand and supply analysis, section 2.1.1.', false),
  ('gb-peak-electricity-demand', '2023', 58::numeric, NULL, 'GW',
   'National Energy System Operator (NESO)', 'https://www.neso.energy/document/346791/download', 'verified',
   '2024-11-05', 'great_britain', NULL, NULL,
   'Great Britain only. Peak demand in gigawatts is a capacity measure and must not be compared with annual consumption in TWh.',
   'NESO Clean Power 2030, Annex 1, section 2.1.1.', false),
  ('gb-total-electricity-demand-2030', '2030 (Clean Power 2030 pathway)', 287::numeric, NULL, 'TWh per year',
   'National Energy System Operator (NESO)', 'https://www.neso.energy/document/346791/download', 'forecast',
   '2024-11-05', 'great_britain', NULL,
   'Assumes electrification proceeds at a pace consistent with the 2030 Nationally Determined Contribution and Climate Change Committee carbon budgets.',
   'Forecast, not an observation. Great Britain only. Published November 2024.',
   'NESO Clean Power 2030, Annex 1, section 2.1.2 - demand growth of 11% to 287 TWh in 2030.', false),
  ('gb-data-centre-share-of-demand', '2023 total demand against the Clean Power 2030 data-centre baseline', 1.9::numeric, NULL, 'Percentage',
   'National Energy System Operator (NESO)', 'https://www.neso.energy/document/346791/download', 'aie_estimate',
   '2024-11-05', 'great_britain',
   'Calculated as 5 TWh data-centre demand divided by 263 TWh total Great Britain electricity demand, expressed as a percentage: 5 / 263 = 1.9%. Both inputs are taken from the same NESO document (Clean Power 2030, Annex 1) and both cover Great Britain.',
   'Assumes the NESO "5 TWh today" baseline is broadly contemporaneous with the 2023 total demand figure published in the same document.',
   'Calculated by AI Energy Intelligence, not published by NESO. Period mismatch: the total demand figure is explicitly for 2023, while the data-centre figure is described only as "today" in a document published in November 2024. The newer FES 2025 estimate of 7.6 TWh would imply a higher share, but no matching Great Britain total for the same period is published in that source, so no updated share is calculated. Aggregate data centres, not AI-specific.',
   'Derived from NESO Clean Power 2030, Annex 1, sections 2.1.1 and 2.1.2.', false),
  ('gb-data-centre-demand-2035', 'By 2035 - FES 2025 pathways', NULL::numeric,
   '30 to 41 TWh (Ten Year Forecast 33; Hydrogen Evolution 30; Electric Engagement 41)', 'TWh per year',
   'National Energy System Operator (NESO)', 'https://www.neso.energy/document/370901/download', 'forecast',
   '2025-11-05', 'great_britain', NULL,
   'Each figure is a separate FES 2025 pathway. Pathways are not equally likely and no average is published.',
   'Scenario projections, not predictions. Great Britain only. Reported individually because averaging pathways is not authorised by the methodology. Aggregate data-centre demand, not AI-specific.',
   'NESO Grid Code Development Forum, 5 November 2025, slide 10.', false),
  ('gb-data-centre-demand-2050', 'By 2050 - FES 2025 pathways', NULL::numeric,
   '51 to 71 TWh (Hydrogen Evolution 51; Electric Engagement 71; no Ten Year Forecast value)', 'TWh per year',
   'National Energy System Operator (NESO)', 'https://www.neso.energy/document/370901/download', 'forecast',
   '2025-11-05', 'great_britain', NULL,
   'Each figure is a separate FES 2025 pathway.',
   'Scenario projections, not predictions. Great Britain only. The Ten Year Forecast pathway does not extend to 2050, so no value exists for it.',
   'NESO Grid Code Development Forum, 5 November 2025, slide 10.', false),
  ('gb-data-centre-demand-2050', 'By 2050 - Clean Power 2030 (November 2024)', 62::numeric, NULL, 'TWh per year',
   'National Energy System Operator (NESO)', 'https://www.neso.energy/document/346791/download', 'forecast',
   '2024-11-05', 'great_britain', NULL, NULL,
   'Forecast, not an observation. Great Britain only. NESO states demand reaches up to 62 TWh in 2050 - an upper figure, not a central estimate. Retained as the published November 2024 position alongside the newer FES 2025 range.',
   'NESO Clean Power 2030, Annex 1, section 2.1.4.', false)
) AS v(slug, period_label, value, value_text, unit, source_name, source_url, classification,
       publication_date, geo, calc_method, assumptions, limitations, notes, is_estimate)
JOIN public.index_indicators i ON i.slug = v.slug;

-- 5. Contracted connection demand in the GB queue ---------------
UPDATE public.index_indicators
SET name = 'Total contracted connection demand in the GB queue',
    unit = 'GW',
    source_name = 'National Energy System Operator (NESO)',
    source_url = 'https://www.neso.energy/document/370901/download',
    source_type = 'operator',
    data_classification = 'verified',
    confidence_level = 'medium',
    collection_method = 'manual',
    methodology = 'Reported by NESO citing Energy Networks Association connections data.',
    caveats = 'Total contracted connection demand across all technologies and sectors, not a data-centre-only figure.',
    status = 'published',
    last_updated_at = now()
WHERE slug = 'grid-connection-queue';

INSERT INTO public.index_datapoints
  (indicator_id, period_label, value, unit, confidence_level, source_name, source_url, status,
   data_classification, publication_date, reviewed_at, geographic_coverage, confidence_level_rating,
   limitations, notes, is_estimate)
SELECT i.id, 'As at November 2025', 125, 'GW', 'medium',
  'National Energy System Operator (NESO)', 'https://www.neso.energy/document/370901/download', 'published',
  'verified', '2025-11-05', '2026-08-12', 'great_britain', 'medium',
  'All-technology figure: this is total contracted connection demand in the queue, not demand from data centres, and must not be read as such. Great Britain only. A contracted connection is not evidence that a project will be built.',
  'NESO Grid Code Development Forum, 5 November 2025, slide 10, citing Energy Networks Association connections data.', false
FROM public.index_indicators i WHERE i.slug = 'grid-connection-queue';

-- 6. Regional colocation IT capacity (Data Centre Growth) --------
INSERT INTO public.index_indicators
  (slug, name, short_name, category, description, unit, weight, direction, source_name, source_url,
   source_type, update_frequency, methodology, confidence_level, collection_method, caveats,
   display_order, status, subindex_id, data_classification, is_forecast, last_updated_at)
SELECT 'colocation-it-capacity-' || v.slug,
       'Colocation data-centre IT capacity - ' || v.region,
       v.region, 'infrastructure',
       'Maximum rated IT load of colocation data centres in the ' || v.region || ' ITL1 region.',
       'MW', 1, 'higher_is_more_pressure',
       'Department for Science, Innovation and Technology (DSIT)',
       'https://www.gov.uk/government/publications/estimate-of-data-centre-capacity-great-britain-2024/estimate-of-data-centre-capacity-great-britain-2024',
       'official', 'ad_hoc',
       'DSIT internal dataset of colocation data centres, estimated from rack densities and floor area, summed by ITL1 region.',
       'medium', 'manual',
       'Colocation facilities only; enterprise data centres are excluded. ITL1 regions differ from the nine index regions - Slough and the Thames Valley falls within South East.',
       v.ord, 'published',
       (SELECT id FROM public.index_subindices WHERE slug = 'data-centre-growth'),
       'verified', false, now()
FROM (VALUES
  ('london','London',30), ('south-east','South East',31), ('wales','Wales',32),
  ('south-west','South West',33), ('north-west','North West',34), ('east-of-england','East',35),
  ('scotland','Scotland',36), ('north-east','North East',37),
  ('yorkshire-and-the-humber','Yorkshire and the Humber',38),
  ('west-midlands','West Midlands',39), ('east-midlands','East Midlands',40)
) AS v(slug, region, ord)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.index_datapoints
  (indicator_id, period_label, value, unit, confidence_level, source_name, source_url, status,
   data_classification, publication_date, reviewed_at, geographic_coverage, confidence_level_rating,
   limitations, notes, is_estimate)
SELECT i.id, 'Autumn 2024', v.mw, 'MW', 'medium',
  'Department for Science, Innovation and Technology (DSIT)',
  'https://www.gov.uk/government/publications/estimate-of-data-centre-capacity-great-britain-2024/estimate-of-data-centre-capacity-great-britain-2024',
  'published', 'verified', '2025-05-01', '2026-08-12', 'uk_region', 'medium',
  'Maximum rated IT load only - not total facility load, campus capacity or grid-connection capacity. Colocation facilities only; enterprise data centres are excluded. DSIT modelled estimate. Northern Ireland is not covered by this source.',
  'DSIT, Estimate of Data Centre Capacity: Great Britain 2024 - regional table.', true
FROM (VALUES
  ('london', 1048), ('south-east', 128), ('wales', 154), ('south-west', 53), ('north-west', 52),
  ('east-of-england', 44), ('scotland', 30), ('north-east', 17), ('yorkshire-and-the-humber', 16),
  ('west-midlands', 15), ('east-midlands', 9)
) AS v(slug, mw)
JOIN public.index_indicators i ON i.slug = 'colocation-it-capacity-' || v.slug;

-- 7. Change log --------------------------------------------------
INSERT INTO public.index_change_log
  (entity_type, field_name, previous_value, new_value, reason, changed_by_label, methodology_version, is_public)
VALUES
  ('datapoint', 'gb-colocation-data-centre-capacity.publication_date', '2025-03-11', '2025-05-01',
   'Phase 1 audit: the DSIT research and analysis page was published on 1 May 2025; 11 March 2025 is the date the underlying Parliamentary Question answer was first published. Both dates are now recorded.',
   'AI Energy Intelligence editorial', '1.0', true),
  ('datapoint', 'gb-data-centre-electricity-consumption.limitations', 'No limitation recorded',
   'Flagged as superseded by NESO FES 2025 (7.6 TWh); retained as the published November 2024 position.',
   'Phase 1 audit: a newer NESO estimate exists. The historical record is retained, not overwritten.',
   'AI Energy Intelligence editorial', '1.0', true),
  ('datapoint', 'gb-data-centre-electricity-consumption-2030.limitations', 'No limitation recorded',
   'Flagged as superseded for forecasting purposes by FES 2025 (30-41 TWh by 2035).',
   'Phase 1 audit: FES 2025 replaces the Clean Power 2030 demand trajectory. The historical forecast is retained.',
   'AI Energy Intelligence editorial', '1.0', true),
  ('datapoint', 'uk-ai-capable-capacity-requirement-2030.value_text', '6 GW', 'At least 6 GW',
   'Phase 1 audit: the UK Compute Roadmap says "at least 6GW". The published wording was more precise than the source.',
   'AI Energy Intelligence editorial', '1.0', true),
  ('indicator', 'ai-attributable-electricity-demand.caveats', 'No caveat recorded',
   'Recorded why this indicator remains "Insufficient evidence": no reviewed UK source separates AI workloads from wider data-centre consumption.',
   'Phase 1 audit: data-gap note required by the methodology.',
   'AI Energy Intelligence editorial', '1.0', true),
  ('datapoint', 'Electricity Demand Index', 'No record',
   'Added: GB data-centre demand 7.6 TWh (FES 2025); connected capacity 2.4 GW; GB total demand 263 TWh (2023); GB peak demand 58 GW (2023); GB total demand 287 TWh (2030 forecast); calculated data-centre share 1.9%; 2035 demand 30-41 TWh; 2050 demand 51-71 TWh plus the earlier 62 TWh figure.',
   'Phase 2 expansion from NESO primary documents opened and read in full.',
   'AI Energy Intelligence editorial', '1.0', true),
  ('datapoint', 'Data Centre Growth Index', 'No record',
   'Added colocation data-centre IT capacity for eleven Great Britain regions (autumn 2024), totalling 1.6 GW.',
   'Phase 3 expansion from the DSIT regional capacity table.',
   'AI Energy Intelligence editorial', '1.0', true),
  ('datapoint', 'Grid Pressure Index', 'No record',
   'Added total contracted connection demand in the GB queue: 125 GW (November 2025), recorded as an all-technology figure.',
   'Phase 4 expansion from the NESO Grid Code Development Forum pack.',
   'AI Energy Intelligence editorial', '1.0', true);