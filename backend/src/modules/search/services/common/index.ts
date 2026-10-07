import { createError } from '@/modules/utils/error'
import { globalSearchApi, aroundSearchApi } from '../apis'
import { search } from '../modules/search'

export const commonSearch = async (searchValue: unknown, currentLocation: unknown) => {
  if (typeof searchValue !== 'string') {
    throw createError('搜索值必须是字符串', 400)
  }
  if (typeof currentLocation !== 'string') {
    throw createError('当前位置必须是字符串', 400)
  }

  const aroundPois = await search(aroundSearchApi, {
    keywords: searchValue,
    location: currentLocation,
    radius: 50000,
    offset: 15,
    sortrule: 'distance',
    extensions: 'all',
  })
  if (aroundPois.length >= 5) {
    return aroundPois
  }

  const globalPois = await search(globalSearchApi, {
    keywords: searchValue,
    offset: 5,
    children: 1,
    extensions: 'all',
  })
  const existingIds = new Set(aroundPois.map((poi) => poi.id))
  const filteredGlobalPois = globalPois.filter((poi) => !existingIds.has(poi.id))
  return [...filteredGlobalPois, ...aroundPois]
}
