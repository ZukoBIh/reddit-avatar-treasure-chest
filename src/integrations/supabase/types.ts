export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_key: string
          created_at: string
          description: string
          icon: string
          id: string
          is_active: boolean
          requirement_type: string
          requirement_value: number
          reward_hroom: number
          reward_spores: number
          title: string
          updated_at: string
        }
        Insert: {
          achievement_key: string
          created_at?: string
          description: string
          icon: string
          id?: string
          is_active?: boolean
          requirement_type: string
          requirement_value?: number
          reward_hroom?: number
          reward_spores?: number
          title: string
          updated_at?: string
        }
        Update: {
          achievement_key?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          is_active?: boolean
          requirement_type?: string
          requirement_value?: number
          reward_hroom?: number
          reward_spores?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      chest_cooldowns: {
        Row: {
          created_at: string
          id: string
          last_opened_at: string
          nft_id: string
          wallet_address: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_opened_at?: string
          nft_id: string
          wallet_address: string
        }
        Update: {
          created_at?: string
          id?: string
          last_opened_at?: string
          nft_id?: string
          wallet_address?: string
        }
        Relationships: []
      }
      collection_completions: {
        Row: {
          completion_bonus_claimed: boolean
          created_at: string
          first_completion_at: string | null
          id: string
          updated_at: string
          wallet_address: string
        }
        Insert: {
          completion_bonus_claimed?: boolean
          created_at?: string
          first_completion_at?: string | null
          id?: string
          updated_at?: string
          wallet_address: string
        }
        Update: {
          completion_bonus_claimed?: boolean
          created_at?: string
          first_completion_at?: string | null
          id?: string
          updated_at?: string
          wallet_address?: string
        }
        Relationships: []
      }
      level_rewards_pool: {
        Row: {
          created_at: string
          hroom_amount: number
          id: string
          is_active: boolean
          max_level: number
          min_level: number
          reward_type: string
          spore_amount: number
          updated_at: string
          weight: number
        }
        Insert: {
          created_at?: string
          hroom_amount?: number
          id?: string
          is_active?: boolean
          max_level?: number
          min_level?: number
          reward_type: string
          spore_amount?: number
          updated_at?: string
          weight?: number
        }
        Update: {
          created_at?: string
          hroom_amount?: number
          id?: string
          is_active?: boolean
          max_level?: number
          min_level?: number
          reward_type?: string
          spore_amount?: number
          updated_at?: string
          weight?: number
        }
        Relationships: []
      }
      leveling_config: {
        Row: {
          base_xp_requirement: number
          created_at: string
          id: string
          max_level: number
          updated_at: string
          xp_scaling_factor: number
        }
        Insert: {
          base_xp_requirement?: number
          created_at?: string
          id?: string
          max_level?: number
          updated_at?: string
          xp_scaling_factor?: number
        }
        Update: {
          base_xp_requirement?: number
          created_at?: string
          id?: string
          max_level?: number
          updated_at?: string
          xp_scaling_factor?: number
        }
        Relationships: []
      }
      nft_rarities: {
        Row: {
          created_at: string
          id: string
          nft_id: string
          rarity: string
          updated_at: string
          wallet_address: string
        }
        Insert: {
          created_at?: string
          id?: string
          nft_id: string
          rarity: string
          updated_at?: string
          wallet_address: string
        }
        Update: {
          created_at?: string
          id?: string
          nft_id?: string
          rarity?: string
          updated_at?: string
          wallet_address?: string
        }
        Relationships: []
      }
      rarity_rewards: {
        Row: {
          base_xp_max: number
          base_xp_min: number
          created_at: string
          id: string
          level_up_hroom: number
          level_up_spore: number
          rarity: string
          token_amount_max: number
          token_amount_min: number
          token_drop_chance: number
          updated_at: string
        }
        Insert: {
          base_xp_max?: number
          base_xp_min?: number
          created_at?: string
          id?: string
          level_up_hroom?: number
          level_up_spore?: number
          rarity: string
          token_amount_max?: number
          token_amount_min?: number
          token_drop_chance?: number
          updated_at?: string
        }
        Update: {
          base_xp_max?: number
          base_xp_min?: number
          created_at?: string
          id?: string
          level_up_hroom?: number
          level_up_spore?: number
          rarity?: string
          token_amount_max?: number
          token_amount_min?: number
          token_drop_chance?: number
          updated_at?: string
        }
        Relationships: []
      }
      reward_config: {
        Row: {
          base_xp_max: number
          base_xp_min: number
          config_type: string
          created_at: string
          id: string
          level_up_hroom: number
          level_up_spore: number
          token_amount_max: number
          token_amount_min: number
          token_drop_chance: number
          updated_at: string
        }
        Insert: {
          base_xp_max?: number
          base_xp_min?: number
          config_type: string
          created_at?: string
          id?: string
          level_up_hroom?: number
          level_up_spore?: number
          token_amount_max?: number
          token_amount_min?: number
          token_drop_chance?: number
          updated_at?: string
        }
        Update: {
          base_xp_max?: number
          base_xp_min?: number
          config_type?: string
          created_at?: string
          id?: string
          level_up_hroom?: number
          level_up_spore?: number
          token_amount_max?: number
          token_amount_min?: number
          token_drop_chance?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_key: string
          completed_at: string | null
          created_at: string
          id: string
          is_completed: boolean
          progress: number
          updated_at: string
          wallet_address: string
        }
        Insert: {
          achievement_key: string
          completed_at?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean
          progress?: number
          updated_at?: string
          wallet_address: string
        }
        Update: {
          achievement_key?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean
          progress?: number
          updated_at?: string
          wallet_address?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string
          current_xp: number
          id: string
          is_admin: boolean
          level: number
          total_hroom: number
          total_spores: number
          updated_at: string
          wallet_address: string
        }
        Insert: {
          created_at?: string
          current_xp?: number
          id?: string
          is_admin?: boolean
          level?: number
          total_hroom?: number
          total_spores?: number
          updated_at?: string
          wallet_address: string
        }
        Update: {
          created_at?: string
          current_xp?: number
          id?: string
          is_admin?: boolean
          level?: number
          total_hroom?: number
          total_spores?: number
          updated_at?: string
          wallet_address?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
