import { request } from '@/utils/request'

export const getUserApi = () =>
  request({
    url: '/api/user',
    method: 'GET',
  })
