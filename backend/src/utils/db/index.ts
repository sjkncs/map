import postgres from 'postgres'

import { buildWhere } from './modules/build'
import { filterUndefined } from './modules/filter-undefined'

let sql: ReturnType<typeof postgres> | null = null
export const getSql = () => {
  if (!sql) {
    throw new Error('数据库未连接，请先调用 connectToDatabase()')
  }
  return sql
}
export const closeDatabase = async () => {
  await sql?.end()
  sql = null
}

type PgConfig = postgres.Options<Record<string, postgres.PostgresType>>
export type Table = { DDL: string } & ReturnType<typeof createBasicModel>
const createTables = async (tables: Record<string, Table>) => {
  const sql = getSql()
  for (const [name, table] of Object.entries(tables)) {
    await sql.unsafe(table.DDL)
    console.log(`📌 表 ${name} 已创建`)
  }
}

export const connectToDatabase = async (config: PgConfig, tables: Record<string, Table>) => {
  if (sql) return true
  try {
    sql = postgres({
      ...config,
      transform: {
        column: {
          from: postgres.camel.column.from,
          to: postgres.camel.column.to,
        },
      },
    })
    await sql`SELECT 1`
    console.log('✅ PostgreSQL 连接成功')
    await createTables(tables)
    return true
  } catch (error) {
    console.error('❌ PostgreSQL 连接失败:', error)
    throw error
  }
}

export const createBasicModel = (table: string) => {
  const model = {
    select: async (where?: Record<string, unknown>, order?: string) => {
      const sql = getSql()
      const filtered = where ? filterUndefined(where) : undefined
      const hasWhere = filtered && Object.keys(filtered).length > 0
      if (hasWhere) {
        if (order) {
          return await sql`SELECT * FROM ${sql.unsafe(table)} WHERE ${buildWhere(sql, filtered!)} ORDER BY ${sql.unsafe(order)}`
        } else {
          return await sql`SELECT * FROM ${sql.unsafe(table)} WHERE ${buildWhere(sql, filtered!)}`
        }
      } else {
        if (order) {
          return await sql`SELECT * FROM ${sql.unsafe(table)} ORDER BY ${sql.unsafe(order)}`
        } else {
          return await sql`SELECT * FROM ${sql.unsafe(table)}`
        }
      }
    },
    selectOne: async (where?: Record<string, unknown>, order?: string) => {
      const sql = getSql()
      const filtered = where ? filterUndefined(where) : undefined
      const hasWhere = filtered && Object.keys(filtered).length > 0
      const whereBy = hasWhere ? sql` WHERE ${buildWhere(sql, filtered!)}` : sql``
      const orderBy = order ? sql` ORDER BY ${sql.unsafe(order)}` : sql``
      const [result] = await sql`SELECT * FROM ${sql.unsafe(table)}${whereBy}${orderBy} LIMIT 1`
      return result
    },
    insert: async (data: Record<string, unknown>) => {
      const sql = getSql()
      const [result] =
        await sql`INSERT INTO ${sql.unsafe(table)} ${sql(filterUndefined(data))} RETURNING id`
      return result.id
    },
    // set 一定成功
    set: async (data: Record<string, unknown>, conflict: string[]) => {
      const sql = getSql()
      const conflictCols = sql(conflict)
      const filtered = filterUndefined(data)
      await sql`INSERT INTO ${sql.unsafe(table)} ${sql(filtered)} ON CONFLICT (${conflictCols}) DO UPDATE SET ${sql(filtered)}`
    },
    update: async (where: Record<string, unknown>, data: Record<string, unknown>) => {
      const sql = getSql()
      const result =
        await sql`UPDATE ${sql.unsafe(table)} SET ${sql(filterUndefined(data))} WHERE ${buildWhere(sql, filterUndefined(where))}`
      return result.count > 0
    },
    delete: async (where: Record<string, unknown>) => {
      const sql = getSql()
      const result =
        await sql`DELETE FROM ${sql.unsafe(table)} WHERE ${buildWhere(sql, filterUndefined(where))}`
      return result.count > 0
    },
  }
  return model
}
