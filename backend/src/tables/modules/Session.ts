import { createBasicModel, type Table } from '@/utils/db'

export const name = 'sessions'

const Session: Table = {
  DDL: `CREATE TABLE IF NOT EXISTS ${name} (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  recent_search_id UUID,
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (recent_search_id) REFERENCES recent_searches(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS sessions_user_id_updated_at_idx ON ${name} (user_id, updated_at DESC);
  CREATE INDEX IF NOT EXISTS sessions_recent_search_id_idx ON ${name} (recent_search_id);`,
  ...createBasicModel(name),
}

export default Session
