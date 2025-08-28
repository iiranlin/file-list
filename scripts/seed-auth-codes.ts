#!/usr/bin/env tsx

import * as dotenv from 'dotenv'
import { resolve } from 'path'

// 加载环境变量
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

import { authService } from '../src/lib/db/services'

async function seedAuthCodes() {
  console.log('🌱 创建测试验证码数据...\n')

  try {
    // 测试用户数据
    const testUsers = [
      {
        userName: 'admin',
        userCode: 'admin123',
        systemCode: 'system456',
        isActive: 1,
      },
      {
        userName: 'testuser',
        userCode: 'user789',
        systemCode: 'sys321',
        isActive: 1,
      },
      {
        userName: 'demo',
        userCode: 'demo123',
        systemCode: 'demo456',
        isActive: 1, // 默认启用状态
      },
    ]

    for (const user of testUsers) {
      try {
        // 检查用户是否已存在
        const existingUser = await authService.getByUserName(user.userName)
        if (existingUser) {
          // 更新现有用户
          const updatedUser = await authService.update(existingUser.id, user)
          console.log(`🔄 更新用户: ${user.userName}`)
          console.log(`   用户验证码: ${user.userCode}`)
          console.log(`   系统验证码: ${user.systemCode}`)
          console.log(`   状态: ${user.isActive === 1 ? '激活' : '禁用'}`)
          console.log()
        } else {
          // 创建新用户
          const result = await authService.create(user)
          console.log(`✅ 创建用户: ${user.userName}`)
          console.log(`   用户验证码: ${user.userCode}`)
          console.log(`   系统验证码: ${user.systemCode}`)
          console.log(`   状态: ${user.isActive === 1 ? '激活' : '禁用'}`)
          console.log()
        }
      } catch (error) {
        console.error(`❌ 处理用户 ${user.userName} 失败:`, error)
      }
    }

    console.log('🎉 测试数据创建完成！')
    console.log('\n📋 测试账户信息:')
    console.log('1. 管理员账户:')
    console.log('   用户名: admin')
    console.log('   用户验证码: admin123')
    console.log('   系统验证码: system456')
    console.log()
    console.log('2. 测试用户:')
    console.log('   用户名: testuser')
    console.log('   用户验证码: user789')
    console.log('   系统验证码: sys321')
    console.log()
    console.log('3. 演示用户 (禁用):')
    console.log('   用户名: demo')
    console.log('   用户验证码: demo123')
    console.log('   系统验证码: demo456')
    console.log()
    console.log('🚀 现在可以访问 /auth 页面进行测试！')

  } catch (error) {
    console.error('❌ 创建测试数据失败:', error)
    process.exit(1)
  }
}

seedAuthCodes().catch(console.error)
