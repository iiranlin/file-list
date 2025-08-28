"use client"

import { useState, useEffect } from "react"
import { Shield, User, Key, Lock, Crown, Mail, FileText } from "lucide-react"
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
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface UserData {
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

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: UserData | null
  onSubmit: () => void
  getAuthHeaders: () => Record<string, string>
}

export function UserFormDialog({
  open,
  onOpenChange,
  editingItem,
  onSubmit,
  getAuthHeaders,
}: UserFormDialogProps) {
  const [formData, setFormData] = useState({
    userName: '',
    userCode: '',
    systemCode: '',
    totpSecret: '',
    role: 'user',
    displayName: '',
    email: '',
    avatar: '',
    bio: '',
    isActive: true,
  })
  const [loading, setLoading] = useState(false)

  // 重置表单
  const resetForm = () => {
    setFormData({
      userName: '',
      userCode: '',
      systemCode: '',
      totpSecret: '',
      role: 'user',
      displayName: '',
      email: '',
      avatar: '',
      bio: '',
      isActive: true,
    })
  }

  // 当编辑项改变时更新表单
  useEffect(() => {
    if (editingItem) {
      setFormData({
        userName: editingItem.userName,
        userCode: editingItem.userCode,
        systemCode: editingItem.systemCode,
        totpSecret: editingItem.totpSecret || '',
        role: editingItem.role || 'user',
        displayName: editingItem.displayName || '',
        email: editingItem.email || '',
        avatar: editingItem.avatar || '',
        bio: editingItem.bio || '',
        isActive: editingItem.isActive === 1,
      })
    } else {
      resetForm()
    }
  }, [editingItem])

  // 处理输入变化
  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // 生成随机验证码
  const generateRandomCode = (length: number = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = '/api/admin/users'
      const method = editingItem ? 'PUT' : 'POST'
      const body = editingItem
        ? { ...formData, id: editingItem.id, isActive: formData.isActive ? 1 : 0 }
        : { ...formData, isActive: formData.isActive ? 1 : 0 }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        onSubmit()
        resetForm()
        toast.success(editingItem ? '用户更新成功' : '用户创建成功')
      } else {
        const error = await response.json()
        toast.warning(error.error || '操作失败')
      }
    } catch (error) {
      console.error('Submit failed:', error)
      toast.warning('操作失败')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = formData.userName

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            {editingItem ? '编辑用户' : '添加用户'}
          </DialogTitle>
          <DialogDescription>
            {editingItem ? '修改用户信息和权限设置' : '创建新的系统用户'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto">
          {/* 用户名 */}
          <div className="space-y-2">
            <Label htmlFor="userName" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              用户名 *
            </Label>
            <Input
              id="userName"
              value={formData.userName}
              onChange={(e) => handleChange('userName', e.target.value)}
              placeholder="请输入用户名"
              required
              disabled={loading}
            />
          </div>

          {/* 显示名称 */}
          <div className="space-y-2">
            <Label htmlFor="displayName" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              显示名称
            </Label>
            <Input
              id="displayName"
              value={formData.displayName}
              onChange={(e) => handleChange('displayName', e.target.value)}
              placeholder="请输入显示名称"
              disabled={loading}
            />
          </div>

          {/* 邮箱 */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              邮箱
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="请输入邮箱地址"
              disabled={loading}
            />
          </div>

          {/* 用户角色 */}
          <div className="space-y-2">
            <Label htmlFor="role" className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              用户角色 *
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleChange('role', value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择用户角色" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">普通用户</SelectItem>
                <SelectItem value="admin">管理员</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 个人简介 */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              个人简介
            </Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="请输入个人简介"
              disabled={loading}
              rows={3}
            />
          </div>

          {/* TOTP密钥 (仅编辑时显示) */}
          {editingItem && (
            <div className="space-y-2">
              <Label htmlFor="totpSecret" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                TOTP密钥
              </Label>
              <Input
                id="totpSecret"
                value={formData.totpSecret}
                onChange={(e) => handleChange('totpSecret', e.target.value)}
                placeholder="TOTP密钥（留空保持不变）"
                disabled={loading}
              />
            </div>
          )}

          {/* 状态开关 */}
          <div className="flex items-center justify-between">
            <Label htmlFor="isActive" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              启用状态
            </Label>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleChange('isActive', checked)}
              disabled={loading}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              取消
            </Button>
            <Button type="submit" disabled={!isFormValid || loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {editingItem ? '更新中...' : '创建中...'}
                </>
              ) : (
                editingItem ? '更新' : '创建'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
