CREATE TABLE public.index_watch_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  organisation text NOT NULL DEFAULT '',
  url text NOT NULL,
  area text NOT NULL DEFAULT 'general',
  notes text,
  source_id uuid REFERENCES public.index_sources(id) ON DELETE SET NULL,
  enabled boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  last_checked_at timestamptz,
  last_changed_at timestamptz,
  last_status_code integer,
  last_error text,
  content_hash text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (url)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.index_watch_sources TO authenticated;
GRANT ALL ON public.index_watch_sources TO service_role;
ALTER TABLE public.index_watch_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage index watch sources" ON public.index_watch_sources
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER index_watch_sources_set_updated_at
  BEFORE UPDATE ON public.index_watch_sources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.index_watch_findings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  watch_id uuid NOT NULL REFERENCES public.index_watch_sources(id) ON DELETE CASCADE,
  detected_at timestamptz NOT NULL DEFAULT now(),
  kind text NOT NULL DEFAULT 'changed' CHECK (kind IN ('changed','new_item','error')),
  title text NOT NULL,
  url text,
  detail text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','reviewed','dismissed')),
  reviewed_at timestamptz,
  reviewed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX index_watch_findings_detected_idx ON public.index_watch_findings (detected_at DESC);
CREATE INDEX index_watch_findings_status_idx ON public.index_watch_findings (status);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.index_watch_findings TO authenticated;
GRANT ALL ON public.index_watch_findings TO service_role;
ALTER TABLE public.index_watch_findings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage index watch findings" ON public.index_watch_findings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER index_watch_findings_set_updated_at
  BEFORE UPDATE ON public.index_watch_findings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.index_watch_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  alert_email text NOT NULL DEFAULT '',
  alerts_enabled boolean NOT NULL DEFAULT true,
  paused boolean NOT NULL DEFAULT false,
  last_run_at timestamptz,
  last_run_summary text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.index_watch_settings TO authenticated;
GRANT ALL ON public.index_watch_settings TO service_role;
ALTER TABLE public.index_watch_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage index watch settings" ON public.index_watch_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER index_watch_settings_set_updated_at
  BEFORE UPDATE ON public.index_watch_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.index_watch_settings (id, alert_email, alerts_enabled)
VALUES (true, 'peterjohnflynn_uk@yahoo.co.uk', true);