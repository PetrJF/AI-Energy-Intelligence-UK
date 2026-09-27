
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS pillar text,
  ADD COLUMN IF NOT EXISTS article_type text NOT NULL DEFAULT 'standard',
  ADD COLUMN IF NOT EXISTS author_name text,
  ADD COLUMN IF NOT EXISTS key_findings text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS sources jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS methodology text,
  ADD COLUMN IF NOT EXISTS limitations text,
  ADD COLUMN IF NOT EXISTS chart_note text,
  ADD COLUMN IF NOT EXISTS corrections_note text,
  ADD COLUMN IF NOT EXISTS last_updated_at timestamptz;

ALTER TABLE public.blog_posts
  DROP CONSTRAINT IF EXISTS blog_posts_pillar_check;
ALTER TABLE public.blog_posts
  ADD CONSTRAINT blog_posts_pillar_check CHECK (
    pillar IS NULL OR pillar IN (
      'ai-electricity-demand','data-centres','grid-infrastructure','policy-economics','other'
    )
  );

ALTER TABLE public.blog_posts
  DROP CONSTRAINT IF EXISTS blog_posts_article_type_check;
ALTER TABLE public.blog_posts
  ADD CONSTRAINT blog_posts_article_type_check CHECK (
    article_type IN ('cornerstone','standard','briefing','other')
  );

UPDATE public.blog_posts
SET pillar = 'ai-electricity-demand', categories = ARRAY['AI Electricity Demand','Data Centres'], article_type = 'standard'
WHERE slug = 'how-many-data-centres-uk-energy';

UPDATE public.blog_posts
SET pillar = 'ai-electricity-demand', categories = ARRAY['AI Electricity Demand'], article_type = 'cornerstone'
WHERE slug = 'could-ai-use-more-energy-than-it-saves-uk';

UPDATE public.blog_posts
SET pillar = 'data-centres', categories = ARRAY['Data Centres'], article_type = 'standard'
WHERE slug = 'will-ai-data-centres-change-uk-house-prices';

UPDATE public.blog_posts
SET pillar = 'other', categories = ARRAY['Business & Efficiency'], article_type = 'standard'
WHERE slug = 'how-supermarkets-use-ai-to-save-electricity';

DELETE FROM public.blog_posts
WHERE slug = 'will-ai-data-centres-affect-local-house-prices' AND status = 'draft';
