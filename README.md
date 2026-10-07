# Map

基于高德地图的智能地图应用：地点搜索、路线规划、AI 智能问答导航、收藏管理。

## 前置要求

- Node.js ≥ 18、npm
- PostgreSQL（本地，默认端口 5432）
- API Key：高德地图（Web 服务 + JS API）、DeepSeek、搜索服务

## 启动

### 1. 安装依赖

```bash
npm install
```

### 2. 训练模型（仅首次）

```bash
npm run train
```

### 3. 配置后端

创建 `backend/config.ts`：

```ts
export const CONFIG = {
  port: 8080,
  postgresql: {
    host: 'localhost',
    port: 5432,
    database: 'Map',
  },
  jwtSecret: '你的密钥',
}

export const AMAP_CONFIG = {
  key: '高德 Web 服务 Key',
}

export const AI_CONFIG = {
  key: 'DeepSeek Key',
  baseURL: 'https://api.deepseek.com',
  model: 'deepseek-v4-flash',
  systemPrompt: '你是地图 Agent 助手',
}

export const SEARCH_CONFIG = {
  key: '搜索服务 Key',
}
```

### 4. 配置前端

创建 `frontend/config.ts`：

```ts
export const AMAP_CONFIG = {
  key: '高德 JS API Key',
  securityJsCode: '安全密钥',
}
```

### 5. 启动

```bash
npm run dev                          # 前后端同时开发
npm start                            # 启动后端
npm run build                        # 构建前端到 backend/public/
npm stop                             # 停止后端
```
