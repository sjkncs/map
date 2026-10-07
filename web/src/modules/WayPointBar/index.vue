<script setup lang="ts">
import { ContentBar, Input } from 'lovelymaid'
import { computed, ref, watch } from 'vue'

import type { LoveItem, DetailItem } from '@map/shared/types/map'
import navStore from '@/modules/stores/nav'
import barStore from '@/stores/bar'
import userStore from '@/stores/user'

import PoiList from '../modules/PoiList.vue'

// 点击关闭
const onCloseClick = () => {
  barStore.closeContentBar('waypoint')
}

// 搜索停靠点
const InputRef = ref<InstanceType<typeof Input> | null>(null)
const inputValue = ref<string>('')
watch(
  () => barStore.contentbarVisibles.waypoint,
  (newStatus, oldStatus) => {
    if (newStatus && !oldStatus) {
      const editingIndex = navStore.editingIndex
      inputValue.value = typeof editingIndex === 'number' ? navStore.pois[editingIndex].name : ''
      InputRef.value?.focus()
      requestAnimationFrame(() => {
        InputRef.value?.select()
      })
    }
  },
)

// 我的位置
const myPoi = computed<LoveItem>(() => ({
  id: '0',
  name: '我的位置',
  shortAddress: '',
  location: userStore.currentLocation,
  icon: '📍',
  type: 'love',
}))
const clickMyPoi = () => {
  barStore.closeContentBar('waypoint')
  if (typeof navStore.editingIndex === 'number') {
    navStore.pois[navStore.editingIndex] = myPoi.value
  } else {
    navStore.pois.push(myPoi.value)
  }
}

// 点击地点
const onPoiClick = (poi: DetailItem) => {
  barStore.closeContentBar('waypoint')
  if (typeof navStore.editingIndex === 'number') {
    navStore.pois[navStore.editingIndex] = poi
  } else {
    navStore.pois.push(poi)
  }
}
</script>

<template>
  <ContentBar
    class="ContentBar"
    :visible="!barStore.userbarIsVisible"
    :is-open="barStore.contentbarVisibles.waypoint"
    :on-close-click="onCloseClick"
    :loading="navStore.isSearching"
  >
    <Input
      class="Input"
      ref="InputRef"
      v-model:value="inputValue"
      placeholder="添加停靠点"
      enterkeyhint="search"
      :onEnter="() => navStore.waypointSearch(inputValue)"
    >
      <span class="iconfont icon-search"></span>
    </Input>
    <li class="item" @click.stop="() => clickMyPoi()">
      <div class="icon-container">
        <div class="icon"><span>📍</span></div>
      </div>
      <div class="content">
        <h5>我的位置</h5>
      </div>
    </li>
    <PoiList class="Poilist" :pois="navStore.waypoints" :on-poi-click="onPoiClick" />
  </ContentBar>
</template>

<style scoped>
.Input {
  height: 40px;
  margin: 10px 10px 20px 10px;
}

.Input .icon-search {
  transform: translate(0, -1px);
}

.item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 50px;
  padding-right: 10px;
  background-color: #eee;
  backdrop-filter: blur(10px) saturate(1.5);
  border-radius: 16px;
  margin: 0 10px 10px 10px;
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

.item .content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  height: 100%;
}

.item .content h5 {
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.PoiList {
  margin: 0 10px 10px 10px;
}
</style>
