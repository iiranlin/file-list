"use client"

import React from 'react'
import { useLoading } from '@/lib/loading-context'

export function LoadingOverlay() {
  const { isLoading } = useLoading()

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        {/* 主要loading动画 */}
        <div className="relative">
          {/* 外圈旋转 */}
          <div className="w-16 h-16 border-4 border-muted rounded-full animate-spin border-t-primary"></div>
          {/* 内圈反向旋转 */}
          <div className="absolute inset-2 w-12 h-12 border-4 border-muted rounded-full animate-spin-reverse border-b-primary"></div>
          {/* 中心点 */}
          <div className="absolute inset-6 w-4 h-4 bg-primary rounded-full animate-pulse"></div>
        </div>

        {/* 加载文字 */}
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-foreground">页面加载中</p>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 顶部进度条组件
export function TopLoadingBar() {
  const { isLoading } = useLoading()

  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted">
      <div className="h-full bg-gradient-to-r from-primary to-primary/60 animate-loading-bar origin-left"></div>
    </div>
  )
}

// 按钮loading状态
export function ButtonLoading({ children, isLoading: buttonLoading, ...props }: {
  children: React.ReactNode
  isLoading?: boolean
  [key: string]: any
}) {
  const { isLoading: globalLoading } = useLoading()
  const loading = buttonLoading || globalLoading

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`${props.className} ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span>加载中...</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
}
