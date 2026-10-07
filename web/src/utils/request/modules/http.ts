import axios from 'axios'

import { SERVER_CONFIG } from '@/../config'

export const httpInstance = axios.create({
  baseURL: SERVER_CONFIG.baseURL,
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  },
})
