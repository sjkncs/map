import { request } from '@/utils/request'

export const postLoveApi = (data: any) =>
  request({
    url: '/api/user/loves',
    method: 'POST',
    data,
  })

export const deleteLoveApi = (id: string) =>
  request({
    url: `/api/user/loves/${id}`,
    method: 'DELETE',
  })
