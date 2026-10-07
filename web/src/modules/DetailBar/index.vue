<script setup lang="ts">
import { Button, ContentBar } from 'lovelymaid'
import { computed } from 'vue'

import type { LoveItem } from '@map/shared/types/map'
import { calculateDistance } from '@/modules/utils/distance'
import detailSearchStore from '@/modules/stores/detail-search'
import navStore from '@/modules/stores/nav'
import barStore from '@/stores/bar'
import userStore from '@/stores/user'
import { editCustomPoi } from '@/modules/services/custom-poi'

// 点击关闭
const onCloseClick = () => {
  barStore.closeContentBar('detail')
  barStore.loveId = undefined
}

// 要显示的地点
const poi = computed(() => {
  const result = detailSearchStore.result
  if (result) {
    return {
      ...result,
      alias: userStore.customPoi.aliasOf(result.id, result.name),
      description: userStore.customPoi.values[result.id]?.description,
    }
  }
})

// 导航
const myPoi = computed<LoveItem>(() => ({
  id: '0',
  name: '我的位置',
  shortAddress: '',
  location: userStore.currentLocation,
  icon: '📍',
  type: 'love',
}))
const clickNav = () => {
  if (!poi.value) {
    return
  }
  barStore.openContentBar('nav')
  navStore.pois = [myPoi.value, poi.value]
}

// 收藏
const isLoved = computed<boolean>(() => {
  if (poi.value) {
    return userStore.love.values.some((love) => love.id === poi.value!.id)
  }
  return false
})
const switchLove = async () => {
  if (!poi.value) return
  if (!isLoved.value) {
    const newLove: LoveItem = {
      id: poi.value.id,
      name: poi.value.name,
      shortAddress: poi.value.shortAddress,
      location: poi.value.location,
      icon: poi.value.icon || '📍',
      type: 'love',
    }
    await userStore.love.add(newLove)
  } else {
    const id = poi.value.id
    await userStore.love.remove(id)
  }
}

// 编辑自定义信息
const edit = async (field: 'alias' | 'description') => {
  if (!poi.value) return
  await editCustomPoi({
    id: poi.value.id,
    name: poi.value.name,
    location: poi.value.location,
    field,
  })
}
</script>

<template>
  <ContentBar
    class="ContentBar"
    :visible="!barStore.userbarIsVisible"
    :is-open="barStore.contentbarVisibles.detail"
    :on-close-click="onCloseClick"
    :loading="detailSearchStore.isSearching"
  >
    <template #header>详情</template>
    <div v-if="!detailSearchStore.isSearching && poi" class="content">
      <h3 class="name">{{ poi.name }}</h3>
      <div class="key-info">{{ poi.keytag + '·' + poi.shortAddress }}</div>
      <div class="button">
        <Button class="Button nav" :on-click="() => clickNav()">
          <div class="icon">
            <span class="iconfont icon-route"></span>
            <span class="text">{{
              calculateDistance(userStore.currentLocation, poi.location)
            }}</span>
          </div>
        </Button>
        <Button class="Button love" :class="{ loved: isLoved }" :on-click="switchLove">
          <div class="icon">
            <span class="iconfont icon-love"></span>
            <span class="text">{{ isLoved ? '已收藏' : '收藏' }}</span>
          </div>
        </Button>
      </div>
      <div class="photo">
        <img v-for="photo in poi.photos" :src="photo.url" />
      </div>
      <div class="detail">
        <h5 class="header">详细信息</h5>
        <div class="item">
          <span>电话</span>
          <span>{{ poi.tel }}</span>
        </div>
        <div class="item">
          <span>网站</span>
          <span>{{ poi.website }}</span>
        </div>
        <div class="item">
          <span>地址</span>
          <span class="address">{{ poi.address }}</span>
        </div>
      </div>
      <div class="custom">
        <h5 class="header">自定义信息</h5>
        <div class="item">
          <span>别名</span>
          <span>{{ poi.alias }}</span>
          <span @click="() => edit('alias')">编辑</span>
        </div>
        <div class="item">
          <span>描述</span>
          <span>{{ poi.description }}</span>
          <span @click="() => edit('description')">编辑</span>
        </div>
      </div>
    </div>
  </ContentBar>
</template>

<style scoped>
.name {
  margin: 10px 40px 0 40px;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
}

.key-info {
  margin: 10px 0 20px 0;
  font-size: 10px;
  line-height: 14px;
  text-align: center;
}

.button {
  display: flex;
  justify-content: space-evenly;
  margin: 0 10px 30px 10px;
}

.button .Button {
  width: 100px;
  height: 45px;
}

.Button .icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.Button .icon .iconfont {
  font-size: 16px;
  line-height: 18px;
}

.Button .icon .text {
  font-size: 10px;
}

.Button.nav {
  background-color: #3b86f7;
  color: #fff;
}

.Button.love {
  background-color: #ffdfe8;
  color: #e63946;
}

.Button.love.loved {
  background-color: #e63946;
  color: #fff;
}

.photo {
  display: flex;
  gap: 5px;
  margin-bottom: 20px;
  padding: 0 10px 10px 10px;
  overflow-x: auto;
  scrollbar-width: thin;
}

.photo img {
  height: 150px;
  border-radius: 12px;
}

.detail,
.custom {
  margin: 0 10px 20px 10px;
}

.detail .header,
.custom .header {
  font-size: 16px;
  margin-bottom: 10px;
}

.detail .item,
.custom .item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 5px 0;
  font-size: 14px;
}

.detail .item :nth-child(2),
.custom .item :nth-child(2) {
  flex: 1;
  min-width: 0;
  word-break: break-word;
}

.detail .item :nth-child(2):not(.address),
.custom .item :nth-child(3) {
  color: #3b86f7;
}

.custom .item :nth-child(3) {
  cursor: pointer;
}
</style>
