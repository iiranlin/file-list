"use client"

import { useState, useEffect } from "react"
import { toast } from "@/lib/toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUpload } from "@/components/file-upload"
import type { VideoFile } from "@/lib/data-loader"

interface VideoFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: VideoFile | null
  onSave: () => void
}

export function VideoFormDialog({ open, onOpenChange, editingItem, onSave }: VideoFormDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    category: "",
    thumbnail: "",
    src: "",
    views: "",
    uploadDate: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title,
        description: editingItem.description,
        duration: editingItem.duration,
        category: editingItem.category,
        thumbnail: editingItem.thumbnail,
        src: editingItem.src,
        views: editingItem.views,
        uploadDate: editingItem.uploadDate,
      })
    } else {
      setFormData({
        title: "",
        description: "",
        duration: "",
        category: "",
        thumbnail: "",
        src: "",
        views: "",
        uploadDate: typeof window !== 'undefined' ? new Date().toISOString().split('T')[0] : '',
      })
    }
  }, [editingItem, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 获取认证头
      const getAuthHeaders = (): Record<string, string> => {
        const user = JSON.parse(localStorage.getItem('totp_auth_user') || '{}')
        if (!user.userName) return {}

        const timestamp = typeof window !== 'undefined' ? Date.now() : 0
        const token = btoa(`${user.userName}:${user.id}:${timestamp}`)
        return {
          'Authorization': `Bearer ${token}`
        }
      }

      const url = '/api/admin/video'
      const method = editingItem ? 'PUT' : 'POST'
      const body = editingItem
        ? { ...formData, id: editingItem.id }
        : formData

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(body),
      })

      if (response.status === 403) {
        const error = await response.json()
        toast.warning(error.error || '权限不足')
        return
      }

      if (response.ok) {
        onSave()
        toast.success(editingItem ? '视频更新成功' : '视频创建成功')
      } else {
        const error = await response.json().catch(() => ({}))
        toast.warning(error.error || '保存失败')
      }
    } catch (error) {
      console.error('Failed to save video:', error)
      toast.warning('保存失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? '编辑视频' : '添加视频'}
          </DialogTitle>
          <DialogDescription>
            {editingItem ? '修改视频信息' : '添加新的视频文件到您的收藏'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">标题 *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="请输入视频标题"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">描述 *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="请输入视频描述"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">时长 *</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                placeholder="如: 12:45"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">分类 *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder="如: Tutorial"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>缩略图 *</Label>
            <Tabs defaultValue="url" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url">URL链接</TabsTrigger>
                <TabsTrigger value="upload">上传图片</TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-2">
                <Input
                  id="thumbnail"
                  value={formData.thumbnail}
                  onChange={(e) => handleChange('thumbnail', e.target.value)}
                  placeholder="请输入缩略图URL"
                  required
                />
              </TabsContent>

              <TabsContent value="upload" className="space-y-2">
                <FileUpload
                  fileType="image"
                  onUploadSuccess={(url) => {
                    handleChange('thumbnail', url)
                  }}
                  onUploadError={(error) => {
                    console.error('Upload error:', error)
                    toast.warning(`上传失败: ${error}`)
                  }}
                  accept="image/*"
                  maxSize={10}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-2">
            <Label>视频文件 *</Label>
            <Tabs defaultValue="url" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url">URL链接</TabsTrigger>
                <TabsTrigger value="upload">上传视频</TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-2">
                <Input
                  id="src"
                  value={formData.src}
                  onChange={(e) => handleChange('src', e.target.value)}
                  placeholder="请输入视频文件URL"
                  required
                />
              </TabsContent>

              <TabsContent value="upload" className="space-y-2">
                <FileUpload
                  fileType="video"
                  onUploadSuccess={(url, fileName) => {
                    handleChange('src', url)
                    if (!formData.title) {
                      handleChange('title', fileName.replace(/\.[^/.]+$/, ''))
                    }
                  }}
                  onUploadError={(error) => {
                    console.error('Upload error:', error)
                    toast.warning(`上传失败: ${error}`)
                  }}
                  accept="video/*"
                  maxSize={200}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="views">观看量 *</Label>
              <Input
                id="views"
                value={formData.views}
                onChange={(e) => handleChange('views', e.target.value)}
                placeholder="如: 1.2k"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="uploadDate">上传日期 *</Label>
              <Input
                id="uploadDate"
                type="date"
                value={formData.uploadDate}
                onChange={(e) => handleChange('uploadDate', e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              取消
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '保存中...' : '保存'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
