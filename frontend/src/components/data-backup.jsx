import React, { useState, useEffect } from 'react';
import { getApiBaseUrl, authenticatedFetch } from '../utils/api';
import './data-backup.css';

function DataBackup({ userId, token }) {
  const [backupStatus, setBackupStatus] = useState('');
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [deletingBackup, setDeletingBackup] = useState(null);
  const [backupHistory, setBackupHistory] = useState([]);
  const [backupStats, setBackupStats] = useState({
    lastBackup: '暂无备份',
    backupCount: 0,
    databaseSize: '0 MB'
  });

  // 组件加载时获取备份历史
  useEffect(() => {
    fetchBackupHistory();
  }, [token]);

  // 获取备份历史
  const fetchBackupHistory = async () => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/backup/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        const backups = data.backups || [];
        setBackupHistory(backups);
        
        // 更新备份统计信息
        if (backups.length > 0) {
          const latestBackup = backups[0];
          setBackupStats({
            lastBackup: latestBackup.date,
            backupCount: backups.length,
            databaseSize: latestBackup.size
          });
        } else {
          setBackupStats({
            lastBackup: '暂无备份',
            backupCount: 0,
            databaseSize: '0 MB'
          });
        }
      } else {
        console.error('获取备份历史失败:', data.message);
      }
    } catch (error) {
      console.error('获取备份历史错误:', error);
      setBackupStatus('获取备份历史失败：网络错误');
      setTimeout(() => setBackupStatus(''), 3000);
    }
  };

  // 备份处理函数
  const handleBackup = async () => {
    setIsBackingUp(true);
    setBackupStatus('正在备份...');
    
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/backup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setBackupStatus('备份成功！');
        setTimeout(() => setBackupStatus(''), 3000);
        fetchBackupHistory();
      } else {
        setBackupStatus('备份失败：' + data.message);
      }
    } catch (error) {
      setBackupStatus('备份失败：网络错误');
      console.error('备份错误:', error);
    } finally {
      setIsBackingUp(false);
    }
  };

  // 删除备份函数
  const handleDeleteBackup = async (timestamp) => {
    if (!window.confirm('确定要删除这个备份吗？此操作不可恢复。')) {
      return;
    }
    
    setDeletingBackup(timestamp);
    setBackupStatus('正在删除...');
    
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/backup/${timestamp}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setBackupStatus('备份删除成功！');
        setTimeout(() => setBackupStatus(''), 3000);
        
        // 立即更新本地状态，然后重新获取数据
        setBackupHistory(prev => prev.filter(backup => backup.timestamp !== timestamp));
        
        // 延迟重新获取完整数据以确保同步
        setTimeout(() => {
          fetchBackupHistory();
        }, 500);
      } else {
              setBackupStatus('删除失败：' + (data.message || '未知错误'));
      setTimeout(() => setBackupStatus(''), 5000);
    }
  } catch (error) {
    console.error('删除备份错误:', error);
    setBackupStatus('删除失败：网络错误');
    setTimeout(() => setBackupStatus(''), 5000);
  } finally {
    setDeletingBackup(null);
  }
};

  return (
    <div className="data-backup-page">
      <div className="page-header">
        <h2>💾 数据备份</h2>
        <p>定期备份您的衣物数据，确保数据安全</p>
      </div>

      <div className="backup-content">
        <div className="backup-info">
          <div className="backup-stats">
            <div className="stat-item">
              <span className="stat-label">数据库大小</span>
              <span className="stat-value">{backupStats.databaseSize}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">上次备份</span>
              <span className="stat-value">{backupStats.lastBackup}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">备份数量</span>
              <span className="stat-value">{backupStats.backupCount} 个</span>
            </div>
          </div>
        </div>
        
        <div className="backup-actions">
          <button className="backup-btn" onClick={handleBackup} disabled={isBackingUp}>
            <span className="btn-icon">{isBackingUp ? '⏳' : '💾'}</span>
            {isBackingUp ? '备份中...' : '立即备份'}
          </button>
          {backupStatus && (
            <div className="backup-status">
              {backupStatus}
            </div>
          )}
          <button className="restore-btn">
            <span className="btn-icon">🔄</span>
            恢复数据
          </button>
        </div>
        
        <div className="backup-history">
          <h4>备份历史</h4>
          <div className="backup-list">
            {backupHistory.length > 0 ? (
              backupHistory.map((backup, index) => (
                <div key={index} className="backup-item">
                  <div className="backup-info">
                    <span className="backup-date">{backup.date}</span>
                    <span className="backup-size">{backup.size}</span>
                    <span className="backup-stats">
                      {backup.clothingCount} 件衣物 | ¥{backup.totalValue}
                    </span>
                  </div>
                  <div className="backup-item-actions">
                    <button className="restore-item-btn">恢复</button>
                    <button 
                      className="delete-backup-btn"
                      onClick={() => handleDeleteBackup(backup.timestamp)}
                      disabled={deletingBackup === backup.timestamp}
                    >
                      {deletingBackup === backup.timestamp ? '删除中...' : '删除'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-backup">
                <p>暂无备份记录</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataBackup; 