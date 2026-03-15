import React, { useState } from 'react';
import { BottomNav } from './BottomNav';

export function WardrobeDetailPage({ onNavigate, itemId }) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="m-page">
      <header className="m-header">
        <div className="m-header-row">
          <button className="m-btn m-btn-secondary" onClick={() => onNavigate('wardrobe-manage')}>返回</button>
          <h1 className="m-title" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', margin: 0, fontSize: 20 }}>
            {editing ? '编辑衣物' : '衣物详情'}
          </h1>
          <button className="m-btn m-btn-secondary" onClick={() => setEditing((v) => !v)}>{editing ? '完成' : '编辑'}</button>
        </div>
      </header>

      <main className="m-main">
        <section className="m-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="m-clothing-image" style={{ fontSize: 96 }}>🧥</div>
        </section>

        <section className="m-card">
          <div className="m-section-title">基本信息</div>
          <label className="m-label">分类</label>
          <input className="m-input" defaultValue="羽绒服" disabled={!editing} />
          <label className="m-label" style={{ marginTop: 10 }}>名称</label>
          <input className="m-input" defaultValue={`速写羽绒服 #${itemId || 1}`} disabled={!editing} />
          <div className="m-grid-2" style={{ marginTop: 10 }}>
            <div><label className="m-label">颜色</label><input className="m-input" defaultValue="黑色" disabled={!editing} /></div>
            <div><label className="m-label">尺码</label><input className="m-input" defaultValue="XXL" disabled={!editing} /></div>
          </div>

          <div className="m-section-title" style={{ marginTop: 16 }}>购买信息</div>
          <div className="m-grid-2">
            <div><label className="m-label">价格</label><input className="m-input" defaultValue="1497" disabled={!editing} /></div>
            <div><label className="m-label">日期</label><input className="m-input" defaultValue="2024-11-20" disabled={!editing} /></div>
          </div>

          <label className="m-label" style={{ marginTop: 10 }}>备注</label>
          <textarea className="m-textarea" defaultValue="通勤外套，洗涤时注意水温。" disabled={!editing} />
        </section>

        {editing ? (
          <button className="m-btn m-btn-primary" style={{ width: '100%' }} onClick={() => setEditing(false)}>保存修改</button>
        ) : (
          <button className="m-btn m-btn-danger" style={{ width: '100%' }} onClick={() => onNavigate('wardrobe-manage')}>删除衣物</button>
        )}
      </main>

      <BottomNav active="wardrobe-detail" onNavigate={onNavigate} />
    </div>
  );
}

