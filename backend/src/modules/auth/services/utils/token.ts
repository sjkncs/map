import jwt from 'jsonwebtoken'

import { CONFIG } from '@/../config'

export const generateToken = (userId: number) => {
  return jwt.sign({ userId }, CONFIG.jwtSecret)
}
