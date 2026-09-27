DO $$
DECLARE
  t text;
  cols text;
  hidden text[];
  pair record;
BEGIN
  FOR pair IN
    SELECT * FROM (VALUES
      ('blog_posts', ARRAY['author_id']),
      ('dc_projects', ARRAY['admin_notes','primary_source_id']),
      ('grid_evidence', ARRAY['admin_notes'])
    ) AS v(tbl, hide)
  LOOP
    t := pair.tbl;
    hidden := pair.hide;

    SELECT string_agg(quote_ident(column_name), ', ')
      INTO cols
      FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = t
       AND NOT (column_name = ANY(hidden));

    EXECUTE format('REVOKE SELECT ON public.%I FROM anon, authenticated', t);
    EXECUTE format('GRANT SELECT (%s) ON public.%I TO anon, authenticated', cols, t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
  END LOOP;
END $$;