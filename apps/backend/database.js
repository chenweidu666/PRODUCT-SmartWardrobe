const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 数据库文件路径
const DB_PATH = path.join(__dirname, '../../database/wardrobe.db');

// 创建数据库连接
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('数据库连接失败:', err.message);
  } else {
    console.log('数据库连接成功');
    // 自动建表
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT,
        created_at DATETIME DEFAULT (datetime('now')),
        updated_at DATETIME DEFAULT (datetime('now'))
      )`);
      db.run(`CREATE TABLE IF NOT EXISTS user_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        icon TEXT DEFAULT '📁',
        color TEXT DEFAULT '#666',
        description TEXT,
        sort_order INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT (datetime('now')),
        updated_at DATETIME DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`);
      db.run(`CREATE TABLE IF NOT EXISTS clothing_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        category_id INTEGER,
        name TEXT NOT NULL,
        description TEXT,
        color TEXT,
        size TEXT,
        brand TEXT,
        season TEXT,
        material TEXT,
        style TEXT,
        image_url TEXT,
        price TEXT,
        purchase_date TEXT,
        is_favorite INTEGER DEFAULT 0,
        is_deleted INTEGER DEFAULT 0,
        deleted_at DATETIME,
        created_at DATETIME DEFAULT (datetime('now')),
        updated_at DATETIME DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (category_id) REFERENCES user_categories(id)
      )`);
      console.log('数据库表初始化完成');
    });
  }
});

// 用户数据库操作
const userDB = {
  // 创建用户
  create: (username, password, email = null) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO users (username, password, email, created_at, updated_at) VALUES (?, ?, ?, datetime("now"), datetime("now"))';
      db.run(sql, [username, password, email], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, username });
        }
      });
    });
  },

  // 根据用户名查找用户
  findByUsername: (username) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE username = ?';
      db.get(sql, [username], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  // 获取所有用户
  getAll: () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT id, username, email, created_at, updated_at FROM users ORDER BY created_at DESC';
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  // 删除用户
  delete: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM users WHERE id = ?';
      db.run(sql, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deleted: this.changes > 0 });
        }
      });
    });
  }
};

// 用户衣物类别数据库操作
const userCategoryDB = {
  // 获取用户的所有衣物类别
  getCategories: (userId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          uc.id,
          uc.name,
          uc.icon,
          uc.color,
          uc.description,
          uc.sort_order,
          uc.is_active,
          uc.created_at,
          uc.updated_at,
          COALESCE(COUNT(c.id), 0) as item_count
        FROM user_categories uc
        LEFT JOIN clothing_items c ON uc.id = c.category_id AND c.user_id = ? AND c.is_deleted = 0
        WHERE uc.user_id = ? AND uc.is_active = 1
        GROUP BY uc.id, uc.name, uc.icon, uc.color, uc.description, uc.sort_order, uc.is_active, uc.created_at, uc.updated_at
        ORDER BY uc.sort_order, uc.name
      `;
      db.all(sql, [userId, userId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  // 创建新衣物类别
  create: (userId, categoryData) => {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO user_categories (user_id, name, icon, color, description, sort_order)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      db.run(sql, [
        userId,
        categoryData.name,
        categoryData.icon,
        categoryData.color,
        categoryData.description,
        categoryData.sort_order || 0
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      });
    });
  },

  // 更新衣物类别
  update: (categoryId, userId, categoryData) => {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE user_categories 
        SET name = ?, icon = ?, color = ?, description = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?
      `;
      db.run(sql, [
        categoryData.name,
        categoryData.icon,
        categoryData.color,
        categoryData.description,
        categoryData.sort_order || 0,
        categoryId,
        userId
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  },

  // 删除衣物类别（软删除）
  delete: (categoryId, userId) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE user_categories SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?';
      db.run(sql, [categoryId, userId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  },

  // 获取类别统计信息
  getStats: (userId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          COUNT(*) as category_count,
          (SELECT COUNT(*) FROM clothing_items WHERE user_id = ? AND is_deleted = 0) as total_items,
          (SELECT COUNT(*) FROM clothing_items WHERE user_id = ? AND is_deleted = 0 AND is_favorite = 1) as favorite_items,
          (SELECT COALESCE(SUM(CAST(price AS REAL)), 0) FROM clothing_items WHERE user_id = ? AND is_deleted = 0 AND price IS NOT NULL AND price != '') as total_value,
          (SELECT COUNT(*) FROM clothing_items WHERE user_id = ? AND is_deleted = 0 AND price IS NOT NULL AND price != '') as items_with_price
        FROM user_categories 
        WHERE user_id = ? AND is_active = 1
      `;
      db.get(sql, [userId, userId, userId, userId, userId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
};

// 衣物数据库操作
const clothingDB = {
  // 根据用户ID获取衣物列表
  getByUserId: (userId, categoryId = null, includeDeleted = false) => {
    return new Promise((resolve, reject) => {
      let sql = `
        SELECT 
          c.*,
          uc.name as category_name,
          uc.icon as category_icon,
          uc.color as category_color
        FROM clothing_items c
        LEFT JOIN user_categories uc ON c.category_id = uc.id
        WHERE c.user_id = ?
      `;
      let params = [userId];
      
      if (!includeDeleted) {
        sql += ' AND c.is_deleted = 0';
      }
      
      if (categoryId) {
        sql += ' AND c.category_id = ?';
        params.push(categoryId);
      }
      
      sql += ' ORDER BY c.created_at DESC';
      
      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  // 根据ID获取单个衣物
  getById: (id, userId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          c.*,
          uc.name as category_name,
          uc.icon as category_icon,
          uc.color as category_color
        FROM clothing_items c
        LEFT JOIN user_categories uc ON c.category_id = uc.id
        WHERE c.id = ? AND c.user_id = ?
      `;
      db.get(sql, [id, userId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  // 创建衣物
  create: (clothingData) => {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO clothing_items (
          user_id, category_id, name, description, color, size, 
          brand, season, material, style, image_url, price, purchase_date, is_favorite, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime("now"), datetime("now"))
      `;
      const params = [
        clothingData.user_id,
        clothingData.category_id,
        clothingData.name,
        clothingData.description,
        clothingData.color,
        clothingData.size,
        clothingData.brand,
        clothingData.season,
        clothingData.material,
        clothingData.style,
        clothingData.image_url,
        clothingData.price || null,
        clothingData.purchase_date || null,
        false
      ];
      
      db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, ...clothingData });
        }
      });
    });
  },

  // 更新衣物
  update: (id, userId, updateData) => {
    return new Promise((resolve, reject) => {
      const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
      const sql = `UPDATE clothing_items SET ${fields}, updated_at = datetime("now") WHERE id = ? AND user_id = ?`;
      const params = [...Object.values(updateData), id, userId];
      
      db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ updated: this.changes > 0 });
        }
      });
    });
  },

  // 软删除衣物（移到回收站）
  softDelete: (id, userId) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE clothing_items SET is_deleted = 1, deleted_at = datetime("now"), updated_at = datetime("now") WHERE id = ? AND user_id = ?';
      db.run(sql, [id, userId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deleted: this.changes > 0 });
        }
      });
    });
  },

  // 恢复衣物（从回收站恢复）
  restore: (id, userId) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE clothing_items SET is_deleted = 0, deleted_at = NULL, updated_at = datetime("now") WHERE id = ? AND user_id = ?';
      db.run(sql, [id, userId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ restored: this.changes > 0 });
        }
      });
    });
  },

  // 永久删除衣物
  permanentDelete: (id, userId) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM clothing_items WHERE id = ? AND user_id = ? AND is_deleted = 1';
      db.run(sql, [id, userId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deleted: this.changes > 0 });
        }
      });
    });
  },

  // 获取回收站衣物列表
  getRecycleBin: (userId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          c.*,
          uc.name as category_name,
          uc.icon as category_icon,
          uc.color as category_color
        FROM clothing_items c
        LEFT JOIN user_categories uc ON c.category_id = uc.id
        WHERE c.user_id = ? AND c.is_deleted = 1
        ORDER BY c.updated_at DESC
      `;
      db.all(sql, [userId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  // 清空回收站
  emptyRecycleBin: (userId) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM clothing_items WHERE user_id = ? AND is_deleted = 1';
      db.run(sql, [userId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deleted: this.changes });
        }
      });
    });
  },

  // 切换收藏状态
  toggleFavorite: (id, userId) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE clothing_items SET is_favorite = NOT is_favorite, updated_at = datetime("now") WHERE id = ? AND user_id = ?';
      db.run(sql, [id, userId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ updated: this.changes > 0 });
        }
      });
    });
  }
};



module.exports = {
  userDB,
  userCategoryDB,
  clothingDB
}; 