import React, { useState, useEffect } from 'react';
import './App.css';
import ClothingManager from './components/clothing-manager';
import RecycleBin from './components/recycle-bin';
import SmartFeatures from './components/smart-features';
import SystemSettings from './components/system-settings';
import DataBackup from './components/data-backup';
import UserProfile from './components/user-profile';
import ThemeSettings from './components/theme-settings';
import NotificationSettings from './components/notification-settings';
import OutfitRecommendation from './components/outfit-recommendation';
import StatisticsReport from './components/statistics-report';
import OutfitCalendar from './components/outfit-calendar';
import Favorites from './components/favorites';

import { getApiBaseUrl } from './utils/api';

const API_BASE_URL = getApiBaseUrl();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState('main'); // 'main', 'wardrobe', 'recycle-bin'
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState(null);
  const [wardrobeView, setWardrobeView] = useState('clothing'); // 'clothing', 'recycle-bin'
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  // const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // 侧边栏收缩状态

  // 检查本地存储的登录状态
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');
    const savedUserId = localStorage.getItem('userId');
    
    if (savedToken && savedUsername && savedUserId) {
      setIsLoggedIn(true);
      setUsername(savedUsername);
      setToken(savedToken);
      setUserId(parseInt(savedUserId));
      setCurrentView('main');
    }
  }, []);

  useEffect(() => {
    const updateLayout = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileSidebarOpen(false);
      }
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('userId', data.user.id);
        setIsLoggedIn(true);
        setToken(data.token);
        setUserId(data.user.id);
        setCurrentView('main');
      } else {
        setError(data.message || '登录失败');
      }
    } catch (err) {
      setError('网络错误，请检查服务器是否运行');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setError('');
    setCurrentView('main');
    setToken('');
    setUserId(null);
  };

  const handleBackToMain = () => {
    setCurrentView('main');
  };

  const handleWardrobeViewChange = (view) => {
    setWardrobeView(view);
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
  };

  // 登录界面
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h1 className="login-title">智能管理系统</h1>
          
          <div className="form-group">
            <label className="form-label">用户名</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">密码</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? '登录中...' : '登录'}
          </button>

          {error && <div className="error-message">{error}</div>}
          
        </form>
      </div>
    );
  }

  // 主系统界面
  if (currentView === 'main') {
    return (
      <div className="main-system">
        <div className="main-header">
          <h1>智能管理系统</h1>
          <div className="user-info">
            <span>欢迎，{username}！</span>
            <button className="logout-button" onClick={handleLogout}>
              退出登录
            </button>
          </div>
        </div>
        
        <div className="main-content">
          <h2>系统功能</h2>
          <div className="system-modules">
            <div className="module-card" onClick={() => setCurrentView('wardrobe')}>
              <div className="module-icon">👔</div>
              <h3>智能衣柜</h3>
              <p>管理您的衣物，智能搭配推荐</p>
            </div>
            
            <div className="module-card disabled">
              <div className="module-icon">📅</div>
              <h3>日程管理</h3>
              <p>个人日程安排与提醒</p>
              <span className="coming-soon">即将推出</span>
            </div>
            
            <div className="module-card disabled">
              <div className="module-icon">📊</div>
              <h3>数据分析</h3>
              <p>个人数据统计与分析</p>
              <span className="coming-soon">即将推出</span>
            </div>
            
            <div className="module-card disabled">
              <div className="module-icon">⚙️</div>
              <h3>系统设置</h3>
              <p>系统配置与个性化设置</p>
              <span className="coming-soon">即将推出</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 智能衣柜子系统界面
  if (currentView === 'wardrobe') {
    return (
      <div className="wardrobe-system">
        <div className="wardrobe-header">
          <div className="header-left">
            {isMobile && (
              <button
                className="mobile-menu-button"
                onClick={() => setMobileSidebarOpen(true)}
                aria-label="打开功能菜单"
              >
                ☰
              </button>
            )}
            <button className="back-button" onClick={handleBackToMain}>
              <span className="back-icon">←</span>
              <span className="back-text">返回主系统</span>
            </button>
            <div className="header-divider"></div>
            <div className="system-title">
              <div className="title-icon">👔</div>
              <div className="title-content">
                <h1>智能衣柜管理系统</h1>
                <div className="title-subtitle">Smart Wardrobe Management</div>
              </div>
            </div>
          </div>
          
          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar">
                <span className="avatar-icon">👤</span>
              </div>
              <div className="user-details">
                <div className="user-name">{username}</div>
                <div className="user-status">在线</div>
              </div>
              <div className="user-actions">
                <button className="notification-btn" title="通知">
                  🔔
                </button>
                <button className="settings-btn" title="设置">
                  ⚙️
                </button>
                <button className="logout-button" onClick={handleLogout}>
                  <span className="logout-icon">🚪</span>
                  <span className="logout-text">退出</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="wardrobe-content">
          {isMobile && mobileSidebarOpen && (
            <div
              className="sidebar-overlay"
              onClick={() => setMobileSidebarOpen(false)}
            />
          )}

          <div className={`wardrobe-sidebar ${isMobile && mobileSidebarOpen ? 'mobile-open' : ''}`}>
            <div className="sidebar-header">
              <div className="sidebar-title">
                <h3>🏠 功能菜单</h3>
                <div className="sidebar-subtitle">智能衣柜管理</div>
              </div>
              {isMobile && (
                <button
                  className="mobile-sidebar-close"
                  onClick={() => setMobileSidebarOpen(false)}
                  aria-label="关闭功能菜单"
                >
                  ✕
                </button>
              )}
              {/* <button 
                className="sidebar-toggle"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                title={sidebarCollapsed ? '展开侧边栏' : '收缩侧边栏'}
              >
                <svg 
                  className={`toggle-icon ${sidebarCollapsed ? 'collapsed' : ''}`}
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button> */}
            </div>
            
            <div className="menu-section">
              <div className="menu-section-title">📦 核心功能</div>
              <ul className="wardrobe-menu">
                <li 
                  className={wardrobeView === 'clothing' ? 'active' : ''}
                  onClick={() => handleWardrobeViewChange('clothing')}
                  data-title="衣物管理"
                >
                  <span className="menu-icon">👔</span>
                  <span className="menu-text">衣物管理</span>
                  <span className="menu-desc">添加、编辑、删除衣物</span>
                </li>
                <li 
                  className={wardrobeView === 'statistics-report' ? 'active' : ''}
                  onClick={() => handleWardrobeViewChange('statistics-report')}
                  data-title="统计报告"
                >
                  <span className="menu-icon">📊</span>
                  <span className="menu-text">统计报告</span>
                  <span className="menu-desc">衣物数据分析</span>
                </li>
              </ul>
            </div>


            {/* <div className="menu-section">
              <div className="menu-section-title">🎯 智能功能</div>
              <ul className="wardrobe-menu">
                <li 
                  className={wardrobeView === 'outfit-recommendation' ? 'active' : ''}
                  onClick={() => setWardrobeView('outfit-recommendation')}
                  data-title="搭配推荐"
                >
                  <span className="menu-icon">🎨</span>
                  <span className="menu-text">搭配推荐</span>
                  <span className="menu-desc">AI智能搭配建议</span>
                </li>

                <li 
                  className={wardrobeView === 'outfit-calendar' ? 'active' : ''}
                  onClick={() => setWardrobeView('outfit-calendar')}
                  data-title="穿搭日历"
                >
                  <span className="menu-icon">📅</span>
                  <span className="menu-text">穿搭日历</span>
                  <span className="menu-desc">记录每日穿搭</span>
                </li>

                <li 
                  className={wardrobeView === 'favorites' ? 'active' : ''}
                  onClick={() => setWardrobeView('favorites')}
                  data-title="收藏夹"
                >
                  <span className="menu-icon">⭐</span>
                  <span className="menu-text">收藏夹</span>
                  <span className="menu-desc">收藏喜欢的搭配</span>
                </li>
              </ul>
            </div> */}

            <div className="menu-section">
              <div className="menu-section-title">⚙️ 系统设置</div>
              <ul className="wardrobe-menu">
                <li 
                  className={wardrobeView === 'user-profile' ? 'active' : ''}
                  onClick={() => handleWardrobeViewChange('user-profile')}
                  data-title="个人资料"
                >
                  <span className="menu-icon">👤</span>
                  <span className="menu-text">个人资料</span>
                  <span className="menu-desc">修改个人信息</span>
                </li>
                <li 
                  className={wardrobeView === 'theme-settings' ? 'active' : ''}
                  onClick={() => handleWardrobeViewChange('theme-settings')}
                  data-title="主题设置"
                >
                  <span className="menu-icon">🎨</span>
                  <span className="menu-text">主题设置</span>
                  <span className="menu-desc">个性化界面</span>
                </li>
                <li 
                  className={wardrobeView === 'notification-settings' ? 'active' : ''}
                  onClick={() => handleWardrobeViewChange('notification-settings')}
                  data-title="通知设置"
                >
                  <span className="menu-icon">🔔</span>
                  <span className="menu-text">通知设置</span>
                  <span className="menu-desc">管理提醒功能</span>
                </li>
                <li 
                  className={wardrobeView === 'data-backup' ? 'active' : ''}
                  onClick={() => handleWardrobeViewChange('data-backup')}
                  data-title="数据备份"
                >
                  <span className="menu-icon">💾</span>
                  <span className="menu-text">数据备份</span>
                  <span className="menu-desc">备份和恢复数据</span>
                </li>
              </ul>
            </div>

            <div className="menu-section">
              <div className="menu-section-title">🗑️ 数据管理</div>
              <ul className="wardrobe-menu">
                <li 
                  className={wardrobeView === 'recycle-bin' ? 'active' : ''}
                  onClick={() => handleWardrobeViewChange('recycle-bin')}
                  data-title="回收站"
                >
                  <span className="menu-icon">🗑️</span>
                  <span className="menu-text">回收站</span>
                  <span className="menu-desc">管理已删除的衣物</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="wardrobe-main">
            {wardrobeView === 'clothing' && (
              <ClothingManager 
                userId={userId} 
                token={token} 
                onRestore={() => {
                  // 当从回收站恢复衣物时，刷新衣物列表
                  setWardrobeView('clothing');
                }}
              />
            )}
            {wardrobeView === 'recycle-bin' && (
              <RecycleBin 
                userId={userId} 
                token={token} 
                onRestore={() => {
                  // 当恢复衣物时，切换到衣物管理页面
                  setWardrobeView('clothing');
                }}
              />
            )}

            {wardrobeView === 'outfit-recommendation' && (
              <OutfitRecommendation userId={userId} token={token} />
            )}
            {wardrobeView === 'statistics-report' && (
              <StatisticsReport userId={userId} token={token} />
            )}
            {wardrobeView === 'outfit-calendar' && (
              <OutfitCalendar userId={userId} token={token} />
            )}
            {wardrobeView === 'favorites' && (
              <Favorites userId={userId} token={token} />
            )}
            {wardrobeView === 'user-profile' && (
              <UserProfile userId={userId} token={token} />
            )}
            {wardrobeView === 'theme-settings' && (
              <ThemeSettings userId={userId} token={token} />
            )}
            {wardrobeView === 'notification-settings' && (
              <NotificationSettings userId={userId} token={token} />
            )}
            {wardrobeView === 'data-backup' && (
              <DataBackup userId={userId} token={token} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default App; 