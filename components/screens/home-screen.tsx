"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CelebrationAnimation } from "@/components/celebration-animation"
import { CountdownTimer } from "@/components/countdown-timer"
import { MotivationalQuotes } from "@/components/motivational-quotes"
import { GoalTimer } from "@/components/goal-timer"
import { StreakCalendar } from "@/components/streak-calendar"
import type { Goal } from "@/types/app-types"
import { CheckCircle, Target, Plus, Bell, MoreVertical, Trash2, X, Calendar } from "lucide-react"
import { TrackDailyLogo } from "@/components/ui/logo"

interface HomeScreenProps {
  goals: Goal[]
  onCompleteGoal: (goal: Goal) => void
  onUpdateProgress: (goalId: string, progress: number) => void
  onAddGoal: () => void
  onRemoveGoal: (goalId: string) => void
  onClearAllGoals: () => void
}

export function HomeScreen({
  goals,
  onCompleteGoal,
  onUpdateProgress,
  onAddGoal,
  onRemoveGoal,
  onClearAllGoals,
}: HomeScreenProps) {
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null)
  const [showClearDialog, setShowClearDialog] = useState(false)
  const [celebrationGoal, setCelebrationGoal] = useState<Goal | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [showQuotes, setShowQuotes] = useState(true)

  const pendingGoals = goals.filter((goal) => goal.status === "pending")
  const completedGoals = goals.filter((goal) => goal.status === "completed")
  const totalProgress = goals.length > 0 ? (completedGoals.length / goals.length) * 100 : 0

  const getCurrentDate = () => {
    return new Date().toLocaleDateString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning!"
    if (hour < 17) return "Good afternoon!"
    return "Good evening!"
  }

  const handleProgressUpdate = (goalId: string, progress: number) => {
    onUpdateProgress(goalId, progress)

    // Show celebration animation when reaching 100%
    if (progress === 100) {
      const goal = goals.find((g) => g.id === goalId)
      if (goal) {
        setCelebrationGoal(goal)
        setShowCelebration(true)
      }
    }
  }

  const handleCelebrationComplete = () => {
    setShowCelebration(false)
    if (celebrationGoal) {
      onCompleteGoal(celebrationGoal)
      setCelebrationGoal(null)
    }
  }

  const getProgressBarColor = (progress: number) => {
    if (progress === 0) return "text-gray-500"
    if (progress <= 50) return "text-yellow-600"
    if (progress <= 75) return "text-purple-600"
    return "text-green-600"
  }

  const handleCloseQuotes = () => {
    setShowQuotes(false)
  }

  const isGoalExpired = (goal: Goal) => {
    const now = new Date()
    return now > goal.targetDate
  }

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-4 sm:px-6 py-6 sm:py-8 shadow-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <TrackDailyLogo className="w-8 h-8 sm:w-10 sm:h-10" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{getGreeting()}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400" />
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">{getCurrentDate()}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Time left today</p>
              <CountdownTimer />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
            </Button>
            <Button
              onClick={onAddGoal}
              size="icon"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>

        {/* Daily Progress */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-800">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Today's Progress</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {completedGoals.length} of {goals.length} goals completed
                </p>
              </div>
              <div className="text-right">
                <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {Math.round(totalProgress)}%
                </div>
              </div>
            </div>
            <Progress value={totalProgress} className="h-3" />
          </CardContent>
        </Card>

        {/* Motivational Quotes */}
        {showQuotes && <MotivationalQuotes onClose={handleCloseQuotes} />}
      </div>

      {/* Goals List */}
      <div className="px-4 sm:px-6 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Goals</h2>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              {pendingGoals.length} pending
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {!showQuotes && (
              <Button variant="outline" size="sm" onClick={() => setShowQuotes(true)} className="text-xs">
                Show Daily Focus
              </Button>
            )}
            {pendingGoals.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onAddGoal}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Goal
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowClearDialog(true)} className="text-red-600 dark:text-red-400">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All Goals
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {pendingGoals.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50">
            <CardContent className="text-center py-8 sm:py-12">
              <Target className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">All goals completed!</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Great job! Add new goals for tomorrow.</p>
              <Button onClick={onAddGoal} className="gap-2">
                <Plus className="w-4 h-4" />
                Add New Goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {pendingGoals.map((goal) => {
              const expired = isGoalExpired(goal)
              return (
                <Card
                  key={goal.id}
                  className={`transition-all duration-200 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm ${
                    expired
                      ? "opacity-60 cursor-not-allowed"
                      : selectedGoalId === goal.id
                        ? "ring-2 ring-blue-500 shadow-lg"
                        : "hover:shadow-md hover:bg-white/90 dark:hover:bg-gray-800/90"
                  }`}
                  onClick={() => !expired && setSelectedGoalId(selectedGoalId === goal.id ? null : goal.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg flex-1 min-w-0">
                          {goal.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <GoalTimer createdAt={goal.createdAt} />
                          {!expired && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-6 h-6 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation()
                                onRemoveGoal(goal.id)
                              }}
                            >
                              <X className="w-3 h-3 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{goal.description}</p>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                        <span className={`text-sm font-semibold ${getProgressBarColor(goal.progress)}`}>
                          {goal.progress}%
                        </span>
                      </div>
                      <Progress value={goal.progress} className="h-3" />
                    </div>

                    {!expired && selectedGoalId === goal.id && (
                      <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[25, 50, 75, 100].map((value) => (
                            <Button
                              key={value}
                              variant={goal.progress >= value ? "default" : "outline"}
                              size="sm"
                              className="w-full"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleProgressUpdate(goal.id, value)
                              }}
                            >
                              {value}%
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {expired && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mt-3">
                        <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                          Goal expired - Moving to failures section
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {pendingGoals.length > 0 && (
          <Card className="border-dashed border-2 border-blue-200 dark:border-blue-700 bg-blue-50/30 dark:bg-blue-900/10">
            <CardContent className="text-center py-6">
              <Button
                onClick={onAddGoal}
                variant="outline"
                className="gap-2 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30"
              >
                <Plus className="w-4 h-4" />
                Add Another Goal
              </Button>
            </CardContent>
          </Card>
        )}

        {completedGoals.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Completed Today</h3>
            <div className="space-y-2">
              {completedGoals.slice(0, 3).map((goal) => (
                <Card
                  key={goal.id}
                  className="bg-green-50/70 dark:bg-green-900/20 border-green-200 dark:border-green-800 backdrop-blur-sm"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{goal.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Completed at{" "}
                          {goal.completedAt?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <StreakCalendar goals={goals} />
        </div>
      </div>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">Clear All Goals?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
              This will remove all pending goals from today's list. Completed and failed goals will remain unchanged.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onClearAllGoals()
                setShowClearDialog(false)
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CelebrationAnimation
        isVisible={showCelebration}
        onComplete={handleCelebrationComplete}
        goalTitle={celebrationGoal?.title || ""}
      />
    </div>
  )
}
