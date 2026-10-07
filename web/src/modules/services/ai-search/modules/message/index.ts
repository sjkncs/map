import type { Message } from '@root/shared/types/ai'

export const findUserIndex = (messages: Message[], newIndex: number) => {
  let result: number = -1
  for (let i = 0; i < messages.length; i++) {
    const curentMessage = messages[i]
    if (curentMessage.role === 'user') {
      result++
    }
    if (i === newIndex) break
  }
  return result
}
