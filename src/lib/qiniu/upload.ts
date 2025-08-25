import * as qiniu from 'qiniu'
import { getQiniuConfig } from './config'

// 文件类型枚举
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

// 获取上传凭证
export function getUploadToken(key?: string): string {
  const config = getQiniuConfig()
  
  const mac = new qiniu.auth.digest.Mac(config.accessKey, config.secretKey)
  
  const options: qiniu.rs.PutPolicyOptions = {
    scope: key ? `${config.bucketName}:${key}` : config.bucketName,
    expires: 3600, // 1小时过期
  }
  
  const putPolicy = new qiniu.rs.PutPolicy(options)
  return putPolicy.uploadToken(mac)
}

// 生成文件key（路径）
export function generateFileKey(originalName: string, fileType: FileType): string {
  // 获取当前时间，格式：年月日时分 (YYYYMMDDHHMM)
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  const timePrefix = `${year}${month}${day}${hour}${minute}`

  // 获取文件扩展名
  const ext = originalName.split('.').pop()?.toLowerCase() || ''

  // 获取不带扩展名的文件名
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '')

  // 根据文件类型生成不同的路径前缀
  const typePrefix = {
    [FileType.IMAGE]: 'images',
    [FileType.VIDEO]: 'videos',
    [FileType.AUDIO]: 'audios',
  }[fileType]

  // 生成最终的文件路径：fileList/类型/年月日时分_原文件名.扩展名
  return `fileList/${typePrefix}/${timePrefix}_${nameWithoutExt}.${ext}`
}

// 获取文件的完整URL
export function getFileUrl(key: string): string {
  const config = getQiniuConfig()
  return `${config.cdnDomain}/${key}`
}

// 服务端上传文件（用于API路由）
export async function uploadFile(
  fileBuffer: Buffer,
  originalName: string,
  fileType: FileType
): Promise<UploadResult> {
  try {
    const config = getQiniuConfig()
    const key = generateFileKey(originalName, fileType)
    const uploadToken = getUploadToken(key)
    
    const formUploader = new qiniu.form_up.FormUploader(new qiniu.conf.Config())
    const putExtra = new qiniu.form_up.PutExtra()
    
    return new Promise((resolve) => {
      formUploader.put(
        uploadToken,
        key,
        fileBuffer,
        putExtra,
        (respErr, respBody, respInfo) => {
          if (respErr) {
            resolve({
              success: false,
              error: respErr.message,
            })
            return
          }
          
          if (respInfo.statusCode === 200) {
            const url = getFileUrl(key)
            resolve({
              success: true,
              url,
              key,
            })
          } else {
            resolve({
              success: false,
              error: `上传失败，状态码: ${respInfo.statusCode}`,
            })
          }
        }
      )
    })
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '上传失败',
    }
  }
}

// 删除文件
export async function deleteFile(key: string): Promise<{ success: boolean; error?: string }> {
  try {
    const config = getQiniuConfig()
    const mac = new qiniu.auth.digest.Mac(config.accessKey, config.secretKey)
    const bucketManager = new qiniu.rs.BucketManager(mac, new qiniu.conf.Config())
    
    return new Promise((resolve) => {
      bucketManager.delete(config.bucketName, key, (err, respBody, respInfo) => {
        if (err) {
          resolve({
            success: false,
            error: err.message,
          })
          return
        }
        
        if (respInfo.statusCode === 200) {
          resolve({ success: true })
        } else {
          resolve({
            success: false,
            error: `删除失败，状态码: ${respInfo.statusCode}`,
          })
        }
      })
    })
  } catch (error) {
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
    const config = getQiniuConfig()
    const mac = new qiniu.auth.digest.Mac(config.accessKey, config.secretKey)
    const bucketManager = new qiniu.rs.BucketManager(mac, new qiniu.conf.Config())
    
    return new Promise((resolve) => {
      bucketManager.stat(config.bucketName, key, (err, respBody, respInfo) => {
        if (err) {
          resolve({
            success: false,
            error: err.message,
          })
          return
        }
        
        if (respInfo.statusCode === 200) {
          resolve({
            success: true,
            info: respBody,
          })
        } else {
          resolve({
            success: false,
            error: `获取文件信息失败，状态码: ${respInfo.statusCode}`,
          })
        }
      })
    })
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '获取文件信息失败',
    }
  }
}
