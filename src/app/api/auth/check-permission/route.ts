import { NextRequest, NextResponse } from 'next/server'
import { checkApiPermission } from '@/lib/server-permissions'
import type { Permission } from '@/lib/server-permissions'

export async function POST(request: NextRequest) {
  try {
    const { permission } = await request.json()

    if (!permission || !['read', 'write', 'delete'].includes(permission)) {
      return NextResponse.json(
        { error: '无效的权限类型' },
        { status: 400 }
      )
    }

    const result = await checkApiPermission(request, permission as Permission)

    return NextResponse.json({
      hasPermission: result.hasPermission,
      message: result.message,
      user: result.user,
    })
  } catch (error) {
    console.error('权限检查失败:', error)
    return NextResponse.json(
      { error: '权限检查失败' },
      { status: 500 }
    )
  }
}
