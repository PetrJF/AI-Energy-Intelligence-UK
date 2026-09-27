ALTER TABLE public.dc_regions
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published';

ALTER TABLE public.dc_regions
  ADD CONSTRAINT dc_regions_status_check CHECK (status IN ('draft','published','archived'));

DROP POLICY IF EXISTS "regions public read" ON public.dc_regions;

CREATE POLICY "regions public read published"
ON public.dc_regions
FOR SELECT
TO anon, authenticated
USING (status = 'published');

CREATE POLICY "admins read all regions"
ON public.dc_regions
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
