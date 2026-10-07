// 辅助函数：判断是否是同一天
const isSameDay = (d1: Date, d2: Date) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

// 辅助函数：判断是否是昨天
const isYesterday = (d: Date, now: Date) => {
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  return isSameDay(d, yesterday)
}

// 辅助函数：获取周一为一周开始的日期
const getWeekStart = (date: Date) => {
  const dCopy = new Date(date)
  const day = dCopy.getDay()
  const diff = day === 0 ? 6 : day - 1
  dCopy.setDate(dCopy.getDate() - diff)
  dCopy.setHours(0, 0, 0, 0)
  return dCopy
}

// 辅助函数：判断是否在同一周（周一为一周开始）
const isSameWeek = (d: Date, now: Date) => {
  return getWeekStart(d).getTime() === getWeekStart(now).getTime()
}

const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

// 格式化日期
export const formatDate = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) {
    return String(date)
  }
  const now = new Date()

  // 1. 今天
  if (isSameDay(d, now)) {
    return '今天'
  }

  // 2. 昨天
  if (isYesterday(d, now)) {
    return '昨天'
  }

  // 3. 本周内（且不是今天/昨天）
  if (isSameWeek(d, now)) {
    return `本周${weekdays[d.getDay()]}`
  }

  // 4. 今年内（但不是本周）
  if (d.getFullYear() === now.getFullYear()) {
    return `${d.getMonth() + 1}月${d.getDate()}日`
  }

  // 5. 往年：完整格式（只到日）
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  return `${year}年${month}月${day}日`
}
