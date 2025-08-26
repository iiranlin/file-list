"use client"

import { useState, useEffect } from "react"
import { Shield, User, Key, Lock } from "lucide-react"

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

interface AuthCode {
  id: number
  userName: string
  userCode: string
  systemCode: string
  isActive: number
  createdAt: string
  updatedAt: string
}

interface AuthCodeFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: AuthCode | null
  onSubmit: () => void
}

export function AuthCodeFormDialog({
  open,
  onOpenChange,
  editingItem,
  onSubmit,
}: AuthCodeFormDialogProps) {
  const [formData, setFormData] = useState({
    userName: '',
    userCode: '',
    systemCode: '',
    isActive: true,
  })
  const [loading, setLoading] = useState(false)

  // 重置表单
  const resetForm = () => {
    setFormData({
      userName: '',
      userCode: '',
      systemCode: '',
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
      const url = '/api/admin/auth-codes'
      const method = editingItem ? 'PUT' : 'POST'
      const body = editingItem
        ? { ...formData, id: editingItem.id, isActive: formData.isActive ? 1 : 0 }
        : { ...formData, isActive: formData.isActive ? 1 : 0 }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        onSubmit()
        resetForm()
      } else {
        const error = await response.json()
        alert(error.error || '操作失败')
      }
    } catch (error) {
      console.error('Submit failed:', error)
      alert('操作失败')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = formData.userName && formData.userCode && formData.systemCode

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            {editingItem ? '编辑验证码' : '添加验证码'}
          </DialogTitle>
          <DialogDescription>
            {editingItem ? '修改用户验证码信息' : '创建新的用户验证码'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* 用户验证码 */}
          <div className="space-y-2">
            <Label htmlFor="userCode" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              用户验证码 *
            </Label>
            <div className="flex gap-2">
              <Input
                id="userCode"
                value={formData.userCode}
                onChange={(e) => handleChange('userCode', e.target.value)}
                placeholder="请输入用户验证码"
                required
                disabled={loading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => handleChange('userCode', generateRandomCode())}
                disabled={loading}
              >
                生成
              </Button>
            </div>
          </div>

          {/* 系统验证码 */}
          <div className="space-y-2">
            <Label htmlFor="systemCode" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              系统验证码 *
            </Label>
            <div className="flex gap-2">
              <Input
                id="systemCode"
                value={formData.systemCode}
                onChange={(e) => handleChange('systemCode', e.target.value)}
                placeholder="请输入系统验证码"
                required
                disabled={loading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => handleChange('systemCode', generateRandomCode())}
                disabled={loading}
              >
                生成
              </Button>
            </div>
          </div>

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
