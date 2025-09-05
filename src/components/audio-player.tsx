"use client"

import * as React from "react"
import { Play, Pause, Volume2, VolumeX, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DownloadDialog } from "@/components/download-dialog"

interface AudioPlayerProps {
  src: string
  title: string
  artist: string
}

export function AudioPlayer({ src, title, artist }: AudioPlayerProps) {
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [duration, setDuration] = React.useState(0)
  const [volume, setVolume] = React.useState(1)
  const [isMuted, setIsMuted] = React.useState(false)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = React.useState(false)

  // 键盘快捷键支持
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // 只在音频播放器获得焦点时响应快捷键
      if (document.activeElement?.closest('.audio-player-container')) {
        switch (e.code) {
          case 'Space':
            e.preventDefault()
            togglePlayPause()
            break
          case 'ArrowUp':
            e.preventDefault()
            setVolume(prev => Math.min(1, prev + 0.1))
            break
          case 'ArrowDown':
            e.preventDefault()
            setVolume(prev => Math.max(0, prev - 0.1))
            break
          case 'KeyM':
            e.preventDefault()
            toggleMute()
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [])

  // 同步音量变化到音频元素
  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const loadAudio = async () => {
    if (!audioRef.current || isLoaded) return

    setIsLoading(true)
    try {
      // 设置音频源并开始加载
      audioRef.current.src = src
      audioRef.current.load()

      // 等待音频加载完成
      await new Promise((resolve, reject) => {
        const audio = audioRef.current!
        const onCanPlay = () => {
          audio.removeEventListener('canplay', onCanPlay)
          audio.removeEventListener('error', onError)
          resolve(void 0)
        }
        const onError = () => {
          audio.removeEventListener('canplay', onCanPlay)
          audio.removeEventListener('error', onError)
          reject(new Error('音频加载失败'))
        }
        audio.addEventListener('canplay', onCanPlay)
        audio.addEventListener('error', onError)
      })

      setIsLoaded(true)
    } catch (error) {
      console.error('音频加载失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const togglePlayPause = async () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      // 如果音频未加载，先加载
      if (!isLoaded) {
        await loadAudio()
      }

      if (audioRef.current && isLoaded) {
        try {
          await audioRef.current.play()
          setIsPlaying(true)
        } catch (error) {
          console.error('播放失败:', error)
        }
      }
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value)
    setVolume(vol)
    if (audioRef.current) {
      audioRef.current.volume = vol
    }
    setIsMuted(vol === 0)
  }

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume
        setIsMuted(false)
      } else {
        audioRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <Card className="p-4 bg-muted/30 audio-player-container" tabIndex={0}>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        preload="none"
      />
      
      <div className="space-y-3">
        {/* Audio Info */}
        <div className="text-center space-y-1 relative">
          <h4 className="font-medium text-sm truncate flex items-center justify-center gap-2">
            {isPlaying && (
              <div className="flex items-center gap-1">
                <div className="w-1 h-3 bg-primary animate-pulse rounded-full" />
                <div className="w-1 h-2 bg-primary animate-pulse rounded-full" style={{ animationDelay: '0.2s' }} />
                <div className="w-1 h-4 bg-primary animate-pulse rounded-full" style={{ animationDelay: '0.4s' }} />
              </div>
            )}
            {title}
          </h4>
          <p className="text-xs text-muted-foreground truncate">{artist}</p>

          {/* 下载按钮 */}
          <Button
            onClick={() => setIsDownloadDialogOpen(true)}
            className="absolute top-0 right-0 bg-primary/10 hover:bg-primary/20 text-primary text-xs px-2 py-1 h-auto rounded-full border border-primary/20"
          >
            <Download className="h-3 w-3 mr-1" />
            下载
          </Button>
        </div>

        {/* Play/Pause Button */}
        <div className="flex items-center justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={togglePlayPause}
            disabled={isLoading}
            className="h-12 w-12 rounded-full hover:scale-105 transition-transform duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="relative group">
            <div className="w-full h-2 bg-muted rounded-lg overflow-hidden group-hover:h-3 transition-all duration-200">
              <div
                className="h-full bg-primary transition-all duration-150 ease-out relative"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg" />
              </div>
            </div>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-2 group-hover:h-3 opacity-0 cursor-pointer transition-all duration-200"
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="h-8 w-8"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          <div className="relative flex-1 group">
            <div className="w-full h-2 bg-muted rounded-lg overflow-hidden group-hover:h-3 transition-all duration-200">
              <div
                className="h-full bg-primary transition-all duration-150 ease-out relative"
                style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg" />
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="absolute inset-0 w-full h-2 group-hover:h-3 opacity-0 cursor-pointer transition-all duration-200"
            />
          </div>
          <span className="text-xs text-muted-foreground w-8 text-right">
            {Math.round((isMuted ? 0 : volume) * 100)}%
          </span>
        </div>

        {/* 快捷键提示 */}
        <div className="text-xs text-muted-foreground text-center opacity-60 hover:opacity-100 transition-opacity">
          快捷键: 空格键播放/暂停 • ↑↓调节音量 • M静音
        </div>
      </div>

      {/* 下载对话框 */}
      <DownloadDialog
        open={isDownloadDialogOpen}
        onOpenChange={setIsDownloadDialogOpen}
        title={title}
        downloadUrl={src}
        type="audio"
      />
    </Card>
  )
}
