import { IncomingMessage } from 'http'
import express from 'express'
import type { Request, Response } from 'express'
import type { WebSocket, WebSocketServer, MessageEvent } from 'ws'

import type { VerifiedWs } from './services/agent/types'
import { asyncHandler } from '../utils/async'
import { processAiMessage } from './services/agent'
import { commonSearch } from './services/common'
import { detailSearch } from './services/detail'
import { verifyHTTP, verifyWS } from '../modules/token'

const searchRouter = express.Router()

searchRouter.use(verifyHTTP)

searchRouter.get(
  '/common',
  asyncHandler(async (req: Request, res: Response) => {
    const { keyword, currentLocation } = req.query
    const pois = await commonSearch(keyword, currentLocation)
    return res.status(200).json({
      success: true,
      message: '搜索成功',
      pois,
    })
  }),
)

searchRouter.get(
  '/detail/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const poi = await detailSearch(id)
    return res.status(200).json({
      success: true,
      message: '搜索成功',
      poi,
    })
  }),
)

const initSearchWSS = (wss: WebSocketServer) => {
  wss.on('connection', async (ws: WebSocket, req: IncomingMessage) => {
    const messageQueue: string[] = []
    const saveMessage = (event: MessageEvent) => {
      messageQueue.push(String(event.data))
    }
    ws.addEventListener('message', saveMessage)
    const isValid = await verifyWS(ws, req)
    if (!isValid) return
    ws.removeEventListener('message', saveMessage)
    ws.addEventListener('message', async (event: MessageEvent) => {
      try {
        const { sessionId, currentLocation, message, mode, model, userIndex } = JSON.parse(
          String(event.data),
        )
        await processAiMessage(
          ws as VerifiedWs,
          sessionId,
          currentLocation,
          message,
          mode,
          model,
          userIndex,
        )
      } catch (error: any) {
        ws.close(3001, error.message)
      }
    })
    messageQueue.forEach((data) => {
      ws.emit('message', data)
    })
  })
}

export { searchRouter, initSearchWSS }
