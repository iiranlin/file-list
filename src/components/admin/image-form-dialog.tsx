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
import type { ImageFile } from "@/lib/data-loader"

interface ImageFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: ImageFile | null
  onSave: () => void
}

export function ImageFormDialog({ open, onOpenChange, editingItem, onSave }: ImageFormDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    src: "",
    category: "",
    tags: "",
    uploadDate: "",
    dimensions: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title,
        description: editingItem.description,
        src: editingItem.src,
        category: editingItem.category,
        tags: editingItem.tags.join(', '),
        uploadDate: editingItem.uploadDate,
        dimensions: editingItem.dimensions,
      })
    } else {
      setFormData({
        title: "",
        description: "",
        src: "",
        category: "",
        tags: "",
        uploadDate: new Date().toISOString().split('T')[0],
        dimensions: "",
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

        const token = btoa(`${user.userName}:${user.id}:${Date.now()}`)
        return {
          'Authorization': `Bearer ${token}`
        }
      }

      const url = '/api/admin/images'
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
        toast.success(editingItem ? '图片更新成功' : '图片创建成功')
      } else {
        const error = await response.json().catch(() => ({}))
        toast.warning(error.error || '保存失败')
      }
    } catch (error) {
      console.error('Failed to save image:', error)
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
            {editingItem ? '编辑图片' : '添加图片'}
          </DialogTitle>
          <DialogDescription>
            {editingItem ? '修改图片信息' : '添加新的图片文件到您的收藏'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">标题 *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="请输入图片标题"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">描述 *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="请输入图片描述"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>图片文件 *</Label>
            <Tabs defaultValue="url" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url">URL链接</TabsTrigger>
                <TabsTrigger value="upload">上传图片</TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-2">
                <Input
                  id="src"
                  value={formData.src}
                  onChange={(e) => handleChange('src', e.target.value)}
                  placeholder="请输入图片文件URL"
                  required
                />
              </TabsContent>

              <TabsContent value="upload" className="space-y-2">
                <FileUpload
                  fileType="image"
                  onUploadSuccess={(url, fileName, metadata) => {
                    handleChange('src', url)
                    // 自动填充标题（如果为空）
                    if (!formData.title) {
                      handleChange('title', fileName.replace(/\.[^/.]+$/, ''))
                    }
                    // 自动填充尺寸
                    if (metadata?.dimensions) {
                      handleChange('dimensions', metadata.dimensions)
                    }
                  }}
                  onUploadError={(error) => {
                    console.error('Upload error:', error)
                    toast.warning(`上传失败: ${error}`)
                  }}
                  accept="image/*"
                  maxSize={20}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">分类 *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder="如: Nature"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dimensions">尺寸 *</Label>
              <Input
                id="dimensions"
                value={formData.dimensions}
                onChange={(e) => handleChange('dimensions', e.target.value)}
                placeholder="如: 1920x1080"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">标签 *</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              placeholder="用逗号分隔，如: landscape, mountains, sunset"
              required
            />
            <p className="text-xs text-muted-foreground">
              多个标签请用逗号分隔
            </p>
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
