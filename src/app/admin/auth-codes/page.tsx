"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Shield, ToggleLeft, ToggleRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/admin-layout"
import { AuthCodeFormDialog } from "@/components/admin/auth-code-form-dialog"

interface AuthCode {
  id: number
  userName: string
  userCode: string
  systemCode: string
  isActive: number
  createdAt: string
  updatedAt: string
}

export default function AuthCodesPage() {
  const [authCodes, setAuthCodes] = useState<AuthCode[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<AuthCode | null>(null)

  // 加载数据
  const loadAuthCodes = async () => {
    try {
      const response = await fetch('/api/admin/auth-codes')
      const data = await response.json()
      setAuthCodes(data)
    } catch (error) {
      console.error('Failed to load auth codes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAuthCodes()
  }, [])

  // 处理新增
  const handleAdd = () => {
    setEditingItem(null)
    setDialogOpen(true)
  }

  // 处理编辑
  const handleEdit = (item: AuthCode) => {
    setEditingItem(item)
    setDialogOpen(true)
  }

  // 处理删除
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个验证码吗？')) return

    try {
      const response = await fetch(`/api/admin/auth-codes?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await loadAuthCodes()
      } else {
        alert('删除失败')
      }
    } catch (error) {
      console.error('Delete failed:', error)
      alert('删除失败')
    }
  }

  // 处理启用/禁用
  const handleToggleActive = async (item: AuthCode) => {
    try {
      const response = await fetch('/api/admin/auth-codes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...item,
          isActive: item.isActive === 1 ? 0 : 1,
        }),
      })

      if (response.ok) {
        await loadAuthCodes()
      } else {
        alert('状态更新失败')
      }
    } catch (error) {
      console.error('Toggle failed:', error)
      alert('状态更新失败')
    }
  }

  // 处理表单提交
  const handleFormSubmit = async () => {
    await loadAuthCodes()
    setDialogOpen(false)
    setEditingItem(null)
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
            <h1 className="text-3xl font-bold">验证码管理</h1>
            <p className="text-muted-foreground mt-2">
              管理用户身份验证码和系统验证码
            </p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            添加验证码
          </Button>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总验证码</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Array.isArray(authCodes) ? authCodes.length : 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">激活用户</CardTitle>
              <ToggleRight className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {Array.isArray(authCodes) ? authCodes.filter(item => item.isActive === 1).length : 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">禁用用户</CardTitle>
              <ToggleLeft className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {Array.isArray(authCodes) ? authCodes.filter(item => item.isActive === 0).length : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 验证码列表 */}
        <Card>
          <CardHeader>
            <CardTitle>验证码列表</CardTitle>
            <CardDescription>
              管理所有用户的验证码信息
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!Array.isArray(authCodes) || authCodes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                暂无验证码数据
              </div>
            ) : (
              <div className="space-y-4">
                {authCodes.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium">{item.userName}</h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            item.isActive === 1
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.isActive === 1 ? '激活' : '禁用'}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        用户验证码: {item.userCode} | 系统验证码: {item.systemCode}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        创建时间: {new Date(item.createdAt).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(item)}
                      >
                        {item.isActive === 1 ? (
                          <ToggleLeft className="h-4 w-4" />
                        ) : (
                          <ToggleRight className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 表单对话框 */}
      <AuthCodeFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingItem={editingItem}
        onSubmit={handleFormSubmit}
      />
    </AdminLayout>
  )
}
