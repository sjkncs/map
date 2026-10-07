import { verifyName, verifyPassword } from '@root/shared/services/user'

export const verifyCredentials = (
  name: unknown,
  password: unknown,
  passwordOptions?: { minLength?: number },
) => {
  const nameResult = verifyName(name)
  if (!nameResult.success) return nameResult
  const passwordResult = verifyPassword(password, passwordOptions)
  if (!passwordResult.success) return passwordResult
  return {
    success: true as const,
    data: { name: nameResult.data, password: passwordResult.data },
  }
}
