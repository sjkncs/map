<script setup lang="ts">
import { TextArea } from 'lovelymaid'
import { computed, ref } from 'vue'

import type { UserMessage } from '@root/shared/types/ai'
import { base64ToFile, fileToBase64 } from '@/modules/utils/base64-file'
import aiSearchStore from '@/modules/stores/ai-search'
import navStore from '@/modules/stores/nav'
import barStore from '@/stores/bar'
import { aiSearch } from '../../services/ai-search'
import { commonSearch } from '../../services/common-search'
import { predictComplexity } from './services/complexity'

// 回车搜索
const inputValue = ref<UserMessage['content']>('')
const inputText = computed<string>({
  get: () => {
    if (typeof inputValue.value === 'string') {
      return inputValue.value
    } else {
      return inputValue.value.find((value) => value.type === 'text')?.text ?? ''
    }
  },
  set: (text) => {
    if (typeof inputValue.value === 'string') {
      inputValue.value = text
    } else {
      const images = inputValue.value.filter((value) => value.type === 'image_url')
      inputValue.value = [...(text ? [{ type: 'text' as const, text }] : []), ...images]
    }
  },
})
const inputImgs = computed({
  get: () => {
    if (typeof inputValue.value === 'string') {
      return []
    } else {
      const imgs = inputValue.value.filter((value) => value.type === 'image_url')
      return imgs.map((img) => ({
        id: img.image_url.url,
        file: base64ToFile(img.image_url.url),
      }))
    }
  },
  set: (fileItems) => {
    const syncInput = async () => {
      const text = inputText.value
      const images = await Promise.all(
        fileItems.map(async (item) => ({
          type: 'image_url' as const,
          image_url: { url: await fileToBase64(item.file), detail: 'auto' as const },
        })),
      )
      inputValue.value = [...(text ? [{ type: 'text' as const, text }] : []), ...images]
    }
    syncInput()
  },
})
const search = async () => {
  if (!inputText.value && inputImgs.value.length === 0) return
  barStore.loveId = undefined
  navStore.pois = []
  let prob: number | undefined
  if (inputImgs.value.length === 0) {
    prob = await predictComplexity(inputText.value)
  } else {
    prob = 1
  }
  if (!prob) return
  if (prob < 0.5) {
    await commonSearch(inputText.value)
  } else {
    await aiSearch(inputValue.value, aiSearchStore.mode, aiSearchStore.model)
  }
  inputValue.value = ''
}
</script>

<template>
  <TextArea
    class="TextArea"
    placeholder="给地图发送消息"
    v-model:value="inputText"
    enterkeyhint="search"
    :onEnter="search"
    :paste-file="true"
    v-model:files="inputImgs"
  >
  </TextArea>
</template>

<style scoped>
.TextArea {
  position: relative;
  z-index: 1;
  max-height: 200px;
}
</style>
