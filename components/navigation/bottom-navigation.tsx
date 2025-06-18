"use client"

import { Home, BookOpen, XCircle, Settings } from "lucide-react"

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "journal",
      label: "Journal",
      icon: BookOpen,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: "failures",
      label: "Failures",
      icon: XCircle,
      gradient: "from-red-500 to-orange-500",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      gradient: "from-gray-500 to-slate-600",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50 safe-bottom">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-3 px-2 transition-all duration-200 ${
                isActive
                  ? "text-white"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <div
                className={`relative p-2 rounded-full transition-all duration-200 ${
                  isActive
                    ? `bg-gradient-to-r ${tab.gradient} shadow-lg scale-110`
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : ""}`} />
              </div>
              <span
                className={`text-xs font-medium mt-1 transition-colors ${
                  isActive ? "text-gray-900 dark:text-white" : ""
                }`}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
