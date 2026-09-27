export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          created_at: string
          id: string
          kind: string
          link: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind?: string
          link?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          link?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          article_type: string
          author_id: string | null
          author_name: string | null
          body_html: string
          categories: string[]
          change_note: string | null
          chart_note: string | null
          corrections_note: string | null
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          key_findings: string[]
          last_updated_at: string | null
          limitations: string | null
          meta_description: string | null
          meta_title: string | null
          methodology: string | null
          og_image_url: string | null
          pillar: string | null
          published_at: string | null
          review_status: string
          slug: string
          sources: Json
          status: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          article_type?: string
          author_id?: string | null
          author_name?: string | null
          body_html?: string
          categories?: string[]
          change_note?: string | null
          chart_note?: string | null
          corrections_note?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          key_findings?: string[]
          last_updated_at?: string | null
          limitations?: string | null
          meta_description?: string | null
          meta_title?: string | null
          methodology?: string | null
          og_image_url?: string | null
          pillar?: string | null
          published_at?: string | null
          review_status?: string
          slug: string
          sources?: Json
          status?: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          article_type?: string
          author_id?: string | null
          author_name?: string | null
          body_html?: string
          categories?: string[]
          change_note?: string | null
          chart_note?: string | null
          corrections_note?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          key_findings?: string[]
          last_updated_at?: string | null
          limitations?: string | null
          meta_description?: string | null
          meta_title?: string | null
          methodology?: string | null
          og_image_url?: string | null
          pillar?: string | null
          published_at?: string | null
          review_status?: string
          slug?: string
          sources?: Json
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      correction_submissions: {
        Row: {
          admin_notes: string | null
          created_at: string
          description: string
          id: string
          ip_hash: string | null
          page_or_record: string
          reviewed_at: string | null
          reviewed_by: string | null
          source_url: string | null
          status: string
          submitter_email: string | null
          submitter_name: string | null
          suggested_correction: string | null
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          description: string
          id?: string
          ip_hash?: string | null
          page_or_record: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_url?: string | null
          status?: string
          submitter_email?: string | null
          submitter_name?: string | null
          suggested_correction?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          description?: string
          id?: string
          ip_hash?: string | null
          page_or_record?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_url?: string | null
          status?: string
          submitter_email?: string | null
          submitter_name?: string | null
          suggested_correction?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      data_centres: {
        Row: {
          ai_relevance: string
          created_at: string
          energy_pressure: string
          id: string
          is_placeholder: boolean
          location_name: string
          notes: string | null
          region: string | null
          source_url: string | null
          status: string
          town: string | null
          updated_at: string
        }
        Insert: {
          ai_relevance?: string
          created_at?: string
          energy_pressure?: string
          id?: string
          is_placeholder?: boolean
          location_name: string
          notes?: string | null
          region?: string | null
          source_url?: string | null
          status?: string
          town?: string | null
          updated_at?: string
        }
        Update: {
          ai_relevance?: string
          created_at?: string
          energy_pressure?: string
          id?: string
          is_placeholder?: boolean
          location_name?: string
          notes?: string | null
          region?: string | null
          source_url?: string | null
          status?: string
          town?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      dc_projects: {
        Row: {
          actual_operational_date: string | null
          address_line: string | null
          admin_notes: string | null
          ai_relevance: string
          announced_date: string | null
          campus_capacity_mw: number | null
          campus_name: string | null
          capacity_definition: string
          capacity_mw: number | null
          capacity_unit: string
          confidence_level: string
          construction_start_date: string | null
          cooling_notes: string | null
          country: string
          created_at: string
          decision_date: string | null
          developer: string | null
          display_order: number
          duplicate_reviewed: boolean
          expected_operational_date: string | null
          facility_type: string
          floor_area_sqm: number | null
          grid_connection_mw: number | null
          grid_connection_notes: string | null
          id: string
          index_region_slug: string | null
          investment_gbp: number | null
          it_capacity_mw: number | null
          key_facts: Json
          last_verified_at: string | null
          latitude: number | null
          local_authority: string | null
          longitude: number | null
          name: string
          nation: string | null
          operator: string | null
          planning_authority: string | null
          planning_decision: string | null
          planning_reference: string | null
          postcode: string | null
          power_notes: string | null
          primary_source_id: string | null
          project_type: string
          reality_score: number | null
          record_ref: string | null
          region: string
          rs_band: string | null
          rs_grid: number | null
          rs_land_funding: number | null
          rs_momentum: number | null
          rs_notes: string | null
          rs_planning: number | null
          rs_published: boolean | null
          rs_scored_at: string | null
          rs_team: number | null
          slug: string
          sources: Json
          stated_electricity_demand_mw: number | null
          status: string
          status_publication: string
          summary: string | null
          target_live_date: string | null
          town: string | null
          updated_at: string
          verified: boolean
          verified_at: string | null
          water_notes: string | null
        }
        Insert: {
          actual_operational_date?: string | null
          address_line?: string | null
          admin_notes?: string | null
          ai_relevance?: string
          announced_date?: string | null
          campus_capacity_mw?: number | null
          campus_name?: string | null
          capacity_definition?: string
          capacity_mw?: number | null
          capacity_unit?: string
          confidence_level?: string
          construction_start_date?: string | null
          cooling_notes?: string | null
          country?: string
          created_at?: string
          decision_date?: string | null
          developer?: string | null
          display_order?: number
          duplicate_reviewed?: boolean
          expected_operational_date?: string | null
          facility_type?: string
          floor_area_sqm?: number | null
          grid_connection_mw?: number | null
          grid_connection_notes?: string | null
          id?: string
          index_region_slug?: string | null
          investment_gbp?: number | null
          it_capacity_mw?: number | null
          key_facts?: Json
          last_verified_at?: string | null
          latitude?: number | null
          local_authority?: string | null
          longitude?: number | null
          name: string
          nation?: string | null
          operator?: string | null
          planning_authority?: string | null
          planning_decision?: string | null
          planning_reference?: string | null
          postcode?: string | null
          power_notes?: string | null
          primary_source_id?: string | null
          project_type?: string
          reality_score?: number | null
          record_ref?: string | null
          region?: string
          rs_band?: string | null
          rs_grid?: number | null
          rs_land_funding?: number | null
          rs_momentum?: number | null
          rs_notes?: string | null
          rs_planning?: number | null
          rs_published?: boolean | null
          rs_scored_at?: string | null
          rs_team?: number | null
          slug: string
          sources?: Json
          stated_electricity_demand_mw?: number | null
          status?: string
          status_publication?: string
          summary?: string | null
          target_live_date?: string | null
          town?: string | null
          updated_at?: string
          verified?: boolean
          verified_at?: string | null
          water_notes?: string | null
        }
        Update: {
          actual_operational_date?: string | null
          address_line?: string | null
          admin_notes?: string | null
          ai_relevance?: string
          announced_date?: string | null
          campus_capacity_mw?: number | null
          campus_name?: string | null
          capacity_definition?: string
          capacity_mw?: number | null
          capacity_unit?: string
          confidence_level?: string
          construction_start_date?: string | null
          cooling_notes?: string | null
          country?: string
          created_at?: string
          decision_date?: string | null
          developer?: string | null
          display_order?: number
          duplicate_reviewed?: boolean
          expected_operational_date?: string | null
          facility_type?: string
          floor_area_sqm?: number | null
          grid_connection_mw?: number | null
          grid_connection_notes?: string | null
          id?: string
          index_region_slug?: string | null
          investment_gbp?: number | null
          it_capacity_mw?: number | null
          key_facts?: Json
          last_verified_at?: string | null
          latitude?: number | null
          local_authority?: string | null
          longitude?: number | null
          name?: string
          nation?: string | null
          operator?: string | null
          planning_authority?: string | null
          planning_decision?: string | null
          planning_reference?: string | null
          postcode?: string | null
          power_notes?: string | null
          primary_source_id?: string | null
          project_type?: string
          reality_score?: number | null
          record_ref?: string | null
          region?: string
          rs_band?: string | null
          rs_grid?: number | null
          rs_land_funding?: number | null
          rs_momentum?: number | null
          rs_notes?: string | null
          rs_planning?: number | null
          rs_published?: boolean | null
          rs_scored_at?: string | null
          rs_team?: number | null
          slug?: string
          sources?: Json
          stated_electricity_demand_mw?: number | null
          status?: string
          status_publication?: string
          summary?: string | null
          target_live_date?: string | null
          town?: string | null
          updated_at?: string
          verified?: boolean
          verified_at?: string | null
          water_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dc_projects_index_region_slug_fkey"
            columns: ["index_region_slug"]
            isOneToOne: false
            referencedRelation: "dc_regions"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "dc_projects_primary_source_id_fkey"
            columns: ["primary_source_id"]
            isOneToOne: false
            referencedRelation: "index_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      dc_region_stats: {
        Row: {
          approved_count: number | null
          created_at: string
          data_completeness: string
          development_mw: number | null
          hyperscale_count: number | null
          id: string
          last_reviewed_at: string | null
          latest_decision: string | null
          latest_decision_date: string | null
          notes: string | null
          operational_count: number | null
          operational_mw: number | null
          proposed_count: number | null
          region_slug: string
          status: string
          under_construction_count: number | null
          updated_at: string
        }
        Insert: {
          approved_count?: number | null
          created_at?: string
          data_completeness?: string
          development_mw?: number | null
          hyperscale_count?: number | null
          id?: string
          last_reviewed_at?: string | null
          latest_decision?: string | null
          latest_decision_date?: string | null
          notes?: string | null
          operational_count?: number | null
          operational_mw?: number | null
          proposed_count?: number | null
          region_slug: string
          status?: string
          under_construction_count?: number | null
          updated_at?: string
        }
        Update: {
          approved_count?: number | null
          created_at?: string
          data_completeness?: string
          development_mw?: number | null
          hyperscale_count?: number | null
          id?: string
          last_reviewed_at?: string | null
          latest_decision?: string | null
          latest_decision_date?: string | null
          notes?: string | null
          operational_count?: number | null
          operational_mw?: number | null
          proposed_count?: number | null
          region_slug?: string
          status?: string
          under_construction_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dc_region_stats_region_slug_fkey"
            columns: ["region_slug"]
            isOneToOne: false
            referencedRelation: "dc_regions"
            referencedColumns: ["slug"]
          },
        ]
      }
      dc_regions: {
        Row: {
          created_at: string
          display_order: number
          id: string
          name: string
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          name: string
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          name?: string
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      dc_zone_milestones: {
        Row: {
          created_at: string
          display_order: number
          id: string
          milestone_date: string | null
          notes: string | null
          project_id: string
          source_title: string | null
          source_url: string | null
          stage: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          milestone_date?: string | null
          notes?: string | null
          project_id: string
          source_title?: string | null
          source_url?: string | null
          stage?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          milestone_date?: string | null
          notes?: string | null
          project_id?: string
          source_title?: string | null
          source_url?: string | null
          stage?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dc_zone_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "dc_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      favourites: {
        Row: {
          created_at: string
          id: string
          item_slug: string
          item_title: string
          item_type: string
          position: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_slug: string
          item_title: string
          item_type?: string
          position?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_slug?: string
          item_title?: string
          item_type?: string
          position?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      grid_assessment_evidence: {
        Row: {
          assessment_id: string
          created_at: string
          evidence_id: string
          id: string
        }
        Insert: {
          assessment_id: string
          created_at?: string
          evidence_id: string
          id?: string
        }
        Update: {
          assessment_id?: string
          created_at?: string
          evidence_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "grid_assessment_evidence_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "grid_pressure_ratings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grid_assessment_evidence_evidence_id_fkey"
            columns: ["evidence_id"]
            isOneToOne: false
            referencedRelation: "grid_evidence"
            referencedColumns: ["id"]
          },
        ]
      }
      grid_evidence: {
        Row: {
          admin_notes: string | null
          confidence_level: string
          connection_delay_mentioned: string | null
          constraint_type: string
          created_at: string
          description: string
          evidence_nature: string
          flexible_connection_available: string | null
          id: string
          investment_announced: string | null
          last_reviewed_at: string | null
          limitations: string | null
          local_area: string | null
          network_level: string
          network_operator: string | null
          region_slug: string
          reinforcement_required: string | null
          relevant_date: string | null
          relevant_period: string | null
          source_id: string | null
          source_section: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          confidence_level?: string
          connection_delay_mentioned?: string | null
          constraint_type?: string
          created_at?: string
          description: string
          evidence_nature?: string
          flexible_connection_available?: string | null
          id?: string
          investment_announced?: string | null
          last_reviewed_at?: string | null
          limitations?: string | null
          local_area?: string | null
          network_level?: string
          network_operator?: string | null
          region_slug: string
          reinforcement_required?: string | null
          relevant_date?: string | null
          relevant_period?: string | null
          source_id?: string | null
          source_section?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          confidence_level?: string
          connection_delay_mentioned?: string | null
          constraint_type?: string
          created_at?: string
          description?: string
          evidence_nature?: string
          flexible_connection_available?: string | null
          id?: string
          investment_announced?: string | null
          last_reviewed_at?: string | null
          limitations?: string | null
          local_area?: string | null
          network_level?: string
          network_operator?: string | null
          region_slug?: string
          reinforcement_required?: string | null
          relevant_date?: string | null
          relevant_period?: string | null
          source_id?: string | null
          source_section?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "grid_evidence_region_slug_fkey"
            columns: ["region_slug"]
            isOneToOne: false
            referencedRelation: "dc_regions"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "grid_evidence_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "index_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      grid_pressure_ratings: {
        Row: {
          assessed_by: string | null
          assessment_date: string | null
          connection_demand_evidence: string | null
          created_at: string
          evidence_confidence: string
          flexible_connections: string | null
          id: string
          known_delays: string | null
          last_reviewed_at: string | null
          limitations: string | null
          methodology_version: string
          network_constraints: string | null
          next_review_at: string | null
          planned_investment: string | null
          rating: string
          rationale: string
          region_slug: string
          source_title: string | null
          source_url: string | null
          status: string
          updated_at: string
        }
        Insert: {
          assessed_by?: string | null
          assessment_date?: string | null
          connection_demand_evidence?: string | null
          created_at?: string
          evidence_confidence?: string
          flexible_connections?: string | null
          id?: string
          known_delays?: string | null
          last_reviewed_at?: string | null
          limitations?: string | null
          methodology_version?: string
          network_constraints?: string | null
          next_review_at?: string | null
          planned_investment?: string | null
          rating?: string
          rationale: string
          region_slug: string
          source_title?: string | null
          source_url?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          assessed_by?: string | null
          assessment_date?: string | null
          connection_demand_evidence?: string | null
          created_at?: string
          evidence_confidence?: string
          flexible_connections?: string | null
          id?: string
          known_delays?: string | null
          last_reviewed_at?: string | null
          limitations?: string | null
          methodology_version?: string
          network_constraints?: string | null
          next_review_at?: string | null
          planned_investment?: string | null
          rating?: string
          rationale?: string
          region_slug?: string
          source_title?: string | null
          source_url?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "grid_pressure_ratings_region_slug_fkey"
            columns: ["region_slug"]
            isOneToOne: false
            referencedRelation: "dc_regions"
            referencedColumns: ["slug"]
          },
        ]
      }
      index_change_log: {
        Row: {
          changed_by: string | null
          changed_by_label: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          field_name: string | null
          id: string
          is_public: boolean
          methodology_version: string | null
          new_value: string | null
          previous_value: string | null
          reason: string
          source_id: string | null
        }
        Insert: {
          changed_by?: string | null
          changed_by_label?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          field_name?: string | null
          id?: string
          is_public?: boolean
          methodology_version?: string | null
          new_value?: string | null
          previous_value?: string | null
          reason: string
          source_id?: string | null
        }
        Update: {
          changed_by?: string | null
          changed_by_label?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          field_name?: string | null
          id?: string
          is_public?: boolean
          methodology_version?: string | null
          new_value?: string | null
          previous_value?: string | null
          reason?: string
          source_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "index_change_log_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "index_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      index_datapoints: {
        Row: {
          assumptions: string | null
          calculation_inputs: Json
          calculation_method: string | null
          change_absolute: number | null
          change_from_baseline_percent: number | null
          collected_at: string
          confidence_level: string
          confidence_level_rating: string
          created_at: string
          data_classification: string
          edition_id: string | null
          geographic_coverage: string
          id: string
          indicator_id: string
          is_estimate: boolean
          limitations: string | null
          normalised_score: number | null
          notes: string | null
          percent_change: number | null
          period_end: string | null
          period_label: string
          period_start: string | null
          previous_value: number | null
          publication_date: string | null
          reviewed_at: string | null
          source_id: string | null
          source_name: string | null
          source_url: string | null
          status: string
          superseded_by: string | null
          superseded_reason: string | null
          unit: string | null
          updated_at: string
          value: number | null
          value_text: string | null
        }
        Insert: {
          assumptions?: string | null
          calculation_inputs?: Json
          calculation_method?: string | null
          change_absolute?: number | null
          change_from_baseline_percent?: number | null
          collected_at?: string
          confidence_level?: string
          confidence_level_rating?: string
          created_at?: string
          data_classification?: string
          edition_id?: string | null
          geographic_coverage?: string
          id?: string
          indicator_id: string
          is_estimate?: boolean
          limitations?: string | null
          normalised_score?: number | null
          notes?: string | null
          percent_change?: number | null
          period_end?: string | null
          period_label: string
          period_start?: string | null
          previous_value?: number | null
          publication_date?: string | null
          reviewed_at?: string | null
          source_id?: string | null
          source_name?: string | null
          source_url?: string | null
          status?: string
          superseded_by?: string | null
          superseded_reason?: string | null
          unit?: string | null
          updated_at?: string
          value?: number | null
          value_text?: string | null
        }
        Update: {
          assumptions?: string | null
          calculation_inputs?: Json
          calculation_method?: string | null
          change_absolute?: number | null
          change_from_baseline_percent?: number | null
          collected_at?: string
          confidence_level?: string
          confidence_level_rating?: string
          created_at?: string
          data_classification?: string
          edition_id?: string | null
          geographic_coverage?: string
          id?: string
          indicator_id?: string
          is_estimate?: boolean
          limitations?: string | null
          normalised_score?: number | null
          notes?: string | null
          percent_change?: number | null
          period_end?: string | null
          period_label?: string
          period_start?: string | null
          previous_value?: number | null
          publication_date?: string | null
          reviewed_at?: string | null
          source_id?: string | null
          source_name?: string | null
          source_url?: string | null
          status?: string
          superseded_by?: string | null
          superseded_reason?: string | null
          unit?: string | null
          updated_at?: string
          value?: number | null
          value_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "index_datapoints_edition_id_fkey"
            columns: ["edition_id"]
            isOneToOne: false
            referencedRelation: "index_editions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "index_datapoints_indicator_id_fkey"
            columns: ["indicator_id"]
            isOneToOne: false
            referencedRelation: "index_indicators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "index_datapoints_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "index_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "index_datapoints_superseded_by_fkey"
            columns: ["superseded_by"]
            isOneToOne: false
            referencedRelation: "index_datapoints"
            referencedColumns: ["id"]
          },
        ]
      }
      index_editions: {
        Row: {
          confidence_level: string
          created_at: string
          headline_score: number | null
          id: string
          methodology_version: string
          period_end: string | null
          period_label: string
          period_start: string | null
          previous_score: number | null
          published_at: string | null
          slug: string
          status: string
          summary: string | null
          updated_at: string
        }
        Insert: {
          confidence_level?: string
          created_at?: string
          headline_score?: number | null
          id?: string
          methodology_version?: string
          period_end?: string | null
          period_label: string
          period_start?: string | null
          previous_score?: number | null
          published_at?: string | null
          slug: string
          status?: string
          summary?: string | null
          updated_at?: string
        }
        Update: {
          confidence_level?: string
          created_at?: string
          headline_score?: number | null
          id?: string
          methodology_version?: string
          period_end?: string | null
          period_label?: string
          period_start?: string | null
          previous_score?: number | null
          published_at?: string | null
          slug?: string
          status?: string
          summary?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      index_indicators: {
        Row: {
          category: string
          caveats: string | null
          collection_method: string
          confidence_level: string
          created_at: string
          data_classification: string
          description: string | null
          direction: string
          display_order: number
          forecast_year: number | null
          id: string
          is_forecast: boolean
          last_updated_at: string | null
          methodology: string | null
          name: string
          next_review_at: string | null
          short_name: string | null
          slug: string
          source_name: string | null
          source_type: string
          source_url: string | null
          status: string
          subindex_id: string | null
          unit: string
          update_frequency: string
          updated_at: string
          weight: number
        }
        Insert: {
          category?: string
          caveats?: string | null
          collection_method?: string
          confidence_level?: string
          created_at?: string
          data_classification?: string
          description?: string | null
          direction?: string
          display_order?: number
          forecast_year?: number | null
          id?: string
          is_forecast?: boolean
          last_updated_at?: string | null
          methodology?: string | null
          name: string
          next_review_at?: string | null
          short_name?: string | null
          slug: string
          source_name?: string | null
          source_type?: string
          source_url?: string | null
          status?: string
          subindex_id?: string | null
          unit?: string
          update_frequency?: string
          updated_at?: string
          weight?: number
        }
        Update: {
          category?: string
          caveats?: string | null
          collection_method?: string
          confidence_level?: string
          created_at?: string
          data_classification?: string
          description?: string | null
          direction?: string
          display_order?: number
          forecast_year?: number | null
          id?: string
          is_forecast?: boolean
          last_updated_at?: string | null
          methodology?: string | null
          name?: string
          next_review_at?: string | null
          short_name?: string | null
          slug?: string
          source_name?: string | null
          source_type?: string
          source_url?: string | null
          status?: string
          subindex_id?: string | null
          unit?: string
          update_frequency?: string
          updated_at?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "index_indicators_subindex_id_fkey"
            columns: ["subindex_id"]
            isOneToOne: false
            referencedRelation: "index_subindices"
            referencedColumns: ["id"]
          },
        ]
      }
      index_revisions: {
        Row: {
          change_type: string
          created_at: string
          edition_id: string | null
          entity_id: string | null
          entity_type: string
          id: string
          indicator_id: string | null
          is_public: boolean
          methodology_version: string | null
          new_value: string | null
          previous_value: string | null
          reason: string | null
          revised_at: string
          revised_by: string | null
          summary: string
        }
        Insert: {
          change_type?: string
          created_at?: string
          edition_id?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          indicator_id?: string | null
          is_public?: boolean
          methodology_version?: string | null
          new_value?: string | null
          previous_value?: string | null
          reason?: string | null
          revised_at?: string
          revised_by?: string | null
          summary: string
        }
        Update: {
          change_type?: string
          created_at?: string
          edition_id?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          indicator_id?: string | null
          is_public?: boolean
          methodology_version?: string | null
          new_value?: string | null
          previous_value?: string | null
          reason?: string | null
          revised_at?: string
          revised_by?: string | null
          summary?: string
        }
        Relationships: [
          {
            foreignKeyName: "index_revisions_edition_id_fkey"
            columns: ["edition_id"]
            isOneToOne: false
            referencedRelation: "index_editions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "index_revisions_indicator_id_fkey"
            columns: ["indicator_id"]
            isOneToOne: false
            referencedRelation: "index_indicators"
            referencedColumns: ["id"]
          },
        ]
      }
      index_source_links: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          note: string | null
          role: string
          source_id: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          note?: string | null
          role?: string
          source_id: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          note?: string | null
          role?: string
          source_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "index_source_links_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "index_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      index_sources: {
        Row: {
          accessed_at: string | null
          created_at: string
          geographic_coverage: string
          id: string
          indicators_supported: string | null
          last_reviewed_at: string | null
          notes: string | null
          organisation: string
          publication_date: string | null
          reliability_status: string
          reporting_period: string | null
          source_class: string
          source_type: string
          status: string
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          accessed_at?: string | null
          created_at?: string
          geographic_coverage?: string
          id?: string
          indicators_supported?: string | null
          last_reviewed_at?: string | null
          notes?: string | null
          organisation: string
          publication_date?: string | null
          reliability_status?: string
          reporting_period?: string | null
          source_class?: string
          source_type?: string
          status?: string
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          accessed_at?: string | null
          created_at?: string
          geographic_coverage?: string
          id?: string
          indicators_supported?: string | null
          last_reviewed_at?: string | null
          notes?: string | null
          organisation?: string
          publication_date?: string | null
          reliability_status?: string
          reporting_period?: string | null
          source_class?: string
          source_type?: string
          status?: string
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      index_subindices: {
        Row: {
          created_at: string
          direction: string
          display_order: number
          id: string
          intro: string | null
          last_reviewed_at: string | null
          name: string
          period_label: string | null
          score: number | null
          slug: string
          status: string
          status_label: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          direction?: string
          display_order?: number
          id?: string
          intro?: string | null
          last_reviewed_at?: string | null
          name: string
          period_label?: string | null
          score?: number | null
          slug: string
          status?: string
          status_label?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          direction?: string
          display_order?: number
          id?: string
          intro?: string | null
          last_reviewed_at?: string | null
          name?: string
          period_label?: string | null
          score?: number | null
          slug?: string
          status?: string
          status_label?: string
          updated_at?: string
        }
        Relationships: []
      }
      index_watch_findings: {
        Row: {
          created_at: string
          detail: string | null
          detected_at: string
          id: string
          kind: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          title: string
          updated_at: string
          url: string | null
          watch_id: string
        }
        Insert: {
          created_at?: string
          detail?: string | null
          detected_at?: string
          id?: string
          kind?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          title: string
          updated_at?: string
          url?: string | null
          watch_id: string
        }
        Update: {
          created_at?: string
          detail?: string | null
          detected_at?: string
          id?: string
          kind?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          title?: string
          updated_at?: string
          url?: string | null
          watch_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "index_watch_findings_watch_id_fkey"
            columns: ["watch_id"]
            isOneToOne: false
            referencedRelation: "index_watch_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      index_watch_settings: {
        Row: {
          alert_email: string
          alerts_enabled: boolean
          created_at: string
          id: boolean
          last_run_at: string | null
          last_run_summary: string | null
          paused: boolean
          updated_at: string
        }
        Insert: {
          alert_email?: string
          alerts_enabled?: boolean
          created_at?: string
          id?: boolean
          last_run_at?: string | null
          last_run_summary?: string | null
          paused?: boolean
          updated_at?: string
        }
        Update: {
          alert_email?: string
          alerts_enabled?: boolean
          created_at?: string
          id?: boolean
          last_run_at?: string | null
          last_run_summary?: string | null
          paused?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      index_watch_sources: {
        Row: {
          area: string
          content_hash: string | null
          created_at: string
          display_order: number
          enabled: boolean
          id: string
          label: string
          last_changed_at: string | null
          last_checked_at: string | null
          last_error: string | null
          last_status_code: number | null
          notes: string | null
          organisation: string
          source_id: string | null
          updated_at: string
          url: string
        }
        Insert: {
          area?: string
          content_hash?: string | null
          created_at?: string
          display_order?: number
          enabled?: boolean
          id?: string
          label: string
          last_changed_at?: string | null
          last_checked_at?: string | null
          last_error?: string | null
          last_status_code?: number | null
          notes?: string | null
          organisation?: string
          source_id?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          area?: string
          content_hash?: string | null
          created_at?: string
          display_order?: number
          enabled?: boolean
          id?: string
          label?: string
          last_changed_at?: string | null
          last_checked_at?: string | null
          last_error?: string | null
          last_status_code?: number | null
          notes?: string | null
          organisation?: string
          source_id?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "index_watch_sources_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "index_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      infrastructure_projects: {
        Row: {
          created_at: string
          description: string | null
          estimated_value_gbp: number | null
          id: string
          is_placeholder: boolean
          latitude: number | null
          longitude: number | null
          organisation: string | null
          project_name: string
          project_type: string
          region: string | null
          source_url: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          estimated_value_gbp?: number | null
          id?: string
          is_placeholder?: boolean
          latitude?: number | null
          longitude?: number | null
          organisation?: string | null
          project_name: string
          project_type?: string
          region?: string | null
          source_url?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          estimated_value_gbp?: number | null
          id?: string
          is_placeholder?: boolean
          latitude?: number | null
          longitude?: number | null
          organisation?: string | null
          project_name?: string
          project_type?: string
          region?: string | null
          source_url?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          consent_marketing: boolean
          created_at: string
          email: string
          id: string
          inputs: Json | null
          ip_hash: string | null
          last_alerted_at: string | null
          result_summary: Json | null
          source: string
          unsubscribed_at: string | null
          user_agent: string | null
          variant: string
        }
        Insert: {
          consent_marketing?: boolean
          created_at?: string
          email: string
          id?: string
          inputs?: Json | null
          ip_hash?: string | null
          last_alerted_at?: string | null
          result_summary?: Json | null
          source: string
          unsubscribed_at?: string | null
          user_agent?: string | null
          variant: string
        }
        Update: {
          consent_marketing?: boolean
          created_at?: string
          email?: string
          id?: string
          inputs?: Json | null
          ip_hash?: string | null
          last_alerted_at?: string | null
          result_summary?: Json | null
          source?: string
          unsubscribed_at?: string | null
          user_agent?: string | null
          variant?: string
        }
        Relationships: []
      }
      methodology_versions: {
        Row: {
          changes: string | null
          created_at: string
          effective_date: string
          id: string
          status: string
          summary: string
          updated_at: string
          version: string
        }
        Insert: {
          changes?: string | null
          created_at?: string
          effective_date: string
          id?: string
          status?: string
          summary: string
          updated_at?: string
          version: string
        }
        Update: {
          changes?: string | null
          created_at?: string
          effective_date?: string
          id?: string
          status?: string
          summary?: string
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      myth_submissions: {
        Row: {
          claim: string
          created_at: string
          email: string | null
          id: string
          ip_hash: string | null
          source_url: string | null
          status: string
          user_agent: string | null
        }
        Insert: {
          claim: string
          created_at?: string
          email?: string | null
          id?: string
          ip_hash?: string | null
          source_url?: string | null
          status?: string
          user_agent?: string | null
        }
        Update: {
          claim?: string
          created_at?: string
          email?: string | null
          id?: string
          ip_hash?: string | null
          source_url?: string | null
          status?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      nav_clicks: {
        Row: {
          created_at: string
          device: string | null
          from_path: string | null
          href: string
          id: string
          label: string
          landed_path: string | null
          location: string
          outcome: string
          visitor_hash: string | null
        }
        Insert: {
          created_at?: string
          device?: string | null
          from_path?: string | null
          href: string
          id?: string
          label: string
          landed_path?: string | null
          location: string
          outcome?: string
          visitor_hash?: string | null
        }
        Update: {
          created_at?: string
          device?: string | null
          from_path?: string | null
          href?: string
          id?: string
          label?: string
          landed_path?: string | null
          location?: string
          outcome?: string
          visitor_hash?: string | null
        }
        Relationships: []
      }
      news_articles: {
        Row: {
          analysis: Json
          categories: string[]
          confidence_rating: number | null
          created_at: string
          dedupe_hash: string
          faq: Json
          featured_image_url: string | null
          headline: string | null
          id: string
          is_breaking: boolean
          is_uk_focused: boolean
          key_statistics: Json
          meta_description: string | null
          meta_title: string | null
          og_image_url: string | null
          original_published_at: string | null
          published_at: string
          quality_score: number | null
          reading_time_minutes: number
          rejection_reason: string | null
          related_hub_links: Json
          review_status: string
          reviewed_at: string | null
          reviewed_by: string | null
          slug: string
          source_domain: string
          source_name: string
          source_tier: number
          source_url: string
          status: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          analysis?: Json
          categories?: string[]
          confidence_rating?: number | null
          created_at?: string
          dedupe_hash: string
          faq?: Json
          featured_image_url?: string | null
          headline?: string | null
          id?: string
          is_breaking?: boolean
          is_uk_focused?: boolean
          key_statistics?: Json
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          original_published_at?: string | null
          published_at?: string
          quality_score?: number | null
          reading_time_minutes?: number
          rejection_reason?: string | null
          related_hub_links?: Json
          review_status?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          slug: string
          source_domain: string
          source_name: string
          source_tier?: number
          source_url: string
          status?: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          analysis?: Json
          categories?: string[]
          confidence_rating?: number | null
          created_at?: string
          dedupe_hash?: string
          faq?: Json
          featured_image_url?: string | null
          headline?: string | null
          id?: string
          is_breaking?: boolean
          is_uk_focused?: boolean
          key_statistics?: Json
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          original_published_at?: string | null
          published_at?: string
          quality_score?: number | null
          reading_time_minutes?: number
          rejection_reason?: string | null
          related_hub_links?: Json
          review_status?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          slug?: string
          source_domain?: string
          source_name?: string
          source_tier?: number
          source_url?: string
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      news_ingestion_runs: {
        Row: {
          articles_published: number
          articles_skipped_duplicate: number
          articles_skipped_untrusted: number
          candidates_found: number
          error_message: string | null
          finished_at: string | null
          id: string
          meta: Json
          started_at: string
          status: string
          topics_searched: number
        }
        Insert: {
          articles_published?: number
          articles_skipped_duplicate?: number
          articles_skipped_untrusted?: number
          candidates_found?: number
          error_message?: string | null
          finished_at?: string | null
          id?: string
          meta?: Json
          started_at?: string
          status?: string
          topics_searched?: number
        }
        Update: {
          articles_published?: number
          articles_skipped_duplicate?: number
          articles_skipped_untrusted?: number
          candidates_found?: number
          error_message?: string | null
          finished_at?: string | null
          id?: string
          meta?: Json
          started_at?: string
          status?: string
          topics_searched?: number
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          kind: string
          link: string | null
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          link?: string | null
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          link?: string | null
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      page_views: {
        Row: {
          created_at: string
          device: string | null
          id: number
          path: string
          referrer_host: string | null
          visitor_hash: string | null
        }
        Insert: {
          created_at?: string
          device?: string | null
          id?: number
          path: string
          referrer_host?: string | null
          visitor_hash?: string | null
        }
        Update: {
          created_at?: string
          device?: string | null
          id?: number
          path?: string
          referrer_host?: string | null
          visitor_hash?: string | null
        }
        Relationships: []
      }
      rs_change_proposals: {
        Row: {
          current_value: number | null
          evidence: string
          factor: string
          found_at: string | null
          id: string
          project_name: string
          proposed_value: number | null
          reviewed_at: string | null
          source_url: string | null
          status: string | null
        }
        Insert: {
          current_value?: number | null
          evidence: string
          factor: string
          found_at?: string | null
          id?: string
          project_name: string
          proposed_value?: number | null
          reviewed_at?: string | null
          source_url?: string | null
          status?: string | null
        }
        Update: {
          current_value?: number | null
          evidence?: string
          factor?: string
          found_at?: string | null
          id?: string
          project_name?: string
          proposed_value?: number | null
          reviewed_at?: string | null
          source_url?: string | null
          status?: string | null
        }
        Relationships: []
      }
      sales_pipeline: {
        Row: {
          company: string
          contact_role: string | null
          created_at: string | null
          id: string
          next_step: string | null
          next_step_date: string | null
          notes: string | null
          offer: string | null
          source: string | null
          stage: string | null
          updated_at: string | null
          value_gbp: number | null
        }
        Insert: {
          company: string
          contact_role?: string | null
          created_at?: string | null
          id?: string
          next_step?: string | null
          next_step_date?: string | null
          notes?: string | null
          offer?: string | null
          source?: string | null
          stage?: string | null
          updated_at?: string | null
          value_gbp?: number | null
        }
        Update: {
          company?: string
          contact_role?: string | null
          created_at?: string | null
          id?: string
          next_step?: string | null
          next_step_date?: string | null
          notes?: string | null
          offer?: string | null
          source?: string | null
          stage?: string | null
          updated_at?: string | null
          value_gbp?: number | null
        }
        Relationships: []
      }
      saved_calculations: {
        Row: {
          created_at: string
          id: string
          inputs: Json
          last_viewed_at: string
          result_summary: Json
          tool_name: string
          tool_slug: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          inputs?: Json
          last_viewed_at?: string
          result_summary?: Json
          tool_name: string
          tool_slug: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          inputs?: Json
          last_viewed_at?: string
          result_summary?: Json
          tool_name?: string
          tool_slug?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_reports: {
        Row: {
          category: string
          created_at: string
          download_url: string | null
          id: string
          source: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          download_url?: string | null
          id?: string
          source?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          download_url?: string | null
          id?: string
          source?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          environment: string
          id: string
          paddle_customer_id: string
          paddle_subscription_id: string
          price_id: string
          product_id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string
          id?: string
          paddle_customer_id: string
          paddle_subscription_id: string
          price_id: string
          product_id: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string
          id?: string
          paddle_customer_id?: string
          paddle_subscription_id?: string
          price_id?: string
          product_id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      uptime_checks: {
        Row: {
          body_bytes: number | null
          checked_at: string
          failure_reason: string | null
          id: string
          latency_ms: number | null
          ok: boolean
          status_code: number | null
          target_id: string
        }
        Insert: {
          body_bytes?: number | null
          checked_at?: string
          failure_reason?: string | null
          id?: string
          latency_ms?: number | null
          ok: boolean
          status_code?: number | null
          target_id: string
        }
        Update: {
          body_bytes?: number | null
          checked_at?: string
          failure_reason?: string | null
          id?: string
          latency_ms?: number | null
          ok?: boolean
          status_code?: number | null
          target_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "uptime_checks_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "uptime_targets"
            referencedColumns: ["id"]
          },
        ]
      }
      uptime_settings: {
        Row: {
          alert_email: string
          alerts_enabled: boolean
          failure_threshold: number
          id: boolean
          updated_at: string
        }
        Insert: {
          alert_email?: string
          alerts_enabled?: boolean
          failure_threshold?: number
          id?: boolean
          updated_at?: string
        }
        Update: {
          alert_email?: string
          alerts_enabled?: boolean
          failure_threshold?: number
          id?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      uptime_state: {
        Row: {
          alerted: boolean
          consecutive_failures: number
          down_since: string | null
          last_alert_at: string | null
          last_failure_reason: string | null
          last_ok_at: string | null
          last_status_code: number | null
          target_id: string
          updated_at: string
        }
        Insert: {
          alerted?: boolean
          consecutive_failures?: number
          down_since?: string | null
          last_alert_at?: string | null
          last_failure_reason?: string | null
          last_ok_at?: string | null
          last_status_code?: number | null
          target_id: string
          updated_at?: string
        }
        Update: {
          alerted?: boolean
          consecutive_failures?: number
          down_since?: string | null
          last_alert_at?: string | null
          last_failure_reason?: string | null
          last_ok_at?: string | null
          last_status_code?: number | null
          target_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "uptime_state_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: true
            referencedRelation: "uptime_targets"
            referencedColumns: ["id"]
          },
        ]
      }
      uptime_targets: {
        Row: {
          allow_statuses: number[]
          created_at: string
          enabled: boolean
          environment: string
          expect_status: number
          expect_text: string | null
          id: string
          label: string
          path: string
          url: string
        }
        Insert: {
          allow_statuses?: number[]
          created_at?: string
          enabled?: boolean
          environment: string
          expect_status?: number
          expect_text?: string | null
          id?: string
          label: string
          path: string
          url: string
        }
        Update: {
          allow_statuses?: number[]
          created_at?: string
          enabled?: boolean
          environment?: string
          expect_status?: number
          expect_text?: string | null
          id?: string
          label?: string
          path?: string
          url?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          default_landing: string
          email_notifications: boolean
          theme: string
          units: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          default_landing?: string
          email_notifications?: boolean
          theme?: string
          units?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          default_landing?: string
          email_notifications?: boolean
          theme?: string
          units?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      watchlists: {
        Row: {
          created_at: string
          id: string
          label: string
          topic: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          topic: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          topic?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_active_subscription: {
        Args: { check_env?: string; user_uuid: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
