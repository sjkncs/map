import { request } from '@/utils/request'

export const detailSearchApi = (id: string) =>
  request({
    url: `/api/search/detail/${id}`,
    method: 'GET',
  })
