import { throttle } from '@/utils/function'
import { httpInstance } from '@/utils/request'
import barStore from '@/stores/bar'
import modalStore from '@/stores/modal'
import userStore from '@/stores/user'

const throttleAlertNetworkError = throttle(() => {
  modalStore.open({ title: '网络错误', tip: '请重试' })
}, 500)
const throttleAlert401Error = throttle((text: string) => {
  userStore.logout()
  modalStore.open({ title: '验证失败', tip: text })
  modalStore.onClose = () => {
    barStore.userbarIsVisible = true
  }
}, 500)
httpInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const res = error.response
      if (res.status === 401) {
        throttleAlert401Error(res.data?.message)
      } else {
        modalStore.open({ title: '请求失败', tip: res.data?.message || '请求失败' })
      }
    } else {
      throttleAlertNetworkError()
    }
    return Promise.reject(error)
  },
)
