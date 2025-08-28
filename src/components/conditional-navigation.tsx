"use client"

import { usePathname } from "next/navigation"
import { Navigation } from "@/components/navigation"

/**
 * 条件导航组件
 * 在特定路径下隐藏主导航栏，其他页面显示
 */
export function ConditionalNavigation() {
  const pathname = usePathname()

  // 定义需要隐藏导航栏的路径
  const hideNavPaths = [
    '/admin',    // admin管理系统
    '/auth',     // 认证页面
  ]

  // 检查当前路径是否需要隐藏导航栏
  const shouldHideNav = hideNavPaths.some(path => pathname.startsWith(path))

  // 如果需要隐藏导航栏，不渲染
  if (shouldHideNav) {
    return null
  }

  // 其他路径显示正常导航栏
  return <Navigation />
}
