import express from 'express'
import type { Request, Response } from 'express'

import { asyncHandler } from '../utils/async'
import { login, register } from './services'

const authRouter = express.Router()

authRouter.post(
  '/login',
  asyncHandler(async (req: Request, res: Response) => {
    const { name, password } = req.body
    const { token } = await login(name, password)
    return res.status(200).json({
      success: true,
      message: '登录成功',
      token,
    })
  }),
)

authRouter.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { name, password } = req.body
    const { token } = await register(name, password)
    return res.status(200).json({
      success: true,
      message: '注册成功',
      token,
    })
  }),
)

export { authRouter }
