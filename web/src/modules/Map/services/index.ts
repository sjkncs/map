import AMapLoader from '@amap/amap-jsapi-loader'
import { computed, reactive, watch } from 'vue'

import type { LoveItem, DetailItem } from '@map/shared/types/map'
import commonSearchStore from '@/modules/stores/common-search'
import detailSearchStore from '@/modules/stores/detail-search'
import navStore from '@/modules/stores/nav'
import barStore from '@/stores/bar'
import userStore from '@/stores/user'

import { AMAP_CONFIG } from '@/../config'

let mapInstance: any = null

export const createMapManager = () => {
  if (mapInstance) return mapInstance
  // 初始化地图
  let AMap: any = null
  let map: any = null
  let geolocation: any = null
  let geocoder: any = null
  let driving: any = null
  let walking: any = null
  let transfer: any = null
  let riding: any = null
  const init = async (className: string) => {
    ;(window as any)._AMapSecurityConfig = {
      securityJsCode: AMAP_CONFIG.securityJsCode,
    }
    try {
      AMap = await AMapLoader.load({
        key: AMAP_CONFIG.key,
        version: '2.0',
        plugins: [
          'AMap.Geolocation',
          'AMap.Geocoder',
          'AMap.Driving',
          'AMap.Walking',
          'AMap.Transfer',
          'AMap.Riding',
        ],
      })
      map = new AMap.Map(className, {
        zoom: 16,
      })
      geolocation = new AMap.Geolocation({
        timeout: 10000,
        showCircle: false,
      })
      geocoder = new AMap.Geocoder()
      map.addControl(geolocation)
      geolocation.hide()
      driving = new AMap.Driving({ map, autoFitView: false })
      walking = new AMap.Walking({ map, autoFitView: false })
      riding = new AMap.Riding({ map, autoFitView: false })
      try {
        await locate()
      } catch {
        setTimeout(locate, 2000)
      }
    } catch (error: any) {
      alert(error.message)
    }
  }

  // 定位
  const locate = () => {
    return new Promise<void>((resolve, reject) => {
      geolocation.getCurrentPosition((status: any, result: any) => {
        if (status === 'complete') {
          map.setZoom(16)
          userStore.currentLocation = `${result.position.lng},${result.position.lat}`
          geocoder.getAddress(
            [result.position.lng, result.position.lat],
            (status: any, result: any) => {
              if (status === 'complete') {
                userStore.adcode = result.regeocode.addressComponent.adcode
                transfer ??= new AMap.Transfer({
                  map,
                  city: userStore.adcode,
                  autoFitView: false,
                })
                resolve()
              } else {
                reject(new Error('逆地理编码失败'))
              }
            },
          )
        } else {
          reject(new Error('定位失败'))
        }
      })
    })
  }

  // 点标记（自动更新）
  const getMarker = (poi: DetailItem | LoveItem) => {
    let marker: any
    if (poi.id === '0') {
      marker = new AMap.Marker({
        position: poi.location.split(',').map(Number),
      })
    } else {
      marker = new AMap.Marker({
        position: poi.location.split(',').map(Number),
        content: `<div class='marker'><span>${poi.icon}</span></div>`,
        offset: new AMap.Pixel(-20, -16),
      })
    }
    marker.on('click', async () => {
      navStore.pois = []
      barStore.sidebarIsOpen = true
      barStore.openContentBar('detail')
      if (poi.type === 'detail') {
        detailSearchStore.result = poi
      } else {
        await detailSearchStore.search(poi)
      }
    })
    return marker
  }
  const markers = computed<any[]>(() => {
    if (barStore.contentbarVisibles.nav || barStore.contentbarOldVisibles?.nav) {
      return navStore.pois.map((poi) => getMarker(poi))
    }
    if (
      (barStore.contentbarVisibles.detail || barStore.contentbarOldVisibles?.detail) &&
      detailSearchStore.result
    ) {
      return [getMarker(detailSearchStore.result)]
    }
    if (
      (barStore.contentbarVisibles.ai || barStore.contentbarOldVisibles?.ai) &&
      userStore.session.currentId
    ) {
      return (
        userStore.session.values
          .get(userStore.session.currentId)
          ?.pois?.map((poi) => getMarker(poi)) ?? []
      )
    }
    if (
      (barStore.contentbarVisibles.common || barStore.contentbarOldVisibles?.common) &&
      commonSearchStore.result
    ) {
      return commonSearchStore.result.map((poi: DetailItem) => getMarker(poi))
    }
    if (barStore.contentbarVisibles.love || barStore.contentbarOldVisibles?.love) {
      return userStore.love.values.map((poi) => getMarker(poi))
    }
    return []
  })
  watch(markers, (_, oldMarkers) => {
    map.remove(oldMarkers)
    map.add(markers.value)
    setFitView()
  })

  // 导航（自动更新）
  const navigate = () => {
    const type = navStore.type
    const service = { driving, walking, transfer, riding }[type]
    const points = navStore.pois.map((poi) => poi.location.split(',').map(Number))
    navStore.isNavigating = true
    if (type === 'driving') {
      service.search(
        points[0],
        points[points.length - 1],
        { waypoints: points.slice(1, points.length - 1) || [] },
        (status: string, result: any) => {
          if (status === 'complete') {
            navStore.route = result.routes[0]
          } else {
            alert('网络错误')
          }
          navStore.isNavigating = false
        },
      )
    } else {
      service.search(points[0], points[1], (status: string, result: any) => {
        if (status === 'complete') {
          if (type === 'walking' || type === 'riding') {
            navStore.route = result.routes[0]
          } else {
            navStore.route = result.plans?.[0]
          }
        } else {
          alert('网络错误')
        }
        navStore.isNavigating = false
      })
    }
  }
  watch(
    [() => navStore.pois, () => navStore.type],
    () => {
      driving?.clear()
      walking?.clear()
      transfer?.clear()
      riding?.clear()
      if (navStore.pois.length < 2) {
        navStore.route = undefined
        return
      }
      navigate()
    },
    { deep: true },
  )

  // 切换视图
  const setFitView = () => {
    if (barStore.sidebarIsOpen) {
      map.setFitView(
        markers.value,
        false,
        [100, 100, 450 + window.innerHeight * 0.04 + 100, 100],
        16,
      )
    } else {
      map.setFitView(markers.value, false, [100, 100, 100, 100], 16)
    }
  }
  watch(() => barStore.sidebarIsOpen, setFitView)

  mapInstance = reactive({
    init,
    locate,
    markers,
    setFitView,
  })

  return mapInstance
}
