-- =========================================================
-- UK AI Energy Index framework
-- =========================================================

-- 1) Indicators -------------------------------------------------
CREATE TABLE public.index_indicators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  short_name text,
  category text NOT NULL DEFAULT 'demand',
  description text,
  unit text NOT NULL DEFAULT '',
  weight numeric NOT NULL DEFAULT 1,
  direction text NOT NULL DEFAULT 'higher_is_more_pressure',
  source_name text,
  source_url text,
  source_type text NOT NULL DEFAULT 'official',
  update_frequency text NOT NULL DEFAULT 'quarterly',
  next_review_at date,
  last_updated_at timestamptz,
  methodology text,
  confidence_level text NOT NULL DEFAULT 'medium',
  collection_method text NOT NULL DEFAULT 'manual',
  caveats text,
  display_order integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT index_indicators_category_check CHECK (category IN ('demand','infrastructure','grid','cost','efficiency','policy','public')),
  CONSTRAINT index_indicators_direction_check CHECK (direction IN ('higher_is_more_pressure','lower_is_more_pressure','neutral')),
  CONSTRAINT index_indicators_source_type_check CHECK (source_type IN ('official','regulator','operator','press','industry','modelled','survey')),
  CONSTRAINT index_indicators_frequency_check CHECK (update_frequency IN ('monthly','quarterly','biannual','annual','ad_hoc')),
  CONSTRAINT index_indicators_confidence_check CHECK (confidence_level IN ('high','medium','low','indicative')),
  CONSTRAINT index_indicators_collection_check CHECK (collection_method IN ('manual','semi_automated','automated')),
  CONSTRAINT index_indicators_status_check CHECK (status IN ('draft','published','retired'))
);

GRANT SELECT ON public.index_indicators TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.index_indicators TO authenticated;
GRANT ALL ON public.index_indicators TO service_role;
ALTER TABLE public.index_indicators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published indicators are publicly readable"
  ON public.index_indicators FOR SELECT TO anon, authenticated
  USING (status = 'published');
CREATE POLICY "Admins can read all indicators"
  ON public.index_indicators FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert indicators"
  ON public.index_indicators FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update indicators"
  ON public.index_indicators FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete indicators"
  ON public.index_indicators FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER index_indicators_set_updated_at
  BEFORE UPDATE ON public.index_indicators
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2) Editions ---------------------------------------------------
CREATE TABLE public.index_editions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  period_label text NOT NULL,
  period_start date,
  period_end date,
  headline_score numeric,
  previous_score numeric,
  summary text,
  methodology_version text NOT NULL DEFAULT '1.0',
  confidence_level text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT index_editions_confidence_check CHECK (confidence_level IN ('high','medium','low','indicative')),
  CONSTRAINT index_editions_status_check CHECK (status IN ('draft','published','archived'))
);

GRANT SELECT ON public.index_editions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.index_editions TO authenticated;
GRANT ALL ON public.index_editions TO service_role;
ALTER TABLE public.index_editions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published editions are publicly readable"
  ON public.index_editions FOR SELECT TO anon, authenticated
  USING (status = 'published');
CREATE POLICY "Admins can read all editions"
  ON public.index_editions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert editions"
  ON public.index_editions FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update editions"
  ON public.index_editions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete editions"
  ON public.index_editions FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER index_editions_set_updated_at
  BEFORE UPDATE ON public.index_editions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) Data points ------------------------------------------------
CREATE TABLE public.index_datapoints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  indicator_id uuid NOT NULL REFERENCES public.index_indicators(id) ON DELETE CASCADE,
  edition_id uuid REFERENCES public.index_editions(id) ON DELETE SET NULL,
  period_label text NOT NULL,
  period_start date,
  period_end date,
  value numeric,
  value_text text,
  unit text,
  normalised_score numeric,
  is_estimate boolean NOT NULL DEFAULT false,
  confidence_level text NOT NULL DEFAULT 'medium',
  source_name text,
  source_url text,
  collected_at timestamptz NOT NULL DEFAULT now(),
  notes text,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT index_datapoints_confidence_check CHECK (confidence_level IN ('high','medium','low','indicative')),
  CONSTRAINT index_datapoints_status_check CHECK (status IN ('draft','published','superseded')),
  CONSTRAINT index_datapoints_unique_period UNIQUE (indicator_id, period_label)
);

CREATE INDEX index_datapoints_indicator_idx ON public.index_datapoints (indicator_id, period_start DESC);
CREATE INDEX index_datapoints_edition_idx ON public.index_datapoints (edition_id);

GRANT SELECT ON public.index_datapoints TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.index_datapoints TO authenticated;
GRANT ALL ON public.index_datapoints TO service_role;
ALTER TABLE public.index_datapoints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published datapoints are publicly readable"
  ON public.index_datapoints FOR SELECT TO anon, authenticated
  USING (status = 'published');
CREATE POLICY "Admins can read all datapoints"
  ON public.index_datapoints FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert datapoints"
  ON public.index_datapoints FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update datapoints"
  ON public.index_datapoints FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete datapoints"
  ON public.index_datapoints FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER index_datapoints_set_updated_at
  BEFORE UPDATE ON public.index_datapoints
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4) Revision history -------------------------------------------
CREATE TABLE public.index_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid,
  indicator_id uuid REFERENCES public.index_indicators(id) ON DELETE SET NULL,
  edition_id uuid REFERENCES public.index_editions(id) ON DELETE SET NULL,
  change_type text NOT NULL DEFAULT 'update',
  summary text NOT NULL,
  previous_value text,
  new_value text,
  reason text,
  methodology_version text,
  revised_at timestamptz NOT NULL DEFAULT now(),
  revised_by uuid,
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT index_revisions_entity_check CHECK (entity_type IN ('indicator','datapoint','edition','methodology')),
  CONSTRAINT index_revisions_change_check CHECK (change_type IN ('created','update','correction','restatement','source_change','methodology_change','retired'))
);

CREATE INDEX index_revisions_revised_at_idx ON public.index_revisions (revised_at DESC);

GRANT SELECT ON public.index_revisions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.index_revisions TO authenticated;
GRANT ALL ON public.index_revisions TO service_role;
ALTER TABLE public.index_revisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public revisions are readable"
  ON public.index_revisions FOR SELECT TO anon, authenticated
  USING (is_public = true);
CREATE POLICY "Admins can read all revisions"
  ON public.index_revisions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert revisions"
  ON public.index_revisions FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update revisions"
  ON public.index_revisions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete revisions"
  ON public.index_revisions FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));