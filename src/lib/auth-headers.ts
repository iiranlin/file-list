/**
 * 统一的认证头工具函数
 * 确保所有API请求使用正确的认证头
 */

import { getAuthUser } from './auth'

/**
 * 获取API请求的认证头
 * @returns 包含Authorization头的对象
 */
export function getAuthHeaders(): Record<string, string> {
  const user = getAuthUser()
  if (!user || !user.userName) {
    return {}
  }

  // 生成认证token
  const token = btoa(`${user.userName}:${user.id}:${Date.now()}`)
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

/**
 * 检查是否有有效的认证信息
 * @returns 是否已认证
 */
export function hasValidAuth(): boolean {
  const user = getAuthUser()
  return !!(user && user.userName && user.id)
}

/**
 * 获取当前认证用户的基本信息
 * @returns 用户基本信息或null
 */
export function getAuthUserInfo() {
  const user = getAuthUser()
  if (!user) return null
  
  return {
    id: user.id,
    userName: user.userName,
    role: user.role,
    displayName: user.displayName,
    email: user.email,
  }
}
