import React, { useEffect, useMemo, useState } from 'react';
import { BottomNav } from '../components/navigation/BottomNav';
import { fetchClothingList } from '../services/api';

export function WardrobeManagePage({ onNavigate, token, clothingVersion, onAuthExpired }) {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      try {
        setLoading(true);
        setErrorMessage('');
        const data = await fetchClothingList(token);
        setItems(Array.isArray(data.clothing) ? data.clothing : []);
      } catch (error) {
        if (error.isAuthError) {
          onAuthExpired?.();
          return;
        }
        setErrorMessage(error.message || '加载衣物失败');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, clothingVersion, onAuthExpired]);

  const categories = useMemo(() => {
    const names = new Set(['全部']);
    items.forEach((item) => names.add(item.category_name || '未分类'));
    return Array.from(names);
  }, [items]);

  const list = useMemo(() => {
    if (activeCategory === '全部') return items;
    return items.filter((item) => (item.category_name || '未分类') === activeCategory);
  }, [activeCategory, items]);

  return (
    <div className="m-page">
      <header className="m-header">
        <div className="m-header-row">
          <button className="m-btn m-btn-secondary" onClick={() => onNavigate('home')}>返回</button>
          <h1 className="m-title" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', margin: 0, fontSize: 20 }}>衣服管理</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="m-btn m-btn-secondary" onClick={() => onNavigate('wardrobe-recycle')}>回收站</button>
            <button className="m-btn m-btn-primary" onClick={() => onNavigate('wardrobe-add')}>添加</button>
          </div>
        </div>
      </header>

      <main className="m-main">
        {!token ? (
          <section className="m-card">
            <div style={{ fontSize: 14, color: '#475569', marginBottom: 12 }}>请先登录后再查看衣物列表。</div>
            <button className="m-btn m-btn-primary" onClick={() => onNavigate('profile')}>去登录</button>
          </section>
        ) : null}

        {token ? (
          <div className="m-chip-row">
            {categories.map((item) => (
              <button key={item} className={`m-chip ${activeCategory === item ? 'active' : ''}`} onClick={() => setActiveCategory(item)}>
                {item}
              </button>
            ))}
          </div>
        ) : null}

        {loading ? <section className="m-card">加载中...</section> : null}
        {errorMessage ? <section className="m-card" style={{ color: '#dc2626' }}>{errorMessage}</section> : null}

        {token && !loading ? (
          <div className="m-clothing-grid">
            {list.map((item) => (
              <button
                key={item.id}
                className="m-clothing-card"
                onClick={() => onNavigate('wardrobe-detail', item.id)}
                style={{ textAlign: 'left', padding: 0 }}
              >
                <div className="m-clothing-image">
                  {item.image_url ? <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👕'}
                </div>
                <div className="m-clothing-info">
                  <div className="m-clothing-name">{item.name || '未命名衣物'}</div>
                  <div className="m-clothing-tags">
                    <span className={`m-clothing-tag ${Number(item.is_processed) === 1 ? 'm-clothing-tag-processed' : 'm-clothing-tag-pending'}`}>
                      {Number(item.is_processed) === 1 ? '已处理' : '未处理'}
                    </span>
                    <span className="m-clothing-tag m-clothing-tag-category">{item.category_name || '未分类'}</span>
                    {item.color ? <span className="m-clothing-tag m-clothing-tag-attr">{item.color}</span> : null}
                    {item.size ? <span className="m-clothing-tag m-clothing-tag-attr">{item.size}</span> : null}
                    <span className="m-clothing-tag m-clothing-tag-price">
                      {Number.isFinite(Number(item.price)) && Number(item.price) > 0 ? `¥${Number(item.price).toFixed(2)}` : '未设置价格'}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : null}
      </main>

      <BottomNav active="wardrobe-manage" onNavigate={onNavigate} />
    </div>
  );
}
