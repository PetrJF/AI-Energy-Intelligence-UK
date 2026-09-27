
-- Synthetic uptime monitoring -------------------------------------------------

CREATE TABLE public.uptime_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  environment text NOT NULL CHECK (environment IN ('live','preview')),
  url text NOT NULL,
  path text NOT NULL,
  expect_text text,
  expect_status int NOT NULL DEFAULT 200,
  allow_statuses int[] NOT NULL DEFAULT '{}',
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (environment, path)
);

CREATE TABLE public.uptime_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_id uuid NOT NULL REFERENCES public.uptime_targets(id) ON DELETE CASCADE,
  checked_at timestamptz NOT NULL DEFAULT now(),
  ok boolean NOT NULL,
  status_code int,
  latency_ms int,
  body_bytes int,
  failure_reason text
);
CREATE INDEX uptime_checks_target_time_idx ON public.uptime_checks (target_id, checked_at DESC);
CREATE INDEX uptime_checks_time_idx ON public.uptime_checks (checked_at DESC);

CREATE TABLE public.uptime_state (
  target_id uuid PRIMARY KEY REFERENCES public.uptime_targets(id) ON DELETE CASCADE,
  consecutive_failures int NOT NULL DEFAULT 0,
  down_since timestamptz,
  alerted boolean NOT NULL DEFAULT false,
  last_alert_at timestamptz,
  last_ok_at timestamptz,
  last_status_code int,
  last_failure_reason text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.uptime_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  alert_email text NOT NULL DEFAULT 'hello@aienergyintelligence.co.uk',
  alerts_enabled boolean NOT NULL DEFAULT true,
  failure_threshold int NOT NULL DEFAULT 2,
  updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO public.uptime_settings (id) VALUES (true);

GRANT SELECT ON public.uptime_targets TO authenticated;
GRANT SELECT ON public.uptime_checks TO authenticated;
GRANT SELECT ON public.uptime_state TO authenticated;
GRANT SELECT, UPDATE ON public.uptime_settings TO authenticated;
GRANT ALL ON public.uptime_targets TO service_role;
GRANT ALL ON public.uptime_checks TO service_role;
GRANT ALL ON public.uptime_state TO service_role;
GRANT ALL ON public.uptime_settings TO service_role;

ALTER TABLE public.uptime_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uptime_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uptime_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uptime_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read uptime targets" ON public.uptime_targets
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins read uptime checks" ON public.uptime_checks
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins read uptime state" ON public.uptime_state
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins read uptime settings" ON public.uptime_settings
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update uptime settings" ON public.uptime_settings
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.uptime_targets (label, environment, url, path, expect_text, expect_status, allow_statuses) VALUES
  ('Homepage', 'live', 'https://aienergyintelligence.co.uk/', '/', 'Get the Free UK AI Energy Report', 200, '{}'),
  ('Tools hub', 'live', 'https://aienergyintelligence.co.uk/tools', '/tools', 'SPECIALIST UK AI ENERGY TOOLS', 200, '{}'),
  ('Reports hub', 'live', 'https://aienergyintelligence.co.uk/reports', '/reports', 'Reports', 200, '{}'),
  ('News index', 'live', 'https://aienergyintelligence.co.uk/news', '/news', 'News', 200, '{}'),
  ('UK AI Energy Index', 'live', 'https://aienergyintelligence.co.uk/uk-ai-energy-index', '/uk-ai-energy-index', 'Index', 200, '{}'),
  ('Contact (CTA target)', 'live', 'https://aienergyintelligence.co.uk/contact', '/contact', 'Contact', 200, '{}'),
  ('Lead capture API (CTA)', 'live', 'https://aienergyintelligence.co.uk/api/public/captcha', '/api/public/captcha', NULL, 200, '{405}'),
  ('Sitemap', 'live', 'https://aienergyintelligence.co.uk/sitemap.xml', '/sitemap.xml', 'urlset', 200, '{}'),
  ('Preview edge (auth-gated)', 'preview', 'https://project--8043756f-d43f-4e68-a6b3-36650ebd1257-dev.lovable.app/', '/', NULL, 200, '{401,403}');
