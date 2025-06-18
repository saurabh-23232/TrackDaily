export interface Goal {
  id: string
  title: string
  description: string
  createdAt: Date
  targetDate: Date
  status: "pending" | "completed" | "failed"
  progress: number
  completedAt?: Date
}

export interface JournalEntry {
  id: string
  goalId: string
  goalTitle: string
  text: string
  mediaUrl: string
  mediaType: "photo" | "video"
  createdAt: Date
}
