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
│   │   └── docker-compose.yml
│   └── database/
├── docs/
├── design/
│   └── figma-project/
├── scripts/
├── database/                    # 运行时 SQLite 数据（保留）
├── start.sh
└── README.md
```

## 本地启动

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
