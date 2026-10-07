import type { SessionItem, UserMessage } from '@map/shared/types/ai'
import type { Mode, Model } from '@root/shared/types/ai'
import type { SearchItem } from '@root/shared/types/map'
import aiSearchStore from '@/modules/stores/ai-search'
import barStore from '@/stores/bar'
import userStore from '@/stores/user'
import { contentToText } from '@map/shared/services/content'

import actions from './modules/action'
import { findUserIndex } from './modules/message'

export const sendMessage = async (
  sessionId: number | 'pending',
  message: UserMessage['content'],
  mode: Mode,
  model: Model,
  newIndex?: number,
) => {
  const session = userStore.session.values.get(sessionId)
  try {
    const ws = await aiSearchStore.open(sessionId)
    if (!ws) {
      throw new Error('连接失败')
    }
    if (!session) {
      throw new Error('没有找到会话')
    }
    session.isSearching = true
    let userIndex: number | undefined
    if (newIndex !== undefined) {
      userIndex = findUserIndex(session.messages, newIndex)
      session.messages = session.messages.slice(0, newIndex)
    }
    session.messages.push({ role: 'user', content: message, model })
    ws.send(
      JSON.stringify({
        sessionId,
        currentLocation: userStore.currentLocation,
        message,
        mode,
        model,
        userIndex,
      }),
    )

    ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data)
      if (data.action) {
        actions[data.action](data.args, { sessionId })
      }
    })
  } catch (error: any) {
    if (session) {
      session.isSearching = false
    }
    console.error(error.message)
    aiSearchStore.close(sessionId)
  }
}

export const aiSearch = async (searchValue: UserMessage['content'], mode: Mode, model: Model) => {
  const text = contentToText(searchValue)
  const newSearch: SearchItem = {
    id: crypto.randomUUID(),
    name: text || '纯图片',
    type: 'ai',
    createdAt: new Date(),
  }
  barStore.openContentBar('ai', { loveId: undefined, recentId: newSearch.id })
  const newSession: SessionItem = {
    messages: [],
    pois: [],
    isSearching: false,
  }
  userStore.session.currentId = 'pending'
  userStore.session.values.set('pending', newSession)
  const addRes = await userStore.search.add(newSearch)
  if (!addRes) {
    barStore.recentId = undefined
    userStore.session.values.delete('pending')
    return
  }
  const sessionId = newSearch.sessionId as number
  userStore.session.currentId = sessionId
  userStore.session.values.set(sessionId, newSession)
  userStore.session.values.delete('pending')
  await sendMessage(sessionId, searchValue, mode, model)
}
