-- Explicitly document that news_ingestion_runs is service-role only.
-- service_role bypasses RLS; this policy makes intent explicit for
-- authenticated/anon clients (both are denied).
CREATE POLICY "news_ingestion_runs are service-role only"
  ON public.news_ingestion_runs
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);