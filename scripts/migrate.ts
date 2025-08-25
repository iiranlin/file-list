#!/usr/bin/env tsx

import { migrateFromJSON } from '../src/lib/db/migrate'

async function main() {
  try {
    console.log('开始数据迁移...')
    await migrateFromJSON()
    console.log('数据迁移完成！')
    process.exit(0)
  } catch (error) {
    console.error('数据迁移失败:', error)
    process.exit(1)
  }
}

main()
