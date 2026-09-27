CREATE TABLE public.leads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  source text NOT NULL,
  variant text NOT NULL,
  inputs jsonb,
  result_summary jsonb,
  consent_marketing boolean NOT NULL DEFAULT false,
  user_agent text,
  ip_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- No anon SELECT/INSERT policies. All access goes through the service-role
-- server route, so no policies are needed for client-side access.

CREATE INDEX leads_created_at_idx ON public.leads (created_at DESC);
CREATE INDEX leads_source_idx ON public.leads (source);
CREATE INDEX leads_email_idx ON public.leads (lower(email));