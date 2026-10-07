import { webSearchApi } from './apis/web'
import { globalSearchApi, aroundSearchApi, detailSearchApi } from '@/modules/search/services/apis'

export const globalSearch = async ({ keywords }: { keywords: string }) => {
  try {
    const res = await globalSearchApi({ keywords, offset: 5, children: 1, extensions: 'all' })
    if (res.data.status !== '1') {
      throw new Error(res.data.info)
    }
    return res.data.pois || []
  } catch (error: any) {
    throw new Error(`全局搜索失败, ${error.message}`)
  }
}

export const aroundSearch = async ({
  keywords,
  location,
  radius = 20000,
}: {
  keywords: string
  location: string
  radius: number
}) => {
  try {
    const res = await aroundSearchApi({
      keywords,
      location,
      radius,
      offset: 15,
      sortrule: 'distance',
      extensions: 'all',
    })
    if (res.data.status !== '1') {
      throw new Error(res.data.info)
    }
    res.data.pois?.forEach((poi: any) => {
      delete poi.distance
    })
    return res.data.pois || []
  } catch (error: any) {
    throw new Error(`周边搜索失败, ${error.message}`)
  }
}

export const detailSearch = async ({ id }: { id: string }) => {
  try {
    const res = await detailSearchApi({ id })
    if (res.data.status !== '1') {
      throw new Error(res.data.info)
    }
    return res.data.pois?.[0] || {}
  } catch (error: any) {
    throw new Error(`详情搜索失败, ${error.message}`)
  }
}

export const webSearch = async ({ keywords }: { keywords: string }) => {
  try {
    const res = await webSearchApi({ query: keywords })
    return res.data.data.webPages.value || []
  } catch (error: any) {
    throw new Error(`网络搜索失败, ${error.message}`)
  }
}
