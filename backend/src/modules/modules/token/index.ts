import { IncomingMessage } from 'http'
import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'
import type { WebSocket } from 'ws'

import { asyncHandler } from '@/modules/utils/async'
import { createError } from '@/modules/utils/error'
import { verifyToken } from './services/verify'

export const verifyHTTP = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError('请先登录', 401)
    }
    const token = authHeader.split(' ')[1]
    const userId = await verifyToken(token)
    req.userId = userId
    next()
  } catch (error: any) {
    if (error instanceof jwt.TokenExpiredError) {
      throw createError('登录已过期，请重新登录', 401)
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw createError('无效的 token，请重新登录', 401)
    }
    throw error
  }
})

export const verifyWS = async (ws: WebSocket & { userId?: number }, req: IncomingMessage) => {
  try {
    const url = new URL(req.url!, `http://${req.headers.host}`)
    const authHeader = url.searchParams.get('token')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ws.close(401, '请先登录')
      throw createError('请先登录', 401)
    }
    const token = authHeader.split(' ')[1]
    const userId = await verifyToken(token)
    ws.userId = userId
    return true
  } catch (error: any) {
    if (error instanceof jwt.TokenExpiredError) {
      ws.close(401, '登录已过期，请重新登录')
    } else if (error instanceof jwt.JsonWebTokenError) {
      ws.close(401, '无效的token，请重新登录')
    } else if (error.statusCode === 401) {
      ws.close(401, error.message)
    } else {
      ws.close(500, '服务器内部错误')
    }
    return false
  }
}
