#!/usr/bin/env tsx

import * as dotenv from 'dotenv'
import { resolve } from 'path'

// 加载环境变量
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

import { db, getDbInfo } from '../src/lib/db/connection'
import { audioService, videoService, imageService, tutorialService } from '../src/lib/db/services'

async function verifySetup() {
  console.log('🔍 验证项目设置...\n')

  let allTestsPassed = true

  // 1. 检查环境变量
  console.log('1️⃣ 检查环境变量配置...')
  const requiredEnvVars = ['DATABASE_URL', 'ADMIN_USERNAME', 'ADMIN_PASSWORD']
  
  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      console.log(`   ✅ ${envVar}: 已设置`)
    } else {
      console.log(`   ❌ ${envVar}: 未设置`)
      allTestsPassed = false
    }
  }
  console.log()

  // 2. 测试数据库连接
  console.log('2️⃣ 测试数据库连接...')
  try {
    const dbInfo = getDbInfo()
    console.log(`   📊 数据库配置: ${dbInfo.host}/${dbInfo.database}`)
    console.log(`   🔐 SSL: ${dbInfo.ssl ? '启用' : '禁用'}`)
    
    // 测试基本连接
    await db.execute('SELECT 1 as test')
    console.log('   ✅ 数据库连接成功')
  } catch (error) {
    console.log('   ❌ 数据库连接失败:', error instanceof Error ? error.message : error)
    allTestsPassed = false
  }
  console.log()

  // 3. 检查表结构
  console.log('3️⃣ 检查数据库表结构...')
  try {
    const [audioCount, videoCount, imageCount, tutorialCount] = await Promise.all([
      audioService.getAll().then(data => data.length),
      videoService.getAll().then(data => data.length),
      imageService.getAll().then(data => data.length),
      tutorialService.getAll().then(data => data.length),
    ])

    console.log(`   📀 audio_files 表: ${audioCount} 条记录`)
    console.log(`   🎬 video_files 表: ${videoCount} 条记录`)
    console.log(`   🖼️  image_files 表: ${imageCount} 条记录`)
    console.log(`   📚 tutorials 表: ${tutorialCount} 条记录`)
    console.log(`   📊 总计: ${audioCount + videoCount + imageCount + tutorialCount} 条记录`)
    
    if (audioCount > 0 && videoCount > 0 && imageCount > 0 && tutorialCount > 0) {
      console.log('   ✅ 所有表都有数据')
    } else {
      console.log('   ⚠️  某些表没有数据，可能需要运行数据迁移')
    }
  } catch (error) {
    console.log('   ❌ 表结构检查失败:', error instanceof Error ? error.message : error)
    allTestsPassed = false
  }
  console.log()

  // 4. 测试数据服务
  console.log('4️⃣ 测试数据服务...')
  try {
    // 测试读取操作
    const audioData = await audioService.getAll()
    const videoData = await videoService.getAll()
    const imageData = await imageService.getAll()
    const tutorialData = await tutorialService.getAll()

    console.log('   ✅ 音频服务正常')
    console.log('   ✅ 视频服务正常')
    console.log('   ✅ 图片服务正常')
    console.log('   ✅ 教程服务正常')
  } catch (error) {
    console.log('   ❌ 数据服务测试失败:', error instanceof Error ? error.message : error)
    allTestsPassed = false
  }
  console.log()

  // 5. 检查文件结构
  console.log('5️⃣ 检查项目文件结构...')
  const requiredFiles = [
    '.env.local',
    '.env.local.example',
    'drizzle.config.ts',
    'src/lib/db/connection.ts',
    'src/lib/db/schema.ts',
    'src/lib/db/services.ts',
    'DATABASE_SETUP.md'
  ]

  const fs = await import('fs/promises')
  for (const file of requiredFiles) {
    try {
      await fs.access(file)
      console.log(`   ✅ ${file}`)
    } catch {
      console.log(`   ❌ ${file} 不存在`)
      allTestsPassed = false
    }
  }
  console.log()

  // 总结
  console.log('📋 验证总结:')
  if (allTestsPassed) {
    console.log('🎉 所有测试通过！项目设置完成。')
    console.log('\n🚀 下一步操作:')
    console.log('   • 运行 npm run dev 启动开发服务器')
    console.log('   • 访问 http://localhost:3000 查看网站')
    console.log('   • 访问 http://localhost:3000/admin 管理内容')
    console.log('   • 运行 npm run db:studio 打开数据库管理界面')
  } else {
    console.log('❌ 某些测试失败，请检查上述错误信息。')
    console.log('\n🔧 可能的解决方案:')
    console.log('   • 检查 .env.local 文件配置')
    console.log('   • 运行 npm run db:push 创建表结构')
    console.log('   • 运行 npm run db:migrate 导入初始数据')
    console.log('   • 查看 DATABASE_SETUP.md 获取详细指导')
  }

  process.exit(allTestsPassed ? 0 : 1)
}

verifySetup().catch(console.error)
