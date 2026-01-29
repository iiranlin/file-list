"use client"

import React from 'react'
import { useLoading } from '@/lib/loading-context'
import { Loader2 } from "lucide-react"

export function LoadingOverlay() {
  const { isLoading } = useLoading()

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-300">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">Loading...</p>
      </div>
    </div>
  )
}

// 顶部进度条组件
export function TopLoadingBar() {
  const { isLoading } = useLoading()

  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
      <div className="h-full bg-primary animate-loading-bar origin-left"></div>
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
      className={`${props.className} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
}
