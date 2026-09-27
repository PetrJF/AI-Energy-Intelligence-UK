CREATE TABLE public.dc_projects (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  operator text,
  town text,
  region text NOT NULL DEFAULT 'Unknown',
  country text NOT NULL DEFAULT 'United Kingdom',
  latitude double precision,
  longitude double precision,
  status text NOT NULL DEFAULT 'proposed',
  project_type text NOT NULL DEFAULT 'data_centre',
  ai_relevance text NOT NULL DEFAULT 'unknown',
  announced_date date,
  target_live_date date,
  capacity_mw numeric,
  floor_area_sqm numeric,
  investment_gbp numeric,
  power_notes text,
  cooling_notes text,
  water_notes text,
  grid_connection_notes text,
  planning_reference text,
  planning_authority text,
  summary text,
  key_facts jsonb NOT NULL DEFAULT '[]'::jsonb,
  sources jsonb NOT NULL DEFAULT '[]'::jsonb,
  confidence_level text NOT NULL DEFAULT 'medium',
  verified boolean NOT NULL DEFAULT false,
  verified_at timestamp with time zone,
  status_publication text NOT NULL DEFAULT 'draft',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.dc_projects TO anon;
GRANT SELECT ON public.dc_projects TO authenticated;
GRANT ALL ON public.dc_projects TO service_role;

ALTER TABLE public.dc_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published projects"
ON public.dc_projects FOR SELECT
TO anon, authenticated
USING (status_publication = 'published');

CREATE POLICY "Admins can view all projects"
ON public.dc_projects FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert projects"
ON public.dc_projects FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update projects"
ON public.dc_projects FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete projects"
ON public.dc_projects FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX dc_projects_region_idx ON public.dc_projects (region);
CREATE INDEX dc_projects_status_idx ON public.dc_projects (status);
CREATE INDEX dc_projects_publication_idx ON public.dc_projects (status_publication);

CREATE TRIGGER dc_projects_set_updated_at
BEFORE UPDATE ON public.dc_projects
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();