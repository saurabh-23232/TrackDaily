"use client"

import { Target } from "lucide-react"

interface TrackDailyLogoProps {
  className?: string
}

export function TrackDailyLogo({ className = "w-8 h-8" }: TrackDailyLogoProps) {
  return (
    <div
      className={`rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg ${className}`}
    >
      <Target className="w-1/2 h-1/2 text-white" />
    </div>
  )
}
