import React, { useState } from 'react';
import './notification-settings.css';

function NotificationSettings({ userId, token }) {
  const [notifications, setNotifications] = useState({
    newClothing: true,
    outfitRecommendation: true,
    maintenance: false,
    systemUpdate: true
  });
  const [notificationTime, setNotificationTime] = useState('morning');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const notificationOptions = [
    {
      id: 'newClothing',
      title: '新衣物提醒',
      description: '添加新衣物时的确认通知',
      icon: '👔'
    },
    {
      id: 'outfitRecommendation',
      title: '搭配推荐',
      description: '每日搭配推荐通知',
      icon: '🎨'
    },
    {
      id: 'maintenance',
      title: '衣物维护',
      description: '衣物清洗和维护提醒',
      icon: '🧺'
    },
    {
      id: 'systemUpdate',
      title: '系统更新',
      description: '系统功能更新通知',
      icon: '🔄'
    }
  ];

  const timeOptions = [
    { value: 'morning', label: '早上', time: '8:00' },
    { value: 'noon', label: '中午', time: '12:00' },
    { value: 'evening', label: '晚上', time: '18:00' },
    { value: 'custom', label: '自定义', time: '自定义时间' }
  ];

  const handleNotificationToggle = (notificationId) => {
    setNotifications(prev => ({
      ...prev,
      [notificationId]: !prev[notificationId]
    }));
  };

  const handleTimeChange = (time) => {
    setNotificationTime(time);
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage('通知设置保存成功！');
      setTimeout(() => setMessage(''), 3000);
      
    } catch (error) {
      setMessage('保存失败：网络错误');
      console.error('保存通知设置错误:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="notification-settings-page">
      <div className="page-header">
        <h2>🔔 通知设置</h2>
        <p>管理您的通知偏好和提醒时间</p>
      </div>

      <div className="notification-content">
        <div className="notification-section">
          <h3>通知管理</h3>
          <div className="notification-options">
            {notificationOptions.map(option => (
              <div key={option.id} className="notification-item">
                <div className="notification-info">
                  <div className="notification-icon">{option.icon}</div>
                  <div className="notification-details">
                    <h4>{option.title}</h4>
                    <p>{option.description}</p>
                  </div>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={notifications[option.id]}
                    onChange={() => handleNotificationToggle(option.id)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="notification-section">
          <h3>通知时间</h3>
          <div className="time-options">
            {timeOptions.map(option => (
              <label key={option.value} className="time-option">
                <input 
                  type="radio" 
                  name="time" 
                  value={option.value}
                  checked={notificationTime === option.value}
                  onChange={() => handleTimeChange(option.value)}
                />
                <div className="time-option-content">
                  <span className="time-label">{option.label}</span>
                  <span className="time-value">({option.time})</span>
                </div>
              </label>
            ))}
          </div>
          
          {notificationTime === 'custom' && (
            <div className="custom-time-section">
              <label>自定义时间</label>
              <input 
                type="time" 
                defaultValue="09:00"
                className="custom-time-input"
              />
            </div>
          )}
        </div>
        
        <div className="notification-section">
          <h3>通知预览</h3>
          <div className="notification-preview">
            <div className="preview-notification">
              <div className="preview-icon">🔔</div>
              <div className="preview-content">
                <h4>智能衣柜提醒</h4>
                <p>您有新的搭配推荐，点击查看详情</p>
                <span className="preview-time">刚刚</span>
              </div>
            </div>
            <div className="preview-notification">
              <div className="preview-icon">👔</div>
              <div className="preview-content">
                <h4>衣物管理</h4>
                <p>您已成功添加新衣物到衣柜</p>
                <span className="preview-time">2分钟前</span>
              </div>
            </div>
          </div>
        </div>
        
        <button 
          className="save-notification-btn" 
          onClick={handleSaveSettings}
          disabled={isLoading}
        >
          {isLoading ? '保存中...' : '保存设置'}
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

export default NotificationSettings; 