"use client"

import * as React from "react"
import { Play, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Video {
  id: number
  title: string
  description: string
  duration: string
  category: string
  thumbnail: string
  src: string
  views: string
  uploadDate: string
}

interface VideoPlayerProps {
  video: Video
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [isOpen, setIsOpen] = React.useState(false)

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play()
    }
  }

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="h-16 w-16 rounded-full bg-white/90 hover:bg-white text-black hover:scale-110 transition-all"
        >
          <Play className="h-6 w-6 ml-1" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl mb-2">{video.title}</DialogTitle>
              <DialogDescription className="text-base">
                {video.description}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="px-6 pb-6">
          <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
            {/* Video placeholder - in a real app, you would use the actual video */}
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Video Player</p>
                <p className="text-sm opacity-75">
                  In a real implementation, this would be a video element
                </p>
                <p className="text-xs opacity-50 mt-2">
                  Source: {video.src}
                </p>
              </div>
            </div>
            
            {/* Actual video element (commented out since we don't have real video files) */}
            {/*
            <video
              ref={videoRef}
              className="w-full h-full"
              controls
              poster={video.thumbnail}
              onPlay={handlePlay}
            >
              <source src={video.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            */}
          </div>
          
          {/* Video Info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                {video.category}
              </span>
              <span>{video.views} views</span>
              <span>{video.duration}</span>
            </div>
            <span>
              {new Date(video.uploadDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
