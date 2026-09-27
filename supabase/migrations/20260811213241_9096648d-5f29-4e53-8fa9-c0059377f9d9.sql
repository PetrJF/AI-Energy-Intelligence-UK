-- ============ Sub-indices ============
CREATE TABLE public.index_subindices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  intro text,
  status_label text NOT NULL DEFAULT 'Baseline in development',
  score numeric,
  direction text NOT NULL DEFAULT 'unknown' CHECK (direction IN ('rising','stable','falling','unknown')),
  period_label text,
  last_reviewed_at date,
  display_order integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.index_subindices TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.index_subindices TO authenticated;
GRANT ALL ON public.index_subindices TO service_role;
ALTER TABLE public.index_subindices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subindices public read published" ON public.index_subindices FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "subindices admin read" ON public.index_subindices FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "subindices admin write" ON public.index_subindices FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER index_subindices_set_updated_at BEFORE UPDATE ON public.index_subindices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ Indicator extensions ============
ALTER TABLE public.index_indicators
  ADD COLUMN IF NOT EXISTS subindex_id uuid REFERENCES public.index_subindices(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS data_classification text NOT NULL DEFAULT 'not_available'
    CHECK (data_classification IN ('verified','industry_estimate','aie_estimate','forecast','not_disclosed','not_available')),
  ADD COLUMN IF NOT EXISTS is_forecast boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS forecast_year integer;

-- ============ Datapoint extensions ============
ALTER TABLE public.index_datapoints
  ADD COLUMN IF NOT EXISTS previous_value numeric,
  ADD COLUMN IF NOT EXISTS percent_change numeric,
  ADD COLUMN IF NOT EXISTS data_classification text NOT NULL DEFAULT 'not_available'
    CHECK (data_classification IN ('verified','industry_estimate','aie_estimate','forecast','not_disclosed','not_available')),
  ADD COLUMN IF NOT EXISTS publication_date date,
  ADD COLUMN IF NOT EXISTS reviewed_at date;

-- ============ Regions ============
CREATE TABLE public.dc_regions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.dc_regions TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.dc_regions TO authenticated;
GRANT ALL ON public.dc_regions TO service_role;
ALTER TABLE public.dc_regions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "regions public read" ON public.dc_regions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "regions admin write" ON public.dc_regions FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER dc_regions_set_updated_at BEFORE UPDATE ON public.dc_regions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.dc_regions (slug, name, display_order) VALUES
  ('london','London',1),
  ('slough-thames-valley','Slough and the Thames Valley',2),
  ('south-east-england','South East England',3),
  ('midlands','Midlands',4),
  ('north-west-england','North West England',5),
  ('north-east-and-yorkshire','North East and Yorkshire',6),
  ('scotland','Scotland',7),
  ('wales','Wales',8),
  ('northern-ireland','Northern Ireland',9);

-- ============ Regional data-centre figures ============
CREATE TABLE public.dc_region_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region_slug text NOT NULL REFERENCES public.dc_regions(slug) ON DELETE CASCADE,
  operational_count integer,
  under_construction_count integer,
  approved_count integer,
  proposed_count integer,
  operational_mw numeric,
  development_mw numeric,
  hyperscale_count integer,
  latest_decision text,
  latest_decision_date date,
  data_completeness text NOT NULL DEFAULT 'none' CHECK (data_completeness IN ('complete','partial','minimal','none')),
  notes text,
  last_reviewed_at date,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.dc_region_stats TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.dc_region_stats TO authenticated;
GRANT ALL ON public.dc_region_stats TO service_role;
ALTER TABLE public.dc_region_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "region stats public read published" ON public.dc_region_stats FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "region stats admin read" ON public.dc_region_stats FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "region stats admin write" ON public.dc_region_stats FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER dc_region_stats_set_updated_at BEFORE UPDATE ON public.dc_region_stats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ Grid pressure ratings ============
CREATE TABLE public.grid_pressure_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region_slug text NOT NULL REFERENCES public.dc_regions(slug) ON DELETE CASCADE,
  rating text NOT NULL DEFAULT 'insufficient_evidence'
    CHECK (rating IN ('low','moderate','high','severe','insufficient_evidence')),
  rationale text NOT NULL,
  connection_demand_evidence text,
  known_delays text,
  network_constraints text,
  planned_investment text,
  flexible_connections text,
  evidence_confidence text NOT NULL DEFAULT 'low' CHECK (evidence_confidence IN ('high','medium','low','indicative')),
  source_title text,
  source_url text,
  last_reviewed_at date,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.grid_pressure_ratings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.grid_pressure_ratings TO authenticated;
GRANT ALL ON public.grid_pressure_ratings TO service_role;
ALTER TABLE public.grid_pressure_ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "grid ratings public read published" ON public.grid_pressure_ratings FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "grid ratings admin read" ON public.grid_pressure_ratings FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "grid ratings admin write" ON public.grid_pressure_ratings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER grid_pressure_ratings_set_updated_at BEFORE UPDATE ON public.grid_pressure_ratings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ Source register ============
CREATE TABLE public.index_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation text NOT NULL,
  title text NOT NULL,
  url text,
  publication_date date,
  source_type text NOT NULL DEFAULT 'official'
    CHECK (source_type IN ('official','regulator','operator','press','industry','modelled','survey','academic')),
  indicators_supported text,
  accessed_at date,
  notes text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.index_sources TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.index_sources TO authenticated;
GRANT ALL ON public.index_sources TO service_role;
ALTER TABLE public.index_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sources public read published" ON public.index_sources FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "sources admin read" ON public.index_sources FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "sources admin write" ON public.index_sources FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER index_sources_set_updated_at BEFORE UPDATE ON public.index_sources FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ Project extensions ============
ALTER TABLE public.dc_projects
  ADD COLUMN IF NOT EXISTS planning_decision text,
  ADD COLUMN IF NOT EXISTS decision_date date,
  ADD COLUMN IF NOT EXISTS expected_operational_date date,
  ADD COLUMN IF NOT EXISTS index_region_slug text REFERENCES public.dc_regions(slug) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS dc_projects_planning_ref_unique
  ON public.dc_projects (planning_authority, planning_reference)
  WHERE planning_authority IS NOT NULL AND planning_reference IS NOT NULL;