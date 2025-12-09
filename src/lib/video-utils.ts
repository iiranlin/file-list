/**
 * 视频URL验证和处理工具
 */

export interface VideoValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  suggestions: string[]
}

/**
 * 验证视频URL是否有效
 */
export function validateVideoUrl(url: string): VideoValidationResult {
  const result: VideoValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    suggestions: []
  }

  // 基本URL格式检查
  try {
    new URL(url)
  } catch {
    result.isValid = false
    result.errors.push('URL格式无效')
    return result
  }

  const urlObj = new URL(url)

  // 检查协议
  if (urlObj.protocol !== 'https:' && urlObj.protocol !== 'http:') {
    result.isValid = false
    result.errors.push('URL必须使用HTTP或HTTPS协议')
  }

  // 检查是否是HTTPS（推荐）
  if (urlObj.protocol === 'http:') {
    result.warnings.push('建议使用HTTPS协议以确保安全性')
  }

  // 检查文件扩展名
  const pathname = urlObj.pathname.toLowerCase()
  const supportedExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi']
  const hasValidExtension = supportedExtensions.some(ext => pathname.endsWith(ext))
  
  if (!hasValidExtension) {
    result.warnings.push('URL没有常见的视频文件扩展名，可能无法播放')
    result.suggestions.push('确保视频文件是MP4、WebM或其他支持的格式')
  }

  // 检查是否是七牛云或通过R2的域名
  if (urlObj.hostname.includes('qiniu') || urlObj.hostname.includes('clouddn') || urlObj.hostname.includes('r2.cloudflarestorage.com')) {
    // 允许通过
  }

  // 检查是否有查询参数（可能是处理参数）
  if (urlObj.search) {
    result.suggestions.push('URL包含查询参数，可能是视频处理参数')
  }

  return result
}

/**
 * 生成视频缩略图URL
 * 注意：Cloudflare R2 不支持动态视频截帧，此函数仅对七牛云URL有效，或者返回原视频URL作为兜底
 */
export function generateThumbnailUrl(videoUrl: string, options: {
  offset?: number // 截取时间点（秒）
  width?: number
  height?: number
  format?: 'jpg' | 'png'
} = {}): string | null {
  const { offset = 1, width, height, format = 'jpg' } = options

  try {
    const url = new URL(videoUrl)
    
    // 只有七牛云和特定的CDN支持动态截帧
    if (url.hostname.includes('qiniu') || url.hostname.includes('clouddn')) {
      let params = `vframe/${format}/offset/${offset}`
      
      if (width && height) {
        params += `/w/${width}/h/${height}`
      } else if (width) {
        params += `/w/${width}`
      } else if (height) {
        params += `/h/${height}`
      }

      // 如果已有查询参数，附加到后面；否则作为新的查询参数
      if (url.search) {
        url.search += `&${params}` 
      } else {
        url.search = params
      }
      return url.toString()
    }
    
    // 对于不支持动态截帧的存储（如R2），返回null，由前端处理（显示占位符或尝试加载视频首帧）
    return null
    
  } catch {
    return null
  }
}

/**
 * @deprecated Use generateThumbnailUrl instead
 */
export function generateQiniuThumbnail(videoUrl: string, options: any = {}): string {
   const result = generateThumbnailUrl(videoUrl, options);
   return result || videoUrl; // 保持向后兼容，如果无法生成缩略图则返回原URL
}

/**
 * 检查视频URL是否可访问
 */
export async function checkVideoAccessibility(url: string): Promise<{
  accessible: boolean
  status?: number
  error?: string
  contentType?: string
  contentLength?: number
}> {
  try {
    const response = await fetch(url, {
      method: 'HEAD', // 只获取头部信息
      mode: 'cors'
    })

    return {
      accessible: response.ok,
      status: response.status,
      contentType: response.headers.get('content-type') || undefined,
      contentLength: parseInt(response.headers.get('content-length') || '0') || undefined
    }
  } catch (error) {
    return {
      accessible: false,
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}

/**
 * 获取视频元数据（需要在浏览器环境中使用）
 */
export function getVideoMetadata(videoElement: HTMLVideoElement): Promise<{
  duration: number
  width: number
  height: number
  hasAudio: boolean
  hasVideo: boolean
}> {
  return new Promise((resolve, reject) => {
    const onLoadedMetadata = () => {
      videoElement.removeEventListener('loadedmetadata', onLoadedMetadata)
      videoElement.removeEventListener('error', onError)

      resolve({
        duration: videoElement.duration,
        width: videoElement.videoWidth,
        height: videoElement.videoHeight,
        hasAudio: videoElement.mozHasAudio || Boolean(videoElement.webkitAudioDecodedByteCount),
        hasVideo: videoElement.videoWidth > 0 && videoElement.videoHeight > 0
      })
    }

    const onError = () => {
      videoElement.removeEventListener('loadedmetadata', onLoadedMetadata)
      videoElement.removeEventListener('error', onError)
      reject(new Error('无法获取视频元数据'))
    }

    videoElement.addEventListener('loadedmetadata', onLoadedMetadata)
    videoElement.addEventListener('error', onError)

    // 如果元数据已经加载
    if (videoElement.readyState >= 1) {
      onLoadedMetadata()
    }
  })
}

/**
 * 格式化视频时长
 */
export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }
}

/**
 * 检查浏览器视频格式支持
 */
export function checkVideoFormatSupport(): {
  mp4: boolean
  webm: boolean
  ogg: boolean
} {
  const video = document.createElement('video')
  
  return {
    mp4: video.canPlayType('video/mp4') !== '',
    webm: video.canPlayType('video/webm') !== '',
    ogg: video.canPlayType('video/ogg') !== ''
  }
}
