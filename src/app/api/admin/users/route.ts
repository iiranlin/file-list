import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/db/services'
import { checkApiPermission } from '@/lib/server-permissions'

export async function GET() {
  try {
    // 读取权限不限制，所有用户都可以访问
    const data = await authService.getAll()
    return NextResponse.json({
      data,
      user: null // 由于不再检查权限，用户信息设为null
    })
  } catch (error) {
    console.error('Failed to load users:', error)
    return NextResponse.json({ error: 'Failed to load users' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // 检查写入权限
    const permissionResult = await checkApiPermission(request, 'write')
    if (!permissionResult.hasPermission) {
      return NextResponse.json({
        error: permissionResult.message,
        code: 'PERMISSION_DENIED'
      }, { status: 403 })
    }

    const body = await request.json()

    const newItem = await authService.create({
      userName: body.userName,
      userCode: body.userCode || 'temp',
      systemCode: body.systemCode || 'temp',
      totpSecret: body.totpSecret,
      role: body.role || 'user',
      displayName: body.displayName,
      email: body.email,
      avatar: body.avatar,
      bio: body.bio,
      isActive: body.isActive ?? 1,
    })

    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    console.error('Failed to create user:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // 检查写入权限
    const permissionResult = await checkApiPermission(request, 'write')
    if (!permissionResult.hasPermission) {
      return NextResponse.json({
        error: permissionResult.message,
        code: 'PERMISSION_DENIED'
      }, { status: 403 })
    }

    const body = await request.json()

    const updatedItem = await authService.update(body.id, {
      userName: body.userName,
      userCode: body.userCode,
      systemCode: body.systemCode,
      totpSecret: body.totpSecret,
      role: body.role,
      displayName: body.displayName,
      email: body.email,
      avatar: body.avatar,
      bio: body.bio,
      isActive: body.isActive,
    })

    if (!updatedItem) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error('Failed to update user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // 检查删除权限
    const permissionResult = await checkApiPermission(request, 'delete')
    if (!permissionResult.hasPermission) {
      return NextResponse.json({
        error: permissionResult.message,
        code: 'PERMISSION_DENIED'
      }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = parseInt(searchParams.get('id') || '0')

    const deletedItem = await authService.delete(id)

    if (!deletedItem) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete user:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
