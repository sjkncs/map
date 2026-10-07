// 格式化距离
export const formatDistance = (distance: number): string => {
  // 处理无效输入
  if (isNaN(distance)) {
    return '--'
  }

  // 小于1000米，直接显示米
  if (distance < 1000) {
    return `${distance} 米`
  }

  // 大于等于1000米，转为公里，保留一位小数
  const km = distance / 1000
  return `${km.toFixed(1)} 公里`
}

/**
 * 计算两个坐标之间的距离（单位：米）
 * 使用 Haversine 公式计算地球表面两点间的大圆距离
 *
 * @param coord1 - 第一个坐标字符串，格式："经度,纬度"
 * @param coord2 - 第二个坐标字符串，格式："经度,纬度"
 * @returns 两个坐标之间的距离
 */
export function calculateDistance(coord1: string, coord2: string): string {
  // 分割字符串，获取经纬度数组
  const parts1 = coord1.split(',')
  const parts2 = coord2.split(',')

  // 验证格式
  if (parts1.length !== 2 || parts2.length !== 2) {
    console.warn('坐标格式错误，请使用"经度,纬度"格式，例如："116.4074,39.9042"')
    return '0'
  }

  // 将字符串转换为数字
  const lon1 = Number(parts1[0].trim())
  const lat1 = Number(parts1[1].trim())
  const lon2 = Number(parts2[0].trim())
  const lat2 = Number(parts2[1].trim())

  // 验证坐标有效性
  if (isNaN(lon1) || isNaN(lat1) || isNaN(lon2) || isNaN(lat2)) {
    console.warn('坐标数值无效，请确保提供有效的经度和纬度数值')
    return '0'
  }

  if (Math.abs(lat1) > 90 || Math.abs(lat2) > 90) {
    console.warn('纬度超出范围，必须在 -90 到 90 度之间')
    return '0'
  }

  if (Math.abs(lon1) > 180 || Math.abs(lon2) > 180) {
    console.warn('经度超出范围，必须在 -180 到 180 度之间')
    return '0'
  }

  // 地球半径（单位：米）
  const EARTH_RADIUS = 6371000

  // 将角度转换为弧度
  const toRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180)
  }

  const lat1Rad = toRadians(lat1)
  const lat2Rad = toRadians(lat2)
  const deltaLat = toRadians(lat2 - lat1)
  const deltaLon = toRadians(lon2 - lon1)

  // Haversine 公式
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  // 计算距离并四舍五入为整米
  const distanceInMeters = Math.round(EARTH_RADIUS * c)

  // 返回距离（整米数）
  return `${formatDistance(distanceInMeters)}`
}
