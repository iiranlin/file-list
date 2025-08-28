// 客户端权限检查工具 - 不依赖数据库连接

export type Permission = 'read' | 'write' | 'delete'

// 客户端权限检查（用于前端组件）
export interface ClientUser {
  id: number
  userName: string
  role: string
}

export function hasPermission(user: ClientUser | null, permission: Permission): boolean {
  if (!user) return false
  
  // 管理员拥有所有权限
  if (user.role === 'admin') return true
  
  // 普通用户只有读取权限
  return permission === 'read'
}

export function isAdmin(user: ClientUser | null): boolean {
  return user?.role === 'admin'
}
