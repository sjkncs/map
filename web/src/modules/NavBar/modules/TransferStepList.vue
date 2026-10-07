<script setup lang="ts">
import { FoldList } from 'lovelymaid'
import { computed, ref, watch } from 'vue'

import { formatDistance } from '@/modules/utils/distance'
import navStore, { type Segment } from '@/modules/stores/nav'
import userStore from '@/stores/user'

// 步骤
const segments = computed<Segment[] | undefined>(() => {
  if (navStore.route) {
    if ('segments' in navStore.route) {
      let index: number = -1
      return navStore.route.segments.map((segment) => {
        if (segment.transit_mode === 'WALK') {
          return segment
        } else {
          index++
          return {
            ...segment,
            index,
          }
        }
      })
    }
  }
})
const stopSegments = computed<Segment[] | undefined>(() => {
  if (segments.value) {
    return segments.value.filter((segment) => segment.transit_mode !== 'WALK')
  }
})

// 渲染列表
const list = computed<any[] | undefined>(() => {
  if (!segments.value) return
  return [navStore.pois[0], ...segments.value, navStore.pois[1]]
})

// 站点列表
const isOpen = ref<boolean[]>([])
watch(stopSegments, (newStopSegements) => {
  if (newStopSegements) {
    isOpen.value = Array(newStopSegements.length).fill(false)
  }
})
const stopList = computed<{ id: string; name: string }[][] | undefined>(() => {
  if (stopSegments.value) {
    const result: { id: string; name: string }[][] = []
    stopSegments.value.forEach((segment) => {
      const { on_station, arrival_stop, via_stops, off_station, departure_stop } = segment.transit
      const oneLine: { id: string; name: string }[] = [
        {
          id: on_station?.id || departure_stop?.id,
          name: on_station?.name || departure_stop?.name,
        },
      ]
      via_stops.forEach((stop: any) => {
        oneLine.push({ id: stop.id, name: stop.name })
      })
      oneLine.push({
        id: off_station?.id || arrival_stop?.id,
        name: off_station?.name || arrival_stop?.name,
      })
      result.push(oneLine)
    })
    return result
  }
})
</script>

<template>
  <ul class="TransferStepList">
    <div class="container" v-for="(item, index) in list" :key="index">
      <li class="item" v-if="item.instruction" :class="{ stop: item.transit_mode !== 'WALK' }">
        <div class="icon-container">
          <span class="iconfont" :class="`icon-${navStore.stepIcons[item.transit_mode]}`"></span>
        </div>
        <div class="content">
          <h5>{{ formatDistance(item.distance) }}</h5>
          <p>
            {{
              item.transit_mode === 'WALK'
                ? item.instruction
                : item.transit_mode === 'SUBWAY'
                  ? item.transit.lines[0].name
                  : item.transit_mode === 'RAILWAY'
                    ? item.transit.name
                    : ''
            }}
          </p>
          <FoldList
            class="FoldList"
            v-if="item.transit_mode !== 'WALK'"
            :title="`途径${item.transit.via_stops.length + 2}站`"
            :list="stopList?.[item.index] ?? []"
            :open="isOpen[item.index] ?? false"
            @update:open="(val: boolean) => (isOpen[item.index] = val)"
            :onHeaderClick="() => (isOpen[item.index] = !isOpen[item.index])"
          />
        </div>
      </li>
      <li class="item" v-else>
        <div class="icon-container">
          <div class="icon">
            <span>{{ item.icon }}</span>
          </div>
        </div>
        <div class="content">
          <h5>{{ userStore.customPoi.aliasOf(item.id, item.name) }}</h5>
          <p>{{ item.shortAddress }}</p>
        </div>
      </li>
    </div>
  </ul>
</template>

<style scoped>
.TransferStepList {
  background-color: #fff;
  backdrop-filter: blur(10px) saturate(1.5);
  border-radius: 16px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
}

.item {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding-right: 10px;
}

.item .icon-container {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
}

.item.stop .icon-container {
  margin-top: 10px;
}

.item .icon-container .iconfont {
  font-size: 20px;
}

.item .content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  height: 50px;
}

.item.stop .content {
  height: auto;
}

.container:not(:last-child) .item .content {
  border-bottom: 1px solid #cdccc2;
}

.item .content h5 {
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item.stop .content h5 {
  margin-top: 10px;
}

.item .content p {
  font-size: 10px;
  line-height: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item .content .FoldList {
  --header-height: 20px;
  --title-font-size: 10px;
  --title-color: #3b86f7;
  --list-font-size: 10px;
  --list-line-height: 16px;
  margin-bottom: 10px;
}
</style>
