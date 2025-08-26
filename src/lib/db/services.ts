import { eq } from 'drizzle-orm'
import { db } from './connection'
import { audioFiles, videoFiles, imageFiles, tutorials, authCodes } from './schema'
import type { NewAudioFile, NewVideoFile, NewImageFile, NewTutorial, NewAuthCode } from './schema'
import { verifyTOTP } from '../totp'

// 音频服务
export const audioService = {
  // 获取所有音频
  async getAll() {
    return await db.select().from(audioFiles).orderBy(audioFiles.createdAt)
  },

  // 根据ID获取音频
  async getById(id: number) {
    const result = await db.select().from(audioFiles).where(eq(audioFiles.id, id))
    return result[0] || null
  },

  // 创建音频
  async create(data: Omit<NewAudioFile, 'id' | 'createdAt' | 'updatedAt'>) {
    const result = await db.insert(audioFiles).values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()
    return result[0]
  },

  // 更新音频
  async update(id: number, data: Partial<Omit<NewAudioFile, 'id' | 'createdAt' | 'updatedAt'>>) {
    const result = await db.update(audioFiles)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(audioFiles.id, id))
      .returning()
    return result[0] || null
  },

  // 删除音频
  async delete(id: number) {
    const result = await db.delete(audioFiles).where(eq(audioFiles.id, id)).returning()
    return result[0] || null
  },
}

// 视频服务
export const videoService = {
  // 获取所有视频
  async getAll() {
    return await db.select().from(videoFiles).orderBy(videoFiles.createdAt)
  },

  // 根据ID获取视频
  async getById(id: number) {
    const result = await db.select().from(videoFiles).where(eq(videoFiles.id, id))
    return result[0] || null
  },

  // 创建视频
  async create(data: Omit<NewVideoFile, 'id' | 'createdAt' | 'updatedAt'>) {
    const result = await db.insert(videoFiles).values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()
    return result[0]
  },

  // 更新视频
  async update(id: number, data: Partial<Omit<NewVideoFile, 'id' | 'createdAt' | 'updatedAt'>>) {
    const result = await db.update(videoFiles)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(videoFiles.id, id))
      .returning()
    return result[0] || null
  },

  // 删除视频
  async delete(id: number) {
    const result = await db.delete(videoFiles).where(eq(videoFiles.id, id)).returning()
    return result[0] || null
  },
}

// 图片服务
export const imageService = {
  // 获取所有图片
  async getAll() {
    return await db.select().from(imageFiles).orderBy(imageFiles.createdAt)
  },

  // 根据ID获取图片
  async getById(id: number) {
    const result = await db.select().from(imageFiles).where(eq(imageFiles.id, id))
    return result[0] || null
  },

  // 创建图片
  async create(data: Omit<NewImageFile, 'id' | 'createdAt' | 'updatedAt'>) {
    const result = await db.insert(imageFiles).values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()
    return result[0]
  },

  // 更新图片
  async update(id: number, data: Partial<Omit<NewImageFile, 'id' | 'createdAt' | 'updatedAt'>>) {
    const result = await db.update(imageFiles)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(imageFiles.id, id))
      .returning()
    return result[0] || null
  },

  // 删除图片
  async delete(id: number) {
    const result = await db.delete(imageFiles).where(eq(imageFiles.id, id)).returning()
    return result[0] || null
  },
}

// 教程服务
export const tutorialService = {
  // 获取所有教程
  async getAll() {
    return await db.select().from(tutorials).orderBy(tutorials.createdAt)
  },

  // 根据ID获取教程
  async getById(id: number) {
    const result = await db.select().from(tutorials).where(eq(tutorials.id, id))
    return result[0] || null
  },

  // 创建教程
  async create(data: Omit<NewTutorial, 'id' | 'createdAt' | 'updatedAt'>) {
    const result = await db.insert(tutorials).values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()
    return result[0]
  },

  // 更新教程
  async update(id: number, data: Partial<Omit<NewTutorial, 'id' | 'createdAt' | 'updatedAt'>>) {
    const result = await db.update(tutorials)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(tutorials.id, id))
      .returning()
    return result[0] || null
  },

  // 删除教程
  async delete(id: number) {
    const result = await db.delete(tutorials).where(eq(tutorials.id, id)).returning()
    return result[0] || null
  },
}

// 身份验证服务
export const authService = {
  // 获取所有验证码
  async getAll() {
    return await db.select().from(authCodes).orderBy(authCodes.createdAt)
  },

  // 根据用户名获取验证码
  async getByUserName(userName: string) {
    const result = await db.select().from(authCodes).where(eq(authCodes.userName, userName))
    return result[0] || null
  },

  // 验证用户验证码和系统验证码
  async verifyAuth(userName: string, userCode: string, systemCode: string) {
    const authRecord = await this.getByUserName(userName)

    if (!authRecord) {
      return { success: false, message: '用户不存在' }
    }

    if (authRecord.isActive !== 1) {
      return { success: false, message: '用户已被禁用' }
    }

    if (authRecord.userCode !== userCode) {
      return { success: false, message: '用户验证码错误' }
    }

    if (authRecord.systemCode !== systemCode) {
      return { success: false, message: '系统验证码错误' }
    }

    return { success: true, message: '验证成功', user: authRecord }
  },

  // 验证TOTP代码
  async verifyTOTP(userName: string, totpCode: string) {
    const authRecord = await this.getByUserName(userName)

    if (!authRecord) {
      return { success: false, message: '用户不存在' }
    }

    if (authRecord.isActive !== 1) {
      return { success: false, message: '用户已被禁用' }
    }

    if (!authRecord.totpSecret) {
      return { success: false, message: '用户未设置TOTP' }
    }

    const isValidTOTP = verifyTOTP(authRecord.totpSecret, totpCode)
    if (!isValidTOTP) {
      return { success: false, message: 'TOTP验证码错误' }
    }

    return { success: true, message: 'TOTP验证成功', user: authRecord }
  },

  // 创建验证码
  async create(data: Omit<NewAuthCode, 'id' | 'createdAt' | 'updatedAt'>) {
    const result = await db.insert(authCodes).values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()
    return result[0]
  },

  // 更新验证码
  async update(id: number, data: Partial<Omit<NewAuthCode, 'id' | 'createdAt' | 'updatedAt'>>) {
    const result = await db.update(authCodes)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(authCodes.id, id))
      .returning()
    return result[0] || null
  },

  // 删除验证码
  async delete(id: number) {
    const result = await db.delete(authCodes).where(eq(authCodes.id, id)).returning()
    return result[0] || null
  },

  // 启用/禁用用户
  async toggleActive(id: number) {
    const current = await db.select().from(authCodes).where(eq(authCodes.id, id))
    if (!current[0]) return null

    const newStatus = current[0].isActive === 1 ? 0 : 1
    const result = await db.update(authCodes)
      .set({
        isActive: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(authCodes.id, id))
      .returning()
    return result[0] || null
  },
}
