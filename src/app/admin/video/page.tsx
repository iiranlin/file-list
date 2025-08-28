"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Video } from "lucide-react"
import { toast } from "@/lib/toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AdminLayout } from "@/components/admin-layout"
import { VideoFormDialog } from "@/components/admin/video-form-dialog"
import type { VideoFile } from "@/lib/data-loader"

export default function VideoManagePage() {
  const [videoFiles, setVideoFiles] = useState<VideoFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<VideoFile | null>(null)

  // 获取认证头
  const getAuthHeaders = (): Record<string, string> => {
    const user = JSON.parse(localStorage.getItem('totp_auth_user') || '{}')
    if (!user.userName) return {}

    const token = btoa(`${user.userName}:${user.id}:${Date.now()}`)
    return {
      'Authorization': `Bearer ${token}`
    }
  }

  const fetchVideoFiles = async () => {
    try {
      const response = await fetch('/api/admin/video', {
        headers: getAuthHeaders()
      })



      const data = await response.json()
      // 确保data是数组
      setVideoFiles(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch video files:', error)
      setVideoFiles([]) // 确保设置为空数组
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVideoFiles()
  }, [])

  const handleCreate = () => {
    setEditingItem(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (item: VideoFile) => {
    setEditingItem(item)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个视频文件吗？')) return

    try {
      const response = await fetch(`/api/admin/video?id=${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (response.status === 403) {
        toast.permission.denied('删除视频')
        return
      }

      if (response.ok) {
        await fetchVideoFiles()
        toast.operation.success('删除', '视频文件')
      } else {
        toast.operation.failed('删除')
      }
    } catch (error) {
      console.error('Failed to delete video file:', error)
      toast.operation.failed('删除', '网络错误')
    }
  }

  const handleSave = async () => {
    await fetchVideoFiles()
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
              <Video className="h-8 w-8 text-red-500" />
              视频管理
            </h1>
            <p className="text-muted-foreground mt-2">
              管理视频文件，包括添加、编辑和删除视频内容
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            添加视频
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">总视频数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{videoFiles.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">视频分类</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(videoFiles.map(f => f.category)).size}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">总观看量</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {videoFiles.reduce((sum, f) => sum + parseFloat(f.views.replace('k', '')) * 1000, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 视频列表 */}
        <Card>
          <CardHeader>
            <CardTitle>视频列表</CardTitle>
            <CardDescription>
              管理您的视频文件集合
            </CardDescription>
          </CardHeader>
          <CardContent>
            {videoFiles.length === 0 ? (
              <div className="text-center py-8">
                <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">暂无视频文件</p>
                <Button onClick={handleCreate} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  添加第一个视频
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>标题</TableHead>
                    <TableHead>分类</TableHead>
                    <TableHead>时长</TableHead>
                    <TableHead>观看量</TableHead>
                    <TableHead>上传日期</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {videoFiles.map((video) => (
                    <TableRow key={video.id}>
                      <TableCell className="font-medium">{video.title}</TableCell>
                      <TableCell>{video.category}</TableCell>
                      <TableCell>{video.duration}</TableCell>
                      <TableCell>{video.views}</TableCell>
                      <TableCell>{video.uploadDate}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(video)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(video.id)}
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
        <VideoFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          editingItem={editingItem}
          onSave={handleSave}
        />
      </div>
    </AdminLayout>
  )
}
