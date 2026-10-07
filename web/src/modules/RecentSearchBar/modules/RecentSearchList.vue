<script setup lang="ts">
import { Select } from 'lovelymaid'

import type { SearchItem } from '@map/shared/types/map'
import { formatDate } from '@/modules/utils/date'
import aiSearchStore from '@/modules/stores/ai-search'
import barStore from '@/stores/bar'
import userStore from '@/stores/user'
import { commonSearch } from '@/modules/services/common-search'

// 点击搜索
const clickSearch = async (search: SearchItem) => {
  if (search.type === 'common') {
    barStore.openContentBar('common', { loveId: undefined, recentId: search.id })
    await commonSearch(search.name)
  } else {
    barStore.openContentBar('ai', { loveId: undefined, recentId: search.id })
    userStore.session.currentId = search.sessionId ?? 'pending'
    if (!userStore.session.values.has(search.sessionId!)) {
      await userStore.session.get(search.sessionId!)
    }
  }
}

// 操作按钮
const actionOptions = [{ id: '1', name: '删除', icon: 'icon-delete' }]
const clickOption = async (option: unknown, index: number) => {
  const action = option as (typeof actionOptions)[number]
  if (action.name === '删除') {
    const recentSearch = userStore.search.values[index]
    const res = await userStore.search.remove(recentSearch.id)
    if (!res) return
    if (userStore.session.currentId) {
      aiSearchStore.close(userStore.session.currentId)
    }
  }
}
</script>

<template>
  <div class="RecentSearchList">
    <div
      class="item"
      v-for="(search, index) in userStore.search.values"
      :key="search.id ?? index"
      @click="() => clickSearch(search)"
    >
      <div class="icon-container">
        <div class="icon"><span class="iconfont icon-search"></span></div>
      </div>
      <div class="content">
        <div class="text">
          <h5>{{ search.name }}</h5>
          <p>{{ formatDate(search.createdAt) }}</p>
        </div>
        <Select
          class="Select"
          :z-index="2"
          :options="actionOptions"
          :onOptionClick="(item) => clickOption(item, index)"
          v-slot:item="{ item }"
        >
          <span :class="['iconfont', item.icon]"></span>
        </Select>
      </div>
    </div>
  </div>
</template>

<style scoped>
.RecentSearchList {
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
  background-color: #585959;
  border-radius: 50%;
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
