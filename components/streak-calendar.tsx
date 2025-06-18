"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight, Target, CheckCircle, XCircle } from "lucide-react"
import type { Goal } from "@/types/app-types"

interface StreakCalendarProps {
  goals: Goal[]
}

export function StreakCalendar({ goals }: StreakCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getDateStatus = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    date.setHours(0, 0, 0, 0)

    if (date > today) return "future"

    const dayGoals = goals.filter((goal) => {
      const goalDate = new Date(goal.createdAt)
      goalDate.setHours(0, 0, 0, 0)
      return goalDate.getTime() === date.getTime()
    })

    if (dayGoals.length === 0) return "no-goals"

    const completedGoals = dayGoals.filter((goal) => goal.status === "completed")
    const failedGoals = dayGoals.filter((goal) => goal.status === "failed")

    if (completedGoals.length === dayGoals.length) return "success"
    if (failedGoals.length > 0) return "failed"
    return "partial"
  }

  const getStreakCount = () => {
    const today = new Date()
    let streak = 0
    const currentDay = new Date(today)

    while (true) {
      currentDay.setDate(currentDay.getDate() - 1)
      const dayGoals = goals.filter((goal) => {
        const goalDate = new Date(goal.createdAt)
        goalDate.setHours(0, 0, 0, 0)
        currentDay.setHours(0, 0, 0, 0)
        return goalDate.getTime() === currentDay.getTime()
      })

      if (dayGoals.length === 0) break

      const completedGoals = dayGoals.filter((goal) => goal.status === "completed")
      if (completedGoals.length === dayGoals.length) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const monthName = currentDate.toLocaleDateString([], { month: "long", year: "numeric" })
  const streakCount = getStreakCount()

  const renderDay = (day: number) => {
    const status = getDateStatus(day)
    const isToday =
      day === new Date().getDate() &&
      currentDate.getMonth() === new Date().getMonth() &&
      currentDate.getFullYear() === new Date().getFullYear()

    let bgColor = "bg-gray-50 dark:bg-gray-800"
    let textColor = "text-gray-700 dark:text-gray-300"
    let icon = null

    switch (status) {
      case "success":
        bgColor = "bg-green-100 dark:bg-green-900/30"
        textColor = "text-green-800 dark:text-green-200"
        icon = <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
        break
      case "failed":
        bgColor = "bg-red-100 dark:bg-red-900/30"
        textColor = "text-red-800 dark:text-red-200"
        icon = <XCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
        break
      case "partial":
        bgColor = "bg-yellow-100 dark:bg-yellow-900/30"
        textColor = "text-yellow-800 dark:text-yellow-200"
        icon = <Target className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
        break
      case "future":
        bgColor = "bg-gray-100 dark:bg-gray-700"
        textColor = "text-gray-400 dark:text-gray-500"
        break
    }

    if (isToday) {
      bgColor += " ring-2 ring-blue-500"
    }

    return (
      <div
        key={day}
        className={`aspect-square flex flex-col items-center justify-center rounded-lg ${bgColor} ${textColor} transition-colors`}
      >
        <span className="text-sm font-medium">{day}</span>
        {icon && <div className="mt-0.5">{icon}</div>}
      </div>
    )
  }

  return (
    <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-lg">Streak Tracker</CardTitle>
          </div>
          <Badge
            variant="secondary"
            className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
          >
            {streakCount} day streak
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigateMonth("prev")}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h3 className="font-semibold text-gray-900 dark:text-white">{monthName}</h3>
          <Button variant="ghost" size="sm" onClick={() => navigateMonth("next")}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day Headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}

          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }, (_, i) => renderDay(i + 1))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-600" />
            <span className="text-gray-600 dark:text-gray-400">All goals completed</span>
          </div>
          <div className="flex items-center gap-1">
            <XCircle className="w-3 h-3 text-red-600" />
            <span className="text-gray-600 dark:text-gray-400">Goals failed</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3 text-yellow-600" />
            <span className="text-gray-600 dark:text-gray-400">Partial completion</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
