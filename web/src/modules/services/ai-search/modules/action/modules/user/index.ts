import type { CustomPoiItem, LoveItem } from '@map/shared/types/map'
import userStore from '@/stores/user'

export const postLoves = ({ loves }: { loves: LoveItem[] }) => {
  userStore.love.values.unshift(...loves)
}

export const deleteLoves = ({ ids }: { ids: string[] }) => {
  const set = new Set(ids)
  userStore.love.values = userStore.love.values.filter((love) => !set.has(love.id))
}

export const putRecentCustomPoi = ({ customPoi }: { customPoi: CustomPoiItem }) => {
  const { id, ...customPoiContent } = customPoi
  userStore.customPoi.values[id] = customPoiContent
}

export const deleteCustomPois = ({ ids }: { ids: string[] }) => {
  ids.forEach((id) => delete userStore.customPoi.values[id])
}
