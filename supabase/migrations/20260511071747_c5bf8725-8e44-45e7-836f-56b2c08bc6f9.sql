-- Explicit deny policies. The leads table is intentionally server-only:
-- writes go through the public lead-intake server route using the service role.
-- These policies make the lockdown explicit and satisfy the linter.
CREATE POLICY "Deny anon select" ON public.leads FOR SELECT TO anon, authenticated USING (false);
CREATE POLICY "Deny anon insert" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "Deny anon update" ON public.leads FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "Deny anon delete" ON public.leads FOR DELETE TO anon, authenticated USING (false);