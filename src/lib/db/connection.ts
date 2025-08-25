import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// 数据库连接实例（延迟初始化）
let dbInstance: ReturnType<typeof drizzle> | null = null
let clientInstance: postgres.Sql | null = null

// 获取数据库配置
function getDatabaseConfig() {
  return {
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL !== 'false', // 默认启用SSL
  }
}

// 创建数据库连接
function createDatabaseConnection() {
  if (dbInstance) {
    return dbInstance
  }

  const databaseConfig = getDatabaseConfig()

  // 创建数据库连接字符串
  let connectionString: string

  if (databaseConfig.url) {
    // 如果提供了完整的URL，直接使用
    connectionString = databaseConfig.url
  } else if (databaseConfig.host && databaseConfig.database && databaseConfig.username && databaseConfig.password) {
    // 如果提供了分离的配置参数，构建连接字符串
    const port = databaseConfig.port || 5432
    const sslParam = databaseConfig.ssl ? '?sslmode=require' : ''
    connectionString = `postgresql://${databaseConfig.username}:${databaseConfig.password}@${databaseConfig.host}:${port}/${databaseConfig.database}${sslParam}`
  } else {
    throw new Error(
      'Database configuration is incomplete. Please provide either:\n' +
      '1. DATABASE_URL environment variable, or\n' +
      '2. DB_HOST, DB_NAME, DB_USER, and DB_PASSWORD environment variables'
    )
  }

  // 创建postgres客户端配置
  const clientConfig: postgres.Options<{}> = {
    max: parseInt(process.env.DB_MAX_CONNECTIONS || '1'),
    idle_timeout: parseInt(process.env.DB_IDLE_TIMEOUT || '20'),
    max_lifetime: parseInt(process.env.DB_MAX_LIFETIME || '1800'), // 30分钟
  }

  // 如果使用SSL，添加SSL配置
  if (databaseConfig.ssl) {
    clientConfig.ssl = 'require'
  }

  // 创建postgres客户端
  clientInstance = postgres(connectionString, clientConfig)

  // 创建drizzle实例
  dbInstance = drizzle(clientInstance, { schema })

  return dbInstance
}

// 导出数据库实例（使用getter确保延迟初始化）
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(target, prop) {
    const instance = createDatabaseConnection()
    return (instance as any)[prop]
  }
})

// 导出类型
export type Database = typeof db

// 导出数据库配置信息（用于调试，不包含敏感信息）
export function getDbInfo() {
  const databaseConfig = getDatabaseConfig()
  return {
    host: databaseConfig.host || 'from_url',
    database: databaseConfig.database || 'from_url',
    ssl: databaseConfig.ssl,
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '1'),
    idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '20'),
    maxLifetime: parseInt(process.env.DB_MAX_LIFETIME || '1800'),
  }
}
