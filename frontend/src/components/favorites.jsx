import React, { useState, useEffect } from 'react';
import './favorites.css';
import { getApiBaseUrl } from '../utils/api';

function Favorites({ userId, token }) {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  // 模拟收藏数据
  const mockFavorites = [
    {
      id: 1,
      name: '春季商务搭配',
      description: '适合春季工作场合的正式搭配',
      items: ['白衬衫', '灰色西裤', '黑色皮鞋'],
      category: 'business',
      season: 'spring',
      rating: 4.8,
      dateAdded: '2024-01-15',
      image: 'https://via.placeholder.com/300x400/f0f0f0/666?text=商务搭配',
      tags: ['正式', '商务', '春季']
    },
    {
      id: 2,
      name: '夏季休闲搭配',
      description: '舒适凉爽的夏季日常搭配',
      items: ['白色T恤', '短裤', '凉鞋'],
      category: 'casual',
      season: 'summer',
      rating: 4.5,
      dateAdded: '2024-01-14',
      image: 'https://via.placeholder.com/300x400/f0f0f0/666?text=休闲搭配',
      tags: ['休闲', '夏季', '舒适']
    },
    {
      id: 3,
      name: '约会优雅搭配',
      description: '适合约会场合的优雅搭配',
      items: ['连衣裙', '高跟鞋', '小包'],
      category: 'elegant',
      season: 'spring',
      rating: 4.9,
      dateAdded: '2024-01-13',
      image: 'https://via.placeholder.com/300x400/f0f0f0/666?text=优雅搭配',
      tags: ['优雅', '约会', '春季']
    },
    {
      id: 4,
      name: '运动健身搭配',
      description: '适合健身运动的专业搭配',
      items: ['运动背心', '运动裤', '跑鞋'],
      category: 'sporty',
      season: 'all',
      rating: 4.6,
      dateAdded: '2024-01-12',
      image: 'https://via.placeholder.com/300x400/f0f0f0/666?text=运动搭配',
      tags: ['运动', '健身', '专业']
    }
  ];

  const categories = [
    { value: 'all', label: '全部', icon: '📁' },
    { value: 'business', label: '商务', icon: '👔' },
    { value: 'casual', label: '休闲', icon: '👕' },
    { value: 'elegant', label: '优雅', icon: '👗' },
    { value: 'sporty', label: '运动', icon: '🏃' },
    { value: 'party', label: '聚会', icon: '🎉' }
  ];

  const sortOptions = [
    { value: 'date', label: '添加时间' },
    { value: 'name', label: '名称' },
    { value: 'rating', label: '评分' },
    { value: 'season', label: '季节' }
  ];

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setIsLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFavorites(mockFavorites);
    } catch (error) {
      console.error('获取收藏失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (favoriteId) => {
    if (!window.confirm('确定要取消收藏这个搭配吗？')) {
      return;
    }
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
    } catch (error) {
      console.error('取消收藏失败:', error);
    }
  };

  const handleShareFavorite = (favorite) => {
    // 分享功能
  };

  const handleEditFavorite = (favorite) => {
    // 编辑功能
  };

  const filteredAndSortedFavorites = favorites
    .filter(favorite => {
      const matchesCategory = selectedCategory === 'all' || favorite.category === selectedCategory;
      const matchesSearch = favorite.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           favorite.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           favorite.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.dateAdded) - new Date(a.dateAdded);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'season':
          return a.season.localeCompare(b.season);
        default:
          return 0;
      }
    });

  const getCategoryIcon = (category) => {
    const found = categories.find(cat => cat.value === category);
    return found ? found.icon : '📁';
  };

  const getSeasonIcon = (season) => {
    const seasonIcons = {
      spring: '🌸',
      summer: '☀️',
      autumn: '🍂',
      winter: '❄️',
      all: '🌍'
    };
    return seasonIcons[season] || '🌍';
  };

  return (
    <div className="favorites-page">
      <div className="page-header">
        <h2>⭐ 收藏夹</h2>
        <p>管理您收藏的搭配和灵感</p>
      </div>

      <div className="favorites-content">
        {/* 筛选和搜索 */}
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="搜索收藏的搭配..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filter-controls">
            <div className="category-filter">
              <label>分类：</label>
              <div className="category-buttons">
                {categories.map(category => (
                  <button
                    key={category.value}
                    className={`category-btn ${selectedCategory === category.value ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.value)}
                  >
                    <span className="category-icon">{category.icon}</span>
                    <span>{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="sort-filter">
              <label>排序：</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 收藏统计 */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <div className="stat-number">{favorites.length}</div>
              <div className="stat-label">总收藏数</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📁</div>
            <div className="stat-content">
              <div className="stat-number">{new Set(favorites.map(f => f.category)).size}</div>
              <div className="stat-label">分类数量</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🌟</div>
            <div className="stat-content">
              <div className="stat-number">
                {(favorites.reduce((sum, f) => sum + f.rating, 0) / favorites.length).toFixed(1)}
              </div>
              <div className="stat-label">平均评分</div>
            </div>
          </div>
        </div>

        {/* 收藏列表 */}
        <div className="favorites-section">
          <h3>我的收藏 ({filteredAndSortedFavorites.length})</h3>
          
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>正在加载收藏...</p>
            </div>
          ) : filteredAndSortedFavorites.length > 0 ? (
            <div className="favorites-grid">
              {filteredAndSortedFavorites.map(favorite => (
                <div key={favorite.id} className="favorite-card">
                  <div className="favorite-image">
                    <img src={favorite.image} alt={favorite.name} />
                    <div className="favorite-overlay">
                      <button 
                        className="share-btn"
                        onClick={() => handleShareFavorite(favorite)}
                      >
                        📤 分享
                      </button>
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditFavorite(favorite)}
                      >
                        ✏️ 编辑
                      </button>
                    </div>
                  </div>
                  
                  <div className="favorite-info">
                    <div className="favorite-header">
                      <h4>{favorite.name}</h4>
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemoveFavorite(favorite.id)}
                      >
                        ❌
                      </button>
                    </div>
                    
                    <p className="favorite-description">{favorite.description}</p>
                    
                    <div className="favorite-meta">
                      <span className="category-tag">
                        {getCategoryIcon(favorite.category)} {categories.find(c => c.value === favorite.category)?.label}
                      </span>
                      <span className="season-tag">
                        {getSeasonIcon(favorite.season)} {favorite.season === 'all' ? '四季' : favorite.season}
                      </span>
                      <span className="rating-tag">
                        ⭐ {favorite.rating}
                      </span>
                    </div>
                    
                    <div className="favorite-items">
                      <h5>搭配单品：</h5>
                      <div className="items-list">
                        {favorite.items.map((item, index) => (
                          <span key={index} className="item-tag">{item}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="favorite-tags">
                      {favorite.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                    
                    <div className="favorite-date">
                      收藏于：{new Date(favorite.dateAdded).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-favorites">
              <div className="no-data-icon">⭐</div>
              <h4>暂无收藏</h4>
              <p>您还没有收藏任何搭配，快去搭配推荐页面收藏喜欢的搭配吧！</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Favorites; 