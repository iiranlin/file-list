import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// 创建数据库连接
const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_DSe0vQ2iWzlx@ep-floral-dawn-ae7bz3vy-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

// 创建postgres客户端
const client = postgres(connectionString, {
  ssl: 'require',
  max: 1,
  idle_timeout: 20,
  max_lifetime: 60 * 30,
})

// 创建drizzle实例
export const db = drizzle(client, { schema })

// 导出类型
export type Database = typeof db
