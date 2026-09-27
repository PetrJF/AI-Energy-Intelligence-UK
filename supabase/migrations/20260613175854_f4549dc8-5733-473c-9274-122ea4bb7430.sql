CREATE TABLE public.myth_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  claim text NOT NULL,
  email text,
  source_url text,
  status text NOT NULL DEFAULT 'pending',
  user_agent text,
  ip_hash text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT ALL ON public.myth_submissions TO service_role;

ALTER TABLE public.myth_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny anon select" ON public.myth_submissions FOR SELECT TO anon, authenticated USING (false);
CREATE POLICY "Deny anon insert" ON public.myth_submissions FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "Deny anon update" ON public.myth_submissions FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "Deny anon delete" ON public.myth_submissions FOR DELETE TO anon, authenticated USING (false);