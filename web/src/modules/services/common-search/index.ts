import type { SearchItem } from '@root/shared/types/map'
import commonSearchStore from '@/modules/stores/common-search'
import barStore from '@/stores/bar'
import userStore from '@/stores/user'

export const commonSearch = async (searchValue: string) => {
  const newSearch: SearchItem = {
    id: crypto.randomUUID(),
    name: searchValue,
    type: 'common',
    createdAt: new Date(),
  }
  barStore.openContentBar('common', { loveId: undefined, recentId: newSearch.id })
  const [addRes] = await Promise.all([
    userStore.search.add(newSearch),
    commonSearchStore.search(searchValue),
  ])
  if (!addRes) {
    barStore.recentId = undefined
  }
}
