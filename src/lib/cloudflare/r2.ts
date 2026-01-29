import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { getR2Config } from './config'
export { getR2Info } from './config'

// 文件类型枚举 (保持与原系统一致)
export enum FileType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
}

// 上传结果接口
export interface UploadResult {
  success: boolean
  url?: string
  key?: string
  error?: string
}

let s3Client: S3Client | null = null

function getS3Client() {
  if (!s3Client) {
    const config = getR2Config()
    s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    })
  }
  return s3Client
}

// 生成文件key（路径）- 复用原逻辑
export function generateFileKey(originalName: string, fileType: FileType): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  const timePrefix = `${year}${month}${day}${hour}${minute}`

  const ext = originalName.split('.').pop()?.toLowerCase() || ''
  // 将空格和特殊字符替换为下划线，避免 URL 问题
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '').replace(/[\s]+/g, '_')

  const typePrefix = {
    [FileType.IMAGE]: 'images',
    [FileType.VIDEO]: 'videos',
    [FileType.AUDIO]: 'audios',
  }[fileType]

  return `fileList/${typePrefix}/${timePrefix}_${nameWithoutExt}.${ext}`
}

// 获取文件的完整URL
export function getFileUrl(key: string): string {
  const config = getR2Config()
  // 确保域名不包含末尾的斜杠，且key不包含开头的斜杠
  const domain = config.publicDomain.replace(/\/$/, '')
  const cleanKey = key.replace(/^\//, '')
  
  // 如果域名已经包含https://，则直接使用，否则添加
  if (domain.startsWith('http')) {
    return `${domain}/${cleanKey}`
  }
  return `https://${domain}/${cleanKey}`
}

// 服务端上传文件
export async function uploadFile(
  fileBuffer: Buffer,
  originalName: string,
  fileType: FileType,
  contentType?: string
): Promise<UploadResult> {
  try {
    const config = getR2Config()
    const client = getS3Client()
    const key = generateFileKey(originalName, fileType)
    
    const command = new PutObjectCommand({
      Bucket: config.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType || 'application/octet-stream',
    })

    await client.send(command)

    return {
      success: true,
      url: getFileUrl(key),
      key,
    }
  } catch (error) {
    console.error('R2 upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '上传失败',
    }
  }
}

// 删除文件
export async function deleteFile(key: string): Promise<{ success: boolean; error?: string }> {
  try {
    const config = getR2Config()
    const client = getS3Client()

    const command = new DeleteObjectCommand({
      Bucket: config.bucketName,
      Key: key,
    })

    await client.send(command)
    return { success: true }
  } catch (error) {
    console.error('R2 delete error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '删除失败',
    }
  }
}

// 获取文件信息
export async function getFileInfo(key: string): Promise<{
  success: boolean
  info?: any
  error?: string
}> {
  try {
    const config = getR2Config()
    const client = getS3Client()

    const command = new HeadObjectCommand({
      Bucket: config.bucketName,
      Key: key,
    })

    const response = await client.send(command)
    return {
      success: true,
      info: response,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '获取文件信息失败',
    }
  }
}
