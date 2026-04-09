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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      badges: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          requirement_category: string | null
          requirement_type: string
          requirement_value: number
        }
        Insert: {
          created_at?: string
          description: string
          icon: string
          id?: string
          name: string
          requirement_category?: string | null
          requirement_type: string
          requirement_value: number
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          requirement_category?: string | null
          requirement_type?: string
          requirement_value?: number
        }
        Relationships: []
      }
      business_stories: {
        Row: {
          business_id: string
          business_name: string
          content: string
          created_at: string
          expires_at: string
          id: string
          image_url: string | null
          story_type: string
          title: string
          view_count: number
        }
        Insert: {
          business_id: string
          business_name: string
          content: string
          created_at?: string
          expires_at: string
          id?: string
          image_url?: string | null
          story_type?: string
          title: string
          view_count?: number
        }
        Update: {
          business_id?: string
          business_name?: string
          content?: string
          created_at?: string
          expires_at?: string
          id?: string
          image_url?: string | null
          story_type?: string
          title?: string
          view_count?: number
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      explored_cells: {
        Row: {
          cell_x: number
          cell_y: number
          explored_at: string
          id: string
          user_id: string
        }
        Insert: {
          cell_x: number
          cell_y: number
          explored_at?: string
          id?: string
          user_id: string
        }
        Update: {
          cell_x?: number
          cell_y?: number
          explored_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          business_id: number | null
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          metadata: Json | null
          name: string
          search_query: string | null
          type: string
          user_id: string
        }
        Insert: {
          business_id?: number | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          metadata?: Json | null
          name: string
          search_query?: string | null
          type: string
          user_id: string
        }
        Update: {
          business_id?: number | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          metadata?: Json | null
          name?: string
          search_query?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      live_business_metrics: {
        Row: {
          business_id: string
          business_name: string
          current_capacity: number | null
          id: string
          is_open: boolean
          last_updated: string
          max_capacity: number | null
          parking_spots_available: number | null
          wait_time_minutes: number | null
        }
        Insert: {
          business_id: string
          business_name: string
          current_capacity?: number | null
          id?: string
          is_open?: boolean
          last_updated?: string
          max_capacity?: number | null
          parking_spots_available?: number | null
          wait_time_minutes?: number | null
        }
        Update: {
          business_id?: string
          business_name?: string
          current_capacity?: number | null
          id?: string
          is_open?: boolean
          last_updated?: string
          max_capacity?: number | null
          parking_spots_available?: number | null
          wait_time_minutes?: number | null
        }
        Relationships: []
      }
      location_reminders: {
        Row: {
          business_id: string | null
          business_name: string | null
          created_at: string
          id: string
          is_active: boolean
          latitude: number
          longitude: number
          reminder_text: string
          trigger_radius_meters: number
          triggered_at: string | null
          user_id: string
        }
        Insert: {
          business_id?: string | null
          business_name?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          latitude: number
          longitude: number
          reminder_text: string
          trigger_radius_meters?: number
          triggered_at?: string | null
          user_id: string
        }
        Update: {
          business_id?: string | null
          business_name?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          latitude?: number
          longitude?: number
          reminder_text?: string
          trigger_radius_meters?: number
          triggered_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      micro_reviews: {
        Row: {
          business_id: string
          business_name: string
          created_at: string
          id: string
          tags: string[]
          user_id: string
        }
        Insert: {
          business_id: string
          business_name: string
          created_at?: string
          id?: string
          tags: string[]
          user_id: string
        }
        Update: {
          business_id?: string
          business_name?: string
          created_at?: string
          id?: string
          tags?: string[]
          user_id?: string
        }
        Relationships: []
      }
      place_playlists: {
        Row: {
          cover_image_url: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          name: string
          share_code: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name: string
          share_code?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name?: string
          share_code?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      playlist_items: {
        Row: {
          business_id: string
          business_name: string
          created_at: string
          id: string
          latitude: number
          longitude: number
          note: string | null
          order_index: number
          playlist_id: string
        }
        Insert: {
          business_id: string
          business_name: string
          created_at?: string
          id?: string
          latitude: number
          longitude: number
          note?: string | null
          order_index?: number
          playlist_id: string
        }
        Update: {
          business_id?: string
          business_name?: string
          created_at?: string
          id?: string
          latitude?: number
          longitude?: number
          note?: string | null
          order_index?: number
          playlist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "playlist_items_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "place_playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
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
          role?: Database["public"]["Enums"]["app_role"]
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
      user_visits: {
        Row: {
          business_id: string | null
          category: string | null
          id: string
          latitude: number
          location_name: string | null
          longitude: number
          user_id: string
          visited_at: string
        }
        Insert: {
          business_id?: string | null
          category?: string | null
          id?: string
          latitude: number
          location_name?: string | null
          longitude: number
          user_id: string
          visited_at?: string
        }
        Update: {
          business_id?: string | null
          category?: string | null
          id?: string
          latitude?: number
          location_name?: string | null
          longitude?: number
          user_id?: string
          visited_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
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
      app_role: "admin" | "user" | "guest" | "business"
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
      app_role: ["admin", "user", "guest", "business"],
    },
  },
} as const
