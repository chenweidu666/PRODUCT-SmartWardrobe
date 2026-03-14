import React, { useState, useEffect } from 'react';
import './App.css';
import ClothingManager from './components/clothing-manager';
import UserProfile from './components/user-profile';

import { getApiBaseUrl } from './utils/api';

const API_BASE_URL = getApiBaseUrl();
const DEFAULT_SYSTEM_VIEW = 'wardrobe';
const FORCE_APP_LAYOUT = true;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState(DEFAULT_SYSTEM_VIEW);
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState(null);
  const [wardrobeView, setWardrobeView] = useState('home'); // 'home', 'clothing', 'user-profile'
  const [isMobile, setIsMobile] = useState(false);
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
      // Default to the wardrobe system after login.
      setCurrentView(DEFAULT_SYSTEM_VIEW);
    }
  }, []);

  useEffect(() => {
    const updateLayout = () => {
      const mobile = FORCE_APP_LAYOUT || window.innerWidth <= 768;
      setIsMobile(mobile);
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
        setCurrentView(DEFAULT_SYSTEM_VIEW);
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
    setCurrentView(DEFAULT_SYSTEM_VIEW);
    setToken('');
    setUserId(null);
  };

  const handleWardrobeViewChange = (view) => {
    setWardrobeView(view);
  };

  const mobilePrimaryViews = [
    { key: 'home', icon: 'home', label: '首页' },
    { key: 'clothing', icon: 'list', label: '衣服管理' },
    { key: 'user-profile', icon: 'user', label: '我的衣柜' }
  ];

  const handleMobilePrimaryNav = (view) => {
    handleWardrobeViewChange(view);
  };

  const pageMeta = {
    home: { icon: '🏠', title: '首页' },
    clothing: { icon: '👔', title: '衣服管理' },
    'user-profile': { icon: '👤', title: '我的衣柜' }
  };
  const currentMeta = pageMeta[wardrobeView] || pageMeta.home;

  // 登录界面
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <form className="login-form mine-login-form" onSubmit={handleLogin}>
          <div className="mine-login-header">
            <h1 className="login-title">我的衣柜</h1>
            <p className="mine-login-subtitle">登录后查看账户信息与个人图片素材</p>
          </div>
          
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
            {loading ? '登录中...' : '立即登录'}
          </button>

          {error && <div className="error-message">{error}</div>}

          <div className="mine-login-tips">
            <span>支持：账户登录</span>
            <span>后续扩展：验证码 / 第三方登录</span>
          </div>
        </form>
      </div>
    );
  }

  // 智能衣柜子系统界面
  if (currentView === 'wardrobe') {
    return (
      <div className={`wardrobe-system ${FORCE_APP_LAYOUT ? 'app-mode' : ''}`}>
        <div className="wardrobe-header">
          <div className="header-left">
            <div className="system-title">
              <div className="title-icon">{currentMeta.icon}</div>
              <div className="title-content">
                <h1>{currentMeta.title}</h1>
                <div className="title-subtitle">SmartWardrobe</div>
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
                <div className="user-status">已登录</div>
              </div>
              <div className="user-actions">
                <button className="logout-button" onClick={handleLogout}>
                  <span className="logout-icon">🚪</span>
                  <span className="logout-text">退出</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="wardrobe-content">
          <div className={`wardrobe-main ${isMobile ? 'has-mobile-tabbar' : ''}`}>
            {wardrobeView === 'home' && (
              <div className="home-placeholder">
                <div className="home-placeholder-header">
                  <h2>首页</h2>
                  <p>天气 + 今日穿搭推荐 + 统计图表（预留容器）</p>
                </div>
                <div className="home-module weather-module">
                  <h3>天气</h3>
                  <p>深圳 26°C · 多云</p>
                  <small>体感 28°C · 降雨 10% · 风速 2m/s</small>
                </div>

                <div className="home-module recommend-module">
                  <h3>今日穿搭推荐</h3>
                  <div className="recommend-layout">
                    <div className="ai-image-slot">
                      <strong>AI 生成穿搭图</strong>
                      <span>后续对接大模型出图</span>
                    </div>
                    <div className="recommend-text-list">
                      <p>外套：防风外套</p>
                      <p>裤子：直筒裤</p>
                      <p>内搭：针织上衣</p>
                      <p>鞋子：防水运动鞋</p>
                    </div>
                  </div>
                  <div className="recommend-actions">
                    <button type="button">换一套</button>
                    <button type="button">查看详情</button>
                    <button type="button">加入今日</button>
                  </div>
                </div>

                <div className="home-module stats-module">
                  <h3>衣服统计图表</h3>
                  <div className="stats-bars">
                    <span style={{ height: '36%' }}></span>
                    <span style={{ height: '52%' }}></span>
                    <span style={{ height: '68%' }}></span>
                    <span style={{ height: '44%' }}></span>
                    <span style={{ height: '60%' }}></span>
                  </div>
                  <div className="stats-hint">
                    <p>本月新增 18</p>
                    <p>均价 286</p>
                  </div>
                </div>
              </div>
            )}
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
            {wardrobeView === 'user-profile' && (
              <UserProfile userId={userId} token={token} />
            )}
          </div>
        </div>

        {isMobile && (
          <nav className="mobile-primary-nav" aria-label="手机主导航">
            {mobilePrimaryViews.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`mobile-nav-item ${wardrobeView === item.key ? 'active' : ''}`}
                onClick={() => handleMobilePrimaryNav(item.key)}
              >
                <span className={`mobile-nav-icon icon-${item.icon}`} aria-hidden="true"></span>
                <span className="mobile-nav-label">{item.label}</span>
              </button>
            ))}
          </nav>
        )}
      </div>
    );
  }

  return null;
}

export default App; 