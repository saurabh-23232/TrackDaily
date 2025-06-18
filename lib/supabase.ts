import { createClient } from "@supabase/supabase-js"

// Your Supabase configuration
const supabaseUrl = "https://dkolqybkfiatarceboxh.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrb2xxeWJrZmlhdGFyY2Vib3hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNjY1MzgsImV4cCI6MjA2NTg0MjUzOH0.i2pakY-MGMBGHxcgdIERk2UyUHShbqWtvKIcJdnvdwU"

// Create Supabase client with proper configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
})

// Export a flag to check if Supabase is properly configured
export const isSupabaseConfigured = true

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          bio: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          progress: number
          status: "pending" | "completed" | "failed"
          created_at: string
          target_date: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          progress?: number
          status?: "pending" | "completed" | "failed"
          created_at?: string
          target_date: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          progress?: number
          status?: "pending" | "completed" | "failed"
          created_at?: string
          target_date?: string
          completed_at?: string | null
        }
      }
      journal_entries: {
        Row: {
          id: string
          user_id: string
          goal_id: string
          goal_title: string
          text: string
          media_url: string | null
          media_type: "photo" | "video" | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          goal_id: string
          goal_title: string
          text: string
          media_url?: string | null
          media_type?: "photo" | "video" | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          goal_id?: string
          goal_title?: string
          text?: string
          media_url?: string | null
          media_type?: "photo" | "video" | null
          created_at?: string
        }
      }
    }
  }
}
