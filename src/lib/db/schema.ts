import { pgTable, serial, text, timestamp, varchar, integer } from 'drizzle-orm/pg-core'

// 音频文件表
export const audioFiles = pgTable('audio_files', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  artist: varchar('artist', { length: 255 }).notNull(),
  duration: varchar('duration', { length: 20 }).notNull(),
  genre: varchar('genre', { length: 100 }).notNull(),
  src: text('src').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// 视频文件表
export const videoFiles = pgTable('video_files', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  duration: varchar('duration', { length: 20 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  thumbnail: text('thumbnail').notNull(),
  src: text('src').notNull(),
  views: varchar('views', { length: 20 }).notNull(),
  uploadDate: varchar('upload_date', { length: 20 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// 图片文件表
export const imageFiles = pgTable('image_files', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  src: text('src').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  tags: text('tags').notNull(), // JSON字符串存储标签数组
  uploadDate: varchar('upload_date', { length: 20 }).notNull(),
  dimensions: varchar('dimensions', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// 教程表
export const tutorials = pgTable('tutorials', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  difficulty: varchar('difficulty', { length: 20 }).notNull(), // Beginner, Intermediate, Advanced
  readTime: varchar('read_time', { length: 50 }).notNull(),
  author: varchar('author', { length: 255 }).notNull(),
  publishDate: varchar('publish_date', { length: 20 }).notNull(),
  tags: text('tags').notNull(), // JSON字符串存储标签数组
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// 身份验证表
export const authCodes = pgTable('auth_codes', {
  id: serial('id').primaryKey(),
  userName: varchar('user_name', { length: 255 }).notNull().unique(),
  userCode: varchar('user_code', { length: 255 }).notNull(),
  systemCode: varchar('system_code', { length: 255 }).notNull(),
  totpSecret: varchar('totp_secret', { length: 255 }), // TOTP密钥
  isActive: integer('is_active').default(1).notNull(), // 1=激活, 0=禁用
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// 导出类型
export type AudioFile = typeof audioFiles.$inferSelect
export type NewAudioFile = typeof audioFiles.$inferInsert

export type VideoFile = typeof videoFiles.$inferSelect
export type NewVideoFile = typeof videoFiles.$inferInsert

export type ImageFile = typeof imageFiles.$inferSelect
export type NewImageFile = typeof imageFiles.$inferInsert

export type Tutorial = typeof tutorials.$inferSelect
export type NewTutorial = typeof tutorials.$inferInsert

export type AuthCode = typeof authCodes.$inferSelect
export type NewAuthCode = typeof authCodes.$inferInsert
