import { createError } from '@/modules/utils/error'
import { CustomPoi, Description, Love, RecentSearch, Session, User } from '@/tables'
import { verifyLove, verifyCustomPoi } from './modules/verify'

export const getUser = async (userId: number) => {
  const user = await User.selectOne({ id: userId })
  if (!user) {
    throw createError('用户不存在', 404)
  }
  const [loves, recentSearches, customPois, descriptions, sessions] = await Promise.all([
    Love.select({ userId }, 'created_at DESC'),
    RecentSearch.select({ userId }, 'created_at DESC'),
    CustomPoi.select({ userId }),
    Description.select({ userId }),
    Session.select({ userId }),
  ])
  const map = new Map(sessions.map((session) => [session.recentSearchId, session.id]))
  const recentSearchesWithSession = recentSearches.map((search) => ({
    ...search,
    sessionId: map.get(search.id),
  }))
  const customPoisObj: Record<string, any> = {}
  for (const { id, ...rest } of customPois) {
    customPoisObj[id] = rest
  }
  return {
    id: user.id,
    name: user.name,
    loves,
    recentSearches: recentSearchesWithSession,
    customPois: customPoisObj,
    descriptions,
  }
}

export const postLove = async (userId: number, love: unknown) => {
  const result = verifyLove(love)
  if (!result.success) {
    throw createError(result.error.issues[0].message, 400)
  }
  const { id, name, shortAddress, location, icon } = result.data
  try {
    return await Love.insert({ id, userId, name, shortAddress, location, icon })
  } catch (error: any) {
    if (error.code === '23505') {
      throw createError('收藏已存在', 409)
    }
    throw error
  }
}

export const deleteLove = async (userId: number, id: unknown) => {
  if (typeof id !== 'string') {
    throw createError('id 必须为字符串', 400)
  }
  const deleted = await Love.delete({ userId, id })
  if (!deleted) {
    throw createError('没有符合的收藏', 404)
  }
}

export const putCommonSearch = async (userId: number, id: unknown, searchValue: unknown) => {
  if (typeof id !== 'string' || typeof searchValue !== 'string') {
    throw createError('id 和搜索值必须是字符串', 400)
  }
  await RecentSearch.delete({ userId, name: searchValue })
  await RecentSearch.insert({ userId, id, name: searchValue, type: 'common' })
}

export const postAiSearch = async (userId: number, id: unknown, searchValue: unknown) => {
  if (typeof id !== 'string' || typeof searchValue !== 'string') {
    throw createError('id 和搜索值必须是字符串', 400)
  }
  const searchId = await RecentSearch.insert({ userId, id, name: searchValue, type: 'ai' })
  const sessionId = await Session.insert({
    userId,
    recentSearchId: searchId,
  })
  return sessionId
}

export const deleteRecentSearch = async (userId: number, id: unknown) => {
  if (typeof id !== 'string') {
    throw createError('id 必须为字符串', 400)
  }
  const deleted = await RecentSearch.delete({ userId, id })
  if (!deleted) {
    throw createError('没有符合的最近搜索', 404)
  }
}

export const clearRecentSearches = async (userId: number) => {
  await RecentSearch.delete({ userId })
}

export const patchCustomPoi = async (userId: number, customPoi: unknown) => {
  const result = verifyCustomPoi(customPoi)
  if (!result.success) {
    throw createError(result.error.issues[0].message, 400)
  }
  const { id, name, alias, location, description } = result.data
  await CustomPoi.set({ id, userId, name, location, alias, description }, ['id', 'userId'])
}

export const deleteCustomPoi = async (userId: number, id: unknown) => {
  if (typeof id !== 'string') {
    throw createError('id 必须为字符串', 400)
  }
  const deleted = await CustomPoi.delete({ userId, id })
  if (!deleted) {
    throw createError('没有符合的自定义地点', 404)
  }
}
