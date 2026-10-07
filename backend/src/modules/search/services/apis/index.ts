import axios from 'axios'

const AMAP_CONFIG = {
  key: 'd46a3e7a1cee7e58de28084383bb4fc8',
}

export const globalSearchApi = async (params: Record<string, any>) => {
  return await axios.get('https://restapi.amap.com/v3/place/text', {
    params: {
      key: AMAP_CONFIG.key,
      ...params,
    },
    timeout: 5000,
  })
}

export const aroundSearchApi = async (params: Record<string, any>) => {
  return await axios.get('https://restapi.amap.com/v3/place/around', {
    params: {
      key: AMAP_CONFIG.key,
      ...params,
    },
    timeout: 5000,
  })
}

export const detailSearchApi = async (params: Record<string, any>) => {
  return await axios.get('https://restapi.amap.com/v3/place/detail', {
    params: {
      key: AMAP_CONFIG.key,
      ...params,
    },
    timeout: 5000,
  })
}
