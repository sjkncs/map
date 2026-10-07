import { ref, reactive } from 'vue'

import type { LoveItem, NavType, DetailItem } from '@map/shared/types/map'
import { commonSearchApi } from '../apis'
import userStore from '@/stores/user'
import { poiIcons } from '@root/shared/services/poi'

export type Step = {
  action: string
  assistant_action: string
  distance: string
}
export type Ride = {
  action: string
  assistant_action: undefined
  distance: string
}
export type Segment = {
  distance: string
  transit: any
  transit_mode: 'WALK' | 'SUBWAY' | 'RAILWAY'
}
export type DrivingAndWalkingRoute = {
  distance: string
  time: string
  steps: Step[]
}
export type RidingRoute = {
  distance: string
  time: string
  rides: Ride[]
}
export type TransferRoute = {
  distance: string
  time: string
  segments: Segment[]
}
const stepIcons: Record<string, string> = {
  直行: 'straight',
  右转: 'turn-right',
  左转: 'turn-left',
  靠右: 'keep-right',
  靠左: 'keep-left',
  向右前方行驶: 'towards-right',
  向右前方行走: 'towards-right',
  向左前方行驶: 'towards-left',
  向左前方行走: 'towards-left',
  向右后方行驶: 'backwards-right',
  向左后方行驶: 'backwards-left',
  左转调头: 'left-back',
  进入环岛: 'enter-circle',
  离开环岛: 'leave-circle',
  减速行驶: 'slow',
  WALK: 'walk',
  SUBWAY: 'transfer',
  BUS: 'bus',
  RAILWAY: 'railway',
  '': 'arrive',
}

// 导航
const isNavigating = ref<boolean>(false)
const pois = ref<(LoveItem | DetailItem)[]>([])
const type = ref<NavType>('driving')
const route = ref<DrivingAndWalkingRoute | RidingRoute | TransferRoute>()

// 途经点
const isSearching = ref<boolean>(false)
const editingIndex = ref<number>()
const waypoints = ref<DetailItem[]>([])
const waypointSearch = async (searchValue: string) => {
  if (searchValue === '') return
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
    waypoints.value = res.pois.map((poi: any) => ({
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
  stepIcons,
  isNavigating,
  pois,
  type,
  route,
  isSearching,
  editingIndex,
  waypoints,
  waypointSearch,
})
