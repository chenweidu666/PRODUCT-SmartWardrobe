#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
数据库信息查询脚本
用于快速查看SmartWardrobe数据库的用户、分类、衣物等信息
"""

import sqlite3
import sys
import os
from tabulate import tabulate
from datetime import datetime

# 数据库路径
DB_PATH = '../database/wardrobe.db'

def connect_db():
    """连接数据库"""
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row  # 使结果可以通过列名访问
        return conn
    except Exception as e:
        print(f"❌ 数据库连接失败: {e}")
        sys.exit(1)

def get_user_info(conn):
    """获取用户信息"""
    query = """
    SELECT 
        u.id,
        u.username,
        COUNT(DISTINCT uc.id) as category_count,
        COUNT(DISTINCT ci.id) as clothing_count,
        COUNT(DISTINCT CASE WHEN ci.is_favorite = 1 THEN ci.id END) as favorite_count,
        COUNT(DISTINCT CASE WHEN ci.price IS NOT NULL AND ci.price != '' THEN ci.id END) as priced_count
    FROM users u
    LEFT JOIN user_categories uc ON u.id = uc.user_id
    LEFT JOIN clothing_items ci ON u.id = ci.user_id AND ci.is_deleted = 0
    GROUP BY u.id, u.username
    ORDER BY u.id
    """
    
    cursor = conn.cursor()
    cursor.execute(query)
    users = cursor.fetchall()
    
    headers = ['ID', '用户名', '分类数', '衣物数', '收藏数', '有价格数']
    table_data = []
    
    for user in users:
        table_data.append([
            user['id'],
            user['username'],
            user['category_count'],
            user['clothing_count'],
            user['favorite_count'],
            user['priced_count']
        ])
    
    return headers, table_data

def get_category_info(conn, user_id=None):
    """获取分类信息"""
    if user_id:
        query = """
        SELECT 
            id,
            name,
            icon,
            color,
            created_at
        FROM user_categories 
        WHERE user_id = ?
        ORDER BY name
        """
        cursor = conn.cursor()
        cursor.execute(query, (user_id,))
    else:
        query = """
        SELECT 
            uc.id,
            u.username as user_name,
            uc.name,
            uc.icon,
            uc.color,
            uc.created_at
        FROM user_categories uc
        JOIN users u ON uc.user_id = u.id
        ORDER BY u.username, uc.name
        """
        cursor = conn.cursor()
        cursor.execute(query)
    
    categories = cursor.fetchall()
    
    if user_id:
        headers = ['ID', '分类名', '图标', '颜色', '创建时间']
        table_data = []
        for cat in categories:
            table_data.append([
                cat['id'],
                cat['name'],
                cat['icon'],
                cat['color'],
                cat['created_at']
            ])
    else:
        headers = ['ID', '用户', '分类名', '图标', '颜色', '创建时间']
        table_data = []
        for cat in categories:
            table_data.append([
                cat['id'],
                cat['user_name'],
                cat['name'],
                cat['icon'],
                cat['color'],
                cat['created_at']
            ])
    
    return headers, table_data

def get_clothing_info(conn, user_id=None):
    """获取衣物信息"""
    if user_id:
        query = """
        SELECT 
            ci.id,
            ci.name,
            uc.name as category_name,
            ci.color,
            ci.size,
            ci.brand,
            ci.season,
            ci.price,
            ci.is_favorite,
            ci.created_at
        FROM clothing_items ci
        LEFT JOIN user_categories uc ON ci.category_id = uc.id
        WHERE ci.user_id = ? AND ci.is_deleted = 0
        ORDER BY ci.created_at DESC
        """
        cursor = conn.cursor()
        cursor.execute(query, (user_id,))
    else:
        query = """
        SELECT 
            ci.id,
            u.username as user_name,
            ci.name,
            uc.name as category_name,
            ci.color,
            ci.size,
            ci.brand,
            ci.season,
            ci.price,
            ci.is_favorite,
            ci.created_at
        FROM clothing_items ci
        JOIN users u ON ci.user_id = u.id
        LEFT JOIN user_categories uc ON ci.category_id = uc.id
        WHERE ci.is_deleted = 0
        ORDER BY u.username, ci.created_at DESC
        """
        cursor = conn.cursor()
        cursor.execute(query)
    
    clothes = cursor.fetchall()
    
    if user_id:
        headers = ['ID', '名称', '分类', '颜色', '尺码', '品牌', '季节', '价格', '收藏', '创建时间']
        table_data = []
        for item in clothes:
            table_data.append([
                item['id'],
                item['name'],
                item['category_name'] or '-',
                item['color'] or '-',
                item['size'] or '-',
                item['brand'] or '-',
                item['season'] or '-',
                f"¥{item['price']}" if item['price'] else '-',
                '❤️' if item['is_favorite'] else '🤍',
                item['created_at']
            ])
    else:
        headers = ['ID', '用户', '名称', '分类', '颜色', '尺码', '品牌', '季节', '价格', '收藏', '创建时间']
        table_data = []
        for item in clothes:
            table_data.append([
                item['id'],
                item['user_name'],
                item['name'],
                item['category_name'] or '-',
                item['color'] or '-',
                item['size'] or '-',
                item['brand'] or '-',
                item['season'] or '-',
                f"¥{item['price']}" if item['price'] else '-',
                '❤️' if item['is_favorite'] else '🤍',
                item['created_at']
            ])
    
    return headers, table_data

def get_statistics(conn):
    """获取统计信息"""
    query = """
    SELECT 
        u.username,
        COUNT(DISTINCT uc.id) as category_count,
        COUNT(DISTINCT ci.id) as clothing_count,
        COUNT(DISTINCT CASE WHEN ci.is_favorite = 1 THEN ci.id END) as favorite_count,
        COUNT(DISTINCT CASE WHEN ci.price IS NOT NULL AND ci.price != '' THEN ci.id END) as priced_count,
        SUM(CASE WHEN ci.price IS NOT NULL AND ci.price != '' THEN CAST(ci.price AS REAL) ELSE 0 END) as total_value
    FROM users u
    LEFT JOIN user_categories uc ON u.id = uc.user_id
    LEFT JOIN clothing_items ci ON u.id = ci.user_id AND ci.is_deleted = 0
    GROUP BY u.id, u.username
    ORDER BY clothing_count DESC
    """
    
    cursor = conn.cursor()
    cursor.execute(query)
    stats = cursor.fetchall()
    
    headers = ['用户', '分类数', '衣物数', '收藏数', '有价格数', '总价值']
    table_data = []
    
    for stat in stats:
        table_data.append([
            stat['username'],
            stat['category_count'],
            stat['clothing_count'],
            stat['favorite_count'],
            stat['priced_count'],
            f"¥{stat['total_value']:.0f}" if stat['total_value'] > 0 else '-'
        ])
    
    return headers, table_data

def main():
    """主函数"""
    print("🏠 SmartWardrobe 数据库信息查询工具")
    print("=" * 50)
    
    # 检查数据库文件是否存在
    if not os.path.exists(DB_PATH):
        print(f"❌ 数据库文件不存在: {DB_PATH}")
        print("请确保在项目根目录下运行此脚本")
        sys.exit(1)
    
    conn = connect_db()
    
    try:
        while True:
            print("\n📋 请选择要查看的信息:")
            print("1. 用户信息")
            print("2. 分类信息")
            print("3. 衣物信息")
            print("4. 统计信息")
            print("5. 指定用户的分类")
            print("6. 指定用户的衣物")
            print("0. 退出")
            
            choice = input("\n请输入选择 (0-6): ").strip()
            
            if choice == '0':
                print("👋 再见！")
                break
            elif choice == '1':
                print("\n👥 用户信息:")
                headers, data = get_user_info(conn)
                print(tabulate(data, headers=headers, tablefmt='grid'))
            elif choice == '2':
                print("\n🏷️ 分类信息:")
                headers, data = get_category_info(conn)
                print(tabulate(data, headers=headers, tablefmt='grid'))
            elif choice == '3':
                print("\n👔 衣物信息:")
                headers, data = get_clothing_info(conn)
                print(tabulate(data, headers=headers, tablefmt='grid'))
            elif choice == '4':
                print("\n📊 统计信息:")
                headers, data = get_statistics(conn)
                print(tabulate(data, headers=headers, tablefmt='grid'))
            elif choice == '5':
                user_id = input("请输入用户ID: ").strip()
                try:
                    user_id = int(user_id)
                    print(f"\n🏷️ 用户ID {user_id} 的分类信息:")
                    headers, data = get_category_info(conn, user_id)
                    print(tabulate(data, headers=headers, tablefmt='grid'))
                except ValueError:
                    print("❌ 请输入有效的用户ID")
            elif choice == '6':
                user_id = input("请输入用户ID: ").strip()
                try:
                    user_id = int(user_id)
                    print(f"\n👔 用户ID {user_id} 的衣物信息:")
                    headers, data = get_clothing_info(conn, user_id)
                    print(tabulate(data, headers=headers, tablefmt='grid'))
                except ValueError:
                    print("❌ 请输入有效的用户ID")
            else:
                print("❌ 无效选择，请重新输入")
    
    except KeyboardInterrupt:
        print("\n\n👋 用户中断，再见！")
    finally:
        conn.close()

if __name__ == "__main__":
    main() 