#!/bin/bash

# SmartWardrobe 数据库信息查询工具启动脚本

echo "🏠 SmartWardrobe 数据库信息查询工具"
echo "=================================================="

# 检查是否在正确的目录
if [ ! -f "../database/wardrobe.db" ]; then
    echo "❌ 错误: 数据库文件不存在"
    echo "当前目录: $(pwd)"
    echo "请确保在项目根目录下运行此脚本"
    echo "使用方法: ./scripts/run_db_info.sh"
    exit 1
fi

# 检查Python是否安装
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误: Python3 未安装"
    echo "请先安装 Python3"
    exit 1
fi

# 检查tabulate库是否安装
if ! python3 -c "import tabulate" &> /dev/null; then
    echo "📦 正在安装依赖库..."
    pip3 install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
fi

# 运行Python脚本
echo "🚀 启动数据库信息查询工具..."
python3 db_info.py 