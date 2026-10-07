<script setup lang="ts">
import { ref, watch } from 'vue'

import type { SessionItem, UserMessage } from '@root/shared/types/ai'

import Send from './modules/Send.vue'

interface Props {
  onSend?: () => void
}
const props = defineProps<Props>()
const session = defineModel<SessionItem>('session')

// 自动聚焦
const sendRef = ref<InstanceType<typeof Send> | null>(null)
watch(session, () => {
  sendRef.value?.focus()
})

const inputValue = ref<UserMessage['content']>('')
</script>

<template>
  <Send
    ref="sendRef"
    :session="session"
    v-model:value="inputValue"
    placeholder="给地图发送消息"
    :on-send="props.onSend"
  />
</template>

<style scoped></style>
