<script setup lang="ts">
import { FoldList, SideBar } from 'lovelymaid'
import { computed, ref } from 'vue'

import type { LoveItem, SearchItem } from '@map/shared/types/map'
import detailSearchStore from '../stores/detail-search'
import navStore from '@/modules/stores/nav'
import barStore from '@/stores/bar'
import userStore from '@/stores/user'
import { commonSearch } from '../services/common-search'

import TextArea from './modules/TextArea.vue'

// 切换
const onButtonClick = (newIsOpen: boolean) => {
  if (newIsOpen) {
    barStore.recoverContentBarVisibles()
  } else {
    barStore.saveContentBarVisibles()
    barStore.closeAllContentBar()
  }
}

// 收藏
const loveIsOpen = ref<boolean>(true)
const loves = computed<LoveItem[]>(() =>
  userStore.love.values.map((love) => ({
    ...love,
    name: userStore.customPoi.aliasOf(love.id, love.name),
  })),
)
const onLoveHeaderClick = () => {
  barStore.openContentBar('love', { loveId: undefined, recentId: undefined })
  navStore.pois = []
}
const onLoveItemClick = async (love: unknown) => {
  const loveItem = love as LoveItem
  barStore.recentId = undefined
  barStore.openContentBar('detail', { loveId: loveItem.id, recentId: undefined })
  navStore.pois = []
  await detailSearchStore.search(loveItem)
}

// 最近搜索
const searchIsOpen = ref<boolean>(true)
const onRecentSearchHeaderClick = () => {
  barStore.openContentBar('recentsearch', { loveId: undefined, recentId: undefined })
  navStore.pois = []
}
const onRecentSearchItemClick = async (item: unknown) => {
  const searchItem = item as SearchItem
  navStore.pois = []
  if (searchItem.type === 'common') {
    barStore.openContentBar('common', { loveId: undefined, recentId: searchItem.id })
    await commonSearch(searchItem.name)
  } else {
    if (!searchItem.sessionId) return
    barStore.openContentBar('ai', { loveId: undefined, recentId: searchItem.id })
    userStore.session.currentId = searchItem.sessionId
    if (!userStore.session.values.has(searchItem.sessionId)) {
      await userStore.session.get(searchItem.sessionId)
    }
  }
}
</script>

<template>
  <SideBar
    class="SideBar"
    :visible="!barStore.userbarIsVisible"
    v-model:open="barStore.sidebarIsOpen"
    :on-button-click="onButtonClick"
  >
    <TextArea class="TextArea" />
    <div class="container">
      <FoldList
        class="FoldList"
        title="收藏"
        :list="loves"
        v-model:open="loveIsOpen"
        v-model:active-id="barStore.loveId"
        :on-header-click="onLoveHeaderClick"
        :on-item-click="onLoveItemClick"
      />
      <FoldList
        class="FoldList"
        title="最近搜索"
        :list="userStore.search.values"
        v-model:open="searchIsOpen"
        v-model:active-id="barStore.recentId"
        :on-header-click="onRecentSearchHeaderClick"
        :on-item-click="onRecentSearchItemClick"
      />
    </div>
  </SideBar>
</template>

<style scoped>
.TextArea,
.FoldList {
  margin: 0 15px;
}

.container {
  margin-top: -10px;
  height: calc(96dvh - 85px);
  overflow-y: auto;
  scrollbar-width: thin;
  will-change: transform;
}

.container .FoldList:nth-child(1) {
  margin-top: 25px;
}

.container .FoldList:nth-child(2) {
  margin-top: 15px;
}
</style>
