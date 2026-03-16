const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

// 确保上传目录存在
const UPLOAD_DIR = path.join(__dirname, '../../../database/uploads/images');

// 创建目录
async function ensureDirectories() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error('创建目录失败:', error);
  }
}

// 图片处理配置
const IMAGE_CONFIG = {
  // 压缩后的图片配置
  compressed: {
    size: 800,      // 统一输出为正方形缩略图，便于前端网格展示
    quality: 80,    // 降低质量，进一步压缩
    format: 'webp'  // 使用WebP格式，体积更小
  },
  // 支持的格式
  supportedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'],
  // 最大文件大小 (5MB)
  maxFileSize: 5 * 1024 * 1024
};

// 验证文件格式
function validateImageFormat(filename) {
  const ext = path.extname(filename).toLowerCase().slice(1);
  return IMAGE_CONFIG.supportedFormats.includes(ext);
}

// 验证文件大小
function validateFileSize(size) {
  return size <= IMAGE_CONFIG.maxFileSize;
}

// 生成唯一文件名
function generateFileName(originalName, categoryName = null) {
  const ext = path.extname(originalName).toLowerCase();
  
  if (categoryName) {
    // 根据类别生成文件名
    const timestamp = Date.now();
    const uuid = uuidv4().slice(0, 6);
    // 清理类别名称，移除特殊字符
    const cleanCategoryName = categoryName.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '');
    return `${cleanCategoryName}_${timestamp}_${uuid}${ext}`;
  } else {
    // 如果没有类别信息，使用原来的命名方式
    const timestamp = Date.now();
    const uuid = uuidv4().slice(0, 8);
    return `${timestamp}_${uuid}${ext}`;
  }
}

// 处理图片（压缩、转换格式）
async function processImage(buffer, originalName, categoryName = null) {
  try {
    const sourceFileName = generateFileName(originalName, categoryName);
    const outputFileName = `${path.parse(sourceFileName).name}.webp`;
    const filePath = path.join(UPLOAD_DIR, outputFileName);

    // 处理图片：自动旋转 -> 去白边 -> 正方形裁切 -> WebP压缩
    await sharp(buffer)
      .rotate() // 自动根据EXIF方向信息旋转图片
      .trim({ threshold: 10 })
      .resize(IMAGE_CONFIG.compressed.size, IMAGE_CONFIG.compressed.size, {
        fit: 'cover',
        position: 'centre',
        withoutEnlargement: false
      })
      .webp({ quality: IMAGE_CONFIG.compressed.quality })
      .toFile(filePath);

    // 获取文件信息
    const stats = await fs.stat(filePath);

    return {
      success: true,
      fileName: outputFileName,
      fileSize: stats.size,
      fileUrl: `/uploads/${outputFileName}`,
      // 计算压缩率
      compressionRatio: Math.round((1 - stats.size / buffer.length) * 100)
    };
  } catch (error) {
    console.error('图片处理失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 删除图片文件
async function deleteImage(fileName) {
  try {
    const filePath = path.join(UPLOAD_DIR, fileName);
    await fs.unlink(filePath).catch(() => {}); // 忽略文件不存在的错误
    return { success: true };
  } catch (error) {
    console.error('删除图片失败:', error);
    return { success: false, error: error.message };
  }
}

// 获取图片信息
async function getImageInfo(filePath) {
  try {
    const metadata = await sharp(filePath).metadata();
    const stats = await fs.stat(filePath);
    
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: stats.size,
      hasAlpha: metadata.hasAlpha
    };
  } catch (error) {
    console.error('获取图片信息失败:', error);
    return null;
  }
}

// 批量处理图片（用于优化现有图片）
async function batchProcessImages() {
  try {
    const files = await fs.readdir(UPLOAD_DIR);
    const imageFiles = files.filter(file => validateImageFormat(file));
    
    console.log(`开始批量处理 ${imageFiles.length} 张图片...`);
    
    for (const file of imageFiles) {
      const filePath = path.join(UPLOAD_DIR, file);
      const buffer = await fs.readFile(filePath);
      
      // 检查是否已经是WebP格式
      const ext = path.extname(file).toLowerCase();
      if (ext === '.webp') {
        console.log(`跳过 ${file}，已经是WebP格式`);
        continue;
      }
      
      // 处理图片
      const result = await processImage(buffer, file);
      if (result.success) {
        // 删除原文件
        await fs.unlink(filePath);
        console.log(`处理完成: ${file} -> ${result.fileName} (压缩率: ${result.compressionRatio}%)`);
      }
    }
    
    console.log('批量处理完成');
  } catch (error) {
    console.error('批量处理失败:', error);
  }
}

// 清理临时文件
async function cleanupTempFiles() {
  try {
    const files = await fs.readdir(UPLOAD_DIR);
    const tempFiles = files.filter(file => file.startsWith('temp_'));
    
    for (const file of tempFiles) {
      const filePath = path.join(UPLOAD_DIR, file);
      await fs.unlink(filePath);
      console.log(`清理临时文件: ${file}`);
    }
  } catch (error) {
    console.error('清理临时文件失败:', error);
  }
}

module.exports = {
  ensureDirectories,
  validateImageFormat,
  validateFileSize,
  processImage,
  deleteImage,
  getImageInfo,
  batchProcessImages,
  cleanupTempFiles,
  IMAGE_CONFIG,
  UPLOAD_DIR
}; 