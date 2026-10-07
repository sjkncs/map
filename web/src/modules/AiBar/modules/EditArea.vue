<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

import type { SessionItem, UserMessage } from '@map/shared/types/ai'

import Send from './modules/Send.vue'

interface Props {
  onSend?: () => void
}
const props = defineProps<Props>()
const session = defineModel<SessionItem>('session')
const editIndex = defineModel<number | undefined>('edit-index', { required: true })
const inputValue = defineModel<UserMessage['content']>('value', { required: true })

// 初始化
const sendRef = ref<InstanceType<typeof Send> | null>(null)
const cancelEdit = () => {
  editIndex.value = undefined
}
document.addEventListener('click', cancelEdit)
onUnmounted(() => {
  document.removeEventListener('click', cancelEdit)
})

// 发送事件
const onSend = () => {
  props.onSend?.()
  editIndex.value = undefined
}
onMounted(() => {
  sendRef.value?.focus()
})
</script>

<template>
  <Send
    ref="sendRef"
    :session="session"
    v-model:value="inputValue"
    :edit-index="editIndex"
    placeholder="从这里重新开始"
    :on-send="onSend"
    @click.stop
  />
</template>

<style scoped></style>
