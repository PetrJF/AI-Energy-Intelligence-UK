ALTER TABLE public.news_articles
  ADD COLUMN IF NOT EXISTS review_status text NOT NULL DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS quality_score numeric,
  ADD COLUMN IF NOT EXISTS rejection_reason text,
  ADD COLUMN IF NOT EXISTS source_tier integer NOT NULL DEFAULT 2,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS reviewed_by uuid;

CREATE INDEX IF NOT EXISTS news_articles_review_status_idx ON public.news_articles (review_status, published_at DESC);

DROP POLICY IF EXISTS "Published news is publicly readable" ON public.news_articles;
CREATE POLICY "Published news is publicly readable"
  ON public.news_articles FOR SELECT TO anon, authenticated
  USING (status = 'published' AND review_status = 'approved');

DROP POLICY IF EXISTS "Admins can read all news" ON public.news_articles;
CREATE POLICY "Admins can read all news"
  ON public.news_articles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update news" ON public.news_articles;
CREATE POLICY "Admins can update news"
  ON public.news_articles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete news" ON public.news_articles;
CREATE POLICY "Admins can delete news"
  ON public.news_articles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

GRANT SELECT ON public.news_articles TO anon;
GRANT SELECT, UPDATE, DELETE ON public.news_articles TO authenticated;
GRANT ALL ON public.news_articles TO service_role;