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
import type { AudioFile } from "@/lib/data-loader"

interface AudioFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: AudioFile | null
  onSave: () => void
}

export function AudioFormDialog({ open, onOpenChange, editingItem, onSave }: AudioFormDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    duration: "",
    genre: "",
    src: "",
    description: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title,
        artist: editingItem.artist,
        duration: editingItem.duration,
        genre: editingItem.genre,
        src: editingItem.src,
        description: editingItem.description,
      })
    } else {
      setFormData({
        title: "",
        artist: "",
        duration: "",
        genre: "",
        src: "",
        description: "",
      })
    }
  }, [editingItem, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = '/api/admin/audio'
      const method = editingItem ? 'PUT' : 'POST'
      const body = editingItem 
        ? { ...formData, id: editingItem.id }
        : formData

      // 获取认证头
      const getAuthHeaders = (): Record<string, string> => {
        const user = JSON.parse(localStorage.getItem('totp_auth_user') || '{}')
        if (!user.userName) return {}

        const token = btoa(`${user.userName}:${user.id}:${Date.now()}`)
        return {
          'Authorization': `Bearer ${token}`
        }
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        onSave()
        toast.operation.success(editingItem ? '更新' : '创建', '音频')
      } else {
        const error = await response.json().catch(() => ({}))
        toast.operation.failed('保存', error.error)
      }
    } catch (error) {
      console.error('Failed to save audio:', error)
      toast.operation.failed('保存', '网络错误')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? '编辑音频' : '添加音频'}
          </DialogTitle>
          <DialogDescription>
            {editingItem ? '修改音频信息' : '添加新的音频文件到您的收藏'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">标题 *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="请输入音频标题"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="artist">艺术家 *</Label>
            <Input
              id="artist"
              value={formData.artist}
              onChange={(e) => handleChange('artist', e.target.value)}
              placeholder="请输入艺术家名称"
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
                placeholder="如: 3:45"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre">类型 *</Label>
              <Input
                id="genre"
                value={formData.genre}
                onChange={(e) => handleChange('genre', e.target.value)}
                placeholder="如: Jazz"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>音频文件 *</Label>
            <Tabs defaultValue="url" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url">URL链接</TabsTrigger>
                <TabsTrigger value="upload">上传文件</TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-2">
                <Input
                  id="src"
                  value={formData.src}
                  onChange={(e) => handleChange('src', e.target.value)}
                  placeholder="请输入音频文件URL"
                  required
                />
              </TabsContent>

              <TabsContent value="upload" className="space-y-2">
                <FileUpload
                  fileType="audio"
                  onUploadSuccess={(url, fileName) => {
                    handleChange('src', url)
                    if (!formData.title) {
                      handleChange('title', fileName.replace(/\.[^/.]+$/, ''))
                    }
                  }}
                  onUploadError={(error) => {
                    console.error('Upload error:', error)
                    toast.upload.failed(error)
                  }}
                  accept="audio/*"
                  maxSize={50}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">描述</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="请输入音频描述"
              rows={3}
            />
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
