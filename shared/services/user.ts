import { z } from 'zod'

const nameSchema = z
  .string()
  .trim()
  .min(1, '用户名不能为空')
  .refine((s) => !s.includes(' '), '用户名不能包含空格')

export const verifyName = (name: unknown) => nameSchema.safeParse(name)

export const verifyPassword = (password: unknown, { minLength }: { minLength?: number } = {}) => {
  const schema = z
    .string()
    .trim()
    .min(1, '密码不能为空')
    .refine((s) => !s.includes(' '), '密码不能包含空格')
    .refine((s) => typeof minLength !== 'number' || s.length >= minLength, `密码至少${minLength}位`)
  return schema.safeParse(password)
}
