import React, { useState } from 'react';
import './theme-settings.css';

function ThemeSettings({ userId, token }) {
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [selectedColor, setSelectedColor] = useState('#667eea');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const themes = [
    {
      id: 'light',
      name: '浅色主题',
      description: '默认主题，清爽明亮',
      preview: 'light-theme'
    },
    {
      id: 'dark',
      name: '深色主题',
      description: '护眼模式，适合夜间使用',
      preview: 'dark-theme'
    },
    {
      id: 'auto',
      name: '自动主题',
      description: '跟随系统设置',
      preview: 'auto-theme'
    }
  ];

  const colorSchemes = [
    { color: '#667eea', name: '紫色' },
    { color: '#28a745', name: '绿色' },
    { color: '#ff6b6b', name: '红色' },
    { color: '#ffc107', name: '黄色' },
    { color: '#6f42c1', name: '深紫' },
    { color: '#17a2b8', name: '青色' },
    { color: '#fd7e14', name: '橙色' },
    { color: '#e83e8c', name: '粉色' }
  ];

  const handleThemeChange = (themeId) => {
    setSelectedTheme(themeId);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleApplyTheme = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage('主题设置应用成功！');
      setTimeout(() => setMessage(''), 3000);
      
      // 这里可以添加实际的主题应用逻辑
      document.documentElement.style.setProperty('--primary-color', selectedColor);
      
    } catch (error) {
      setMessage('应用失败：网络错误');
      console.error('应用主题错误:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="theme-settings-page">
      <div className="page-header">
        <h2>🎨 主题设置</h2>
        <p>个性化您的界面外观和体验</p>
      </div>

      <div className="theme-content">
        <div className="theme-section">
          <h3>界面主题</h3>
          <div className="theme-options">
            {themes.map(theme => (
              <div 
                key={theme.id}
                className={`theme-card ${selectedTheme === theme.id ? 'active' : ''}`}
                onClick={() => handleThemeChange(theme.id)}
              >
                <div className={`theme-preview ${theme.preview}`}></div>
                <div className="theme-info">
                  <h4>{theme.name}</h4>
                  <p>{theme.description}</p>
                </div>
                {selectedTheme === theme.id && (
                  <div className="theme-check">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="theme-section">
          <h3>配色方案</h3>
          <div className="color-scheme">
            <div className="color-options">
              {colorSchemes.map(scheme => (
                <div 
                  key={scheme.color}
                  className={`color-option ${selectedColor === scheme.color ? 'active' : ''}`}
                  style={{ backgroundColor: scheme.color }}
                  onClick={() => handleColorChange(scheme.color)}
                  title={scheme.name}
                >
                  {selectedColor === scheme.color && (
                    <div className="color-check">✓</div>
                  )}
                </div>
              ))}
            </div>
            <div className="color-preview">
              <span>当前选择：</span>
              <div 
                className="preview-color"
                style={{ backgroundColor: selectedColor }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="theme-section">
          <h3>预览效果</h3>
          <div className="theme-preview-section">
            <div className="preview-card" style={{ '--preview-color': selectedColor }}>
              <div className="preview-header">
                <h4>示例界面</h4>
                <p>这是应用主题后的效果预览</p>
              </div>
              <div className="preview-content">
                <div className="preview-button">按钮示例</div>
                <div className="preview-text">文字内容示例</div>
              </div>
            </div>
          </div>
        </div>
        
        <button 
          className="apply-theme-btn" 
          onClick={handleApplyTheme}
          disabled={isLoading}
        >
          {isLoading ? '应用中...' : '应用主题'}
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

export default ThemeSettings; 