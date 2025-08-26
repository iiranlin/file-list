"use client"

// TOTP认证管理
const AUTH_TOKEN_KEY = 'totp_auth_token'
const AUTH_USER_KEY = 'totp_auth_user'

export interface AuthUser {
  id: number
  userName: string
}

export function setAuthToken(user: AuthUser): void {
  if (typeof window === 'undefined') return

  // 生成包含用户信息和时间戳的token
  const token = btoa(`${user.userName}:${user.id}:${Date.now()}`)
  localStorage.setItem(AUTH_TOKEN_KEY, token)
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export function logout(): void {
  if (typeof window === 'undefined') return

  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false

  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  const user = localStorage.getItem(AUTH_USER_KEY)

  return !!(token && user)
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') return null

  const userStr = localStorage.getItem(AUTH_USER_KEY)
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}
