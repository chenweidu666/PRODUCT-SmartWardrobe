import React, { useState, useEffect } from 'react';
import { getApiBaseUrl, authenticatedFetch } from '../utils/api';
import './statistics-report.css';

function StatisticsReport({ userId, token }) {
  const [stats, setStats] = useState({
    totalClothing: 0,
    favoriteClothing: 0,
    categoryCount: 0,
    itemsWithPrice: 0
  });
  const [categoryStats, setCategoryStats] = useState([]);
  const [colorStats, setColorStats] = useState([]);
  const [seasonStats, setSeasonStats] = useState([]);
  const [priceRange, setPriceRange] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const periodOptions = [
    { value: 'all', label: '全部时间' },
    { value: 'month', label: '本月' },
    { value: 'quarter', label: '本季度' },
    { value: 'year', label: '本年' }
  ];

  // 模拟数据
  const mockCategoryStats = [
    { category: '上衣', count: 25, percentage: 35, color: '#667eea' },
    { category: '裤子', count: 18, percentage: 25, color: '#28a745' },
    { category: '鞋子', count: 12, percentage: 17, color: '#ff6b6b' },
    { category: '外套', count: 8, percentage: 11, color: '#ffc107' },
    { category: '配饰', count: 9, percentage: 12, color: '#6f42c1' }
  ];

  const mockColorStats = [
    { color: '白色', count: 15, percentage: 21, hex: '#ffffff' },
    { color: '黑色', count: 12, percentage: 17, hex: '#000000' },
    { color: '蓝色', count: 10, percentage: 14, hex: '#0066cc' },
    { color: '灰色', count: 8, percentage: 11, hex: '#666666' },
    { color: '红色', count: 6, percentage: 8, hex: '#ff0000' },
    { color: '绿色', count: 5, percentage: 7, hex: '#00cc00' },
    { color: '其他', count: 16, percentage: 22, hex: '#cccccc' }
  ];

  const mockSeasonStats = [
    { season: '春季', count: 20, percentage: 28, icon: '🌸' },
    { season: '夏季', count: 18, percentage: 25, icon: '☀️' },
    { season: '秋季', count: 16, percentage: 22, icon: '🍂' },
    { season: '冬季', count: 18, percentage: 25, icon: '❄️' }
  ];

  const mockPriceRange = [
    { range: '0-100元', count: 15, percentage: 21 },
    { range: '100-300元', count: 25, percentage: 35 },
    { range: '300-500元', count: 18, percentage: 25 },
    { range: '500-1000元', count: 8, percentage: 11 },
    { range: '1000元以上', count: 6, percentage: 8 }
  ];

  useEffect(() => {
    if (userId && token) {
      fetchStatistics();
    }
  }, [selectedPeriod, userId, token]);

  const fetchStatistics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/statistics?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStats(data.overview || {
          totalClothing: 0,
          favoriteClothing: 0,
          categoryCount: 0,
          itemsWithPrice: 0
        });
        
        setCategoryStats(data.categoryStats || []);
        setColorStats(data.colorStats || []);
        setSeasonStats(data.seasonStats || []);
        setPriceRange(data.priceRange || []);
      } else {
        console.error('获取统计数据失败:', data.message);
        // 如果API失败，使用模拟数据作为后备
        setStats({
          totalClothing: 0,
          favoriteClothing: 0,
          categoryCount: 0,
          itemsWithPrice: 0
        });
        setCategoryStats([]);
        setColorStats([]);
        setSeasonStats([]);
        setPriceRange([]);
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
      // 网络错误时使用模拟数据
      setStats({
        totalClothing: 0,
        favoriteClothing: 0,
        categoryCount: 0,
        itemsWithPrice: 0
      });
      setCategoryStats([]);
      setColorStats([]);
      setSeasonStats([]);
      setPriceRange([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  const exportReport = () => {
    // 导出报告功能
  };

  return (
    <div className="statistics-report-page">
      <div className="page-header">
        <h2>📊 统计报告</h2>
        <p>深入了解您的衣物数据和分析</p>
      </div>

      <div className="report-content">
        {/* 时间筛选 */}
        <div className="period-filter">
          <label>统计时间：</label>
          <div className="period-buttons">
            {periodOptions.map(option => (
              <button
                key={option.value}
                className={`period-btn ${selectedPeriod === option.value ? 'active' : ''}`}
                onClick={() => handlePeriodChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 概览统计 */}
        <div className="overview-section">
          <h3>数据概览</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👔</div>
              <div className="stat-content">
                <div className="stat-number">{stats.totalClothing}</div>
                <div className="stat-label">总衣物数</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <div className="stat-number">{stats.favoriteClothing}</div>
                <div className="stat-label">收藏衣物</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📂</div>
              <div className="stat-content">
                <div className="stat-number">{stats.categoryCount}</div>
                <div className="stat-label">分类数量</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <div className="stat-number">{stats.itemsWithPrice}</div>
                <div className="stat-label">有价格衣物</div>
              </div>
            </div>
          </div>
        </div>

        {/* 分类统计 */}
        <div className="category-section">
          <h3>分类统计</h3>
          <div className="chart-container">
            {categoryStats.map((item, index) => (
              <div key={index} className="chart-item">
                <div className="chart-bar">
                  <div 
                    className="bar-fill"
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: item.color
                    }}
                  ></div>
                </div>
                <div className="chart-info">
                  <span className="chart-label">{item.category}</span>
                  <span className="chart-value">{item.count}件 ({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 颜色统计 */}
        <div className="color-section">
          <h3>颜色分布</h3>
          <div className="color-grid">
            {colorStats.map((item, index) => (
              <div key={index} className="color-item">
                <div 
                  className="color-preview"
                  style={{ backgroundColor: item.hex }}
                ></div>
                <div className="color-info">
                  <span className="color-name">{item.color}</span>
                  <span className="color-count">{item.count}件</span>
                  <div className="color-percentage">
                    <div 
                      className="percentage-bar"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 季节统计 */}
        <div className="season-section">
          <h3>季节分布</h3>
          <div className="season-grid">
            {seasonStats.map((item, index) => (
              <div key={index} className="season-item">
                <div className="season-icon">{item.icon}</div>
                <div className="season-info">
                  <span className="season-name">{item.season}</span>
                  <span className="season-count">{item.count}件</span>
                  <div className="season-percentage">
                    <div 
                      className="percentage-fill"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 价格分布 */}
        <div className="price-section">
          <h3>价格分布</h3>
          <div className="price-chart">
            {priceRange.map((item, index) => (
              <div key={index} className="price-item">
                <div className="price-range">{item.range}</div>
                <div className="price-bar">
                  <div 
                    className="price-fill"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <div className="price-count">{item.count}件</div>
              </div>
            ))}
          </div>
        </div>

        {/* 导出按钮 */}
        <div className="export-section">
          <button className="export-btn" onClick={exportReport}>
            📄 导出报告
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>正在加载统计数据...</p>
        </div>
      )}
    </div>
  );
}

export default StatisticsReport; 