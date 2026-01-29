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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MdEditor } from "@/components/md-editor"
import type { Tutorial } from "@/lib/data-loader"

interface TutorialFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: Tutorial | null
  onSave: () => void
}

export function TutorialFormDialog({ open, onOpenChange, editingItem, onSave }: TutorialFormDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    difficulty: "Beginner" as "Beginner" | "Intermediate" | "Advanced",
    readTime: "",
    author: "",
    publishDate: "",
    tags: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title,
        excerpt: editingItem.excerpt,
        content: editingItem.content,
        category: editingItem.category,
        difficulty: editingItem.difficulty,
        readTime: editingItem.readTime,
        author: editingItem.author,
        publishDate: editingItem.publishDate,
        tags: editingItem.tags.join(', '),
      })
    } else {
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        category: "",
        difficulty: "Beginner",
        readTime: "",
        author: "",
        publishDate: typeof window !== 'undefined' ? new Date().toISOString().split('T')[0] : '',
        tags: "",
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

      const url = '/api/admin/tutorials'
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
        toast.success(editingItem ? '教程更新成功' : '教程创建成功')
      } else {
        const error = await response.json().catch(() => ({}))
        toast.warning(error.error || '保存失败')
      }
    } catch (error) {
      console.error('Failed to save tutorial:', error)
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
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? '编辑教程' : '添加教程'}
          </DialogTitle>
          <DialogDescription>
            {editingItem ? '修改教程信息' : '添加新的教程到您的收藏'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">标题 *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="请输入教程标题"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">摘要 *</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              placeholder="请输入教程摘要"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">内容 *</Label>
            <div className="border rounded-md overflow-hidden">
              <MdEditor
                value={formData.content}
                onChange={(value) => handleChange('content', value)}
                placeholder="请输入教程完整内容（支持Markdown格式）"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              支持Markdown格式，可直接粘贴或拖拽图片上传
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">分类 *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder="如: Web Development"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">难度 *</Label>
              <Select value={formData.difficulty} onValueChange={(value) => handleChange('difficulty', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择难度" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">初级</SelectItem>
                  <SelectItem value="Intermediate">中级</SelectItem>
                  <SelectItem value="Advanced">高级</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="readTime">阅读时间 *</Label>
              <Input
                id="readTime"
                value={formData.readTime}
                onChange={(e) => handleChange('readTime', e.target.value)}
                placeholder="如: 8 min read"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">作者 *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleChange('author', e.target.value)}
                placeholder="请输入作者名称"
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
              placeholder="用逗号分隔，如: React, JavaScript, Web Development"
              required
            />
            <p className="text-xs text-muted-foreground">
              多个标签请用逗号分隔
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="publishDate">发布日期 *</Label>
            <Input
              id="publishDate"
              type="date"
              value={formData.publishDate}
              onChange={(e) => handleChange('publishDate', e.target.value)}
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
