import { promises as fs } from 'fs'
import path from 'path'

// 类型定义
export interface AudioFile {
  id: number
  title: string
  artist: string
  duration: string
  genre: string
  src: string
  description: string
}

export interface VideoFile {
  id: number
  title: string
  description: string
  duration: string
  category: string
  thumbnail: string
  src: string
  views: string
  uploadDate: string
}

export interface ImageFile {
  id: number
  title: string
  description: string
  src: string
  category: string
  tags: string[]
  uploadDate: string
  dimensions: string
}

export interface Tutorial {
  id: number
  title: string
  excerpt: string
  content: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  readTime: string
  author: string
  publishDate: string
  tags: string[]
}

// 数据加载函数
export async function loadAudioData(): Promise<AudioFile[]> {
  const filePath = path.join(process.cwd(), 'src/data/audio.json')
  const fileContents = await fs.readFile(filePath, 'utf8')
  return JSON.parse(fileContents)
}

export async function loadVideoData(): Promise<VideoFile[]> {
  const filePath = path.join(process.cwd(), 'src/data/videos.json')
  const fileContents = await fs.readFile(filePath, 'utf8')
  return JSON.parse(fileContents)
}

export async function loadImageData(): Promise<ImageFile[]> {
  const filePath = path.join(process.cwd(), 'src/data/images.json')
  const fileContents = await fs.readFile(filePath, 'utf8')
  return JSON.parse(fileContents)
}

export async function loadTutorialData(): Promise<Tutorial[]> {
  const filePath = path.join(process.cwd(), 'src/data/tutorials.json')
  const fileContents = await fs.readFile(filePath, 'utf8')
  return JSON.parse(fileContents)
}
