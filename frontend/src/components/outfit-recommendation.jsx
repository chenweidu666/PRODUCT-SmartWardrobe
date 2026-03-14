import React, { useState, useEffect } from 'react';
import './outfit-recommendation.css';
import { getApiBaseUrl } from '../utils/api';

function OutfitRecommendation({ userId, token }) {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('casual');
  const [selectedSeason, setSelectedSeason] = useState('spring');
  const [selectedOccasion, setSelectedOccasion] = useState('daily');

  const styleOptions = [
    { value: 'casual', label: '休闲', icon: '👕' },
    { value: 'formal', label: '正式', icon: '👔' },
    { value: 'sporty', label: '运动', icon: '🏃' },
    { value: 'elegant', label: '优雅', icon: '👗' },
    { value: 'street', label: '街头', icon: '🛹' }
  ];

  const seasonOptions = [
    { value: 'spring', label: '春季', icon: '🌸' },
    { value: 'summer', label: '夏季', icon: '☀️' },
    { value: 'autumn', label: '秋季', icon: '🍂' },
    { value: 'winter', label: '冬季', icon: '❄️' }
  ];

  const occasionOptions = [
    { value: 'daily', label: '日常', icon: '🏠' },
    { value: 'work', label: '工作', icon: '💼' },
    { value: 'party', label: '聚会', icon: '🎉' },
    { value: 'date', label: '约会', icon: '💕' },
    { value: 'travel', label: '旅行', icon: '✈️' }
  ];

  const mockRecommendations = [
    {
      id: 1,
      name: '春季休闲搭配',
      description: '适合日常穿着的舒适搭配',
      items: [
        { name: '白色T恤', category: '上衣', color: '#ffffff' },
        { name: '牛仔裤', category: '裤子', color: '#0066cc' },
        { name: '运动鞋', category: '鞋子', color: '#333333' }
      ],
      style: 'casual',
      season: 'spring',
      occasion: 'daily',
      rating: 4.5,
      image: 'https://via.placeholder.com/300x400/f0f0f0/666?text=搭配1'
    },
    {
      id: 2,
      name: '商务正式搭配',
      description: '适合工作场合的专业搭配',
      items: [
        { name: '白衬衫', category: '上衣', color: '#ffffff' },
        { name: '黑色西裤', category: '裤子', color: '#000000' },
        { name: '皮鞋', category: '鞋子', color: '#8B4513' }
      ],
      style: 'formal',
      season: 'spring',
      occasion: 'work',
      rating: 4.8,
      image: 'https://via.placeholder.com/300x400/f0f0f0/666?text=搭配2'
    },
    {
      id: 3,
      name: '夏季运动搭配',
      description: '适合户外活动的轻便搭配',
      items: [
        { name: '运动背心', category: '上衣', color: '#ff6b6b' },
        { name: '运动短裤', category: '裤子', color: '#333333' },
        { name: '跑鞋', category: '鞋子', color: '#ffffff' }
      ],
      style: 'sporty',
      season: 'summer',
      occasion: 'daily',
      rating: 4.2,
      image: 'https://via.placeholder.com/300x400/f0f0f0/666?text=搭配3'
    }
  ];

  useEffect(() => {
    // 模拟加载推荐
    setIsLoading(true);
    setTimeout(() => {
      setRecommendations(mockRecommendations);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleGenerateRecommendation = async () => {
    setIsLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 这里可以调用实际的AI推荐API
      const newRecommendation = {
        id: Date.now(),
        name: `${styleOptions.find(s => s.value === selectedStyle)?.label}${seasonOptions.find(s => s.value === selectedSeason)?.label}搭配`,
        description: 'AI为您量身定制的智能搭配',
        items: [
          { name: '推荐上衣', category: '上衣', color: '#667eea' },
          { name: '推荐裤子', category: '裤子', color: '#28a745' },
          { name: '推荐鞋子', category: '鞋子', color: '#ffc107' }
        ],
        style: selectedStyle,
        season: selectedSeason,
        occasion: selectedOccasion,
        rating: 4.6,
        image: 'https://via.placeholder.com/300x400/f0f0f0/666?text=AI搭配'
      };
      
      setRecommendations(prev => [newRecommendation, ...prev]);
    } catch (error) {
      console.error('生成推荐失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveOutfit = (outfitId) => {
    // 保存搭配到收藏夹
    
  };

  const filteredRecommendations = recommendations.filter(rec => 
    rec.style === selectedStyle && 
    rec.season === selectedSeason && 
    rec.occasion === selectedOccasion
  );

  return (
    <div className="outfit-recommendation-page">
      <div className="page-header">
        <h2>🎨 搭配推荐</h2>
        <p>AI智能为您推荐最适合的搭配方案</p>
      </div>

      <div className="recommendation-content">
        <div className="filter-section">
          <h3>筛选条件</h3>
          <div className="filter-options">
            <div className="filter-group">
              <label>风格</label>
              <div className="filter-buttons">
                {styleOptions.map(option => (
                  <button
                    key={option.value}
                    className={`filter-btn ${selectedStyle === option.value ? 'active' : ''}`}
                    onClick={() => setSelectedStyle(option.value)}
                  >
                    <span className="filter-icon">{option.icon}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>季节</label>
              <div className="filter-buttons">
                {seasonOptions.map(option => (
                  <button
                    key={option.value}
                    className={`filter-btn ${selectedSeason === option.value ? 'active' : ''}`}
                    onClick={() => setSelectedSeason(option.value)}
                  >
                    <span className="filter-icon">{option.icon}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>场合</label>
              <div className="filter-buttons">
                {occasionOptions.map(option => (
                  <button
                    key={option.value}
                    className={`filter-btn ${selectedOccasion === option.value ? 'active' : ''}`}
                    onClick={() => setSelectedOccasion(option.value)}
                  >
                    <span className="filter-icon">{option.icon}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            className="generate-btn"
            onClick={handleGenerateRecommendation}
            disabled={isLoading}
          >
            {isLoading ? '生成中...' : '🎯 生成AI推荐'}
          </button>
        </div>

        <div className="recommendations-section">
          <h3>推荐搭配</h3>
          
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>AI正在为您生成推荐...</p>
            </div>
          ) : filteredRecommendations.length > 0 ? (
            <div className="recommendations-grid">
              {filteredRecommendations.map(outfit => (
                <div key={outfit.id} className="outfit-card">
                  <div className="outfit-image">
                    <img src={outfit.image} alt={outfit.name} />
                    <div className="outfit-overlay">
                      <button 
                        className="save-outfit-btn"
                        onClick={() => handleSaveOutfit(outfit.id)}
                      >
                        ⭐ 收藏
                      </button>
                    </div>
                  </div>
                  
                  <div className="outfit-info">
                    <h4>{outfit.name}</h4>
                    <p>{outfit.description}</p>
                    
                    <div className="outfit-items">
                      {outfit.items.map((item, index) => (
                        <div key={index} className="outfit-item">
                          <div 
                            className="item-color"
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="item-name">{item.name}</span>
                          <span className="item-category">{item.category}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="outfit-meta">
                      <div className="outfit-rating">
                        <span className="stars">
                          {'★'.repeat(Math.floor(outfit.rating))}
                          {'☆'.repeat(5 - Math.floor(outfit.rating))}
                        </span>
                        <span className="rating-text">{outfit.rating}</span>
                      </div>
                      <div className="outfit-tags">
                        <span className="tag">{styleOptions.find(s => s.value === outfit.style)?.label}</span>
                        <span className="tag">{seasonOptions.find(s => s.value === outfit.season)?.label}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-recommendations">
              <div className="no-data-icon">🎨</div>
              <h4>暂无推荐</h4>
              <p>点击"生成AI推荐"按钮获取个性化搭配建议</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OutfitRecommendation; 