<script setup lang="ts">
import { ContentBar, TabBar } from 'lovelymaid'
import { ref, watch } from 'vue'

import { NavType } from '@root/shared/types/map'
import navStore from '@/modules/stores/nav'
import barStore from '@/stores/bar'

import CommonStepList from './modules/CommonStepList.vue'
import PoiSelecter from './modules/PoiSelecter.vue'
import TransferStepList from './modules/TransferStepList.vue'

// 点击关闭
const onCloseClick = () => {
  barStore.closeContentBar('nav')
  navStore.pois = []
}

// 导航方式
const navTypeTabs: { id: number; type: NavType; [key: string]: any }[] = [
  { id: 1, type: 'driving', icon: 'icon-drive' },
  { id: 2, type: 'walking', icon: 'icon-walk' },
  { id: 3, type: 'transfer', icon: 'icon-transfer' },
  { id: 4, type: 'riding', icon: 'icon-ride' },
]
const activeId = ref<string | number>(
  navTypeTabs.find((tab) => tab.type === navStore.type)?.id ?? navTypeTabs[0].id,
)
watch(activeId, (newActiveId) => {
  navStore.type = navTypeTabs.find((tab) => tab.id === newActiveId)!.type
})
watch(
  () => navStore.type,
  (newType) => {
    if (newType === 'driving') activeId.value = navTypeTabs[0].id
    else if (newType === 'walking') activeId.value = navTypeTabs[1].id
    else if (newType === 'transfer') activeId.value = navTypeTabs[2].id
    else if (newType === 'riding') activeId.value = navTypeTabs[3].id
  },
)
</script>

<template>
  <ContentBar
    class="ContentBar"
    :visible="!barStore.userbarIsVisible"
    :is-open="barStore.contentbarVisibles.nav"
    :on-close-click="onCloseClick"
    :loading="navStore.isNavigating"
  >
    <template #header>导航</template>
    <TabBar class="TabBar" :tabs="navTypeTabs" v-model:active-id="activeId" v-slot="{ index }">
      <span :class="['iconfont', navTypeTabs[index].icon]"></span>
    </TabBar>
    <PoiSelecter class="PoiSelector" v-if="!navStore.isNavigating" />
    <div class="content" v-if="!navStore.isNavigating">
      <TransferStepList class="TransferStepList" v-if="navStore.type === 'transfer'" />
      <CommonStepList class="CommonStepList" v-else />
    </div>
  </ContentBar>
</template>

<style scoped>
.TabBar {
  height: 40px;
  margin: 10px 10px 20px 10px;
}

.TabBar .iconfont {
  font-size: 18px;
}

.PoiSelector {
  margin: 0 10px 20px 10px;
}

.CommonStepList,
.TransferStepList {
  margin: 0 10px 10px 10px;
}
</style>
