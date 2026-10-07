import { createBasicModel, type Table } from '@/utils/db'

export const name = 'recent_searches'

const RecentSearch: Table = {
  DDL: `CREATE TABLE IF NOT EXISTS ${name} (
  id UUID PRIMARY KEY,
  user_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS recent_searches_user_id_idx ON ${name} (user_id);`,
  ...createBasicModel(name),
}

export default RecentSearch
