<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  options: string[]
  onOptionClick?: (option: string) => void
}
const props = defineProps<Props>()

// 点击选项
const showOption = ref<boolean>(true)
const clickOption = (option: string) => {
  showOption.value = false
  props.onOptionClick?.(option)
}
</script>
<template>
  <div class="Selector">
    <ul class="options" v-if="showOption">
      <li class="option" v-for="option in props.options" @click.stop="() => clickOption(option)">
        {{ option }}
      </li>
    </ul>
  </div>
</template>
<style scoped>
.Selector {
  word-break: break-word;
}

.options {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.option {
  padding: 10px;
  background-color: #f0f2f5;
  border: 1px solid #d1d9e8;
  border-radius: 12px;
  font-size: 12px;
  line-height: 16px;
  cursor: pointer;
}
</style>
