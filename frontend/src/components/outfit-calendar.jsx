import React, { useState, useEffect } from 'react';
import './outfit-calendar.css';
import { getApiBaseUrl } from '../utils/api';

function OutfitCalendar({ userId, token }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [outfits, setOutfits] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState(null);

  // 模拟穿搭数据
  const mockOutfits = {
    '2024-01-15': {
      id: 1,
      date: '2024-01-15',
      outfit: '商务休闲搭配',
      items: ['白衬衫', '黑色西裤', '皮鞋'],
      weather: '晴天',
      temperature: '18°C',
      occasion: '工作',
      notes: '今天有重要会议，选择正式一点的搭配',
      image: 'https://via.placeholder.com/300x400/f0f0f0/666?text=穿搭1'
    },
    '2024-01-16': {
      id: 2,
      date: '2024-01-16',
      outfit: '运动休闲搭配',
      items: ['运动T恤', '运动裤', '跑鞋'],
      weather: '多云',
      temperature: '15°C',
      occasion: '运动',
      notes: '下午去健身房，选择舒适的运动装',
      image: 'https://via.placeholder.com/300x400/f0f0f0/666?text=穿搭2'
    },
    '2024-01-17': {
      id: 3,
      date: '2024-01-17',
      outfit: '日常休闲搭配',
      items: ['毛衣', '牛仔裤', '运动鞋'],
      weather: '阴天',
      temperature: '12°C',
      occasion: '日常',
      notes: '周末逛街，选择舒适的休闲装',
      image: 'https://via.placeholder.com/300x400/f0f0f0/666?text=穿搭3'
    }
  };

  useEffect(() => {
    fetchOutfits();
  }, []);

  const fetchOutfits = async () => {
    setIsLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOutfits(mockOutfits);
    } catch (error) {
      console.error('获取穿搭记录失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getMonthName = (date) => {
    const months = [
      '一月', '二月', '三月', '四月', '五月', '六月',
      '七月', '八月', '九月', '十月', '十一月', '十二月'
    ];
    return months[date.getMonth()];
  };

  const getDayName = (day) => {
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    return days[day];
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    setShowAddModal(true);
  };

  const handleAddOutfit = async (outfitData) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newOutfit = {
        id: Date.now(),
        date: formatDate(selectedDate),
        ...outfitData
      };
      
      setOutfits(prev => ({
        ...prev,
        [formatDate(selectedDate)]: newOutfit
      }));
      
      setShowAddModal(false);
    } catch (error) {
      console.error('添加穿搭失败:', error);
    }
  };

  const handleViewOutfit = (outfit) => {
    setSelectedOutfit(outfit);
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
    const days = [];
    
    // 添加空白天数
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // 添加月份天数
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = formatDate(date);
      const hasOutfit = outfits[dateString];
      const isToday = formatDate(new Date()) === dateString;
      const isSelected = formatDate(selectedDate) === dateString;
      
      days.push(
        <div 
          key={day}
          className={`calendar-day ${hasOutfit ? 'has-outfit' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <span className="day-number">{day}</span>
          {hasOutfit && <div className="outfit-indicator">👔</div>}
        </div>
      );
    }
    
    return days;
  };

  const getSelectedDateOutfit = () => {
    const dateString = formatDate(selectedDate);
    return outfits[dateString];
  };

  return (
    <div className="outfit-calendar-page">
      <div className="page-header">
        <h2>📅 穿搭日历</h2>
        <p>记录和查看您的每日穿搭</p>
      </div>

      <div className="calendar-content">
        {/* 日历导航 */}
        <div className="calendar-nav">
          <button 
            className="nav-btn"
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
          >
            ← 上月
          </button>
          <h3 className="current-month">
            {currentDate.getFullYear()}年 {getMonthName(currentDate)}
          </h3>
          <button 
            className="nav-btn"
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
          >
            下月 →
          </button>
        </div>

        {/* 日历主体 */}
        <div className="calendar-container">
          <div className="calendar-header">
            {['日', '一', '二', '三', '四', '五', '六'].map(day => (
              <div key={day} className="calendar-header-cell">{day}</div>
            ))}
          </div>
          <div className="calendar-grid">
            {renderCalendar()}
          </div>
        </div>

        {/* 选中日期详情 */}
        <div className="date-details">
          <h3>📅 {selectedDate.getFullYear()}年{selectedDate.getMonth() + 1}月{selectedDate.getDate()}日</h3>
          
          {getSelectedDateOutfit() ? (
            <div className="outfit-detail">
              <div className="outfit-image">
                <img src={getSelectedDateOutfit().image} alt={getSelectedDateOutfit().outfit} />
              </div>
              <div className="outfit-info">
                <h4>{getSelectedDateOutfit().outfit}</h4>
                <div className="outfit-meta">
                  <span className="weather">🌤️ {getSelectedDateOutfit().weather}</span>
                  <span className="temperature">🌡️ {getSelectedDateOutfit().temperature}</span>
                  <span className="occasion">🎯 {getSelectedDateOutfit().occasion}</span>
                </div>
                <div className="outfit-items">
                  <h5>搭配单品：</h5>
                  <ul>
                    {getSelectedDateOutfit().items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="outfit-notes">
                  <h5>备注：</h5>
                  <p>{getSelectedDateOutfit().notes}</p>
                </div>
                <div className="outfit-actions">
                  <button className="edit-btn">✏️ 编辑</button>
                  <button className="delete-btn">🗑️ 删除</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-outfit">
              <div className="no-outfit-icon">👔</div>
              <h4>暂无穿搭记录</h4>
              <p>点击日历上的日期添加穿搭记录</p>
              <button 
                className="add-outfit-btn"
                onClick={() => setShowAddModal(true)}
              >
                ➕ 添加穿搭
              </button>
            </div>
          )}
        </div>

        {/* 本月统计 */}
        <div className="month-stats">
          <h3>本月统计</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">
                {Object.keys(outfits).filter(date => 
                  date.startsWith(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`)
                ).length}
              </div>
              <div className="stat-label">穿搭记录</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                {Math.round(Object.keys(outfits).filter(date => 
                  date.startsWith(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`)
                ).length / getDaysInMonth(currentDate).daysInMonth * 100)}%
              </div>
              <div className="stat-label">记录率</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                {new Set(Object.values(outfits).map(outfit => outfit.occasion)).size}
              </div>
              <div className="stat-label">场合类型</div>
            </div>
          </div>
        </div>
      </div>

      {/* 添加穿搭模态框 */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>添加穿搭记录</h3>
            <p>为 {selectedDate.getFullYear()}年{selectedDate.getMonth() + 1}月{selectedDate.getDate()}日 添加穿搭</p>
            
            <div className="form-group">
              <label>穿搭名称</label>
              <input type="text" placeholder="例如：商务休闲搭配" />
            </div>
            
            <div className="form-group">
              <label>搭配单品</label>
              <input type="text" placeholder="例如：白衬衫、黑色西裤、皮鞋" />
            </div>
            
            <div className="form-group">
              <label>天气</label>
              <select>
                <option>晴天</option>
                <option>多云</option>
                <option>阴天</option>
                <option>雨天</option>
                <option>雪天</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>温度</label>
              <input type="text" placeholder="例如：18°C" />
            </div>
            
            <div className="form-group">
              <label>场合</label>
              <select>
                <option>工作</option>
                <option>日常</option>
                <option>运动</option>
                <option>聚会</option>
                <option>约会</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>备注</label>
              <textarea placeholder="添加备注信息..."></textarea>
            </div>
            
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowAddModal(false)}
              >
                取消
              </button>
              <button 
                className="save-btn"
                onClick={() => handleAddOutfit({
                  outfit: '新穿搭',
                  items: ['单品1', '单品2'],
                  weather: '晴天',
                  temperature: '20°C',
                  occasion: '日常',
                  notes: '新添加的穿搭记录',
                  image: 'https://via.placeholder.com/300x400/f0f0f0/666?text=新穿搭'
                })}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OutfitCalendar; 