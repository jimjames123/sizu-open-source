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
    PostgrestVersion: "12.2.3"
  }
  public: {
    Tables: {
      admin_settings: {
        Row: {
          admin_email: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          admin_email: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          admin_email?: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      business_adverts: {
        Row: {
          business_category: string
          business_name: string
          contact_info: string
          created_at: string
          end_date: string
          flyer_url: string | null
          id: string
          is_active: boolean
          physical_address: string
          start_date: string
          updated_at: string
        }
        Insert: {
          business_category: string
          business_name: string
          contact_info: string
          created_at?: string
          end_date: string
          flyer_url?: string | null
          id?: string
          is_active?: boolean
          physical_address: string
          start_date: string
          updated_at?: string
        }
        Update: {
          business_category?: string
          business_name?: string
          contact_info?: string
          created_at?: string
          end_date?: string
          flyer_url?: string | null
          id?: string
          is_active?: boolean
          physical_address?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      collaboration_feedback: {
        Row: {
          created_at: string
          id: string
          match_score: number | null
          project_id: string
          rationale: Json | null
          reviewed_by: string | null
          suggested_org_id: string | null
          suggested_project_id: string | null
          verdict: string
        }
        Insert: {
          created_at?: string
          id?: string
          match_score?: number | null
          project_id: string
          rationale?: Json | null
          reviewed_by?: string | null
          suggested_org_id?: string | null
          suggested_project_id?: string | null
          verdict: string
        }
        Update: {
          created_at?: string
          id?: string
          match_score?: number | null
          project_id?: string
          rationale?: Json | null
          reviewed_by?: string | null
          suggested_org_id?: string | null
          suggested_project_id?: string | null
          verdict?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaboration_feedback_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaboration_feedback_suggested_org_id_fkey"
            columns: ["suggested_org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaboration_feedback_suggested_project_id_fkey"
            columns: ["suggested_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      duplicate_feedback: {
        Row: {
          created_at: string
          id: string
          project_id: string
          reasons: Json | null
          reviewed_by: string | null
          similar_project_id: string
          similarity_score: number | null
          verdict: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          reasons?: Json | null
          reviewed_by?: string | null
          similar_project_id: string
          similarity_score?: number | null
          verdict: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          reasons?: Json | null
          reviewed_by?: string | null
          similar_project_id?: string
          similarity_score?: number | null
          verdict?: string
        }
        Relationships: [
          {
            foreignKeyName: "duplicate_feedback_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "duplicate_feedback_similar_project_id_fkey"
            columns: ["similar_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          event_date: string
          event_type: string | null
          id: string
          image_url: string | null
          is_active: boolean
          location: string
          online_link: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          event_date: string
          event_type?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          location: string
          online_link?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          event_date?: string
          event_type?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          location?: string
          online_link?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          amount_max: number | null
          amount_min: number | null
          application_link: string
          created_at: string
          currency: string
          deadline: string | null
          description: string | null
          eligibility: string | null
          funder_name: string
          id: string
          opportunity_type: string
          region: string | null
          sdg: string | null
          sector: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          amount_max?: number | null
          amount_min?: number | null
          application_link: string
          created_at?: string
          currency?: string
          deadline?: string | null
          description?: string | null
          eligibility?: string | null
          funder_name: string
          id?: string
          opportunity_type?: string
          region?: string | null
          sdg?: string | null
          sector?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          amount_max?: number | null
          amount_min?: number | null
          application_link?: string
          created_at?: string
          currency?: string
          deadline?: string | null
          description?: string | null
          eligibility?: string | null
          funder_name?: string
          id?: string
          opportunity_type?: string
          region?: string | null
          sdg?: string | null
          sector?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      organizations: {
        Row: {
          address: string
          created_at: string
          description: string | null
          id: string
          is_paid: boolean
          logo_url: string | null
          name: string
          organization_type: string
          phone: string | null
          subscription_expires_at: string | null
          updated_at: string
          user_id: string | null
          website: string | null
        }
        Insert: {
          address: string
          created_at?: string
          description?: string | null
          id?: string
          is_paid?: boolean
          logo_url?: string | null
          name: string
          organization_type: string
          phone?: string | null
          subscription_expires_at?: string | null
          updated_at?: string
          user_id?: string | null
          website?: string | null
        }
        Update: {
          address?: string
          created_at?: string
          description?: string | null
          id?: string
          is_paid?: boolean
          logo_url?: string | null
          name?: string
          organization_type?: string
          phone?: string | null
          subscription_expires_at?: string | null
          updated_at?: string
          user_id?: string | null
          website?: string | null
        }
        Relationships: []
      }
      page_views: {
        Row: {
          created_at: string
          id: string
          path: string
          referrer: string | null
          session_id: string
          source: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          path: string
          referrer?: string | null
          session_id: string
          source?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          path?: string
          referrer?: string | null
          session_id?: string
          source?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      payment_requests: {
        Row: {
          approved: boolean
          approved_by: string | null
          created_at: string
          id: string
          org_id: string
          organization_id: string | null
          payment_proof_url: string | null
          reference_code: string
          status: string | null
          submitted_at: string | null
          submitted_by: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          approved?: boolean
          approved_by?: string | null
          created_at?: string
          id?: string
          org_id: string
          organization_id?: string | null
          payment_proof_url?: string | null
          reference_code: string
          status?: string | null
          submitted_at?: string | null
          submitted_by: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          approved?: boolean
          approved_by?: string | null
          created_at?: string
          id?: string
          org_id?: string
          organization_id?: string | null
          payment_proof_url?: string | null
          reference_code?: string
          status?: string | null
          submitted_at?: string | null
          submitted_by?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_requests_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      policy_briefs: {
        Row: {
          content_json: Json | null
          content_markdown: string
          created_at: string
          generated_by: string | null
          id: string
          region: string | null
          sector: string | null
          title: string
        }
        Insert: {
          content_json?: Json | null
          content_markdown: string
          created_at?: string
          generated_by?: string | null
          id?: string
          region?: string | null
          sector?: string | null
          title: string
        }
        Update: {
          content_json?: Json | null
          content_markdown?: string
          created_at?: string
          generated_by?: string | null
          id?: string
          region?: string | null
          sector?: string | null
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string
          created_at: string
          id: string
          logo_url: string | null
          organization_brief: string
          organization_id: string | null
          organization_name: string
          organization_type: string
          phone: string
          updated_at: string
          website: string | null
        }
        Insert: {
          address: string
          created_at?: string
          id: string
          logo_url?: string | null
          organization_brief: string
          organization_id?: string | null
          organization_name: string
          organization_type: string
          phone: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          logo_url?: string | null
          organization_brief?: string
          organization_id?: string | null
          organization_name?: string
          organization_type?: string
          phone?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          brief: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          image: string | null
          location: string
          metadata: Json | null
          name: string
          organization_id: string
          sdg: string
          sector: string
          start_date: string
          status: string
          target_groups: string[]
          updated_at: string
        }
        Insert: {
          brief: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          image?: string | null
          location: string
          metadata?: Json | null
          name: string
          organization_id: string
          sdg: string
          sector: string
          start_date: string
          status: string
          target_groups: string[]
          updated_at?: string
        }
        Update: {
          brief?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          image?: string | null
          location?: string
          metadata?: Json | null
          name?: string
          organization_id?: string
          sdg?: string
          sector?: string
          start_date?: string
          status?: string
          target_groups?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          approved_by: string | null
          created_at: string | null
          end_date: string
          id: string
          is_active: boolean | null
          organization_id: string | null
          payment_proof_url: string | null
          payment_reference: string | null
          start_date: string
        }
        Insert: {
          approved_by?: string | null
          created_at?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          organization_id?: string | null
          payment_proof_url?: string | null
          payment_reference?: string | null
          start_date: string
        }
        Update: {
          approved_by?: string | null
          created_at?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          organization_id?: string | null
          payment_proof_url?: string | null
          payment_reference?: string | null
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      vital_info: {
        Row: {
          category: string
          created_at: string
          id: string
          last_updated: string
          source_name: string
          status: string
          summary: string
          title: string
          valid_until: string | null
          web_link: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          last_updated?: string
          source_name: string
          status?: string
          summary: string
          title: string
          valid_until?: string | null
          web_link: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          last_updated?: string
          source_name?: string
          status?: string
          summary?: string
          title?: string
          valid_until?: string | null
          web_link?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_create_projects: { Args: { org_id: string }; Returns: boolean }
      check_admin_tables_exist: {
        Args: never
        Returns: {
          count: number
        }[]
      }
      get_all_user_emails: {
        Args: never
        Returns: {
          email: string
        }[]
      }
      is_admin: { Args: never; Returns: boolean }
      is_admin_by_email: {
        Args: { email: string }
        Returns: {
          count: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
