"use client"

// 简单的认证管理
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
}

const AUTH_TOKEN_KEY = 'admin_auth_token'

export function login(username: string, password: string): boolean {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    // 生成简单的token（实际项目中应该使用更安全的方式）
    const token = btoa(`${username}:${Date.now()}`)
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    return true
  }
  return false
}

export function logout(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  return !!token
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(AUTH_TOKEN_KEY)
}
