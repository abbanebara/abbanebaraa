"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

interface HeroVideoDialogProps {
  videoSrc: string
  title: string
  description?: string
  thumbnailSrc?: string
}

export function HeroVideoDialog({
  videoSrc = "https://example.com/video.mp4",
  title = "Amazing Video Title",
  description = "Watch our incredible video showcasing our product",
  thumbnailSrc = "/placeholder.svg?height=720&width=1280",
}: HeroVideoDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="relative w-full cursor-pointer group overflow-hidden rounded-xl">
            {/* Thumbnail image */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl">
              <img
                src={thumbnailSrc || "/placeholder.svg"}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-16 w-16 rounded-full bg-primary/90 text-primary-foreground border-none shadow-lg transition-transform duration-300 group-hover:scale-110"
                >
                  <Play className="h-8 w-8" />
                </Button>
              </div>

              {/* Text overlay - positioned at bottom center */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white text-center">
                <h2 className="text-2xl font-bold mb-2">{title}</h2>
                {description && <p className="text-sm text-gray-200 max-w-md mx-auto mb-1">{description}</p>}
              </div>
            </div>
          </div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] p-0 bg-black overflow-hidden">
          <div className="relative w-full h-full aspect-video">
            <video src={videoSrc} controls autoPlay className="w-full h-full" onEnded={() => setIsOpen(false)}>
              Your browser does not support the video tag.
            </video>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

