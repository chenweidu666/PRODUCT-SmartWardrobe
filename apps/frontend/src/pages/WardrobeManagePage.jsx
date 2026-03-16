import React, { useEffect, useMemo, useState } from 'react';
import { BottomNav } from '../components/navigation/BottomNav';
import { fetchClothingList } from '../services/api';

export function WardrobeManagePage({ onNavigate, token, clothingVersion, onAuthExpired }) {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [activeStatus, setActiveStatus] = useState('pending');
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
    return items.filter((item) => {
      const matchCategory = activeCategory === '全部' || (item.category_name || '未分类') === activeCategory;
      const processed = Number(item.is_processed) === 1;
      const matchStatus =
        activeStatus === 'all' ||
        (activeStatus === 'processed' && processed) ||
        (activeStatus === 'pending' && !processed);
      return matchCategory && matchStatus;
    });
  }, [activeCategory, activeStatus, items]);

  return (
    <div className="m-page">
      <header className="m-header">
        <div className="m-header-row">
          <button className="m-btn m-btn-secondary" onClick={() => onNavigate('home')}>返回</button>
          <h1 className="m-title" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', margin: 0, fontSize: 20 }}>衣服管理</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="m-btn m-btn-secondary" onClick={() => onNavigate('wardrobe-recycle')}>回收站</button>
            <button
              className={`m-btn ${activeStatus === 'processed' ? 'm-btn-primary' : 'm-btn-secondary'}`}
              onClick={() => setActiveStatus((prev) => (prev === 'processed' ? 'pending' : 'processed'))}
            >
              {activeStatus === 'processed' ? '未处理' : '已处理'}
            </button>
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
          <>
            <div className="m-card" style={{ marginBottom: 12 }}>
              <label className="m-label" style={{ marginBottom: 8 }}>分类筛选</label>
              <select className="m-select" value={activeCategory} onChange={(event) => setActiveCategory(event.target.value)}>
                {categories.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
          </>
        ) : null}

        {!loading && token && list.length === 0 ? (
          <section className="m-card" style={{ color: '#64748b' }}>
            当前筛选条件下暂无衣物。
          </section>
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
