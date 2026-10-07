export const calculateDistance = ({
  coord1,
  coord2,
}: {
  coord1: string
  coord2: string
}): string => {
  try {
    const parts1 = coord1.split(',')
    const parts2 = coord2.split(',')

    if (parts1.length !== 2 || parts2.length !== 2) {
      throw new Error('坐标格式错误，请使用"经度,纬度"格式，例如："116.4074,39.9042"')
    }

    const lon1 = Number(parts1[0].trim())
    const lat1 = Number(parts1[1].trim())
    const lon2 = Number(parts2[0].trim())
    const lat2 = Number(parts2[1].trim())

    if (isNaN(lon1) || isNaN(lat1) || isNaN(lon2) || isNaN(lat2)) {
      throw new Error('坐标数值无效，请确保提供有效的经度和纬度数值')
    }

    if (Math.abs(lat1) > 90 || Math.abs(lat2) > 90) {
      throw new Error('纬度超出范围，必须在 -90 到 90 度之间')
    }

    if (Math.abs(lon1) > 180 || Math.abs(lon2) > 180) {
      throw new Error('经度超出范围，必须在 -180 到 180 度之间')
    }

    const EARTH_RADIUS = 6371000

    const toRadians = (degrees: number) => {
      return degrees * (Math.PI / 180)
    }

    const lat1Rad = toRadians(lat1)
    const lat2Rad = toRadians(lat2)
    const deltaLat = toRadians(lat2 - lat1)
    const deltaLon = toRadians(lon2 - lon1)

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    const distanceInMeters = Math.round(EARTH_RADIUS * c)

    return `${distanceInMeters}`
  } catch (error: any) {
    throw new Error(`计算距离失败, ${error.message}`)
  }
}
