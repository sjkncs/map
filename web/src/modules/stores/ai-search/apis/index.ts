import { SERVER_CONFIG } from '@/../config'

export const connectSearchWS = (): Promise<WebSocket> => {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('token')
    const bearerToken = `Bearer ${token}`
    const ws = new WebSocket(`${SERVER_CONFIG.wsURL}?token=${encodeURIComponent(bearerToken)}`)

    ws.addEventListener('open', () => {
      resolve(ws)
    })
    ws.addEventListener('error', () => reject(new Error('连接失败')))
  })
}

export const closeSearchWS = (ws: WebSocket) => {
  ws.close(3000, '客户端主动关闭')
}
