import { NextResponse } from 'next/server'
import { audioService, videoService, imageService, tutorialService } from '@/lib/db/services'

export async function GET() {
  try {
    // 检查数据库连接和数据统计
    const [audioCount, videoCount, imageCount, tutorialCount] = await Promise.all([
      audioService.getAll().then(data => data.length),
      videoService.getAll().then(data => data.length),
      imageService.getAll().then(data => data.length),
      tutorialService.getAll().then(data => data.length),
    ])

    return NextResponse.json({
      database: {
        connected: true,
        status: 'healthy',
      },
      data: {
        audio: audioCount,
        video: videoCount,
        images: imageCount,
        tutorials: tutorialCount,
        total: audioCount + videoCount + imageCount + tutorialCount,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Database status check failed:', error)
    
    return NextResponse.json({
      database: {
        connected: false,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      data: {
        audio: 0,
        video: 0,
        images: 0,
        tutorials: 0,
        total: 0,
      },
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}
