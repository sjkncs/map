import type { AxiosRequestConfig } from 'axios'

import { httpInstance } from './modules/http'

httpInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export { httpInstance }

type ApiResult = {
  success: boolean
  message: string
  [key: string]: any
}
export const request = <T = ApiResult>(config: AxiosRequestConfig): Promise<T | undefined> =>
  httpInstance.request(config) as Promise<T | undefined>
