CREATE TABLE public.nav_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location text NOT NULL,
  label text NOT NULL,
  href text NOT NULL,
  from_path text,
  landed_path text,
  outcome text NOT NULL DEFAULT 'arrived',
  device text,
  visitor_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.nav_clicks TO service_role;
GRANT SELECT ON public.nav_clicks TO authenticated;

ALTER TABLE public.nav_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read navigation clicks"
ON public.nav_clicks FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX nav_clicks_created_at_idx ON public.nav_clicks (created_at DESC);
CREATE INDEX nav_clicks_outcome_idx ON public.nav_clicks (outcome);