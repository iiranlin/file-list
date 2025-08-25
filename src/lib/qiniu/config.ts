// 七牛云配置
export interface QiniuConfig {
  accessKey: string
  secretKey: string
  bucketName: string
  domain: string
  cdnDomain: string
}

// 获取七牛云配置
export function getQiniuConfig(): QiniuConfig {
  const config = {
    accessKey: process.env.QINIU_ACCESS_KEY,
    secretKey: process.env.QINIU_SECRET_KEY,
    bucketName: process.env.QINIU_BUCKET_NAME,
    domain: process.env.QINIU_DOMAIN,
    cdnDomain: process.env.QINIU_CDN_DOMAIN,
  }

  // 验证必需的配置项
  const requiredFields = ['accessKey', 'secretKey', 'bucketName', 'domain', 'cdnDomain']
  const missingFields = requiredFields.filter(field => !config[field as keyof QiniuConfig])

  if (missingFields.length > 0) {
    throw new Error(
      `七牛云配置不完整，缺少以下环境变量: ${missingFields.map(field => `QINIU_${field.toUpperCase().replace(/([A-Z])/g, '_$1')}`).join(', ')}`
    )
  }

  return config as QiniuConfig
}

// 导出配置信息（用于调试，不包含敏感信息）
export function getQiniuInfo() {
  try {
    const config = getQiniuConfig()
    return {
      bucketName: config.bucketName,
      domain: config.domain,
      cdnDomain: config.cdnDomain,
      configured: true,
    }
  } catch (error) {
    return {
      bucketName: 'not_configured',
      domain: 'not_configured',
      cdnDomain: 'not_configured',
      configured: false,
      error: error instanceof Error ? error.message : '未知错误',
    }
  }
}
