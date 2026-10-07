<script setup lang="ts">
import { Select } from 'lovelymaid'

import type { LoveItem } from '@map/shared/types/map'
import { calculateDistance } from '@/modules/utils/distance'
import detailSearchStore from '@/modules/stores/detail-search'
import barStore from '@/stores/bar'
import userStore from '@/stores/user'
import { editCustomPoi } from '@/modules/services/custom-poi'

// 点击收藏
const clickLove = async (love: LoveItem) => {
  barStore.openContentBar('detail', { loveId: love.id, recentId: undefined })
  await detailSearchStore.search(love)
}

// 操作按钮
const actionOptions = [
  { id: '1', name: '编辑', icon: 'icon-edit' },
  { id: '2', name: '取消收藏', icon: 'icon-delete' },
]
const clickSelect = async (option: unknown, index: number) => {
  const action = option as (typeof actionOptions)[number]
  if (action.name === '编辑') {
    const poi = userStore.love.values[index]
    await editCustomPoi({
      id: poi.id,
      name: poi.name,
      location: poi.location,
      field: 'alias',
    })
  } else if (action.name === '取消收藏') {
    const id = userStore.love.values[index].id
    await userStore.love.remove(id)
  }
}
</script>

<template>
  <ul class="LoveList">
    <li
      class="item"
      v-for="(love, index) in userStore.love.values"
      :key="love.id"
      @click="() => clickLove(love)"
    >
      <div class="icon-container">
        <div class="icon">
          <span>{{ love.icon }}</span>
        </div>
      </div>
      <div class="content">
        <div class="text">
          <h5>{{ userStore.customPoi.aliasOf(love.id, love.name) }}</h5>
          <p>
            {{
              love.shortAddress + '·' + calculateDistance(userStore.currentLocation, love.location)
            }}
          </p>
        </div>
        <Select
          class="Select"
          :z-index="2"
          :options="actionOptions"
          :on-option-click="(action) => clickSelect(action, index)"
          v-slot:item="{ item }"
        >
          <span :class="['iconfont', item.icon]"></span>
        </Select>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.LoveList {
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
  color: #fff;
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

.item .content h5 {
  width: auto;
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
