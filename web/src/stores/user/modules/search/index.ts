import { reactive, ref } from 'vue'

import type { SearchItem } from '@root/shared/types/map'
import {
  clearRecentSearchesApi,
  deleteRecentSearchApi,
  postaiSearchApi,
  putCommonSearchApi,
} from './apis'

const values = ref<SearchItem[]>([])
const add = async (newSearch: SearchItem) => {
  if (newSearch.name === '') {
    return false
  }
  const oldValues = [...values.value]
  let res: any
  if (newSearch.type === 'common') {
    const index = values.value.findIndex((search) => search.name === newSearch.name)
    if (index === -1) {
      values.value.unshift(newSearch)
    } else {
      values.value.splice(index, 1)
      values.value.unshift(newSearch)
    }
    res = await putCommonSearchApi({ id: newSearch.id, name: newSearch.name })
  } else {
    values.value.unshift(newSearch)
    res = await postaiSearchApi({ id: newSearch.id, name: newSearch.name })
  }
  if (!res) {
    values.value = oldValues
    return false
  }
  if (res.success) {
    if (newSearch.type === 'ai') {
      newSearch.sessionId = res.sessionId
    }
    return true
  } else {
    values.value = oldValues
    return false
  }
}
const remove = async (id: string) => {
  const oldRecentSearches = [...values.value]
  values.value = values.value.filter((value) => value.id !== id)
  const res = await deleteRecentSearchApi(id)
  if (!res) {
    values.value = oldRecentSearches
    return false
  }
  if (res.success) {
    return true
  } else {
    values.value = oldRecentSearches
    return false
  }
}
const clear = async () => {
  const oldRecentSearches = [...values.value]
  values.value = []
  const res = await clearRecentSearchesApi()
  if (!res) {
    values.value = oldRecentSearches
    return false
  }
  if (res.success) {
    return true
  } else {
    values.value = oldRecentSearches
    return false
  }
}

export default reactive({
  values,
  add,
  remove,
  clear,
})
