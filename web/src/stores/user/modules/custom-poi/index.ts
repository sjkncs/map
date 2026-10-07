import { reactive, ref } from 'vue'

import { deleteCustomPoiApi, patchCustomPoiApi } from './apis'

// 自定义地点信息
type CustomPoiValue = {
  name: string
  location: string
  alias?: string
  description?: string
}
const values = ref<Record<string, CustomPoiValue>>({})
const aliasOf = (id: string, name: string) => values.value[id]?.alias || name
const set = async (id: string, customPoiValue: CustomPoiValue) => {
  const oldValue = { ...values.value[id] }
  values.value[id] = customPoiValue
  const res = await patchCustomPoiApi({ customPoi: { id, ...customPoiValue } })
  if (!res) {
    values.value[id] = oldValue
    return false
  }
  if (res.success) {
    return true
  } else {
    console.log(oldValue)
    values.value[id] = oldValue
    return false
  }
}
const remove = async (id: string) => {
  const oldValue = values.value[id]
  delete values.value[id]
  const res = await deleteCustomPoiApi(id)
  if (!res) {
    values.value[id] = oldValue
    return false
  }
  if (res.success) {
    return true
  } else {
    values.value[id] = oldValue
    return false
  }
}

export default reactive({
  values,
  aliasOf,
  set,
  remove,
})
