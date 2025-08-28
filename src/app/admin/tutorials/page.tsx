"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, BookOpen } from "lucide-react"
import { toast } from "@/lib/toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/admin-layout"
import { TutorialFormDialog } from "@/components/admin/tutorial-form-dialog"
import type { Tutorial } from "@/lib/data-loader"

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    case "Intermediate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    case "Advanced":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
  }
}

export default function TutorialManagePage() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Tutorial | null>(null)

  // 获取认证头
  const getAuthHeaders = (): Record<string, string> => {
    const user = JSON.parse(localStorage.getItem('totp_auth_user') || '{}')
    if (!user.userName) return {}

    const token = btoa(`${user.userName}:${user.id}:${Date.now()}`)
    return {
      'Authorization': `Bearer ${token}`
    }
  }

  const fetchTutorials = async () => {
    try {
      const response = await fetch('/api/admin/tutorials', {
        headers: getAuthHeaders()
      })



      const data = await response.json()
      // 确保data是数组
      setTutorials(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch tutorials:', error)
      setTutorials([]) // 确保设置为空数组
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTutorials()
  }, [])

  const handleCreate = () => {
    setEditingItem(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (item: Tutorial) => {
    setEditingItem(item)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个教程吗？')) return

    try {
      const response = await fetch(`/api/admin/tutorials?id=${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (response.status === 403) {
        const error = await response.json()
        toast.warning(error.error || '权限不足')
        return
      }

      if (response.ok) {
        await fetchTutorials()
        toast.success('教程删除成功')
      } else {
        toast.warning('删除失败')
      }
    } catch (error) {
      console.error('Failed to delete tutorial:', error)
      toast.warning('删除失败')
    }
  }

  const handleSave = async () => {
    await fetchTutorials()
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
              <BookOpen className="h-8 w-8 text-purple-500" />
              教程管理
            </h1>
            <p className="text-muted-foreground mt-2">
              管理教程内容，包括添加、编辑和删除教程
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            添加教程
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">总教程数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tutorials.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">教程分类</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(tutorials.map(t => t.category)).size}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">作者数量</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(tutorials.map(t => t.author)).size}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">标签总数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(tutorials.flatMap(t => t.tags)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 教程列表 */}
        <Card>
          <CardHeader>
            <CardTitle>教程列表</CardTitle>
            <CardDescription>
              管理您的教程内容集合
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tutorials.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">暂无教程</p>
                <Button onClick={handleCreate} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  添加第一个教程
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>标题</TableHead>
                    <TableHead>分类</TableHead>
                    <TableHead>难度</TableHead>
                    <TableHead>作者</TableHead>
                    <TableHead>阅读时间</TableHead>
                    <TableHead>发布日期</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tutorials.map((tutorial) => (
                    <TableRow key={tutorial.id}>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate">{tutorial.title}</div>
                      </TableCell>
                      <TableCell>{tutorial.category}</TableCell>
                      <TableCell>
                        <Badge className={getDifficultyColor(tutorial.difficulty)}>
                          {tutorial.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>{tutorial.author}</TableCell>
                      <TableCell>{tutorial.readTime}</TableCell>
                      <TableCell>{tutorial.publishDate}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(tutorial)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(tutorial.id)}
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
        <TutorialFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          editingItem={editingItem}
          onSave={handleSave}
        />
      </div>
    </AdminLayout>
  )
}
