-- UK Data Centre Tracker: hiring signals (LinkedIn), 6 October 2026
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
    CHECK (signal_type IN ('job_post','tender','supplier_registration','permit','other')),
  signal_role text,                      -- e.g. operator, contractor, tenant, recruiter
  organisation text NOT NULL,
  title text NOT NULL,
  location text,
  listed_date date,                      -- date shown on the listing (may be a repost)
  observed_date date NOT NULL DEFAULT CURRENT_DATE,
  source_url text NOT NULL,
  source_platform text NOT NULL DEFAULT 'LinkedIn',
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

-- STEP 3: link signals to project records that exist (re-run after PR #3 drafts are applied)
UPDATE public.dc_project_signals s SET project_id = p.id
FROM public.dc_projects p
WHERE s.project_id IS NULL AND s.project_slug IS NOT NULL AND p.slug = s.project_slug;

-- STEP 4 (read-only check)
SELECT organisation, title, project_slug, project_id IS NOT NULL AS linked, link_confidence, status_publication
FROM public.dc_project_signals ORDER BY listed_date DESC;
