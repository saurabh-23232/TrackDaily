"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { XCircle, Calendar, AlertTriangle } from "lucide-react"

interface Goal {
  id: string
  title: string
  description: string
  createdAt: Date
  targetDate: Date
  status: "pending" | "completed" | "failed"
}

interface FailuresTabProps {
  failedGoals: Goal[]
}

export function FailuresTab({ failedGoals }: FailuresTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">Failed Goals</h2>
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="w-3 h-3" />
          Permanent Record
        </Badge>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-red-800">Important Notice</p>
            <p className="text-red-700">
              Failed goals cannot be removed from this list. They serve as a permanent reminder to help you stay
              accountable and learn from missed opportunities.
            </p>
          </div>
        </div>
      </div>

      {failedGoals.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No failed goals yet. Keep up the great work!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {failedGoals.map((goal) => (
            <Card key={goal.id} className="border-red-200 bg-red-50/50">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg text-red-900">{goal.title}</CardTitle>
                    <CardDescription className="text-red-700">{goal.description}</CardDescription>
                  </div>
                  <Badge variant="destructive" className="gap-1">
                    <XCircle className="w-3 h-3" />
                    Failed
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <Calendar className="w-4 h-4" />
                  Expired: {goal.targetDate.toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
