"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Settings, Bell, Clock, Smartphone, Palette, Info, Sun, Moon, Download, Trash2 } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export function SettingsScreen() {
  const { theme, toggleTheme } = useTheme()
  const reminderTimes = ["10:00 AM", "4:00 PM", "8:00 PM"]

  const clearAllData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      localStorage.removeItem("trackdaily-goals")
      localStorage.removeItem("trackdaily-journal")
      window.location.reload()
    }
  }

  const exportData = () => {
    const goals = localStorage.getItem("trackdaily-goals")
    const journal = localStorage.getItem("trackdaily-journal")

    const data = {
      goals: goals ? JSON.parse(goals) : [],
      journal: journal ? JSON.parse(journal) : [],
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `trackdaily-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-6 py-8 shadow-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-500 to-slate-600 flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300">Customize your TrackDaily experience</p>
      </div>

      {/* Settings Sections */}
      <div className="px-6 py-6 space-y-6">
        {/* App Info */}
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              TrackDaily
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Local Storage Mode</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Your data is stored locally on this device. Use export/import to backup your data.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Theme */}
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {theme === "dark" ? (
                    <Moon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Sun className="w-5 h-5 text-yellow-600" />
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {theme === "dark" ? "Dark Mode" : "Light Mode"}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {theme === "dark" ? "Using dark theme" : "Using light theme"}
                    </p>
                  </div>
                </div>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Compact View</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Show more goals on screen</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Daily Reminders</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Get notified about your pending goals</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Goal Completion</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Celebrate when you complete goals</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="pt-2">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Reminder Schedule
              </h4>
              <div className="flex flex-wrap gap-2">
                {reminderTimes.map((time) => (
                  <Badge
                    key={time}
                    variant="secondary"
                    className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    {time}
                  </Badge>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-3">
                Customize Times
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Device */}
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-green-600 dark:text-green-400" />
              Device
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Haptic Feedback</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Vibrate on interactions</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Auto-save</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Automatically save changes</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={exportData} variant="outline" className="w-full gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Download your goals and journal entries as a backup file
            </p>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Version</span>
              <span className="font-medium text-gray-900 dark:text-white">1.0.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Build</span>
              <span className="font-medium text-gray-900 dark:text-white">2024.1</span>
            </div>
            <Button variant="outline" className="w-full mt-4">
              Privacy Policy
            </Button>
            <Button variant="outline" className="w-full">
              Terms of Service
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-red-50/70 dark:bg-red-900/20 border-red-200 dark:border-red-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <Trash2 className="w-5 h-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={clearAllData} variant="destructive" className="w-full gap-2">
              <Trash2 className="w-4 h-4" />
              Clear All Data
            </Button>
            <p className="text-xs text-red-600 dark:text-red-400 text-center mt-2">
              This will permanently delete all your goals and journal entries
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
