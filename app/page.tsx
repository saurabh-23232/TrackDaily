"use client"

import { useState, useEffect } from "react"
import { AddGoalDialog } from "@/components/add-goal-dialog"
import { HomeScreen } from "@/components/screens/home-screen"
import { JournalScreen } from "@/components/screens/journal-screen"
import { FailuresScreen } from "@/components/screens/failures-screen"
import { SettingsScreen } from "@/components/screens/settings-screen"
import { JournalEntryModal } from "@/components/modals/journal-entry-modal"
import { BottomNavigation } from "@/components/navigation/bottom-navigation"
import { ThemeProvider } from "@/components/theme-provider"
import type { Goal as AppGoal, JournalEntry } from "@/types/app-types"

export default function TrackDailyApp() {
  const [activeTab, setActiveTab] = useState("home")
  const [goals, setGoals] = useState<AppGoal[]>([])
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [selectedGoal, setSelectedGoal] = useState<AppGoal | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const savedGoals = localStorage.getItem("trackdaily-goals")
        const savedJournalEntries = localStorage.getItem("trackdaily-journal")

        if (savedGoals) {
          const parsedGoals = JSON.parse(savedGoals).map((goal: any) => ({
            ...goal,
            createdAt: new Date(goal.createdAt),
            targetDate: new Date(goal.targetDate),
            completedAt: goal.completedAt ? new Date(goal.completedAt) : undefined,
          }))
          setGoals(parsedGoals)
        } else {
          // Initialize with sample data if no saved data
          initializeDemoData()
        }

        if (savedJournalEntries) {
          const parsedEntries = JSON.parse(savedJournalEntries).map((entry: any) => ({
            ...entry,
            createdAt: new Date(entry.createdAt),
          }))
          setJournalEntries(parsedEntries)
        }
      } catch (error) {
        console.error("Failed to load data from localStorage:", error)
        initializeDemoData()
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Save goals to localStorage whenever they change
  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem("trackdaily-goals", JSON.stringify(goals))
    }
  }, [goals])

  // Save journal entries to localStorage whenever they change
  useEffect(() => {
    if (journalEntries.length > 0) {
      localStorage.setItem("trackdaily-journal", JSON.stringify(journalEntries))
    }
  }, [journalEntries])

  // Check for expired goals periodically
  useEffect(() => {
    const checkExpiredGoals = () => {
      const now = new Date()
      setGoals((prevGoals) =>
        prevGoals.map((goal) => {
          if (goal.status === "pending" && now > goal.targetDate) {
            return { ...goal, status: "failed" as const }
          }
          return goal
        }),
      )
    }

    const interval = setInterval(checkExpiredGoals, 60000) // Check every minute
    checkExpiredGoals()
    return () => clearInterval(interval)
  }, [])

  const initializeDemoData = () => {
    const sampleGoals: AppGoal[] = [
      {
        id: "demo-1",
        title: "Morning Workout",
        description: "30 minutes of cardio and strength training",
        createdAt: new Date(),
        targetDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: "pending",
        progress: 0,
      },
      {
        id: "demo-2",
        title: "Read 20 Pages",
        description: "Continue reading 'Atomic Habits'",
        createdAt: new Date(),
        targetDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: "pending",
        progress: 0,
      },
      {
        id: "demo-3",
        title: "Drink 8 Glasses of Water",
        description: "Stay hydrated throughout the day",
        createdAt: new Date(),
        targetDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: "pending",
        progress: 60,
      },
    ]
    setGoals(sampleGoals)
  }

  const handleCompleteGoal = (goal: AppGoal) => {
    setSelectedGoal(goal)
    setIsJournalModalOpen(true)
  }

  const handleJournalSubmit = (journalData: { text: string; mediaUrl: string; mediaType: "photo" | "video" }) => {
    if (!selectedGoal) return

    // Update goal status
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === selectedGoal.id
          ? {
              ...goal,
              status: "completed" as const,
              progress: 100,
              completedAt: new Date(),
            }
          : goal,
      ),
    )

    // Add journal entry
    const newEntry: JournalEntry = {
      id: `entry-${Date.now()}`,
      goalId: selectedGoal.id,
      goalTitle: selectedGoal.title,
      text: journalData.text,
      mediaUrl: journalData.mediaUrl,
      mediaType: journalData.mediaType,
      createdAt: new Date(),
    }
    setJournalEntries((prev) => [...prev, newEntry])

    setIsJournalModalOpen(false)
    setSelectedGoal(null)
  }

  const updateGoalProgress = (goalId: string, progress: number) => {
    setGoals((prev) => prev.map((goal) => (goal.id === goalId ? { ...goal, progress } : goal)))
  }

  const addGoal = (goalData: { title: string; description: string }) => {
    const now = new Date()
    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    const newGoal: AppGoal = {
      id: `goal-${Date.now()}`,
      title: goalData.title,
      description: goalData.description,
      createdAt: now,
      targetDate: endOfDay,
      status: "pending",
      progress: 0,
    }

    setGoals((prev) => [...prev, newGoal])
  }

  const removeGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== goalId))
  }

  const clearAllGoals = () => {
    setGoals((prev) => prev.filter((goal) => goal.status !== "pending"))
  }

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return (
          <HomeScreen
            goals={goals}
            onCompleteGoal={handleCompleteGoal}
            onUpdateProgress={updateGoalProgress}
            onAddGoal={() => setIsAddDialogOpen(true)}
            onRemoveGoal={removeGoal}
            onClearAllGoals={clearAllGoals}
          />
        )
      case "journal":
        return <JournalScreen entries={journalEntries} />
      case "failures":
        return <FailuresScreen goals={goals.filter((g) => g.status === "failed")} />
      case "settings":
        return <SettingsScreen />
      default:
        return (
          <HomeScreen
            goals={goals}
            onCompleteGoal={handleCompleteGoal}
            onUpdateProgress={updateGoalProgress}
            onAddGoal={() => setIsAddDialogOpen(true)}
            onRemoveGoal={removeGoal}
            onClearAllGoals={clearAllGoals}
          />
        )
    }
  }

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading TrackDaily...</p>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex flex-col">
        {/* Status Bar Spacer */}
        <div className="h-safe-top bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm" />

        {/* Main Content */}
        <div className="flex-1 pb-20">{renderScreen()}</div>

        {/* Bottom Navigation */}
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Journal Entry Modal */}
        <JournalEntryModal
          isOpen={isJournalModalOpen}
          onClose={() => setIsJournalModalOpen(false)}
          goal={selectedGoal}
          onSubmit={handleJournalSubmit}
        />

        {/* Add Goal Dialog */}
        <AddGoalDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAddGoal={addGoal} />
      </div>
    </ThemeProvider>
  )
}
