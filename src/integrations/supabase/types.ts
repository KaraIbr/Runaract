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
      consents: {
        Row: {
          accepted_at: string
          consent_accepted: boolean
          created_at: string
          id: string
          participant_id: string
          privacy_accepted: boolean
          terms_accepted: boolean
        }
        Insert: {
          accepted_at?: string
          consent_accepted?: boolean
          created_at?: string
          id?: string
          participant_id: string
          privacy_accepted: boolean
          terms_accepted: boolean
        }
        Update: {
          accepted_at?: string
          consent_accepted?: boolean
          created_at?: string
          id?: string
          participant_id?: string
          privacy_accepted?: boolean
          terms_accepted?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "consents_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      participants: {
        Row: {
          birth_date: string
          category_id: number
          created_at: string
          email: string
          emergency_contact_name: string
          emergency_contact_phone: string
          first_name: string
          gender: Database["public"]["Enums"]["gender_type"]
          id: string
          is_minor: boolean
          carta_responsiva_url: string | null
          last_name: string
          marketing_accepted: boolean
          phone: string
          registration_folio: string | null
          shirt_size: Database["public"]["Enums"]["shirt_size_type"]
          updated_at: string
        }
        Insert: {
          birth_date: string
          category_id: number
          created_at?: string
          email: string
          emergency_contact_name: string
          emergency_contact_phone: string
          first_name: string
          gender: Database["public"]["Enums"]["gender_type"]
          id?: string
          is_minor?: boolean
          carta_responsiva_url?: string | null
          last_name: string
          marketing_accepted?: boolean
          phone: string
          registration_folio?: string | null
          shirt_size: Database["public"]["Enums"]["shirt_size_type"]
          updated_at?: string
        }
        Update: {
          birth_date?: string
          category_id?: number
          created_at?: string
          email?: string
          emergency_contact_name?: string
          emergency_contact_phone?: string
          first_name?: string
          gender?: Database["public"]["Enums"]["gender_type"]
          id?: string
          is_minor?: boolean
          carta_responsiva_url?: string | null
          last_name?: string
          marketing_accepted?: boolean
          phone?: string
          registration_folio?: string | null
          shirt_size?: Database["public"]["Enums"]["shirt_size_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "participants_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "race_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          mercadopago_payment_id: string | null
          mercadopago_preference_id: string | null
          participant_id: string
          payment_method: Database["public"]["Enums"]["payment_method_type"]
          payment_status: Database["public"]["Enums"]["payment_status_type"]
          receipt_uploaded_at: string | null
          receipt_url: string | null
          rejection_reason: string | null
          updated_at: string
          validated_at: string | null
          validated_by: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          mercadopago_payment_id?: string | null
          mercadopago_preference_id?: string | null
          participant_id: string
          payment_method: Database["public"]["Enums"]["payment_method_type"]
          payment_status?: Database["public"]["Enums"]["payment_status_type"]
          receipt_uploaded_at?: string | null
          receipt_url?: string | null
          rejection_reason?: string | null
          updated_at?: string
          validated_at?: string | null
          validated_by?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          mercadopago_payment_id?: string | null
          mercadopago_preference_id?: string | null
          participant_id?: string
          payment_method?: Database["public"]["Enums"]["payment_method_type"]
          payment_status?: Database["public"]["Enums"]["payment_status_type"]
          receipt_uploaded_at?: string | null
          receipt_url?: string | null
          rejection_reason?: string | null
          updated_at?: string
          validated_at?: string | null
          validated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      race_categories: {
        Row: {
          active: boolean
          created_at: string
          distance_km: number
          id: number
          name: string
          price: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          distance_km: number
          id?: number
          name: string
          price: number
        }
        Update: {
          active?: boolean
          created_at?: string
          distance_km?: number
          id?: number
          name?: string
          price?: number
        }
        Relationships: []
      }
      sponsors: {
        Row: {
          id: string
          name: string
          description: string | null
          logo_url: string | null
          website_url: string | null
          social_url: string | null
          sponsorship_level: string
          display_order: number
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          logo_url?: string | null
          website_url?: string | null
          social_url?: string | null
          sponsorship_level?: string
          display_order?: number
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          logo_url?: string | null
          website_url?: string | null
          social_url?: string | null
          sponsorship_level?: string
          display_order?: number
          active?: boolean
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      race_categories_with_current_price: {
        Row: {
          id: number | null
          name: string | null
          distance_km: number | null
          current_price: number | null
          base_price: number | null
          active: boolean | null
        }
        Relationships: []
      }
    }
    Functions: {
      current_price: {
        Args: { p_distance_km: number }
        Returns: number
      }
      lookup_registration: {
        Args: { p_email?: string; p_folio?: string }
        Returns: {
          first_name: string
          last_name: string
          distance_km: number
          payment_status: string
          registration_folio: string
          contact_email: string
          category_name: string
        }[]
      }
    }
    Enums: {
      gender_type: "male" | "female" | "prefer_not_to_say"
      payment_method_type: "mercadopago" | "transferencia"
      payment_status_type:
        | "pending"
        | "review"
        | "approved"
        | "rejected"
        | "cancelled"
      shirt_size_type: "S" | "M" | "L" | "XL"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      gender_type: ["male", "female", "prefer_not_to_say"],
      payment_method_type: ["mercadopago", "transferencia"],
      payment_status_type: [
        "pending",
        "review",
        "approved",
        "rejected",
        "cancelled",
      ],
      shirt_size_type: ["S", "M", "L", "XL"],
    },
  },
} as const
