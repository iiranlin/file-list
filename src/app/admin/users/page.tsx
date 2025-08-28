"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Shield, ToggleLeft, ToggleRight, Users, Crown, User } from "lucide-react"
import { toast } from "@/lib/toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/admin-layout"
import { UserFormDialog } from "@/components/admin/user-form-dialog"
import { getAuthUser } from "@/lib/auth"

// 客户端权限检查接口
interface ClientUser {
  id: number
  userName: string
  role: string
}

// 客户端权限检查函数
function hasPermission(user: ClientUser | null, permission: 'read' | 'write' | 'delete'): boolean {
  if (!user) return false
  if (user.role === 'admin') return true
  return permission === 'read'
}

function isAdmin(user: ClientUser | null): boolean {
  return user?.role === 'admin'
}

interface User {
  id: number
  userName: string
  userCode: string
  systemCode: string
  totpSecret?: string
  role: string
  displayName?: string
  email?: string
  avatar?: string
  bio?: string
  isActive: number
  createdAt: string
  updatedAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<User | null>(null)
  const [currentUser, setCurrentUser] = useState<ClientUser | null>(null)
  const [permissionError, setPermissionError] = useState<string | null>(null)

  // 获取认证头
  const getAuthHeaders = (): Record<string, string> => {
    const user = getAuthUser()
    if (!user) return {}

    const token = btoa(`${user.userName}:${user.id}:${Date.now()}`)
    return {
      'Authorization': `Bearer ${token}`
    }
  }

  // 加载数据
  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: getAuthHeaders()
      })
      const result = await response.json()

      if (response.ok) {
        setUsers(result.data || [])
        setPermissionError(null)
      } else {
        setPermissionError(result.error || '加载失败')
        setUsers([])
      }
    } catch (error) {
      console.error('Failed to load users:', error)
      setPermissionError('网络错误')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // 获取当前用户信息
    const user = getAuthUser()
    setCurrentUser(user)

    loadUsers()
  }, [])

  // 处理新增
  const handleAdd = () => {
    if (!hasPermission(currentUser, 'write')) {
      toast.permission.denied('创建用户')
      return
    }
    setEditingItem(null)
    setDialogOpen(true)
  }

  // 处理编辑
  const handleEdit = (item: User) => {
    if (!hasPermission(currentUser, 'write')) {
      toast.permission.denied('编辑用户')
      return
    }
    setEditingItem(item)
    setDialogOpen(true)
  }

  // 处理删除
  const handleDelete = async (id: number) => {
    if (!hasPermission(currentUser, 'delete')) {
      toast.permission.denied('删除用户')
      return
    }

    if (!confirm('确定要删除这个用户吗？')) return

    try {
      const response = await fetch(`/api/admin/users?id=${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      const result = await response.json()
      if (response.ok) {
        await loadUsers()
        toast.operation.success('删除', '用户')
      } else {
        toast.operation.failed('删除', result.error)
      }
    } catch (error) {
      console.error('Delete failed:', error)
      toast.operation.failed('删除', '网络错误')
    }
  }

  // 处理启用/禁用
  const handleToggleActive = async (item: User) => {
    if (!hasPermission(currentUser, 'write')) {
      toast.permission.denied('修改用户状态')
      return
    }

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          ...item,
          isActive: item.isActive === 1 ? 0 : 1,
        }),
      })

      const result = await response.json()
      if (response.ok) {
        await loadUsers()
        const action = item.isActive === 1 ? '禁用' : '激活'
        toast.operation.success(action, '用户')
      } else {
        toast.operation.failed('状态更新', result.error)
      }
    } catch (error) {
      console.error('Toggle failed:', error)
      toast.operation.failed('状态更新', '网络错误')
    }
  }

  // 处理表单提交
  const handleFormSubmit = async () => {
    await loadUsers()
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
            <h1 className="text-3xl font-bold">用户管理</h1>
            <p className="text-muted-foreground mt-2">
              管理系统用户信息和权限设置
            </p>
            {currentUser && (
              <p className="text-sm text-muted-foreground mt-1">
                当前用户: {currentUser.userName} ({currentUser.role === 'admin' ? '管理员' : '普通用户'})
              </p>
            )}
          </div>
          {hasPermission(currentUser, 'write') && (
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              添加用户
            </Button>
          )}
        </div>

        {/* 权限错误提示 */}
        {permissionError && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-600">
                <Shield className="h-5 w-5" />
                <span className="font-medium">权限不足</span>
              </div>
              <p className="text-red-600 mt-2">{permissionError}</p>
            </CardContent>
          </Card>
        )}

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总用户数</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Array.isArray(users) ? users.length : 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">管理员</CardTitle>
              <Crown className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {Array.isArray(users) ? users.filter(item => item.role === 'admin').length : 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">激活用户</CardTitle>
              <ToggleRight className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {Array.isArray(users) ? users.filter(item => item.isActive === 1).length : 0}
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
                {Array.isArray(users) ? users.filter(item => item.isActive === 0).length : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 用户列表 */}
        <Card>
          <CardHeader>
            <CardTitle>用户列表</CardTitle>
            <CardDescription>
              管理所有系统用户的信息和权限
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!Array.isArray(users) || users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {permissionError ? '无权限查看用户数据' : '暂无用户数据'}
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {item.role === 'admin' ? (
                            <Crown className="h-4 w-4 text-yellow-600" />
                          ) : (
                            <User className="h-4 w-4 text-gray-600" />
                          )}
                          <h3 className="font-medium">
                            {item.displayName || item.userName}
                          </h3>
                          {item.displayName && (
                            <span className="text-sm text-muted-foreground">
                              (@{item.userName})
                            </span>
                          )}
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            item.role === 'admin'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {item.role === 'admin' ? '管理员' : '普通用户'}
                        </span>
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
                        {item.email && <span>邮箱: {item.email} | </span>}
                        TOTP: {item.totpSecret ? '已设置' : '未设置'}
                      </div>
                      {item.bio && (
                        <div className="text-sm text-muted-foreground mt-1">
                          简介: {item.bio}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        创建时间: {new Date(item.createdAt).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {hasPermission(currentUser, 'write') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActive(item)}
                          title={item.isActive === 1 ? '禁用用户' : '激活用户'}
                        >
                          {item.isActive === 1 ? (
                            <ToggleLeft className="h-4 w-4" />
                          ) : (
                            <ToggleRight className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      {hasPermission(currentUser, 'write') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                          title="编辑用户"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {hasPermission(currentUser, 'delete') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          title="删除用户"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      {!hasPermission(currentUser, 'write') && (
                        <span className="text-xs text-muted-foreground">
                          仅可查看
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 表单对话框 */}
      {hasPermission(currentUser, 'write') && (
        <UserFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          editingItem={editingItem}
          onSubmit={handleFormSubmit}
          getAuthHeaders={getAuthHeaders}
        />
      )}
    </AdminLayout>
  )
}
