import { NextRequest, NextResponse } from 'next/server'
import { migrateFromJSON } from '@/lib/db/migrate'

export async function POST(request: NextRequest) {
  try {
    // 简单的认证检查（在实际项目中应该使用更安全的方式）
    const { password } = await request.json()
    
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('开始数据迁移...')
    await migrateFromJSON()
    console.log('数据迁移完成！')

    return NextResponse.json({ 
      success: true, 
      message: '数据迁移完成！所有JSON数据已成功导入到PostgreSQL数据库。' 
    })
  } catch (error) {
    console.error('数据迁移失败:', error)
    return NextResponse.json({ 
      error: '数据迁移失败', 
      details: error instanceof Error ? error.message : '未知错误' 
    }, { status: 500 })
  }
}
