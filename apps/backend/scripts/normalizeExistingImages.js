const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const Database = require('better-sqlite3');

const DB_PATH = path.resolve(__dirname, '../../../database/wardrobe.db');
const UPLOAD_DIR = path.resolve(__dirname, '../../../database/uploads/images');
const TARGET_SIZE = 800;
const TARGET_QUALITY = 80;

function extractFileName(imageUrl) {
  if (!imageUrl) return '';
  const str = String(imageUrl).trim();
  if (!str) return '';

  try {
    const parsed = new URL(str);
    return path.basename(parsed.pathname);
  } catch (_) {
    // Not an absolute URL, continue with plain parsing.
  }

  const noQuery = str.split('?')[0].split('#')[0];
  return path.basename(noQuery);
}

function replaceImageUrlFileName(imageUrl, targetFileName) {
  const source = String(imageUrl || '');
  if (!source) return `/uploads/${targetFileName}`;
  if (source.includes('/uploads/')) {
    return source.replace(/(\/uploads\/)[^/?#]+/, `$1${targetFileName}`);
  }
  return `/uploads/${targetFileName}`;
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (_) {
    return false;
  }
}

async function normalizeSingleImage(sourcePath, targetPath) {
  const tmpPath = `${targetPath}.tmp.webp`;
  await sharp(sourcePath)
    .rotate()
    .trim({ threshold: 10 })
    .resize(TARGET_SIZE, TARGET_SIZE, {
      fit: 'cover',
      position: 'centre',
      withoutEnlargement: false,
    })
    .webp({ quality: TARGET_QUALITY })
    .toFile(tmpPath);

  await fs.rename(tmpPath, targetPath);
}

async function main() {
  const db = new Database(DB_PATH);
  const rows = db
    .prepare(
      `
        SELECT id, image_url
        FROM clothing_items
        WHERE image_url IS NOT NULL AND image_url != ''
      `
    )
    .all();

  const updateStmt = db.prepare("UPDATE clothing_items SET image_url = ?, updated_at = datetime('now') WHERE id = ?");

  let normalizedCount = 0;
  let updatedUrlCount = 0;
  let skippedMissingCount = 0;
  let failedCount = 0;

  for (const row of rows) {
    const fileName = extractFileName(row.image_url);
    if (!fileName) continue;

    const sourcePath = path.join(UPLOAD_DIR, fileName);
    const hasSource = await fileExists(sourcePath);
    if (!hasSource) {
      skippedMissingCount += 1;
      continue;
    }

    const parsed = path.parse(fileName);
    const targetFileName = `${parsed.name}.webp`;
    const targetPath = path.join(UPLOAD_DIR, targetFileName);
    const sourceEqualsTarget = sourcePath === targetPath;

    try {
      await normalizeSingleImage(sourcePath, targetPath);

      if (!sourceEqualsTarget) {
        await fs.unlink(sourcePath).catch(() => {});
      }

      const nextUrl = replaceImageUrlFileName(row.image_url, targetFileName);
      if (nextUrl !== row.image_url) {
        updateStmt.run(nextUrl, row.id);
        updatedUrlCount += 1;
      }
      normalizedCount += 1;
    } catch (error) {
      failedCount += 1;
      console.error(`处理失败(id=${row.id}, file=${fileName}):`, error.message);
    }
  }

  db.close();
  console.log(`扫描记录: ${rows.length}`);
  console.log(`成功重处理: ${normalizedCount}`);
  console.log(`更新URL: ${updatedUrlCount}`);
  console.log(`缺失文件跳过: ${skippedMissingCount}`);
  console.log(`处理失败: ${failedCount}`);
}

main().catch((error) => {
  console.error('批量重处理失败:', error);
  process.exit(1);
});
