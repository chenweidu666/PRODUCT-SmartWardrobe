import React, { useState } from 'react';
import './user-profile.css';
import { getApiBaseUrl } from '../utils/api';

function UserProfile({ userId, token }) {
  const [profile, setProfile] = useState({
    username: 'cw',
    email: 'cw@example.com',
    gender: 'commute',
    height: 175,
    weight: 65
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('个人信息保存成功！');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('保存失败：' + data.message);
      }
    } catch (error) {
      setMessage('保存失败：网络错误');
      console.error('保存个人信息错误:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-profile-page">
      <div className="mine-hero">
        <div className="mine-avatar-block">
          <div className="mine-avatar">👤</div>
          <div className="mine-username">{profile.username || '未命名用户'}</div>
        </div>
        <div className="mine-hero-content">
          <h2>我的衣柜</h2>
          <p>个人信息与 AI 生图素材管理</p>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section basic-info-section">
          <h3>个人信息</h3>
          <div className="profile-form">
            <div className="form-group">
              <label>用户名</label>
              <input 
                type="text" 
                value={profile.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="请输入用户名"
              />
            </div>
            
            <div className="form-group">
              <label>邮箱</label>
              <input 
                type="email" 
                value={profile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="请输入邮箱地址"
              />
            </div>
            
            <div className="form-group">
              <label>风格</label>
              <select 
                value={profile.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
              >
                <option value="commute">通勤简约</option>
                <option value="casual">日常休闲</option>
                <option value="sport">运动户外</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>身高（cm）</label>
              <input 
                type="number" 
                value={profile.height}
                onChange={(e) => handleInputChange('height', parseInt(e.target.value) || 0)}
                placeholder="请输入身高"
                min="100"
                max="250"
              />
            </div>
            
            <div className="form-group">
              <label>体重（kg）</label>
              <input 
                type="number" 
                value={profile.weight}
                onChange={(e) => handleInputChange('weight', parseInt(e.target.value) || 0)}
                placeholder="请输入体重"
                min="20"
                max="200"
              />
            </div>
          </div>
        </div>

        <div className="profile-section photo-section">
          <h3>个人图片（用于 AI 生图）</h3>
          <div className="photo-placeholder">
            <div className="photo-placeholder-title">上传你的穿搭参考图</div>
            <div className="photo-placeholder-desc">用于后续生成更贴合你的穿搭示意图</div>
          </div>
          <div className="photo-actions">
            <button className="save-btn secondary-btn" type="button">管理图片</button>
            <button className="save-btn" type="button">上传新图</button>
          </div>
        </div>

        <button 
          className="save-btn full-btn" 
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? '保存中...' : '保存个人信息'}
        </button>
        
        {message && (
          <div className={`message ${message.includes('成功') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile; 