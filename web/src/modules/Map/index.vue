<script setup lang="ts">
import { onMounted } from 'vue'

import barStore from '@/stores/bar'
import { createMapManager } from './services'

// 初始化地图
const map = createMapManager()
onMounted(() => {
  map.init('container')
})
</script>

<template>
  <div id="container" :class="{ 'map-disabled': barStore.userbarIsVisible }">
    <div class="location" @click="map.locate"><span class="iconfont icon-location"></span></div>
    <div class="fit" v-if="map.markers.length > 0" @click="() => map.setFitView()">
      <span class="iconfont icon-route"></span>
    </div>
  </div>
</template>

<style scoped>
#container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

#container.map-disabled {
  pointer-events: none;
}

.location,
.fit {
  position: absolute;
  right: 20px;
  z-index: 1;
  width: 32px;
  height: 32px;
}

.location,
.fit {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(242, 242, 242, 0.9);
  backdrop-filter: blur(10px) saturate(1.5);
  border: 1px solid rgba(255, 255, 255, 1);
  border-radius: 50%;
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.1);
  user-select: none;
  -webkit-user-select: none;
  cursor: pointer;
}

.location {
  top: 60px;
}

.fit {
  top: 105px;
}

.location .icon-location {
  color: #888;
  transform: translate(-1px, 1px) rotate(0deg);
  transform-origin: 60% 40%;
  transition:
    color 0.1s,
    transform 1s;
}

.location:hover .icon-location {
  transform: translate(-1px, 1px) rotate(360deg);
  color: #3b86f7;
}

.fit .icon-route {
  color: #888;
  transition: color 0.1s;
}

.fit:hover .icon-route {
  color: #3b86f7;
}
</style>
<style>
.amap-logo,
.amap-copyright,
.amap-lib-marker-to,
.amap-lib-marker-from {
  display: none !important;
}

.marker {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  background-color: rgba(242, 242, 242, 0.9);
  border: 1px solid rgba(255, 255, 255, 1);
  border-radius: 50%;
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.1);
  font-size: 24px;
}
</style>
