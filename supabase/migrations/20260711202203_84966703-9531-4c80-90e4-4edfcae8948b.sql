-- ============ NEWS ARTICLES ============
CREATE TABLE public.news_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  headline text,
  source_name text NOT NULL,
  source_url text NOT NULL,
  source_domain text NOT NULL,
  dedupe_hash text NOT NULL UNIQUE,
  featured_image_url text,
  published_at timestamptz NOT NULL DEFAULT now(),
  original_published_at timestamptz,
  reading_time_minutes int NOT NULL DEFAULT 3,
  categories text[] NOT NULL DEFAULT '{}',
  tags text[] NOT NULL DEFAULT '{}',
  is_breaking boolean NOT NULL DEFAULT false,
  is_uk_focused boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published','archived')),
  confidence_rating numeric(3,2) CHECK (confidence_rating >= 0 AND confidence_rating <= 1),
  -- AI analysis (structured JSON so we can evolve without migrations)
  analysis jsonb NOT NULL DEFAULT '{}'::jsonb,
  -- analysis shape: { executive_summary, why_it_matters, impact_electricity_demand,
  --   impact_energy_security, impact_business, impact_consumers, long_term_implications,
  --   key_statistics: [], quotations: [{text, attribution}], related_technologies: [] }
  key_statistics jsonb NOT NULL DEFAULT '[]'::jsonb,
  related_hub_links jsonb NOT NULL DEFAULT '[]'::jsonb,
  -- SEO
  meta_title text,
  meta_description text,
  og_image_url text,
  faq jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX news_articles_published_at_idx ON public.news_articles (published_at DESC);
CREATE INDEX news_articles_status_published_idx ON public.news_articles (status, published_at DESC);
CREATE INDEX news_articles_categories_idx ON public.news_articles USING gin (categories);
CREATE INDEX news_articles_tags_idx ON public.news_articles USING gin (tags);
CREATE INDEX news_articles_breaking_idx ON public.news_articles (is_breaking, published_at DESC) WHERE is_breaking = true;

GRANT SELECT ON public.news_articles TO anon;
GRANT SELECT ON public.news_articles TO authenticated;
GRANT ALL ON public.news_articles TO service_role;

ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published news is publicly readable"
  ON public.news_articles
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE TRIGGER news_articles_updated_at
  BEFORE UPDATE ON public.news_articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ INGESTION RUN LOG ============
CREATE TABLE public.news_ingestion_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  status text NOT NULL DEFAULT 'running' CHECK (status IN ('running','success','error','partial')),
  topics_searched int NOT NULL DEFAULT 0,
  candidates_found int NOT NULL DEFAULT 0,
  articles_published int NOT NULL DEFAULT 0,
  articles_skipped_duplicate int NOT NULL DEFAULT 0,
  articles_skipped_untrusted int NOT NULL DEFAULT 0,
  error_message text,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX news_ingestion_runs_started_at_idx ON public.news_ingestion_runs (started_at DESC);

GRANT ALL ON public.news_ingestion_runs TO service_role;
-- No anon/authenticated grants; only backend jobs read this log.

ALTER TABLE public.news_ingestion_runs ENABLE ROW LEVEL SECURITY;
-- No policies: only service_role can access (RLS bypassed for service_role).