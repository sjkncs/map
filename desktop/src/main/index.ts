import { GLOBAL_CONFIG } from '@root/config'
import { BrowserWindow, app } from 'electron'

import { applyMenu } from './modules/menu'

const url = `http://localhost:${app.isPackaged ? GLOBAL_CONFIG.port : GLOBAL_CONFIG.devPort}`

const createWindow = () => {
  applyMenu()
  const win = new BrowserWindow()
  win.loadURL(url)
  win.maximize()
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => app.quit())
