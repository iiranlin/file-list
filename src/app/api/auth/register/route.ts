import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/db/services'
import { generateUserRegistration } from '@/lib/totp'

export async function POST(request: NextRequest) {
  try {
    const { userName } = await request.json()

    // 验证必需字段
    if (!userName) {
      return NextResponse.json(
        { error: '用户名是必需的' },
        { status: 400 }
      )
    }

    // 检查用户名是否已存在
    const existingUser = await authService.getByUserName(userName)
    if (existingUser) {
      return NextResponse.json(
        { error: '用户名已存在' },
        { status: 409 }
      )
    }

    // 生成TOTP注册数据
    const registrationData = await generateUserRegistration(userName)

    // 创建用户记录（暂时不激活，等待用户确认）
    await authService.create({
      userName,
      userCode: 'temp', // 临时值，TOTP模式下不使用
      systemCode: 'temp', // 临时值，TOTP模式下不使用
      totpSecret: registrationData.secret,
      isActive: 0, // 暂时禁用，等待用户确认
    })

    return NextResponse.json({
      success: true,
      data: {
        userName: registrationData.userName,
        secret: registrationData.secret,
        qrCodeDataUrl: registrationData.qrCodeDataUrl,
        currentToken: registrationData.currentToken,
        remainingTime: registrationData.remainingTime,
      },
    })
  } catch (error) {
    console.error('TOTP注册失败:', error)
    return NextResponse.json(
      { error: 'TOTP注册失败' },
      { status: 500 }
    )
  }
}

// 确认TOTP注册
export async function PUT(request: NextRequest) {
  try {
    const { userName, totpCode } = await request.json()

    // 验证必需字段
    if (!userName || !totpCode) {
      return NextResponse.json(
        { error: '用户名和TOTP验证码都是必需的' },
        { status: 400 }
      )
    }

    // 验证TOTP代码
    const result = await authService.verifyTOTP(userName, totpCode)

    if (result.success) {
      // 激活用户
      const user = await authService.getByUserName(userName)
      if (user) {
        await authService.update(user.id, { isActive: 1 })
      }

      return NextResponse.json({
        success: true,
        message: 'TOTP注册确认成功，用户已激活',
      })
    } else {
      return NextResponse.json(
        { error: result.message },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('TOTP注册确认失败:', error)
    return NextResponse.json(
      { error: 'TOTP注册确认失败' },
      { status: 500 }
    )
  }
}
