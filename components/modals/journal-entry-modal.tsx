"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Goal } from "@/types/app-types"
import { Camera, Video, Upload, CheckCircle } from "lucide-react"

interface JournalEntryModalProps {
  isOpen: boolean
  onClose: () => void
  goal: Goal | null
  onSubmit: (data: { text: string; mediaUrl: string; mediaType: "photo" | "video" }) => void
}

export function JournalEntryModal({ isOpen, onClose, goal, onSubmit }: JournalEntryModalProps) {
  const [journalText, setJournalText] = useState("")
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaType, setMediaType] = useState<"photo" | "video">("photo")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (journalText.trim() && mediaFile) {
      const mediaUrl = URL.createObjectURL(mediaFile)
      onSubmit({
        text: journalText.trim(),
        mediaUrl,
        mediaType,
      })

      // Reset form
      setJournalText("")
      setMediaFile(null)
      setMediaType("photo")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMediaFile(file)
      // Auto-detect media type
      if (file.type.startsWith("video/")) {
        setMediaType("video")
      } else {
        setMediaType("photo")
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <DialogHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <DialogTitle className="text-xl text-gray-900 dark:text-white">Goal Completed! 🎉</DialogTitle>
          {goal && (
            <p className="text-gray-600 dark:text-gray-300 mt-2">Congratulations on completing "{goal.title}"</p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Journal Entry */}
          <div className="space-y-3">
            <Label htmlFor="journal" className="text-base font-medium text-gray-900 dark:text-white">
              How did it go? Share your experience
            </Label>
            <Textarea
              id="journal"
              placeholder="Reflect on your achievement, challenges faced, or what you learned..."
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              required
              rows={4}
              className="resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
            <div className="text-sm text-gray-500 dark:text-gray-400">{journalText.length}/500 characters</div>
          </div>

          {/* Media Upload */}
          <div className="space-y-4">
            <Label className="text-base font-medium text-gray-900 dark:text-white">
              Add a photo or video <span className="text-red-500">*</span>
            </Label>

            <RadioGroup
              value={mediaType}
              onValueChange={(value) => setMediaType(value as "photo" | "video")}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="photo" id="photo" />
                <Label htmlFor="photo" className="flex items-center gap-2 cursor-pointer text-gray-900 dark:text-white">
                  <Camera className="w-4 h-4" />
                  Photo
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="video" id="video" />
                <Label htmlFor="video" className="flex items-center gap-2 cursor-pointer text-gray-900 dark:text-white">
                  <Video className="w-4 h-4" />
                  Video
                </Label>
              </div>
            </RadioGroup>

            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
              <Input
                type="file"
                accept={mediaType === "photo" ? "image/*" : "video/*"}
                onChange={handleFileChange}
                required
                className="hidden"
                id="media-upload"
              />
              <Label htmlFor="media-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Click to upload {mediaType}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {mediaType === "photo" ? "PNG, JPG up to 10MB" : "MP4, MOV up to 50MB"}
                </p>
              </Label>
            </div>

            {mediaFile && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Selected: {mediaFile.name}</span>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!journalText.trim() || !mediaFile}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              Save Entry
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
