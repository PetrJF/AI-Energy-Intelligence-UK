-- ============ STAGE 1: SOURCE REGISTER ============
ALTER TABLE public.index_sources
  ADD COLUMN IF NOT EXISTS reporting_period text,
  ADD COLUMN IF NOT EXISTS geographic_coverage text NOT NULL DEFAULT 'united_kingdom',
  ADD COLUMN IF NOT EXISTS source_class text NOT NULL DEFAULT 'primary',
  ADD COLUMN IF NOT EXISTS reliability_status text NOT NULL DEFAULT 'unverified',
  ADD COLUMN IF NOT EXISTS last_reviewed_at date;

ALTER TABLE public.index_sources
  ADD CONSTRAINT index_sources_geo_ck CHECK (geographic_coverage IN
    ('united_kingdom','great_britain','england','scotland','wales','northern_ireland','uk_region','local_authority','individual_facility','other')),
  ADD CONSTRAINT index_sources_class_ck CHECK (source_class IN ('primary','secondary')),
  ADD CONSTRAINT index_sources_reliability_ck CHECK (reliability_status IN
    ('primary_verified','reliable_secondary','supporting_only','unverified','superseded'));

CREATE TABLE IF NOT EXISTS public.index_source_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid NOT NULL REFERENCES public.index_sources(id) ON DELETE CASCADE,
  entity_type text NOT NULL CHECK (entity_type IN ('indicator','datapoint','project','region_stat','grid_evidence','grid_assessment','subindex')),
  entity_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'supporting' CHECK (role IN ('primary','supporting')),
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source_id, entity_type, entity_id)
);
GRANT SELECT ON public.index_source_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.index_source_links TO authenticated;
GRANT ALL ON public.index_source_links TO service_role;
ALTER TABLE public.index_source_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "source links readable" ON public.index_source_links FOR SELECT USING (true);
CREATE POLICY "admins manage source links" ON public.index_source_links FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ STAGE 2: ELECTRICITY-DEMAND DATA ENTRIES ============
ALTER TABLE public.index_datapoints
  ADD COLUMN IF NOT EXISTS geographic_coverage text NOT NULL DEFAULT 'united_kingdom',
  ADD COLUMN IF NOT EXISTS source_id uuid REFERENCES public.index_sources(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS calculation_method text,
  ADD COLUMN IF NOT EXISTS calculation_inputs jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS assumptions text,
  ADD COLUMN IF NOT EXISTS limitations text,
  ADD COLUMN IF NOT EXISTS confidence_level_rating text NOT NULL DEFAULT 'not_assessed';

ALTER TABLE public.index_datapoints
  ADD CONSTRAINT index_datapoints_conf_ck CHECK (confidence_level_rating IN ('high','medium','low','not_assessed'));

CREATE OR REPLACE FUNCTION public.validate_datapoint_publication()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.status = 'published'
     AND NEW.data_classification IN ('calculated','aie_estimate')
     AND (coalesce(btrim(NEW.calculation_method), '') = ''
          OR (NEW.source_id IS NULL AND coalesce(btrim(NEW.source_url), '') = '')) THEN
    RAISE EXCEPTION 'A calculated or estimated figure cannot be published without a calculation method and a source record.';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER index_datapoints_validate_publication
  BEFORE INSERT OR UPDATE ON public.index_datapoints
  FOR EACH ROW EXECUTE FUNCTION public.validate_datapoint_publication();

-- ============ STAGE 3: DATA-CENTRE PROJECT REGISTER ============
ALTER TABLE public.dc_projects
  ADD COLUMN IF NOT EXISTS record_ref text,
  ADD COLUMN IF NOT EXISTS campus_name text,
  ADD COLUMN IF NOT EXISTS developer text,
  ADD COLUMN IF NOT EXISTS address_line text,
  ADD COLUMN IF NOT EXISTS postcode text,
  ADD COLUMN IF NOT EXISTS local_authority text,
  ADD COLUMN IF NOT EXISTS nation text,
  ADD COLUMN IF NOT EXISTS facility_type text NOT NULL DEFAULT 'type_unconfirmed',
  ADD COLUMN IF NOT EXISTS construction_start_date date,
  ADD COLUMN IF NOT EXISTS actual_operational_date date,
  ADD COLUMN IF NOT EXISTS it_capacity_mw numeric,
  ADD COLUMN IF NOT EXISTS stated_electricity_demand_mw numeric,
  ADD COLUMN IF NOT EXISTS grid_connection_mw numeric,
  ADD COLUMN IF NOT EXISTS campus_capacity_mw numeric,
  ADD COLUMN IF NOT EXISTS capacity_unit text NOT NULL DEFAULT 'MW',
  ADD COLUMN IF NOT EXISTS capacity_definition text NOT NULL DEFAULT 'not_disclosed',
  ADD COLUMN IF NOT EXISTS primary_source_id uuid REFERENCES public.index_sources(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS last_verified_at date,
  ADD COLUMN IF NOT EXISTS admin_notes text,
  ADD COLUMN IF NOT EXISTS duplicate_reviewed boolean NOT NULL DEFAULT false;

ALTER TABLE public.dc_projects
  ADD CONSTRAINT dc_projects_facility_type_ck CHECK (facility_type IN
    ('hyperscale','colocation','enterprise','ai_hpc','government_research','edge','type_unconfirmed')),
  ADD CONSTRAINT dc_projects_capacity_def_ck CHECK (capacity_definition IN
    ('it_load','total_facility_load','grid_connection','campus_capacity','unclear','not_disclosed')),
  ADD CONSTRAINT dc_projects_nation_ck CHECK (nation IS NULL OR nation IN ('england','scotland','wales','northern_ireland'));

CREATE UNIQUE INDEX IF NOT EXISTS dc_projects_planning_ref_uniq
  ON public.dc_projects (planning_authority, planning_reference)
  WHERE planning_authority IS NOT NULL AND planning_reference IS NOT NULL;

-- ============ STAGE 4: GRID EVIDENCE REGISTER ============
CREATE TABLE IF NOT EXISTS public.grid_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  region_slug text NOT NULL REFERENCES public.dc_regions(slug) ON UPDATE CASCADE,
  local_area text,
  network_level text NOT NULL DEFAULT 'not_established'
    CHECK (network_level IN ('transmission','distribution','both','not_established')),
  network_operator text,
  constraint_type text NOT NULL DEFAULT 'constraint_not_established'
    CHECK (constraint_type IN ('connection_queue','substation_capacity','transmission_capacity','distribution_capacity','reinforcement_requirement','connection_delay','flexible_connection','local_congestion','constraint_not_established')),
  description text NOT NULL,
  connection_delay_mentioned text,
  reinforcement_required text,
  investment_announced text,
  flexible_connection_available text,
  relevant_period text,
  relevant_date date,
  source_id uuid REFERENCES public.index_sources(id) ON DELETE SET NULL,
  confidence_level text NOT NULL DEFAULT 'not_assessed'
    CHECK (confidence_level IN ('high','medium','low','not_assessed')),
  last_reviewed_at date,
  admin_notes text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.grid_evidence TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.grid_evidence TO authenticated;
GRANT ALL ON public.grid_evidence TO service_role;
ALTER TABLE public.grid_evidence ENABLE ROW LEVEL SECURITY;
CREATE POLICY "published grid evidence readable" ON public.grid_evidence FOR SELECT USING (status = 'published');
CREATE POLICY "admins manage grid evidence" ON public.grid_evidence FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER grid_evidence_set_updated_at BEFORE UPDATE ON public.grid_evidence
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.grid_pressure_ratings
  ADD COLUMN IF NOT EXISTS assessment_date date,
  ADD COLUMN IF NOT EXISTS next_review_at date,
  ADD COLUMN IF NOT EXISTS assessed_by text,
  ADD COLUMN IF NOT EXISTS methodology_version text NOT NULL DEFAULT 'v1.0',
  ADD COLUMN IF NOT EXISTS limitations text;

CREATE TABLE IF NOT EXISTS public.grid_assessment_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES public.grid_pressure_ratings(id) ON DELETE CASCADE,
  evidence_id uuid NOT NULL REFERENCES public.grid_evidence(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (assessment_id, evidence_id)
);
GRANT SELECT ON public.grid_assessment_evidence TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.grid_assessment_evidence TO authenticated;
GRANT ALL ON public.grid_assessment_evidence TO service_role;
ALTER TABLE public.grid_assessment_evidence ENABLE ROW LEVEL SECURITY;
CREATE POLICY "assessment evidence readable" ON public.grid_assessment_evidence FOR SELECT USING (true);
CREATE POLICY "admins manage assessment evidence" ON public.grid_assessment_evidence FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.validate_grid_rating_publication()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE evidence_count integer;
BEGIN
  IF NEW.status = 'published' AND NEW.rating <> 'insufficient_evidence' THEN
    SELECT count(*) INTO evidence_count
    FROM public.grid_assessment_evidence gae
    JOIN public.grid_evidence ge ON ge.id = gae.evidence_id AND ge.status = 'published'
    WHERE gae.assessment_id = NEW.id;
    IF evidence_count < 2 THEN
      RAISE EXCEPTION 'A published grid pressure rating requires at least two published supporting evidence records; use "Insufficient evidence" instead.';
    END IF;
    IF coalesce(btrim(NEW.rationale), '') = '' THEN
      RAISE EXCEPTION 'A published grid pressure rating requires a written justification.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER grid_ratings_validate_publication
  BEFORE INSERT OR UPDATE ON public.grid_pressure_ratings
  FOR EACH ROW EXECUTE FUNCTION public.validate_grid_rating_publication();

-- ============ STAGE 9: CORRECTIONS QUEUE ============
CREATE TABLE IF NOT EXISTS public.correction_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_or_record text NOT NULL,
  description text NOT NULL,
  suggested_correction text,
  source_url text,
  submitter_name text,
  submitter_email text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','under_review','accepted','rejected')),
  admin_notes text,
  reviewed_at timestamptz,
  reviewed_by uuid,
  user_agent text,
  ip_hash text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.correction_submissions TO authenticated;
GRANT ALL ON public.correction_submissions TO service_role;
ALTER TABLE public.correction_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read corrections" ON public.correction_submissions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage corrections" ON public.correction_submissions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete corrections" ON public.correction_submissions FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER correction_submissions_set_updated_at BEFORE UPDATE ON public.correction_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ STAGE 11: CHANGE HISTORY ============
CREATE TABLE IF NOT EXISTS public.index_change_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid,
  field_name text,
  previous_value text,
  new_value text,
  reason text NOT NULL,
  source_id uuid REFERENCES public.index_sources(id) ON DELETE SET NULL,
  changed_by uuid,
  changed_by_label text,
  methodology_version text,
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.index_change_log TO anon;
GRANT SELECT, INSERT ON public.index_change_log TO authenticated;
GRANT ALL ON public.index_change_log TO service_role;
ALTER TABLE public.index_change_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public change log readable" ON public.index_change_log FOR SELECT USING (is_public = true);
CREATE POLICY "admins manage change log" ON public.index_change_log FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.methodology_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version text NOT NULL UNIQUE,
  effective_date date NOT NULL,
  summary text NOT NULL,
  changes text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.methodology_versions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.methodology_versions TO authenticated;
GRANT ALL ON public.methodology_versions TO service_role;
ALTER TABLE public.methodology_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "published methodology versions readable" ON public.methodology_versions FOR SELECT USING (status = 'published');
CREATE POLICY "admins manage methodology versions" ON public.methodology_versions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER methodology_versions_set_updated_at BEFORE UPDATE ON public.methodology_versions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();