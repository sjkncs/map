import type { Tool } from '@lovelymai/agent'

import { showPois, navigate, showOptions } from './modules/client'
import { calculateDistance } from './modules/distance'
import { globalSearch, aroundSearch, detailSearch, webSearch } from './modules/search'
import {
  getUserData,
  postLovesFromContext,
  deleteLoves,
  patchCustomPoiFromContext,
  deleteCustomPois,
  putDescription,
  deleteDescription,
  searchMessages,
  getMoreMessages,
} from './modules/user'

export const agentOnlyTools: Tool[] = [
  {
    name: 'post_loves_from_context',
    description:
      '输入地点 id 组成的数组 ids, 将这些地点加入收藏数组的开头。注意：这些地点必须在搜索工具的调用结果里',
    properties: {
      ids: {
        type: 'array',
        items: { type: 'string' },
        description: '地图系统中的地点唯一 id 组成的数组',
        required: true,
      },
    },
    function: postLovesFromContext,
  },
  {
    name: 'delete_loves',
    description: '输入地点 id 组成的数组 ids, 删除这些收藏的地点',
    properties: {
      ids: {
        type: 'array',
        items: { type: 'string' },
        description: '地图系统中的地点唯一 id 组成的数组',
        required: true,
      },
    },
    function: deleteLoves,
  },
  {
    name: 'patch_custom_poi_from_context',
    description:
      '输入地点 id, alias 和 description, 新增/更新该自定义地点的信息。注意：该地点必须在搜索工具的调用结果里',
    properties: {
      id: { type: 'string', description: '地图系统中的地点唯一 id', required: true },
      alias: { type: 'string', description: '新增/更新后的别名', required: true },
      description: { type: 'string', description: '新增/更新后的描述', required: true },
    },
    function: patchCustomPoiFromContext,
  },
  {
    name: 'delete_custom_pois',
    description: '输入地点 id 组成的数组 ids, 删除这些自定义地点',
    properties: {
      ids: {
        type: 'array',
        items: { type: 'string' },
        description: '地图系统中的地点唯一 id 组成的数组',
        required: true,
      },
    },
    function: deleteCustomPois,
  },
  {
    name: 'put_description',
    description: '输入 des 新增用户描述，或输入 id 和 des 更新已有描述',
    properties: {
      id: {
        type: 'number',
        description: '用户描述的唯一 id，更新时必传，新增时不传',
        required: false,
      },
      des: { type: 'string', description: '用户描述的内容', required: true },
    },
    function: putDescription,
  },
  {
    name: 'delete_description',
    description: '输入描述 id, 删除用户描述',
    properties: {
      id: { type: 'number', description: '用户描述的唯一 id', required: true },
    },
    function: deleteDescription,
  },
]

export const commonTools: Tool[] = [
  {
    name: 'get_user_data',
    description:
      '返回用户的基本信息，包含昵称、收藏、最近搜索和对地点的自定义信息。注意：有自定义信息的地点不一定在收藏列表中',
    properties: {},
    function: getUserData,
  },
  {
    name: 'search_messages',
    description:
      '输入关键词，返回其他会话里最相关的消息。注意：返回的消息只有片段，可以用 get_more_messages 获取它附近的完整上下文',
    properties: {
      keyword: {
        type: 'string',
        description: '搜索关键词，描述你想在记忆中查找的内容。注意：人称对搜索结果很重要',
        required: true,
      },
      start: {
        type: 'integer',
        description: '可选，搜索范围开始时间距离现在的天数，如 30 表示从 30 天前开始',
        required: false,
      },
      end: {
        type: 'integer',
        description: '可选，搜索范围结束时间距离现在的天数，如 7 表示截止到 7 天前',
        required: false,
      },
    },
    function: searchMessages,
  },
  {
    name: 'get_more_messages',
    description: '输入 search_messages 返回的 sessionId 和 index, 返回这条消息附近的更多消息',
    properties: {
      sessionId: {
        type: 'integer',
        description: '会话 id, 使用 search_messages 返回的 sessionId',
        required: true,
      },
      index: {
        type: 'integer',
        description: '中心消息的 index, 使用 search_messages 返回的 index',
        required: true,
      },
      before: {
        type: 'integer',
        description: '可选，向更早的方向再取多少条消息，默认 2',
        minimum: 1,
        maximum: 5,
        required: false,
      },
      after: {
        type: 'integer',
        description: '可选，向更晚的方向再取多少条消息，默认 2',
        minimum: 1,
        maximum: 5,
        required: false,
      },
    },
    function: getMoreMessages,
  },
  {
    name: 'global_search',
    description: '输入搜索关键词，返回全局搜索的地点结果，仅适用于知名地点',
    properties: {
      keywords: { type: 'string', description: '搜索关键词', required: true },
    },
    function: globalSearch,
  },
  {
    name: 'around_search',
    description:
      '输入搜索关键词和中心点坐标，返回按距离从小到大排序的周边搜索的地点结果。注意：地图系统的搜索半径有微小误差',
    properties: {
      keywords: { type: 'string', description: '搜索关键词', required: true },
      location: { type: 'string', description: '中心点坐标，格式“经度,纬度”', required: true },
      radius: { type: 'integer', description: '搜索半径，单位米，默认20000', required: false },
    },
    function: aroundSearch,
  },
  {
    name: 'detail_search',
    description: '输入地点 id，返回该地点的详情结果',
    properties: {
      id: { type: 'string', description: '地图系统中的地点唯一 id', required: true },
    },
    function: detailSearch,
  },
  {
    name: 'web_search',
    description: '输入搜索关键词，返回网络搜索结果',
    properties: {
      keywords: { type: 'string', description: '搜索关键词', required: true },
    },
    function: webSearch,
  },
  {
    name: 'show_pois',
    description:
      '输入地点 id 组成的数组 ids, 将这些地点在客户端以列表展示。注意：这些地点必须在搜索工具的调用结果里',
    properties: {
      ids: {
        type: 'array',
        items: { type: 'string' },
        description: '地图系统中的地点唯一 id 组成的数组',
        required: true,
      },
    },
    function: showPois,
  },
  {
    name: 'navigate',
    description:
      '输入地点 id 组成的数组 ids 和导航方式 type，在客户端进行导航。注意：用户自己的位置的 id 为 "0"，除此之外其他地点必须在搜索工具的调用结果里',
    properties: {
      ids: {
        type: 'array',
        items: { type: 'string' },
        description: '地图系统中的地点唯一 id 组成的数组，含义为[起点, 停靠点1, 停靠点2, ...,终点]',
        minItems: 2,
        required: true,
      },
      type: {
        type: 'string',
        description: '导航方式，注意：地铁、公交车、高铁、飞机都属于 "transfer"',
        enum: ['driving', 'walking', 'transfer', 'riding'],
        required: true,
      },
    },
    function: navigate,
  },
  {
    name: 'show_options',
    description: '输入 option 组成的数组，在客户端展示选项。注意：是单选题',
    properties: {
      options: {
        type: 'array',
        items: { type: 'string' },
        description: '选项组成的数组',
        minItems: 2,
        maxItems: 4,
        required: true,
      },
    },
    function: showOptions,
  },
  {
    name: 'calculate_distance',
    description: '输入两个坐标，返回坐标间的距离(单位：米)',
    properties: {
      coord1: { type: 'string', description: '坐标1，格式“经度,纬度”', required: true },
      coord2: { type: 'string', description: '坐标2，格式“经度,纬度”', required: true },
    },
    function: calculateDistance,
  },
]

export const allTools: Tool[] = [...agentOnlyTools, ...commonTools]
