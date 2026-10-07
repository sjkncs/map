import { request } from '@/utils/request'

export const loginApi = (data: any) =>
  request({
    url: `/api/auth/login`,
    method: 'POST',
    data,
  })

export const registerApi = (data: any) =>
  request({
    url: `/api/auth/register`,
    method: 'POST',
    data,
  })
