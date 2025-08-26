import { TOTP, Secret } from 'otpauth'
import QRCode from 'qrcode'

// TOTP配置
const TOTP_CONFIG = {
  issuer: 'FileList Auth',
  algorithm: 'SHA1' as const,
  digits: 6,
  period: 30,
}

// 生成TOTP密钥
export function generateTOTPSecret(): string {
  const secret = new Secret({ size: 20 })
  return secret.base32
}

// 创建TOTP实例
export function createTOTP(userName: string, secret: string): TOTP {
  return new TOTP({
    issuer: TOTP_CONFIG.issuer,
    label: userName,
    algorithm: TOTP_CONFIG.algorithm,
    digits: TOTP_CONFIG.digits,
    period: TOTP_CONFIG.period,
    secret: Secret.fromBase32(secret),
  })
}

// 生成二维码
export async function generateQRCode(totpUri: string): Promise<string> {
  try {
    return await QRCode.toDataURL(totpUri, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
  } catch (error) {
    throw new Error('生成二维码失败')
  }
}

// 验证TOTP代码
export function verifyTOTP(secret: string, token: string): boolean {
  try {
    const totp = new TOTP({
      issuer: TOTP_CONFIG.issuer,
      algorithm: TOTP_CONFIG.algorithm,
      digits: TOTP_CONFIG.digits,
      period: TOTP_CONFIG.period,
      secret: Secret.fromBase32(secret),
    })
    
    // 验证当前时间窗口和前后各一个时间窗口（允许时间偏差）
    const delta = totp.validate({ token, window: 1 })
    return delta !== null
  } catch (error) {
    return false
  }
}

// 生成当前TOTP代码（用于显示）
export function generateCurrentTOTP(secret: string): string {
  try {
    const totp = new TOTP({
      issuer: TOTP_CONFIG.issuer,
      algorithm: TOTP_CONFIG.algorithm,
      digits: TOTP_CONFIG.digits,
      period: TOTP_CONFIG.period,
      secret: Secret.fromBase32(secret),
    })
    
    return totp.generate()
  } catch (error) {
    return '000000'
  }
}

// 获取剩余时间（秒）
export function getTOTPRemainingTime(): number {
  const now = Math.floor(Date.now() / 1000)
  return TOTP_CONFIG.period - (now % TOTP_CONFIG.period)
}

// 用户注册数据接口
export interface UserRegistration {
  userName: string
  secret: string
  qrCodeUri: string
  qrCodeDataUrl: string
  currentToken: string
  remainingTime: number
}

// 生成用户注册数据
export async function generateUserRegistration(userName: string): Promise<UserRegistration> {
  const secret = generateTOTPSecret()
  const totp = createTOTP(userName, secret)
  const qrCodeUri = totp.toString()
  const qrCodeDataUrl = await generateQRCode(qrCodeUri)
  const currentToken = generateCurrentTOTP(secret)
  const remainingTime = getTOTPRemainingTime()

  return {
    userName,
    secret,
    qrCodeUri,
    qrCodeDataUrl,
    currentToken,
    remainingTime,
  }
}
