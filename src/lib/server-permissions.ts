// 服务端权限检查工具 - 只能在服务端使用
import { NextRequest } from 'next/server'
import { authService } from './db/services'

export type Permission = 'read' | 'write' | 'delete'

export interface PermissionResult {
  hasPermission: boolean
  message: string
  user?: {
    id: number
    userName: string
    role: string
  }
}

// 从请求头中获取用户信息
export function getUserFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return null
  
  try {
    const token = authHeader.replace('Bearer ', '')
    const decoded = atob(token)
    const [userName] = decoded.split(':')
    return userName
  } catch {
    return null
  }
}

// 检查API权限 - 服务端专用
export async function checkApiPermission(
  request: NextRequest, 
  requiredPermission: Permission
): Promise<PermissionResult> {
  const userName = getUserFromRequest(request)
  
  if (!userName) {
    return {
      hasPermission: false,
      message: '非管理员不允许操作'
    }
  }

  const result = await authService.checkPermission(userName, requiredPermission)
  
  if (result.hasPermission) {
    const user = await authService.getByUserName(userName)
    return {
      hasPermission: true,
      message: result.message,
      user: user ? {
        id: user.id,
        userName: user.userName,
        role: user.role || 'user'
      } : undefined
    }
  }

  return {
    hasPermission: false,
    message: result.message
  }
}

// 权限装饰器函数
export function withPermission(permission: Permission) {
  return function(handler: (request: NextRequest, context: any) => Promise<Response>) {
    return async function(request: NextRequest, context: any) {
      const permissionResult = await checkApiPermission(request, permission)
      
      if (!permissionResult.hasPermission) {
        return new Response(
          JSON.stringify({ 
            error: permissionResult.message,
            code: 'PERMISSION_DENIED'
          }), 
          { 
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }

      // 将用户信息添加到请求上下文中
      ;(request as any).user = permissionResult.user
      
      return handler(request, context)
    }
  }
}
