import { createBasicModel, type Table } from '@/utils/db'

export const name = 'custom_pois'

const CustomPoi: Table = {
  DDL: `CREATE TABLE IF NOT EXISTS ${name} (
  id VARCHAR(255) NOT NULL,
  user_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  alias VARCHAR(255),
  description TEXT,
  PRIMARY KEY (user_id, id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  ...createBasicModel(name),
}

export default CustomPoi
