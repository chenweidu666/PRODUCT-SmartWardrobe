# SmartWardrobe

智能衣柜管理系统（Node.js + Express + React + Vite）。

## 文档

- 前后端对接文档：[`docs/frontend-backend-integration.md`](./docs/frontend-backend-integration.md)

## 当前可用能力

- 账号密码登录（JWT）
- 衣物管理（增删改查）
- 分类管理（按用户隔离）
- 首页统计（总件数、本月新增、分类数、衣物总价）
- 图片上传接口（后端）

## 目录（标准化）

```text
SmartWardrobe/
├── apps/
│   ├── frontend/
│   └── backend/
├── packages/                    # 可选：共享 utils/types/config
├── infra/
│   ├── docker/
│   │   ├── Dockerfile.frontend
│   │   ├── Dockerfile.backend
│   │   ├── docker-compose.yml
│   │   └── .env.example
│   └── database/
├── Dockerfile                     # 符号链接 -> infra/docker/Dockerfile.backend
├── docs/
├── design/
│   └── figma-project/
├── scripts/
├── database/                    # 运行时 SQLite 数据（保留）
├── start.sh
└── README.md
```

## Docker 一键启动（推荐）

### 方式一：项目根目录（推荐）

```bash
mkdir -p database/uploads/images database_backup
cp infra/docker/.env.example .env   # 首次请编辑 JWT_SECRET
docker compose -f infra/docker/docker-compose.yml up -d --build
```

### 方式二：使用根目录 Dockerfile

```bash
mkdir -p database/uploads/images database_backup
cp infra/docker/.env.example .env   # 首次请编辑 JWT_SECRET
docker build -t smartwardrobe-private .
docker run -d -p 8080:8080 \
  -v $(pwd)/database:/app/database \
  -v $(pwd)/database_backup:/app/database_backup \
  --name smart-wardrobe \
  smartwardrobe-private
```

浏览器访问 **http://127.0.0.1:8080/**（内网则用本机局域网 IP:8080）。  
若 CORS 拦截，在 `.env` 里用 `CORS_ORIGINS` 追加你的访问地址。

### 镜像标签管理

```bash
# 查看镜像
docker images | grep smartwardrobe-private

# 打标签（版本管理）
docker tag smartwardrobe-private:latest smartwardrobe-private:v1.0-$(date +%Y%m%d-%H%M%S)
```

## 本地启动（开发）

```bash
# 后端（端口 8080）
cd apps/backend
npm install
npm run start

# 前端（端口 8081）
cd apps/frontend
npm install
npm run dev
```

访问：

- 前端: [http://localhost:8081](http://localhost:8081)
- 后端: [http://localhost:8080](http://localhost:8080)

## 常用 API（当前前端已接入）

- `POST /api/login`
- `GET /api/categories`
- `POST /api/categories`
- `GET /api/clothing`
- `GET /api/clothing/:id`
- `POST /api/clothing`
- `PUT /api/clothing/:id`
- `DELETE /api/clothing/:id`

> 受保护接口需带 `Authorization: Bearer <token>`
