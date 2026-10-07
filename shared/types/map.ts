import type { BasicItem, DetailItem } from './modules/map'

export type LoveItem = BasicItem & {
  type: 'love'
}

export type { DetailItem }

export type SearchItem = {
  id: string
  name: string
  type: 'common' | 'ai'
  sessionId?: number
  createdAt: Date | string
}

export type CustomPoiItem = {
  id: string
  name: string
  location: string
  alias?: string
  description?: string
}

export type NavType = 'driving' | 'walking' | 'transfer' | 'riding'
