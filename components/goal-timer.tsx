"use client"

import { useState, useEffect } from "react"

interface GoalTimerProps {
  createdAt: Date
  className?: string
}

export function GoalTimer({ createdAt, className = "" }: GoalTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number
    minutes: number
    seconds: number
    isExpired: boolean
  }>({ hours: 0, minutes: 0, seconds: 0, isExpired: false })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const endOfDay = new Date()
      endOfDay.setHours(23, 59, 59, 999)

      const difference = endOfDay.getTime() - now.getTime()

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ hours, minutes, seconds, isExpired: false })
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (time: number) => time.toString().padStart(2, "0")
  const formatCreatedTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (timeLeft.isExpired) {
    return (
      <div className={`flex flex-col sm:flex-row gap-2 ${className}`}>
        <div className="bg-green-50 dark:bg-green-900/30 rounded-lg px-2 py-1 border border-green-200 dark:border-green-800 flex-shrink-0">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            <span className="text-xs font-medium text-green-700 dark:text-green-300">Added</span>
            <span className="text-xs font-semibold text-green-800 dark:text-green-200">
              {formatCreatedTime(createdAt)}
            </span>
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/30 rounded-lg px-2 py-1 border border-red-200 dark:border-red-800 flex-shrink-0">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            <span className="text-xs font-medium text-red-700 dark:text-red-300">Expired</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col sm:flex-row gap-2 ${className}`}>
      <div className="bg-green-50 dark:bg-green-900/30 rounded-lg px-2 py-1 border border-green-200 dark:border-green-800 flex-shrink-0">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
          <span className="text-xs font-medium text-green-700 dark:text-green-300">Added</span>
          <span className="text-xs font-semibold text-green-800 dark:text-green-200">
            {formatCreatedTime(createdAt)}
          </span>
        </div>
      </div>
      <div className="bg-orange-50 dark:bg-orange-900/30 rounded-lg px-2 py-1 border border-orange-200 dark:border-orange-800 flex-shrink-0">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
          <span className="text-xs font-medium text-orange-700 dark:text-orange-300">Left</span>
          <span className="text-xs font-mono font-bold text-orange-800 dark:text-orange-200">
            {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
          </span>
        </div>
      </div>
    </div>
  )
}
