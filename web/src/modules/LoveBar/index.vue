<script setup lang="ts">
import { ContentBar } from 'lovelymaid'

import barStore from '@/stores/bar'
import userStore from '@/stores/user'

import LoveList from './modules/LoveList.vue'

// 点击关闭
const onCloseClick = () => {
  barStore.closeContentBar('love')
}
</script>

<template>
  <ContentBar
    class="ContentBar"
    :visible="!barStore.userbarIsVisible"
    :is-open="barStore.contentbarVisibles.love"
    :on-close-click="onCloseClick"
  >
    <template #header>收藏</template>
    <LoveList class="LoveList" v-if="userStore.love.values.length > 0" />
    <template #center>
      <div class="empty" v-if="userStore.love.values.length === 0">收藏为空</div>
    </template>
  </ContentBar>
</template>

<style scoped>
.LoveList {
  margin: 30px 10px 10px 10px;
}

.empty {
  font-size: 16px;
  line-height: 30px;
  text-align: center;
}
</style>
