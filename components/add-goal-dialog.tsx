"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface AddGoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddGoal: (goal: { title: string; description: string }) => void
}

export function AddGoalDialog({ open, onOpenChange, onAddGoal }: AddGoalDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && description.trim()) {
      onAddGoal({ title: title.trim(), description: description.trim() })
      setTitle("")
      setDescription("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">Add New Goal</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Set a goal for tomorrow. You'll receive reminders at 10 AM, 4 PM, and 8 PM.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-900 dark:text-white">
              Goal Title
            </Label>
            <Input
              id="title"
              placeholder="e.g., Exercise for 30 minutes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-900 dark:text-white">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your goal in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Add Goal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
