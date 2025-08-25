#!/usr/bin/env tsx

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { promises as fs } from 'fs'

// 数据库配置向导
async function setupDatabase() {
  console.log('🚀 数据库配置向导\n')

  // 检查环境变量文件
  const envPath = resolve(process.cwd(), '.env.local')
  const envExamplePath = resolve(process.cwd(), '.env.local.example')

  try {
    await fs.access(envPath)
    console.log('✅ 找到 .env.local 文件')
  } catch {
    console.log('⚠️  未找到 .env.local 文件')
    
    try {
      await fs.access(envExamplePath)
      console.log('📋 复制示例配置文件...')
      const exampleContent = await fs.readFile(envExamplePath, 'utf8')
      await fs.writeFile(envPath, exampleContent)
      console.log('✅ 已创建 .env.local 文件')
    } catch {
      console.log('❌ 未找到 .env.local.example 文件')
      console.log('请手动创建 .env.local 文件并配置 DATABASE_URL')
      return
    }
  }

  // 加载环境变量
  dotenv.config({ path: envPath })

  console.log('\n📊 当前数据库配置:')
  console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? '已设置' : '未设置'}`)
  console.log(`DB_HOST: ${process.env.DB_HOST || '未设置'}`)
  console.log(`DB_NAME: ${process.env.DB_NAME || '未设置'}`)
  console.log(`DB_USER: ${process.env.DB_USER || '未设置'}`)
  console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD ? '已设置' : '未设置'}`)

  console.log('\n🔧 数据库设置步骤:')
  console.log('1. 确保您有一个PostgreSQL数据库实例')
  console.log('2. 更新 .env.local 文件中的数据库连接信息')
  console.log('3. 运行 npm run db:test 测试连接')
  console.log('4. 运行 npm run db:push 创建表结构')
  console.log('5. 运行 npm run db:migrate 导入初始数据')

  console.log('\n💡 推荐的云数据库服务:')
  console.log('• Neon (https://neon.tech) - 免费PostgreSQL')
  console.log('• Supabase (https://supabase.com) - 免费PostgreSQL')
  console.log('• Railway (https://railway.app) - 简单部署')
  console.log('• Vercel Postgres (https://vercel.com/storage/postgres)')

  console.log('\n📝 配置示例:')
  console.log('DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"')
  
  console.log('\n或者使用分离的配置:')
  console.log('DB_HOST=your-host.com')
  console.log('DB_PORT=5432')
  console.log('DB_NAME=your_database')
  console.log('DB_USER=your_username')
  console.log('DB_PASSWORD=your_password')
  console.log('DB_SSL=true')

  console.log('\n🔐 安全提示:')
  console.log('• 不要将 .env.local 文件提交到版本控制')
  console.log('• 使用强密码')
  console.log('• 在生产环境中启用SSL')
  console.log('• 定期轮换数据库密码')

  console.log('\n✅ 配置完成后，运行以下命令测试:')
  console.log('npm run db:test')
}

setupDatabase().catch(console.error)
