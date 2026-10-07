<script setup lang="ts">
import { ContentBar } from 'lovelymaid'

import type { DetailItem } from '@map/shared/types/map'
import commonSearchStore from '@/modules/stores/common-search'
import detailSearchStore from '@/modules/stores/detail-search'
import barStore from '@/stores/bar'

import PoiList from '../modules/PoiList.vue'

// 点击关闭
const onCloseClick = () => {
  barStore.closeContentBar('common')
}
const onPoiClick = (poi: DetailItem) => {
  barStore.openContentBar('detail')
  detailSearchStore.result = poi
}
</script>

<template>
  <ContentBar
    class="ContentBar"
    :visible="!barStore.userbarIsVisible"
    :is-open="barStore.contentbarVisibles.common"
    :loading="commonSearchStore.isSearching"
    :on-close-click="onCloseClick"
  >
    <template #header>{{ commonSearchStore.value }}</template>
    <PoiList
      class="PoiList"
      v-if="!commonSearchStore.isSearching && commonSearchStore.result.length > 0"
      :pois="commonSearchStore.result"
      :onPoiClick="onPoiClick"
    />
    <template #center>
      <div
        class="empty"
        v-if="!commonSearchStore.isSearching && commonSearchStore.result.length === 0"
      >
        没有符合条件的结果
      </div>
    </template>
  </ContentBar>
</template>

<style scoped>
.PoiList {
  margin: 0 10px 10px 10px;
}

.empty {
  font-size: 16px;
  line-height: 30px;
}
</style>
