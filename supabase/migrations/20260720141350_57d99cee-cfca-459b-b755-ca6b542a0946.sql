
-- Harden user_roles: remove direct write grants from authenticated users.
-- Admin writes go through service_role (edge/server) or the existing admin-only policy.
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM authenticated;

-- Add explicit restrictive-style policies making admin-only writes unambiguous.
DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;
CREATE POLICY "Only admins can insert roles"
  ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Only admins can update roles" ON public.user_roles;
CREATE POLICY "Only admins can update roles"
  ON public.user_roles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Only admins can delete roles" ON public.user_roles;
CREATE POLICY "Only admins can delete roles"
  ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Storage: add explicit RLS policies for the private blog-images bucket.
-- Service role bypasses RLS (used by admin server upload function).
DROP POLICY IF EXISTS "Admins can read blog-images" ON storage.objects;
CREATE POLICY "Admins can read blog-images"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can upload blog-images" ON storage.objects;
CREATE POLICY "Admins can upload blog-images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update blog-images" ON storage.objects;
CREATE POLICY "Admins can update blog-images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete blog-images" ON storage.objects;
CREATE POLICY "Admins can delete blog-images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'));
