"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number
}

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => {
    const getProgressColor = (progress: number) => {
      if (progress === 0) return "bg-gray-200 dark:bg-gray-700"
      if (progress <= 50) return "bg-yellow-500"
      if (progress <= 75) return "bg-purple-500"
      return "bg-green-500"
    }

    const getTrackColor = (progress: number) => {
      if (progress === 0) return "bg-gray-200 dark:bg-gray-700"
      if (progress <= 50) return "bg-yellow-100 dark:bg-yellow-900/20"
      if (progress <= 75) return "bg-purple-100 dark:bg-purple-900/20"
      return "bg-green-100 dark:bg-green-900/20"
    }

    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn("relative h-4 w-full overflow-hidden rounded-full", getTrackColor(value), className)}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn("h-full w-full flex-1 transition-all duration-500 ease-in-out", getProgressColor(value))}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
    )
  },
)
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
