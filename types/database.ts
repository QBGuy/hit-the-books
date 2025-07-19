export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      opportunities: {
        Row: {
          sport: string
          bookie_1: string
          odds_1: number
          team_1: string
          bookie_2: string
          odds_2: number
          team_2: string
          stake_2: number
          profit: number
          betfair_scalar: number
          bookie: string
          bet_type: string
          timestamp: string
        }
        Insert: {
          sport: string
          bookie_1: string
          odds_1: number
          team_1: string
          bookie_2: string
          odds_2: number
          team_2: string
          stake_2: number
          profit: number
          betfair_scalar: number
          bookie: string
          bet_type: string
          timestamp?: string
        }
        Update: {
          sport?: string
          bookie_1?: string
          odds_1?: number
          team_1?: string
          bookie_2?: string
          odds_2?: number
          team_2?: string
          stake_2?: number
          profit?: number
          betfair_scalar?: number
          bookie?: string
          bet_type?: string
          timestamp?: string
        }
        Relationships: []
      }
      bet_log: {
        Row: {
          id: string
          user_id: string
          username: string
          sport: string
          bookie_1: string
          odds_1: number
          team_1: string
          stake_1: number
          bookie_2: string
          odds_2: number
          team_2: string
          stake_2: number
          profit: number
          profit_actual: number | null
          betfair_scalar: number
          bookie: string
          bet_type: string
          timestamp: string
        }
        Insert: {
          id?: string
          user_id: string
          username: string
          sport: string
          bookie_1: string
          odds_1: number
          team_1: string
          stake_1: number
          bookie_2: string
          odds_2: number
          team_2: string
          stake_2: number
          profit: number
          profit_actual?: number | null
          betfair_scalar: number
          bookie: string
          bet_type: string
          timestamp?: string
        }
        Update: {
          id?: string
          user_id?: string
          username?: string
          sport?: string
          bookie_1?: string
          odds_1?: number
          team_1?: string
          stake_1?: number
          bookie_2?: string
          odds_2?: number
          team_2?: string
          stake_2?: number
          profit?: number
          profit_actual?: number | null
          betfair_scalar?: number
          bookie?: string
          bet_type?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "bet_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_actions: {
        Row: {
          id: number
          user_id: string
          username: string
          email: string
          action_type: string
          action_details: Json | null
          timestamp: string
        }
        Insert: {
          id?: number
          user_id: string
          username: string
          email: string
          action_type: string
          action_details?: Json | null
          timestamp?: string
        }
        Update: {
          id?: number
          user_id?: string
          username?: string
          email?: string
          action_type?: string
          action_details?: Json | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_actions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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