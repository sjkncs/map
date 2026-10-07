import { showPois, navigate, showOptions } from './modules/content'
import { streamOut } from './modules/stream'
import { postLoves, deleteLoves, putRecentCustomPoi, deleteCustomPois } from './modules/user'

const actions: Record<string, any> = {
  streamOut,
  postLoves,
  deleteLoves,
  putRecentCustomPoi,
  deleteCustomPois,
  showPois,
  navigate,
  showOptions,
}

export default actions
