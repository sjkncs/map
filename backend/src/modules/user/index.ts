import express from 'express'
import type { Request, Response } from 'express'

import { asyncHandler } from '../utils/async.js'
import {
  getUser,
  postLove,
  deleteLove,
  putCommonSearch,
  postAiSearch,
  deleteRecentSearch,
  clearRecentSearches,
  patchCustomPoi,
  deleteCustomPoi,
} from '../services/user'
import { getSession } from './services/session'
import { verifyHTTP } from '../modules/token'

const userRouter = express.Router()

userRouter.use(verifyHTTP)

userRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const user = await getUser(req.userId)
    return res.status(200).json({
      success: true,
      message: '获取用户信息成功',
      user,
    })
  }),
)

userRouter.post(
  '/loves',
  asyncHandler(async (req: Request, res: Response) => {
    const { love } = req.body
    await postLove(req.userId, love)
    return res.status(200).json({
      success: true,
      message: '收藏添加成功',
    })
  }),
)

userRouter.delete(
  '/loves/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string }
    await deleteLove(req.userId, id)
    return res.status(200).json({
      success: true,
      message: '收藏删除成功',
    })
  }),
)

userRouter.put(
  '/common-searches',
  asyncHandler(async (req: Request, res: Response) => {
    const { id, name } = req.body
    await putCommonSearch(req.userId, id, name)
    return res.status(200).json({
      success: true,
      message: '最近搜索保存成功',
    })
  }),
)

userRouter.post(
  '/agent-searches',
  asyncHandler(async (req: Request, res: Response) => {
    const { id, name } = req.body
    const sessionId = await postAiSearch(req.userId, id, name)
    return res.status(200).json({
      success: true,
      message: '最近搜索添加成功',
      sessionId,
    })
  }),
)

userRouter.delete(
  '/recent-searches/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string }
    await deleteRecentSearch(req.userId, id)
    return res.status(200).json({
      success: true,
      message: '最近搜索删除成功',
    })
  }),
)

userRouter.delete(
  '/recent-searches',
  asyncHandler(async (req: Request, res: Response) => {
    await clearRecentSearches(req.userId)
    return res.status(200).json({
      success: true,
      message: '最近搜索清空成功',
    })
  }),
)

userRouter.patch(
  '/custom-pois',
  asyncHandler(async (req: Request, res: Response) => {
    const { customPoi } = req.body
    await patchCustomPoi(req.userId, customPoi)
    return res.status(200).json({
      success: true,
      message: '自定义地点新增/更新成功',
    })
  }),
)

userRouter.delete(
  '/custom-pois/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { params } = req
    const { id } = params as { id: string }
    await deleteCustomPoi(req.userId, id)
    return res.status(200).json({
      success: true,
      message: '自定义地点删除成功',
    })
  }),
)

userRouter.get(
  '/session/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string }
    const session = await getSession(req.userId, Number(id))
    return res.status(200).json({
      success: true,
      message: '获取会话信息成功',
      session,
    })
  }),
)

export { userRouter }
