"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { JournalEntry } from "@/types/app-types"
import { BookOpen, CalendarIcon, ImageIcon, Video } from "lucide-react"

interface JournalScreenProps {
  entries: JournalEntry[]
}

export function JournalScreen({ entries }: JournalScreenProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [showCalendar, setShowCalendar] = useState(false)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  const filteredEntries = selectedDate ? entries.filter((entry) => isSameDay(entry.createdAt, selectedDate)) : entries

  const getDatesWithEntries = () => {
    return entries.map((entry) => entry.createdAt)
  }

  const clearDateFilter = () => {
    setSelectedDate(undefined)
    setShowCalendar(false)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setShowCalendar(false)
  }

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-6 py-8 shadow-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Journal</h1>
          </div>

          {/* Calendar Filter Button */}
          <div className="flex items-center gap-2">
            {selectedDate && (
              <Button variant="outline" size="sm" onClick={clearDateFilter} className="text-xs">
                Clear Filter
              </Button>
            )}
            <Popover open={showCalendar} onOpenChange={setShowCalendar}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`${
                    selectedDate ? "bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700" : ""
                  }`}
                >
                  <CalendarIcon className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  modifiers={{
                    hasEntry: getDatesWithEntries(),
                  }}
                  modifiersStyles={{
                    hasEntry: {
                      backgroundColor: "rgb(147 51 234)",
                      color: "white",
                      fontWeight: "bold",
                    },
                  }}
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-300">
            {selectedDate ? `Entries for ${formatDate(selectedDate)}` : "Your goal completion reflections"}
          </p>
          {selectedDate && (
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
            >
              {filteredEntries.length} entries
            </Badge>
          )}
        </div>
      </div>

      {/* Entries */}
      <div className="px-6 py-6">
        {filteredEntries.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                {selectedDate ? "No entries for this date" : "No journal entries yet"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {selectedDate
                  ? "Try selecting a different date or clear the filter"
                  : "Complete your first goal to start journaling!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredEntries
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
              .map((entry) => (
                <Card key={entry.id} className="overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-b border-purple-100 dark:border-purple-800">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{entry.goalTitle}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            {formatDate(entry.createdAt)}
                          </div>
                          <span>{formatTime(entry.createdAt)}</span>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                      >
                        <div className="flex items-center gap-1">
                          {entry.mediaType === "photo" ? (
                            <ImageIcon className="w-3 h-3" />
                          ) : (
                            <Video className="w-3 h-3" />
                          )}
                          {entry.mediaType}
                        </div>
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Reflection</h4>
                        <p className="text-gray-900 dark:text-white leading-relaxed bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                          {entry.text}
                        </p>
                      </div>

                      {entry.mediaUrl && (
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Media</h4>
                          {entry.mediaType === "photo" ? (
                            <img
                              src={entry.mediaUrl || "/placeholder.svg"}
                              alt="Goal completion"
                              className="w-full max-w-sm rounded-lg shadow-sm"
                            />
                          ) : (
                            <video src={entry.mediaUrl} controls className="w-full max-w-sm rounded-lg shadow-sm" />
                          )}
                        </div>
                      )}
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
