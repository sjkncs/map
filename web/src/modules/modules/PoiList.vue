<script setup lang="ts">
import type { DetailItem } from '@map/shared/types/map'
import { calculateDistance } from '@/modules/utils/distance'
import userStore from '@/stores/user'

interface Props {
  pois: DetailItem[]
  onPoiClick: (poi: DetailItem) => void
}
const props = defineProps<Props>()

// 点击列表项
const clickDetailItem = (poi: DetailItem) => {
  props.onPoiClick(poi)
}
</script>

<template>
  <div class="PoiList">
    <div class="item" v-for="poi in pois" @click="() => clickDetailItem(poi)">
      <div class="text">
        <h5>{{ poi.name }}</h5>
        <p>{{ poi.icon + poi.keytag }}</p>
        <p>
          {{ poi.shortAddress + '·' + calculateDistance(userStore.currentLocation, poi.location) }}
        </p>
      </div>
      <img v-if="poi.photos?.[0]" :src="poi?.photos?.[0]?.url" />
    </div>
  </div>
</template>

<style scoped>
.PoiList {
  padding: 0 10px;
  background-color: #eee;
  backdrop-filter: blur(10px) saturate(1.5);
  border-radius: 16px;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  width: 100%;
  height: 60px;
  padding: 5px 0;
}

.item:not(:last-child) {
  border-bottom: 1px solid #cdccc2;
}

.item .text {
  flex: 1;
  min-width: 0;
}

.item .text h5 {
  width: auto;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item .text p {
  font-size: 10px;
  line-height: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item img {
  width: 50px;
  height: 50px;
  border: 1px solid #cdccc2;
  border-radius: 10px;
  object-fit: cover;
}
</style>
