import { createAgentManager } from '@lovelymai/agent'
import OpenAI from 'openai'

import type { AssistantMessage, UserMessage } from '@root/shared/types/ai'
import { Message } from '@/tables'
import { contentToText } from '@map/shared/services/content'
import { embeddingTools } from './modules/post-tags'
import { AI_CONFIG } from './config'

const createClient = (sessionId: number) =>
  new OpenAI({
    baseURL: AI_CONFIG.baseURL,
    apiKey: AI_CONFIG.key,
    defaultHeaders: { 'x-opencode-session': String(sessionId) },
  })
const model = 'deepseek-v4.1-flash'

const putMessages = async (
  sessionId: number,
  startIndex: number,
  embeddingMessages: (UserMessage | AssistantMessage)[],
) => {
  await Message.delete({ sessionId, index: { gt: startIndex } })
  await Promise.all(
    embeddingMessages.map(async (message, i) => {
      const text = message.content ? contentToText(message.content) : ''
      const toolCalls = message.role === 'assistant' ? message.tool_calls : undefined
      if (!text && !toolCalls) return
      await Message.insert({
        sessionId,
        index: startIndex + i,
        role: message.role,
        content: text,
        toolCalls,
      })
    }),
  )
}

const generateTags = async (
  sessionId: number,
  startIndex: number,
  taggingMessages: (UserMessage | AssistantMessage)[],
) => {
  await Promise.all(
    taggingMessages.map(async (message, index) => {
      if (!message.content) return
      const text = contentToText(message.content)
      if (!text) return
      const agent = createAgentManager(createClient(sessionId))
      agent.config = { model, tool_choice: 'required', reasoning_effort: 'none' }
      const lastMessage = taggingMessages[index - 1]
      const lastText = lastMessage?.content ? contentToText(lastMessage.content) : ''
      const content = lastText
        ? `上一条是 ${lastMessage.role} 的消息: ${lastText}。以下是当前要生成标签的 ${message.role} 的消息，请提取它的隐性信息生成标签：${text}`
        : `以下是 ${message.role} 的消息，请提取其中的隐性信息生成标签：${text}`
      agent.messages = [
        { role: 'system', content: AI_CONFIG.systemPrompt },
        { role: 'user', content },
      ]
      agent.environment = { sessionId, index: startIndex + index }
      agent.updateTools(embeddingTools)
      agent.onEvent = (event) => {
        if (event.type === 'tool_end') {
          agent.stop()
        }
      }
      await agent.start()
    }),
  )
}

export const memorize = async (
  sessionId: number,
  startIndex: number,
  taggingMessages: (UserMessage | AssistantMessage)[],
) => {
  await putMessages(sessionId, startIndex, taggingMessages)
  await generateTags(sessionId, startIndex, taggingMessages)
}
