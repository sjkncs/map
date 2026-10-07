<script setup lang="ts">
import { ContentBar } from 'lovelymaid'

import aiSearchStore from '../stores/ai-search'
import barStore from '@/stores/bar'
import userStore from '@/stores/user'

import RecentSearchList from './modules/RecentSearchList.vue'

// 点击关闭
const onCloseClick = () => {
  barStore.closeContentBar('recentsearch')
}

// 点击清除
const clickClear = async () => {
  const res = await userStore.search.clear()
  if (!res) return
  if (userStore.session.currentId) {
    aiSearchStore.close(userStore.session.currentId)
  }
}
</script>

<template>
  <ContentBar
    class="ContentBar"
    :visible="!barStore.userbarIsVisible"
    :is-open="barStore.contentbarVisibles.recentsearch"
    :on-close-click="onCloseClick"
  >
    <template #header>最近搜索</template>
    <div class="content" v-if="userStore.search.values.length > 0">
      <div class="clear"><span @click="clickClear">清除</span></div>
      <RecentSearchList class="RecentSearchList" />
    </div>
    <template #center>
      <div class="empty" v-if="userStore.search.values.length === 0">最近搜索为空</div>
    </template>
  </ContentBar>
</template>

<style scoped>
.clear {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 0px 10px;
  height: 30px;
}

.clear span {
  margin-right: 10px;
  font-size: 12px;
  font-weight: 500;
  color: #0074e9;
  cursor: pointer;
}

.RecentSearchList {
  margin: 0 10px 10px 10px;
}

.empty {
  font-size: 16px;
  line-height: 30px;
  text-align: center;
}
</style>
