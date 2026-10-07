import type { Environment } from '../../../../types'
import type { NavType } from '@map/shared/types/map'
import { poiIcons } from '@map/shared/services/poi'
import { findPois } from '../modules/poi'

export const showPois = ({ ids }: { ids: string[] }, { ws, messages }: Environment) => {
  try {
    const existingPois = findPois(messages, ids)
    if (existingPois.length < ids.length) {
      throw new Error('有地点未在消息记录中找到')
    }
    const pois = existingPois.map((poi) => ({
      ...poi,
      shortAddress: poi.cityname + '·' + poi.adname,
      icon: poiIcons[poi.typecode.slice(0, 2)],
    }))

    messages.push({ role: 'poi', pois })
    ws.send(JSON.stringify({ action: 'showPois', args: { pois } }))
    return '展示地点成功'
  } catch (error: any) {
    throw new Error(`展示地点失败, ${error.message}`)
  }
}

export const navigate = (
  { ids, type }: { ids: string[]; type: NavType },
  { ws, currentLocation, messages }: Environment,
) => {
  try {
    if (ids.length < 2) {
      throw new Error('至少要有起点和终点')
    }
    const myPoiIndex = ids.findIndex((id) => id === '0')
    const filteredIds = ids.filter((id) => id !== '0')
    const pois = findPois(messages, filteredIds).map((poi) => ({
      ...poi,
      shortAddress: poi.cityname + '·' + poi.adname,
      icon: poiIcons[poi.typecode.slice(0, 2)],
    }))
    if (pois.length < filteredIds.length) {
      throw new Error('有地点未在消息记录中找到')
    }
    if (myPoiIndex !== -1) {
      const myPoi = {
        id: '0',
        name: '我的位置',
        shortAddress: '',
        location: currentLocation,
        icon: '📍',
      }
      pois.splice(myPoiIndex, 0, myPoi)
    }
    messages.push({ role: 'nav', pois, type })
    ws.send(JSON.stringify({ action: 'navigate', args: { pois, type } }))
    return '导航成功'
  } catch (error: any) {
    throw new Error(`导航失败, ${error.message}`)
  }
}

export const showOptions = async (
  { options }: { options: string[] },
  { ws, messages }: Environment,
) => {
  try {
    if (options.length < 2) {
      throw new Error('至少要有 2 个选项')
    }
    if (options.length > 4) {
      throw new Error('至多给出 4 个选项')
    }
    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role === 'assistant' && !lastMessage.content) {
      throw new Error('必须先问问题再展示选项')
    }
    messages.push({ role: 'option', options })
    ws.send(JSON.stringify({ action: 'showOptions', args: { options } }))
    return '展示选项成功'
  } catch (error: any) {
    throw new Error(`展示选项失败, ${error.message}`)
  }
}
