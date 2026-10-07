import http from 'http'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import express from 'express'
import { WebSocketServer } from 'ws'
import type { Request, Response } from 'express'

import { connectToDatabase } from './utils/db'
import collections from './tables'
import { authRouter } from './modules/auth'
import { handleError } from './modules/error'
import { searchRouter, initSearchWSS } from './modules/search'
import { userRouter } from './modules/user'
import { CONFIG } from '../config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(cors())
app.use(express.static(path.join(__dirname, '../public')))
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/search', searchRouter)

app.get('/{*splat}', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

app.use(handleError)

try {
  await connectToDatabase(CONFIG.postgresql, collections)
  const server = http.createServer(app)
  const wss = new WebSocketServer({ server })

  initSearchWSS(wss)

  server
    .listen(CONFIG.port, () => {
      console.log(`🚀 服务器已启动: http://localhost:${CONFIG.port}`)
    })
    .on('error', (err) => {
      console.error('服务器启动失败:', err.message)
    })
} catch (error) {
  console.error('应用启动失败:', error)
  process.exit(1)
}
