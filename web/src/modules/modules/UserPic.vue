<script setup lang="ts">
import ImgURL from '@/assets/imgs/weidenglu.svg'
import barStore from '@/stores/bar'
import userStore from '@/stores/user'
</script>

<template>
  <div class="UserPic" @click.stop="() => (barStore.userbarIsVisible = !barStore.userbarIsVisible)">
    <img :src="userStore.pic || ImgURL" />
  </div>
</template>

<style scoped>
.UserPic {
  background-color: rgba(242, 242, 242, 0.9);
  backdrop-filter: blur(10px) saturate(1.5);
  border: 1px solid rgba(255, 255, 255, 1);
  border-radius: 50%;
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.1);
  user-select: none;
  -webkit-user-select: none;
  cursor: pointer;
}

img {
  width: 100%;
}
</style>
