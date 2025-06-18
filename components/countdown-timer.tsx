"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

interface CountdownTimerProps {
  className?: string
}

export function CountdownTimer({ className = "" }: CountdownTimerProps) {
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

  if (timeLeft.isExpired) {
    return (
      <div className={`flex items-center gap-1 text-red-500 ${className}`}>
        <Clock className="w-3 h-3" />
        <span className="text-xs font-medium">Day Ended</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-1 text-orange-600 dark:text-orange-400 ${className}`}>
      <Clock className="w-3 h-3" />
      <span className="text-xs font-mono font-medium">
        {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
      </span>
    </div>
  )
}
