const { 
  ensureDirectories, 
  batchProcessImages, 
  cleanupTempFiles,
  IMAGE_CONFIG 
} = require('./utils/imageProcessor');

console.log('🖼️  智能衣柜图片管理工具');
console.log('');

// 确保目录存在
ensureDirectories();

const command = process.argv[2];

switch (command) {
  case 'optimize':
    console.log('🔄 开始批量优化图片...');
    batchProcessImages();
    break;
    
  case 'cleanup':
    console.log('🧹 清理临时文件...');
    cleanupTempFiles();
    break;
    
  case 'info':
    console.log('📋 图片处理配置信息:');
    console.log(`   支持格式: ${IMAGE_CONFIG.supportedFormats.join(', ')}`);
    console.log(`   最大文件大小: ${IMAGE_CONFIG.maxFileSize / 1024 / 1024}MB`);
    console.log(`   压缩后最大尺寸: ${IMAGE_CONFIG.compressed.maxWidth}x${IMAGE_CONFIG.compressed.maxHeight}`);
    console.log(`   压缩质量: ${IMAGE_CONFIG.compressed.quality}%`);
    console.log(`   输出格式: ${IMAGE_CONFIG.compressed.format}`);
    break;
    
  default:
    console.log('使用方法:');
    console.log('  node manage-images.js optimize  - 批量优化现有图片');
    console.log('  node manage-images.js cleanup   - 清理临时文件');
    console.log('  node manage-images.js info      - 显示配置信息');
    console.log('');
    console.log('功能说明:');
    console.log('  • 智能压缩图片，减少存储空间');
    console.log('  • 转换为WebP格式，提高加载速度');
    console.log('  • 统一尺寸标准，优化显示效果');
    console.log('  • 保持图片质量的同时减少流量消耗');
} 