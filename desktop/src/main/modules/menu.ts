import { Menu, app } from 'electron'

type Item = Electron.MenuItemConstructorOptions

const isMac = process.platform === 'darwin'
const name = app.name
const separator: Item = { type: 'separator' }

const appMenu: Item = {
  label: name,
  submenu: [
    { role: 'about', label: `关于 ${name}` },
    separator,
    { role: 'services', label: '服务' },
    separator,
    { role: 'hide', label: `隐藏 ${name}` },
    { role: 'hideOthers', label: '隐藏其他' },
    { role: 'unhide', label: '全部显示' },
    separator,
    { role: 'quit', label: `退出 ${name}` },
  ],
}

const appItems: Item[] = isMac ? [appMenu] : []

const fileItems: Item[] = isMac
  ? [{ role: 'close', label: '关闭窗口' }]
  : [{ role: 'quit', label: '退出' }]

const editItems: Item[] = isMac
  ? [
      { role: 'pasteAndMatchStyle', label: '粘贴并匹配样式' },
      { role: 'delete', label: '删除' },
      { role: 'selectAll', label: '全选' },
      separator,
      {
        label: '替换',
        submenu: [
          { role: 'showSubstitutions', label: '显示替换' },
          separator,
          { role: 'toggleSmartQuotes', label: '智能引号' },
          { role: 'toggleSmartDashes', label: '智能破折号' },
          { role: 'toggleTextReplacement', label: '文本替换' },
        ],
      },
      {
        label: '语音',
        submenu: [
          { role: 'startSpeaking', label: '开始朗读' },
          { role: 'stopSpeaking', label: '停止朗读' },
        ],
      },
    ]
  : [{ role: 'delete', label: '删除' }, separator, { role: 'selectAll', label: '全选' }]

const windowItems: Item[] = isMac
  ? [separator, { role: 'front', label: '前置全部窗口' }]
  : [{ role: 'close', label: '关闭' }]

const template: Item[] = [
  ...appItems,
  {
    label: '文件',
    submenu: fileItems,
  },
  {
    label: '编辑',
    submenu: [
      { role: 'undo', label: '撤销' },
      { role: 'redo', label: '重做' },
      separator,
      { role: 'cut', label: '剪切' },
      { role: 'copy', label: '拷贝' },
      { role: 'paste', label: '粘贴' },
      ...editItems,
    ],
  },
  {
    label: '视图',
    submenu: [
      { role: 'reload', label: '重新加载' },
      { role: 'forceReload', label: '强制重新加载' },
      { role: 'toggleDevTools', label: '开发者工具' },
      separator,
      { role: 'resetZoom', label: '实际大小' },
      { role: 'zoomIn', label: '放大' },
      { role: 'zoomOut', label: '缩小' },
      separator,
      { role: 'togglefullscreen', label: '切换全屏' },
    ],
  },
  {
    label: '窗口',
    submenu: [
      { role: 'minimize', label: '最小化' },
      { role: 'zoom', label: '缩放' },
      ...windowItems,
    ],
  },
]

export const applyMenu = () => {
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}
