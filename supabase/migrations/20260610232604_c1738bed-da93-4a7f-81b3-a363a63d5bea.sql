CREATE TABLE public.infrastructure_projects (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_name text NOT NULL,
  organisation text,
  region text,
  project_type text NOT NULL DEFAULT 'data_centre',
  status text NOT NULL DEFAULT 'proposed',
  estimated_value_gbp numeric,
  description text,
  source_url text,
  latitude double precision,
  longitude double precision,
  is_placeholder boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.infrastructure_projects TO anon;
GRANT SELECT ON public.infrastructure_projects TO authenticated;
GRANT ALL ON public.infrastructure_projects TO service_role;

ALTER TABLE public.infrastructure_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view infrastructure projects"
  ON public.infrastructure_projects FOR SELECT
  USING (true);

CREATE TRIGGER update_infrastructure_projects_updated_at
  BEFORE UPDATE ON public.infrastructure_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.infrastructure_projects
  (project_name, organisation, region, project_type, status, estimated_value_gbp, description, source_url, latitude, longitude, is_placeholder)
VALUES
  ('Example AI Campus (Placeholder)', 'Unverified', 'London', 'ai_campus', 'proposed', 1000000000, 'Placeholder example entry. Verify against official announcements before relying on this record.', NULL, 51.5074, -0.1278, true),
  ('Example Hyperscale Data Centre (Placeholder)', 'Unverified', 'North West', 'data_centre', 'under_construction', 750000000, 'Placeholder example entry. Verify against official announcements before relying on this record.', NULL, 53.4808, -2.2426, true),
  ('Example Grid Reinforcement (Placeholder)', 'Unverified', 'Scotland', 'grid_upgrade', 'approved', 400000000, 'Placeholder example entry. Verify against official announcements before relying on this record.', NULL, 55.9533, -3.1883, true),
  ('Example Battery Storage Park (Placeholder)', 'Unverified', 'East of England', 'battery_storage', 'operational', 120000000, 'Placeholder example entry. Verify against official announcements before relying on this record.', NULL, 52.2053, 0.1218, true),
  ('Example Substation Upgrade (Placeholder)', 'Unverified', 'South East', 'substation_upgrade', 'proposed', 60000000, 'Placeholder example entry. Verify against official announcements before relying on this record.', NULL, 51.2362, -0.5704, true);