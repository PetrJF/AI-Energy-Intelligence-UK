-- UK Data Centre Tracker: activity signals (LinkedIn jobs, planning, permits, grid), 6 October 2026
-- NOT APPLIED. Paste into Lovable -> More -> Cloud -> SQL editor to apply.
--
-- Purpose: record job posts as INDICATORS of staffing for new and existing UK AI projects
-- and data centres. A signal shows that hiring is happening. It does not prove planning,
-- funding, grid connection, construction or capacity, and it must never change a
-- Reality Score automatically.
--
-- Rows are inserted with status_publication = 'draft' (admin-only). project_slug is a soft
-- link, so a signal can be stored before its project record exists. project_id is filled
-- in automatically when a matching dc_projects slug is present (see the UPDATE at the end).

-- STEP 1: create the table (safe to re-run)
CREATE TABLE IF NOT EXISTS public.dc_project_signals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES public.dc_projects(id) ON DELETE SET NULL,
  project_slug text,                     -- soft link; may refer to a draft or not-yet-created record
  candidate_label text,                  -- used when there is no tracker record yet
  signal_type text NOT NULL DEFAULT 'job_post'
    CHECK (signal_type IN ('job_post','tender','contract_award','supplier_registration','permit',
                           'planning_application','pre_application','grid','company_filing','other')),
  signal_role text,                      -- e.g. operator, contractor, tenant, recruiter
  organisation text NOT NULL,
  title text NOT NULL,
  location text,
  event_date date,                       -- date the event happened (validation, decision, consultation start)
  listed_date date,                      -- date the source was published/listed (job ads may be reposts)
  observed_date date NOT NULL DEFAULT CURRENT_DATE,
  source_url text NOT NULL,
  source_platform text NOT NULL DEFAULT 'LinkedIn',
  source_class text NOT NULL DEFAULT 'secondary' CHECK (source_class IN ('primary','secondary')),
  reference text,                        -- planning / permit / notice reference
  extract text,                          -- short quote from the posting
  indicates text,                        -- what the post suggests
  does_not_indicate text,                -- explicit limits
  supplier_relevance text,               -- inference only
  link_confidence text NOT NULL DEFAULT 'unconfirmed'
    CHECK (link_confidence IN ('named_in_post','likely','unconfirmed')),
  status_publication text NOT NULL DEFAULT 'draft',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source_url)
);

GRANT SELECT ON public.dc_project_signals TO anon, authenticated;
GRANT ALL ON public.dc_project_signals TO service_role;
ALTER TABLE public.dc_project_signals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published signals on published projects" ON public.dc_project_signals;
CREATE POLICY "Public can view published signals on published projects"
ON public.dc_project_signals FOR SELECT TO anon, authenticated
USING (status_publication = 'published' AND EXISTS (
  SELECT 1 FROM public.dc_projects p
  WHERE p.id = dc_project_signals.project_id AND p.status_publication = 'published'));

DROP POLICY IF EXISTS "Admins can manage signals" ON public.dc_project_signals;
CREATE POLICY "Admins can manage signals"
ON public.dc_project_signals FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS dc_project_signals_project_idx ON public.dc_project_signals (project_id);
CREATE INDEX IF NOT EXISTS dc_project_signals_slug_idx ON public.dc_project_signals (project_slug);

DROP TRIGGER IF EXISTS dc_project_signals_set_updated_at ON public.dc_project_signals;
CREATE TRIGGER dc_project_signals_set_updated_at
BEFORE UPDATE ON public.dc_project_signals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- STEP 2: insert the six LinkedIn signals (observed 6 Oct 2026, window 3-6 Oct 2026)
INSERT INTO public.dc_project_signals
(project_slug,candidate_label,signal_type,signal_role,organisation,title,location,listed_date,observed_date,source_url,extract,indicates,does_not_indicate,supplier_relevance,link_confidence,admin_notes)
VALUES
('cloudhq-lhr-didcot',NULL,'job_post','operator','CloudHQ','CSA Manager','Oxfordshire',DATE '2026-10-05',DATE '2026-10-06',
 'https://uk.linkedin.com/jobs/view/csa-manager-at-cloudhq-llc-4360960530',
 'managing the design and construction of all elements of the CSA for the Oxfordshire project ... development of the Oxfordshire LHR campus',
 'CloudHQ is staffing a client-side design and construction team for its Oxfordshire LHR campus.',
 'Construction start, contractor appointment, planning status, MW or grid connection.',
 'CSA, groundworks and civils packages may be procured.',
 'named_in_post','Low job ID suggests an older ad that has been reposted. Related CloudHQ posts: Electrical Project Manager, Oxfordshire (https://uk.linkedin.com/jobs/view/electrical-project-manager-at-cloudhq-llc-4463506141); Operations Lead - UK, Didcot (https://uk.linkedin.com/jobs/view/operations-lead-uk-at-cloudhq-llc-4447150181). The cloudhq-lhr-didcot record is still a draft in PR #3.'),
(NULL,'Radiant AI deployment, East London','job_post','operator','Radiant','Datacentre Operations Engineer','London',DATE '2026-10-05',DATE '2026-10-06',
 'https://uk.linkedin.com/jobs/view/datacentre-operations-engineer-at-radiant-4457271034',
 'our new East London deployment—Radiant''s newest AI infrastructure site ... spanning multiple data halls',
 'An AI compute deployment in East London is being staffed for operations.',
 'Which host facility, whether it is a new build, or any MW figure.',
 'GPU rack integration, cabling and operations support.',
 'unconfirmed','Probably a tenant inside an existing colocation facility; the host site is not named.'),
(NULL,'AI cloud site, Liverpool / Wirral','job_post','operator','Verda','(Senior) Data Center Technician, Liverpool','Wirral',DATE '2026-10-05',DATE '2026-10-06',
 'https://uk.linkedin.com/jobs/view/senior-data-center-technician-liverpool-at-verda-4474601294',
 'lead the technical execution of deployments and build-outs',
 'Verda is staffing on-site technicians in the Liverpool area, including for build-outs.',
 'The facility, whether it is a new build or a colocation lease, or any MW figure.',
 'Rack builds, copper and fibre cabling, local M&E maintenance.',
 'unconfirmed','Verda also lists a Junior Data Center Technician role (https://uk.linkedin.com/jobs/view/junior-data-center-technician-liverpool-at-verda-4474287800). A recruiter ad (WeEngage, https://uk.linkedin.com/jobs/view/senior-datacenter-technician-at-weengage-group-b-corp%E2%84%A2-4474287113) cites a "new Liverpool site" with high-density GPU infrastructure, but its client is unnamed and may not be Verda.'),
(NULL,'Skanska data centre MEP project, Slough','job_post','contractor','Skanska','Senior Commercial Manager - Data Centres - Expression of Interest','Slough',DATE '2026-10-05',DATE '2026-10-06',
 'https://uk.linkedin.com/jobs/view/senior-commercial-manager-data-centres-expression-of-interest-at-skanska-4473625642',
 'high-value project ... ranging from £100 to £200 million within our ... data centre MEP sector in Slough',
 'Skanska has, or expects, a Slough data centre MEP project at preconstruction stage.',
 'The client, the site, or that a contract has been awarded (the ad is an expression of interest).',
 'MEP subcontract packages.',
 'unconfirmed','The ad text is inconsistent on value: it says both "exceeding £300" and "£100 to £200 million".'),
(NULL,'Wates live data centre refurbishments, Yorkshire','job_post','contractor','Wates Group','Operations Director','England (Yorkshire projects)',DATE '2026-10-03',DATE '2026-10-06',
 'https://uk.linkedin.com/jobs/view/operations-director-at-wates-group-4466393631',
 'two current live projects in the Yorkshire region ... fast track refurbishment projects, particularly within the data centre sector',
 'Wates has two live data centre MEP refurbishment projects in Yorkshire.',
 'The sites, the clients, the scale, or any new-build capacity.',
 'MEP refurbishment subcontracts.',
 'unconfirmed','These are refurbishments of existing facilities, not new capacity.'),
(NULL,'Groq AI inference, Slough','job_post','tenant','Groq','Data Center Technician','Slough',DATE '2026-10-05',DATE '2026-10-06',
 'https://uk.linkedin.com/jobs/view/data-center-technician-at-groq-4475841659',
 'data center infrastructure that powers Groq''s AI inference cloud ... Location: Slough',
 'Groq has, or is planning, AI inference compute in Slough.',
 'The host facility, MW or timing.',
 'Rack and cabling services.',
 'unconfirmed','The host facility is not named.')
ON CONFLICT (source_url) DO NOTHING;


-- STEP 2b: planning, permit and grid signals (observed 6 Oct 2026). Older events are included
-- where they were found during this check; event_date and listed_date are kept separate.
INSERT INTO public.dc_project_signals
(project_slug,candidate_label,signal_type,signal_role,organisation,title,location,event_date,listed_date,source_url,source_platform,source_class,reference,extract,indicates,does_not_indicate,supplier_relevance,link_confidence,admin_notes)
VALUES
(NULL,'Amazon Ridgeway Distribution Centre, Iver','permit','operator','Amazon Data Services UK Limited','Environmental permit consultation: Ridgeway Data Centre Emergency Back Up Generation Facility','Iver, Buckinghamshire SL0 9JQ',DATE '2026-09-24',DATE '2026-09-24','https://consult.environment-agency.gov.uk/psc/sl0-9jq-amazon-data-services-uk-limited-epr-a001/','Environment Agency','primary','EPR/TP3621MM/A001','Opened 24 September 2026; closes 22 October 2026','Amazon is seeking an environmental permit for emergency backup generation at the Ridgeway data centre site.','Permit grant, generator thermal input (not stated on the page), IT load or grid capacity.','Generator, fuel (HVO/diesel) and emissions-monitoring packages.','named_in_post','Planning PL/25/4351/FA shown as Decided by delegated decision on 28 Sep 2026 on PlanIndex (secondary: https://planindex.co.uk/planning-applications/buckinghamshire/pl-25-4351-fa); press report approval with 27 backup generators. Decision notice not opened (Buckinghamshire portal unreachable). Not yet a tracker record; separate from aws-thorney-lane-iver.'),
('thames-valley-park-earley',NULL,'grid','developer','FH Trustees Ltd (Mapeley Beta HL Unit Trust)','Utilities Statement (38792-HML-XX-XX-RP-U-590001), application 262274','Earley, Wokingham',DATE '2026-09-28',DATE '2026-09-28','https://publicaccess.wokingham.gov.uk/PublicAccess_LIVE/Document/ViewDocument?id=6BA284F4A69D4FCB8E2CC5D3EF7AB076','Wokingham Borough Council planning documents','primary','262274','SSEN and National Grid Transmission have confirmed that the required 60MVA will be available from 2037 ... Solid Oxide Fuel Cells with a total capacity of 49.9MW will be installed at day 1 ... a total IT load of approximately 72MWIT','Grid power (60MVA, Reading Primary) is not available until 2037; the scheme relies on 49.9MW of gas-fired fuel cells from day 1. A 100MW peak gas supply from the high-pressure main is proposed (SGN budget cost).','A signed connection agreement (the statement reports confirmation of availability), planning permission, or funding. Keep 72MW IT, 60MVA grid, 49.9MW fuel cells and 100MW gas peak separate.','Fuel cells, gas connection and pressure-reduction, HV directional drilling under the railway, telecoms (Openreach, Virgin Media, Glide, NEOS, Colt, EU Networks named as interested).','named_in_post','Utilities Statement, Electricity section (PDF p.9) and New Gas Supply (p.18). Local radio (B Radio, 5 Oct 2026) reports 1.8MW currently available and up to 110MW requirement; those figures were not found in this statement.'),
('thames-valley-park-earley',NULL,'planning_application','developer','FH Trustees Ltd','Outline application 262274: data centre, fuel cells, backup generation, substation','Earley, Wokingham',DATE '2026-09-28',DATE '2026-10-06','https://planning.wokingham.gov.uk/FastWebPL/detail.asp?AltRef=262274','Wokingham Borough Council','primary','262274','Public Consultation starts 01 October 2026 and ends 29 October 2026 ... No decision','Outline application received and valid on 28 Sep 2026; public consultation 1 to 29 Oct 2026.','Permission; tenant; funding.','Demolition, substation and fuel-cell packages if consented.','named_in_post','95 documents on file at 6 Oct 2026, including Energy Strategy and Energy & Sustainability Statement.'),
(NULL,'Chapelcross data centre campus, Annan (CX Tech)','planning_application','developer','CX Tech Limited','Planning Permission in Principle 26/1649/PIP','Annan, Dumfries and Galloway',DATE '2026-09-28',DATE '2026-10-02','https://www.planninggeek.co.uk/2026/chapelcross-data-centre/','Planning Geek','secondary','26/1649/PIP','26/1649/PIP ... validated 28th September 2026','A PIP application for eight data centre buildings (about 120MW each, measure undefined) is under assessment; comments to 29 Oct 2026.','Grid connection (an adjacent 132kV GSP is cited), funding (£16.5bn is announced only), or any decision. The Scottish Parliament motion seeks no decisions before national guidance.','132kV connection, private-wire renewables, substation.','named_in_post','Dumfries and Galloway portal blocked by a Cloudflare bot check; verify on the council record.'),
(NULL,'Manor Farm West, Poyle (separate from Manor Farm)','planning_application','developer','Manor Farm Propco Limited (Tritax Big Box)','Planning application P/21160/000: three data centres','Poyle, Slough',DATE '2026-09-29',DATE '2026-09-29','https://www.mfwconsultation.co.uk/','Developer consultation site','secondary','P/21160/000','submitted and validated by Slough Borough Council ... reference P/21160/000','Three further data centres (reported 199MW, measure undefined) with a cable route to Laleham substation.','Validation date; a grid offer; funding; tenant. The developer calls it operationally independent of the approved Manor Farm scheme.','Cable route and HV works (Slough, Hillingdon and Spelthorne consents needed).','likely','Not linked to manor-farm-poyle-road-slough: separate scheme next door, should become its own record. Spelthorne consultation 26/00985/MIS seen on Landcycle only. Slough portal not reached.'),
(NULL,'Fawley Waterside, former Fawley Power Station','pre_application','developer','Fawley Waterside Limited','Second public consultation on masterplan (energy, digital, maritime uses)','Fawley, New Forest',DATE '2026-09-29',DATE '2026-10-06','https://fawleywaterside.co.uk/consultation-information/','Developer consultation site','secondary',NULL,'Digital industries, leveraging the proximity to potential future power availability ... up to 190,000 sqm of floorspace','Pre-application consultation 29 Sep to 18 Oct 2026; planning application expected late autumn 2026. National Grid is preparing an Ofgem submission to upgrade the existing substation.','That data centres will be built: the developer site says digital industries, not data centres (the Daily Echo reports data centre plans). No MW, operator or grid offer.','Substation relocation/upgrade works.','unconfirmed','Lead from DCD 5 Oct 2026. EIA scoping request previously made to New Forest District Council.'),
('cambois-data-centre-campus',NULL,'planning_application','developer','QTS (Blackstone)','Reserved matters 26/03028/REM: two data centre buildings, Phase 2','Cambois, Northumberland',DATE '2026-08-28',DATE '2026-08-28','https://publicaccess.northumberland.gov.uk/online-applications/applicationDetails.do?keyVal=TKF3ESQSGWV00&activeTab=summary','Northumberland County Council','primary','26/03028/REM','Reserved matters application for appearance, landscaping, layout and scale on approved application 24/04112/OUTES for two data centre buildings ... on Phase 2','Detailed design for two Phase 2 data centre buildings has been submitted.','Approval, Phase 2 MW, or construction start.','Phase 2 building and M&E packages.','named_in_post','Status Registered at 6 Oct 2026. Applicant name not shown on the summary tab; the QTS link comes from the parent outline 24/04112/OUTES.'),
('cambois-data-centre-campus',NULL,'grid','developer','QTS (Blackstone)','26/02919/FUL: 60kV temporary substation for construction and early operation','Cambois, Northumberland',DATE '2026-08-19',DATE '2026-08-19','https://publicaccess.northumberland.gov.uk/online-applications/applicationDetails.do?keyVal=TJWMVVQSGMV00&activeTab=summary','Northumberland County Council','primary','26/02919/FUL','Application for 60kV temporary substation and associated development for the construction and early operation of the proposed Cambois Data Centre Campus','Temporary power is being arranged for construction and early operation, alongside 11/33kV temporary substations (26/02818/FUL, awaiting decision) and earlier permitted 20kV temporary substations.','The size or date of the permanent grid connection.','HV/MV substation, switchgear and cabling packages.','named_in_post','Related: 26/02818/FUL https://publicaccess.northumberland.gov.uk/online-applications/applicationDetails.do?keyVal=TJEQAUQSGFD00&activeTab=summary'),
(NULL,'14MW data centre, Stanford-le-Hope','planning_application',NULL,'Applicant not shown','Outline 26/01013/OUT: 14MW data centre','Stanford-le-Hope, Thurrock',DATE '2026-09-09',DATE '2026-09-09','https://regs.thurrock.gov.uk/online-applications/applicationDetails.do?keyVal=TKFT96QGLIU00&activeTab=summary','Thurrock Council','primary','26/01013/OUT','Outline application for the erection of a 14MW Data Centre and ancillary development','A small outline data centre application is awaiting decision (received 27 Aug, validated 9 Sep 2026).','Whether 14MW is IT load or grid; applicant; operator.','Small-scale M&E and civils.','named_in_post','Candidate new project.'),
(NULL,'Data centre and ecology park, Dock Road, Tilbury','planning_application',NULL,'Applicant not shown','EIA scoping opinion 26/00894/SCO','Tilbury, Thurrock',DATE '2026-09-04',DATE '2026-09-04','https://regs.thurrock.gov.uk/online-applications/applicationDetails.do?keyVal=TJ6TP1QG0RJ00&activeTab=summary','Thurrock Council','primary','26/00894/SCO','Request for an Environmental Impact Assessment (EIA) Scoping Opinion ... for a proposed Data Centre and Ecology Park ... Decision EIA Required','A data centre is being prepared for a full application with EIA.','Any planning application, scale, operator or grid.','EIA consultants; early design.','named_in_post','Candidate new project. Scoping decision issued 4 Sep 2026.'),
(NULL,'Charlton Riverside / Charlton Gateway data centre proposal','pre_application',NULL,'Charlton Gateway','Proposed 100,000 sq m data development (not yet submitted)','Charlton, Royal Borough of Greenwich',DATE '2026-10-04',DATE '2026-10-04','https://www.bbc.co.uk/news/articles/cj20709qxleyo','BBC News','secondary',NULL,'The proposed 100,000 sq m (1 million sq ft) data development on industrial land at Charlton Riverside has been dubbed concerning','A large data centre proposal is at pre-application stage, opposed by Greenwich Council; closed-loop cooling and backup generators described.','Any application, MW, operator or grid. The promoter says it is not for AI.',NULL,'named_in_post','Candidate new project.'),
(NULL,'Melbourn data centre and heat network (Dataglow)','planning_application','developer','Dataglow Energy (Octopus Energy Generation)','26/03387/FUL: 8MW data centre linked to heat network LDO','Melbourn, South Cambridgeshire',DATE '2026-09-29',DATE '2026-09-27','https://southcambsonline.co.uk/melbourn-data-centre-heat-network/','South Cambs Online','secondary','26/03387/FUL','8MW rated ... a Section 106 legal agreement would tie construction of the data centre to delivery of the heat network','A small data centre with heat reuse is in validation; Cabinet considered the heat-network LDO consultation on 29 Sep 2026; committee provisionally December 2026.','Whether 8MW is IT or grid; any decision.','Heat network and heat-pump packages.','named_in_post','Candidate new project. Verify on the South Cambridgeshire portal.')
ON CONFLICT (source_url) DO NOTHING;

-- STEP 2c: mark the LinkedIn rows' source class (job ads are secondary indicators)
UPDATE public.dc_project_signals SET source_class='secondary', event_date=COALESCE(event_date, listed_date)
WHERE source_platform='LinkedIn';

-- STEP 3: link signals to project records that exist (re-run after PR #3 drafts are applied)
UPDATE public.dc_project_signals s SET project_id = p.id
FROM public.dc_projects p
WHERE s.project_id IS NULL AND s.project_slug IS NOT NULL AND p.slug = s.project_slug;

-- STEP 4 (read-only check)
SELECT signal_type, organisation, reference, project_slug, candidate_label, project_id IS NOT NULL AS linked,
       source_class, link_confidence, event_date, status_publication
FROM public.dc_project_signals ORDER BY event_date DESC NULLS LAST;
