import React, { useState, useEffect } from 'react';
import './recycle-bin.css';
import { getApiBaseUrl } from '../utils/api';

const API_BASE_URL = getApiBaseUrl();

function RecycleBin({ userId, token, onRestore }) {
  const [recycleBin, setRecycleBin] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // 获取回收站列表
  useEffect(() => {
    fetchRecycleBin();
  }, []);

  const fetchRecycleBin = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/recycle-bin`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setRecycleBin(data.recycleBin);
      }
    } catch (error) {
      console.error('获取回收站列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/recycle-bin/${id}/restore`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        // 从回收站列表中移除
        setRecycleBin(prev => prev.filter(item => item.id !== id));
        // 通知父组件刷新衣物列表
        if (onRestore) {
          onRestore();
        }
      }
    } catch (error) {
      console.error('恢复衣物失败:', error);
    }
  };

  const handlePermanentDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/recycle-bin/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        // 从回收站列表中移除
        setRecycleBin(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('永久删除衣物失败:', error);
    }
  };

  const handleEmptyRecycleBin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/recycle-bin`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setRecycleBin([]);
      }
    } catch (error) {
      console.error('清空回收站失败:', error);
    }
  };

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setShowConfirmDelete(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
  };

  if (loading) {
    return (
      <div className="recycle-bin">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  return (
    <div className="recycle-bin">
      <div className="recycle-bin-header">
        <h2>🗑️ 回收站</h2>
        {recycleBin.length > 0 && (
          <button 
            className="empty-btn"
            onClick={handleEmptyRecycleBin}
          >
            清空回收站
          </button>
        )}
      </div>

      {recycleBin.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🗑️</div>
          <h3>回收站是空的</h3>
          <p>删除的衣物会显示在这里</p>
        </div>
      ) : (
        <div className="recycle-bin-content">
          <div className="recycle-bin-info">
            <p>共 {recycleBin.length} 件衣物在回收站中</p>
            <p className="warning">⚠️ 回收站中的衣物将在30天后自动永久删除</p>
          </div>
          
          <div className="recycle-bin-grid">
            {recycleBin.map(item => (
              <div key={item.id} className="recycle-bin-item">
                <div className="item-image">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} />
                  ) : (
                    <div className="placeholder-image">
                      {item.category_icon}
                    </div>
                  )}
                </div>
                
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <div className="item-meta">
                    <span className="category-tag" style={{ backgroundColor: item.category_color }}>
                      {item.category_icon} {item.category_name}
                    </span>
                    {item.color && <span className="meta-item">颜色: {item.color}</span>}
                    {item.size && <span className="meta-item">尺码: {item.size}</span>}
                    {item.brand && <span className="meta-item">品牌: {item.brand}</span>}
                    {item.price && <span className="meta-item price">¥{item.price}</span>}
                  </div>
                  
                  <div className="deleted-info">
                    <span className="deleted-date">
                      删除时间: {formatDate(item.deleted_at)}
                    </span>
                  </div>
                  
                  {item.description && (
                    <p className="description">{item.description}</p>
                  )}
                </div>
                
                <div className="item-actions">
                  <button 
                    className="restore-btn"
                    onClick={() => handleRestore(item.id)}
                  >
                    恢复
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => confirmDelete(item)}
                  >
                    永久删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 确认删除对话框 */}
      {showConfirmDelete && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <div className="confirm-header">
              <h3>确认永久删除</h3>
            </div>
            <div className="confirm-content">
              <p>您确定要永久删除 "{itemToDelete?.name}" 吗？</p>
              <p className="warning">⚠️ 此操作不可撤销！</p>
            </div>
            <div className="confirm-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowConfirmDelete(false)}
              >
                取消
              </button>
              <button 
                className="confirm-delete-btn"
                onClick={() => {
                  handlePermanentDelete(itemToDelete.id);
                  setShowConfirmDelete(false);
                }}
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecycleBin; 