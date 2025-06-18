import { supabase, isSupabaseConfigured } from "./supabase"
import type { Goal, JournalEntry } from "@/types/app-types"

// Check if Supabase is configured before making calls
const checkSupabaseConfig = () => {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not properly configured. Please check your environment variables.")
  }
}

// Goals operations
export const getGoals = async (userId: string): Promise<Goal[]> => {
  checkSupabaseConfig()

  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error

  return data.map((goal) => ({
    id: goal.id,
    title: goal.title,
    description: goal.description,
    progress: goal.progress,
    status: goal.status as "pending" | "completed" | "failed",
    createdAt: new Date(goal.created_at),
    targetDate: new Date(goal.target_date),
    completedAt: goal.completed_at ? new Date(goal.completed_at) : undefined,
  }))
}

export const createGoal = async (
  userId: string,
  goalData: {
    title: string
    description: string
    targetDate: Date
  },
): Promise<Goal> => {
  checkSupabaseConfig()

  const { data, error } = await supabase
    .from("goals")
    .insert({
      user_id: userId,
      title: goalData.title,
      description: goalData.description,
      target_date: goalData.targetDate.toISOString(),
    })
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    progress: data.progress,
    status: data.status as "pending" | "completed" | "failed",
    createdAt: new Date(data.created_at),
    targetDate: new Date(data.target_date),
    completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
  }
}

export const updateGoal = async (
  goalId: string,
  updates: {
    progress?: number
    status?: "pending" | "completed" | "failed"
    completedAt?: Date
  },
) => {
  checkSupabaseConfig()

  const updateData: any = {}

  if (updates.progress !== undefined) updateData.progress = updates.progress
  if (updates.status) updateData.status = updates.status
  if (updates.completedAt) updateData.completed_at = updates.completedAt.toISOString()

  const { error } = await supabase.from("goals").update(updateData).eq("id", goalId)

  if (error) throw error
}

export const deleteGoal = async (goalId: string) => {
  checkSupabaseConfig()

  const { error } = await supabase.from("goals").delete().eq("id", goalId)

  if (error) throw error
}

// Journal entries operations
export const getJournalEntries = async (userId: string): Promise<JournalEntry[]> => {
  checkSupabaseConfig()

  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error

  return data.map((entry) => ({
    id: entry.id,
    goalId: entry.goal_id,
    goalTitle: entry.goal_title,
    text: entry.text,
    mediaUrl: entry.media_url || "",
    mediaType: entry.media_type as "photo" | "video",
    createdAt: new Date(entry.created_at),
  }))
}

export const createJournalEntry = async (
  userId: string,
  entryData: {
    goalId: string
    goalTitle: string
    text: string
    mediaUrl: string
    mediaType: "photo" | "video"
  },
): Promise<JournalEntry> => {
  checkSupabaseConfig()

  const { data, error } = await supabase
    .from("journal_entries")
    .insert({
      user_id: userId,
      goal_id: entryData.goalId,
      goal_title: entryData.goalTitle,
      text: entryData.text,
      media_url: entryData.mediaUrl,
      media_type: entryData.mediaType,
    })
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    goalId: data.goal_id,
    goalTitle: data.goal_title,
    text: data.text,
    mediaUrl: data.media_url || "",
    mediaType: data.media_type as "photo" | "video",
    createdAt: new Date(data.created_at),
  }
}

// Batch operations
export const clearPendingGoals = async (userId: string) => {
  checkSupabaseConfig()

  const { error } = await supabase.from("goals").delete().eq("user_id", userId).eq("status", "pending")

  if (error) throw error
}

export const markExpiredGoalsAsFailed = async (userId: string) => {
  checkSupabaseConfig()

  const now = new Date()
  const { error } = await supabase
    .from("goals")
    .update({ status: "failed" })
    .eq("user_id", userId)
    .eq("status", "pending")
    .lt("target_date", now.toISOString())

  if (error) throw error
}
