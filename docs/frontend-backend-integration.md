# SmartWardrobe 前后端对接文档

本文档用于统一前端与后端的接口契约、鉴权规则、页面数据流与联调方式。

## 1. 基本信息

- 前端开发服务：`http://localhost:8081`
- 后端 API 服务：`http://localhost:8080`
- 前端通过 Vite 代理访问后端：
  - `/api` -> `http://127.0.0.1:8080`
  - `/uploads` -> `http://127.0.0.1:8080`

## 2. 鉴权约定

- 登录成功后，后端返回 JWT：
  - 字段：`token`
  - 用户信息：`user.id`、`user.username`
- 前端存储：
  - `localStorage.token`
  - `localStorage.userId`
  - `localStorage.username`
- 受保护接口统一携带请求头：

```http
Authorization: Bearer <token>
```

- token 失效处理：
  - 后端返回 `401` 或 `403`（典型消息：`未提供token` / `token无效`）
  - 前端自动清理登录态并跳转到个人页登录入口

## 3. 前端页面与接口映射

### 3.1 首页（`HomePage`）

- `GET /api/clothing`
  - 用于：总件数、本月新增、分类数、衣物总价、最近衣物

### 3.2 衣服管理页（`WardrobeManagePage`）

- `GET /api/clothing`
  - 用于：衣物列表、分类筛选（按 `category_name` 分组）

### 3.3 添加衣物页（`AddClothingPage`）

- `GET /api/categories`
  - 用于：分类下拉框
- `POST /api/categories`
  - 用于：新用户无分类时自动创建默认分类“未分类”
- `POST /api/clothing`
  - 用于：提交新增衣物

### 3.4 衣物详情页（`WardrobeDetailPage`）

- `GET /api/clothing/:id`
  - 用于：详情数据加载
- `PUT /api/clothing/:id`
  - 用于：编辑保存
- `DELETE /api/clothing/:id`
  - 用于：软删除（移入回收站）

### 3.5 我的衣柜页（`ProfilePage`）

- `POST /api/login`
  - 用于：账号密码登录

## 4. 核心接口契约（当前前端已接入）

## 4.1 登录

- `POST /api/login`
- 请求体：

```json
{
  "username": "test_user",
  "password": "123456"
}
```

- 成功响应：

```json
{
  "success": true,
  "message": "登录成功",
  "token": "jwt-token",
  "user": {
    "id": 1,
    "username": "test_user"
  }
}
```

## 4.2 分类列表

- `GET /api/categories`（鉴权）
- 成功响应：

```json
{
  "success": true,
  "categories": [
    {
      "id": 48,
      "name": "未分类",
      "icon": "🏷️",
      "color": "#667eea",
      "item_count": 0
    }
  ]
}
```

## 4.3 创建分类

- `POST /api/categories`（鉴权）
- 请求体：

```json
{
  "name": "未分类",
  "icon": "🏷️",
  "color": "#667eea",
  "description": "",
  "sort_order": 0
}
```

- 成功响应：

```json
{
  "success": true,
  "message": "衣物类别创建成功",
  "categoryId": 48
}
```

## 4.4 衣物列表

- `GET /api/clothing`（鉴权）
- 成功响应：

```json
{
  "success": true,
  "clothing": [
    {
      "id": 38,
      "name": "联调测试衣物",
      "category_id": 48,
      "category_name": "未分类",
      "color": "黑色",
      "size": "L",
      "price": "1497",
      "image_url": "",
      "created_at": "2026-03-16 11:46:58"
    }
  ]
}
```

## 4.5 衣物详情

- `GET /api/clothing/:id`（鉴权）
- 成功响应：

```json
{
  "success": true,
  "clothing": {
    "id": 38,
    "name": "联调测试衣物"
  }
}
```

## 4.6 新增衣物

- `POST /api/clothing`（鉴权）
- 请求体（最小字段）：

```json
{
  "category_id": 48,
  "name": "速写羽绒服"
}
```

- 请求体（前端当前提交字段）：

```json
{
  "category_id": 48,
  "name": "速写羽绒服",
  "description": "",
  "color": "黑色",
  "size": "XXL",
  "brand": "",
  "season": "",
  "price": "1497",
  "purchase_date": "",
  "image_url": ""
}
```

- 成功响应：

```json
{
  "success": true,
  "message": "衣物添加成功",
  "clothing": {
    "id": 39
  }
}
```

## 4.7 更新衣物

- `PUT /api/clothing/:id`（鉴权）
- 请求体：同新增字段（按需传）
- 成功响应：

```json
{
  "success": true,
  "message": "衣物更新成功"
}
```

## 4.8 删除衣物（软删除）

- `DELETE /api/clothing/:id`（鉴权）
- 成功响应：

```json
{
  "success": true,
  "message": "衣物已移到回收站"
}
```

## 5. 扩展接口（后端可用，前端暂未全面接入）

- `GET /api/clothing/stats`
- `PATCH /api/clothing/:id/favorite`
- `GET /api/recycle-bin`
- `POST /api/recycle-bin/:id/restore`
- `DELETE /api/recycle-bin/:id`
- `DELETE /api/recycle-bin`
- `POST /api/upload/image`
- `DELETE /api/upload/image/:fileName`
- `GET /api/categories/stats`
- `GET /api/categories/:id/items`
- `POST /api/register`
- `GET /api/statistics`

## 6. 错误码约定

- `400`：参数错误 / 业务校验失败
- `401`：未提供 token 或未登录
- `403`：token 无效/过期
- `404`：资源不存在
- `500`：服务器内部错误

统一错误响应格式（常见）：

```json
{
  "success": false,
  "message": "错误信息"
}
```
