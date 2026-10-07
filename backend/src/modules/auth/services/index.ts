import bcrypt from 'bcrypt'

import { generateToken } from './utils/token'
import { createError } from '@/modules/utils/error'
import { User } from '@/tables'
import { verifyCredentials } from './modules/verify'

export const login = async (name: unknown, password: unknown) => {
  const result = verifyCredentials(name, password)
  if (!result.success) {
    throw createError(result.error.issues[0].message, 400)
  }
  const { data } = result
  const user = await User.selectOne({ name: data.name })
  if (!user) {
    throw createError('用户不存在', 404)
  }
  const isMatch = await bcrypt.compare(data.password, user.password)
  if (!isMatch) {
    throw createError('密码错误', 400)
  }
  return { token: generateToken(user.id) }
}

export const register = async (name: unknown, password: unknown) => {
  const result = verifyCredentials(name, password, { minLength: 6 })
  if (!result.success) {
    throw createError(result.error.issues[0].message, 400)
  }
  const { data } = result
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10)
    const newUser = {
      name: data.name,
      password: hashedPassword,
    }
    const newUserId: number = await User.insert(newUser)
    return { token: generateToken(newUserId) }
  } catch (error: any) {
    if (error.code === '23505') {
      throw createError('用户已存在', 409)
    }
    throw error
  }
}
