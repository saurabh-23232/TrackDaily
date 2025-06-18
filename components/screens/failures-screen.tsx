"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Goal } from "@/types/app-types"
import { XCircle, AlertTriangle, Calendar, TrendingDown } from "lucide-react"

interface FailuresScreenProps {
  goals: Goal[]
}

export function FailuresScreen({ goals }: FailuresScreenProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-6 py-8 shadow-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Missed Goals</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300">Learn from these experiences</p>
      </div>

      {/* Warning Notice */}
      <div className="px-6 py-4">
        <Card className="bg-red-50/70 dark:bg-red-900/20 border-red-200 dark:border-red-800 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-red-800 dark:text-red-300 mb-1">Permanent Record</p>
                <p className="text-red-700 dark:text-red-400">
                  These goals serve as learning opportunities. They cannot be removed and help build accountability.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Failed Goals */}
      <div className="px-6 pb-6">
        {goals.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">No missed goals</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Keep up the great work!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {goals
              .sort((a, b) => b.targetDate.getTime() - a.targetDate.getTime())
              .map((goal) => (
                <Card
                  key={goal.id}
                  className="border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-900/10 backdrop-blur-sm"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{goal.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{goal.description}</p>
                        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                          <Calendar className="w-4 h-4" />
                          <span>Expired: {formatDate(goal.targetDate)}</span>
                        </div>
                      </div>
                      <Badge variant="destructive" className="ml-3">
                        <XCircle className="w-3 h-3 mr-1" />
                        Missed
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Progress when expired:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{goal.progress}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
