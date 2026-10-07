import { request } from '@/utils/request'

export const putCommonSearchApi = (data: any) =>
  request({
    url: '/api/user/common-searches',
    method: 'PUT',
    data,
  })

export const postaiSearchApi = (data: any) =>
  request({
    url: '/api/user/agent-searches',
    method: 'POST',
    data,
  })

export const deleteRecentSearchApi = (id: string) =>
  request({
    url: `/api/user/recent-searches/${id}`,
    method: 'DELETE',
  })

export const clearRecentSearchesApi = () =>
  request({
    url: '/api/user/recent-searches',
    method: 'DELETE',
  })
