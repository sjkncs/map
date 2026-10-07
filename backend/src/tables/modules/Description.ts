import { createBasicModel, type Table } from '@/utils/db'

export const name = 'descriptions'

const Description: Table = {
  DDL: `CREATE TABLE IF NOT EXISTS ${name} (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  des TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS descriptions_user_id_idx ON ${name} (user_id);`,
  ...createBasicModel(name),
}

export default Description
