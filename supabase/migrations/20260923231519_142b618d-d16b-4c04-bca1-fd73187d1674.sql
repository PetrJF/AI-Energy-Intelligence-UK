DROP POLICY IF EXISTS "Anyone can record a page view" ON public.page_views;
REVOKE INSERT ON public.page_views FROM anon, authenticated;