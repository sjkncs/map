import { z } from 'zod'

import type { Environment } from '@/modules/search/services/agent/types'
import { getSql } from '@/utils/db'
import { Description, Message, Session } from '@/tables'
import {
  getUser,
  postLove,
  deleteLove,
  patchCustomPoi,
  deleteCustomPoi,
} from '@/modules/services/user'
import { poiIcons } from '@map/shared/services/poi'
import { embed } from '../../../modules/embedding'
import { toMessage } from '../modules/message'
import { findPois } from '../modules/poi'

export const getUserData = async ({}, { ws }: Environment) => {
  try {
    const userId = ws.userId
    return await getUser(userId)
  } catch (error: any) {
    throw new Error(`获取用户数据失败, ${error.message}`)
  }
}

export const postLovesFromContext = async (
  { ids }: { ids: unknown },
  { ws, messages }: Environment,
) => {
  try {
    if (!Array.isArray(ids)) {
      throw new Error('ids 必须是数组')
    }
    const userId = ws.userId
    const pois = findPois(messages, ids)
    if (pois.length < ids.length) {
      throw new Error('有地点未在消息记录中找到')
    }
    const newLoves = pois.map((poi) => ({
      id: poi.id,
      name: poi.name,
      shortAddress: poi.cityname + '·' + poi.adname,
      location: poi.location,
      icon: poiIcons[poi.typecode.slice(0, 2)],
    }))
    await Promise.all(newLoves.map((love) => postLove(userId, love)))
    ws.send(JSON.stringify({ action: 'postLoves', args: { loves: newLoves } }))
    return `新增 ${ids.length} 个收藏成功`
  } catch (error: any) {
    throw new Error(`新增收藏失败, ${error.message}`)
  }
}

export const deleteLoves = async ({ ids }: { ids: unknown }, { ws }: Environment) => {
  try {
    if (!Array.isArray(ids)) {
      throw new Error('ids 必须是数组')
    }
    const userId = ws.userId
    await Promise.all(ids.map((id) => deleteLove(userId, id)))
    ws.send(JSON.stringify({ action: 'deleteLoves', args: { ids } }))
    return `删除 ${ids.length} 个收藏成功`
  } catch (error: any) {
    throw new Error(`删除收藏失败, ${error.message}`)
  }
}

export const patchCustomPoiFromContext = async (
  { id, alias, description }: { id: unknown; alias: unknown; description: unknown },
  { ws, messages }: Environment,
) => {
  try {
    const result = z
      .object({ id: z.string(), alias: z.string(), description: z.string() })
      .safeParse({ id, alias, description })
    if (!result.success) {
      throw new Error(result.error.issues[0].message)
    }
    const userId = ws.userId
    const customPoi = findPois(messages, [result.data.id])[0]
    if (!customPoi) {
      throw new Error('消息记录中没有符合的地点')
    }
    const newCustomPoi = {
      id: customPoi.id,
      name: customPoi.name,
      location: customPoi.location,
      alias: result.data.alias,
      description: result.data.description,
    }
    await patchCustomPoi(userId, newCustomPoi)
    ws.send(JSON.stringify({ action: 'putRecentCustomPoi', args: { customPoi: newCustomPoi } }))
    return '新增/更新自定义地点成功'
  } catch (error: any) {
    throw new Error(`新增/更新自定义地点失败, ${error.message}`)
  }
}

export const deleteCustomPois = async ({ ids }: { ids: unknown }, { ws }: Environment) => {
  try {
    if (!Array.isArray(ids)) {
      throw new Error('ids 必须是数组')
    }
    const userId = ws.userId
    await Promise.all(ids.map((id) => deleteCustomPoi(userId, id)))
    ws.send(JSON.stringify({ action: 'deleteCustomPois', args: { ids } }))
    return `删除 ${ids.length} 个自定义地点成功`
  } catch (error: any) {
    throw new Error(`删除自定义地点失败, ${error.message}`)
  }
}

export const putDescription = async (
  { id, des }: { id?: unknown; des: unknown },
  { ws }: Environment,
) => {
  try {
    if (id !== undefined && typeof id !== 'number') {
      throw new Error('id 必须是数字')
    }
    if (typeof des !== 'string') {
      throw new Error('des 必须是字符串')
    }
    const userId = ws.userId
    if (typeof id === 'number') {
      const updated = await Description.update({ userId, id }, { des })
      if (!updated) {
        throw new Error('没有找到这个用户描述')
      }
      return '更新用户描述成功'
    } else {
      await Description.insert({ userId, des })
      return '新增用户描述成功'
    }
  } catch (error: any) {
    throw new Error(`新增/更新用户描述失败, ${error.message}`)
  }
}

export const deleteDescription = async ({ id }: { id: unknown }, { ws }: Environment) => {
  try {
    if (typeof id !== 'number') {
      throw new Error('id 必须是数字')
    }
    const userId = ws.userId
    const deleted = await Description.delete({ userId, id })
    if (deleted) {
      return '删除用户描述成功'
    } else {
      throw new Error('没有找到这个用户描述')
    }
  } catch (error: any) {
    throw new Error(`删除用户描述失败, ${error.message}`)
  }
}

export const searchMessages = async (
  { keyword, start, end }: { keyword: unknown; start?: unknown; end?: unknown },
  { ws }: Environment,
) => {
  try {
    if (typeof keyword !== 'string') {
      throw new Error('keyword 必须是字符串')
    }
    if (start !== undefined && typeof start !== 'number') {
      throw new Error('start 必须是数字')
    }
    if (end !== undefined && typeof end !== 'number') {
      throw new Error('end 必须是数字')
    }
    const embeddings = await embed(keyword)
    const embeddingStr = `[${embeddings.join(',')}]`
    const sql = getSql()
    const rows = await sql`
      SELECT messages.session_id, messages."index", messages.role, messages.content,
             messages.tool_calls, messages.created_at,
             tags.content AS tag,
             1 - (tags.embedding <=> ${embeddingStr}::vector) AS similarity
      FROM tags
      JOIN messages ON messages.session_id = tags.session_id AND messages."index" = tags."index"
      WHERE tags.session_id IN (SELECT id FROM sessions WHERE user_id = ${ws.userId})
        AND tags.session_id != ${ws.sessionId}
        ${start !== undefined ? sql`AND messages.created_at >= NOW() - ${start} * INTERVAL '1 day'` : sql``}
        ${end !== undefined ? sql`AND messages.created_at <= NOW() - ${end} * INTERVAL '1 day'` : sql``}
      ORDER BY tags.embedding <=> ${embeddingStr}::vector
      LIMIT 25
    `
    const seen = new Set<string>()
    const messages = rows
      .filter((row) => {
        if (row.similarity < 0.5) return false
        const key = `${row.sessionId}-${row.index}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      .slice(0, 5)
    if (messages.length === 0) {
      throw new Error('没有找到相关消息，可以尝试更换关键词重试')
    }
    console.log(
      keyword,
      messages.map((message) => ({
        tag: message.tag,
        content: message.content,
        similarity: message.similarity,
      })),
    )
    return messages.map(toMessage)
  } catch (error: any) {
    throw new Error(`搜索记忆失败, ${error.message}`)
  }
}

export const getMoreMessages = async (
  {
    sessionId,
    index,
    before = 2,
    after = 2,
  }: { sessionId: unknown; index: unknown; before?: unknown; after?: unknown },
  { ws }: Environment,
) => {
  try {
    if (typeof sessionId !== 'number') {
      throw new Error('sessionId 必须是数字')
    }
    if (typeof index !== 'number') {
      throw new Error('index 必须是数字')
    }
    if (typeof before !== 'number') {
      throw new Error('before 必须是数字')
    }
    if (typeof after !== 'number') {
      throw new Error('after 必须是数字')
    }
    const session = await Session.selectOne({ id: sessionId, userId: ws.userId })
    if (!session) {
      throw new Error('没有找到这个会话')
    }
    const clamp = (value: number) => Math.min(Math.max(value, 1), 5)
    const messages = await Message.select(
      { sessionId, index: { gte: index - clamp(before), lte: index + clamp(after) } },
      '"index" ASC',
    )
    if (messages.length === 0) {
      throw new Error('没有找到这些消息')
    }
    return messages.map(toMessage)
  } catch (error: any) {
    throw new Error(`获取更多消息失败, ${error.message}`)
  }
}
