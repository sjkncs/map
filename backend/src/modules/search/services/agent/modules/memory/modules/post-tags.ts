import type { Tool } from '@lovelymai/agent'

import { Tag } from '@/tables'
import { embed } from '../../modules/embedding'

const postTags = async (
  { tags }: { tags: string[] },
  { sessionId, index }: { sessionId: number; index: number },
) => {
  const embeddings = await Promise.all(tags.map((tag) => embed(tag)))
  await Promise.all(
    tags.map((tag, i) =>
      Tag.insert({
        sessionId,
        index,
        content: tag,
        embedding: `[${embeddings[i].join(',')}]`,
      }),
    ),
  )
}

export const embeddingTools: Tool[] = [
  {
    name: 'post_tags',
    description: '输入字符串组成的数组 tags, 将这些标签向量化存入数据库',
    properties: {
      tags: {
        type: 'array',
        items: { type: 'string' },
        minItems: 1,
        maxItems: 3,
        description: '从消息中提取隐性信息。不要提取地点名称、地址、评分、距离等地图系统已有的信息',
        required: true,
      },
    },
    function: postTags,
  },
]
