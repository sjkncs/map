import { ref, reactive } from 'vue'

import type { DetailItem, LoveItem } from '@map/shared/types/map'
import { detailSearchApi } from './apis'

const isSearching = ref<boolean>(false)
const result = ref<DetailItem>()
const search = async (love: LoveItem) => {
  isSearching.value = true
  const res = await detailSearchApi(love.id)
  isSearching.value = false
  if (!res) return
  if (res.success) {
    result.value = {
      ...res.poi,
      shortAddress: res.poi.cityname + '·' + res.poi.adname,
      icon: love.icon,
    }
    return true
  } else {
    return false
  }
}

export default reactive({
  isSearching,
  result,
  search,
})
