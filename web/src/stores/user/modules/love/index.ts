import { reactive, ref } from 'vue'

import { LoveItem } from '@root/shared/types/map'
import { deleteLoveApi, postLoveApi } from './apis'

// 用户收藏
const values = ref<LoveItem[]>([])
export const add = async (love: LoveItem) => {
  const oldValues = [...values.value]
  values.value.unshift(love)
  const res = await postLoveApi({ love })
  if (!res) {
    values.value = oldValues
    return false
  }
  if (res.success) {
    return true
  } else {
    values.value = oldValues
    return false
  }
}
export const remove = async (id: string) => {
  const oldValues = [...values.value]
  values.value = values.value.filter((value) => value.id !== id)
  const res = await deleteLoveApi(id)
  if (!res) {
    values.value = oldValues
    return false
  }
  if (res.success) {
    return true
  } else {
    values.value = oldValues
    return false
  }
}

export default reactive({
  values,
  add,
  remove,
})
