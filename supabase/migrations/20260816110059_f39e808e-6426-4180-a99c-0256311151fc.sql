
GRANT UPDATE ON public.uptime_targets TO authenticated;

CREATE POLICY "Admins update uptime targets" ON public.uptime_targets
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

SELECT cron.schedule(
  'uptime-synthetic-checks',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://project--8043756f-d43f-4e68-a6b3-36650ebd1257.lovable.app/api/public/hooks/uptime',
    headers := '{"Content-Type": "application/json", "apikey": "sb_publishable_HkHfOsdJgfIagwKfsWHI1Q_bBIVwP5g"}'::jsonb,
    body := '{}'::jsonb,
    timeout_milliseconds := 55000
  );
  $$
);
