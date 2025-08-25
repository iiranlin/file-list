import { NextRequest, NextResponse } from 'next/server'
import { generateFileKey, getFileUrl, FileType } from '@/lib/qiniu/upload'

// 测试文件路径生成的API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileName = searchParams.get('fileName') || 'test-file.jpg'
    const fileType = (searchParams.get('type') as FileType) || FileType.IMAGE

    if (!Object.values(FileType).includes(fileType)) {
      return NextResponse.json(
        { error: '无效的文件类型' },
        { status: 400 }
      )
    }

    // 生成文件路径和URL
    const key = generateFileKey(fileName, fileType)
    const url = getFileUrl(key)

    // 获取当前时间信息
    const now = new Date()
    const timeInfo = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
      hour: now.getHours(),
      minute: now.getMinutes(),
      timestamp: `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`
    }

    return NextResponse.json({
      success: true,
      input: {
        fileName,
        fileType,
      },
      output: {
        key,
        url,
        timeInfo,
      },
      pathStructure: {
        root: 'fileList',
        typeFolder: {
          [FileType.IMAGE]: 'images',
          [FileType.VIDEO]: 'videos',
          [FileType.AUDIO]: 'audios',
        }[fileType],
        fullPath: key,
      },
      examples: [
        {
          type: 'image',
          fileName: 'photo.jpg',
          expectedPath: `fileList/images/${timeInfo.timestamp}_photo.jpg`,
        },
        {
          type: 'video',
          fileName: 'movie.mp4',
          expectedPath: `fileList/videos/${timeInfo.timestamp}_movie.mp4`,
        },
        {
          type: 'audio',
          fileName: 'song.mp3',
          expectedPath: `fileList/audios/${timeInfo.timestamp}_song.mp3`,
        },
      ],
    })
  } catch (error) {
    console.error('测试文件路径生成失败:', error)
    return NextResponse.json(
      { error: '测试失败' },
      { status: 500 }
    )
  }
}
