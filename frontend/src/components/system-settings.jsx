import React, { useState, useEffect } from 'react';
import './system-settings.css';
import { getApiBaseUrl } from '../utils/api';

function SystemSettings({ userId, token }) {
  const [activeTab, setActiveTab] = useState('profile');



  const settings = {
    profile: {
      title: '👤 个人资料',
      description: '修改个人信息',
      icon: '👤',
      color: '#667eea',
      content: (
        <div className="settings-content">
          <div className="profile-section">
            <h3>个人信息</h3>
            <div className="profile-form">
              <div className="form-group">
                <label>用户名</label>
                <input type="text" defaultValue="cw" />
              </div>
              <div className="form-group">
                <label>邮箱</label>
                <input type="email" defaultValue="cw@example.com" />
              </div>
              <div className="form-group">
                <label>性别</label>
                <select defaultValue="male">
                  <option value="male">男</option>
                  <option value="female">女</option>
                  <option value="other">其他</option>
                </select>
              </div>
              <div className="form-group">
                <label>身高 (cm)</label>
                <input type="number" defaultValue="175" />
              </div>
              <div className="form-group">
                <label>体重 (kg)</label>
                <input type="number" defaultValue="65" />
              </div>
              <button className="save-btn">保存修改</button>
            </div>
          </div>
        </div>
      )
    },
    theme: {
      title: '🎨 主题设置',
      description: '个性化界面',
      icon: '🎨',
      color: '#ff6b6b',
      content: (
        <div className="settings-content">
          <div className="theme-section">
            <h3>界面主题</h3>
            <div className="theme-options">
              <div className="theme-card active">
                <div className="theme-preview light-theme"></div>
                <div className="theme-info">
                  <h4>浅色主题</h4>
                  <p>默认主题，清爽明亮</p>
                </div>
              </div>
              <div className="theme-card">
                <div className="theme-preview dark-theme"></div>
                <div className="theme-info">
                  <h4>深色主题</h4>
                  <p>护眼模式，适合夜间使用</p>
                </div>
              </div>
              <div className="theme-card">
                <div className="theme-preview auto-theme"></div>
                <div className="theme-info">
                  <h4>自动主题</h4>
                  <p>跟随系统设置</p>
                </div>
              </div>
            </div>
            
            <div className="color-scheme">
              <h4>配色方案</h4>
              <div className="color-options">
                <div className="color-option active" style={{ backgroundColor: '#667eea' }}></div>
                <div className="color-option" style={{ backgroundColor: '#28a745' }}></div>
                <div className="color-option" style={{ backgroundColor: '#ff6b6b' }}></div>
                <div className="color-option" style={{ backgroundColor: '#ffc107' }}></div>
                <div className="color-option" style={{ backgroundColor: '#6f42c1' }}></div>
              </div>
            </div>
            
            <button className="apply-theme-btn">应用主题</button>
          </div>
        </div>
      )
    },
    notification: {
      title: '🔔 通知设置',
      description: '管理提醒功能',
      icon: '🔔',
      color: '#28a745',
      content: (
        <div className="settings-content">
          <div className="notification-section">
            <h3>通知管理</h3>
            <div className="notification-options">
              <div className="notification-item">
                <div className="notification-info">
                  <h4>新衣物提醒</h4>
                  <p>添加新衣物时发送通知</p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div className="notification-item">
                <div className="notification-info">
                  <h4>搭配推荐</h4>
                  <p>每日搭配推荐通知</p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div className="notification-item">
                <div className="notification-info">
                  <h4>衣物维护</h4>
                  <p>衣物清洗和维护提醒</p>
                </div>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div className="notification-item">
                <div className="notification-info">
                  <h4>系统更新</h4>
                  <p>系统功能更新通知</p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
            
            <div className="notification-time">
              <h4>通知时间</h4>
              <div className="time-options">
                <label>
                  <input type="radio" name="time" value="morning" defaultChecked />
                  早上 (8:00)
                </label>
                <label>
                  <input type="radio" name="time" value="noon" />
                  中午 (12:00)
                </label>
                <label>
                  <input type="radio" name="time" value="evening" />
                  晚上 (18:00)
                </label>
              </div>
            </div>
            
            <button className="save-notification-btn">保存设置</button>
          </div>
        </div>
      )
    },

  };

  const settingTabs = Object.keys(settings).map(key => ({
    id: key,
    ...settings[key]
  }));

  return (
    <div className="system-settings">
      <div className="page-header">
        <h2>⚙️ 系统设置</h2>
        <p>个性化您的衣柜管理系统</p>
      </div>

      <div className="settings-tabs">
        {settingTabs.map(setting => (
          <button
            key={setting.id}
            className={`setting-tab ${activeTab === setting.id ? 'active' : ''}`}
            onClick={() => setActiveTab(setting.id)}
            style={{ '--setting-color': setting.color }}
          >
            <span className="setting-tab-icon">{setting.icon}</span>
            <div className="setting-tab-content">
              <span className="setting-tab-title">{setting.title}</span>
              <span className="setting-tab-desc">{setting.description}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="settings-main">
        {settings[activeTab].content}
      </div>
    </div>
  );
}

export default SystemSettings; 