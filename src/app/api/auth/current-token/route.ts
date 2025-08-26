import { NextRequest, NextResponse } from 'next/server'
import { generateCurrentTOTP, getTOTPRemainingTime } from '@/lib/totp'

export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json()

    if (!secret) {
      return NextResponse.json(
        { error: '密钥是必需的' },
        { status: 400 }
      )
    }

    const token = generateCurrentTOTP(secret)
    const remainingTime = getTOTPRemainingTime()

    return NextResponse.json({
      success: true,
      token,
      remainingTime,
    })
  } catch (error) {
    console.error('获取当前TOTP代码失败:', error)
    return NextResponse.json(
      { error: '获取当前TOTP代码失败' },
      { status: 500 }
    )
  }
}
