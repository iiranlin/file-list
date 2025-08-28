import { NextRequest, NextResponse } from 'next/server'
import { imageService } from '@/lib/db/services'
import { checkApiPermission } from '@/lib/server-permissions'

export async function GET() {
  try {
    // 读取权限不限制，所有用户都可以访问
    const data = await imageService.getAll()
    // 将数据库中的tags JSON字符串转换为数组
    const formattedData = data.map(item => ({
      ...item,
      tags: JSON.parse(item.tags)
    }))
    return NextResponse.json(formattedData)
  } catch (error) {
    console.error('Failed to load image data:', error)
    return NextResponse.json({ error: 'Failed to load image data' }, { status: 500 })
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

    // 处理标签：如果是字符串则分割，如果是数组则直接使用
    const tags = Array.isArray(body.tags)
      ? body.tags
      : body.tags.split(',').map((tag: string) => tag.trim())

    const newItem = await imageService.create({
      title: body.title,
      description: body.description,
      src: body.src,
      category: body.category,
      tags: JSON.stringify(tags), // 存储为JSON字符串
      uploadDate: body.uploadDate,
      dimensions: body.dimensions,
    })

    // 返回时将tags转换为数组
    const formattedItem = {
      ...newItem,
      tags: JSON.parse(newItem.tags)
    }

    return NextResponse.json(formattedItem, { status: 201 })
  } catch (error) {
    console.error('Failed to create image item:', error)
    return NextResponse.json({ error: 'Failed to create image item' }, { status: 500 })
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

    // 处理标签：如果是字符串则分割，如果是数组则直接使用
    const tags = Array.isArray(body.tags)
      ? body.tags
      : body.tags.split(',').map((tag: string) => tag.trim())

    const updatedItem = await imageService.update(body.id, {
      title: body.title,
      description: body.description,
      src: body.src,
      category: body.category,
      tags: JSON.stringify(tags), // 存储为JSON字符串
      uploadDate: body.uploadDate,
      dimensions: body.dimensions,
    })

    if (!updatedItem) {
      return NextResponse.json({ error: 'Image item not found' }, { status: 404 })
    }

    // 返回时将tags转换为数组
    const formattedItem = {
      ...updatedItem,
      tags: JSON.parse(updatedItem.tags)
    }

    return NextResponse.json(formattedItem)
  } catch (error) {
    console.error('Failed to update image item:', error)
    return NextResponse.json({ error: 'Failed to update image item' }, { status: 500 })
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

    const deletedItem = await imageService.delete(id)

    if (!deletedItem) {
      return NextResponse.json({ error: 'Image item not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete image item:', error)
    return NextResponse.json({ error: 'Failed to delete image item' }, { status: 500 })
  }
}
