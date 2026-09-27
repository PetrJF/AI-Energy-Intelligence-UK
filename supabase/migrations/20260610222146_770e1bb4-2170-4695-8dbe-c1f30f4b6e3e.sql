CREATE TABLE public.data_centres (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_name TEXT NOT NULL,
  town TEXT,
  region TEXT,
  status TEXT NOT NULL DEFAULT 'unknown',
  ai_relevance TEXT NOT NULL DEFAULT 'unknown',
  energy_pressure TEXT NOT NULL DEFAULT 'unknown',
  notes TEXT,
  source_url TEXT,
  is_placeholder BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.data_centres TO anon;
GRANT SELECT ON public.data_centres TO authenticated;
GRANT ALL ON public.data_centres TO service_role;

ALTER TABLE public.data_centres ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view data centres" ON public.data_centres
  FOR SELECT USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$
LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_data_centres_updated_at BEFORE UPDATE ON public.data_centres
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.data_centres (location_name, town, region, status, ai_relevance, energy_pressure, notes, is_placeholder) VALUES
('Example Hyperscale Campus', 'Slough', 'South East England', 'existing', 'high', 'high', 'Placeholder entry — Thames Valley data centre cluster. Verify before treating as confirmed.', true),
('Docklands Colocation Hub', 'London', 'England', 'existing', 'high', 'high', 'Placeholder entry — major London connectivity hub. Verify before treating as confirmed.', true),
('Proposed AI Compute Facility', 'Manchester', 'England', 'proposed', 'medium', 'medium', 'Placeholder entry — illustrative proposed site. Not confirmed.', true),
('Central Belt Data Park', 'Glasgow', 'Scotland', 'planned', 'medium', 'medium', 'Placeholder entry — illustrative planned site. Not confirmed.', true),
('Regional Edge Site', 'Cardiff', 'Wales', 'proposed', 'low', 'low', 'Placeholder entry — illustrative. Not confirmed.', true),
('Northern Compute Exchange', 'Newcastle', 'England', 'unknown', 'unknown', 'unknown', 'Placeholder entry — awaiting verified data.', true);