import { createBasicModel, type Table } from '@/utils/db'

export const name = 'users'

const User: Table = {
  DDL: `CREATE TABLE IF NOT EXISTS ${name} (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  ...createBasicModel(name),
}

export default User
