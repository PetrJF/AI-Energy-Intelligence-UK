-- Cambois: IT capacity stated in the Northumberland committee report.
update public.dc_projects set
  it_capacity_mw = 720,
  capacity_definition = 'it_load',
  capacity_unit = 'MW',
  power_notes = 'The approved outline scheme comprises up to ten data centre buildings, each stated in the council committee report as providing approximately 72 MW of IT capacity, giving approximately 720 MW of IT capacity across the full campus. The report also records 580 standby generators across the campus (1 x 1.25 MWe and 57 x 2.4 MWe per building). No grid connection capacity is published.',
  sources = '[{"title":"Strategic Planning Committee report, application 24/04112/OUTES, Land at former power station site, Cambois","url":"https://northumberland.moderngov.co.uk/documents/s24991/2404112OUTES+-+Land+At+Former+Power+Station+Site+On+Northern+Side+Of+Cambois.pdf","publisher":"Northumberland County Council","date":"2025-03-04"}]'::jsonb,
  last_verified_at = date '2026-08-18'
where slug = 'cambois-data-centre-campus';

-- Manor Farm, Slough: IT capacity stated in the Inspector's Report (para 5.5).
update public.dc_projects set
  it_capacity_mw = 72,
  capacity_definition = 'it_load',
  capacity_unit = 'MW',
  power_notes = 'The Inspector''s Report accompanying the Secretary of State''s decision records that the appellant designed the data centre to deliver an IT capacity of around 72 MW. The consented scheme also includes a battery energy storage system with a 100 MW capacity, which stores electricity and is not data centre load. No grid connection capacity is published.',
  last_verified_at = date '2026-08-18'
where slug = 'manor-farm-poyle-road-slough';

-- Rover Way, Cardiff: floor area published; the headline MW figure is battery storage.
update public.dc_projects set
  floor_area_sqm = 50400,
  power_notes = 'No data centre IT load, electrical demand or grid connection capacity has been published for this scheme. The 1,000 MW figure widely reported for this site is the capacity of the battery energy storage facility within the wider energy park, not the power capacity of the data centre.',
  sources = '[{"title":"Planning Committee report, application 24/00624/FUL, Land at Rover Way, Splott","url":"https://cardiff.moderngov.co.uk/documents/s81428/2400624FUL%20Land%20at%20Rover%20Way%20Splott.pdf","publisher":"Cardiff Council","date":"2024-10-17"}]'::jsonb,
  last_verified_at = date '2026-08-18'
where slug = 'rover-way-energy-park-data-centre-cardiff';

-- DC01UK: only an MVA reservation is published, which is not a MW figure.
update public.dc_projects set
  power_notes = 'No IT load or electrical demand figure has been published. The developer states a power reservation of 400 MVA from the transmission network via the Elstree (Letchmore Heath) substation, with connection expected in 2029. MVA measures apparent power and is not directly equivalent to MW, so no capacity figure is recorded here.',
  last_verified_at = date '2026-08-18'
where slug = 'dc01uk-south-mimms';

-- Vantage Bridgend: hybrid application determined 2 October 2025.
update public.dc_projects set
  status = 'approved',
  planning_decision = 'Approved',
  decision_date = date '2025-10-02',
  verified = true,
  verified_at = now(),
  power_notes = 'No IT load, electrical demand or grid connection capacity has been published for this campus. The hybrid permission covers a first data centre building in full and up to ten buildings in outline.',
  sources = '[{"title":"Officers'' Report, application P/25/247/HYB, former Ford engine plant, Waterton","url":"https://democratic.bridgend.gov.uk/documents/s36191/Officers%20Report_P25247HYB.pdf","publisher":"Bridgend County Borough Council"},{"title":"Development Control Committee agenda pack, 2 October 2025 (item 8, P/25/247/HYB)","url":"https://democratic.bridgend.gov.uk/documents/g4852/Public+reports+pack+02nd-Oct-2025+10.00+Development+Control+Committee.pdf?T=10","publisher":"Bridgend County Borough Council","date":"2025-10-02"}]'::jsonb,
  last_verified_at = date '2026-08-18'
where slug = 'vantage-bridgend';