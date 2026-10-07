import type { Request, Response, NextFunction } from 'express'

import { createError } from '../utils/error'

export const handleError = (
  error: ReturnType<typeof createError> | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (typeof (error as Error & { code?: unknown }).code === 'number') {
    return res
      .status((error as Error & { code: number }).code)
      .json({ success: false, message: error.message })
  } else {
    console.error('[服务器内部错误]', error)
    return res.status(500).json({
      success: false,
      message: '服务器内部错误',
    })
  }
}
