#!/usr/bin/env tsx

import * as dotenv from 'dotenv'
import { resolve } from 'path'

// 加载环境变量
const envPath = resolve(process.cwd(), '.env.local')
console.log(`📁 加载环境变量文件: ${envPath}`)
const result = dotenv.config({ path: envPath })

if (result.error) {
  console.error('❌ 无法加载环境变量文件:', result.error.message)
  process.exit(1)
}

console.log('✅ 环境变量加载成功')
console.log(`🔑 DATABASE_URL: ${process.env.DATABASE_URL ? '已设置' : '未设置'}`)
console.log()

import { db, getDbInfo } from '../src/lib/db/connection'
import { audioFiles } from '../src/lib/db/schema'

async function testDatabaseConnection() {
  console.log('🔍 测试数据库连接...\n')
  
  try {
    // 显示数据库配置信息
    const dbInfo = getDbInfo()
    console.log('📊 数据库配置信息:')
    console.log(`  主机: ${dbInfo.host}`)
    console.log(`  数据库: ${dbInfo.database}`)
    console.log(`  SSL: ${dbInfo.ssl ? '启用' : '禁用'}`)
    console.log(`  最大连接数: ${dbInfo.maxConnections}`)
    console.log(`  空闲超时: ${dbInfo.idleTimeout}秒`)
    console.log(`  最大生命周期: ${dbInfo.maxLifetime}秒`)
    console.log()

    // 测试基本连接
    console.log('🔗 测试数据库连接...')
    const startTime = Date.now()

    // 执行一个简单的查询来测试连接
    try {
      // 先测试基本的SQL查询
      const basicResult = await db.execute('SELECT 1 as test')
      console.log(`✅ 基本数据库连接成功！`)

      const endTime = Date.now()
      const responseTime = endTime - startTime
      console.log(`⏱️  响应时间: ${responseTime}ms`)
      console.log()

      // 然后测试表查询
      console.log('📋 测试表查询...')
      const result = await db.select().from(audioFiles).limit(1)
      console.log(`✅ 表查询成功！`)

    } catch (queryError) {
      console.log(`⚠️  基本连接成功，但表查询失败`)
      console.log(`   这通常意味着表结构尚未创建`)
      console.log(`   请运行: npm run db:push`)
      console.log()
    }

    // 测试表结构
    console.log('📋 检查表结构...')
    try {
      // 获取各表的数据统计
      const [audioCount, videoCount, imageCount, tutorialCount] = await Promise.all([
        db.select().from(audioFiles).then(rows => rows.length),
        db.select().from((await import('../src/lib/db/schema')).videoFiles).then(rows => rows.length),
        db.select().from((await import('../src/lib/db/schema')).imageFiles).then(rows => rows.length),
        db.select().from((await import('../src/lib/db/schema')).tutorials).then(rows => rows.length),
      ])

      console.log(`  📀 音频文件: ${audioCount} 条记录`)
      console.log(`  🎬 视频文件: ${videoCount} 条记录`)
      console.log(`  🖼️  图片文件: ${imageCount} 条记录`)
      console.log(`  📚 教程内容: ${tutorialCount} 条记录`)
      console.log(`  📊 总计: ${audioCount + videoCount + imageCount + tutorialCount} 条记录`)
      console.log()

      console.log('🎉 数据库测试完成！所有功能正常。')
      
    } catch (tableError) {
      console.error('❌ 表结构检查失败:', tableError)
      console.log('💡 提示: 请确保已运行数据库迁移 (npm run db:push)')
    }

  } catch (error) {
    console.error('❌ 数据库连接失败:')
    
    if (error instanceof Error) {
      console.error(`   错误信息: ${error.message}`)
      
      // 提供具体的错误解决建议
      if (error.message.includes('ECONNREFUSED')) {
        console.log('\n💡 连接被拒绝，可能的原因:')
        console.log('   1. 数据库服务器未运行')
        console.log('   2. 网络连接问题')
        console.log('   3. 防火墙阻止连接')
      } else if (error.message.includes('authentication failed')) {
        console.log('\n💡 认证失败，请检查:')
        console.log('   1. 用户名和密码是否正确')
        console.log('   2. 数据库用户是否有访问权限')
      } else if (error.message.includes('database') && error.message.includes('does not exist')) {
        console.log('\n💡 数据库不存在，请:')
        console.log('   1. 创建数据库')
        console.log('   2. 检查数据库名称是否正确')
      } else if (error.message.includes('DATABASE_URL')) {
        console.log('\n💡 环境变量配置问题:')
        console.log('   1. 检查 .env.local 文件是否存在')
        console.log('   2. 确保 DATABASE_URL 已正确设置')
        console.log('   3. 或者设置 DB_HOST, DB_NAME, DB_USER, DB_PASSWORD')
      }
    } else {
      console.error('   未知错误:', error)
    }
    
    console.log('\n🔧 解决步骤:')
    console.log('   1. 检查环境变量配置')
    console.log('   2. 确认数据库服务器状态')
    console.log('   3. 验证网络连接')
    console.log('   4. 运行 npm run db:push 创建表结构')
    
    process.exit(1)
  }
}

// 运行测试
testDatabaseConnection()
