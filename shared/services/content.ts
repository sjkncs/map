import type { UserMessage } from '@map/shared/types/ai'

export const contentToText = (content: UserMessage['content']): string =>
  typeof content === 'string' ? content : (content.find((part) => part.type === 'text')?.text ?? '')

export const contentToImages = (content: UserMessage['content']): string[] =>
  typeof content === 'string'
    ? []
    : content.filter((part) => part.type === 'image_url').map((part) => part.image_url.url)
