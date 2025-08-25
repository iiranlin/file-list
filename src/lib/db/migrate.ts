import { db } from './connection'
import { audioService, videoService, imageService, tutorialService } from './services'
import { promises as fs } from 'fs'
import path from 'path'

// 直接从JSON文件读取数据的函数
async function loadJSONData<T>(filename: string): Promise<T[]> {
  const filePath = path.join(process.cwd(), `src/data/${filename}`)
  const fileContents = await fs.readFile(filePath, 'utf8')
  return JSON.parse(fileContents)
}

// 数据迁移函数
export async function migrateFromJSON() {
  try {
    console.log('开始从JSON文件迁移数据到PostgreSQL...')

    // 迁移音频数据
    console.log('迁移音频数据...')
    const audioData = await loadJSONData<any>('audio.json')
    for (const audio of audioData) {
      await audioService.create({
        title: audio.title,
        artist: audio.artist,
        duration: audio.duration,
        genre: audio.genre,
        src: audio.src,
        description: audio.description,
      })
    }
    console.log(`已迁移 ${audioData.length} 个音频文件`)

    // 迁移视频数据
    console.log('迁移视频数据...')
    const videoData = await loadJSONData<any>('videos.json')
    for (const video of videoData) {
      await videoService.create({
        title: video.title,
        description: video.description,
        duration: video.duration,
        category: video.category,
        thumbnail: video.thumbnail,
        src: video.src,
        views: video.views,
        uploadDate: video.uploadDate,
      })
    }
    console.log(`已迁移 ${videoData.length} 个视频文件`)

    // 迁移图片数据
    console.log('迁移图片数据...')
    const imageData = await loadJSONData<any>('images.json')
    for (const image of imageData) {
      await imageService.create({
        title: image.title,
        description: image.description,
        src: image.src,
        category: image.category,
        tags: JSON.stringify(image.tags), // 将数组转换为JSON字符串
        uploadDate: image.uploadDate,
        dimensions: image.dimensions,
      })
    }
    console.log(`已迁移 ${imageData.length} 个图片文件`)

    // 迁移教程数据
    console.log('迁移教程数据...')
    const tutorialData = await loadJSONData<any>('tutorials.json')
    for (const tutorial of tutorialData) {
      await tutorialService.create({
        title: tutorial.title,
        excerpt: tutorial.excerpt,
        content: tutorial.content,
        category: tutorial.category,
        difficulty: tutorial.difficulty,
        readTime: tutorial.readTime,
        author: tutorial.author,
        publishDate: tutorial.publishDate,
        tags: JSON.stringify(tutorial.tags), // 将数组转换为JSON字符串
      })
    }
    console.log(`已迁移 ${tutorialData.length} 个教程`)

    console.log('数据迁移完成！')
  } catch (error) {
    console.error('数据迁移失败:', error)
    throw error
  }
}

// 清空所有表数据
export async function clearAllData() {
  try {
    console.log('清空所有表数据...')

    const { audioFiles, videoFiles, imageFiles, tutorials } = await import('./schema')

    // 注意：由于有外键约束，需要按正确顺序删除
    await db.delete(audioFiles)
    await db.delete(videoFiles)
    await db.delete(imageFiles)
    await db.delete(tutorials)

    console.log('所有数据已清空')
  } catch (error) {
    console.error('清空数据失败:', error)
    throw error
  }
}
