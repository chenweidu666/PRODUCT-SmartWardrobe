import React, { useState } from 'react';
import './smart-features.css';

function SmartFeatures({ userId, token }) {
  const [activeFeature, setActiveFeature] = useState('outfit');

  const features = {
    outfit: {
      title: '🎨 搭配推荐',
      description: 'AI智能搭配建议',
      icon: '🎨',
      color: '#667eea',
      content: (
        <div className="feature-content">
          <div className="outfit-recommendations">
            <h3>今日推荐搭配</h3>
            <div className="outfit-grid">
              <div className="outfit-card">
                <div className="outfit-image">👕</div>
                <div className="outfit-info">
                  <h4>休闲风格</h4>
                  <p>T恤 + 牛仔裤 + 运动鞋</p>
                  <div className="outfit-tags">
                    <span className="tag">休闲</span>
                    <span className="tag">舒适</span>
                  </div>
                </div>
              </div>
              <div className="outfit-card">
                <div className="outfit-image">👔</div>
                <div className="outfit-info">
                  <h4>商务风格</h4>
                  <p>衬衫 + 西裤 + 皮鞋</p>
                  <div className="outfit-tags">
                    <span className="tag">正式</span>
                    <span className="tag">商务</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="generate-btn">生成新搭配</button>
          </div>
        </div>
      )
    },
    stats: {
      title: '📊 统计报告',
      description: '衣物数据分析',
      icon: '📊',
      color: '#28a745',
      content: (
        <div className="feature-content">
          <div className="stats-dashboard">
            <h3>衣物数据分析</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-chart">📈</div>
                <div className="stat-info">
                  <h4>衣物增长趋势</h4>
                  <p>本月新增 15 件衣物</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-chart">🎯</div>
                <div className="stat-info">
                  <h4>使用频率</h4>
                  <p>最常穿：T恤 (12次/月)</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-chart">💰</div>
                <div className="stat-info">
                  <h4>价值分析</h4>
                  <p>总价值：¥2,580</p>
                </div>
              </div>
            </div>
            <button className="export-btn">导出报告</button>
          </div>
        </div>
      )
    },
    calendar: {
      title: '📅 穿搭日历',
      description: '记录每日穿搭',
      icon: '📅',
      color: '#ff6b6b',
      content: (
        <div className="feature-content">
          <div className="calendar-view">
            <h3>穿搭日历</h3>
            <div className="calendar-grid">
              {Array.from({ length: 7 }, (_, i) => (
                <div key={i} className="calendar-day">
                  <div className="day-header">周{i + 1}</div>
                  <div className="day-outfit">
                    {i % 2 === 0 ? '👕👖👟' : '👔👖👞'}
                  </div>
                  <div className="day-note">记录穿搭心得...</div>
                </div>
              ))}
            </div>
            <button className="add-record-btn">添加今日穿搭</button>
          </div>
        </div>
      )
    },
    favorites: {
      title: '⭐ 收藏夹',
      description: '收藏喜欢的搭配',
      icon: '⭐',
      color: '#ffc107',
      content: (
        <div className="feature-content">
          <div className="favorites-collection">
            <h3>我的收藏</h3>
            <div className="favorites-grid">
              <div className="favorite-item">
                <div className="favorite-icon">❤️</div>
                <div className="favorite-info">
                  <h4>经典黑白配</h4>
                  <p>白衬衫 + 黑西裤</p>
                  <div className="favorite-tags">
                    <span className="tag">经典</span>
                    <span className="tag">百搭</span>
                  </div>
                </div>
              </div>
              <div className="favorite-item">
                <div className="favorite-icon">💙</div>
                <div className="favorite-info">
                  <h4>休闲运动风</h4>
                  <p>卫衣 + 运动裤</p>
                  <div className="favorite-tags">
                    <span className="tag">运动</span>
                    <span className="tag">舒适</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="add-favorite-btn">添加收藏</button>
          </div>
        </div>
      )
    }
  };

  const featureTabs = Object.keys(features).map(key => ({
    id: key,
    ...features[key]
  }));

  return (
    <div className="smart-features">
      <div className="page-header">
        <h2>🎯 智能功能</h2>
        <p>利用AI技术，让您的衣柜管理更加智能</p>
      </div>

      <div className="feature-tabs">
        {featureTabs.map(feature => (
          <button
            key={feature.id}
            className={`feature-tab ${activeFeature === feature.id ? 'active' : ''}`}
            onClick={() => setActiveFeature(feature.id)}
            style={{ '--feature-color': feature.color }}
          >
            <span className="feature-tab-icon">{feature.icon}</span>
            <div className="feature-tab-content">
              <span className="feature-tab-title">{feature.title}</span>
              <span className="feature-tab-desc">{feature.description}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="feature-main">
        {features[activeFeature].content}
      </div>
    </div>
  );
}

export default SmartFeatures; 