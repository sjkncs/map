import { ref, reactive } from 'vue'

import { getUserApi } from './apis'

import customPoi from './modules/custom-poi'
import love from './modules/love'
import search from './modules/search'
import session from './modules/session'

const isLogined = ref<boolean>(false)
const pic = ref<string>('')
const name = ref<string>('')
const currentLocation = ref<string>('116.425,39.9056')
const adcode = ref<number>()
const get = async () => {
  const res = await getUserApi()
  if (!res) {
    return false
  }
  if (res.success) {
    isLogined.value = true
    name.value = res.user.name
    love.values = res.user.loves
    search.values = res.user.recentSearches
    customPoi.values = res.user.customPois
    return true
  } else {
    return false
  }
}
const logout = () => {
  isLogined.value = false
  pic.value = ''
  name.value = ''
  adcode.value = undefined
  love.values = []
  search.values = []
  customPoi.values = {}
  localStorage.removeItem('token')
}

export default reactive({
  isLogined,
  pic,
  name,
  currentLocation,
  adcode,
  get,
  logout,
  love,
  search,
  customPoi,
  session,
})
