CREATE TABLE public.dc_zone_milestones (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.dc_projects(id) ON DELETE CASCADE,
  milestone_date date,
  title text NOT NULL,
  stage text NOT NULL DEFAULT 'announced',
  notes text,
  source_title text,
  source_url text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.dc_zone_milestones TO anon;
GRANT SELECT ON public.dc_zone_milestones TO authenticated;
GRANT ALL ON public.dc_zone_milestones TO service_role;

ALTER TABLE public.dc_zone_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read milestones for published zones"
ON public.dc_zone_milestones FOR SELECT
TO anon, authenticated
USING (EXISTS (
  SELECT 1 FROM public.dc_projects p
  WHERE p.id = dc_zone_milestones.project_id
    AND p.status_publication = 'published'
));

CREATE POLICY "Admins can manage milestones"
ON public.dc_zone_milestones FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX dc_zone_milestones_project_idx ON public.dc_zone_milestones(project_id, display_order);

CREATE TRIGGER dc_zone_milestones_set_updated_at
BEFORE UPDATE ON public.dc_zone_milestones
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();