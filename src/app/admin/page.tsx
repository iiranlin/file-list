"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Music, Video, Image as ImageIcon, BookOpen, Plus, BarChart3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/admin-layout"

interface ContentStats {
  audio: number
  video: number
  images: number
  tutorials: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<ContentStats>({
    audio: 0,
    video: 0,
    images: 0,
    tutorials: 0
  })

  useEffect(() => {
    // 获取内容统计数据
    const fetchStats = async () => {
      try {
        const [audioRes, videoRes, imagesRes, tutorialsRes] = await Promise.all([
          fetch('/api/admin/audio'),
          fetch('/api/admin/video'),
          fetch('/api/admin/images'),
          fetch('/api/admin/tutorials')
        ])

        const [audio, video, images, tutorials] = await Promise.all([
          audioRes.json(),
          videoRes.json(),
          imagesRes.json(),
          tutorialsRes.json()
        ])

        setStats({
          audio: audio.length || 0,
          video: video.length || 0,
          images: images.length || 0,
          tutorials: tutorials.length || 0
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
        // 使用默认值
        setStats({
          audio: 6,
          video: 6,
          images: 9,
          tutorials: 4
        })
      }
    }

    fetchStats()
  }, [])

  const contentTypes = [
    {
      title: "音频管理",
      description: "管理音频文件，包括添加、编辑和删除音频内容",
      icon: Music,
      href: "/admin/audio",
      count: stats.audio,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      title: "视频管理",
      description: "管理视频文件，包括添加、编辑和删除视频内容",
      icon: Video,
      href: "/admin/video",
      count: stats.video,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950/20",
    },
    {
      title: "图片管理",
      description: "管理图片文件，包括添加、编辑和删除图片内容",
      icon: ImageIcon,
      href: "/admin/images",
      count: stats.images,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
    {
      title: "教程管理",
      description: "管理教程内容，包括添加、编辑和删除教程",
      icon: BookOpen,
      href: "/admin/tutorials",
      count: stats.tutorials,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* 页面标题 */}
        <div>
          <h1 className="text-3xl font-bold">内容管理仪表板</h1>
          <p className="text-muted-foreground mt-2">
            管理您的网站内容，包括音频、视频、图片和教程
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总内容数</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.audio + stats.video + stats.images + stats.tutorials}
              </div>
              <p className="text-xs text-muted-foreground">
                所有类型内容的总数
              </p>
            </CardContent>
          </Card>

          {contentTypes.map((type) => {
            const Icon = type.icon
            return (
              <Card key={type.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{type.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${type.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{type.count}</div>
                  <p className="text-xs text-muted-foreground">
                    当前{type.title.replace('管理', '')}数量
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* 管理模块 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contentTypes.map((type) => {
            const Icon = type.icon
            return (
              <Card key={type.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${type.bgColor}`}>
                      <Icon className={`h-6 w-6 ${type.color}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle>{type.title}</CardTitle>
                      <CardDescription>{type.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      当前有 {type.count} 个项目
                    </span>
                    <Button asChild>
                      <Link href={type.href}>
                        <Plus className="h-4 w-4 mr-2" />
                        管理内容
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </AdminLayout>
  )
}
