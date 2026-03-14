# SmartWardrobe 智能衣柜管理系统

一个基于 Node.js + React 的全栈智能衣柜管理应用，支持衣物分类管理、图片上传、搭配推荐、数据统计等功能。

![SmartWardrobe 预览](./docs/images/smartwardrobe_preview.png)

## 功能特性

- **衣物管理** — 添加、编辑、删除衣物，支持图片上传与自动压缩
- **分类管理** — 自定义衣物分类，支持图标、颜色、排序
- **智能搜索** — 按分类、颜色、季节、风格等多维度筛选
- **搭配推荐** — 智能穿搭建议
- **穿搭日历** — 记录每日穿搭
- **收藏夹** — 收藏喜爱的衣物
- **统计报告** — 衣物数据可视化（分类、颜色、季节、价格分布）
- **回收站** — 软删除机制，误删可恢复
- **数据备份** — 一键备份数据库与图片文件
- **多用户** — JWT 认证，支持多用户独立使用
- **响应式设计** — 适配桌面端与移动端

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + Vite 4 + React Router 6 + React Hook Form |
| 后端 | Node.js + Express.js |
| 数据库 | SQLite3 (better-sqlite3) |
| 图片处理 | Sharp (自动压缩、WebP 转换) |
| 认证 | JWT + bcryptjs |
| 文件上传 | Multer |

## 项目结构

```
SmartWardrobe/
├── backend/                     # 后端服务
│   ├── server.js               # Express 主服务（API 路由）
│   ├── database.js             # 数据库操作封装
│   ├── image-manager.js        # 图片管理工具
│   ├── utils/
│   │   └── imageProcessor.js   # 图片压缩/格式转换
│   └── package.json
├── frontend/                    # 前端应用
│   ├── src/
│   │   ├── App.jsx             # 主应用组件（登录/注册/主界面）
│   │   ├── main.jsx            # 入口文件
│   │   ├── components/         # 功能组件
│   │   │   ├── clothing-manager.jsx       # 衣物管理
│   │   │   ├── category-management-modal.jsx # 分类管理
│   │   │   ├── image-upload.jsx           # 图片上传
│   │   │   ├── statistics-report.jsx      # 统计报告
│   │   │   ├── recycle-bin.jsx            # 回收站
│   │   │   ├── outfit-recommendation.jsx  # 搭配推荐
│   │   │   ├── outfit-calendar.jsx        # 穿搭日历
│   │   │   ├── favorites.jsx              # 收藏夹
│   │   │   ├── smart-features.jsx         # 智能功能
│   │   │   ├── user-profile.jsx           # 个人资料
│   │   │   ├── theme-settings.jsx         # 主题设置
│   │   │   ├── notification-settings.jsx  # 通知设置
│   │   │   └── data-backup.jsx            # 数据备份
│   │   └── utils/
│   │       └── api.js          # API 请求工具
│   ├── vite.config.js
│   └── package.json
├── scripts/                     # 辅助脚本
│   ├── db_info.py              # 数据库查询工具（Python）
│   ├── requirements.txt
│   └── run_db_info.sh
├── docs/                        # 文档资源
│   └── images/
│       └── smartwardrobe_preview.png  # 项目预览截图
├── database_backup/             # 数据备份目录
├── start.sh                     # 一键启动脚本
├── .gitignore
└── README.md
```

## 快速开始

### 环境要求

- Node.js >= 16
- npm >= 8

### 一键启动

```bash
chmod +x start.sh
./start.sh
```

启动脚本会自动完成：环境检查 → 端口释放 → 依赖安装 → 数据库初始化 → 启动服务 → 打开浏览器。

### 手动启动

```bash
# 1. 安装后端依赖并启动
cd backend
npm install
npm run dev

# 2. 安装前端依赖并启动（新终端）
cd frontend
npm install
npm run dev
```

### 访问地址

| 服务 | 端口 | 地址 |
|------|------|------|
| 前端 | 7861 | http://localhost:7861 |
| 后端 API | 7860 | http://localhost:7860 |

## API 接口

### 认证

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/register` | 用户注册 |
| POST | `/api/login` | 用户登录 |

### 衣物管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/clothing` | 获取衣物列表 |
| GET | `/api/clothing/:id` | 获取衣物详情 |
| POST | `/api/clothing` | 添加衣物 |
| PUT | `/api/clothing/:id` | 更新衣物 |
| DELETE | `/api/clothing/:id` | 删除衣物（移入回收站） |
| PATCH | `/api/clothing/:id/favorite` | 切换收藏状态 |
| GET | `/api/clothing/stats` | 衣物统计 |

### 分类管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/categories` | 获取分类列表 |
| POST | `/api/categories` | 创建分类 |
| PUT | `/api/categories/:id` | 更新分类 |
| DELETE | `/api/categories/:id` | 删除分类 |
| GET | `/api/categories/stats` | 分类统计 |

### 回收站

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/recycle-bin` | 获取回收站列表 |
| POST | `/api/recycle-bin/:id/restore` | 恢复衣物 |
| DELETE | `/api/recycle-bin/:id` | 永久删除 |
| DELETE | `/api/recycle-bin` | 清空回收站 |

### 数据备份

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/backup` | 创建备份 |
| GET | `/api/backup/history` | 备份历史 |
| DELETE | `/api/backup/:timestamp` | 删除备份 |

### 图片上传

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/upload/image` | 上传图片（最大 5MB） |
| DELETE | `/api/upload/image/:fileName` | 删除图片 |

> 支持格式：jpg、jpeg、png、webp、gif、bmp  
> 上传后自动压缩为 WebP 格式，最大分辨率 800×800，质量 80%

### 统计

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/statistics` | 获取统计数据（支持按月/季度/年筛选） |

## 数据库查询工具

项目附带了一个 Python 数据库查询工具，方便直接查看数据：

```bash
cd scripts
pip install -r requirements.txt
bash run_db_info.sh
```

## 数据库结构

### users 用户表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| username | TEXT | 用户名 |
| password | TEXT | 密码（bcrypt 加密） |
| email | TEXT | 邮箱 |
| created_at | DATETIME | 创建时间 |

### user_categories 分类表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| user_id | INTEGER | 用户 ID |
| name | TEXT | 分类名称 |
| icon | TEXT | 图标 |
| color | TEXT | 颜色 |
| sort_order | INTEGER | 排序 |
| is_active | INTEGER | 是否启用 |

### clothing_items 衣物表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| user_id | INTEGER | 用户 ID |
| category_id | INTEGER | 分类 ID |
| name | TEXT | 衣物名称 |
| color | TEXT | 颜色 |
| size | TEXT | 尺码 |
| brand | TEXT | 品牌 |
| season | TEXT | 季节 |
| material | TEXT | 材质 |
| style | TEXT | 风格 |
| image_url | TEXT | 图片路径 |
| price | REAL | 价格 |
| purchase_date | TEXT | 购买日期 |
| is_favorite | INTEGER | 是否收藏 |
| is_deleted | INTEGER | 是否已删除 |

## License

MIT
