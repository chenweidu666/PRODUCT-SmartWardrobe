import React, { useState, useEffect } from 'react';
import './user-profile.css';
import { getApiBaseUrl } from '../utils/api';

function UserProfile({ userId, token }) {
  const [profile, setProfile] = useState({
    username: 'cw',
    email: 'cw@example.com',
    gender: 'male',
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
      <div className="page-header">
        <h2>👤 个人资料</h2>
        <p>管理您的个人信息和偏好设置</p>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h3>基本信息</h3>
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
              <label>性别</label>
              <select 
                value={profile.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
              >
                <option value="male">男</option>
                <option value="female">女</option>
                <option value="other">其他</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>身高 (cm)</label>
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
              <label>体重 (kg)</label>
              <input 
                type="number" 
                value={profile.weight}
                onChange={(e) => handleInputChange('weight', parseInt(e.target.value) || 0)}
                placeholder="请输入体重"
                min="20"
                max="200"
              />
            </div>
            
            <button 
              className="save-btn" 
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? '保存中...' : '保存修改'}
            </button>
            
            {message && (
              <div className={`message ${message.includes('成功') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile; 