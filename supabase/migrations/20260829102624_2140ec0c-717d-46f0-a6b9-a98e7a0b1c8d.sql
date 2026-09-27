-- Restrict internal-only columns from public/signed-in readers.
REVOKE SELECT ON public.dc_projects FROM anon, authenticated;
GRANT SELECT (id, slug, name, operator, town, region, country, latitude, longitude, status, project_type, ai_relevance, announced_date, target_live_date, capacity_mw, floor_area_sqm, investment_gbp, power_notes, cooling_notes, water_notes, grid_connection_notes, planning_reference, planning_authority, summary, key_facts, sources, confidence_level, verified, verified_at, status_publication, display_order, created_at, updated_at, planning_decision, decision_date, expected_operational_date, index_region_slug, record_ref, campus_name, developer, address_line, postcode, local_authority, nation, facility_type, construction_start_date, actual_operational_date, it_capacity_mw, stated_electricity_demand_mw, grid_connection_mw, campus_capacity_mw, capacity_unit, capacity_definition, primary_source_id, last_verified_at)
  ON public.dc_projects TO anon, authenticated;

REVOKE SELECT ON public.grid_evidence FROM anon, authenticated;
GRANT SELECT (id, title, region_slug, local_area, network_level, network_operator, constraint_type, description, connection_delay_mentioned, reinforcement_required, investment_announced, flexible_connection_available, relevant_period, relevant_date, source_id, confidence_level, last_reviewed_at, status, created_at, updated_at)
  ON public.grid_evidence TO anon, authenticated;

GRANT ALL ON public.dc_projects TO service_role;
GRANT ALL ON public.grid_evidence TO service_role;