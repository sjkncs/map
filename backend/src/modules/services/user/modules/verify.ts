import { z } from 'zod'

const loveSchema = z.object({
  id: z.string(),
  name: z.string(),
  shortAddress: z.string(),
  location: z.string(),
  icon: z.string(),
})
export const verifyLove = (data: unknown) => loveSchema.safeParse(data)

const customPoiSchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.string(),
  alias: z.string().nullish(),
  description: z.string().nullish(),
})
export const verifyCustomPoi = (data: unknown) => customPoiSchema.safeParse(data)
