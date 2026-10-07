<script setup lang="ts">
import userStore from './stores/user'
import './services/response'

import AiBar from '@/modules/AiBar/index.vue'
import BasicBar from '@/modules/BasicBar/index.vue'
import CommonBar from '@/modules/CommonBar/index.vue'
import DetailBar from '@/modules/DetailBar/index.vue'
import LoveBar from '@/modules/LoveBar/index.vue'
import Map from '@/modules/Map/index.vue'
import Modal from '@/modules/Modal/index.vue'
import NavBar from '@/modules/NavBar/index.vue'
import RecentSearchBar from '@/modules/RecentSearchBar/index.vue'
import UserBar from '@/modules/UserBar/index.vue'
import UserPic from '@/modules/UserPic'
import WayPointBar from '@/modules/WayPointBar/index.vue'

userStore.get()
</script>

<template>
  <Map class="Map" />
  <BasicBar class="BasicBar" />
  <LoveBar class="LoveBar" />
  <RecentSearchBar class="RecentSearchBar" />
  <CommonBar class="CommonBar" />
  <AiBar class="AiBar" />
  <DetailBar class="DetailBar" />
  <NavBar class="NavBar" />
  <WayPointBar class="WayPointBar" />
  <UserBar class="UserBar" />
  <UserPic class="UserPic" />
  <Modal />
</template>

<style scoped>
.BasicBar {
  position: absolute;
  left: 2dvh;
  top: 2dvh;
  z-index: 2;
  width: 190px;
  height: 96dvh;
}

.LoveBar,
.RecentSearchBar,
.CommonBar,
.AiBar,
.DetailBar,
.NavBar,
.WayPointBar {
  position: absolute;
  left: calc(4dvh + 190px);
  top: 2dvh;
  z-index: 1;
  width: 260px;
  height: 96dvh;
}

.UserBar {
  position: fixed;
  left: calc(50dvw - 200px);
  top: calc(50dvh - 250px);
  width: 400px;
  height: 450px;
}

.UserPic {
  position: absolute;
  right: 20px;
  top: 15px;
  z-index: 1;
  width: 32px;
  height: 32px;
}
</style>
