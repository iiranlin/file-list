"use client"

import { useState, useRef } from "react"
import { Upload, X, FileImage, FileVideo, FileAudio, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getAuthHeaders } from "@/lib/auth-headers"

export type FileType = 'image' | 'video' | 'audio'

interface FileUploadProps {
  fileType: FileType
  onUploadSuccess: (url: string, fileName: string, metadata?: { dimensions?: string }) => void
  onUploadError?: (error: string) => void
  accept?: string
  maxSize?: number // MB
  className?: string
}

interface UploadState {
  uploading: boolean
  progress: number
  error: string | null
  success: boolean
}

export function FileUpload({
  fileType,
  onUploadSuccess,
  onUploadError,
  accept,
  maxSize = 100,
  className = "",
}: FileUploadProps) {
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
    success: false,
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<{ dimensions?: string }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const currentFileRef = useRef<File | null>(null)

  // 默认接受的文件类型
  const defaultAccept = {
    image: 'image/*',
    video: 'video/*',
    audio: 'audio/*',
  }[fileType]

  // 文件类型图标
  const FileIcon = {
    image: FileImage,
    video: FileVideo,
    audio: FileAudio,
  }[fileType]

  // 处理文件选择
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    // 清理旧的预览URL以释放内存
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    const file = event.target.files?.[0]
    if (!file) {
      setSelectedFile(null)
      setPreviewUrl(null)
      currentFileRef.current = null
      return
    }

    // 验证文件大小
    if (file.size > maxSize * 1024 * 1024) {
      setUploadState({
        uploading: false,
        progress: 0,
        error: `文件大小不能超过 ${maxSize}MB`,
        success: false,
      })
      return
    }

    setSelectedFile(file)
    currentFileRef.current = file
    setUploadState({
      uploading: false,
      progress: 0,
      error: null,
      success: false,
    })

    // 生成预览URL（仅图片）
    if (fileType === 'image' && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)

      // 获取图片尺寸
      const img = new Image()
      img.onload = () => {
        // 竞态检查：确保只在还是当前选中的文件时更新元数据
        if (currentFileRef.current === file) {
          setMetadata({ dimensions: `${img.width}x${img.height}` })
        }
      }
      img.src = url
    } else {
      setMetadata({})
    }
  }

  // 上传文件
  const handleUpload = async () => {
    if (!selectedFile) return

    setUploadState({
      uploading: true,
      progress: 0,
      error: null,
      success: false,
    })

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('type', fileType)

      // 获取认证头
      const authHeaders = getAuthHeaders()

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          // 注意：FormData 不需要设置 Content-Type，浏览器会自动设置
          'Authorization': authHeaders.Authorization || '',
        },
        body: formData,
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setUploadState({
          uploading: false,
          progress: 100,
          error: null,
          success: true,
        })
        onUploadSuccess(result.url, selectedFile.name, metadata)
      } else {
        throw new Error(result.error || '上传失败')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '上传失败'
      setUploadState({
        uploading: false,
        progress: 0,
        error: errorMessage,
        success: false,
      })
      onUploadError?.(errorMessage)
    }
  }

  // 清除选择
  const handleClear = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setSelectedFile(null)
    setPreviewUrl(null)
    setMetadata({})
    currentFileRef.current = null
    setUploadState({
      uploading: false,
      progress: 0,
      error: null,
      success: false,
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 文件选择 */}
      <div className="space-y-2">
        <Label htmlFor={`file-${fileType}`}>
          选择{fileType === 'image' ? '图片' : fileType === 'video' ? '视频' : '音频'}文件
        </Label>
        <Input
          ref={fileInputRef}
          id={`file-${fileType}`}
          type="file"
          accept={accept || defaultAccept}
          onChange={handleFileSelect}
          disabled={uploadState.uploading}
        />
      </div>

      {/* 文件预览 */}
      {selectedFile && (
        <div className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={uploadState.uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* 图片预览 */}
          {previewUrl && fileType === 'image' && (
            <div className="mt-2">
              <img
                src={previewUrl}
                alt="预览"
                className="max-w-full h-32 object-cover rounded border"
              />
            </div>
          )}

          {/* 上传按钮 */}
          <div className="flex space-x-2">
            <Button
              onClick={handleUpload}
              disabled={uploadState.uploading || uploadState.success}
              className="flex-1"
            >
              {uploadState.uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  上传中...
                </>
              ) : uploadState.success ? (
                '上传成功'
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  上传文件
                </>
              )}
            </Button>
          </div>

          {/* 上传进度 */}
          {uploadState.uploading && (
            <Progress value={uploadState.progress} className="w-full" />
          )}
        </div>
      )}

      {/* 错误信息 */}
      {uploadState.error && (
        <Alert variant="destructive">
          <AlertDescription>{uploadState.error}</AlertDescription>
        </Alert>
      )}

      {/* 成功信息 */}
      {uploadState.success && (
        <Alert>
          <AlertDescription>文件上传成功！</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
