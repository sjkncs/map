import jwt from 'jsonwebtoken'

import { createError } from '@/modules/utils/error'
import { User } from '@/tables'
import { CONFIG } from '@/../config'

export const verifyToken = async (token: string) => {
  const decoded = jwt.verify(token, CONFIG.jwtSecret) as { userId: number }
  const userId = decoded.userId
  if (typeof userId !== 'number') {
    throw createError('无效的 token，请重新登录', 401)
  }
  const user = await User.selectOne({ id: userId })
  if (!user) {
    throw createError('用户不存在', 401)
  }
  return userId
}
