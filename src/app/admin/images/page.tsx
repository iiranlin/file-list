"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react"
import { toast } from "@/lib/toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/admin-layout"
import { ImageFormDialog } from "@/components/admin/image-form-dialog"
import type { ImageFile } from "@/lib/data-loader"

export default function ImageManagePage() {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ImageFile | null>(null)

  // 获取认证头
  const getAuthHeaders = (): Record<string, string> => {
    const user = JSON.parse(localStorage.getItem('totp_auth_user') || '{}')
    if (!user.userName) return {}

    const token = btoa(`${user.userName}:${user.id}:${Date.now()}`)
    return {
      'Authorization': `Bearer ${token}`
    }
  }

  const fetchImageFiles = async () => {
    try {
      const response = await fetch('/api/admin/images', {
        headers: getAuthHeaders()
      })



      const data = await response.json()
      // 确保data是数组
      setImageFiles(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch image files:', error)
      setImageFiles([]) // 确保设置为空数组
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchImageFiles()
  }, [])

  const handleCreate = () => {
    setEditingItem(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (item: ImageFile) => {
    setEditingItem(item)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个图片文件吗？')) return

    try {
      const response = await fetch(`/api/admin/images?id=${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (response.status === 403) {
        const error = await response.json()
        toast.warning(error.error || '权限不足')
        return
      }

      if (response.ok) {
        await fetchImageFiles()
        toast.success('图片文件删除成功')
      } else {
        toast.warning('删除失败')
      }
    } catch (error) {
      console.error('Failed to delete image file:', error)
      toast.warning('删除失败')
    }
  }

  const handleSave = async () => {
    await fetchImageFiles()
    setIsDialogOpen(false)
    setEditingItem(null)
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>加载中...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ImageIcon className="h-8 w-8 text-green-500" />
              图片管理
            </h1>
            <p className="text-muted-foreground mt-2">
              管理图片文件，包括添加、编辑和删除图片内容
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            添加图片
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">总图片数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{imageFiles.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">图片分类</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(imageFiles.map(f => f.category)).size}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">标签总数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(imageFiles.flatMap(f => f.tags)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 图片列表 */}
        <Card>
          <CardHeader>
            <CardTitle>图片列表</CardTitle>
            <CardDescription>
              管理您的图片文件集合
            </CardDescription>
          </CardHeader>
          <CardContent>
            {imageFiles.length === 0 ? (
              <div className="text-center py-8">
                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">暂无图片文件</p>
                <Button onClick={handleCreate} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  添加第一张图片
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>标题</TableHead>
                    <TableHead>分类</TableHead>
                    <TableHead>尺寸</TableHead>
                    <TableHead>标签</TableHead>
                    <TableHead>上传日期</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {imageFiles.map((image) => (
                    <TableRow key={image.id}>
                      <TableCell className="font-medium">{image.title}</TableCell>
                      <TableCell>{image.category}</TableCell>
                      <TableCell>{image.dimensions}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {image.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {image.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{image.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{image.uploadDate}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(image)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(image.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* 表单对话框 */}
        <ImageFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          editingItem={editingItem}
          onSave={handleSave}
        />
      </div>
    </AdminLayout>
  )
}
