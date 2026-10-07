import { createError } from '@/modules/utils/error'
import { detailSearchApi } from '../apis'
import { search } from '../modules/search'

export const detailSearch = async (id: unknown) => {
  if (typeof id !== 'string') {
    throw createError('ID 格式不正确', 400)
  }
  const pois = await search(detailSearchApi, { id })
  return pois[0]
}
