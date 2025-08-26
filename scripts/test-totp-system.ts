#!/usr/bin/env tsx

import * as dotenv from 'dotenv'
import { resolve } from 'path'

// 加载环境变量
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

import { 
  generateTOTPSecret, 
  createTOTP, 
  generateCurrentTOTP, 
  verifyTOTP, 
  getTOTPRemainingTime,
  generateUserRegistration 
} from '../src/lib/totp'

async function testTOTPSystem() {
  console.log('🔍 测试TOTP身份验证系统...\n')

  let allTestsPassed = true

  // 1. 测试密钥生成
  console.log('1️⃣ 测试TOTP密钥生成...')
  try {
    const secret = generateTOTPSecret()
    console.log(`   ✅ 密钥生成成功: ${secret}`)
    console.log(`   📏 密钥长度: ${secret.length} 字符`)
    
    if (secret.length >= 16) {
      console.log(`   ✅ 密钥长度符合要求`)
    } else {
      console.log(`   ❌ 密钥长度不足`)
      allTestsPassed = false
    }
  } catch (error) {
    console.log(`   ❌ 密钥生成失败: ${error instanceof Error ? error.message : error}`)
    allTestsPassed = false
  }
  console.log()

  // 2. 测试TOTP实例创建
  console.log('2️⃣ 测试TOTP实例创建...')
  try {
    const secret = generateTOTPSecret()
    const totp = createTOTP('testuser', secret)
    console.log(`   ✅ TOTP实例创建成功`)
    console.log(`   🏷️  标签: ${totp.label}`)
    console.log(`   🏢 发行者: ${totp.issuer}`)
    console.log(`   🔢 位数: ${totp.digits}`)
    console.log(`   ⏱️  周期: ${totp.period}秒`)
  } catch (error) {
    console.log(`   ❌ TOTP实例创建失败: ${error instanceof Error ? error.message : error}`)
    allTestsPassed = false
  }
  console.log()

  // 3. 测试TOTP代码生成和验证
  console.log('3️⃣ 测试TOTP代码生成和验证...')
  try {
    const secret = generateTOTPSecret()
    const currentToken = generateCurrentTOTP(secret)
    console.log(`   ✅ 当前TOTP代码: ${currentToken}`)
    
    if (currentToken.length === 6 && /^\d{6}$/.test(currentToken)) {
      console.log(`   ✅ TOTP代码格式正确`)
    } else {
      console.log(`   ❌ TOTP代码格式错误`)
      allTestsPassed = false
    }

    // 验证刚生成的代码
    const isValid = verifyTOTP(secret, currentToken)
    if (isValid) {
      console.log(`   ✅ TOTP代码验证成功`)
    } else {
      console.log(`   ❌ TOTP代码验证失败`)
      allTestsPassed = false
    }

    // 测试错误代码
    const isInvalid = verifyTOTP(secret, '000000')
    if (!isInvalid) {
      console.log(`   ✅ 错误TOTP代码正确被拒绝`)
    } else {
      console.log(`   ❌ 错误TOTP代码未被拒绝`)
      allTestsPassed = false
    }
  } catch (error) {
    console.log(`   ❌ TOTP代码测试失败: ${error instanceof Error ? error.message : error}`)
    allTestsPassed = false
  }
  console.log()

  // 4. 测试剩余时间计算
  console.log('4️⃣ 测试剩余时间计算...')
  try {
    const remainingTime = getTOTPRemainingTime()
    console.log(`   ✅ 当前剩余时间: ${remainingTime}秒`)
    
    if (remainingTime > 0 && remainingTime <= 30) {
      console.log(`   ✅ 剩余时间范围正确`)
    } else {
      console.log(`   ❌ 剩余时间范围错误`)
      allTestsPassed = false
    }
  } catch (error) {
    console.log(`   ❌ 剩余时间计算失败: ${error instanceof Error ? error.message : error}`)
    allTestsPassed = false
  }
  console.log()

  // 5. 测试用户注册数据生成
  console.log('5️⃣ 测试用户注册数据生成...')
  try {
    const registrationData = await generateUserRegistration('testuser')
    console.log(`   ✅ 用户注册数据生成成功`)
    console.log(`   👤 用户名: ${registrationData.userName}`)
    console.log(`   🔑 密钥: ${registrationData.secret}`)
    console.log(`   🔗 URI: ${registrationData.qrCodeUri.substring(0, 50)}...`)
    console.log(`   📱 二维码: ${registrationData.qrCodeDataUrl.substring(0, 30)}...`)
    console.log(`   🔢 当前代码: ${registrationData.currentToken}`)
    console.log(`   ⏰ 剩余时间: ${registrationData.remainingTime}秒`)

    // 验证生成的数据
    if (registrationData.userName === 'testuser' &&
        registrationData.secret.length >= 16 &&
        registrationData.qrCodeUri.startsWith('otpauth://totp/') &&
        registrationData.qrCodeDataUrl.startsWith('data:image/png;base64,') &&
        /^\d{6}$/.test(registrationData.currentToken) &&
        registrationData.remainingTime > 0) {
      console.log(`   ✅ 注册数据格式验证通过`)
    } else {
      console.log(`   ❌ 注册数据格式验证失败`)
      allTestsPassed = false
    }
  } catch (error) {
    console.log(`   ❌ 用户注册数据生成失败: ${error instanceof Error ? error.message : error}`)
    allTestsPassed = false
  }
  console.log()

  // 6. 测试时间窗口验证
  console.log('6️⃣ 测试时间窗口验证...')
  try {
    const secret = generateTOTPSecret()
    const totp = createTOTP('testuser', secret)
    
    // 生成当前时间的代码
    const currentToken = totp.generate()
    console.log(`   🔢 当前代码: ${currentToken}`)
    
    // 验证当前代码
    const delta = totp.validate({ token: currentToken, window: 1 })
    if (delta !== null) {
      console.log(`   ✅ 时间窗口验证成功，偏差: ${delta}`)
    } else {
      console.log(`   ❌ 时间窗口验证失败`)
      allTestsPassed = false
    }
  } catch (error) {
    console.log(`   ❌ 时间窗口验证测试失败: ${error instanceof Error ? error.message : error}`)
    allTestsPassed = false
  }
  console.log()

  // 总结
  console.log('📋 测试总结:')
  if (allTestsPassed) {
    console.log('🎉 所有测试通过！TOTP身份验证系统工作正常。')
    console.log('\n🚀 可以进行的操作:')
    console.log('   • 访问 /auth 页面进行TOTP注册和登录')
    console.log('   • 使用验证器应用扫描二维码')
    console.log('   • 测试TOTP代码验证功能')
    console.log('\n📱 推荐的验证器应用:')
    console.log('   • Google Authenticator')
    console.log('   • Microsoft Authenticator')
    console.log('   • Authy')
    console.log('   • 1Password')
    console.log('\n🔧 API端点:')
    console.log('   • POST /api/auth/register - 注册TOTP')
    console.log('   • PUT /api/auth/register - 确认TOTP注册')
    console.log('   • POST /api/auth/totp-verify - TOTP登录验证')
    console.log('   • POST /api/auth/current-token - 获取当前代码')
  } else {
    console.log('❌ 某些测试失败，请检查上述错误信息。')
    console.log('\n🔧 可能的解决方案:')
    console.log('   • 检查otpauth和qrcode依赖是否正确安装')
    console.log('   • 验证TOTP配置参数')
    console.log('   • 检查系统时间是否准确')
    console.log('   • 确认数据库连接正常')
  }

  process.exit(allTestsPassed ? 0 : 1)
}

testTOTPSystem().catch(console.error)
