<script setup lang="ts">
import { TextArea, Button, Select, Card } from 'lovelymaid'
import { computed, ref } from 'vue'

import type { Mode, Model, UserMessage } from '@map/shared/types/ai'
import type { SessionItem } from '@map/shared/types/ai'
import { base64ToFile, fileToBase64 } from '@/modules/utils/base64-file'
import aiSearchStore from '@/modules/stores/ai-search'
import userStore from '@/stores/user'
import { sendMessage } from '@/modules/services/ai-search'

interface Props {
  editIndex?: number
  placeholder?: string
  onSend?: () => void
}
const props = defineProps<Props>()
const session = defineModel<SessionItem>('session')
const inputValue = defineModel<UserMessage['content']>('value', { required: true })

// 初始化
const textareaRef = ref<InstanceType<typeof TextArea> | null>(null)

// 发消息
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
const send = async () => {
  if (
    (!inputText.value && inputImgs.value.length === 0) ||
    !session.value ||
    session.value?.isSearching ||
    !userStore.session.currentId
  )
    return
  props.onSend?.()
  await sendMessage(
    userStore.session.currentId,
    inputValue.value,
    aiSearchStore.mode,
    aiSearchStore.model,
    props.editIndex,
  )
  inputValue.value = ''
}

// 停止
const stop = () => {
  if (!userStore.session.currentId) return
  if (session.value) {
    session.value.isSearching = false
  }
  aiSearchStore.close(userStore.session.currentId)
}

// 模式
const modeOptions = [
  { id: 1, name: 'Agent', icon: 'icon-agent' },
  { id: 2, name: 'Ask', icon: 'icon-ask' },
]
const modelOptions = computed(() =>
  aiSearchStore.models.map((model, index) => ({ id: index, name: model })),
)

// 暴露
defineExpose({ focus: () => textareaRef.value?.focus(), blur: () => textareaRef.value?.blur() })
</script>

<template>
  <TextArea
    class="TextArea"
    ref="textareaRef"
    :minrow="2"
    v-model:value="inputText"
    :placeholder="props.placeholder"
    enterkeyhint="send"
    :on-enter="send"
    :paste-file="true"
    v-model:files="inputImgs"
  >
    <div class="footer">
      <div class="left">
        <Card class="mode-container">
          <Select
            class="mode"
            :options="modeOptions"
            :z-index="1"
            :on-option-click="(option) => aiSearchStore.setMode(option.name as Mode)"
          >
            <span class="iconfont icon-agent" v-if="aiSearchStore.mode === 'Agent'"></span>
            <span class="iconfont icon-ask" v-else></span>
            <span class="text">{{ aiSearchStore.mode }}</span>
            <template #item="{ item }">
              <span :class="['iconfont', item.icon]"></span>
            </template>
          </Select>
        </Card>
        <Card class="model-container">
          <Select
            class="model"
            :options="modelOptions"
            :z-index="1"
            :on-option-click="(option) => aiSearchStore.setModel(option.name as Model)"
          >
            <span class="iconfont icon-model"></span>
            <span class="text">{{ aiSearchStore.model }}</span>
            <template #item>
              <span class="iconfont icon-model"></span>
            </template>
          </Select>
        </Card>
      </div>
      <Button class="stop" v-if="session?.isSearching" :on-click="stop">
        <span class="iconfont icon-stop"></span>
      </Button>
      <Button
        :class="['start', { disabled: !inputText && inputImgs.length === 0 }]"
        v-else
        :on-click="send"
        title="发送"
      >
        <span class="iconfont icon-send"></span>
      </Button>
    </div>
  </TextArea>
</template>

<style scoped>
.TextArea {
  overscroll-behavior: none;
  --max-height: 200px;
}

.footer {
  display: flex;
  justify-content: space-between;
  height: 28px;
}

.footer .left {
  display: flex;
  gap: 5px;
}

.footer .mode-container,
.footer .model-container {
  border-radius: 14px;
  pointer-events: auto;
  cursor: pointer;
}

.footer .mode-container:hover,
.footer .model-container:hover {
  background-color: var(--lovelymai-color-gray-150);
}

.footer .mode,
.footer .model {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
  height: 100%;
  padding: 8px;
}

.footer .mode .iconfont,
.footer .model .iconfont {
  font-size: 12px;
}

.footer .mode .text,
.footer .model .text {
  font-size: 12px;
}

.footer .stop,
.footer .start {
  width: 28px;
  height: 28px;
  pointer-events: auto;
}

.footer .start.disabled {
  opacity: 0.5;
}

.footer .icon-send,
.footer .icon-stop {
  font-weight: 700;
  color: #fff;
}

.footer .icon-stop {
  font-size: 10px;
}
</style>
