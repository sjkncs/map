import type { Message } from '@root/shared/types/ai'
import { createError } from '@/modules/utils/error'

export const remakeMessages = (messages: Message[], userIndex: number) => {
  if (userIndex < 0) {
    throw createError('索引范围不正确', 400)
  }
  let currentIndex = 0
  const targetIndex = messages.findIndex((message) => {
    if (message.role !== 'user') {
      return false
    }
    const result = currentIndex === userIndex
    currentIndex++
    return result
  })
  if (targetIndex === -1) {
    throw createError('索引范围不正确', 400)
  }
  return messages.slice(0, targetIndex)
}

export const getUserAndAssistantCount = (messages: Message[]) => {
  let count: number = 0
  for (let i = 0; i < messages.length; i++) {
    if (messages[i].role === 'user' || messages[i].role === 'assistant') {
      count++
    }
  }
  return count
}
