import { AxiosResponse } from 'axios'

import { createError } from '@/modules/utils/error'

export const search = async (
  api: (params: Record<string, unknown>) => Promise<AxiosResponse>,
  params: Record<string, unknown>,
): Promise<any[]> => {
  const res = await api(params)
  if (res.data.status !== '1') {
    throw createError('高德服务异常', 502)
  }
  return res.data.pois ?? []
}
