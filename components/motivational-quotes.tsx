"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

const focusedQuotes = [
  "Focus on completing your goals today - tomorrow depends on it.",
  "Stay committed to your decisions, but stay flexible in your approach.",
  "The key to success is to focus on goals, not obstacles.",
  "Your goals are waiting for your action, not your excuses.",
  "End your work today with purpose, not just exhaustion.",
  "Today's focus determines tomorrow's results.",
  "Stay focused on your goals until they become your reality.",
  "Complete what you started - your future self will thank you.",
  "Focus is not about doing more, it's about doing what matters most.",
  "Finish strong today, so you can start stronger tomorrow.",
  "Your goals don't have deadlines, but today does.",
  "Stay focused on your goals, not your fears.",
  "End today knowing you gave your best to your goals.",
  "Focus on progress, not perfection in your goals.",
  "Today's dedication to your goals shapes tomorrow's success.",
]

interface MotivationalQuotesProps {
  onClose?: () => void
}

export function MotivationalQuotes({ onClose }: MotivationalQuotesProps) {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes in seconds

  useEffect(() => {
    if (!isVisible) return

    // Timer for auto-changing quotes every 2 minutes
    const quoteTimer = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % focusedQuotes.length)
      setTimeLeft(120) // Reset timer
    }, 120000) // 2 minutes

    // Countdown timer
    const countdownTimer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 120 // Reset when reaching 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(quoteTimer)
      clearInterval(countdownTimer)
    }
  }, [isVisible])

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const progressPercentage = ((120 - timeLeft) / 120) * 100

  if (!isVisible) {
    return null
  }

  return (
    <div className="relative bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 mt-4 border border-indigo-100 dark:border-indigo-800 shadow-sm">
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClose}
        className="absolute top-2 right-2 w-6 h-6 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
      >
        <X className="w-3 h-3 text-gray-500 hover:text-red-500" />
      </Button>

      <div className="pr-8">
        <div className="mb-2">
          <h3 className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-3">Daily Focus</h3>
          <p className="text-lg font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
            "{focusedQuotes[currentQuoteIndex]}"
          </p>
        </div>
      </div>
    </div>
  )
}
