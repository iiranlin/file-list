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
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const loadVideo = async () => {
    if (!videoRef.current || isLoaded) return

    setIsLoading(true)
    try {
      // 设置视频源并开始加载
      videoRef.current.src = video.src
      videoRef.current.load()

      // 等待视频加载完成
      await new Promise((resolve, reject) => {
        const videoElement = videoRef.current!
        const onCanPlay = () => {
          videoElement.removeEventListener('canplay', onCanPlay)
          videoElement.removeEventListener('error', onError)
          resolve(void 0)
        }
        const onError = () => {
          videoElement.removeEventListener('canplay', onCanPlay)
          videoElement.removeEventListener('error', onError)
          reject(new Error('视频加载失败'))
        }
        videoElement.addEventListener('canplay', onCanPlay)
        videoElement.addEventListener('error', onError)
      })

      setIsLoaded(true)
    } catch (error) {
      console.error('视频加载失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlay = async () => {
    // 如果视频未加载，先加载
    if (!isLoaded) {
      await loadVideo()
    }

    if (videoRef.current && isLoaded) {
      try {
        await videoRef.current.play()
      } catch (error) {
        console.error('播放失败:', error)
      }
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
          <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4 relative">
            {!isLoaded ? (
              // 视频未加载时显示缩略图和播放按钮
              <div className="w-full h-full relative">
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4" />
                    ) : (
                      <Play className="h-16 w-16 mx-auto mb-4 opacity-75" />
                    )}
                    <p className="text-lg mb-2">
                      {isLoading ? '加载中...' : '点击播放视频'}
                    </p>
                    <p className="text-sm opacity-75">
                      {isLoading ? '正在从CDN加载视频文件' : '视频将从CDN按需加载'}
                    </p>
                  </div>
                </div>
                {!isLoading && (
                  <button
                    onClick={handlePlay}
                    className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors"
                  >
                    <div className="w-20 h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                      <Play className="h-8 w-8 text-black ml-1" />
                    </div>
                  </button>
                )}
              </div>
            ) : (
              // 视频加载完成后显示真正的视频播放器
              <video
                ref={videoRef}
                className="w-full h-full"
                controls
                poster={video.thumbnail}
                preload="none"
                onPlay={handlePlay}
              >
                <source src={video.src} type="video/mp4" />
                您的浏览器不支持视频播放。
              </video>
            )}
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
