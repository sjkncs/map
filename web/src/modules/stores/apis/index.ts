import { request } from '@/utils/request'

export const commonSearchApi = (params: any) =>
  request({
    url: '/api/search/common',
    method: 'GET',
    params,
  })
