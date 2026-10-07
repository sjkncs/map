import type { NavType, DetailItem } from '@map/shared/types/map'
import navStore from '@/modules/stores/nav'
import barStore from '@/stores/bar'
import userStore from '@/stores/user'

export const showPois = (
  { pois }: { pois: DetailItem[] },
  { sessionId }: { sessionId: number | 'pending' },
) => {
  const session = userStore.session.values.get(sessionId)
  if (!session) return
  session.messages.push({ role: 'poi', pois })
  session.pois = pois
}

export const navigate = (
  { pois, type }: { pois: DetailItem[]; type: NavType },
  { sessionId }: { sessionId: number | 'pending' },
) => {
  const session = userStore.session.values.get(sessionId)
  if (!session) return
  session.messages.push({ role: 'nav', pois, type })
  barStore.openContentBar('nav')
  navStore.pois = pois
  navStore.type = type
}

export const showOptions = (
  { options }: { options: string[] },
  { sessionId }: { sessionId: number | 'pending' },
) => {
  const session = userStore.session.values.get(sessionId)
  if (!session) return
  session.messages.push({ role: 'option', options })
}
