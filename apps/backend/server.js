const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const { userDB, userCategoryDB, clothingDB } = require('./database');
const { SERVER_PORT, JWT_SECRET_KEY } = require('./src/config/constants');
const { createAuthenticateToken } = require('./src/middlewares/auth');
const { 
  ensureDirectories, 
  validateImageFormat, 
  validateFileSize, 
  processImage, 
  deleteImage,
  IMAGE_CONFIG 
} = require('./utils/imageProcessor');

const app = express();
const authenticateToken = createAuthenticateToken(JWT_SECRET_KEY);
const configuredCorsOrigins = String(process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const defaultDevOrigins = [
  'http://localhost:8081',
  'http://127.0.0.1:8081',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://192.168.31.10:8080',
  'http://192.168.31.10:8081'
];
const allowedCorsOrigins =
  configuredCorsOrigins.length > 0
    ? configuredCorsOrigins
    : process.env.NODE_ENV === 'production'
      ? []
      : defaultDevOrigins;

const WEATHER_CONDITION_LABELS = {
  0: '晴',
  1: '少云',
  2: '多云',
  3: '阴',
  45: '雾',
  48: '冻雾',
  51: '小毛毛雨',
  53: '毛毛雨',
  55: '强毛毛雨',
  56: '冻毛毛雨',
  57: '强冻毛毛雨',
  61: '小雨',
  63: '中雨',
  65: '大雨',
  66: '冻雨',
  67: '强冻雨',
  71: '小雪',
  73: '中雪',
  75: '大雪',
  77: '冰粒',
  80: '阵雨',
  81: '强阵雨',
  82: '暴雨',
  85: '阵雪',
  86: '强阵雪',
  95: '雷阵雨',
  96: '雷暴夹小冰雹',
  99: '雷暴夹大冰雹'
};
const WEATHER_CACHE_MS = 10 * 60 * 1000;
const weatherCache = new Map();

function normalizeSeasonInput(season) {
  if (Array.isArray(season)) {
    const valid = season.map((item) => String(item || '').trim()).filter(Boolean);
    return valid.join('、');
  }
  return String(season || '').trim();
}

async function requestJson(url, timeout = 6000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`天气服务请求失败（${response.status}）`);
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

// 确保上传目录存在
ensureDirectories();

// 中间件
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }
    if (allowedCorsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('CORS origin not allowed'));
  },
  credentials: true
}));
app.use(express.json());

// 静态文件服务 — 上传图片
app.use('/uploads', express.static(path.join(__dirname, '../../database/uploads/images')));

// 生产环境: 托管前端构建产物（兼容不同启动目录）
const frontendDistCandidates = [
  path.resolve(__dirname, '../frontend/dist'),
  path.resolve(__dirname, '../../apps/frontend/dist'),
  path.resolve(process.cwd(), 'apps/frontend/dist'),
  path.resolve(process.cwd(), 'frontend/dist')
];
const frontendDist = frontendDistCandidates.find((distPath) =>
  fs.existsSync(path.join(distPath, 'index.html'))
);
if (frontendDist) {
  app.use(express.static(frontendDist));
}

// 配置multer
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: IMAGE_CONFIG.maxFileSize
  },
  fileFilter: (req, file, cb) => {
    if (validateImageFormat(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('不支持的文件格式'), false);
    }
  }
});

// 登录接口
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 从数据库查找用户
    const user = await userDB.findByUsername(username);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }
    
    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }
    
    // 生成JWT token
    const token = jwt.sign({ username: user.username, id: user.id }, JWT_SECRET_KEY, { expiresIn: '24h' });
    
    res.json({
      success: true,
      message: '登录成功',
      token: token,
      user: { 
        id: user.id,
        username: user.username 
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 注册接口
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 验证输入
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名和密码不能为空'
      });
    }
    
    if (username.length < 2 || password.length < 2) {
      return res.status(400).json({
        success: false,
        message: '用户名和密码长度至少2位'
      });
    }
    
    // 检查用户是否已存在
    const existingUser = await userDB.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '用户名已存在'
      });
    }
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 创建新用户
    const newUser = await userDB.create(username, hashedPassword);
    
    res.json({
      success: true,
      message: '注册成功',
      user: { 
        id: newUser.id,
        username: newUser.username 
      }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取用户列表（需要管理员权限）
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const users = await userDB.getAll();
    res.json({
      success: true,
      users: users
    });
  } catch (error) {
    console.error('获取用户列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 天气接口（公开）：根据城市名称返回当前天气
app.get('/api/weather', async (req, res) => {
  try {
    const city = String(req.query.city || '上海').trim() || '上海';
    const cacheKey = city.toLowerCase();
    const cached = weatherCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < WEATHER_CACHE_MS) {
      return res.json(cached.payload);
    }

    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=zh&format=json`;
    const geoData = await requestJson(geoUrl);
    const location = Array.isArray(geoData?.results) ? geoData.results[0] : null;
    if (!location) {
      return res.status(404).json({
        success: false,
        message: `未找到城市：${city}`
      });
    }

    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}` +
      `&longitude=${location.longitude}&current=temperature_2m,apparent_temperature,weather_code&timezone=auto`;
    const weatherData = await requestJson(weatherUrl);
    const current = weatherData?.current;
    if (!current) {
      throw new Error('天气数据格式异常');
    }

    const payload = {
      success: true,
      weather: {
        city: city,
        resolvedCity: location.name,
        temperature: Number(current.temperature_2m),
        apparentTemperature: Number(current.apparent_temperature),
        weatherCode: Number(current.weather_code),
        condition: WEATHER_CONDITION_LABELS[current.weather_code] || '未知'
      }
    };

    weatherCache.set(cacheKey, {
      timestamp: Date.now(),
      payload
    });
    res.json(payload);
  } catch (error) {
    console.error('获取天气失败:', error);
    res.status(500).json({
      success: false,
      message: '获取天气失败'
    });
  }
});

// 删除用户（需要管理员权限）
app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userDB.delete(id);
    
    if (result.deleted) {
      res.json({
        success: true,
        message: '用户删除成功'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
  } catch (error) {
    console.error('删除用户错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 图片上传接口
app.post('/api/upload/image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请选择要上传的图片'
      });
    }

    // 验证文件大小
    if (!validateFileSize(req.file.size)) {
      return res.status(400).json({
        success: false,
        message: `文件大小不能超过 ${IMAGE_CONFIG.maxFileSize / 1024 / 1024}MB`
      });
    }

    // 获取类别信息
    const categoryName = req.body.categoryName || null;
    
    // 处理图片
    const result = await processImage(req.file.buffer, req.file.originalname, categoryName);
    
    if (result.success) {
      res.json({
        success: true,
        message: '图片上传成功',
        data: {
          fileName: result.fileName,
          fileUrl: `${req.protocol}://${req.get('host')}${result.fileUrl}`,
          fileSize: result.fileSize,
          compressionRatio: result.compressionRatio
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: '图片处理失败',
        error: result.error
      });
    }
  } catch (error) {
    console.error('图片上传错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 删除图片接口
app.delete('/api/upload/image/:fileName', authenticateToken, async (req, res) => {
  try {
    const { fileName } = req.params;
    const result = await deleteImage(fileName);
    
    if (result.success) {
      res.json({
        success: true,
        message: '图片删除成功'
      });
    } else {
      res.status(500).json({
        success: false,
        message: '图片删除失败',
        error: result.error
      });
    }
  } catch (error) {
    console.error('删除图片错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取用户衣物类别
app.get('/api/categories', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const categories = await userCategoryDB.getCategories(userId);
    res.json({
      success: true,
      categories: categories
    });
  } catch (error) {
    console.error('获取衣物类别列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 创建新衣物类别
app.post('/api/categories', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const categoryData = {
      name: req.body.name,
      icon: req.body.icon || '🏷️',
      color: req.body.color || '#667eea',
      description: req.body.description || '',
      sort_order: req.body.sort_order || 0
    };
    
    const result = await userCategoryDB.create(userId, categoryData);
    res.json({
      success: true,
      message: '衣物类别创建成功',
      categoryId: result.id
    });
  } catch (error) {
    console.error('创建衣物类别错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 更新衣物类别
app.put('/api/categories/:id', authenticateToken, async (req, res) => {
  try {
    const categoryId = req.params.id;
    const userId = req.user.id;
    const categoryData = {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
      description: req.body.description,
      sort_order: req.body.sort_order
    };
    
    const result = await userCategoryDB.update(categoryId, userId, categoryData);
    res.json({
      success: true,
      message: '衣物类别更新成功',
      changes: result.changes
    });
  } catch (error) {
    console.error('更新衣物类别错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 删除衣物类别
app.delete('/api/categories/:id', authenticateToken, async (req, res) => {
  try {
    const categoryId = req.params.id;
    const userId = req.user.id;
    
    const result = await userCategoryDB.delete(categoryId, userId);
    res.json({
      success: true,
      message: '衣物类别删除成功',
      changes: result.changes
    });
  } catch (error) {
    console.error('删除衣物类别错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});



// 获取用户衣物列表
app.get('/api/clothing', authenticateToken, async (req, res) => {
  try {
    const { category_id } = req.query;
    const userId = req.user.id;
    
    const clothing = await clothingDB.getByUserId(userId, category_id);
    res.json({
      success: true,
      clothing: clothing
    });
  } catch (error) {
    console.error('获取衣物列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取衣物统计 - 必须在 /:id 路由之前
app.get('/api/clothing/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const stats = await userCategoryDB.getStats(userId);
    
    res.json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error('获取统计信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取单个衣物详情
app.get('/api/clothing/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const clothing = await clothingDB.getById(id, userId);
    if (!clothing) {
      return res.status(404).json({
        success: false,
        message: '衣物不存在'
      });
    }
    
    res.json({
      success: true,
      clothing: clothing
    });
  } catch (error) {
    console.error('获取衣物详情错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 添加衣物
app.post('/api/clothing', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      category_id, name, description, color, size, brand, season, price, purchase_date, image_url, is_processed, chest_circumference, shoulder_width
    } = req.body;
    const normalizedSeason = normalizeSeasonInput(season);
    
    // 验证必填字段
    if (!category_id || !name || !color || !normalizedSeason) {
      return res.status(400).json({
        success: false,
        message: '分类、名称、颜色、适配季节不能为空'
      });
    }
    
    const clothingData = {
      user_id: userId,
      category_id,
      name,
      description: description || '',
      color: color || '',
      size: size || '',
      brand: brand || '',
      season: normalizedSeason,
      price: price || '',
      purchase_date: purchase_date || '',
      chest_circumference: chest_circumference || '',
      shoulder_width: shoulder_width || '',
      image_url: image_url || '',
      is_processed: Number(is_processed) === 1 ? 1 : 0
    };
    
    const newClothing = await clothingDB.create(clothingData);
    res.json({
      success: true,
      message: '衣物添加成功',
      clothing: newClothing
    });
  } catch (error) {
    console.error('添加衣物错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 更新衣物
app.put('/api/clothing/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;
    
    // 获取当前衣物信息，以便比较图片URL
    const currentClothing = await clothingDB.getById(id, userId);
    
    // 移除不允许更新的字段
    delete updateData.id;
    delete updateData.user_id;
    delete updateData.created_at;
    if (Object.prototype.hasOwnProperty.call(updateData, 'season')) {
      updateData.season = normalizeSeasonInput(updateData.season);
    }
    if (Object.prototype.hasOwnProperty.call(updateData, 'color') && !String(updateData.color || '').trim()) {
      return res.status(400).json({ success: false, message: '颜色不能为空' });
    }
    if (Object.prototype.hasOwnProperty.call(updateData, 'season') && !String(updateData.season || '').trim()) {
      return res.status(400).json({ success: false, message: '适配季节不能为空' });
    }
    if (Object.prototype.hasOwnProperty.call(updateData, 'name') && !String(updateData.name || '').trim()) {
      return res.status(400).json({ success: false, message: '名称不能为空' });
    }
    if (Object.prototype.hasOwnProperty.call(updateData, 'is_processed')) {
      updateData.is_processed = Number(updateData.is_processed) === 1 ? 1 : 0;
    }
    
    const result = await clothingDB.update(id, userId, updateData);
    if (result.updated) {
      // 如果图片URL发生变化，删除旧图片
      if (currentClothing && 
          currentClothing.image_url && 
          updateData.image_url && 
          currentClothing.image_url !== updateData.image_url) {
        
        // 从URL中提取文件名
        const oldFileName = currentClothing.image_url.split('/').pop();
        if (oldFileName) {
          try {
            await deleteImage(oldFileName);
            console.log(`删除旧图片: ${oldFileName}`);
          } catch (error) {
            console.error('删除旧图片失败:', error);
            // 不阻止更新操作，只记录错误
          }
        }
      }
      
      res.json({
        success: true,
        message: '衣物更新成功'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '衣物不存在'
      });
    }
  } catch (error) {
    console.error('更新衣物错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 软删除衣物（移到回收站）
app.delete('/api/clothing/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const result = await clothingDB.softDelete(id, userId);
    if (result.deleted) {
      res.json({
        success: true,
        message: '衣物已移到回收站'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '衣物不存在或无法删除'
      });
    }
  } catch (error) {
    console.error('删除衣物错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取回收站列表
app.get('/api/recycle-bin', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const recycleBin = await clothingDB.getRecycleBin(userId);
    res.json({
      success: true,
      recycleBin: recycleBin
    });
  } catch (error) {
    console.error('获取回收站列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 恢复衣物
app.post('/api/recycle-bin/:id/restore', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const result = await clothingDB.restore(id, userId);
    if (result.restored) {
      res.json({
        success: true,
        message: '衣物恢复成功'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '衣物不存在或无法恢复'
      });
    }
  } catch (error) {
    console.error('恢复衣物错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 永久删除衣物
app.delete('/api/recycle-bin/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // 获取衣物信息，以便删除关联的图片
    const clothing = await clothingDB.getById(id, userId);
    
    const result = await clothingDB.permanentDelete(id, userId);
    if (result.deleted) {
      // 如果有关联的图片，删除图片文件
      if (clothing && clothing.image_url) {
        const fileName = clothing.image_url.split('/').pop();
        if (fileName) {
          await deleteImage(fileName);
        }
      }
      
      res.json({
        success: true,
        message: '衣物永久删除成功'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '衣物不存在或无法删除'
      });
    }
  } catch (error) {
    console.error('永久删除衣物错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 清空回收站
app.delete('/api/recycle-bin', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await clothingDB.emptyRecycleBin(userId);
    
    res.json({
      success: true,
      message: `回收站已清空，共删除 ${result.deleted} 件衣物`
    });
  } catch (error) {
    console.error('清空回收站错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 切换收藏状态
app.patch('/api/clothing/:id/favorite', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const result = await clothingDB.toggleFavorite(id, userId);
    if (result.updated) {
      res.json({
        success: true,
        message: '收藏状态更新成功'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '衣物不存在'
      });
    }
  } catch (error) {
    console.error('切换收藏状态错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 分类统计信息
app.get('/api/categories/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await userCategoryDB.getStats(userId);

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('获取分类统计错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取分类下的衣物
app.get('/api/categories/:id/items', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const items = await clothingDB.getByUserId(userId, id);

    res.json({
      success: true,
      items
    });
  } catch (error) {
    console.error('获取分类衣物错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 备份API
app.post('/api/backup', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, '../../database_backup', timestamp);
    const sourceDir = path.join(__dirname, '../../database');
    
    // 创建备份目录
    if (!fs.existsSync(path.join(__dirname, '../../database_backup'))) {
      fs.mkdirSync(path.join(__dirname, '../../database_backup'), { recursive: true });
    }
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // 复制数据库文件
    const copyDirectory = (src, dest) => {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      
      const files = fs.readdirSync(src);
      files.forEach(file => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        
        if (fs.statSync(srcPath).isDirectory()) {
          copyDirectory(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      });
    };
    
    copyDirectory(sourceDir, backupDir);
    
    res.json({
      success: true,
      message: '备份成功',
      backupPath: backupDir
    });
  } catch (error) {
    console.error('备份错误:', error);
    res.status(500).json({
      success: false,
      message: '备份失败：' + error.message
    });
  }
});

// 删除备份API
app.delete('/api/backup/:timestamp', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const timestamp = req.params.timestamp;
    const backupDir = path.join(__dirname, '../../database_backup', timestamp);
    
    // 检查备份目录是否存在
    if (!fs.existsSync(backupDir)) {
      return res.status(404).json({
        success: false,
        message: '备份不存在'
      });
    }
    
    // 删除备份目录
    const deleteDirectory = (dirPath) => {
      if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach((file) => {
          const curPath = path.join(dirPath, file);
          if (fs.lstatSync(curPath).isDirectory()) {
            deleteDirectory(curPath);
          } else {
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(dirPath);
      }
    };
    
    deleteDirectory(backupDir);
    
    res.json({
      success: true,
      message: '备份删除成功'
    });
  } catch (error) {
    console.error('删除备份错误:', error);
    res.status(500).json({
      success: false,
      message: '删除备份失败：' + error.message
    });
  }
});

// 获取备份历史API
app.get('/api/backup/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const backupDir = path.join(__dirname, '../../database_backup');
    
    if (!fs.existsSync(backupDir)) {
      return res.json({
        success: true,
        backups: []
      });
    }
    
    const backupFolders = fs.readdirSync(backupDir)
      .filter(item => {
        const itemPath = path.join(backupDir, item);
        return fs.statSync(itemPath).isDirectory();
      })
      .sort((a, b) => {
        // 按时间倒序排列
        return new Date(b.replace(/-/g, ':').replace('T', ' ').replace('Z', '')) - 
               new Date(a.replace(/-/g, ':').replace('T', ' ').replace('Z', ''));
      })
      .slice(0, 10); // 只返回最近10个备份
    
    const backups = [];
    
    for (const folder of backupFolders) {
      const backupPath = path.join(backupDir, folder);
      const dbPath = path.join(backupPath, 'wardrobe.db');
      
      if (fs.existsSync(dbPath)) {
        const stats = fs.statSync(dbPath);
        const size = (stats.size / 1024 / 1024).toFixed(1) + ' MB';
        
        // 读取备份数据库获取统计信息
        const backupDB = new Database(dbPath);
        
        try {
          const clothingCount = backupDB.prepare('SELECT COUNT(*) as count FROM clothing_items WHERE user_id = ? AND is_deleted = 0').get(userId)?.count || 0;
          const totalValue = backupDB.prepare('SELECT SUM(CAST(price AS REAL)) as total FROM clothing_items WHERE user_id = ? AND is_deleted = 0 AND price IS NOT NULL AND price != \'\'').get(userId)?.total || 0;
          
          // 格式化时间显示
          const date = new Date(folder);
          let formattedDate;
          
          if (isNaN(date.getTime())) {
            // 如果日期解析失败，使用原始格式
            formattedDate = folder.replace('T', ' ').replace('Z', '');
          } else {
            // 手动格式化时间
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hour = String(date.getHours()).padStart(2, '0');
            const minute = String(date.getMinutes()).padStart(2, '0');
            const second = String(date.getSeconds()).padStart(2, '0');
            formattedDate = `${year}/${month}/${day} ${hour}:${minute}:${second}`;
          }
          
          backups.push({
            timestamp: folder, // 添加时间戳用于删除
            date: formattedDate,
            size: size,
            clothingCount: clothingCount,
            totalValue: totalValue.toFixed(0)
          });
        } catch (dbError) {
          console.error('读取备份数据库错误:', dbError);
          backups.push({
            date: folder.replace(/-/g, ':').replace('T', ' ').replace('Z', ''),
            size: size,
            clothingCount: 0,
            totalValue: '0'
          });
        } finally {
          backupDB.close();
        }
      }
    }
    
    res.json({
      success: true,
      backups: backups
    });
  } catch (error) {
    console.error('获取备份历史错误:', error);
    res.status(500).json({
      success: false,
      message: '获取备份历史失败：' + error.message
    });
  }
});

// 统计数据API
app.get('/api/statistics', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const period = req.query.period || 'all';
    
    // 直接连接数据库
    const dbPath = path.join(__dirname, '../../database/wardrobe.db');
    const db = new Database(dbPath);
    
    // 构建时间筛选条件
    let timeFilter = '';
    let timeParams = [];
    
    if (period !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (period) {
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'quarter':
          const quarter = Math.floor(now.getMonth() / 3);
          startDate = new Date(now.getFullYear(), quarter * 3, 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(0);
      }
      
      timeFilter = 'AND created_at >= ?';
      timeParams = [startDate.toISOString()];
    }
    
    // 概览统计
    const overviewQuery = `
      SELECT 
        COUNT(*) as totalClothing,
        SUM(CASE WHEN is_favorite = 1 THEN 1 ELSE 0 END) as favoriteClothing,
        COUNT(DISTINCT category_id) as categoryCount,
        SUM(CASE WHEN price IS NOT NULL AND price != '' THEN 1 ELSE 0 END) as itemsWithPrice
      FROM clothing_items 
      WHERE user_id = ? AND is_deleted = 0 ${timeFilter}
    `;
    
    const overview = db.prepare(overviewQuery).get(userId, ...timeParams);
    
    // 分类统计
    const categoryQuery = `
      SELECT 
        c.name as category,
        COUNT(ci.id) as count
      FROM clothing_items ci
      LEFT JOIN user_categories c ON ci.category_id = c.id
      WHERE ci.user_id = ? AND ci.is_deleted = 0 ${timeFilter}
      GROUP BY c.id, c.name
      ORDER BY count DESC
    `;
    
    const categoryResults = db.prepare(categoryQuery).all(userId, ...timeParams);
    const totalItems = overview.totalClothing;
    
    const categoryStats = categoryResults.map((item, index) => {
      const colors = ['#667eea', '#28a745', '#ff6b6b', '#ffc107', '#6f42c1', '#fd7e14', '#e83e8c', '#20c997'];
      return {
        category: item.category || '未分类',
        count: item.count,
        percentage: totalItems > 0 ? Math.round((item.count / totalItems) * 100) : 0,
        color: colors[index % colors.length]
      };
    });
    
    // 颜色统计
    const colorQuery = `
      SELECT 
        color,
        COUNT(*) as count
      FROM clothing_items 
      WHERE user_id = ? AND is_deleted = 0 AND color IS NOT NULL AND color != '' ${timeFilter}
      GROUP BY color
      ORDER BY count DESC
    `;
    
    const colorResults = db.prepare(colorQuery).all(userId, ...timeParams);
    
    const colorMap = {
      '白色': '#ffffff',
      '黑色': '#000000',
      '蓝色': '#0066cc',
      '灰色': '#666666',
      '红色': '#ff0000',
      '绿色': '#00cc00',
      '黄色': '#ffff00',
      '紫色': '#800080',
      '粉色': '#ffc0cb',
      '橙色': '#ffa500',
      '棕色': '#8b4513',
      '青色': '#00ffff'
    };
    
    const colorStats = colorResults.map(item => ({
      color: item.color,
      count: item.count,
      percentage: totalItems > 0 ? Math.round((item.count / totalItems) * 100) : 0,
      hex: colorMap[item.color] || '#cccccc'
    }));
    
    // 季节统计
    const seasonQuery = `
      SELECT 
        season,
        COUNT(*) as count
      FROM clothing_items 
      WHERE user_id = ? AND is_deleted = 0 AND season IS NOT NULL AND season != '' ${timeFilter}
      GROUP BY season
      ORDER BY count DESC
    `;
    
    const seasonResults = db.prepare(seasonQuery).all(userId, ...timeParams);
    
    const seasonIcons = {
      '春季': '🌸',
      '夏季': '☀️',
      '秋季': '🍂',
      '冬季': '❄️'
    };
    
    const seasonStats = seasonResults.map(item => ({
      season: item.season,
      count: item.count,
      percentage: totalItems > 0 ? Math.round((item.count / totalItems) * 100) : 0,
      icon: seasonIcons[item.season] || '🌍'
    }));
    
    // 价格分布统计
    const priceQuery = `
      SELECT 
        CASE 
          WHEN CAST(price AS REAL) <= 100 THEN '0-100元'
          WHEN CAST(price AS REAL) <= 300 THEN '100-300元'
          WHEN CAST(price AS REAL) <= 500 THEN '300-500元'
          WHEN CAST(price AS REAL) <= 1000 THEN '500-1000元'
          ELSE '1000元以上'
        END as priceRange,
        COUNT(*) as count
      FROM clothing_items 
      WHERE user_id = ? AND is_deleted = 0 AND price IS NOT NULL AND price != '' ${timeFilter}
      GROUP BY priceRange
      ORDER BY 
        CASE priceRange
          WHEN '0-100元' THEN 1
          WHEN '100-300元' THEN 2
          WHEN '300-500元' THEN 3
          WHEN '500-1000元' THEN 4
          WHEN '1000元以上' THEN 5
        END
    `;
    
    const priceResults = db.prepare(priceQuery).all(userId, ...timeParams);
    const itemsWithPrice = overview.itemsWithPrice;
    
    const priceRange = priceResults.map(item => ({
      range: item.priceRange,
      count: item.count,
      percentage: itemsWithPrice > 0 ? Math.round((item.count / itemsWithPrice) * 100) : 0
    }));
    
    res.json({
      success: true,
      overview: {
        totalClothing: overview.totalClothing || 0,
        favoriteClothing: overview.favoriteClothing || 0,
        categoryCount: overview.categoryCount || 0,
        itemsWithPrice: overview.itemsWithPrice || 0
      },
      categoryStats,
      colorStats,
      seasonStats,
      priceRange
    });
    
  } catch (error) {
    console.error('获取统计数据错误:', error);
    res.status(500).json({
      success: false,
      message: '获取统计数据失败：' + error.message
    });
  } finally {
    // 关闭数据库连接
    if (typeof db !== 'undefined' && db) {
      db.close();
    }
  }
});

// 受保护的路由示例
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: '访问成功', user: req.user });
});

// 前端 SPA 路由 fallback (必须放在所有 API 路由之后)
if (frontendDist) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// 启动服务器
app.listen(SERVER_PORT, '0.0.0.0', () => {
  console.log(`服务器运行在 http://0.0.0.0:${SERVER_PORT}`);
}); 