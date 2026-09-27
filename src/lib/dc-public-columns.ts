/**
 * Column lists used for public (non-admin) reads.
 * Internal-only fields such as `admin_notes` and `duplicate_reviewed` are
 * deliberately excluded so review notes never reach the public site.
 */
export const DC_PROJECT_PUBLIC_COLUMNS =
  "id, slug, name, operator, town, region, country, latitude, longitude, status, project_type, ai_relevance, announced_date, target_live_date, capacity_mw, floor_area_sqm, investment_gbp, power_notes, cooling_notes, water_notes, grid_connection_notes, planning_reference, planning_authority, summary, key_facts, sources, confidence_level, verified, verified_at, status_publication, display_order, created_at, updated_at, planning_decision, decision_date, expected_operational_date, index_region_slug, record_ref, campus_name, developer, address_line, postcode, local_authority, nation, facility_type, construction_start_date, actual_operational_date, it_capacity_mw, stated_electricity_demand_mw, grid_connection_mw, campus_capacity_mw, capacity_unit, capacity_definition, primary_source_id, last_verified_at, rs_planning, rs_grid, rs_land_funding, rs_team, rs_momentum, reality_score, rs_band, rs_scored_at, rs_published";

export const GRID_EVIDENCE_PUBLIC_COLUMNS =
  "id, title, region_slug, local_area, network_level, network_operator, constraint_type, description, connection_delay_mentioned, reinforcement_required, investment_announced, flexible_connection_available, relevant_period, relevant_date, source_id, source_section, evidence_nature, limitations, confidence_level, last_reviewed_at, status, created_at, updated_at";
