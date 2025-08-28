"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  Shield,
  Music,
  Video,
  Image as ImageIcon,
  BookOpen,
  Database,
  Key,
  LogOut,
  Menu,
  X
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { isAuthenticated, logout } from "@/lib/auth"
import { cn } from "@/lib/utils"

const navigation = [
  {
    name: "音频管理",
    href: "/admin/audio",
    icon: Music,
  },
  {
    name: "视频管理",
    href: "/admin/video",
    icon: Video,
  },
  {
    name: "图片管理",
    href: "/admin/images",
    icon: ImageIcon,
  },
  {
    name: "教程管理",
    href: "/admin/tutorials",
    icon: BookOpen,
  },
  {
    name: "用户管理",
    href: "/admin/users",
    icon: Key,
  },
  {
    name: "数据库迁移",
    href: "/admin/migrate",
    icon: Database,
  },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // 客户端水合完成后检查认证状态
  useEffect(() => {
    setIsClient(true)
    const authStatus = isAuthenticated()
    setAuthenticated(authStatus)

    if (!authStatus) {
      router.push("/auth")
    }
  }, [router])

  const handleLogout = () => {
    logout()
    router.push("/auth")
  }

  // 服务端渲染时显示加载状态，避免水合错误
  if (!isClient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // 客户端未认证时显示加载状态
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">正在验证身份...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-center">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">内容管理系统</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              返回网站
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              退出登录
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* 侧边栏 */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex flex-col h-full pt-16 md:pt-0">
            <nav className="flex-1 p-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* 主内容区域 */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {/* 移动端遮罩 */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  )
}
