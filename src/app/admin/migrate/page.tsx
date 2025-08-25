"use client"

import { useState } from "react"
import { Database, Upload, AlertTriangle, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AdminLayout } from "@/components/admin-layout"

export default function MigratePage() {
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleMigrate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/admin/migrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult({ success: true, message: data.message })
      } else {
        setResult({ success: false, message: data.error || '迁移失败' })
      }
    } catch (error) {
      setResult({ success: false, message: '网络错误，请重试' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* 页面标题 */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <Database className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">数据库迁移</h1>
          <p className="text-muted-foreground">
            将JSON文件中的数据迁移到PostgreSQL数据库
          </p>
        </div>

        {/* 迁移说明 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              迁移说明
            </CardTitle>
            <CardDescription>
              请仔细阅读以下说明后再执行迁移操作
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">迁移内容：</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>音频文件数据 (src/data/audio.json)</li>
                <li>视频文件数据 (src/data/videos.json)</li>
                <li>图片文件数据 (src/data/images.json)</li>
                <li>教程内容数据 (src/data/tutorials.json)</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">注意事项：</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>迁移过程会将JSON数据导入到PostgreSQL数据库</li>
                <li>如果数据库中已有数据，新数据会追加到现有数据中</li>
                <li>迁移完成后，系统会优先使用数据库数据</li>
                <li>原JSON文件不会被删除，可作为备份保留</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 迁移表单 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-500" />
              执行迁移
            </CardTitle>
            <CardDescription>
              输入管理员密码以确认迁移操作
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleMigrate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">管理员密码</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入管理员密码"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    迁移中...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    开始迁移
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 迁移结果 */}
        {result && (
          <Card className={result.success ? "border-green-200" : "border-red-200"}>
            <CardContent className="pt-6">
              <div className={`flex items-center gap-3 ${result.success ? "text-green-700" : "text-red-700"}`}>
                {result.success ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <AlertTriangle className="h-5 w-5" />
                )}
                <div>
                  <h4 className="font-medium">
                    {result.success ? "迁移成功！" : "迁移失败"}
                  </h4>
                  <p className="text-sm mt-1">{result.message}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 数据库信息 */}
        <Card>
          <CardHeader>
            <CardTitle>数据库信息</CardTitle>
            <CardDescription>
              当前连接的PostgreSQL数据库信息
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">数据库类型:</span>
                <span>PostgreSQL (Neon)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">连接状态:</span>
                <span className="text-green-600">已连接</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">表结构:</span>
                <span>已创建 (4个表)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
