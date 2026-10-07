import { createBasicModel, type Table } from '@/utils/db'

export const name = 'messages'

const Message: Table = {
  DDL: `
    CREATE TABLE IF NOT EXISTS ${name} (
      id SERIAL PRIMARY KEY,
      session_id INTEGER NOT NULL,
      "index" INTEGER NOT NULL,
      role VARCHAR(20) NOT NULL,
      content TEXT,
      tool_calls JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE (session_id, "index"),
      FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
    );
  `,
  ...createBasicModel(name),
}

export default Message
