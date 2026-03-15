import React from 'react';
import { BottomNav } from './BottomNav';

export function HomePage({ onNavigate }) {
  return (
    <div className="m-page">
      <header className="m-header">
        <h1 className="m-title">智能衣橱</h1>
        <p className="m-subtitle">让穿搭更简单，让生活更优雅</p>
      </header>

      <main className="m-main">
        <section className="m-card" style={{ background: 'linear-gradient(135deg,#eff6ff,#ecfeff)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="m-section-title">今日天气</div>
              <div style={{ color: '#64748b', fontSize: 13 }}>根据天气智能推荐穿搭</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 30, fontWeight: 700, color: '#2563eb' }}>22°</div>
              <div style={{ color: '#64748b', fontSize: 12 }}>多云</div>
            </div>
          </div>
        </section>

        <section className="m-card" style={{ background: 'linear-gradient(135deg,#faf5ff,#fdf2f8)' }}>
          <div className="m-section-title">AI 穿搭推荐</div>
          <div className="m-grid-2" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            <div className="m-clothing-image" style={{ borderRadius: 10, fontSize: 36, background: '#fff' }}>👔</div>
            <div className="m-clothing-image" style={{ borderRadius: 10, fontSize: 36, background: '#fff' }}>👖</div>
            <div className="m-clothing-image" style={{ borderRadius: 10, fontSize: 36, background: '#fff' }}>👟</div>
          </div>
          <button className="m-btn m-btn-primary" style={{ width: '100%', marginTop: 12 }}>查看完整搭配</button>
        </section>

        <section className="m-card" style={{ background: 'linear-gradient(135deg,#ecfdf5,#f0fdf4)' }}>
          <div className="m-section-title">我的衣橱数据</div>
          <div className="m-grid-2" style={{ gridTemplateColumns: 'repeat(3,1fr)', textAlign: 'center' }}>
            <div><div style={{ fontSize: 24, fontWeight: 700 }}>127</div><div className="m-subtitle">总件数</div></div>
            <div><div style={{ fontSize: 24, fontWeight: 700 }}>8</div><div className="m-subtitle">本月新增</div></div>
            <div><div style={{ fontSize: 24, fontWeight: 700 }}>15</div><div className="m-subtitle">本周穿戴</div></div>
          </div>
        </section>

        <div className="m-grid-2">
          <button className="m-btn m-btn-secondary" onClick={() => onNavigate('wardrobe-manage')}>浏览衣柜</button>
          <button className="m-btn m-btn-primary" onClick={() => onNavigate('wardrobe-add')}>添加衣物</button>
        </div>
      </main>

      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  );
}

