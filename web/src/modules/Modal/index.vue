<script setup lang="ts">
import { Button, Input, Modal } from 'lovelymaid'
import { computed, nextTick, ref, watch } from 'vue'

import modalStore from '@/stores/modal'

const InputRef = ref<InstanceType<typeof Input> | null>(null)
const height = computed<string>(() => (modalStore.isInput ? '200px' : '100px'))
watch(
  () => modalStore.isInput && modalStore.visible,
  async (opened) => {
    if (!opened) return
    await nextTick()
    InputRef.value?.focus()
    requestAnimationFrame(() => {
      InputRef.value?.select()
    })
  },
)
const onClose = () => {
  if (modalStore.isInput) {
    modalStore.cancelInput()
  }
  modalStore.onClose?.()
  modalStore.onClose = undefined
}
</script>

<template>
  <Modal
    v-model:visible="modalStore.visible"
    width="50dvw"
    :height="height"
    :on-close="onClose"
    :z-index="3"
  >
    <template #header>{{ modalStore.title }}</template>
    <template #center>
      <div class="prompt" v-if="modalStore.isInput">
        <Input
          class="Input"
          ref="InputRef"
          v-model:value="modalStore.input"
          :on-enter="modalStore.confirmInput"
        />
        <Button class="Button" :on-click="modalStore.confirmInput">
          <span>确定</span>
        </Button>
      </div>
      <template v-else>{{ modalStore.tip }}</template>
    </template>
  </Modal>
</template>

<style scoped>
.prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 40dvw;
}

.prompt .Input {
  width: 100%;
  height: 40px;
}

.prompt .Button {
  width: 60px;
}

.prompt .Button span {
  font-size: 14px;
  color: #fff;
}
</style>
