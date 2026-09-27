UPDATE public.dc_projects
SET slug = 'equinix-ld8-london-docklands',
    name = 'Equinix LD8, London Docklands',
    town = 'London',
    postcode = 'E14 9GE',
    address_line = 'Harbour Exchange Square, London Docklands',
    region = 'London',
    index_region_slug = 'london',
    local_authority = 'London Borough of Tower Hamlets',
    planning_authority = 'London Borough of Tower Hamlets',
    summary = 'Operational Equinix colocation facility in London Docklands (E14 9GE). The Environment Agency permit covers 64 MWth of standby generator thermal input, which is a heat input figure and not an IT-load capacity, so no capacity figure is recorded.',
    admin_notes = 'Corrected 18 Aug 2026: the record previously placed this facility in Slough under Slough Borough Council. The cited Environment Agency permit EPR/DP3906BE/A001 is registered to E14 9GE and names the site as Equinix LD8, London. Location, authority and slug corrected accordingly. No capacity figure is published.',
    sources = '[{"date":"2023-10-27","publisher":"Environment Agency","title":"E14 9GE, Equinix (UK) Limited: environmental permit issued - EPR/DP3906BE/A001","url":"https://www.gov.uk/government/publications/e14-9ge-equinix-uk-limited-environmental-permit-issued-eprdp3906bea001"}]'::jsonb,
    planning_reference = 'EPR/DP3906BE/A001 (environmental permit)',
    decision_date = '2023-10-27',
    last_verified_at = '2026-08-18'
WHERE slug = 'equinix-ld8-slough';