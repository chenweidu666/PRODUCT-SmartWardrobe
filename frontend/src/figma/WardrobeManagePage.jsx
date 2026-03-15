import React, { useMemo, useState } from 'react';
import { BottomNav } from './BottomNav';

const CATEGORIES = ['全部', '外套', '上衣', '裤子', '裙装', '配饰'];

const ITEMS = [
  { id: 1, name: '速写羽绒服', category: '外套', detail: '黑色 · XXL', image: '🧥' },
  { id: 2, name: '优衣库毛衣', category: '上衣', detail: '灰色 · L', image: '👔' },
  { id: 3, name: 'Nike 运动裤', category: '裤子', detail: '蓝色 · M', image: '👖' },
  { id: 4, name: 'H&M 连衣裙', category: '裙装', detail: '红色 · S', image: '👗' },
  { id: 5, name: '羊绒围巾', category: '配饰', detail: '米色 · F', image: '🧣' },
  { id: 6, name: 'Columbia 冲锋衣', category: '外套', detail: '军绿 · L', image: '🧥' },
];

export function WardrobeManagePage({ onNavigate }) {
  const [activeCategory, setActiveCategory] = useState('全部');

  const list = useMemo(() => {
    if (activeCategory === '全部') return ITEMS;
    return ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="m-page">
      <header className="m-header">
        <div className="m-header-row">
          <button className="m-btn m-btn-secondary" onClick={() => onNavigate('home')}>返回</button>
          <h1 className="m-title" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', margin: 0, fontSize: 20 }}>衣服管理</h1>
          <button className="m-btn m-btn-primary" onClick={() => onNavigate('wardrobe-add')}>添加</button>
        </div>
      </header>

      <main className="m-main">
        <div className="m-chip-row">
          {CATEGORIES.map((item) => (
            <button key={item} className={`m-chip ${activeCategory === item ? 'active' : ''}`} onClick={() => setActiveCategory(item)}>
              {item}
            </button>
          ))}
        </div>

        <div className="m-clothing-grid">
          {list.map((item) => (
            <button
              key={item.id}
              className="m-clothing-card"
              onClick={() => onNavigate('wardrobe-detail', item.id)}
              style={{ textAlign: 'left', padding: 0 }}
            >
              <div className="m-clothing-image">{item.image}</div>
              <div className="m-clothing-info">
                <div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{item.detail}</div>
              </div>
            </button>
          ))}
        </div>
      </main>

      <BottomNav active="wardrobe-manage" onNavigate={onNavigate} />
    </div>
  );
}

