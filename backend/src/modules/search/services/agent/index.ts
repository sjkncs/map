import { createAgentManager } from '@lovelymai/agent'
import OpenAI from 'openai'
import { z } from 'zod'

import type { VerifiedWs } from './types'
import type { Message, Mode, Model } from '@map/shared/types/ai'
import { createError } from '@/modules/utils/error'
import { Session } from '@/tables'
import { memorize } from './modules/memory'
import { getUserAndAssistantCount, remakeMessages } from './modules/message'
import { allTools, commonTools } from './modules/tool'
import { AI_CONFIG, type ModelId } from './config'

const createClient = (sessionId: number) =>
  new OpenAI({
    baseURL: AI_CONFIG.baseURL,
    apiKey: AI_CONFIG.key,
    defaultHeaders: { 'x-opencode-session': String(sessionId) },
  })

const runAi = async (
  ws: VerifiedWs,
  currentLocation: string,
  messages: Message[],
  mode: Mode,
  model: ModelId,
  sessionId: number,
) => {
  const agent = createAgentManager(createClient(sessionId))
  agent.config = { model, tool_choice: 'auto', reasoning_effort: 'none' }
  agent.messages = messages
  agent.environment = { ws, currentLocation, messages }
  const tools = mode === 'Agent' ? allTools : commonTools
  agent.updateTools(tools)

  const send = (data: Record<string, any>) => {
    ws.send(JSON.stringify(data))
  }
  agent.onEvent = (event) => {
    if (event.type === 'message_update') {
      if (!event.text.content) return
      send({ action: 'streamOut', args: { type: 'content', content: event.text.content } })
    }
    if (event.type === 'tool_start') {
      const toolCall = event.toolCall
      if (toolCall.function.name === 'show_options') return
      send({
        action: 'streamOut',
        args: {
          type: 'tool',
          id: toolCall.id,
          name: toolCall.function.name,
          status: '调用中...',
        },
      })
    }
    if (event.type === 'tool_end') {
      const toolCall = event.toolCall
      const success = event.success
      const lastMessage = agent.messages[agent.messages.length - 1]
      lastMessage.tool_call_name = toolCall.function.name
      lastMessage.status = success ? '完成' : '失败'
      if (success && toolCall.function.name === 'show_options') {
        send({ action: 'streamOut', args: { type: 'done' } })
        agent.stop()
        ws.close(3000, '等待用户选择')
      } else {
        send({
          action: 'streamOut',
          args: {
            type: 'tool',
            id: toolCall.id,
            name: toolCall.function.name,
            status: success ? '完成' : '失败',
          },
        })
      }
    }
    if (event.type === 'agent_end') {
      send({ action: 'streamOut', args: { type: 'done' } })
      ws.close(3000, '对话结束')
    }
    if (event.type === 'agent_error') {
      console.error(event.error.message)
    }
  }
  ws.addEventListener('close', () => {
    agent.stop()
  })
  await agent.start()
  return agent.messages as Message[]
}

const ContentPartSchema = z.union([
  z.object({ type: z.literal('text'), text: z.string() }),
  z.object({ type: z.literal('image_url'), image_url: z.object({ url: z.string() }) }),
])

const UserContentSchema = z.union([z.string(), z.array(ContentPartSchema).min(1)])

export const processAiMessage = async (
  ws: VerifiedWs,
  sessionId: unknown,
  currentLocation: unknown,
  message: unknown,
  mode: unknown,
  model: unknown,
  userIndex?: unknown,
) => {
  const messageResult = UserContentSchema.safeParse(message)
  if (
    typeof sessionId !== 'number' ||
    typeof currentLocation !== 'string' ||
    !messageResult.success ||
    !['Agent', 'Ask'].some((item) => item === mode) ||
    typeof model !== 'string' ||
    !AI_CONFIG.models.has(model)
  ) {
    throw createError('格式不正确', 400)
  }
  const validMessage = messageResult.data
  const COORD_REGEX = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/
  if (!COORD_REGEX.test(currentLocation)) {
    throw createError('坐标格式不正确', 400)
  }
  const userId = ws.userId
  const session = await Session.selectOne({ userId, id: sessionId })
  if (!session) {
    throw createError('未找到会话', 404)
  }
  const latestSession = await Session.selectOne({ userId }, 'updated_at DESC')
  const isLatest = latestSession?.id === sessionId
  ws.sessionId = sessionId
  let messages: Message[] = session.messages
  if (messages.length === 0) {
    messages.push({ role: 'system', content: AI_CONFIG.systemPrompt })
  } else if (typeof userIndex === 'number') {
    messages = remakeMessages(messages, userIndex)
  }
  if (!isLatest) {
    messages.push({
      role: 'system',
      content: '用户已在其他会话对话过，当前会话消息查找结果已经滞后，注意重新调用 search_messages',
    })
  }
  const startIndex = getUserAndAssistantCount(messages)
  const oldLength = messages.length

  messages.push({ role: 'system', content: `用户此时的位置坐标: ${currentLocation}` })
  messages.push({ role: 'user', content: validMessage, model: model as Model })
  const totalMessages = await runAi(
    ws,
    currentLocation,
    messages,
    mode as Mode,
    AI_CONFIG.models.get(model)!,
    sessionId,
  )
  await Session.update({ id: sessionId }, { messages: totalMessages, updatedAt: new Date() })

  const newEmbeddingMessages = totalMessages
    .slice(oldLength)
    .filter((message) => message.role === 'user' || message.role === 'assistant')
  await memorize(sessionId, startIndex, newEmbeddingMessages)
}
