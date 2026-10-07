import { createError } from '@/modules/utils/error'
import { Session } from '@/tables'

export const getSession = async (userId: number, id: unknown) => {
  if (typeof id !== 'number') {
    throw createError('id 必须是数字', 400)
  }
  const session = await Session.selectOne({ userId, id })
  if (!session) {
    throw createError('没有符合条件的会话', 404)
  }
  const messages: any[] = session.messages
  session.messages = messages.filter(
    (message: any) => message.role !== 'system' && message.tool_call_name !== 'show_options',
  )
  return session
}
