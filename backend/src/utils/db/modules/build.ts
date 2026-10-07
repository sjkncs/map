import postgres from 'postgres'

const OPERATORS: Record<string, string> = {
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
  ne: '!=',
}

export const buildWhere = (sql: ReturnType<typeof postgres>, where: Record<string, unknown>) => {
  const conditions = Object.entries(where).flatMap(([col, val]) => {
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      return Object.entries(val).map(
        ([operator, operand]) =>
          sql`${sql(col)} ${sql.unsafe(OPERATORS[operator])} ${operand as string | number}`,
      )
    }
    return sql`${sql(col)} = ${val as string | number}`
  })
  return conditions.reduce(
    (frag, condition, i) => (i === 0 ? condition : sql`${frag} AND ${condition}`),
    sql``,
  )
}
