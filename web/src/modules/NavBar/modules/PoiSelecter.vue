<script setup lang="ts">
import { Select } from 'lovelymaid'
import { computed } from 'vue'

import type { DetailItem, LoveItem } from '@map/shared/types/map'
import navStore from '@/modules/stores/nav'
import barStore from '@/stores/bar'
import userStore from '@/stores/user'

// 导航地点
const navPois = computed<(LoveItem | DetailItem)[]>(() => {
  if (navStore.type === 'driving') {
    return navStore.pois
  } else {
    return navStore.pois.slice(0, 2)
  }
})
const addPoi = () => {
  barStore.openContentBar('waypoint')
  navStore.editingIndex = undefined
}
const editPoi = (index: number) => {
  barStore.openContentBar('waypoint')
  navStore.editingIndex = index
}

// 操作按钮
const actionOptions = [{ id: '1', name: '删除', icon: 'icon-delete' }]
const clickOption = (option: unknown, index: number) => {
  const action = option as (typeof actionOptions)[number]
  if (action.name === '删除') {
    navStore.pois.splice(index, 1)
  }
}
</script>

<template>
  <ul class="PoiSelector">
    <li class="item" v-for="(poi, index) in navPois" :key="poi.id" @click="() => editPoi(index)">
      <div class="icon-container">
        <div class="icon">
          <span>{{ poi.icon }}</span>
        </div>
      </div>
      <div class="content">
        <div class="text">
          <h5>{{ userStore.customPoi.aliasOf(poi.id, poi.name) }}</h5>
          <p>{{ poi.shortAddress }}</p>
        </div>
        <Select
          class="Select"
          :z-index="2"
          :options="actionOptions"
          :on-option-click="(action) => clickOption(action, index)"
          v-slot:item="{ item }"
        >
          <span :class="['iconfont', item.icon]"></span>
        </Select>
      </div>
    </li>
    <li class="item add" v-if="navStore.type === 'driving'" @click="addPoi">
      <div class="icon-container">
        <div class="icon"><span class="iconfont icon-add"></span></div>
      </div>
      <div class="content">
        <div class="text">
          <h5>添加停靠点</h5>
        </div>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.PoiSelector {
  background-color: #eee;
  backdrop-filter: blur(10px) saturate(1.5);
  border-radius: 16px;
}

.item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 50px;
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

.item .icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  background-color: #fff;
  border-radius: 50%;
  font-size: 14px;
}

.item.add .icon {
  background-color: #3b86f7;
  color: #fff;
}

.item.add .icon .icon-add {
  transform: translateY(1px);
}

.item .content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  height: 100%;
}

.item:not(:last-child) .content {
  border-bottom: 1px solid #cdccc2;
}

.item .content .text {
  flex: 1;
  min-width: 0;
}

.item.add .content .text h5 {
  color: #3b86f7;
}

.item .content h5 {
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item .content p {
  font-size: 10px;
  line-height: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.Select {
  width: 20px;
  height: 20px;
}
</style>
