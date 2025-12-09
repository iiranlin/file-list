"use client"

import * as React from "react"
import { Play, X, Maximize, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { generateThumbnailUrl } from "@/lib/video-utils"
import { DownloadDialog } from "@/components/download-dialog"

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
  const [loadError, setLoadError] = React.useState<string | null>(null)
  const [thumbnailError, setThumbnailError] = React.useState(false)
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = React.useState(false)

  // 生成有效的缩略图URL
  const getThumbnailUrl = () => {
    // 如果已有缩略图且不是占位符，直接使用
    if (video.thumbnail && !video.thumbnail.includes('video-thumb-')) {
      return video.thumbnail
    }

    // 尝试生成动态缩略图 (仅支持Qiniu)
    const generated = generateThumbnailUrl(video.src, { offset: 10 })
    if (generated) return generated

    // 对于R2或其他不支持动态截帧的存储，返回null
    // 这里可以添加逻辑去获取静态缩略图文件（如果在上传时生成了的话）
    // 目前简单返回null，前端将回退到使用video poster或加载视频首帧
    return null
  }

  const loadVideo = async () => {
    if (!videoRef.current) {
      console.error('Video element not found in loadVideo')
      throw new Error('视频元素未找到')
    }

    if (isLoaded) {
      console.log('Video already loaded, skipping...')
      return
    }

    setIsLoading(true)
    setLoadError(null)

    try {
      console.log('开始加载视频:', video.src)

      // 设置视频源并开始加载
      videoRef.current.src = video.src
      videoRef.current.crossOrigin = "anonymous"
      videoRef.current.preload = "metadata"
      videoRef.current.load()

      // 等待视频加载完成
      await new Promise((resolve, reject) => {
        const videoElement = videoRef.current!

        const onCanPlay = () => {
          console.log('视频可以播放')
          cleanup()
          resolve(void 0)
        }

        const onLoadedMetadata = () => {
          console.log('视频元数据加载完成')
        }

        const onError = (e: Event) => {
          console.error('视频加载错误事件:', e)
          cleanup()

          // 获取更详细的错误信息
          const error = videoElement.error
          let errorMsg = `视频加载失败: ${video.src}`

          if (error) {
            switch (error.code) {
              case error.MEDIA_ERR_ABORTED:
                errorMsg += ' (播放被中止)'
                break
              case error.MEDIA_ERR_NETWORK:
                errorMsg += ' (网络错误)'
                break
              case error.MEDIA_ERR_DECODE:
                errorMsg += ' (解码错误)'
                break
              case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                errorMsg += ' (格式不支持)'
                break
              default:
                errorMsg += ` (错误代码: ${error.code})`
            }
            if (error.message) {
              errorMsg += ` - ${error.message}`
            }
          }

          reject(new Error(errorMsg))
        }

        const cleanup = () => {
          videoElement.removeEventListener('canplay', onCanPlay)
          videoElement.removeEventListener('error', onError)
          videoElement.removeEventListener('loadedmetadata', onLoadedMetadata)
        }

        videoElement.addEventListener('canplay', onCanPlay)
        videoElement.addEventListener('error', onError)
        videoElement.addEventListener('loadedmetadata', onLoadedMetadata)

        // 设置超时
        setTimeout(() => {
          cleanup()
          reject(new Error('视频加载超时'))
        }, 30000) // 30秒超时
      })

      setIsLoaded(true)
      console.log('视频加载成功，设置isLoaded为true')
    } catch (error) {
      console.error('视频加载失败:', error)
      setLoadError(error instanceof Error ? error.message : '视频加载失败')
      throw error // 重新抛出错误，让调用者知道加载失败
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlay = async () => {
    console.log('handlePlay called, isLoaded:', isLoaded, 'isLoading:', isLoading)

    // 如果正在加载，不重复处理
    if (isLoading) {
      console.log('Already loading, skipping...')
      return
    }

    try {
      // 如果视频未加载，先加载
      if (!isLoaded) {
        console.log('Video not loaded, starting load process...')
        await loadVideo()
        console.log('Load completed')
      }

      // 检查视频元素是否准备好
      if (!videoRef.current) {
        console.error('Video element not found')
        setLoadError('视频元素未找到')
        return
      }

      console.log('Video ready, attempting to play...', {
        src: videoRef.current.src,
        readyState: videoRef.current.readyState
      })

      // 尝试播放视频
      await videoRef.current.play()
      console.log('Video play started successfully')

    } catch (error) {
      console.error('播放过程失败:', error)
      setLoadError(`播放失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
      // 清除视频源以释放资源
      videoRef.current.src = ''
      videoRef.current.load()
    }
    // 重置所有状态
    setIsLoaded(false)
    setIsLoading(false)
    setLoadError(null)
    setIsOpen(false)
  }

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      }
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose()
    } else {
      setIsOpen(true)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
            <div className="flex-1">
              <DialogTitle className="text-xl mb-2">{video.title}</DialogTitle>
              <DialogDescription className="text-base">
                {video.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="px-6 pb-6">
          <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4 relative">
            {/* 始终渲染video元素，但在未加载时隐藏 */}
            <video
              ref={videoRef}
              className={`w-full h-full ${!isLoaded ? 'hidden' : ''}`}
              controls={isLoaded}
              controlsList="nodownload"
              poster={thumbnailError ? undefined : getThumbnailUrl() || undefined}
              preload="none"
              playsInline
              crossOrigin="anonymous"
              {...({ 'webkit-playsinline': 'true' } as any)}
              onError={(e) => {
                console.error('Video element error:', e)
                const target = e.target as HTMLVideoElement
                if (target.error) {
                  console.error('Video error details:', {
                    code: target.error.code,
                    message: target.error.message
                  })
                }
              }}
              onLoadStart={() => console.log('Video load start')}
              onLoadedData={() => console.log('Video loaded data')}
              onCanPlay={() => console.log('Video can play')}
              onPlay={() => console.log('Video started playing')}
              onPause={() => console.log('Video paused')}
            >
              您的浏览器不支持视频播放。
            </video>

            {!isLoaded && (
              // 视频未加载时显示缩略图和播放按钮
              <div className="absolute inset-0 w-full h-full">
                {/* 背景缩略图 */}
                {!thumbnailError && getThumbnailUrl() && (
                  <img
                    src={getThumbnailUrl()!}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={() => {
                      console.error('缩略图加载失败:', getThumbnailUrl())
                      setThumbnailError(true)
                    }}
                    onLoad={() => console.log('缩略图加载成功:', getThumbnailUrl())}
                  />
                )}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-800/80 to-gray-900/80 flex items-center justify-center">
                  <div className="text-center text-white">
                    {loadError ? (
                      <>
                        <X className="h-16 w-16 mx-auto mb-4 opacity-75 text-red-400" />
                        <p className="text-lg mb-2 text-red-400">加载失败</p>
                        <p className="text-sm opacity-75 mb-4">{loadError}</p>
                        <button
                          onClick={handlePlay}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm transition-colors"
                        >
                          重试
                        </button>
                      </>
                    ) : isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4" />
                        <p className="text-lg mb-2">加载中...</p>
                        <p className="text-sm opacity-75">正在从CDN加载视频文件</p>
                      </>
                    ) : (
                      <>
                        <Play className="h-16 w-16 mx-auto mb-4 opacity-75" />
                        <p className="text-lg mb-2">点击播放视频</p>
                        <p className="text-sm opacity-75">视频将从CDN按需加载</p>
                      </>
                    )}
                  </div>
                </div>
                {!isLoading && !loadError && (
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
            )}

            {/* 下载按钮 - 始终显示 */}
            <div className="absolute top-2 right-2 flex gap-2 z-10">
              <Button
                onClick={() => setIsDownloadDialogOpen(true)}
                className="bg-black/50 hover:bg-black/70 text-white text-xs px-3 py-1 h-auto rounded-full backdrop-blur-sm border border-white/20"
              >
                <Download className="h-3 w-3 mr-1" />
                下载
              </Button>
              {/* 全屏按钮 - 只在视频加载后显示 */}
              {isLoaded && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFullscreen}
                  className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white"
                  title="全屏播放"
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              )}
            </div>
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

      {/* 下载对话框 */}
      <DownloadDialog
        open={isDownloadDialogOpen}
        onOpenChange={setIsDownloadDialogOpen}
        title={video.title}
        downloadUrl={video.src}
        type="video"
      />
    </Dialog>
  )
}
