import { promises as fs } from 'fs'
import path from 'path'
import type { AudioFile, VideoFile, ImageFile, Tutorial } from './data-loader'

// 保存数据到JSON文件的函数
export async function saveAudioData(data: AudioFile[]): Promise<void> {
  const filePath = path.join(process.cwd(), 'src/data/audio.json')
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')
}

export async function saveVideoData(data: VideoFile[]): Promise<void> {
  const filePath = path.join(process.cwd(), 'src/data/videos.json')
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')
}

export async function saveImageData(data: ImageFile[]): Promise<void> {
  const filePath = path.join(process.cwd(), 'src/data/images.json')
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')
}

export async function saveTutorialData(data: Tutorial[]): Promise<void> {
  const filePath = path.join(process.cwd(), 'src/data/tutorials.json')
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')
}

// 生成新ID的辅助函数
export function generateNewId<T extends { id: number }>(items: T[]): number {
  if (items.length === 0) return 1
  return Math.max(...items.map(item => item.id)) + 1
}
