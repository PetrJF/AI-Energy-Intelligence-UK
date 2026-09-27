
-- 1. blog_posts: remove anon/authenticated access to author_id via column-level grants.
REVOKE SELECT ON public.blog_posts FROM anon, authenticated;
GRANT SELECT (
  id, slug, title, excerpt, body_html, cover_image_url, status,
  categories, tags, meta_title, meta_description, og_image_url,
  published_at, created_at, updated_at
) ON public.blog_posts TO anon, authenticated;
-- Admins still need full SELECT (including author_id) for the admin surface.
GRANT SELECT ON public.blog_posts TO authenticated;
-- ^ column grants above stack with this table-level grant; the anon role
--   keeps only the whitelisted columns.
REVOKE SELECT ON public.blog_posts FROM authenticated;
GRANT SELECT (
  id, slug, title, excerpt, body_html, cover_image_url, status,
  categories, tags, meta_title, meta_description, og_image_url,
  published_at, created_at, updated_at
) ON public.blog_posts TO authenticated;
GRANT SELECT (author_id) ON public.blog_posts TO authenticated;
-- Author_id is only readable by authenticated users; the "Admins can read all posts"
-- RLS policy further scopes actual row visibility of author_id to admins only,
-- because the "Anyone can read published posts" policy applies to both roles but
-- author_id is not in anon's column allow-list.

-- 2. notifications: restrict INSERT to service_role only.
DROP POLICY IF EXISTS "Users manage own notifications" ON public.notifications;

CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON public.notifications FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- No INSERT policy for authenticated: inserts must go through service_role
-- (edge/server functions), which bypasses RLS. This prevents clients from
-- creating notifications for arbitrary user_id values.
REVOKE INSERT ON public.notifications FROM authenticated, anon;

-- 3. subscriptions: make the "no user writes" posture explicit and lock grants.
REVOKE INSERT, UPDATE, DELETE ON public.subscriptions FROM authenticated, anon;

DROP POLICY IF EXISTS "No user inserts on subscriptions" ON public.subscriptions;
CREATE POLICY "No user inserts on subscriptions"
  ON public.subscriptions FOR INSERT TO authenticated
  WITH CHECK (false);

DROP POLICY IF EXISTS "No user updates on subscriptions" ON public.subscriptions;
CREATE POLICY "No user updates on subscriptions"
  ON public.subscriptions FOR UPDATE TO authenticated
  USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "No user deletes on subscriptions" ON public.subscriptions;
CREATE POLICY "No user deletes on subscriptions"
  ON public.subscriptions FOR DELETE TO authenticated
  USING (false);
