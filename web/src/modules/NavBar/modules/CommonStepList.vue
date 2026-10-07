<script setup lang="ts">
import { computed } from 'vue'

import { formatDistance } from '@/modules/utils/distance'
import navStore, { type Step, type Ride } from '@/modules/stores/nav'
import userStore from '@/stores/user'

// 路线
const steps = computed<Step[] | Ride[] | undefined>(() => {
  if (navStore.route) {
    if ('steps' in navStore.route) {
      return navStore.route.steps
    }
    if ('rides' in navStore.route) {
      return navStore.route.rides
    }
  }
})

// 渲染列表
const list = computed<any[]>(() => {
  if (!steps.value) return []
  const result: any[] = [navStore.pois[0]]
  let poiIndex: number = 1
  for (const [index, step] of steps.value.entries()) {
    result.push(step)
    if (
      step.assistant_action === '到达目的地' ||
      step.assistant_action === '到达途经地' ||
      index === steps.value.length - 1
    ) {
      result.push(navStore.pois[poiIndex])
      poiIndex++
    }
  }
  return result
})
</script>

<template>
  <ul class="CommonStepList">
    <div class="container" v-for="(item, index) in list" :key="index">
      <li class="item" v-if="item.instruction">
        <div class="icon-container">
          <span class="iconfont" :class="`icon-${navStore.stepIcons[item.action]}`"></span>
        </div>
        <div class="content">
          <h5>{{ formatDistance(item.distance) }}</h5>
          <p>
            {{
              item.action +
              (item.action && item.assistant_action
                ? '，' + item.assistant_action
                : item.assistant_action
                  ? item.assistant_action
                  : '')
            }}
          </p>
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
.CommonStepList {
  background-color: #fff;
  backdrop-filter: blur(10px) saturate(1.5);
  border-radius: 16px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
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

.item .icon-container .iconfont {
  font-size: 20px;
}

.item .content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  height: 100%;
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

.item .content p {
  font-size: 10px;
  line-height: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
