-- Scope public read on grid_assessment_evidence to published linkages only
DROP POLICY IF EXISTS "assessment evidence readable" ON public.grid_assessment_evidence;
CREATE POLICY "assessment evidence public read published"
ON public.grid_assessment_evidence
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.grid_pressure_ratings r
    WHERE r.id = grid_assessment_evidence.assessment_id AND r.status = 'published'
  )
  AND EXISTS (
    SELECT 1 FROM public.grid_evidence e
    WHERE e.id = grid_assessment_evidence.evidence_id AND e.status = 'published'
  )
);

-- Scope public read on index_source_links to links whose entity is published
DROP POLICY IF EXISTS "source links readable" ON public.index_source_links;
CREATE POLICY "source links public read published"
ON public.index_source_links
FOR SELECT
TO anon, authenticated
USING (
  CASE entity_type
    WHEN 'datapoint' THEN EXISTS (SELECT 1 FROM public.index_datapoints d WHERE d.id = index_source_links.entity_id AND d.status = 'published')
    WHEN 'indicator' THEN EXISTS (SELECT 1 FROM public.index_indicators i WHERE i.id = index_source_links.entity_id AND i.status = 'published')
    WHEN 'edition'   THEN EXISTS (SELECT 1 FROM public.index_editions e WHERE e.id = index_source_links.entity_id AND e.status = 'published')
    WHEN 'subindex'  THEN EXISTS (SELECT 1 FROM public.index_subindices s WHERE s.id = index_source_links.entity_id AND s.status = 'published')
    WHEN 'source'    THEN EXISTS (SELECT 1 FROM public.index_sources src WHERE src.id = index_source_links.entity_id AND src.status = 'published')
    ELSE false
  END
);

-- Reference table: keep public read but restrict to the anon/authenticated roles explicitly
DROP POLICY IF EXISTS "regions public read" ON public.dc_regions;
CREATE POLICY "regions public read"
ON public.dc_regions
FOR SELECT
TO anon, authenticated
USING (true);

-- correction_submissions: public form posts through a server route using the
-- service role, so no anon INSERT policy is granted. Ensure anon has no table
-- privileges at all and only admins can read.
REVOKE ALL ON public.correction_submissions FROM anon;
GRANT SELECT, UPDATE, DELETE ON public.correction_submissions TO authenticated;
GRANT ALL ON public.correction_submissions TO service_role;