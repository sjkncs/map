<script setup lang="ts">
import { Button, ContentBar, vSafeClick } from 'lovelymaid'
import { computed, nextTick, ref, watch } from 'vue'

import type { NavType, DetailItem } from '@map/shared/types/map'
import type { UserMessage } from '@root/shared/types/ai'
import { throttle } from '@/utils/function'
import Markdown from './components/Markdown.vue'
import Selector from './components/Selector.vue'
import aiSearchStore from '../stores/ai-search/index.js'
import detailSearchStore from '@/modules/stores/detail-search'
import navStore from '@/modules/stores/nav'
import barStore from '@/stores/bar'
import userStore from '@/stores/user'
import { sendMessage } from '../services/ai-search/index.js'
import { contentToText, contentToImages } from '@map/shared/services/content'

import PoiList from '../modules/PoiList.vue'
import BottomArea from './modules/BottomArea.vue'
import EditArea from './modules/EditArea.vue'

// 点击关闭
const onCloseClick = () => {
  barStore.closeContentBar('ai')
  barStore.recentId = undefined
  if (session.value) {
    session.value.isSearching = false
  }
  const sessionId = userStore.session.currentId
  if (!sessionId) return
  aiSearchStore.close(sessionId)
}

// 会话
const session = computed(() => {
  const sessionId = userStore.session.currentId
  if (sessionId) {
    return userStore.session.values.get(sessionId)
  }
})

// 自动滚动
const contentbarRef = ref<any>(null)
const autoScroll = ref<boolean>(true)
const scrollToBottom = () => {
  const el = contentbarRef.value?.$el
  if (!el) return
  el.scrollTop = el.scrollHeight - el.clientHeight
}
const onScroll = () => {
  const el = contentbarRef.value?.$el
  if (!el) return
  const isBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 10
  autoScroll.value = isBottom
}
const throttleOnScroll = throttle(onScroll, 100)
watch(
  () => userStore.session.currentId,
  (newCurrentId) => {
    if (newCurrentId && newCurrentId !== 'pending') {
      autoScroll.value = true
    }
  },
)
watch(
  () => session.value?.messages,
  async () => {
    if (autoScroll.value) {
      await nextTick()
      scrollToBottom()
    }
  },
  { deep: true },
)

// 点击事件
const onPoiClick = (poi: DetailItem) => {
  barStore.openContentBar('detail')
  detailSearchStore.result = poi
}
const onNavClick = (pois: DetailItem[], type: NavType) => {
  barStore.openContentBar('nav')
  navStore.pois = [...pois]
  navStore.type = type
}
const onOptionClick = async (option: string) => {
  const sessionId = userStore.session.currentId
  if (!sessionId || !session.value) return
  autoScroll.value = true
  await sendMessage(sessionId, option, aiSearchStore.mode, aiSearchStore.model)
}

// 页脚
const shouldShowFooter = (index: number): boolean => {
  if (!session.value) return false
  const messages = session.value.messages
  if (messages[index + 1]?.role === 'user') {
    return true
  }
  if (index === messages.length - 1 && !session.value.isSearching) {
    return true
  }
  return false
}
const retry = async (index: number) => {
  const sessionId = userStore.session.currentId
  if (!sessionId || !session.value) return
  const messages = session.value.messages
  let lastUserMessage: UserMessage | undefined
  let lastUserMessageIndex: number = index
  for (let i = index; i >= 0; i--) {
    const message = messages[i]
    if (message.role === 'user') {
      lastUserMessage = message
      lastUserMessageIndex = i
      break
    }
  }
  if (!lastUserMessage) return
  await sendMessage(
    sessionId,
    lastUserMessage.content,
    aiSearchStore.mode,
    aiSearchStore.model,
    lastUserMessageIndex,
  )
}
const findUserMessageModel = (index: number) => {
  if (!session.value) return ''
  const messages = session.value.messages
  for (let i = index; i >= 0; i--) {
    const message = messages[i]
    if (message.role === 'user') {
      return message.model
    }
  }
}

// 编辑消息
const editIndex = ref<number>()
const editContent = ref<UserMessage['content']>('')
const onUserMessageClick = (message: UserMessage, index: number) => {
  editIndex.value = index
  editContent.value = message.content
}
</script>

<template>
  <ContentBar
    class="ContentBar"
    ref="contentbarRef"
    :visible="!barStore.userbarIsVisible"
    :is-open="barStore.contentbarVisibles.ai"
    :on-close-click="onCloseClick"
    @scroll="throttleOnScroll"
  >
    <template #header>对话</template>
    <ul class="messages" v-if="session">
      <li class="message" v-for="(message, index) in session.messages">
        <div class="user" v-if="message.role === 'user'">
          <EditArea
            class="edit-area"
            v-if="index === editIndex"
            :session="session"
            v-model:edit-index="editIndex"
            v-model:value="editContent"
            :on-send="() => (autoScroll = true)"
          />
          <div class="content" v-else>
            <div class="imgs" v-if="contentToImages(message.content).length > 0">
              <img v-for="url in contentToImages(message.content)" :key="url" :src="url" alt="" />
            </div>
            <div class="text-container" v-if="contentToText(message.content)">
              <div class="text" v-safe-click="() => onUserMessageClick(message, index)">
                {{ contentToText(message.content) }}
              </div>
            </div>
          </div>
        </div>
        <div class="assistant" v-else-if="message.role === 'assistant'">
          <Markdown v-if="message.content" :content="message.content" />
        </div>
        <div class="tool" v-else-if="message.role === 'tool'">
          <div class="content">{{ message.tool_call_name + '：' + message.status }}</div>
        </div>
        <div class="poi" v-else-if="message.role === 'poi'">
          <PoiList class="PoiList" :pois="message.pois" :on-poi-click="onPoiClick" />
        </div>
        <div class="nav" v-else-if="message.role === 'nav'">
          <div class="content" @click.stop="() => onNavClick(message.pois, message.type)">
            {{
              '导航：' +
              message.pois[message.pois.length - 1].icon +
              message.pois[message.pois.length - 1].name
            }}
          </div>
        </div>
        <div class="option" v-else-if="message.role === 'option'">
          <Selector
            :options="index >= session.messages.length - 2 ? message.options : []"
            :on-option-click="onOptionClick"
          />
        </div>
        <div class="footer" v-if="shouldShowFooter(index)">
          <Button type="glass" :on-click="() => retry(index)"
            ><span class="iconfont icon-retry"></span
          ></Button>
          <div class="model">{{ findUserMessageModel(index) }}</div>
        </div>
      </li>
    </ul>
    <BottomArea class="BottomArea" v-model:session="session" :on-send="() => (autoScroll = true)" />
  </ContentBar>
</template>

<style scoped>
.messages {
  display: flow-root;
  margin: 0 10px;
  min-height: calc(96dvh - 2px - 50px - 30px - 102px);
}

.messages .message {
  margin: 10px;
}

.message .user .content,
.message .assistant {
  user-select: auto;
  -webkit-user-select: auto;
}

.message .user,
.message .assistant,
.message .tool,
.message .nav {
  display: flex;
  word-break: break-word;
}

.message .user {
  justify-content: flex-end;
}

.message .assistant,
.message .tool,
.message .nav {
  justify-content: flex-start;
}

.message .user .content {
  max-width: 90%;
}

.message .user .content .imgs {
  display: flex;
  gap: 5px;
  justify-content: flex-end;
  padding-bottom: 10px;
  overflow-x: auto;
  scrollbar-width: thin;
}

.message .user .content .imgs img {
  height: 50px;
  border-radius: 12px;
}

.message .user .content .text-container {
  display: flex;
  justify-content: flex-end;
}

.message .user .content .text-container .text {
  width: fit-content;
  padding: 10px;
  background-color: #eef3fd;
  border: 1px solid #e2eaf5;
  border-radius: 20px;
  font-size: 14px;
  line-height: 20px;
}

.message .user .edit-area {
  width: 100%;
}

.message .assistant {
  font-size: 14px;
  line-height: 24px;
}

.message .tool .content,
.message .nav .content {
  padding: 10px;
  border-radius: 12px;
  font-size: 12px;
  line-height: 16px;
}

.message .tool .content {
  background-color: #f0f2f5;
  border: 1px solid #d1d9e8;
}

.message .nav .content {
  background-color: #3b86f7;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
}

.message .footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}

.message .footer .model {
  font-size: 12px;
  color: var(--lovelymai-color-gray-300);
  opacity: 0;
}

.message .footer:hover .model {
  opacity: 1;
  transition: opacity 0.2s;
}

.BottomArea {
  position: sticky;
  bottom: 15px;
  width: calc(100% - 30px);
  margin: 15px;
}
</style>
