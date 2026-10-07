import { reactive, ref } from 'vue'

import type { Mode, Model } from '@root/shared/types/ai'
import { closeSearchWS, connectSearchWS } from './apis'
import userStore from '@/stores/user'

const mode = ref<Mode>((localStorage.getItem('mode') as Mode) || 'Agent')
const model = ref<Model>((localStorage.getItem('model') as Model) || 'MiMo')
const models = ref<Model[]>(['MiMo', 'DeepSeek'])
const setMode = (value: Mode) => {
  mode.value = value
  localStorage.setItem('mode', value)
}
const setModel = (value: Model) => {
  model.value = value
  localStorage.setItem('model', value)
}
const WsPool = new Map<number | 'pending', WebSocket>()
const open = async (sessionId: number | 'pending') => {
  try {
    const ws = await connectSearchWS()
    ws.addEventListener('close', (event) => {
      console.log(event.reason)
      userStore.session.values.get(sessionId)!.isSearching = false
    })
    WsPool.set(sessionId, ws)
    return ws
  } catch (error: any) {
    return
  }
}
const close = (sessionId: number | 'pending') => {
  if (sessionId === 'pending') {
    WsPool.delete('pending')
    return
  }
  if (!WsPool.has(sessionId)) return
  closeSearchWS(WsPool.get(sessionId)!)
  WsPool.delete(sessionId)
}

export default reactive({
  mode,
  model,
  models,
  setMode,
  setModel,
  open,
  close,
})
