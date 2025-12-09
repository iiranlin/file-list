// Cloudflare R2 配置
export interface R2Config {
  accountId: string
  accessKeyId: string
  secretAccessKey: string
  bucketName: string
  publicDomain: string // 用于公开访问的域名
}

// 获取 R2 配置
export function getR2Config(): R2Config {
  const config = {
    accountId: process.env.R2_ACCOUNT_ID,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucketName: process.env.R2_BUCKET_NAME,
    publicDomain: process.env.R2_PUBLIC_DOMAIN,
  }

  // 验证必需的配置项
  const requiredFields = ['accountId', 'accessKeyId', 'secretAccessKey', 'bucketName', 'publicDomain']
  const missingFields = requiredFields.filter(field => !config[field as keyof typeof config])

  if (missingFields.length > 0) {
    throw new Error(
      `Cloudflare R2 配置不完整，缺少以下环境变量: ${missingFields.map(field => `R2_${field.toUpperCase().replace(/([A-Z])/g, '_$1')}`).join(', ')}`
    )
  }

  return config as R2Config
}

// 导出配置信息（用于调试，不包含敏感信息）
export function getR2Info() {
  try {
    const config = getR2Config()
    return {
      bucketName: config.bucketName,
      publicDomain: config.publicDomain,
      configured: true,
    }
  } catch (error) {
    return {
      bucketName: 'not_configured',
      publicDomain: 'not_configured',
      configured: false,
      error: error instanceof Error ? error.message : '未知错误',
    }
  }
}
