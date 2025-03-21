export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      current_stock_prices: {
        Row: {
          demand: number
          elo: number
          id: number
          locked: number
          price: number
          sentiment: number | null
          symbol: string
        }
        Insert: {
          demand?: number
          elo?: number
          id?: number
          locked?: number
          price: number
          sentiment?: number | null
          symbol: string
        }
        Update: {
          demand?: number
          elo?: number
          id?: number
          locked?: number
          price?: number
          sentiment?: number | null
          symbol?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          best_of: number | null
          created_at: string
          match_date: string | null
          match_event: string | null
          match_event_img: string | null
          match_link: string
          match_series: string | null
          status: string | null
          team1_name: string | null
          team1_score: number | null
          team1_symbol: string | null
          team2_name: string | null
          team2_score: number | null
          team2_symbol: string | null
        }
        Insert: {
          best_of?: number | null
          created_at?: string
          match_date?: string | null
          match_event?: string | null
          match_event_img?: string | null
          match_link: string
          match_series?: string | null
          status?: string | null
          team1_name?: string | null
          team1_score?: number | null
          team1_symbol?: string | null
          team2_name?: string | null
          team2_score?: number | null
          team2_symbol?: string | null
        }
        Update: {
          best_of?: number | null
          created_at?: string
          match_date?: string | null
          match_event?: string | null
          match_event_img?: string | null
          match_link?: string
          match_series?: string | null
          status?: string | null
          team1_name?: string | null
          team1_score?: number | null
          team1_symbol?: string | null
          team2_name?: string | null
          team2_score?: number | null
          team2_symbol?: string | null
        }
        Relationships: []
      }
      networth_history: {
        Row: {
          interval_type: string
          networth: number | null
          timestamp: string
          user_id: string
        }
        Insert: {
          interval_type: string
          networth?: number | null
          timestamp?: string
          user_id: string
        }
        Update: {
          interval_type?: string
          networth?: number | null
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          balance: number | null
          id: string
          networth: number | null
          picture: string | null
          stocks: Json | null
          username: string | null
        }
        Insert: {
          balance?: number | null
          id: string
          networth?: number | null
          picture?: string | null
          stocks?: Json | null
          username?: string | null
        }
        Update: {
          balance?: number | null
          id?: string
          networth?: number | null
          picture?: string | null
          stocks?: Json | null
          username?: string | null
        }
        Relationships: []
      }
      stock_prices: {
        Row: {
          interval_type: string
          price: number
          symbol: string
          timestamp: string
        }
        Insert: {
          interval_type?: string
          price: number
          symbol: string
          timestamp: string
        }
        Update: {
          interval_type?: string
          price?: number
          symbol?: string
          timestamp?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_stock_schedules: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      buy_stock:
        | {
            Args: {
              in_symbol: string
              in_amount: number
            }
            Returns: undefined
          }
        | {
            Args: {
              in_symbol: string
              in_user_id: string
              in_amount: number
            }
            Returns: undefined
          }
      downsample_networth_history: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      downsample_stock_prices: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      fetch_at_specific_hour: {
        Args: {
          hour: number
        }
        Returns: {
          interval_type: string
          price: number
          symbol: string
          timestamp: string
        }[]
      }
      fetch_within_last_day: {
        Args: {
          symbol: string
        }
        Returns: {
          interval_type: string
          price: number
          symbol: string
          timestamp: string
        }[]
      }
      fetch_within_last_hour:
        | {
            Args: Record<PropertyKey, never>
            Returns: {
              interval_type: string
              price: number
              symbol: string
              timestamp: string
            }[]
          }
        | {
            Args: {
              symbol: string
            }
            Returns: {
              interval_type: string
              price: number
              symbol: string
              timestamp: string
            }[]
          }
      fetch_within_last_week: {
        Args: {
          symbol: string
        }
        Returns: {
          interval_type: string
          price: number
          symbol: string
          timestamp: string
        }[]
      }
      insert_networth: {
        Args: {
          user_uuid: string
          new_networth: number
        }
        Returns: undefined
      }
      sell_stock:
        | {
            Args: {
              in_symbol: string
              in_amount: number
            }
            Returns: undefined
          }
        | {
            Args: {
              in_symbol: string
              in_user_id: string
              in_amount: number
            }
            Returns: undefined
          }
      update_user_net_worth: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
