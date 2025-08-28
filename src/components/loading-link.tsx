"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLoading } from '@/lib/loading-context'

interface LoadingLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function LoadingLink({ href, children, className, onClick }: LoadingLinkProps) {
  const { startLoading } = useLoading()
  const pathname = usePathname()

  const handleClick = (e: React.MouseEvent) => {
    // 如果是当前页面，不需要loading
    if (pathname === href) {
      e.preventDefault()
      return
    }

    // 启动loading动画
    startLoading()
    
    // 执行自定义点击事件
    onClick?.()
  }

  return (
    <Link
      href={href}
      className={`${className} transition-all duration-200 hover:scale-105 active:scale-95`}
      onClick={handleClick}
    >
      {children}
    </Link>
  )
}

// 导航按钮组件
export function LoadingButton({ 
  href, 
  children, 
  className = "", 
  variant = "default",
  onClick 
}: {
  href: string
  children: React.ReactNode
  className?: string
  variant?: "default" | "ghost" | "outline"
  onClick?: () => void
}) {
  const { startLoading, isLoading } = useLoading()
  const pathname = usePathname()

  const handleClick = (e: React.MouseEvent) => {
    if (pathname === href) {
      e.preventDefault()
      return
    }

    startLoading()
    onClick?.()
  }

  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
  
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95",
    ghost: "hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95"
  }

  return (
    <Link
      href={href}
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${isLoading ? 'animate-pulse' : ''}`}
      onClick={handleClick}
    >
      {isLoading && pathname !== href ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span>加载中...</span>
        </div>
      ) : (
        children
      )}
    </Link>
  )
}
