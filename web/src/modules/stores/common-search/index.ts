import { ref, reactive } from 'vue'

import type { DetailItem } from '@map/shared/types/map'
import { commonSearchApi } from '../apis'
import userStore from '@/stores/user'
import { poiIcons } from '@map/shared/services/poi'

const isSearching = ref<boolean>(false)
const value = ref<string>('')
const result = ref<DetailItem[]>([])
const search = async (searchValue: string) => {
  if (searchValue === '') {
    return false
  }
  isSearching.value = true
  const res = await commonSearchApi({
    keyword: searchValue,
    currentLocation: userStore.currentLocation,
  })
  isSearching.value = false
  if (!res) {
    return false
  }
  if (res.success) {
    value.value = searchValue
    result.value = res.pois.map((poi: any) => ({
      ...poi,
      shortAddress: poi.cityname + '·' + poi.adname,
      icon: poiIcons[poi.typecode.slice(0, 2)],
    }))
    return true
  } else {
    return false
  }
}

export default reactive({
  isSearching,
  value,
  result,
  search,
})
