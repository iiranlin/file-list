import { promises as fs } from 'fs'
import path from 'path'
import { audioService, videoService, imageService, tutorialService } from './db/services'

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

// 数据加载函数 - 优先使用数据库，如果失败则使用JSON文件
export async function loadAudioData(): Promise<AudioFile[]> {
  try {
    // 尝试从数据库加载
    const data = await audioService.getAll()
    return data.map(item => ({
      id: item.id,
      title: item.title,
      artist: item.artist,
      duration: item.duration,
      genre: item.genre,
      src: item.src,
      description: item.description || '',
    }))
  } catch (error) {
    console.warn('Failed to load from database, falling back to JSON:', error)
    // 如果数据库失败，回退到JSON文件
    const filePath = path.join(process.cwd(), 'src/data/audio.json')
    const fileContents = await fs.readFile(filePath, 'utf8')
    return JSON.parse(fileContents)
  }
}

export async function loadVideoData(): Promise<VideoFile[]> {
  try {
    // 尝试从数据库加载
    const data = await videoService.getAll()
    return data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      duration: item.duration,
      category: item.category,
      thumbnail: item.thumbnail,
      src: item.src,
      views: item.views,
      uploadDate: item.uploadDate,
    }))
  } catch (error) {
    console.warn('Failed to load from database, falling back to JSON:', error)
    // 如果数据库失败，回退到JSON文件
    const filePath = path.join(process.cwd(), 'src/data/videos.json')
    const fileContents = await fs.readFile(filePath, 'utf8')
    return JSON.parse(fileContents)
  }
}

export async function loadImageData(): Promise<ImageFile[]> {
  try {
    // 尝试从数据库加载
    const data = await imageService.getAll()
    return data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      src: item.src,
      category: item.category,
      tags: JSON.parse(item.tags), // 将JSON字符串转换为数组
      uploadDate: item.uploadDate,
      dimensions: item.dimensions,
    }))
  } catch (error) {
    console.warn('Failed to load from database, falling back to JSON:', error)
    // 如果数据库失败，回退到JSON文件
    const filePath = path.join(process.cwd(), 'src/data/images.json')
    const fileContents = await fs.readFile(filePath, 'utf8')
    return JSON.parse(fileContents)
  }
}

export async function loadTutorialData(): Promise<Tutorial[]> {
  try {
    // 尝试从数据库加载
    const data = await tutorialService.getAll()
    return data.map(item => ({
      id: item.id,
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      category: item.category,
      difficulty: item.difficulty as "Beginner" | "Intermediate" | "Advanced",
      readTime: item.readTime,
      author: item.author,
      publishDate: item.publishDate,
      tags: JSON.parse(item.tags), // 将JSON字符串转换为数组
    }))
  } catch (error) {
    console.warn('Failed to load from database, falling back to JSON:', error)
    // 如果数据库失败，回退到JSON文件
    const filePath = path.join(process.cwd(), 'src/data/tutorials.json')
    const fileContents = await fs.readFile(filePath, 'utf8')
    return JSON.parse(fileContents)
  }
}
