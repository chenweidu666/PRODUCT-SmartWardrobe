import React, { useEffect, useState } from 'react';
import { BottomNav } from '../components/navigation/BottomNav';
import { deleteRecycleItemPermanently, emptyRecycleBin, fetchRecycleBin, restoreRecycleItem } from '../services/api';

export function RecycleBinPage({ onNavigate, token, clothingVersion, onClothingChanged, onAuthExpired }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      try {
        setLoading(true);
        setErrorMessage('');
        const data = await fetchRecycleBin(token);
        setItems(Array.isArray(data.recycleBin) ? data.recycleBin : []);
      } catch (error) {
        if (error.isAuthError) {
          onAuthExpired?.();
          return;
        }
        setErrorMessage(error.message || '加载回收站失败');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, clothingVersion, onAuthExpired]);

  const handleRestore = async (id) => {
    try {
      setBusyId(id);
      setErrorMessage('');
      await restoreRecycleItem(token, id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      onClothingChanged?.();
    } catch (error) {
      if (error.isAuthError) {
        onAuthExpired?.();
        return;
      }
      setErrorMessage(error.message || '恢复失败');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      setBusyId(id);
      setErrorMessage('');
      await deleteRecycleItemPermanently(token, id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      onClothingChanged?.();
    } catch (error) {
      if (error.isAuthError) {
        onAuthExpired?.();
        return;
      }
      setErrorMessage(error.message || '永久删除失败');
    } finally {
      setBusyId(null);
    }
  };

  const handleEmpty = async () => {
    try {
      setBusyId('all');
      setErrorMessage('');
      await emptyRecycleBin(token);
      setItems([]);
      onClothingChanged?.();
    } catch (error) {
      if (error.isAuthError) {
        onAuthExpired?.();
        return;
      }
      setErrorMessage(error.message || '清空回收站失败');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="m-page">
      <header className="m-header">
        <div className="m-header-row">
          <button className="m-btn m-btn-secondary" onClick={() => onNavigate('wardrobe-manage')}>返回</button>
          <h1 className="m-title" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', margin: 0, fontSize: 20 }}>回收站</h1>
          <button className="m-btn m-btn-danger" onClick={handleEmpty} disabled={busyId === 'all' || items.length === 0}>
            {busyId === 'all' ? '清空中...' : '清空'}
          </button>
        </div>
      </header>

      <main className="m-main">
        {!token ? (
          <section className="m-card">
            <div style={{ fontSize: 14, color: '#475569', marginBottom: 12 }}>请先登录后再查看回收站。</div>
            <button className="m-btn m-btn-primary" onClick={() => onNavigate('profile')}>去登录</button>
          </section>
        ) : null}

        {loading ? <section className="m-card">加载中...</section> : null}
        {errorMessage ? <section className="m-card" style={{ color: '#dc2626' }}>{errorMessage}</section> : null}

        {token && !loading && items.length === 0 ? (
          <section className="m-card" style={{ color: '#64748b' }}>回收站是空的。</section>
        ) : null}

        {token && !loading ? (
          <div className="m-clothing-grid">
            {items.map((item) => (
              <div key={item.id} className="m-clothing-card" style={{ textAlign: 'left', padding: 0 }}>
                <div className="m-clothing-image">
                  {item.image_url ? <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🗑️'}
                </div>
                <div className="m-clothing-info">
                  <div className="m-clothing-name">{item.name || '未命名衣物'}</div>
                  <div className="m-clothing-tags">
                    <span className="m-clothing-tag">{item.category_name || '未分类'}</span>
                    {item.deleted_at ? <span className="m-clothing-tag">删除于 {String(item.deleted_at).slice(0, 10)}</span> : null}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <button className="m-btn m-btn-secondary" style={{ flex: 1 }} onClick={() => handleRestore(item.id)} disabled={busyId === item.id}>
                      恢复
                    </button>
                    <button className="m-btn m-btn-danger" style={{ flex: 1 }} onClick={() => handleDelete(item.id)} disabled={busyId === item.id}>
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </main>

      <BottomNav active="wardrobe-manage" onNavigate={onNavigate} />
    </div>
  );
}
