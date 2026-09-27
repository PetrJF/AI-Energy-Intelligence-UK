DROP POLICY IF EXISTS "Anyone can view data centres" ON public.data_centres;
CREATE POLICY "Public can view verified data centres"
ON public.data_centres FOR SELECT TO anon, authenticated
USING (is_placeholder = false);
CREATE POLICY "Admins can view all data centres"
ON public.data_centres FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Anyone can view infrastructure projects" ON public.infrastructure_projects;
CREATE POLICY "Public can view verified infrastructure projects"
ON public.infrastructure_projects FOR SELECT TO anon, authenticated
USING (is_placeholder = false);
CREATE POLICY "Admins can view all infrastructure projects"
ON public.infrastructure_projects FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));