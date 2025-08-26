import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/db/services'

export async function POST(request: NextRequest) {
  try {
    const { userName, totpCode } = await request.json()

    // 验证必需字段
    if (!userName || !totpCode) {
      return NextResponse.json(
        { error: '用户名和TOTP验证码都是必需的' },
        { status: 400 }
      )
    }

    // 验证TOTP
    const result = await authService.verifyTOTP(userName, totpCode)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        user: {
          id: result.user?.id,
          userName: result.user?.userName,
        },
      })
    } else {
      return NextResponse.json(
        { error: result.message },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('TOTP验证失败:', error)
    return NextResponse.json(
      { error: 'TOTP验证失败' },
      { status: 500 }
    )
  }
}
