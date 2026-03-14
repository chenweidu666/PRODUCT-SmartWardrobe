# ============================================
# SmartWardrobe Docker 部署 (ARM64 兼容)
# 多阶段构建: 前端构建 → 后端运行
# ============================================

# Stage 1: 构建前端
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --production=false
COPY frontend/ ./
RUN npm run build

# Stage 2: 运行后端 + 托管前端静态文件
FROM node:20-slim
WORKDIR /app

# 安装构建原生模块所需的工具 (better-sqlite3, sharp)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# 安装后端依赖
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --production

# 复制后端代码
COPY backend/ ./backend/

# 复制前端构建产物
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# 数据目录 (挂载 volume)
RUN mkdir -p /app/database/uploads/images

EXPOSE 8080

WORKDIR /app/backend
CMD ["node", "server.js"]
