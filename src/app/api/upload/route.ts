import { NextRequest, NextResponse } from 'next/server'
import { uploadFile, FileType, getUploadToken, generateFileKey, getFileUrl } from '@/lib/qiniu/upload'
import { checkApiPermission } from '@/lib/server-permissions'

// 获取上传凭证的API
export async function GET(request: NextRequest) {
  try {
    // 检查写入权限 - 上传文件需要写入权限
    const permissionResult = await checkApiPermission(request, 'write')
    if (!permissionResult.hasPermission) {
      return NextResponse.json({
        error: permissionResult.message,
        code: 'PERMISSION_DENIED'
      }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const fileType = searchParams.get('type') as FileType
    const fileName = searchParams.get('fileName')

    if (!fileType || !Object.values(FileType).includes(fileType)) {
      return NextResponse.json(
        { error: '无效的文件类型' },
        { status: 400 }
      )
    }

    if (!fileName) {
      return NextResponse.json(
        { error: '缺少文件名' },
        { status: 400 }
      )
    }

    // 生成文件key和上传凭证
    const key = generateFileKey(fileName, fileType)
    const uploadToken = getUploadToken(key)
    const previewUrl = getFileUrl(key)

    return NextResponse.json({
      uploadToken,
      key,
      previewUrl,
    })
  } catch (error) {
    console.error('获取上传凭证失败:', error)
    return NextResponse.json(
      { error: '获取上传凭证失败' },
      { status: 500 }
    )
  }
}

// 服务端文件上传API
export async function POST(request: NextRequest) {
  try {
    // 检查写入权限 - 上传文件需要写入权限
    const permissionResult = await checkApiPermission(request, 'write')
    if (!permissionResult.hasPermission) {
      return NextResponse.json({
        error: permissionResult.message,
        code: 'PERMISSION_DENIED'
      }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const fileType = formData.get('type') as FileType

    if (!file) {
      return NextResponse.json(
        { error: '未找到文件' },
        { status: 400 }
      )
    }

    if (!fileType || !Object.values(FileType).includes(fileType)) {
      return NextResponse.json(
        { error: '无效的文件类型' },
        { status: 400 }
      )
    }

    // 验证文件大小（最大100MB）
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '文件大小不能超过100MB' },
        { status: 400 }
      )
    }

    // 验证文件类型
    const allowedTypes = {
      [FileType.IMAGE]: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      [FileType.VIDEO]: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi'],
      [FileType.AUDIO]: ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/mpeg'],
    }

    if (!allowedTypes[fileType].includes(file.type)) {
      return NextResponse.json(
        { error: `不支持的${fileType}文件类型: ${file.type}` },
        { status: 400 }
      )
    }

    // 转换文件为Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 上传到七牛云
    const result = await uploadFile(buffer, file.name, fileType)

    if (result.success) {
      return NextResponse.json({
        success: true,
        url: result.url,
        key: result.key,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      })
    } else {
      return NextResponse.json(
        { error: result.error || '上传失败' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('文件上传失败:', error)
    return NextResponse.json(
      { error: '文件上传失败' },
      { status: 500 }
    )
  }
}
