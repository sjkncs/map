import aiSearchStore from '@/modules/stores/ai-search'
import userStore from '@/stores/user'

export const streamOut = (
  {
    type,
    content,
    id,
    name,
    status,
  }: {
    type: string
    content?: string
    id: string
    name: string
    status: '调用中...' | '完成' | '失败'
  },
  { sessionId }: { sessionId: number | 'pending' },
) => {
  const session = userStore.session.values.get(sessionId)
  if (!session) return
  const messages = session.messages
  if (type === 'content') {
    let lastMessage = messages[messages.length - 1]
    if (lastMessage.role !== 'assistant') {
      messages.push({ role: 'assistant', content: '' })
    }
    lastMessage = messages[messages.length - 1]
    if ('content' in lastMessage) {
      lastMessage.content += content as string
    }
  } else if (type === 'tool') {
    if (status === '调用中...') {
      messages.push({ role: 'tool', tool_call_id: id, tool_call_name: name, status })
    } else {
      for (let i = messages.length - 1; i >= 0; i--) {
        const message = messages[i]
        if (message.role !== 'tool' || message.tool_call_id !== id) continue
        message.status = status
      }
    }
  } else if (type === 'done') {
    session.isSearching = false
    aiSearchStore.close(sessionId)
  }
}
