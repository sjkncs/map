<script setup lang="ts">
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { computed } from 'vue'

interface Props {
  content: string
}
const props = defineProps<Props>()

const html = computed(() => {
  let text = props.content
  const count = (text.match(/\*\*/g) || []).length
  if (count % 2 !== 0) {
    text = text.replace(/\*\*(?=[^*]*$)/, '')
  }
  const raw = marked.parse(text) as string
  return DOMPurify.sanitize(raw)
})
</script>

<template>
  <div class="stream-md" v-html="html" />
</template>

<style scoped>
.stream-md :deep(strong) {
  font-weight: 500;
}
</style>
