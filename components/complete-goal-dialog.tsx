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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Camera, Video } from "lucide-react"

interface Goal {
  id: string
  title: string
  description: string
  createdAt: Date
  targetDate: Date
  status: "pending" | "completed" | "failed"
}

interface CompleteGoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  goal: Goal | null
  onComplete: (goalId: string, data: { journal: string; mediaUrl: string; mediaType: "photo" | "video" }) => void
}

export function CompleteGoalDialog({ open, onOpenChange, goal, onComplete }: CompleteGoalDialogProps) {
  const [journal, setJournal] = useState("")
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaType, setMediaType] = useState<"photo" | "video">("photo")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (goal && journal.trim() && mediaFile) {
      // In a real app, you would upload the file to a storage service
      const mediaUrl = URL.createObjectURL(mediaFile)
      onComplete(goal.id, {
        journal: journal.trim(),
        mediaUrl,
        mediaType,
      })
      setJournal("")
      setMediaFile(null)
      onOpenChange(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMediaFile(file)
      // Auto-detect media type based on file type
      if (file.type.startsWith("video/")) {
        setMediaType("video")
      } else {
        setMediaType("photo")
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete Goal</DialogTitle>
          <DialogDescription>
            {goal?.title && `Congratulations on completing "${goal.title}"! Share your experience.`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="journal">Journal Entry</Label>
            <Textarea
              id="journal"
              placeholder="Write about your experience completing this goal..."
              value={journal}
              onChange={(e) => setJournal(e.target.value)}
              required
              rows={4}
            />
          </div>

          <div className="space-y-3">
            <Label>Media Upload (Required)</Label>
            <RadioGroup value={mediaType} onValueChange={(value) => setMediaType(value as "photo" | "video")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="photo" id="photo" />
                <Label htmlFor="photo" className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Photo
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="video" id="video" />
                <Label htmlFor="video" className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Video
                </Label>
              </div>
            </RadioGroup>

            <Input
              type="file"
              accept={mediaType === "photo" ? "image/*" : "video/*"}
              onChange={handleFileChange}
              required
            />

            {mediaFile && <div className="text-sm text-gray-600">Selected: {mediaFile.name}</div>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!journal.trim() || !mediaFile}>
              Complete Goal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
