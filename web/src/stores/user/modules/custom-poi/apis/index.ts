import { request } from '@/utils/request'

export const patchCustomPoiApi = (data: any) =>
  request({
    url: '/api/user/custom-pois',
    method: 'PATCH',
    data,
  })

export const deleteCustomPoiApi = (id: string) =>
  request({
    url: `/api/user/custom-pois/${id}`,
    method: 'DELETE',
  })
