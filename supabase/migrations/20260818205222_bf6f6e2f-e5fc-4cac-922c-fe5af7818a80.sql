-- 1. Bedford Ampthill Road (MHCLG Section 35 direction) -> publish
UPDATE public.dc_projects SET
  status_publication = 'published',
  status = 'proposed',
  verified = true,
  verified_at = now(),
  confidence_level = 'high',
  last_verified_at = '2026-08-18',
  planning_reference = 'PCU/NSIP/P0240/3378443 (Section 35 direction)',
  planning_authority = 'Ministry of Housing, Communities and Local Government (nationally significant infrastructure)',
  decision_date = '2026-06-15',
  planning_decision = 'Section 35 direction granted: treated as nationally significant infrastructure requiring a Development Consent Order',
  summary = 'On 15 June 2026 the Secretary of State issued a direction under section 35 of the Planning Act 2008 requiring this proposed data centre campus at Ampthill Road, Bedford, in Central Bedfordshire, to be consented through a Development Consent Order. This is a designation at the pre-application stage: no application has been examined or decided, and no power capacity figure is published in the direction or decision letter.',
  power_notes = 'No capacity figure is published in the Section 35 direction or decision letter. The developer''s own marketing describes a 143-acre campus with "power secured through a grid connection and on-site generation" but states no MW or MVA figure, so nothing is recorded.',
  admin_notes = 'Verified 18 Aug 2026 against the MHCLG decision letter and the s35 direction document on GOV.UK (both dated 15 June 2026). The direction was requested by TLT LLP for Questpit Limited on 24 April 2026. Site falls in Central Bedfordshire, which sits outside the nine index regions, so no index region is assigned. No Planning Inspectorate national infrastructure case page was found at the time of review. Press-reported scheme value (£9.3bn) and floorspace (1.765m sq ft) are trade press only and are not recorded.',
  sources = '[{"date":"2026-06-15","publisher":"Ministry of Housing, Communities and Local Government","title":"Data Centre Campus, Ampthill Road, Bedford in Central Bedfordshire: Section 35 Direction, Planning Act 2008","url":"https://www.gov.uk/government/publications/data-centre-campus-ampthill-road-bedford-in-central-bedfordshire-section-35-direction-planning-act-2008"},{"date":"2026-06-15","publisher":"Ministry of Housing, Communities and Local Government","title":"Section 35 direction decision letter, PCU/NSIP/P0240/3378443","url":"https://assets.publishing.service.gov.uk/media/6a2fca4d1f6fa5c3377e5f27/MHCLG_Decision_Letter.pdf"}]'::jsonb
WHERE slug = 'bedford-ampthill-road-campus';

-- 2. Premier Park, Park Royal (OPDC committee) -> publish
UPDATE public.dc_projects SET
  status_publication = 'published',
  status = 'approved',
  verified = true,
  verified_at = now(),
  confidence_level = 'high',
  last_verified_at = '2026-08-18',
  decision_date = '2026-02-26',
  planning_decision = 'Resolved at OPDC Planning Committee, 26 February 2026',
  floor_area_sqm = 25281,
  address_line = 'Unit F, 6 Premier Park Road',
  postcode = 'NW10 7NZ',
  summary = 'Demolition of an existing building at Unit F, 6 Premier Park Road, Park Royal, and redevelopment to provide a 25,281 sq m (GEA) data centre. Considered and resolved at the Old Oak and Park Royal Development Corporation planning committee on 26 February 2026. No power capacity figure appears in the committee papers.',
  power_notes = 'No MW, MVA or IT-load figure appears in the OPDC committee report or minutes. None is recorded.',
  admin_notes = 'Verified 18 Aug 2026 against the OPDC committee report and printed minutes for the meeting of 26 February 2026, both of which give the reference 25/0196/FUMOPDC and the 25,281 sq m GEA floor area. The previously noted 6 February 2026 date could not be traced to any source and has been discarded. A separate formal decision notice, as distinct from the committee minutes, was not located.',
  sources = '[{"date":"2026-02-26","publisher":"Old Oak and Park Royal Development Corporation","title":"Unit F, 6 Premier Park Road, London NW10 7NZ (25/0196/FUMOPDC) - report to Planning Committee","url":"https://www.london.gov.uk/moderngovopdc/documents/s63035/05%20Premier%20Park%20-%2025.0196.FUMOPDC%20-%20Committee%20report%20-%20FINAL.pdf"},{"date":"2026-02-26","publisher":"Old Oak and Park Royal Development Corporation","title":"Printed minutes, OPDC Planning Committee, 26 February 2026","url":"https://www.london.gov.uk/moderngovopdc/documents/g6377/Printed%20minutes%20Thursday%2026-Feb-2026%2017.30%20OPDC%20Planning%20Committee.pdf"}]'::jsonb
WHERE slug = 'premier-park-park-royal';

-- 3. Kao Data Kenwood Point, Stockport -> publish
UPDATE public.dc_projects SET
  status_publication = 'published',
  status = 'approved',
  verified = true,
  verified_at = now(),
  confidence_level = 'high',
  last_verified_at = '2026-08-18',
  decision_date = '2024-03-04',
  planning_decision = 'Approved at Heatons and Reddish Area Committee',
  floor_area_sqm = 25900,
  capacity_definition = 'not_disclosed',
  summary = 'Demolition of an existing industrial and warehouse building and erection of a 25,900 sq m data centre at Kenwood Point, Stockport, with associated parking, servicing and access. Approved by Stockport Council''s Heatons and Reddish Area Committee. Applicant recorded as KD 5 Limited.',
  power_notes = 'The council application papers state floor area only and contain no power figure. The operator and its adviser describe a "40MW data centre" in press releases issued at acquisition and at approval, but none of them states whether that is IT load, grid connection capacity or total electrical demand, so it is not recorded as capacity and is excluded from every total.',
  admin_notes = 'Verified 18 Aug 2026 against Stockport Council''s democracy site: application DC/090411, registered 27 November 2023, committee report for the Heatons and Reddish Area Committee meeting of 4 March 2024, applicant KD 5 Limited, agent JLL. Trade press reported the approval between 13 and 22 March 2024; the committee date of 4 March 2024 is taken from the council''s own report and the exact decision-notice date has not been retrieved.',
  sources = '[{"date":"2024-03-04","publisher":"Stockport Metropolitan Borough Council","title":"DC/090411 Kao Data, Kenwood Road - report to Heatons and Reddish Area Committee","url":"https://democracy.stockport.gov.uk/mgConvert2PDF.aspx?ID=229727"},{"date":"2024-03-04","publisher":"Stockport Metropolitan Borough Council","title":"Issue details - DC/090411","url":"https://democracy.stockport.gov.uk/mgIssueHistoryHome.aspx?IId=111022"},{"date":"2024-03-27","publisher":"Kao Data (operator statement, secondary)","title":"Kao Data announces planning approved for new GBP 350m Greater Manchester data centre","url":"https://kaodata.com/discover/news/kao-data-announces-planning-approved-for-new-350m-greater-manchester-data-centre-2/"}]'::jsonb
WHERE slug = 'kao-data-stockport';

-- 4. Equinix Wexham Road, Slough -> publish
UPDATE public.dc_projects SET
  status_publication = 'published',
  status = 'approved',
  verified = true,
  verified_at = now(),
  confidence_level = 'high',
  last_verified_at = '2026-08-18',
  planning_reference = 'P/00072/108',
  decision_date = '2025-11-26',
  planning_decision = 'Outline planning permission granted at Planning Committee, 26 November 2025',
  address_line = 'Former AkzoNobel site, Wexham Road',
  postcode = 'SL2 5DS',
  summary = 'Outline planning permission for a phased data centre campus on the former AkzoNobel decorative paints site off Wexham Road, Slough, granted by Slough Borough Council''s planning committee on 26 November 2025. The section 106 agreement includes a commitment to make waste heat available to a future district heating network. No power capacity figure is published.',
  power_notes = 'No MW or MVA figure is published in the council papers or in press coverage. Reporting notes that sufficient grid power for the later phases may not be available until 2038, which is a constraint statement rather than a capacity figure. Nothing is recorded.',
  admin_notes = 'Verified 18 Aug 2026 against Slough Borough Council planning committee minutes of 26 November 2025 and the council democracy agenda item for P/00072/108. Two members proposed refusal and five voted against refusal, so permission was granted. A reported 975,360 sq ft GEA floorspace comes from property press rather than the council papers retrieved and is therefore not recorded.',
  sources = '[{"date":"2025-11-26","publisher":"Slough Borough Council","title":"Minutes, Planning Committee, 26 November 2025","url":"http://democracy.slough.gov.uk/documents/s86820/Minutes%2026112025%20Planning%20Committee.pdf"},{"date":"2025-11-26","publisher":"Slough Borough Council","title":"Agenda item P/00072/108 - Akzo Nobel site, Wexham Road, Slough SL2 5DS","url":"https://democracy.slough.gov.uk/mgAi.aspx?ID=43652"},{"date":"2025-11-28","publisher":"BBC News (secondary)","title":"Data centre for paint factory site approved by Slough councillors","url":"https://www.bbc.co.uk/news/articles/cx2py4yll02o"}]'::jsonb
WHERE slug = 'equinix-wexham-road-slough';

-- 5. Kao Data Harlow Plot F -> publish as submitted under the LDO
UPDATE public.dc_projects SET
  status_publication = 'published',
  status = 'proposed',
  verified = false,
  confidence_level = 'medium',
  last_verified_at = '2026-08-18',
  planning_reference = 'Confirmation of compliance under the London Road (North) Local Development Order, document ref 24042-MCA-XX-XX-RP-A-08900',
  planning_authority = 'Harlow Council (London Road North Local Development Order)',
  summary = 'Two further data centre buildings, KLON-07 and KLON-08, proposed on Plot F of the Kao Data Harlow campus, together with a substation and ancillary offices. The site sits within Harlow''s London Road (North) Local Development Order, so the scheme is progressed through a confirmation-of-compliance application rather than a conventional planning application. Applicant recorded as KD 6 Limited.',
  power_notes = 'No MW, MVA or IT-load figure is published in the submitted documents retrieved. None is recorded.',
  admin_notes = 'Reviewed 18 Aug 2026. The submitted confirmation-of-compliance report (March 2025, ref 24042-MCA-XX-XX-RP-A-08900, prepared by Savills and Marchini Curran Associates) is available on the national planning document repository. No council confirmation notice has been located, so the record is held as proposed rather than approved. Building areas of 261,295 sq ft (KLON-07) and 125,455 sq ft (KLON-08) come from trade press and are not recorded.',
  sources = '[{"date":"2025-03-01","publisher":"KD 6 Limited via Savills and Marchini Curran Associates (application document)","title":"Plot F - KLON-07 and KLON-08, confirmation of compliance application, London Road (North) LDO, Harlow","url":"https://docs.planning.org.uk/20250613/164/SXSVCPHX01700/xz38443r1l0z2jp9.pdf"},{"date":"2026-08-18","publisher":"Harlow Council","title":"Local Development Orders","url":"https://www.harlow.gov.uk/planning-and-building-control/planning-permission/local-development-orders"}]'::jsonb
WHERE slug = 'kao-data-harlow-plot-f';

-- 6. AWS Maylands Avenue, Hemel Hempstead -> publish as submitted
UPDATE public.dc_projects SET
  status_publication = 'published',
  status = 'proposed',
  verified = false,
  confidence_level = 'medium',
  last_verified_at = '2026-08-18',
  address_line = 'Plot 3, Maylands Avenue',
  postcode = 'HP2 4FQ',
  summary = 'A purpose-built data centre for tape-based long-term storage proposed by Amazon Data Services UK Limited at Plot 3, Maylands Avenue, Hemel Hempstead. Submitted documents describe roof-level plant, an HVO-fuelled standby generator compound, chilled-water cooling and rooftop solar. No decision has been published.',
  power_notes = 'No IT load, grid connection or standby generator capacity figure was found in the submitted documents retrieved. None is recorded.',
  admin_notes = 'Reviewed 18 Aug 2026. Evidence is the applicant''s Energy and Sustainability Statement (ref ETH-XX-XX-RP-Z-00001, issued 28 January 2026) for Plot 3, Maylands Avenue HP2 4FQ, published on the national planning document repository; the document does not carry the council application reference. No Dacorum Borough Council reference or decision has been retrieved, so the record stays unverified and is held as proposed.',
  sources = '[{"date":"2026-01-28","publisher":"Amazon Data Services UK Limited (application document)","title":"Energy and Sustainability Statement, Plot 3 Maylands Avenue, Hemel Hempstead HP2 4FQ","url":"https://docs.planning.org.uk/20260206/142/TA103VFOMQQ00/8ks12cyrdxt8irfc.pdf"},{"date":"2026-02-17","publisher":"Data Centre Review (secondary)","title":"Amazon lodges plans for new tape data centre in Hemel Hempstead","url":"https://datacentrereview.com/2026/02/amazon-lodges-plans-for-new-tape-data-centre-in-hemel-hempstead/"}]'::jsonb
WHERE slug = 'aws-maylands-avenue-hemel';

-- 7. Skelton Grange, Leeds -> publish as resolution to grant
UPDATE public.dc_projects SET
  status_publication = 'published',
  status = 'proposed',
  verified = false,
  confidence_level = 'medium',
  last_verified_at = '2026-08-18',
  planning_decision = 'Resolution to grant, Leeds City Council planning committee, April 2026; decision notice not yet issued',
  developer = 'Harworth Group plc (site) with MSFT MCIO Limited (Microsoft)',
  summary = 'A hybrid scheme for data centre buildings on the former Skelton Grange power station site at Stourton, Leeds, brought forward by Harworth Group with Microsoft. Leeds City Council''s planning committee resolved to grant permission in April 2026, but no decision notice has been issued, so the scheme is not yet consented.',
  power_notes = 'No MW, MVA or IT-load figure appears in the council reporting, the Harworth market announcement or any other source retrieved. None is recorded.',
  admin_notes = 'Reviewed 18 Aug 2026. Harworth Group''s regulatory announcement of 27 April 2026 confirms a resolution to grant only, consistent with committee approval reported on 24 April 2026. No decision notice found. The application reference 25/06139/FU appears only on a public forum and has not been confirmed on the Leeds register, so it is not recorded; reference 25/06511/FU was checked and belongs to an unrelated Enfinium waste condition variation. Floorspace is reported inconsistently (about 500,000 sq ft in the Harworth announcement, 424,000 sq ft in trade press) and no council figure has been retrieved, so no floor area is recorded.',
  sources = '[{"date":"2026-04-27","publisher":"Harworth Group plc (regulatory announcement)","title":"Harworth and Microsoft receive resolution to grant","url":"https://www.lse.co.uk/rns/harworth-and-microsoft-receive-resolution-to-grant-6737kbpqxi3jo20.html"},{"date":"2026-04-24","publisher":"BBC News (secondary)","title":"Go-ahead for Microsoft centre on former Leeds power station site","url":"https://www.bbc.co.uk/news/articles/cjd8mdvd07po"}]'::jsonb
WHERE slug = 'skelton-grange-leeds';

-- 8. NGD Newport campus (now Vantage) -> publish as operational
UPDATE public.dc_projects SET
  status_publication = 'published',
  status = 'operational',
  verified = false,
  confidence_level = 'medium',
  last_verified_at = '2026-08-18',
  operator = 'Vantage Data Centers (formerly Next Generation Data)',
  developer = 'Vantage Data Centers',
  name = 'Imperial Park campus, Newport (Vantage, formerly Next Generation Data)',
  address_line = 'Imperial Park, Coedkernew',
  summary = 'An operating colocation campus at Imperial Park, Coedkernew, near Newport, built as Next Generation Data and acquired by Vantage Data Centers in July 2020, since marketed by Vantage under its Cardiff campus branding. It is a separate site from the Vantage Bridgend scheme and from the Rover Way project in Cardiff.',
  power_notes = 'Published capacity figures conflict and none is defined consistently. At acquisition in 2020 the campus was described as an existing 72 MW facility with 108 MW of expansion capacity, giving 180 MW in total, with no stated definition. The operator''s current campus page states 148 MW of critical IT load. A third-party directory states about 150 MW. Because the figures conflict and the 2020 figures carry no definition, no capacity figure is recorded and the campus is excluded from every total.',
  admin_notes = 'Reviewed 18 Aug 2026. The Vantage acquisition of Next Generation Data is confirmed by InfraVia Capital Partners'' investor disclosure (7 April 2020) and Vantage''s completion announcement (27 July 2020). Duplicate check: this is the Imperial Park, Coedkernew site near Newport, distinct from vantage-bridgend (former Ford engine plant) and from rover-way-energy-park-data-centre-cardiff. No Newport City Council planning reference has been retrieved for the campus, so the record stays unverified.',
  duplicate_reviewed = true,
  sources = '[{"date":"2020-04-07","publisher":"InfraVia Capital Partners (investor disclosure)","title":"InfraVia agrees to sell its participation in NGD to Vantage Data Centers","url":"https://infraviacapital.com/infravia-agrees-to-sell-its-participation-in-ngd-to-vantage-data-centers/"},{"date":"2020-07-27","publisher":"Computer Weekly (secondary)","title":"NGD''s mega-colocation campus in Wales acquired by Vantage Data Centers","url":"https://www.computerweekly.com/news/252486699/NGDs-mega-colocation-campus-in-Wales-acquired-by-Vantage-Data-Centers"}]'::jsonb
WHERE slug = 'ngd-newport-campus';

-- Records held unpublished, with evidence notes updated
UPDATE public.dc_projects SET
  last_verified_at = '2026-08-18',
  admin_notes = 'Held 18 Aug 2026: still trade press only. Place North West (14 Dec 2022) and DataCenterDynamics (16 Dec 2022) report permission for two buildings of about 37,000 sq ft each on a 2.4 acre site, but no Salford City Council application reference or decision notice has been retrieved and no capacity figure of any kind is published. Publish once the register entry is found.'
WHERE slug = 'atlasedge-salford';

UPDATE public.dc_projects SET
  last_verified_at = '2026-08-18',
  operator = 'Datum Datacentres (formerly TeleData UK)',
  admin_notes = 'Held 18 Aug 2026: operator question resolved, planning reference still missing. Datum Datacentres acquired TeleData UK in September 2022, so they are the same Wythenshawe operation under successive owners rather than two facilities. Trade press reports permission granted on 3 or 4 October 2023 for a new building of about 45,000 to 46,000 sq ft on Wavell Road next to Delta House. Only a related demolition prior-approval reference (137327/DEM/2023, Simon House) has been found; the full planning permission reference has not. No capacity figure published. Publish once the Manchester City Council reference and decision are confirmed.'
WHERE slug = 'teledata-wythenshawe';

UPDATE public.dc_projects SET
  last_verified_at = '2026-08-18',
  admin_notes = 'Held 18 Aug 2026: no council document retrieved. BBC News and trade press report the application filed 31 July 2025 and permission granted in mid-May 2026 for a heat-reuse data centre next to 1Energy''s Bradford Energy Centre, with capacity reported as 5 MW as filed and 5.6 MW as approved, in both cases with no stated definition. No City of Bradford MDC application reference or decision notice has been retrieved. Publish once the register entry is found; do not record the MW figure until a definition is published.'
WHERE slug = 'deep-green-bradford';

UPDATE public.dc_projects SET
  last_verified_at = '2026-08-18',
  address_line = '45 Maylands Avenue',
  admin_notes = 'Held 18 Aug 2026: no council document retrieved. Site confirmed across sources as 45 Maylands Avenue, Hemel Hempstead: conversion of an existing building into a three-storey data centre of about 5,000 to 5,100 sq m for Northtree Investment Management. Reported decision dates conflict (4 August 2025 in one trade outlet, 29 August 2025 in another) and a reported 10 MW figure carries no definition. No Dacorum Borough Council reference or decision notice retrieved. Publish once the register entry is found.'
WHERE slug = 'northtree-hemel-hempstead';

UPDATE public.dc_projects SET
  last_verified_at = '2026-08-18',
  admin_notes = 'Held 18 Aug 2026: application 24/01678/FULM is a plant replacement scheme (removal of existing cooling plant and diesel generators and installation of 15 modular plant units at Hall 1, 9 Cobalt Park Way), not new data centre capacity, and its decision and date could not be confirmed on the North Tyneside register. Campus capacity claims conflict badly: the operator''s site states four 4 MW IT halls and 80 MW scaling to 180 MW, while a third-party directory states a 32 MW campus of three 8 MW buildings. No figure is defensible, so none is recorded. Publish only when the council decision is confirmed.'
WHERE slug = 'stellium-cobalt-park';

UPDATE public.dc_projects SET
  last_verified_at = '2026-08-18',
  admin_notes = 'Held 18 Aug 2026: this is a site and policy record, not a project. Rushcliffe Borough Council adopted the original Ratcliffe on Soar Local Development Order in July 2023 and its Cabinet approved recommendations on proposed revisions supporting data centre uses on 12 May 2026, following consultation from October 2025. No named operator, scheme or capacity exists for the site and no GOV.UK document designating Ratcliffe-on-Soar as an AI Growth Zone was found. Keep unpublished until a specific scheme is submitted.'
WHERE slug = 'ratcliffe-on-soar-ldo';