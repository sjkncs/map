import type { WebSocket } from 'ws'

import type { Message } from '@root/shared/types/ai'

export type VerifiedWs = WebSocket & { userId: number; sessionId: number }

export type Environment = {
  ws: VerifiedWs
  currentLocation: string
  messages: Message[]
}
