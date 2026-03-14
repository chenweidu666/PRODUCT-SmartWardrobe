-- 用户管理更新脚本
-- 更新时间: 2025-01-23
-- 描述: 更新用户yf的密码

-- 更新用户yf的密码为yf
-- 使用bcryptjs生成的密码哈希
UPDATE users 
SET password = '$2a$10$.9hDW/eb1WYDbWOTnI70U.bLVnnmZX/TUxNto8W4/3dmZnkJQjNB2' 
WHERE username = 'yf';

-- 验证更新
SELECT id, username, password FROM users WHERE username = 'yf';

-- 检查用户数据
SELECT 
    u.id,
    u.username,
    COUNT(DISTINCT uc.id) as category_count,
    COUNT(DISTINCT ci.id) as clothing_count
FROM users u
LEFT JOIN user_categories uc ON u.id = uc.user_id
LEFT JOIN clothing_items ci ON u.id = ci.user_id AND ci.is_deleted = 0
WHERE u.username = 'yf'
GROUP BY u.id, u.username; 