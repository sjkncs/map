import { reactive, ref } from 'vue'

import type { SessionItem } from '@root/shared/types/ai'
import { getSessionApi } from './apis'

// 会话
const currentId = ref<number | 'pending'>()
const values = ref(new Map<number | 'pending', SessionItem>())
const get = async (id: number) => {
  const res = await getSessionApi(id)
  if (!res) {
    return false
  }
  if (res.success) {
    values.value.set(id, { ...res.session, isSearching: false })
    return true
  } else {
    return false
  }
}

export default reactive({
  currentId,
  values,
  get,
})
