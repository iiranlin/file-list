#!/usr/bin/env tsx

import * as dotenv from 'dotenv'
import { resolve } from 'path'

// 加载环境变量
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

import { authService } from '../src/lib/db/services'

async function testAuthSystem() {
  console.log('🔍 测试身份验证系统...\n')

  let allTestsPassed = true

  // 1. 测试数据库连接
  console.log('1️⃣ 测试数据库连接...')
  try {
    const allAuthCodes = await authService.getAll()
    console.log(`   ✅ 数据库连接成功，共有 ${allAuthCodes.length} 个验证码`)
  } catch (error) {
    console.log(`   ❌ 数据库连接失败: ${error instanceof Error ? error.message : error}`)
    allTestsPassed = false
  }
  console.log()

  // 2. 测试用户查询
  console.log('2️⃣ 测试用户查询功能...')
  try {
    const adminUser = await authService.getByUserName('admin')
    if (adminUser) {
      console.log(`   ✅ 查询用户成功: ${adminUser.userName}`)
      console.log(`   📋 用户信息: ID=${adminUser.id}, 状态=${adminUser.isActive === 1 ? '激活' : '禁用'}`)
    } else {
      console.log(`   ⚠️  未找到admin用户，可能需要运行种子数据脚本`)
    }

    const nonExistentUser = await authService.getByUserName('nonexistent')
    if (!nonExistentUser) {
      console.log(`   ✅ 不存在用户查询正确返回null`)
    }
  } catch (error) {
    console.log(`   ❌ 用户查询失败: ${error instanceof Error ? error.message : error}`)
    allTestsPassed = false
  }
  console.log()

  // 3. 测试身份验证功能
  console.log('3️⃣ 测试身份验证功能...')
  
  // 测试成功验证
  try {
    const successResult = await authService.verifyAuth('admin', 'admin123', 'system456')
    if (successResult.success) {
      console.log(`   ✅ 正确验证码验证成功: ${successResult.message}`)
    } else {
      console.log(`   ❌ 正确验证码验证失败: ${successResult.message}`)
      allTestsPassed = false
    }
  } catch (error) {
    console.log(`   ❌ 验证功能异常: ${error instanceof Error ? error.message : error}`)
    allTestsPassed = false
  }

  // 测试错误的用户验证码
  try {
    const failResult1 = await authService.verifyAuth('admin', 'wrongcode', 'system456')
    if (!failResult1.success) {
      console.log(`   ✅ 错误用户验证码正确拒绝: ${failResult1.message}`)
    } else {
      console.log(`   ❌ 错误用户验证码未被拒绝`)
      allTestsPassed = false
    }
  } catch (error) {
    console.log(`   ❌ 验证功能异常: ${error instanceof Error ? error.message : error}`)
    allTestsPassed = false
  }

  // 测试错误的系统验证码
  try {
    const failResult2 = await authService.verifyAuth('admin', 'admin123', 'wrongsystem')
    if (!failResult2.success) {
      console.log(`   ✅ 错误系统验证码正确拒绝: ${failResult2.message}`)
    } else {
      console.log(`   ❌ 错误系统验证码未被拒绝`)
      allTestsPassed = false
    }
  } catch (error) {
    console.log(`   ❌ 验证功能异常: ${error instanceof Error ? error.message : error}`)
    allTestsPassed = false
  }

  // 测试不存在的用户
  try {
    const failResult3 = await authService.verifyAuth('nonexistent', 'any', 'any')
    if (!failResult3.success) {
      console.log(`   ✅ 不存在用户正确拒绝: ${failResult3.message}`)
    } else {
      console.log(`   ❌ 不存在用户未被拒绝`)
      allTestsPassed = false
    }
  } catch (error) {
    console.log(`   ❌ 验证功能异常: ${error instanceof Error ? error.message : error}`)
    allTestsPassed = false
  }

  // 测试禁用用户（如果存在demo用户）
  try {
    const demoUser = await authService.getByUserName('demo')
    if (demoUser && demoUser.isActive === 0) {
      const failResult4 = await authService.verifyAuth('demo', 'demo123', 'demo456')
      if (!failResult4.success) {
        console.log(`   ✅ 禁用用户正确拒绝: ${failResult4.message}`)
      } else {
        console.log(`   ❌ 禁用用户未被拒绝`)
        allTestsPassed = false
      }
    }
  } catch (error) {
    console.log(`   ❌ 禁用用户测试异常: ${error instanceof Error ? error.message : error}`)
  }
  console.log()

  // 4. 测试CRUD操作
  console.log('4️⃣ 测试CRUD操作...')
  let testUserId: number | null = null
  
  try {
    // 创建测试用户
    const newUser = await authService.create({
      userName: 'testcrud',
      userCode: 'test123',
      systemCode: 'sys123',
      isActive: 1,
    })
    testUserId = newUser.id
    console.log(`   ✅ 创建用户成功: ID=${newUser.id}`)

    // 更新用户
    const updatedUser = await authService.update(newUser.id, {
      userCode: 'updated123',
    })
    if (updatedUser && updatedUser.userCode === 'updated123') {
      console.log(`   ✅ 更新用户成功`)
    } else {
      console.log(`   ❌ 更新用户失败`)
      allTestsPassed = false
    }

    // 删除用户
    const deletedUser = await authService.delete(newUser.id)
    if (deletedUser) {
      console.log(`   ✅ 删除用户成功`)
      testUserId = null
    } else {
      console.log(`   ❌ 删除用户失败`)
      allTestsPassed = false
    }
  } catch (error) {
    console.log(`   ❌ CRUD操作失败: ${error instanceof Error ? error.message : error}`)
    allTestsPassed = false
    
    // 清理测试数据
    if (testUserId) {
      try {
        await authService.delete(testUserId)
      } catch (cleanupError) {
        console.log(`   ⚠️  清理测试数据失败`)
      }
    }
  }
  console.log()

  // 总结
  console.log('📋 测试总结:')
  if (allTestsPassed) {
    console.log('🎉 所有测试通过！身份验证系统工作正常。')
    console.log('\n🚀 可以进行的操作:')
    console.log('   • 访问 /auth 页面进行身份验证')
    console.log('   • 访问 /admin/auth-codes 管理验证码')
    console.log('   • 使用测试账户进行登录测试')
    console.log('\n📋 测试账户:')
    console.log('   用户名: admin | 用户验证码: admin123 | 系统验证码: system456')
    console.log('   用户名: testuser | 用户验证码: user789 | 系统验证码: sys321')
  } else {
    console.log('❌ 某些测试失败，请检查上述错误信息。')
    console.log('\n🔧 可能的解决方案:')
    console.log('   • 检查数据库连接配置')
    console.log('   • 运行 npm run db:push 确保表结构正确')
    console.log('   • 运行 npm run db:seed-auth 创建测试数据')
    console.log('   • 检查环境变量配置')
  }

  process.exit(allTestsPassed ? 0 : 1)
}

testAuthSystem().catch(console.error)
