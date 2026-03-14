#!/bin/bash

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}🚀 智能衣柜管理系统启动脚本${NC}"
echo ""

# ==================== 环境配置 ====================

echo -e "${BLUE}🔧 环境配置...${NC}"

# 检查 Node.js
if ! command -v node >/dev/null 2>&1; then
    echo -e "${RED}❌ 未检测到 Node.js，正在安装...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# 检查 npm
if ! command -v npm >/dev/null 2>&1; then
    echo -e "${RED}❌ 未检测到 npm，请先安装 Node.js${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js 版本: $(node --version)${NC}"
echo -e "${GREEN}✅ npm 版本: $(npm --version)${NC}"

# 检查端口占用
check_port() {
    local port=$1
    if netstat -tuln 2>/dev/null | grep -q ":$port "; then
        echo -e "${YELLOW}⚠️  端口 $port 已被占用，正在停止占用进程...${NC}"
        sudo fuser -k $port/tcp 2>/dev/null || true
        sleep 2
    fi
}

check_port 7861
check_port 7860

echo -e "${GREEN}✅ 环境配置完成${NC}"
echo ""

# ==================== 安装依赖 ====================

echo -e "${BLUE}📦 安装依赖...${NC}"

# 安装后端依赖
echo -e "${YELLOW}[后端] 安装依赖...${NC}"
cd backend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo -e "${GREEN}[后端] 依赖已安装，跳过${NC}"
fi
cd ..

# 安装前端依赖
echo -e "${YELLOW}[前端] 安装依赖...${NC}"
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo -e "${GREEN}[前端] 依赖已安装，跳过${NC}"
fi
cd ..

echo -e "${GREEN}✅ 依赖安装完成${NC}"
echo ""

# ==================== 初始化数据库 ====================

echo -e "${BLUE}🗄️  初始化数据库...${NC}"

# 确保数据库目录存在
mkdir -p database

cd backend
if [ ! -f "../database/wardrobe.db" ]; then
    echo -e "${YELLOW}[数据库] 首次运行，正在初始化数据库...${NC}"
    node init-db.js
else
    echo -e "${GREEN}[数据库] 数据库文件已存在，跳过初始化${NC}"
fi
cd ..

echo -e "${GREEN}✅ 数据库初始化完成${NC}"
echo ""

# ==================== 启动服务 ====================

echo -e "${BLUE}🚀 启动服务...${NC}"

# 停止已存在的服务
echo -e "${YELLOW}🛑 停止已存在的服务...${NC}"
pkill -f "node.*server.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
sleep 2

# 启动后端服务
echo -e "${YELLOW}[后端] 启动服务...${NC}"
cd backend
nohup npm run dev > backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > backend.pid
echo -e "${GREEN}[后端] 已启动，PID: $BACKEND_PID${NC}"
cd ..

# 等待后端启动
sleep 3

# 启动前端服务
echo -e "${YELLOW}[前端] 启动服务...${NC}"
cd frontend
nohup npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > frontend.pid
echo -e "${GREEN}[前端] 已启动，PID: $FRONTEND_PID${NC}"
cd ..

# 等待服务启动
echo -e "${YELLOW}⏳ 等待服务启动...${NC}"
sleep 5

# ==================== 检查服务状态 ====================

echo -e "${BLUE}📊 检查服务状态...${NC}"

# 检查后端
if kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${GREEN}✅ 后端服务: 运行中 (PID: $BACKEND_PID)${NC}"
else
    echo -e "${RED}❌ 后端服务启动失败${NC}"
    echo -e "${YELLOW}查看后端日志: tail -f backend/backend.log${NC}"
fi

# 检查前端
if kill -0 $FRONTEND_PID 2>/dev/null; then
    echo -e "${GREEN}✅ 前端服务: 运行中 (PID: $FRONTEND_PID)${NC}"
else
    echo -e "${RED}❌ 前端服务启动失败${NC}"
    echo -e "${YELLOW}查看前端日志: tail -f frontend/frontend.log${NC}"
fi

# 检查端口
if netstat -tuln 2>/dev/null | grep -q ":7861 "; then
    echo -e "${GREEN}✅ 前端端口 7861: 已监听${NC}"
else
    echo -e "${RED}❌ 前端端口 7861: 未监听${NC}"
fi

if netstat -tuln 2>/dev/null | grep -q ":7860 "; then
    echo -e "${GREEN}✅ 后端端口 7860: 已监听${NC}"
else
    echo -e "${RED}❌ 后端端口 7860: 未监听${NC}"
fi

echo ""
echo -e "${CYAN}🎉 服务启动完成！${NC}"
echo -e "${CYAN}🌐 访问地址:${NC}"
echo -e "  本地前端: ${GREEN}http://localhost:7861${NC}"
echo -e "  本地后端: ${GREEN}http://localhost:7860${NC}"
echo -e "  公网前端: ${GREEN}http://101.34.232.12:7861${NC}"
echo -e "  公网后端: ${GREEN}http://101.34.232.12:7860${NC}"
echo ""
echo -e "${YELLOW}📋 常用命令:${NC}"
echo -e "  查看后端日志: ${GREEN}tail -f backend/backend.log${NC}"
echo -e "  查看前端日志: ${GREEN}tail -f frontend/frontend.log${NC}"
echo -e "  停止服务: ${GREEN}pkill -f 'node.*server.js' && pkill -f 'vite'${NC}"
echo -e "  查看用户列表: ${GREEN}curl http://101.34.232.12:7860/api/users${NC}"
echo ""

# 自动打开浏览器（如果支持）
if command -v xdg-open >/dev/null 2>&1; then
    echo -e "${YELLOW}🌐 正在打开浏览器...${NC}"
    sleep 2
    xdg-open http://101.34.232.12:7861 2>/dev/null || true
elif command -v open >/dev/null 2>&1; then
    echo -e "${YELLOW}🌐 正在打开浏览器...${NC}"
    sleep 2
    open http://101.34.232.12:7861 2>/dev/null || true
fi 