// 通用防抖函数
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | undefined
  return function (this: any, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = undefined
    }, delay)
  }
}

// 通用节流函数
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  interval: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | undefined
  return function (this: any, ...args: Parameters<T>) {
    if (timer) return
    timer = setTimeout(() => {
      timer = undefined
    }, interval)
    fn.apply(this, args)
  }
}
