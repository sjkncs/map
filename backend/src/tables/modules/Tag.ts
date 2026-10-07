import { createBasicModel, type Table } from '@/utils/db'

export const name = 'tags'

const Tag: Table = {
  DDL: `
    CREATE EXTENSION IF NOT EXISTS vector;
    CREATE TABLE IF NOT EXISTS ${name} (
      id SERIAL PRIMARY KEY,
      session_id INTEGER NOT NULL,
      "index" INTEGER NOT NULL,
      content TEXT NOT NULL,
      embedding vector(512) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      FOREIGN KEY (session_id, "index") REFERENCES messages(session_id, "index") ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS tags_session_id_index_idx ON ${name} (session_id, "index");
    CREATE INDEX IF NOT EXISTS tags_embedding_idx ON ${name} USING hnsw (embedding vector_cosine_ops);
  `,
  ...createBasicModel(name),
}

export default Tag
