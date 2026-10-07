import axios from 'axios'

const SEARCH_CONFIG = {
  key: 'sk-2bbf6f43d12149c5aea5a357787bb0e7',
}

export const webSearchApi = async (data: Record<string, any>) => {
  return await axios.post('https://api.bocha.cn/v1/web-search', data, {
    headers: {
      Authorization: `Bearer ${SEARCH_CONFIG.key}`,
    },
  })
}
