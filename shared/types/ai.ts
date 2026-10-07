import type { DetailItem } from './modules/map'

export type Mode = 'Agent' | 'Ask'

export type Model = 'MiMo' | 'DeepSeek'

type SystemMessage = {
  role: 'system'
  content: string
}

type ContentPartText = {
  type: 'text'
  text: string
}

type ContentPartImage = {
  type: 'image_url'
  image_url: {
    url: string
    detail?: 'auto' | 'low' | 'high'
  }
}

export type UserMessage = {
  role: 'user'
  content: string | (ContentPartText | ContentPartImage)[]
  model: Model
}
export type AssistantMessage = {
  role: 'assistant'
  content?: string
  tool_calls?: unknown
}
export type ToolMessage = {
  role: 'tool'
  tool_call_id: string
  tool_call_name: string
  status: '调用中...' | '完成' | '失败'
}
type PoiMessage = {
  role: 'poi'
  pois: DetailItem[]
}
type NavMessage = {
  role: 'nav'
  pois: DetailItem[]
  type: 'driving' | 'walking' | 'transfer' | 'riding'
}
type OptionMessage = {
  role: 'option'
  options: string[]
}
export type Message =
  | SystemMessage
  | UserMessage
  | AssistantMessage
  | ToolMessage
  | PoiMessage
  | NavMessage
  | OptionMessage
export type SessionItem = {
  messages: Message[]
  pois: DetailItem[]
  isSearching: boolean
}
