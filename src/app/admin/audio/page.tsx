"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Music } from "lucide-react"
import { toast } from "@/lib/toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AdminLayout } from "@/components/admin-layout"
import { AudioFormDialog } from "@/components/admin/audio-form-dialog"
import type { AudioFile } from "@/lib/data-loader"

export default function AudioManagePage() {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<AudioFile | null>(null)

  // 获取认证头
  const getAuthHeaders = (): Record<string, string> => {
    const user = JSON.parse(localStorage.getItem('totp_auth_user') || '{}')
    if (!user.userName) return {}

    const token = btoa(`${user.userName}:${user.id}:${Date.now()}`)
    return {
      'Authorization': `Bearer ${token}`
    }
  }

  const fetchAudioFiles = async () => {
    try {
      const response = await fetch('/api/admin/audio', {
        headers: getAuthHeaders()
      })



      const data = await response.json()
      setAudioFiles(data)
    } catch (error) {
      console.error('Failed to fetch audio files:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAudioFiles()
  }, [])

  const handleCreate = () => {
    setEditingItem(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (item: AudioFile) => {
    setEditingItem(item)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个音频文件吗？')) return

    try {
      const response = await fetch(`/api/admin/audio?id=${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (response.status === 403) {
        toast.permission.denied('删除音频')
        return
      }

      if (response.ok) {
        await fetchAudioFiles()
        toast.operation.success('删除', '音频文件')
      } else {
        toast.operation.failed('删除')
      }
    } catch (error) {
      console.error('Failed to delete audio file:', error)
      toast.operation.failed('删除', '网络错误')
    }
  }

  const handleSave = async () => {
    await fetchAudioFiles()
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
              <Music className="h-8 w-8 text-blue-500" />
              音频管理
            </h1>
            <p className="text-muted-foreground mt-2">
              管理音频文件，包括添加、编辑和删除音频内容
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            添加音频
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">总音频数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{audioFiles.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">音乐类型</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(audioFiles.map(f => f.genre)).size}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">艺术家数量</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(audioFiles.map(f => f.artist)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 音频列表 */}
        <Card>
          <CardHeader>
            <CardTitle>音频列表</CardTitle>
            <CardDescription>
              管理您的音频文件集合
            </CardDescription>
          </CardHeader>
          <CardContent>
            {audioFiles.length === 0 ? (
              <div className="text-center py-8">
                <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">暂无音频文件</p>
                <Button onClick={handleCreate} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  添加第一个音频
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>标题</TableHead>
                    <TableHead>艺术家</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>时长</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {audioFiles.map((audio) => (
                    <TableRow key={audio.id}>
                      <TableCell className="font-medium">{audio.title}</TableCell>
                      <TableCell>{audio.artist}</TableCell>
                      <TableCell>{audio.genre}</TableCell>
                      <TableCell>{audio.duration}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(audio)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(audio.id)}
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
        <AudioFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          editingItem={editingItem}
          onSave={handleSave}
        />
      </div>
    </AdminLayout>
  )
}
