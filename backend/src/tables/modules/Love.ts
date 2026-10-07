import { createBasicModel, type Table } from '@/utils/db'
export const name = 'loves'

const Love: Table = {
  DDL: `CREATE TABLE IF NOT EXISTS ${name} (
  id VARCHAR(255) NOT NULL,
  user_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  short_address VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  icon VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  ...createBasicModel(name),
}

export default Love
