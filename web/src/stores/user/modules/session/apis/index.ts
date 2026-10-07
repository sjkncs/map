import { request } from '@/utils/request'

export const getSessionApi = (id: number) =>
  request({
    url: `/api/user/session/${id}`,
    method: 'GET',
  })
