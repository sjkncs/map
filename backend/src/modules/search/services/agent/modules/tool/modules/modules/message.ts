export const toMessage = (message: any) => ({
  sessionId: message.sessionId,
  index: message.index,
  role: message.role,
  content: message.content,
  toolCalls: message.toolCalls,
  createdAt: message.createdAt,
})
