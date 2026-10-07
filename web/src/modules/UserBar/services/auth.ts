import { loginApi, registerApi } from '../apis/auth'
import barStore from '@/stores/bar'
import userStore from '@/stores/user'

const handleAuth = async (res: any) => {
  if (!res) return
  alert(res.message)
  if (res.success) {
    localStorage.setItem('token', res.token)
    userStore.isLogined = true
    barStore.userbarIsVisible = false
    await userStore.get()
  }
  return res
}

export const login = async (name: string, password: string) => {
  const res = await loginApi({ name, password })
  return handleAuth(res)
}

export const register = async (name: string, password: string) => {
  const res = await registerApi({ name, password })
  return handleAuth(res)
}
