import { ref, reactive, readonly } from 'vue'

// 侧边栏
type ActiveIdRecord = {
  loveId?: string | number | undefined
  recentId?: string | number | undefined
}
const sidebarIsOpen = ref<boolean>(true)
const loveId = ref<string | number>()
const recentId = ref<string | number>()
const activeIdRecords = ref<ActiveIdRecord[]>([])

// 内容栏
type Bar = 'love' | 'recentsearch' | 'common' | 'ai' | 'detail' | 'nav' | 'waypoint'
const contentbarOldVisibles = ref<Record<Bar, boolean>>()
const contentbarVisibles = ref<Record<Bar, boolean>>({
  love: false,
  recentsearch: false,
  common: false,
  ai: false,
  detail: false,
  nav: false,
  waypoint: false,
})
const saveContentBarVisibles = () => {
  contentbarOldVisibles.value = { ...contentbarVisibles.value }
}
const recoverContentBarVisibles = () => {
  if (!contentbarOldVisibles.value) return
  contentbarVisibles.value = contentbarOldVisibles.value
}
const contentbarGroups: Bar[][] = [
  ['love', 'recentsearch'],
  ['common', 'ai'],
  ['detail'],
  ['nav'],
  ['waypoint'],
]
const findGroupIndex = (bar: Bar): number => {
  const index = contentbarGroups.findIndex((group) => group.includes(bar))
  if (index === -1) {
    throw new Error('没有找到 Bar')
  }
  return index
}
const openContentBar = (bar: Bar, newActiveIdRecord?: ActiveIdRecord) => {
  const index = findGroupIndex(bar)
  if (newActiveIdRecord) {
    if (Object.hasOwn(newActiveIdRecord, 'loveId')) {
      loveId.value = newActiveIdRecord.loveId
    }
    if (Object.hasOwn(newActiveIdRecord, 'recentId')) {
      recentId.value = newActiveIdRecord.recentId
    }
  }
  activeIdRecords.value[index] = {
    loveId: loveId.value,
    recentId: recentId.value,
    ...newActiveIdRecord,
  }
  for (let i = index; i < contentbarGroups.length; i++) {
    const group = contentbarGroups[i]
    group.forEach((bar) => {
      contentbarVisibles.value[bar] = false
    })
  }
  contentbarVisibles.value[bar] = true
}
const closeContentBar = (bar: Bar) => {
  const index = findGroupIndex(bar)
  let recoveringIndex: number | undefined
  for (let i = index - 1; i >= 0; i--) {
    const group = contentbarGroups[i]
    for (let j = 0; j < group.length; j++) {
      if (contentbarVisibles.value[group[j]]) {
        recoveringIndex = i
        break
      }
    }
    if (recoveringIndex !== undefined) break
  }
  const recoveringActiveId =
    recoveringIndex !== undefined
      ? activeIdRecords.value[recoveringIndex]
      : { loveId: undefined, recentId: undefined }
  loveId.value = recoveringActiveId?.loveId
  recentId.value = recoveringActiveId?.recentId
  contentbarVisibles.value[bar] = false
}
const closeAllContentBar = () => {
  for (const key of Object.keys(contentbarVisibles.value) as Bar[]) {
    contentbarVisibles.value[key] = false
  }
}

// 用户栏
const userbarIsVisible = ref<boolean>(false)

export default reactive({
  sidebarIsOpen,
  loveId,
  recentId,
  contentbarOldVisibles: readonly(contentbarOldVisibles),
  contentbarVisibles: readonly(contentbarVisibles),
  saveContentBarVisibles,
  recoverContentBarVisibles,
  openContentBar,
  closeContentBar,
  closeAllContentBar,
  userbarIsVisible,
})
