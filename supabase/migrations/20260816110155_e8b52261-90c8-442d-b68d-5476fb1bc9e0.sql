
UPDATE public.uptime_targets SET expect_text = 'Reports &amp; Research' WHERE path = '/reports' AND environment = 'live';
UPDATE public.uptime_targets SET expect_text = 'The latest on AI, electricity and the UK grid' WHERE path = '/news' AND environment = 'live';
UPDATE public.uptime_targets SET expect_text = 'UK AI Energy Index' WHERE path = '/uk-ai-energy-index' AND environment = 'live';
UPDATE public.uptime_targets SET expect_text = 'Get in touch' WHERE path = '/contact' AND environment = 'live';
UPDATE public.uptime_targets SET expect_text = 'Specialist UK AI Energy Tools' WHERE path = '/tools' AND environment = 'live';
