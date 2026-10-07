import { reactive, ref } from 'vue'

// 弹窗
const visible = ref<boolean>(false)
const title = ref<string>('')
const tip = ref<string>('')
const onClose = ref<() => void>()
const open = (config: { title: string; tip: string }) => {
  isInput.value = false
  title.value = config.title
  tip.value = config.tip
  visible.value = true
}

// 输入弹窗
const isInput = ref<boolean>(false)
const input = ref<string>('')
let resolveInput: ((value: string | null) => void) | null = null
const prompt = (config: { title: string; defaultValue?: string }) => {
  isInput.value = true
  title.value = config.title
  input.value = config.defaultValue ?? ''
  visible.value = true
  return new Promise<string | null>((resolve) => {
    resolveInput = resolve
  })
}
const confirmInput = () => {
  visible.value = false
  resolveInput?.(input.value)
  resolveInput = null
}
const cancelInput = () => {
  visible.value = false
  resolveInput?.(null)
  resolveInput = null
}

export default reactive({
  visible,
  title,
  tip,
  open,
  onClose,
  isInput,
  input,
  prompt,
  confirmInput,
  cancelInput,
})
